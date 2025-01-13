import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ResultsPage from "./components/ResultPage";
import HomePage from "./components/Home";
import SAPP from "./components/sapp";
import "./App.css"

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/Generation" element={<SAPP />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/results" element={<ResultsPage />} />
      </Routes>
    </Router>
  );
};

export default App;
