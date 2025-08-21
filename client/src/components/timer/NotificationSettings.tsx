import { useTimerContext } from '@/context/TimerContext';
import { useNotifications } from '@/hooks/useNotifications';
import { Bell } from 'lucide-react';
import type { NotificationSound } from '@/context/TimerContext';

export function NotificationSettings() {
  const { state, dispatch } = useTimerContext();
  const { testNotification } = useNotifications();

  const handleSoundChange = (sound: NotificationSound) => {
    dispatch({ type: 'SET_NOTIFICATION_SOUND', payload: sound });
  };

  const handleToggleNotifications = () => {
    dispatch({ type: 'TOGGLE_NOTIFICATIONS' });
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Notifications</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Notification Sound
          </label>
          <select
            data-testid="select-notification-sound"
            className="w-full py-3 px-4 bg-system-gray-6 dark:bg-gray-700 rounded-xl border-0 text-gray-900 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-system-blue transition-all"
            value={state.notificationSound}
            onChange={(e) => handleSoundChange(e.target.value as NotificationSound)}
          >
            <option value="default">Default</option>
            <option value="chime">Gentle Chime</option>
            <option value="bell">Bell</option>
          </select>
        </div>
        
        <div className="flex items-center justify-between py-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Browser Notifications
          </span>
          <button
            data-testid="toggle-notifications"
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              state.notificationsEnabled
                ? 'bg-system-blue'
                : 'bg-system-gray dark:bg-gray-600'
            }`}
            onClick={handleToggleNotifications}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                state.notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        
        <button
          data-testid="button-test-notification"
          className="w-full py-3 px-4 bg-system-gray-6 dark:bg-gray-700 text-system-gray dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
          onClick={testNotification}
        >
          <Bell className="w-4 h-4 inline mr-2" />
          Test Notification
        </button>
      </div>
    </div>
  );
}
