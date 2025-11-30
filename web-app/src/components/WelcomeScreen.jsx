const WelcomeScreen = ({ onStart }) => {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  return (
    <div className="screen welcome-screen">
      <h1>Musical Hearing Quiz</h1>
      <p>Test your ability to identify Tonic, Subdominant, and Dominant chords.</p>
      <p>Listen carefully to the sequence and guess the chords.</p>
      <p>By Nitzan H</p>

      {isMobile && (
        <div className="warning-box">
          <p><strong>📱 Mobile Users:</strong> Please turn off Silent Mode / Ringer Switch to hear the audio.</p>
        </div>
      )}

      <button onClick={onStart} className="btn-primary">
        Start Quiz
      </button>
    </div>
  );
};

export default WelcomeScreen;
