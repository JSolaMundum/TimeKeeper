import { useState } from 'react';
import { useSimpleTimer } from '@/hooks/useSimpleTimer';
import { useTheme } from '@/components/ThemeProvider';
import { Play, Pause, RotateCcw, Sun, Moon, Minimize2 } from 'lucide-react';

export function SimpleTimer() {
  const timer = useSimpleTimer();
  const { theme, toggleTheme } = useTheme();
  const [isCompact, setIsCompact] = useState(false);
  
  // Timer input state
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSecondsInput] = useState(0);

  const handleStart = () => {
    if (timer.mode === 'timer' && timer.currentTime === 0) {
      const totalSeconds = hours * 3600 + minutes * 60 + seconds;
      timer.setTimer(totalSeconds);
    }
    timer.start();
  };

  const handleModeChange = (mode: 'timer' | 'stopwatch' | 'pomodoro') => {
    timer.setMode(mode);
    if (mode === 'timer' && timer.currentTime === 0) {
      const totalSeconds = hours * 3600 + minutes * 60 + seconds;
      timer.setTimer(totalSeconds);
    }
  };

  if (isCompact) {
    return (
      <div className="fixed top-4 right-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 z-50">
        <div className="flex items-center space-x-3">
          <div className="text-2xl font-mono font-light text-gray-900 dark:text-gray-100">
            {timer.formatTime(timer.currentTime)}
          </div>
          <div className="flex space-x-1">
            <button
              className="w-6 h-6 bg-blue-500 hover:bg-blue-600 rounded text-white text-xs transition-colors flex items-center justify-center"
              onClick={timer.isRunning ? timer.pause : handleStart}
            >
              {timer.isRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            </button>
            <button
              className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded text-gray-700 dark:text-gray-300 text-xs hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors flex items-center justify-center"
              onClick={() => setIsCompact(false)}
            >
              <Minimize2 className="w-3 h-3" />
            </button>
          </div>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {timer.mode.charAt(0).toUpperCase() + timer.mode.slice(1)}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-md mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">TimeKeeper</h1>
          <div className="flex items-center space-x-2">
            <button
              className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              onClick={toggleTheme}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              onClick={() => setIsCompact(true)}
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-6 py-8">
        {/* Mode Selector */}
        <div className="mb-8">
          <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-1 flex" role="tablist">
            {(['timer', 'stopwatch', 'pomodoro'] as const).map((mode) => (
              <button
                key={mode}
                className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all ${
                  timer.mode === mode
                    ? 'bg-white dark:bg-gray-800 shadow-sm text-blue-600'
                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
                onClick={() => handleModeChange(mode)}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Timer Display */}
        <div className="mb-8 text-center">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
            <div className="text-6xl font-mono font-light text-gray-900 dark:text-gray-100 mb-2">
              {timer.formatTime(timer.currentTime)}
            </div>
            <div className="text-sm text-gray-500 font-medium uppercase tracking-wide">
              {timer.mode} Mode
            </div>
          </div>
        </div>

        {/* Timer Input (for timer mode) */}
        {timer.mode === 'timer' && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Set Timer</h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <label className="block text-xs font-medium text-gray-500 mb-2">HOURS</label>
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={hours}
                  onChange={(e) => setHours(parseInt(e.target.value) || 0)}
                  className="w-full text-center py-3 px-2 bg-gray-100 dark:bg-gray-700 rounded-xl border-0 text-lg font-mono text-gray-900 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
              <div className="text-center">
                <label className="block text-xs font-medium text-gray-500 mb-2">MINUTES</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={minutes}
                  onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
                  className="w-full text-center py-3 px-2 bg-gray-100 dark:bg-gray-700 rounded-xl border-0 text-lg font-mono text-gray-900 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
              <div className="text-center">
                <label className="block text-xs font-medium text-gray-500 mb-2">SECONDS</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={seconds}
                  onChange={(e) => setSecondsInput(parseInt(e.target.value) || 0)}
                  className="w-full text-center py-3 px-2 bg-gray-100 dark:bg-gray-700 rounded-xl border-0 text-lg font-mono text-gray-900 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="mb-6">
          <div className="flex space-x-3">
            <button
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg active:scale-95 transition-all flex items-center justify-center space-x-2"
              onClick={timer.isRunning ? timer.pause : handleStart}
            >
              {timer.isRunning ? (
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
            
            <button
              className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-4 px-6 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 active:scale-95 transition-all"
              onClick={timer.reset}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}