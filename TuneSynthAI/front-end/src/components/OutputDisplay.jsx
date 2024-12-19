import React from 'react';
import './OutputDisplay.css';

const OutputDisplay = ({ output }) => {
  return (
    <div className="output-display">
      <h3>Output:</h3>
      <p>{output}</p>
    </div>
  );
};

export default OutputDisplay;
