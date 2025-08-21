import { createContext, useContext, useReducer, useEffect } from 'react';

export type TimerMode = 'timer' | 'stopwatch' | 'pomodoro';
export type NotificationSound = 'default' | 'chime' | 'bell';
export type PomodoroSession = 'work' | 'break';

interface TimerState {
  mode: TimerMode;
  isRunning: boolean;
  isCompactMode: boolean;
  time: number; // in seconds
  
  // Timer settings
  timerHours: number;
  timerMinutes: number;
  timerSeconds: number;
  
  // Pomodoro settings
  pomodoroWork: number; // in minutes
  pomodoroBreak: number; // in minutes
  targetHours: number;
  currentSession: PomodoroSession;
  completedSessions: number;
  totalSessions: number;
  
  // Notification settings
  notificationSound: NotificationSound;
  notificationsEnabled: boolean;
}

type TimerAction =
  | { type: 'SET_MODE'; payload: TimerMode }
  | { type: 'TOGGLE_RUNNING' }
  | { type: 'RESET' }
  | { type: 'SET_TIME'; payload: number }
  | { type: 'TICK' }
  | { type: 'TOGGLE_COMPACT_MODE' }
  | { type: 'SET_TIMER_HOURS'; payload: number }
  | { type: 'SET_TIMER_MINUTES'; payload: number }
  | { type: 'SET_TIMER_SECONDS'; payload: number }
  | { type: 'SET_POMODORO_WORK'; payload: number }
  | { type: 'SET_POMODORO_BREAK'; payload: number }
  | { type: 'SET_TARGET_HOURS'; payload: number }
  | { type: 'SET_NOTIFICATION_SOUND'; payload: NotificationSound }
  | { type: 'TOGGLE_NOTIFICATIONS' }
  | { type: 'NEXT_POMODORO_SESSION' }
  | { type: 'LOAD_STATE'; payload: Partial<TimerState> };

const initialState: TimerState = {
  mode: 'timer',
  isRunning: false,
  isCompactMode: false,
  time: 0,
  timerHours: 0,
  timerMinutes: 25,
  timerSeconds: 0,
  pomodoroWork: 25,
  pomodoroBreak: 5,
  targetHours: 4,
  currentSession: 'work',
  completedSessions: 0,
  totalSessions: 8,
  notificationSound: 'default',
  notificationsEnabled: true,
};

function timerReducer(state: TimerState, action: TimerAction): TimerState {
  switch (action.type) {
    case 'SET_MODE':
      return { ...state, mode: action.payload, isRunning: false };
    
    case 'TOGGLE_RUNNING':
      return { ...state, isRunning: !state.isRunning };
    
    case 'RESET':
      let resetTime = 0;
      if (state.mode === 'timer') {
        resetTime = state.timerHours * 3600 + state.timerMinutes * 60 + state.timerSeconds;
      } else if (state.mode === 'pomodoro') {
        resetTime = state.currentSession === 'work' ? state.pomodoroWork * 60 : state.pomodoroBreak * 60;
      }
      return { ...state, time: resetTime, isRunning: false };
    
    case 'SET_TIME':
      return { ...state, time: action.payload };
    
    case 'TICK':
      if (!state.isRunning) return state;
      
      if (state.mode === 'stopwatch') {
        return { ...state, time: state.time + 1 };
      } else {
        const newTime = Math.max(0, state.time - 1);
        if (newTime === 0 && state.time > 0) {
          // Timer finished
          return { ...state, time: newTime, isRunning: false };
        }
        return { ...state, time: newTime };
      }
    
    case 'TOGGLE_COMPACT_MODE':
      return { ...state, isCompactMode: !state.isCompactMode };
    
    case 'SET_TIMER_HOURS':
      return { ...state, timerHours: action.payload };
    
    case 'SET_TIMER_MINUTES':
      return { ...state, timerMinutes: action.payload };
    
    case 'SET_TIMER_SECONDS':
      return { ...state, timerSeconds: action.payload };
    
    case 'SET_POMODORO_WORK':
      return { ...state, pomodoroWork: action.payload };
    
    case 'SET_POMODORO_BREAK':
      return { ...state, pomodoroBreak: action.payload };
    
    case 'SET_TARGET_HOURS':
      const totalSessions = Math.ceil((action.payload * 60) / state.pomodoroWork) * 2; // work + break pairs
      return { ...state, targetHours: action.payload, totalSessions };
    
    case 'SET_NOTIFICATION_SOUND':
      return { ...state, notificationSound: action.payload };
    
    case 'TOGGLE_NOTIFICATIONS':
      return { ...state, notificationsEnabled: !state.notificationsEnabled };
    
    case 'NEXT_POMODORO_SESSION':
      const nextSession: PomodoroSession = state.currentSession === 'work' ? 'break' : 'work';
      const completedSessions = state.currentSession === 'work' ? state.completedSessions + 1 : state.completedSessions;
      const sessionTime = nextSession === 'work' ? state.pomodoroWork * 60 : state.pomodoroBreak * 60;
      
      return {
        ...state,
        currentSession: nextSession,
        completedSessions,
        time: sessionTime,
        isRunning: false,
      };
    
    case 'LOAD_STATE':
      return { ...state, ...action.payload };
    
    default:
      return state;
  }
}

const TimerContext = createContext<{
  state: TimerState;
  dispatch: React.Dispatch<TimerAction>;
} | null>(null);

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(timerReducer, initialState);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('timerState');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        dispatch({ type: 'LOAD_STATE', payload: parsedState });
      } catch (error) {
        console.error('Failed to load timer state:', error);
      }
    }
  }, []);

  // Save state to localStorage on changes
  useEffect(() => {
    localStorage.setItem('timerState', JSON.stringify({
      mode: state.mode,
      timerHours: state.timerHours,
      timerMinutes: state.timerMinutes,
      timerSeconds: state.timerSeconds,
      pomodoroWork: state.pomodoroWork,
      pomodoroBreak: state.pomodoroBreak,
      targetHours: state.targetHours,
      notificationSound: state.notificationSound,
      notificationsEnabled: state.notificationsEnabled,
    }));
  }, [state]);

  return (
    <TimerContext.Provider value={{ state, dispatch }}>
      {children}
    </TimerContext.Provider>
  );
}

export function useTimerContext() {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimerContext must be used within a TimerProvider');
  }
  return context;
}
