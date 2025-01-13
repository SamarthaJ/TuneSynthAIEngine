import React, { useState } from "react";
import "./sapp.css";

const SAPP = () => {
  // State to hold the user input prompt for music generation
  const [prompt, setPrompt] = useState("");

  // State to indicate if the generation process is in progress
  const [loading, setLoading] = useState(false);

  // State to store the URL of the generated audio for playback/download
  const [audioUrl, setAudioUrl] = useState(null);

  // Handles changes to the input prompt
  const handlePromptChange = (e) => {
    setPrompt(e.target.value); // Updates the state with the current input value
  };

  // Function to trigger the music generation process
  const generateMusic = async () => {
    if (!prompt) {
      // Alerts the user if the input is empty
      alert("Please enter a prompt!");
      return;
    }

    try {
      // Sets the loading state to true and resets the audio URL
      setLoading(true);
      setAudioUrl(null);

      // Sends a POST request to the Flask server with the user prompt
      const response = await fetch("http://127.0.0.1:5000/generate-music", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Specifies the request body format
        },
        body: JSON.stringify({ prompt }), // Converts the prompt into a JSON payload
      });

      if (!response.ok) {
        // Handles any non-200 response
        throw new Error("Failed to generate music.");
      }

      // Processes the response and generates a blob URL for the audio
      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);
      setAudioUrl(audioUrl); // Updates the state with the audio URL
    } catch (error) {
      // Logs the error and alerts the user in case of failure
      console.error("Error:", error);
      alert("An error occurred while generating music.");
    } finally {
      // Resets the loading state regardless of success or failure
      setLoading(false);
    }
  };

  return (
    <div className="music-generator-container">
      {/* Main Title */}
      <h1 className="music-generator-title">Music Generator</h1>

      {/* Input field for the music prompt */}
      <div className="input-container">
        <input
          type="text"
          value={prompt}
          onChange={handlePromptChange} // Updates state on input change
          placeholder="Enter a prompt for the music" // Placeholder text for guidance
          className="input-prompt"
        />
      </div>

      {/* Button to trigger the music generation */}
      <div className="button-container">
        <button
          onClick={generateMusic} // Calls the generateMusic function
          disabled={loading} // Disables the button during loading
          className="generate-button"
        >
          {loading ? "Generating..." : "Generate Music"} {/* Updates button text dynamically */}
        </button>
      </div>

      {/* Loading message displayed during processing */}
      {loading && <p className="loading-text">Generating music, please wait...</p>}

      {/* Section to display and download the generated audio */}
      {audioUrl && (
        <div className="audio-container">
          <h3>Audio Ready!</h3>
          {/* Audio player for playback */}
          <audio controls>
            <source src={audioUrl} type="audio/mp3" />
            Your browser does not support the audio element.
          </audio>
          {/* Download link for the audio */}
          <a href={audioUrl} download="generated_music.mp3" className="download-link">
            Download Generated Music
          </a>
        </div>
      )}
    </div>
  );
};

export default SAPP;
