import React, { useState } from "react";
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
    // if (!musicFile) {
    //   setOutput("Please upload a music file first!");
    //   return;
    // }
    navigate("/Generation");
  };

  const handleExtractInstrumentals = () => {
    if (!musicFile) {
      setOutput("Please upload a music file first!");
      return;
    }
    setOutput("Extracting instrumentals...");
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
