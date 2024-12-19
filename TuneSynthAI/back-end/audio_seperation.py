import os
import torch
import torchaudio
from demucs import pretrained
from demucs.apply import apply_model
from tqdm import tqdm
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route("/separate_audio", methods=["POST"])
def separate_audio_endpoint():
    """
    Flask endpoint to separate an audio file into components using Demucs.

    Request:
        - input_file: The audio file to process (multipart/form-data).

    Returns:
        - JSON response indicating success or failure.
    """
    try:
        # Debug: Check if file exists in the request
        if 'input_file' not in request.files:
            print("Debug: No file part in the request.")
            return jsonify({"error": "No file part in the request"}), 400

        input_file = request.files['input_file']
        if input_file.filename == '':
            print("Debug: No file selected by the user.")
            return jsonify({"error": "No selected file"}), 400

        # Debug: Log the file details
        print(f"Debug: Received file - {input_file.filename}")
        file_size = len(input_file.read())
        input_file.seek(0)  # Reset file pointer after reading
        print(f"Debug: File size - {file_size} bytes")

        # Define output directory
        output_dir = "separated_audio"
        os.makedirs(output_dir, exist_ok=True)

        # Save the input file temporarily
        temp_input_path = os.path.join(output_dir, input_file.filename)
        input_file.save(temp_input_path)
        print(f"Debug: File saved temporarily at {temp_input_path}")

        # Load pre-trained Demucs model
        print("Debug: Loading pre-trained Demucs model...")
        model = pretrained.get_model('htdemucs')

        # Load the audio file
        print("Debug: Loading audio file for processing...")
        wav, sr = torchaudio.load(temp_input_path)

        # Ensure the audio is mono or stereo
        if wav.shape[0] > 2:
            raise ValueError("Input audio must be mono or stereo.")
        print(f"Debug: Audio channels - {wav.shape[0]}, Sample rate - {sr}")

        # Resample to 44.1kHz if necessary
        if sr != 44100:
            print("Debug: Resampling audio to 44.1kHz...")
            resampler = torchaudio.transforms.Resample(orig_freq=sr, new_freq=44100)
            wav = resampler(wav)

        # Normalize the waveform
        print("Debug: Normalizing audio...")
        wav = wav / wav.abs().max()

        # Move to device
        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        print(f"Debug: Using device - {device}")
        model.to(device)
        wav = wav.to(device)

        # Add batch dimension (Demucs expects input as [batch, channels, time])
        wav = wav.unsqueeze(0)

        # Apply Demucs with progress visualization
        print("Debug: Applying Demucs model for source separation...")
        with tqdm(total=100, desc="Separating audio") as pbar:
            sources = apply_model(model, wav, split=True, overlap=0.25)
            pbar.update(100)

        # Remove batch dimension and move to CPU
        sources = sources.squeeze(0).cpu()

        # Save separated sources
        sources_dir = os.path.join(output_dir, os.path.splitext(input_file.filename)[0])
        os.makedirs(sources_dir, exist_ok=True)
        print(f"Debug: Saving separated tracks to {sources_dir}")

        track_urls = []  # To store URLs or paths of saved files
        for idx, (track, source) in tqdm(
            enumerate(zip(['drums', 'bass', 'vocals', 'other'], sources)), desc="Saving components"
        ):
            output_path = os.path.join(sources_dir, f"{track}.wav")
            torchaudio.save(output_path, source, 44100)
            print(f"Debug: Saved track - {output_path}")
            track_urls.append({"name": track, "url": output_path})

        print(f"Debug: Processing complete. Tracks saved in {sources_dir}")
        return jsonify({"message": "Audio successfully separated", "tracks": track_urls}), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    print("Debug: Starting Flask server...")
    app.run(debug=True)
