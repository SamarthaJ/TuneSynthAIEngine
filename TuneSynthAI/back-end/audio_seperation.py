import os
import torch
import torchaudio
from demucs import pretrained
from demucs.apply import apply_model
from tqdm import tqdm

def separate_audio(input_file: str, output_dir: str):
    """
    Separates an audio file into its components using Demucs, with CLI progress visualization.

    Args:
        input_file (str): Path to the input audio file.
        output_dir (str): Directory to save the separated audio components.
    """
    try:
        print(f"Preparing to process file: {input_file}")
        # Ensure output directory exists
        os.makedirs(output_dir, exist_ok=True)

        print("Loading pre-trained Demucs model...")
        # Load the pre-trained Demucs model
        model = pretrained.get_model('htdemucs')

        print("Loading the audio file...")
        # Load the audio file
        wav, sr = torchaudio.load(input_file)

        # Ensure the audio is mono or stereo
        if wav.shape[0] > 2:
            raise ValueError("Input audio must be mono or stereo.")

        print("Checking and adjusting sample rate if necessary...")
        # Resample to 44.1kHz if necessary
        if sr != 44100:
            resampler = torchaudio.transforms.Resample(orig_freq=sr, new_freq=44100)
            wav = resampler(wav)

        # Normalize the waveform
        print("Normalizing audio...")
        wav = wav / wav.abs().max()

        print("Preparing the model for computation...")
        # Move to device
        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        model.to(device)
        wav = wav.to(device)

        # Add batch dimension (Demucs expects input as [batch, channels, time])
        wav = wav.unsqueeze(0)

        print("Applying Demucs model for source separation...")
        # Apply Demucs with progress visualization
        with tqdm(total=100, desc="Separating audio") as pbar:
            sources = apply_model(model, wav, split=True, overlap=0.25)
            pbar.update(100)

        print("Post-processing and saving the results...")
        # Remove batch dimension and move to CPU
        sources = sources.squeeze(0).cpu()

        # Save separated sources
        sources_dir = os.path.join(output_dir, os.path.splitext(os.path.basename(input_file))[0])
        os.makedirs(sources_dir, exist_ok=True)

        for idx, (track, source) in tqdm(
            enumerate(zip(['drums', 'bass', 'vocals', 'other'], sources)), desc="Saving components"
        ):
            # source[idx] will be of shape [channels, time]
            source_audio = source.squeeze(0)  # Ensure it's 2D for saving
            output_path = os.path.join(sources_dir, f"{track}.wav")
            torchaudio.save(output_path, source_audio, 44100)
            print(f"Saved: {output_path}")

        print(f"Audio separated and saved in: {sources_dir}")

    except Exception as e:
        print(f"Failed to process audio: {e}")

if __name__ == "__main__":
    input_audio_path = r"./wav format/alb_esp1.wav"  # Replace with your audio file path
    output_directory = "separated_audio"

    separate_audio(input_audio_path, output_directory)
