import React, { useState } from "react";
import axios from "axios";
import FileUpload from "./FileUpload";
import ActionButtons from "./ActionButtons";
import OutputDisplay from "./OutputDisplay";
import "./home.css";

const Home = () => {
  const [musicFile, setMusicFile] = useState(null);
  const [output, setOutput] = useState("");
  const [tracks, setTracks] = useState([]);

  const handleFileChange = (file) => {
    setMusicFile(file);
  };

  const handleComposeTrack = () => {
    setOutput("Compose Track feature coming soon!");
  };

  const handleExtractInstrumentals = async () => {
    if (!musicFile) {
      setOutput("Please upload a music file first!");
      return;
    }

    const formData = new FormData();
    formData.append("input_file", musicFile);

    try {
      setOutput("Uploading and processing the file. Please wait...");

      const response = await axios.post(
        "http://127.0.0.1:5000/separate_audio",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const { files } = response.data; // Assuming Flask returns track details
      setTracks(files);
      setOutput("Audio separation successful! Check the outputs below.");
    } catch (error) {
      setOutput("Failed to process the file. Please try again.");
      console.error("Error " + error);
    }
  };

  return (
    <div className="app">
      <h1>TuneSynthAI</h1>
      <FileUpload onFileChange={handleFileChange} />
      <ActionButtons
        onComposeTrack={handleComposeTrack}
        onExtractInstrumentals={handleExtractInstrumentals}
      />
      <OutputDisplay output={output} />
      {tracks.length > 0 && (
        <div className="track-list">
          <h2>Separated Tracks:</h2>
          <ul>
            {tracks.map((track) => (
              <li key={track.track}>
                <p>{track.track}</p>
                <audio controls>
                  <source src={track.url} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
                <a href={track.url} download>
                  Download {track.track}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Home;
