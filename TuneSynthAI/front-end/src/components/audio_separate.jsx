import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./separateAudio.css";

const SeparateAudio = () => {
  const [musicFile, setMusicFile] = useState(null);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [separatedTracks, setSeparatedTracks] = useState([]);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setMusicFile(file);
      setOutput("");
    }
  };

  const handleUpload = async () => {
    if (!musicFile) {
      setOutput("Please select a music file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("input_file", musicFile);

    try {
      setLoading(true);
      setOutput("Uploading and processing the file. Please wait...");

      const response = await axios.post(
        "http://127.0.0.1:5000/separated_audio",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const { tracks } = response.data; // Expecting Flask to return an array of track URLs
      setSeparatedTracks(tracks);
      setOutput("Audio separation successful! Play the tracks below.");
    } catch (error) {
      setOutput("Failed to process the file. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="separate-audio-container">
      <h1>Separate Audio Tracks</h1>

      <div className="file-upload">
        <input type="file" accept="audio/*" onChange={handleFileChange} />
      </div>

      <button
        onClick={handleUpload}
        disabled={loading}
        className="upload-button"
      >
        {loading ? "Processing..." : "Upload and Separate"}
      </button>

      {output && <p className="output-message">{output}</p>}

      <div className="tracks-container">
        {separatedTracks.length > 0 && (
          <>
            <h2>Separated Tracks</h2>
            <ul>
              {separatedTracks.map((track, index) => (
                <li key={index} className="track-item">
                  <p>{track.name}</p>
                  <audio controls src={track.url}></audio>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <button onClick={() => navigate("/")} className="back-button">
        Back to Home
      </button>
    </div>
  );
};

export default SeparateAudio;
