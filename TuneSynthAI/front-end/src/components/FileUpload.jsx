import React from "react";
import "./FileUpload.css";

const FileUpload = ({ onFileChange }) => {
  const handleChange = (event) => {
    onFileChange(event.target.files[0]);
  };

  return (
    <div className="file-upload">
      <label htmlFor="fileUpload" className="upload-label">
        Upload Music File
      </label>
      <input
        type="file"
        id="fileUpload"
        accept="audio/*"
        onChange={handleChange}
      />
    </div>
  );
};

export default FileUpload;
