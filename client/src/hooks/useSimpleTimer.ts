import { useState, useEffect, useRef } from 'react';

// Notification sound options
export type SoundOption = 'chime' | 'bell' | 'gentle';

const playNotificationSound = (sound: SoundOption = 'chime') => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  // Different sound profiles for macOS-style notifications
  const soundProfiles = {
    chime: { frequency: 800, duration: 0.4, volume: 0.3 },
    bell: { frequency: 1000, duration: 0.6, volume: 0.4 },
    gentle: { frequency: 400, duration: 0.5, volume: 0.2 }
  };

  const profile = soundProfiles[sound];
  
  oscillator.frequency.setValueAtTime(profile.frequency, audioContext.currentTime);
  oscillator.type = 'sine';
  
  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(profile.volume, audioContext.currentTime + 0.02);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + profile.duration);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + profile.duration);
};

const showTimerNotification = (type: 'work' | 'break' | 'complete' | 'timer', sessionInfo?: string, sound: SoundOption = 'chime') => {
  const notifications = {
    work: {
      title: '🍅 Work Session Complete!',
      body: 'Time for a break. Great job on your focused work!',
    },
    break: {
      title: '⏰ Break Time Over!',
      body: 'Ready to get back to work? Your next session is waiting.',
    },
    complete: {
      title: '🎉 All Sessions Complete!',
      body: sessionInfo || 'Congratulations! You\'ve completed your productivity goal.',
    },
    timer: {
      title: '⏰ Timer Complete!',
      body: 'Your timer has finished!',
    }
  };

  const config = notifications[type];
  
  // Play sound first
  playNotificationSound(sound);
  
  // Show notification if permission granted
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(config.title, {
      body: config.body,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'timer-notification',
      requireInteraction: false
    });
  }
};

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
  // Notification settings
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  selectedSound: SoundOption;
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
    totalSessions: 3, // 1 hour = 60 min, 60/25 = 2.4, rounded up to 3 sessions (work+break cycles)
    notificationsEnabled: true,
    soundEnabled: true,
    selectedSound: 'chime'
  });
  
  const intervalRef = useRef<number | null>(null);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Update document title with timer
  useEffect(() => {
    const timeDisplay = formatTime(state.currentTime);
    const modeDisplay = state.mode === 'pomodoro' ? `${state.pomodoroSession} session` : state.mode;
    
    if (state.isRunning) {
      document.title = `${timeDisplay} - ${modeDisplay} | TimeKeeper`;
    } else if (state.currentTime > 0 || state.mode === 'stopwatch') {
      document.title = `⏸ ${timeDisplay} - ${modeDisplay} | TimeKeeper`;
    } else {
      document.title = 'TimeKeeper';
    }
  }, [state.currentTime, state.isRunning, state.mode, state.pomodoroSession]);

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
              
              // Show notification for session completion
              if (prev.notificationsEnabled) {
                if (newCompletedSessions >= prev.totalSessions) {
                  showTimerNotification('complete', `You completed ${prev.targetHours} hours of focused work!`, prev.selectedSound);
                } else {
                  showTimerNotification(prev.pomodoroSession, undefined, prev.selectedSound);
                }
              }
              
              return {
                ...prev,
                pomodoroSession: nextSession,
                currentTime: nextDuration * 60,
                initialTime: nextDuration * 60,
                completedSessions: newCompletedSessions,
                isRunning: false
              };
            }
            // Timer mode completion
            if (prev.notificationsEnabled) {
              showTimerNotification('timer', undefined, prev.selectedSound);
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

  const setNotificationSettings = (enabled: boolean, sound?: SoundOption) => {
    setState(prev => ({
      ...prev,
      notificationsEnabled: enabled,
      soundEnabled: enabled,
      selectedSound: sound || prev.selectedSound
    }));
    
    // Request permission when enabling notifications
    if (enabled && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const testNotification = () => {
    if (state.notificationsEnabled) {
      showTimerNotification('timer', 'This is a test notification', state.selectedSound);
    }
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
    setNotificationSettings,
    testNotification,
    formatTime
  };
}