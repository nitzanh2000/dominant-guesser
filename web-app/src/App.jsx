import React, { useState, useEffect } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import PlaybackScreen from './components/PlaybackScreen';
import QuizForm from './components/QuizForm';
import ResultsScreen from './components/ResultsScreen';
import { getRandomScale, getDominantAndSubdominant, chordToNotes } from './utils/musicTheory';
import { initAudio, playSequence, playChord } from './utils/audioEngine';

function App() {
  const [stage, setStage] = useState('welcome'); // welcome, quiz, results
  const [scale, setScale] = useState(null);
  const [tonicChord, setTonicChord] = useState({});
  const [chords, setChords] = useState([]);
  const [userGuesses, setUserGuesses] = useState([]);
  const [playbackStatus, setPlaybackStatus] = useState('idle'); // idle, tonic, sequence
  const [activeChordIndex, setActiveChordIndex] = useState(-1);
  const [level, setLevel] = useState(() => {
    const saved = localStorage.getItem('dominant-guesser-level');
    return saved ? parseInt(saved, 10) : 1;
  });

  const startQuiz = async (selectedLevel = 1) => {
    await initAudio();
    setLevel(selectedLevel);
    localStorage.setItem('dominant-guesser-level', selectedLevel);
    
    // Generate new quiz data
    const newScale = getRandomScale();
    setScale(newScale);
    
    const chordNames = getDominantAndSubdominant(newScale);
    
    // Helper to create chord object
    const createChord = (chordName, place) => ({
      ...chordToNotes(chordName, selectedLevel),
      place,
    });

    const PLACES = ['tonic', 'subdominant', 'dominant'];
    const getRandomPlace = () => PLACES[Math.floor(Math.random() * PLACES.length)];

    const tonicChord = { ...chordToNotes(chordNames.tonic, level), place: 'tonic' };
    setTonicChord(tonicChord);

    // Generate 4 random chords
    const newChords = Array(4).fill(null).map(() => {
      const place = getRandomPlace();
      return createChord(chordNames[place], place);
    });
    
    setChords(newChords);
    setStage('quiz');
    
    // Play sequence
    playQuizSequence(tonicChord, newChords);
  };

  const playQuizSequence = async (tonicChord, currentChords) => {
    // Play Tonic
    setPlaybackStatus('tonic');
    //const tonic = { ...chordToNotes(chordNames.tonic, level), place: 'tonic' };
    await playChord(tonicChord.notes, 4); // 4 seconds roughly if 1n is whole note
    // We want explicit 4 seconds wait for the text to show
    await new Promise(r => setTimeout(r, 4500));
    
    setPlaybackStatus('sequence');
    
    // Play the 4 random chords with visual indicators
    const duration = 4; // seconds
    const gap = 0.5;
    
    for (let i = 0; i < currentChords.length; i++) {
      setActiveChordIndex(i);
      playChord(currentChords[i].notes, duration);
      await new Promise(r => setTimeout(r, (duration + gap) * 1000));
    }
    
    setActiveChordIndex(-1);
    setPlaybackStatus('idle');
  };

  const handleReplay = () => {
    if (playbackStatus !== 'idle') return;
    playQuizSequence(tonicChord, chords);
  };

  const handleSubmit = (guesses) => {
    setUserGuesses(guesses);
    setStage('results');
  };

  const handlePlayAgain = () => {
    setStage('welcome');
    setScale(null);
    setChords([]);
    setUserGuesses([]);
  };

  return (
    <div className="app-container">
      {stage === 'welcome' && <WelcomeScreen onStart={startQuiz} initialLevel={level} />}
      
      {stage === 'quiz' && (
        <div className="quiz-session">
          <PlaybackScreen 
            playbackStatus={playbackStatus}
            onReplay={handleReplay} 
          />
          <QuizForm 
            onSubmit={handleSubmit} 
            activeChordIndex={activeChordIndex}
          />
        </div>
      )}

      {stage === 'results' && (
        <ResultsScreen 
          guesses={userGuesses} 
          actualChords={chords} 
          scale={scale}
          onPlayAgain={handlePlayAgain} 
        />
      )}
    </div>
  );
}

export default App;
