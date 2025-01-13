import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook for navigation
import axios from "axios"; // Axios is used for making HTTP requests
import FileUpload from "./FileUpload"; // Component for handling file uploads
import ActionButtons from "./ActionButtons"; // Component for displaying action buttons
import OutputDisplay from "./OutputDisplay"; // Component for displaying messages or outputs
import "./home.css"; // Import CSS for styling

const HomePage = () => {
  // State to hold the uploaded music file
  const [musicFile, setMusicFile] = useState(null);

  // State to display output messages
  const [output, setOutput] = useState("");

  // State to store the separated tracks after processing
  const [tracks, setTracks] = useState([]);

  // Initialize the navigate function for page redirection
  const navigate = useNavigate();

  // Handler function to update the state when a file is uploaded
  const handleFileChange = (file) => {
    setMusicFile(file);
  };

  // Function to handle audio separation
  const handleExtractInstrumentals = async () => {
    // Check if a file is uploaded
    if (!musicFile) {
      setOutput("Please upload a music file first!");
      return;
    }

    // Create a FormData object to send the file to the backend
    const formData = new FormData();
    formData.append("input_file", musicFile);

    try {
      // Display a message while the file is being uploaded and processed
      setOutput("Uploading and processing the file. Please wait...");

      // Make a POST request to the backend API for audio separation
      const response = await axios.post(
        "http://127.0.0.1:5000/separate_audio", // Backend API endpoint
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Required for file uploads
          },
        }
      );

      // Extract separated track details from the response
      const { files } = response.data; // Assuming the backend returns a `files` object
      setTracks(files); // Update the tracks state with the response data

      // Display a success message
      setOutput("Audio separation successful! Check the outputs below.");
    } catch (error) {
      // Display an error message if the API call fails
      setOutput("Failed to process the file. Please try again.");
      console.error("Error " + error); // Log the error for debugging
    }
  };

  // Function to navigate to the "Compose Track" page
  const handleNavigateToComposeTrack = () => {
    setOutput("Redirecting to the Compose Track page..."); // Display a message
    navigate("/Generation"); // Navigate to the "/Generation" route
  };

  return (
    <div className="app">
      {/* Application title */}
      <h1>TuneSynthAI</h1>

      {/* FileUpload component for uploading a music file */}
      <FileUpload onFileChange={handleFileChange} />

      {/* ActionButtons component for triggering audio separation and navigation */}
      <ActionButtons
        onExtractInstrumentals={handleExtractInstrumentals}
        onNavigateToComposeTrack={handleNavigateToComposeTrack}
      />

      {/* OutputDisplay component to show messages or status */}
      <OutputDisplay output={output} />

      {/* Display the list of separated tracks if available */}
      {tracks.length > 0 && (
        <div className="track-list">
          <h2>Separated Tracks:</h2>
          <ul>
            {/* Iterate over the tracks array and display each track */}
            {tracks.map((track) => (
              <li key={track.track}>
                {/* Display the track name */}
                <p>{track.track}</p>

                {/* Audio player for playing the track */}
                <audio controls>
                  <source src={track.url} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>

                {/* Download link for the track */}
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
