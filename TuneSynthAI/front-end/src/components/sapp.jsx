import React, { useState } from "react";

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
    <div>
      <h1>Music Generator</h1>
      <div>
        <input
          type="text"
          value={prompt}
          onChange={handlePromptChange}
          placeholder="Enter a prompt for the music"
        />
        <div>
          <button onClick={generateMusic} disabled={loading}>
            {loading ? "Generating..." : "Generate Music"}
          </button>
        </div>
      </div>

      {loading && <p>Generating music, please wait...</p>}

      {audioUrl && (
        <div>
          <h3>Audio Ready!</h3>
          <audio controls>
            <source src={audioUrl} type="audio/mp3" />
            Your browser does not support the audio element.
          </audio>
          <a href={audioUrl} download="generated_music.mp3">
            Download Generated Music
          </a>
        </div>
      )}
    </div>
  );
};

export default MusicGenerator;
