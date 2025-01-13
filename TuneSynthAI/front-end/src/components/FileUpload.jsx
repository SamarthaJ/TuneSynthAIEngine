import React from "react";
import "./FileUpload.css"; // Importing the CSS file for styling the component

// A functional component for file upload
const FileUpload = ({ onFileChange }) => {
  // Handler for when a file is selected
  const handleChange = (event) => {
    // Calls the onFileChange prop with the selected file
    onFileChange(event.target.files[0]);
  };

  return (
    <div className="file-upload">
      {/* Label for the file input */}
      <label htmlFor="fileUpload" className="upload-label">
        Upload Music File
      </label>
      {/* File input field for uploading audio files */}
      <input
        type="file" // Specifies the input type as file
        id="fileUpload" // Associates the label with this input using the id
        accept="audio/*" // Restricts file types to audio only
        onChange={handleChange} // Calls handleChange when a file is selected
      />
    </div>
  );
};

// Exports the FileUpload component for use in other parts of the app
export default FileUpload;
