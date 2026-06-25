import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Flame } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PomodoroTimer = () => {
  const { triggerToast } = useAuth();
  const [sessionLength, setSessionLength] = useState(25); // in minutes
  const [timeLeft, setTimeLeft] = useState(25 * 60); // in seconds
  const [isRunning, setIsRunning] = useState(false);
  
  const timerRef = useRef(null);
  const totalSeconds = sessionLength * 60;

  // Sound generator using Web Audio API
  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
      gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);

      oscillator.start();
      // Stop beep after 0.8 seconds
      oscillator.stop(audioCtx.currentTime + 0.8);
    } catch (e) {
      console.warn("Audio Context blocked or not supported: ", e);
    }
  };

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            playBeep();
            triggerToast('🍅 Pomodoro Session complete! Time to take a break.', 'success');
            return sessionLength * 60;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning, sessionLength]);

  // Adjust duration if length changes (and timer is not running)
  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(sessionLength * 60);
    }
  }, [sessionLength]);

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(sessionLength * 60);
  };

  const handleLengthChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0 && value <= 120) {
      setSessionLength(value);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // SVG Circular progress configurations
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (timeLeft / totalSeconds) * circumference;

  return (
    <div className="glass-card pomodoro-container">
      <div className="pomodoro-header">
        <Flame size={22} style={{ color: 'var(--accent-primary)' }} />
        <h3>Pomodoro Focus</h3>
      </div>

      <div className="timer-display-container">
        <svg className="timer-svg" width="200" height="200">
          <circle
            className="timer-circle-bg"
            cx="100"
            cy="100"
            r={radius}
          />
          <circle
            className="timer-circle-progress"
            cx="100"
            cy="100"
            r={radius}
            strokeDasharray={circumference}
            strokeDashoffset={progressOffset}
          />
        </svg>
        <div className="timer-text">{formatTime(timeLeft)}</div>
      </div>

      <div className="timer-controls">
        <button
          onClick={handleStartPause}
          className={`btn ${isRunning ? 'btn-secondary' : 'btn-primary'}`}
          title={isRunning ? 'Pause' : 'Start'}
        >
          {isRunning ? <Pause size={18} /> : <Play size={18} />}
          <span>{isRunning ? 'Pause' : 'Start'}</span>
        </button>
        <button
          onClick={handleReset}
          className="btn btn-secondary"
          title="Reset Timer"
        >
          <RotateCcw size={18} />
          <span>Reset</span>
        </button>
      </div>

      <div className="timer-settings">
        <div className="settings-row">
          <label htmlFor="duration-input" className="form-label" style={{ margin: 0 }}>
            Session Length (min):
          </label>
          <div className="settings-input-group">
            <input
              id="duration-input"
              type="number"
              min="1"
              max="120"
              value={sessionLength}
              onChange={handleLengthChange}
              disabled={isRunning}
              className="settings-input"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;
