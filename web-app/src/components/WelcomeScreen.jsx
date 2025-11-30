import React, { useState } from 'react';

const WelcomeScreen = ({ onStart, initialLevel = 1 }) => {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const [level, setLevel] = useState(initialLevel);

  return (
    <div className="screen welcome-screen">
      <h1>Musical Hearing Quiz</h1>
      <p>Test your ability to identify Tonic, Subdominant, and Dominant chords.</p>
      <p>Listen carefully to the sequence and guess the chords.</p>
      <p>By Nitzan H</p>

      <div className="level-selector">
        <h3>Select Difficulty Level:</h3>
        <div className="level-buttons">
          {[1, 2, 3].map((l) => (
            <button
              key={l}
              className={`level-btn ${level === l ? 'selected' : ''}`}
              onClick={() => setLevel(l)}
            >
              Level {l}
            </button>
          ))}
        </div>
        <p className="level-desc">
          {level === 1 && "Basic: Standard major chords in 4th octave"}
          {level === 2 && "Intermediate: Random octaves for each chord"}
          {level === 3 && "Advanced: Chord inversion - random octaves for each note"}
        </p>
      </div>

      {isMobile && (
        <div className="warning-box">
          <p><strong>📱 Mobile Users:</strong> Please turn off Silent Mode / Ringer Switch to hear the audio.</p>
        </div>
      )}

      <button onClick={() => onStart(level)} className="btn-primary">
        Start Quiz
      </button>
    </div>
  );
};

export default WelcomeScreen;
