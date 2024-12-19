import React from "react";
import "./ActionButtons.css";

const ActionButtons = ({ onComposeTrack, onExtractInstrumentals }) => {
  return (
    <div className="action-buttons">
      <button onClick={onComposeTrack}>Compose New Track</button>
      <button onClick={onExtractInstrumentals}>Extract Instrumentals</button>
    </div>
  );
};

export default ActionButtons;
