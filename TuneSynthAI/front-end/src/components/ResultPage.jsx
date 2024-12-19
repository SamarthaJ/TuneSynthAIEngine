import React from "react";
import { useLocation } from "react-router-dom";
import "./ResultPage.css";

const ResultsPage = () => {
  const location = useLocation();
  const { formData } = location.state || {};

  const tracks = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    name: `Track ${i + 1}`,
    audioSrc: `/mock_audio/track${i + 1}.mp3`,
  }));

  return (
    <div className="results-page">
      <h2>Generated Tracks</h2>
      <div className="track-list">
        {tracks.map((track) => (
          <div className="track-item" key={track.id}>
            <div className="track-info">
              <span>{track.id}</span>
              <button className="play-btn">▶</button>
              <div className="wave-graphic">[Wave Graphic]</div>
              <button className="expand-btn">⬇ More</button>
            </div>
            <div className="track-extra">
              <button className="download-btn">Download</button>
              <button className="share-btn">Share</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultsPage;
