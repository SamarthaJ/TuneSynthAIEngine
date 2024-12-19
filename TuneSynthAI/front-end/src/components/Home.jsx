import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import FileUpload from "./FileUpload";
import ActionButtons from "./ActionButtons";
import OutputDisplay from "./OutputDisplay";
import "./home.css";

const Home = () => {
  const [musicFile, setMusicFile] = useState(null);
  const [output, setOutput] = useState("");
  const navigate = useNavigate();

  const handleFileChange = (file) => {
    setMusicFile(file);
  };

  const handleComposeTrack = () => {
    navigate("/Generation");
  };

  const handleExtractInstrumentals = async () => {
    if (!musicFile) {
      setOutput("Please upload a music file first!");
      return;
    }

    const formData = new FormData();
    formData.append("input_file", musicFile);

    try {
      setOutput("Uploading and processing the file. Please wait...");

      const response = await axios.post(
        "http://127.0.0.1:5000/separate_audio",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const { tracks } = response.data; // Assuming Flask returns track details
      setOutput("Audio separation successful!");
      // Navigate to /separate_audio and pass tracks
      navigate("/separate_audio", { state: { tracks } });
    } catch (error) {
      setOutput("Failed to process the file. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="app">
      <h1>TuneSynthAI</h1>
      <FileUpload onFileChange={handleFileChange} />
      <ActionButtons
        onComposeTrack={handleComposeTrack}
        onExtractInstrumentals={handleExtractInstrumentals}
      />
      <OutputDisplay output={output} />
    </div>
  );
};

export default Home;
