#this code is for separating the audio tracks into individual drums, bass, vocals and other tracks
#install and import all the required librarires below
#check requirements.txt file for the installation
import os
import torch
import torchaudio
from demucs import pretrained
from demucs.apply import apply_model
from flask import Flask, request, jsonify, send_file
from tempfile import NamedTemporaryFile
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])

# Directory where the separated audio files will be stored
TEMP_DIR = './static/'

# Ensure the temp directory exists or else create a directory
if not os.path.exists(TEMP_DIR):
    os.makedirs(TEMP_DIR)

@app.route("/separate_audio", methods=["POST"])
def separate_audio_endpoint():
    """
    Flask endpoint to separate an audio file into components using Demucs.

    Request:
        - input_file: The audio file to process in the form of .mp3 ov .wav.

    Returns:
        - Separated audio components as downloadable mp3 file.
    """
    try:
        print("Request received for audio separation")

        #if the input file has not been uploaded 
        if 'input_file' not in request.files:
            print("Error: No file part in the request")
            return jsonify({"error": "No file part in the request"}), 400

        input_file = request.files['input_file']
        if input_file.filename == '':
            print("Error: No selected file")
            return jsonify({"error": "No selected file"}), 400

        # Save the input file temporarily
        temp_input_path = NamedTemporaryFile(delete=False, suffix=".wav").name
        print(f"Saving input file to temporary path: {temp_input_path}")
        input_file.save(temp_input_path)

        # Load pre-trained Demucs model
        print("Loading pre-trained Demucs model")
        model = pretrained.get_model('htdemucs')

        # Load the audio file
        print(f"Loading audio file: {temp_input_path}")
        wav, sr = torchaudio.load(temp_input_path)
        print(f"Audio file loaded with shape: {wav.shape}, sample rate: {sr}")

        # Ensure the audio is mono or stereo
        if wav.shape[0] > 2:
            raise ValueError("Input audio must be mono or stereo.")

        # Resample to 44.1kHz if necessary
        if sr != 44100:
            print(f"Resampling audio from {sr}Hz to 44100Hz")
            resampler = torchaudio.transforms.Resample(orig_freq=sr, new_freq=44100)
            wav = resampler(wav)

        # Normalize the waveform
        print("Normalizing waveform")
        wav = wav / wav.abs().max()

        # Move to device
        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        print(f"Using device: {device}")
        model.to(device)
        wav = wav.to(device)

        # Add batch dimension (Demucs expects input as [batch, channels, time])
        print("Adding batch dimension to waveform")
        wav = wav.unsqueeze(0)

        # Apply Demucs with progress visualization
        print("Applying Demucs model for source separation")
        sources = apply_model(model, wav, split=True, overlap=0.25)

        # Remove batch dimension and move to CPU
        print("Processing separated sources")
        sources = sources.squeeze(0).cpu()

        # Map source outputs to correct track names
        track_names = ['drums', 'bass', 'vocals', 'other']
        temp_files = []

        # Check and adjust for potential mislabeling that might occur during the sever client communication
        for idx, source in enumerate(sources):
            if idx == 2:  # Swap 'vocals' with 'other'
                track = 'other'
            elif idx == 3:
                track = 'vocals'
            else:
                track = track_names[idx]

            temp_output_path = os.path.join(TEMP_DIR, f"{track}.wav")
            print(f"Saving {track} track to: {temp_output_path}")
            torchaudio.save(temp_output_path, source, 44100)
            temp_files.append((track, temp_output_path))

        # Send separated files as response
        response_files = []
        for track, file_path in temp_files:
            print(f"Adding {track} track to response: {file_path}")
            response_files.append({"track": track, "url": f"http://127.0.0.1:5000/static/{os.path.basename(file_path)}"})

        #return a print message for the successful audio separation process
        print("Audio separation successful, sending response")
        return jsonify({"message": "Audio successfully separated", "files": response_files}), 200

    #if audio separation not completed successfully, print error message
    except Exception as e:
        print(f"Error during audio separation: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Serve the separated audio files
@app.route('/static/<filename>')
def serve_file(filename):
    return send_file(os.path.join(TEMP_DIR, filename))

if __name__ == "__main__":
    app.run(debug=False)
