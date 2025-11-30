import React from 'react';

const PlaybackScreen = ({ playbackStatus, onReplay }) => {
  return (
    <div className="screen playback-screen">
      <div className="status-message">
        {playbackStatus === 'tonic' && <h2>Now you hear the tonic...</h2>}
        {playbackStatus === 'sequence' && <h2>Listen carefully...</h2>}
        {playbackStatus === 'idle' && <h2>What were the chords?</h2>}
      </div>
      
      <div className={`visualizer ${playbackStatus !== 'idle' ? 'playing' : ''}`}>
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
      </div>
      
      {playbackStatus === 'idle' && (
        <div className="controls">
          <button onClick={onReplay} className="btn-secondary">
            Replay Sequence
          </button>
        </div>
      )}
    </div>
  );
};

export default PlaybackScreen;
