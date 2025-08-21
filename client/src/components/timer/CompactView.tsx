import { useTimer } from '@/hooks/useTimer';
import { useTimerContext } from '@/context/TimerContext';
import { Play, Pause, Expand } from 'lucide-react';

export function CompactView() {
  const { state, dispatch } = useTimerContext();
  const { formatTime, toggle, isRunning } = useTimer();

  if (!state.isCompactMode) return null;

  const handleExpandView = () => {
    dispatch({ type: 'TOGGLE_COMPACT_MODE' });
  };

  const getModeLabel = () => {
    if (state.mode === 'pomodoro') {
      return state.currentSession === 'work' ? 'Work' : 'Break';
    }
    return state.mode.charAt(0).toUpperCase() + state.mode.slice(1);
  };

  return (
    <div
      data-testid="compact-view"
      className="fixed top-4 right-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 z-50"
    >
      <div className="flex items-center space-x-3">
        <div
          data-testid="compact-time-display"
          className="text-2xl font-mono font-light text-gray-900 dark:text-gray-100"
        >
          {formatTime(state.time)}
        </div>
        <div className="flex space-x-1">
          <button
            data-testid="compact-toggle-timer"
            className="w-6 h-6 bg-system-blue hover:bg-blue-600 rounded text-white text-xs transition-colors flex items-center justify-center"
            onClick={toggle}
          >
            {isRunning ? (
              <Pause className="w-3 h-3" />
            ) : (
              <Play className="w-3 h-3" />
            )}
          </button>
          <button
            data-testid="compact-expand-view"
            className="w-6 h-6 bg-system-gray-6 dark:bg-gray-600 rounded text-system-gray dark:text-gray-300 text-xs hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors flex items-center justify-center"
            onClick={handleExpandView}
          >
            <Expand className="w-3 h-3" />
          </button>
        </div>
      </div>
      <div
        data-testid="compact-mode-label"
        className="text-xs text-system-gray dark:text-gray-400 mt-1"
      >
        {getModeLabel()}
      </div>
    </div>
  );
}
