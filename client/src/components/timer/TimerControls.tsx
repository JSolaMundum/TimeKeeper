import { useTimer } from '@/hooks/useTimer';
import { Play, Pause, RotateCcw } from 'lucide-react';

export function TimerControls() {
  const { isRunning, toggle, reset } = useTimer();

  return (
    <div className="mb-6">
      <div className="flex space-x-3">
        {/* Start/Stop Button */}
        <button
          data-testid="button-toggle-timer"
          className="flex-1 bg-system-blue hover:bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg active:scale-95 transition-all flex items-center justify-center space-x-2"
          onClick={toggle}
        >
          {isRunning ? (
            <>
              <Pause className="w-4 h-4" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>Start</span>
            </>
          )}
        </button>
        
        {/* Reset Button */}
        <button
          data-testid="button-reset-timer"
          className="bg-system-gray-6 dark:bg-gray-700 text-system-gray dark:text-gray-300 py-4 px-6 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 active:scale-95 transition-all"
          onClick={reset}
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
