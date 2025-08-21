import { useState, useEffect, useRef } from 'react';

export interface TimerState {
  mode: 'timer' | 'stopwatch' | 'pomodoro';
  isRunning: boolean;
  currentTime: number; // in seconds
  initialTime: number; // for reset functionality
}

export function useSimpleTimer() {
  const [state, setState] = useState<TimerState>({
    mode: 'timer',
    isRunning: false,
    currentTime: 0,
    initialTime: 0
  });
  
  const intervalRef = useRef<number | null>(null);

  // Main timer effect
  useEffect(() => {
    if (!state.isRunning) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = window.setInterval(() => {
      setState(prev => {
        if (!prev.isRunning) return prev;
        
        if (prev.mode === 'stopwatch') {
          return { ...prev, currentTime: prev.currentTime + 1 };
        } else {
          // Timer or Pomodoro countdown
          if (prev.currentTime <= 0) {
            return { ...prev, isRunning: false };
          }
          const newTime = prev.currentTime - 1;
          if (newTime <= 0) {
            return { ...prev, currentTime: 0, isRunning: false };
          }
          return { ...prev, currentTime: newTime };
        }
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [state.isRunning]);

  const setTimer = (seconds: number) => {
    setState(prev => ({
      ...prev,
      currentTime: seconds,
      initialTime: seconds,
      isRunning: false
    }));
  };

  const start = () => {
    setState(prev => ({ ...prev, isRunning: true }));
  };

  const pause = () => {
    setState(prev => ({ ...prev, isRunning: false }));
  };

  const reset = () => {
    setState(prev => ({
      ...prev,
      currentTime: prev.mode === 'stopwatch' ? 0 : prev.initialTime,
      isRunning: false
    }));
  };

  const setMode = (mode: 'timer' | 'stopwatch' | 'pomodoro') => {
    setState(prev => ({
      ...prev,
      mode,
      currentTime: mode === 'stopwatch' ? 0 : prev.initialTime,
      isRunning: false
    }));
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    ...state,
    setTimer,
    start,
    pause,
    reset,
    setMode,
    formatTime
  };
}