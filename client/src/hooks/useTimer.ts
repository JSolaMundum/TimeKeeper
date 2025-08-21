import { useEffect } from 'react';
import { useTimerContext } from '@/context/TimerContext';

export function useTimer() {
  const { state, dispatch } = useTimerContext();

  // Timer tick effect
  useEffect(() => {
    if (!state.isRunning) return;

    const interval = setInterval(() => {
      dispatch({ type: 'TICK' });
    }, 1000);

    return () => clearInterval(interval);
  }, [state.isRunning]);

  // Handle timer completion
  useEffect(() => {
    if (state.time === 0 && state.mode !== 'stopwatch' && !state.isRunning) {
      if (state.mode === 'pomodoro') {
        // Auto-switch to next Pomodoro session
        setTimeout(() => {
          dispatch({ type: 'NEXT_POMODORO_SESSION' });
        }, 100);
      }
    }
  }, [state.time, state.mode, state.isRunning, dispatch]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = (): number => {
    if (state.mode === 'stopwatch') return 0;
    
    let totalTime = 0;
    if (state.mode === 'timer') {
      totalTime = state.timerHours * 3600 + state.timerMinutes * 60 + state.timerSeconds;
    } else if (state.mode === 'pomodoro') {
      totalTime = state.currentSession === 'work' ? state.pomodoroWork * 60 : state.pomodoroBreak * 60;
    }
    
    if (totalTime === 0) return 0;
    return ((totalTime - state.time) / totalTime) * 100;
  };

  const start = () => {
    if (state.mode === 'timer' && state.time === 0) {
      const totalSeconds = state.timerHours * 3600 + state.timerMinutes * 60 + state.timerSeconds;
      dispatch({ type: 'SET_TIME', payload: totalSeconds });
    } else if (state.mode === 'pomodoro' && state.time === 0) {
      const sessionTime = state.currentSession === 'work' ? state.pomodoroWork * 60 : state.pomodoroBreak * 60;
      dispatch({ type: 'SET_TIME', payload: sessionTime });
    }
    dispatch({ type: 'TOGGLE_RUNNING' });
  };

  const stop = () => {
    dispatch({ type: 'TOGGLE_RUNNING' });
  };

  const reset = () => {
    dispatch({ type: 'RESET' });
  };

  const toggle = () => {
    if (state.isRunning) {
      stop();
    } else {
      start();
    }
  };

  return {
    ...state,
    formatTime,
    getProgress,
    start,
    stop,
    reset,
    toggle,
    dispatch,
  };
}
