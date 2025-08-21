import { useEffect, useCallback } from 'react';
import { useTimerContext } from '@/context/TimerContext';

export function useNotifications() {
  const { state } = useTimerContext();

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && state.notificationsEnabled) {
      Notification.requestPermission();
    }
  }, [state.notificationsEnabled]);

  const playNotificationSound = useCallback((sound: string) => {
    // Create audio context for notification sounds
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Generate different notification sounds
    const createBeep = (frequency: number, duration: number) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    };

    switch (sound) {
      case 'chime':
        createBeep(800, 0.3);
        setTimeout(() => createBeep(600, 0.3), 100);
        setTimeout(() => createBeep(400, 0.3), 200);
        break;
      case 'bell':
        createBeep(1000, 0.5);
        break;
      default:
        createBeep(440, 0.5);
        break;
    }
  }, []);

  const showNotification = useCallback((title: string, body: string) => {
    if (!state.notificationsEnabled) return;

    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
      });
    }

    // Always play sound regardless of notification permission
    playNotificationSound(state.notificationSound);
  }, [state.notificationsEnabled, state.notificationSound, playNotificationSound]);

  const testNotification = useCallback(() => {
    showNotification('TimeKeeper', 'This is a test notification');
  }, [showNotification]);

  // Monitor timer completion for notifications
  useEffect(() => {
    if (state.time === 0 && state.mode !== 'stopwatch') {
      if (state.mode === 'timer') {
        showNotification('Timer Complete', 'Your timer has finished!');
      } else if (state.mode === 'pomodoro') {
        const message = state.currentSession === 'work' 
          ? 'Work session complete! Time for a break.'
          : 'Break time over! Ready for another work session?';
        showNotification('Pomodoro Session Complete', message);
      }
    }
  }, [state.time, state.mode, state.currentSession, showNotification]);

  return {
    showNotification,
    testNotification,
    playNotificationSound,
  };
}
