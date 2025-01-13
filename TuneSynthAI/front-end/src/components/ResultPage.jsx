import React from "react";
import { useLocation } from "react-router-dom"; // Import hook to access location state
import "./ResultPage.css"; // Import CSS for styling

const ResultsPage = () => {
  const location = useLocation(); // Get the location object to retrieve state
  const { formData } = location.state || {}; // Retrieve formData from location.state (if passed)

  // Mock data for tracks - generates an array of 10 tracks
  const tracks = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1, // Track ID
    name: `Track ${i + 1}`, // Track name
    audioSrc: `/mock_audio/track${i + 1}.mp3`, // Mock audio source
  }));

  return (
    <div className="results-page">
      {/* Page Title */}
      <h2>Generated Tracks</h2>

      {/* List of tracks */}
      <div className="track-list">
        {tracks.map((track) => (
          <div className="track-item" key={track.id}>
            {/* Track Info Section */}
            <div className="track-info">
              <span>{track.id}</span> {/* Display track ID */}
              <button className="play-btn">▶</button> {/* Play button */}
              <div className="wave-graphic">[Wave Graphic]</div> {/* Placeholder for wave graphic */}
              <button className="expand-btn">⬇ More</button> {/* Button to expand more details */}
            </div>

            {/* Additional Buttons Section */}
            <div className="track-extra">
              <button className="download-btn">Download</button> {/* Download button */}
              <button className="share-btn">Share</button> {/* Share button */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultsPage; // Export the component
