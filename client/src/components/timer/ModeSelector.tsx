import { useTimerContext } from '@/context/TimerContext';
import type { TimerMode } from '@/context/TimerContext';

export function ModeSelector() {
  const { state, dispatch } = useTimerContext();

  const handleModeChange = (mode: TimerMode) => {
    dispatch({ type: 'SET_MODE', payload: mode });
  };

  return (
    <div className="mb-8">
      <div className="bg-system-gray-6 dark:bg-system-gray-6 rounded-xl p-1 flex" role="tablist">
        <button
          data-testid="mode-timer"
          className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all ${
            state.mode === 'timer'
              ? 'bg-white dark:bg-gray-800 shadow-sm text-system-blue'
              : 'text-system-gray hover:text-gray-900 dark:hover:text-gray-100'
          }`}
          onClick={() => handleModeChange('timer')}
        >
          Timer
        </button>
        <button
          data-testid="mode-stopwatch"
          className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all ${
            state.mode === 'stopwatch'
              ? 'bg-white dark:bg-gray-800 shadow-sm text-system-blue'
              : 'text-system-gray hover:text-gray-900 dark:hover:text-gray-100'
          }`}
          onClick={() => handleModeChange('stopwatch')}
        >
          Stopwatch
        </button>
        <button
          data-testid="mode-pomodoro"
          className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all ${
            state.mode === 'pomodoro'
              ? 'bg-white dark:bg-gray-800 shadow-sm text-system-blue'
              : 'text-system-gray hover:text-gray-900 dark:hover:text-gray-100'
          }`}
          onClick={() => handleModeChange('pomodoro')}
        >
          Pomodoro
        </button>
      </div>
    </div>
  );
}
