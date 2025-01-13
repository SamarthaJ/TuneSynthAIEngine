#this code is to convert the midi to wav files if needed as the model does not accept midi files
from midi2audio import FluidSynth
import os

def midi_to_wav(midi_path, output_path, soundfont_path):
    """
    Convert a MIDI file to WAV format using FluidSynth.

    Args:
        midi_path (str): Path to the MIDI file.
        output_path (str): Path to save the converted WAV file.
        soundfont_path (str): Path to the SoundFont (.sf2) file.
    """
    try:
        # Initialize FluidSynth with the SoundFont
        fs = FluidSynth(soundfont_path)

        # Convert MIDI to WAV
        print(f"[INFO] Converting MIDI to WAV: {midi_path}")
        fs.midi_to_audio(midi_path, output_path)
        print(f"[SUCCESS] Converted WAV file saved at: {output_path}")
    except Exception as e:
        print(f"[ERROR] Failed to convert MIDI: {e}")

# Main function for standalone testing
if __name__ == "__main__":
    # Input MIDI file path
    input_midi_path = r"./midi/new.mid"  # Replace with your MIDI file path
    # Output WAV file path
    output_wav_path = r"./midi/new.wav"  # Replace with desired WAV file path

    # Path to the SoundFont file (.sf2)
    soundfont_path = r"./GeneralUser-GS.sf2"  # Replace with your SoundFont path

    # Convert MIDI to WAV
    midi_to_wav(input_midi_path, output_wav_path, soundfont_path)
