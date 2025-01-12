import React from "react";
import "./ActionButtons.css";

const ActionButtons = ({ onNavigateToComposeTrack, onExtractInstrumentals }) => {
  return (
    <div className="action-buttons">
      <button onClick={onExtractInstrumentals}>Extract Instrumentals</button>
      <button onClick={onNavigateToComposeTrack}>Go to Compose Track</button>
    </div>
  );
};

export default ActionButtons;
