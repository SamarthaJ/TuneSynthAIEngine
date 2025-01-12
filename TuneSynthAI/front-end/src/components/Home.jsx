import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook
import axios from "axios";
import FileUpload from "./FileUpload";
import ActionButtons from "./ActionButtons";
import OutputDisplay from "./OutputDisplay";
import "./home.css";

const HomePage = () => {
  const [musicFile, setMusicFile] = useState(null);
  const [output, setOutput] = useState("");
  const [tracks, setTracks] = useState([]);
  const navigate = useNavigate(); // Initialize the navigate function

  const handleFileChange = (file) => {
    setMusicFile(file);
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

  // Function to navigate to the SAPP page when the user clicks "Compose Track"
  const handleNavigateToComposeTrack = () => {
    setOutput("Redirecting to the Compose Track page...");
    navigate("/Generation"); // This will take the user to the SAPP page
  };

  return (
    <div className="app">
      <h1>TuneSynthAI</h1>
        <FileUpload onFileChange={handleFileChange} />
        <ActionButtons
          onExtractInstrumentals={handleExtractInstrumentals}
          onNavigateToComposeTrack={handleNavigateToComposeTrack}
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

export default HomePage;
