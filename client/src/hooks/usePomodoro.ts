import { useEffect } from 'react';
import { useTimerContext } from '@/context/TimerContext';

export function usePomodoro() {
  const { state, dispatch } = useTimerContext();

  // Calculate adaptive Pomodoro settings based on target hours
  useEffect(() => {
    if (state.mode === 'pomodoro') {
      const targetMinutes = state.targetHours * 60;
      const estimatedSessions = Math.ceil(targetMinutes / state.pomodoroWork);
      
      // Adaptive algorithm: gradually reduce work time, slightly increase break time
      const adaptiveWork = Math.max(15, state.pomodoroWork - Math.floor(state.completedSessions / 4) * 2);
      const adaptiveBreak = Math.min(15, state.pomodoroBreak + Math.floor(state.completedSessions / 6));
      
      if (adaptiveWork !== state.pomodoroWork) {
        dispatch({ type: 'SET_POMODORO_WORK', payload: adaptiveWork });
      }
      if (adaptiveBreak !== state.pomodoroBreak) {
        dispatch({ type: 'SET_POMODORO_BREAK', payload: adaptiveBreak });
      }
    }
  }, [state.completedSessions, state.mode, state.targetHours, dispatch]);

  const getCurrentSessionInfo = () => {
    const sessionNumber = Math.floor(state.completedSessions / 2) + 1;
    const sessionType = state.currentSession === 'work' ? 'Work Session' : 'Break Time';
    return `${sessionType} ${sessionNumber}`;
  };

  const getSessionProgress = () => {
    return `${state.completedSessions}/${state.totalSessions} sessions`;
  };

  const getRemainingTime = () => {
    const remainingSessions = Math.max(0, state.totalSessions - state.completedSessions);
    const avgSessionTime = (state.pomodoroWork + state.pomodoroBreak) / 2;
    const remainingMinutes = remainingSessions * avgSessionTime;
    
    const hours = Math.floor(remainingMinutes / 60);
    const minutes = Math.floor(remainingMinutes % 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    }
    return `${minutes}m remaining`;
  };

  const isLongBreak = () => {
    return state.currentSession === 'break' && state.completedSessions > 0 && state.completedSessions % 8 === 0;
  };

  return {
    getCurrentSessionInfo,
    getSessionProgress,
    getRemainingTime,
    isLongBreak,
  };
}
