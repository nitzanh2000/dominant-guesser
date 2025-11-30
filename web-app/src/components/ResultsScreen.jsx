import React from 'react';

const ResultsScreen = ({ guesses, actualChords, scale, onPlayAgain }) => {
  const PLACES = { tonic: 'Tonic (I)', subdominant: 'Subdominant (IV)', dominant: 'Dominant (V)' };

  return (
    <div className="screen results-screen">
      <h2>Results</h2>
      <p className="scale-info">Key: <strong>{scale}</strong></p>
      
      <div className="results-list">
        {guesses.map((guess, index) => {
          const actual = actualChords[index];
          const isCorrect = guess === actual.place;
          
          return (
            <div key={index} className={`result-item ${isCorrect ? 'correct' : 'incorrect'}`}>
              <span className="chord-index">#{index + 1}</span>
              <div className="guess-details">
                <span className="user-guess">You guessed: {PLACES[guess]}</span>
                {!isCorrect && (
                  <span className="actual-answer">Actual: {PLACES[actual.place]} ({actual.name})</span>
                )}
                {isCorrect && (
                  <span className="actual-answer">Correct! ({actual.name})</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <button onClick={onPlayAgain} className="btn-primary">
        Play Again
      </button>
    </div>
  );
};

export default ResultsScreen;
