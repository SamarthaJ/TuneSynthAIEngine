/* File to handle the audio separation User Interface*/
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

  /* Handle the File selection and changing process*/
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setMusicFile(file);
      setOutput("");
    }
  };

  /* In case the file is not uploaded prompt to upload a file */
  const handleUpload = async () => {
    if (!musicFile) {
      setOutput("Please select a music file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("input_file", musicFile);

    /* Begin the Audio Separation calls*/
    try {
      setLoading(true);
      setOutput("Uploading and processing the file. Please wait...");

      /* Call the server*/
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
      /* Print a message for the successfull separation of audio tracks*/
      setOutput("Audio separation successful! Play the tracks below.");
    } catch (error) {
      /* If the process is not successfull print an error message*/
      setOutput("Failed to process the file. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="separate-audio-container">
      {/* Heading for the audio separation feature */}
      <h1>Separate Audio Tracks</h1>
  
      {/* File upload input for selecting audio files */}
      <div className="file-upload">
        <input 
          type="file" 
          accept="audio/*" // Restricts the file type to audio files only
          onChange={handleFileChange} // Calls the handleFileChange function when a file is selected
        />
      </div>
  
      {/* Button to handle the upload and audio separation */}
      <button
        onClick={handleUpload} // Calls the handleUpload function when clicked
        disabled={loading} // Disables the button if the process is loading
        className="upload-button"
      >
        {loading ? "Processing..." : "Upload and Separate"} 
        {/* Displays "Processing..." while loading, otherwise shows "Upload and Separate" */}
      </button>
  
      {/* Displays the output message if there is one */}
      {output && <p className="output-message">{output}</p>}
  
      {/* Container for the separated audio tracks */}
      <div className="tracks-container">
        {separatedTracks.length > 0 && (
          <>
            {/* Displays the heading for the separated tracks */}
            <h2>Separated Tracks</h2>
            <ul>
              {/* Loops through the separatedTracks array to display each track */}
              {separatedTracks.map((track, index) => (
                <li key={index} className="track-item">
                  {/* Displays the name of the track */}
                  <p>{track.name}</p>
                  {/* Audio player to play the separated track */}
                  <audio controls src={track.url}></audio>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
  
      {/* Button to navigate back to the home page */}
      <button onClick={() => navigate("/")} className="back-button">
        Back to Home
      </button>
    </div>
  );
}  
export default SeparateAudio;
