import { useState, useEffect, useRef } from 'react';

export interface TimerState {
  mode: 'timer' | 'stopwatch' | 'pomodoro';
  isRunning: boolean;
  currentTime: number; // in seconds
  initialTime: number; // for reset functionality
  // Pomodoro specific
  pomodoroSession: 'work' | 'break';
  workDuration: number; // in minutes
  breakDuration: number; // in minutes
  completedSessions: number;
  targetHours: number; // target work hours
  totalSessions: number; // calculated total sessions needed
}

export function useSimpleTimer() {
  const [state, setState] = useState<TimerState>({
    mode: 'timer',
    isRunning: false,
    currentTime: 0,
    initialTime: 0,
    pomodoroSession: 'work',
    workDuration: 25,
    breakDuration: 5,
    completedSessions: 0,
    targetHours: 1,
    totalSessions: 3 // 1 hour = 60 min, 60/25 = 2.4, rounded up to 3 sessions (work+break cycles)
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
            // Handle Pomodoro session completion
            if (prev.mode === 'pomodoro') {
              const nextSession = prev.pomodoroSession === 'work' ? 'break' : 'work';
              const nextDuration = nextSession === 'work' ? prev.workDuration : prev.breakDuration;
              const newCompletedSessions = prev.pomodoroSession === 'break' ? prev.completedSessions + 1 : prev.completedSessions; // Complete session after break
              
              return {
                ...prev,
                pomodoroSession: nextSession,
                currentTime: nextDuration * 60,
                initialTime: nextDuration * 60,
                completedSessions: newCompletedSessions,
                isRunning: false
              };
            }
            return { ...prev, isRunning: false };
          }
          const newTime = prev.currentTime - 1;
          if (newTime <= 0) {
            // Handle completion
            if (prev.mode === 'pomodoro') {
              const nextSession = prev.pomodoroSession === 'work' ? 'break' : 'work';
              const nextDuration = nextSession === 'work' ? prev.workDuration : prev.breakDuration;
              const newCompletedSessions = prev.pomodoroSession === 'break' ? prev.completedSessions + 1 : prev.completedSessions; // Complete session after break
              
              return {
                ...prev,
                pomodoroSession: nextSession,
                currentTime: nextDuration * 60,
                initialTime: nextDuration * 60,
                completedSessions: newCompletedSessions,
                isRunning: false
              };
            }
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
    setState(prev => {
      let newTime = 0;
      let newInitialTime = 0;
      
      if (mode === 'stopwatch') {
        newTime = 0;
        newInitialTime = 0;
      } else if (mode === 'pomodoro') {
        newTime = prev.workDuration * 60;
        newInitialTime = prev.workDuration * 60;
      } else {
        newTime = prev.initialTime;
        newInitialTime = prev.initialTime;
      }
      
      return {
        ...prev,
        mode,
        currentTime: newTime,
        initialTime: newInitialTime,
        isRunning: false,
        pomodoroSession: 'work',
        completedSessions: 0,
        totalSessions: mode === 'pomodoro' ? Math.ceil((prev.targetHours * 60) / prev.workDuration) : prev.totalSessions
      };
    });
  };

  const setPomodoroSettings = (workMinutes: number, breakMinutes: number) => {
    setState(prev => {
      const totalSessions = Math.ceil((prev.targetHours * 60) / workMinutes); // Each session = work + break
      
      return {
        ...prev,
        workDuration: workMinutes,
        breakDuration: breakMinutes,
        totalSessions,
        currentTime: prev.mode === 'pomodoro' ? workMinutes * 60 : prev.currentTime,
        initialTime: prev.mode === 'pomodoro' ? workMinutes * 60 : prev.initialTime
      };
    });
  };

  const setTargetHours = (hours: number) => {
    setState(prev => {
      const totalSessions = Math.ceil((hours * 60) / prev.workDuration); // Each session = work + break
      
      return {
        ...prev,
        targetHours: hours,
        totalSessions
      };
    });
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
    setPomodoroSettings,
    setTargetHours,
    formatTime
  };
}