import React, { useState } from "react";
import "./sapp.css"; // Make sure to include the CSS file with the updated styles

const MusicGenerator = () => {
  const [prompt, setPrompt] = useState(""); // State to hold the prompt input
  const [loading, setLoading] = useState(false); // State to indicate loading
  const [audioUrl, setAudioUrl] = useState(null); // State to store the audio URL for playback/download

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
  };

  const generateMusic = async () => {
    if (!prompt) {
      alert("Please enter a prompt!");
      return;
    }

    try {
      setLoading(true);
      setAudioUrl(null);

      // Send POST request to Flask server with the prompt
      const response = await fetch("http://127.0.0.1:5000/generate-music", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate music.");
      }

      // Process the audio response
      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);
      setAudioUrl(audioUrl);
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while generating music.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="music-generator-container">
      <h1 className="music-generator-title">Music Generator</h1>

      <div className="input-container">
        <input
          type="text"
          value={prompt}
          onChange={handlePromptChange}
          placeholder="Enter a prompt for the music"
          className="input-prompt" // Updated class for styling
        />
      </div>

      <div className="button-container">
        <button
          onClick={generateMusic}
          disabled={loading}
          className="generate-button"
        >
          {loading ? "Generating..." : "Generate Music"}
        </button>
      </div>

      {loading && (
        <p className="loading-text">Generating music, please wait...</p>
      )}

      {audioUrl && (
        <div className="audio-container">
          <h3>Audio Ready!</h3>
          <audio controls>
            <source src={audioUrl} type="audio/mp3" />
            Your browser does not support the audio element.
          </audio>
          <a
            href={audioUrl}
            download="generated_music.mp3"
            className="download-link"
          >
            Download Generated Music
          </a>
        </div>
      )}
    </div>
  );
};

export default MusicGenerator;
