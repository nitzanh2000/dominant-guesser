import React, { useState } from 'react';

const CHORD_OPTIONS = [
  { label: 'Tonic (I)', value: 'tonic' },
  { label: 'Subdominant (IV)', value: 'subdominant' },
  { label: 'Dominant (V)', value: 'dominant' },
];

const QuizForm = ({ onSubmit, activeChordIndex }) => {
  const [guesses, setGuesses] = useState([null, null, null, null]);

  const handleSelect = (index, value) => {
    const newGuesses = [...guesses];
    newGuesses[index] = value;
    setGuesses(newGuesses);
  };

  const handleSubmit = () => {
    if (guesses.every(g => g !== null)) {
      onSubmit(guesses);
    }
  };

  return (
    <div className="screen quiz-screen">
      <div className="guesses-container">
        {guesses.map((guess, index) => (
          <div 
            key={index} 
            className={`guess-item ${activeChordIndex === index ? 'active-playing' : ''}`}
          >
            <span className="chord-number">Chord {index + 1}</span>
            <div className="options">
              {CHORD_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  className={`option-btn ${guess === opt.value ? 'selected' : ''}`}
                  onClick={() => handleSelect(index, opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <button 
        onClick={handleSubmit} 
        disabled={guesses.some(g => g === null)}
        className="btn-primary"
      >
        Submit Answers
      </button>
    </div>
  );
};

export default QuizForm;
