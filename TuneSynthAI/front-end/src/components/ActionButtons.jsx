/* Code for the Buttons on the Home Screen asking user to genarate or separate audio*/
/* Import the necessary modules*/
import React from "react";
import "./ActionButtons.css";

const ActionButtons = ({ onNavigateToComposeTrack, onExtractInstrumentals }) => {
  return (
    <div className="action-buttons">
      {/* Button asking the User for Generating the track*/}
      <button onClick={onNavigateToComposeTrack}>Compose New Track</button>
      {/* Button asking the User for Extracting/Separate the audio components */} 
      <button onClick={onExtractInstrumentals}>Extract Instrumentals</button> 
    </div>
  );
};

export default ActionButtons;
