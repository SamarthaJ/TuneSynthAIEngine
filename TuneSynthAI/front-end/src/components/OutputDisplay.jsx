import React from 'react'; // Import React
import './OutputDisplay.css'; // Import the CSS file for styling

// Functional component to display the output messages
const OutputDisplay = ({ output }) => {
  return (
    <div className="output-display">
      {/* Heading for the output section */}
      <h3>Output:</h3>
      {/* Displays the output message passed as a prop */}
      <p>{output}</p>
    </div>
  );
};

export default OutputDisplay; // Export the component for use in other parts of the app
