import React from 'react';

const WelcomeScreen = ({ onStart }) => {
  return (
    <div className="screen welcome-screen">
      <h1>Musical Hearing Quiz</h1>
      <p>Test your ability to identify Tonic, Subdominant, and Dominant chords.</p>
      <p>Listen carefully to the sequence and guess the chords.</p>
      <button onClick={onStart} className="btn-primary">
        Start Quiz
      </button>
    </div>
  );
};

export default WelcomeScreen;
