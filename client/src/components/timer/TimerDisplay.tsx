import { useTimer } from '@/hooks/useTimer';
import { usePomodoro } from '@/hooks/usePomodoro';

export function TimerDisplay() {
  const { mode, time, formatTime, getProgress, currentSession } = useTimer();
  const { getCurrentSessionInfo } = usePomodoro();

  const getDisplayTime = () => {
    if (mode === 'stopwatch' || time > 0) {
      return formatTime(time);
    }
    return '00:00';
  };

  const getModeLabel = () => {
    if (mode === 'pomodoro') {
      return getCurrentSessionInfo();
    }
    return `${mode.charAt(0).toUpperCase() + mode.slice(1)} Mode`;
  };

  const progress = getProgress();

  return (
    <div className="mb-8 text-center">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
        <div
          data-testid="time-display"
          className="text-6xl font-mono font-light text-gray-900 dark:text-gray-100 mb-2"
        >
          {getDisplayTime()}
        </div>
        <div
          data-testid="mode-label"
          className="text-sm text-system-gray font-medium uppercase tracking-wide"
        >
          {getModeLabel()}
        </div>
        
        {/* Progress indicator */}
        <div className="mt-4 w-full bg-system-gray-6 dark:bg-gray-700 rounded-full h-1">
          <div
            data-testid="progress-bar"
            className={`h-1 rounded-full transition-all duration-1000 ${
              mode === 'pomodoro' && currentSession === 'break'
                ? 'bg-system-green'
                : 'bg-system-blue'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
