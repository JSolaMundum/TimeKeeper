import { useTimerContext } from '@/context/TimerContext';
import { usePomodoro } from '@/hooks/usePomodoro';
import { useTimer } from '@/hooks/useTimer';
import { useNotifications } from '@/hooks/useNotifications';
import { useTheme } from '@/components/ThemeProvider';
import { ModeSelector } from '@/components/timer/ModeSelector';
import { TimerDisplay } from '@/components/timer/TimerDisplay';
import { TimerControls } from '@/components/timer/TimerControls';
import { NotificationSettings } from '@/components/timer/NotificationSettings';
import { CompactView } from '@/components/timer/CompactView';
import { Minimize2, Maximize2, Sun, Moon } from 'lucide-react';

export default function TimerPage() {
  const { state, dispatch } = useTimerContext();
  const { getCurrentSessionInfo, getSessionProgress } = usePomodoro();
  const { theme, toggleTheme } = useTheme();
  
  // Initialize timer and notifications hooks
  const timer = useTimer();
  useNotifications();

  const handleToggleCompactMode = () => {
    dispatch({ type: 'TOGGLE_COMPACT_MODE' });
  };

  const handleTimerInputChange = (field: 'hours' | 'minutes' | 'seconds', value: number) => {
    const clampedValue = Math.max(0, Math.min(value, field === 'hours' ? 23 : 59));
    
    switch (field) {
      case 'hours':
        dispatch({ type: 'SET_TIMER_HOURS', payload: clampedValue });
        break;
      case 'minutes':
        dispatch({ type: 'SET_TIMER_MINUTES', payload: clampedValue });
        break;
      case 'seconds':
        dispatch({ type: 'SET_TIMER_SECONDS', payload: clampedValue });
        break;
    }
  };

  const handlePomodoroInputChange = (field: 'work' | 'break' | 'target', value: number) => {
    const clampedValue = Math.max(1, value);
    
    switch (field) {
      case 'work':
        dispatch({ type: 'SET_POMODORO_WORK', payload: Math.min(clampedValue, 60) });
        break;
      case 'break':
        dispatch({ type: 'SET_POMODORO_BREAK', payload: Math.min(clampedValue, 30) });
        break;
      case 'target':
        dispatch({ type: 'SET_TARGET_HOURS', payload: Math.min(clampedValue, 12) });
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-system-gray-6 dark:from-gray-900 dark:to-gray-800">
      {/* Header with App Title and Minimize Controls */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-md mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-system-red rounded-full"></div>
            <div className="w-3 h-3 bg-system-orange rounded-full"></div>
            <div className="w-3 h-3 bg-system-green rounded-full"></div>
          </div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">TimeKeeper</h1>
          <div className="flex items-center space-x-2">
            <button
              data-testid="button-toggle-theme"
              className="text-system-gray hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              onClick={toggleTheme}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>
            <button
              data-testid="button-toggle-compact"
              className="text-system-gray hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              onClick={handleToggleCompactMode}
            >
              {state.isCompactMode ? (
                <Maximize2 className="w-4 h-4" />
              ) : (
                <Minimize2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Timer Interface */}
      <main className={`max-w-md mx-auto px-6 py-8 ${state.isCompactMode ? 'opacity-50 pointer-events-none' : ''}`}>
        <ModeSelector />
        <TimerDisplay />

        {/* Timer Input Controls */}
        {state.mode === 'timer' && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Set Timer</h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <label className="block text-xs font-medium text-system-gray mb-2">HOURS</label>
                <input
                  data-testid="input-timer-hours"
                  type="number"
                  min="0"
                  max="23"
                  value={state.timerHours}
                  onChange={(e) => handleTimerInputChange('hours', parseInt(e.target.value) || 0)}
                  className="w-full text-center py-3 px-2 bg-system-gray-6 dark:bg-gray-700 rounded-xl border-0 text-lg font-mono text-gray-900 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-system-blue transition-all"
                />
              </div>
              <div className="text-center">
                <label className="block text-xs font-medium text-system-gray mb-2">MINUTES</label>
                <input
                  data-testid="input-timer-minutes"
                  type="number"
                  min="0"
                  max="59"
                  value={state.timerMinutes}
                  onChange={(e) => handleTimerInputChange('minutes', parseInt(e.target.value) || 0)}
                  className="w-full text-center py-3 px-2 bg-system-gray-6 dark:bg-gray-700 rounded-xl border-0 text-lg font-mono text-gray-900 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-system-blue transition-all"
                />
              </div>
              <div className="text-center">
                <label className="block text-xs font-medium text-system-gray mb-2">SECONDS</label>
                <input
                  data-testid="input-timer-seconds"
                  type="number"
                  min="0"
                  max="59"
                  value={state.timerSeconds}
                  onChange={(e) => handleTimerInputChange('seconds', parseInt(e.target.value) || 0)}
                  className="w-full text-center py-3 px-2 bg-system-gray-6 dark:bg-gray-700 rounded-xl border-0 text-lg font-mono text-gray-900 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-system-blue transition-all"
                />
              </div>
            </div>
          </div>
        )}

        {/* Pomodoro Settings */}
        {state.mode === 'pomodoro' && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Pomodoro Settings</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-system-gray mb-2">WORK (MIN)</label>
                  <input
                    data-testid="input-pomodoro-work"
                    type="number"
                    min="1"
                    max="60"
                    value={state.pomodoroWork}
                    onChange={(e) => handlePomodoroInputChange('work', parseInt(e.target.value) || 1)}
                    className="w-full text-center py-3 px-2 bg-system-gray-6 dark:bg-gray-700 rounded-xl border-0 text-lg font-mono text-gray-900 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-system-blue transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-system-gray mb-2">BREAK (MIN)</label>
                  <input
                    data-testid="input-pomodoro-break"
                    type="number"
                    min="1"
                    max="30"
                    value={state.pomodoroBreak}
                    onChange={(e) => handlePomodoroInputChange('break', parseInt(e.target.value) || 1)}
                    className="w-full text-center py-3 px-2 bg-system-gray-6 dark:bg-gray-700 rounded-xl border-0 text-lg font-mono text-gray-900 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-system-blue transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-system-gray mb-2">TARGET HOURS</label>
                <input
                  data-testid="input-target-hours"
                  type="number"
                  min="1"
                  max="12"
                  value={state.targetHours}
                  onChange={(e) => handlePomodoroInputChange('target', parseInt(e.target.value) || 1)}
                  className="w-full text-center py-3 px-2 bg-system-gray-6 dark:bg-gray-700 rounded-xl border-0 text-lg font-mono text-gray-900 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-system-blue transition-all"
                />
              </div>
              <div className="bg-system-gray-6 dark:bg-gray-700 rounded-xl p-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-system-gray dark:text-gray-400">Current Session:</span>
                  <span
                    data-testid="text-current-session"
                    className="font-medium text-system-blue"
                  >
                    {getCurrentSessionInfo()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm mt-1">
                  <span className="text-system-gray dark:text-gray-400">Completed:</span>
                  <span
                    data-testid="text-completed-sessions"
                    className="font-medium text-gray-900 dark:text-gray-100"
                  >
                    {getSessionProgress()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <TimerControls />
        <NotificationSettings />

        {/* Minimize View Toggle */}
        <div className="border-t border-gray-100 dark:border-gray-700 pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Compact Mode</h4>
              <p className="text-sm text-system-gray dark:text-gray-400">Show minimal timer in corner</p>
            </div>
            <button
              data-testid="button-minimize"
              className="bg-system-gray-6 dark:bg-gray-700 text-system-gray dark:text-gray-300 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
              onClick={handleToggleCompactMode}
            >
              <Minimize2 className="w-4 h-4 inline mr-2" />
              Minimize
            </button>
          </div>
        </div>
      </main>

      <CompactView />
    </div>
  );
}
