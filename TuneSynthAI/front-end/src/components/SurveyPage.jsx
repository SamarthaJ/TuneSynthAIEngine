import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SurveyPage.css";

const themes = [
  "Cinematic",
  "Motivational & Inspiring",
  "Comedy",
  "Nature",
  "Gaming",
  "Sports & Action",
  "Technology",
  "Tutorial",
  "Workout & Wellness",
  "Horror & Thriller",
  "Documentary",
  "Drama",
  "Broadcasting",
];

const genres = [
  "Hip Hop",
  "Trap",
  "Acoustic",
  "Rock",
  "Ambient",
  "Pop",
  "Drum n Bass",
  "Electronica",
  "Techno",
  "Jazz",
  "Phonk",
];

const moods = [
  "Epic",
  "Happy",
  "Hopeful",
  "Laidback",
  "Angry",
  "Sentimental",
  "Busy",
  "Romantic",
  "Funny",
  "Dark",
  "Glamorous",
  "Mysterious",
  "Smooth",
  "Running",
  "Suspense",
];

const trackLengths = [
  "0:10",
  "0:15",
  "0:30",
  "1:00",
  "1:30",
  "2:00",
  "3:00",
  "4:00",
  "5:00",
];

const SurveyPage = () => {
  const [formData, setFormData] = useState({
    theme: "",
    genre: "",
    mood: "",
    trackLength: "",
    tempo: "",
  });

  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate("/results", { state: { formData } });
  };

  return (
    <div className="survey-page">
      {/* Track Length Section */}
      <div className="survey-section">
        <label>Track Length:</label>
        <select
          value={formData.trackLength}
          onChange={(e) =>
            setFormData({ ...formData, trackLength: e.target.value })
          }
        >
          <option value="">Select Length</option>
          {trackLengths.map((length) => (
            <option key={length} value={length}>
              {length}
            </option>
          ))}
        </select>
      </div>

      {/* Tempo Section */}
      <div className="survey-section">
        <label>Tempo:</label>
        <div>
          {["Slow", "Normal", "Fast"].map((tempo) => (
            <label key={tempo}>
              <input
                type="radio"
                name="tempo"
                value={tempo}
                onChange={(e) =>
                  setFormData({ ...formData, tempo: e.target.value })
                }
              />
              {tempo}
            </label>
          ))}
        </div>
      </div>

      {/* Genre Section */}
      <div className="survey-section">
        <label>Genre:</label>
        <div className="responsive-grid">
          {genres.map((genre) => (
            <div
              key={genre}
              className={`card ${formData.genre === genre ? "selected" : ""}`}
              onClick={() => setFormData({ ...formData, genre })}
            >
              {genre}
            </div>
          ))}
        </div>
      </div>

      {/* Theme Section */}
      <div className="survey-section">
        <label>Theme:</label>
        <div className="responsive-grid">
          {themes.map((theme) => (
            <div
              key={theme}
              className={`card ${formData.theme === theme ? "selected" : ""}`}
              onClick={() => setFormData({ ...formData, theme })}
            >
              {theme}
            </div>
          ))}
        </div>
      </div>

      {/* Mood Section */}
      <div className="survey-section">
        <label>Mood:</label>
        <div className="responsive-grid">
          {moods.map((mood) => (
            <div
              key={mood}
              className={`card ${formData.mood === mood ? "selected" : ""}`}
              onClick={() => setFormData({ ...formData, mood })}
            >
              {mood}
            </div>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <button className="submit-btn" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
};

export default SurveyPage;
