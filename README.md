# TimeKeeper ⏰

A minimizable web-based timer and stopwatch tool with adaptive Pomodoro functionality, designed for enhanced productivity and focus tracking.

![TimeKeeper Demo](https://via.placeholder.com/600x400/3B82F6/FFFFFF?text=TimeKeeper+Interface)

## Features

### Core Timer Modes
- **Timer** ⏰ - Countdown timer with hours/minutes/seconds input
- **Stopwatch** ⏱ - Count-up timer for time tracking
- **Pomodoro** 🍅 - Adaptive sessions with automatic work/break switching

### Productivity Features
- **Flexible Target Hours** - Set goals from 0.5 to 12 hours with automatic session calculation
- **Progress Tracking** - Visual progress bars and session counters
- **Auto-switching** - Seamless transitions between work and break sessions
- **Smart Session Planning** - Adapts Pomodoro intervals for extended work blocks

### User Experience
- **Minimizable Corner Widget** - Keep timer visible while working in other applications
- **Live Tab Titles** - See timer progress in browser tab (🍅 25:00, ☕ 05:00, ⏱ 10:23)
- **Keyboard Controls** - Arrow keys for quick time adjustments
- **macOS-style Notifications** - Browser notifications with 3 sound options (chime, bell, gentle)
- **Dark/Light Mode** - Complete theme support with smooth transitions

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/timekeeper.git
cd timekeeper
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5000](http://localhost:5000) in your browser

## Usage

### Basic Timer
1. Select "Timer" mode
2. Set your desired hours, minutes, and seconds
3. Click "Start" to begin countdown
4. Get notified when time is up

### Pomodoro Sessions
1. Select "Pomodoro" mode
2. Set your target work hours (0.5-12 hours)
3. Customize work and break durations if needed
4. Start your focused work session
5. Automatically switch between work and breaks

### Minimized Mode
- Click the minimize button (⬇) in the header
- Timer moves to corner widget showing time and controls
- Click maximize button to return to full view

### Notifications
- Enable notifications in the settings panel
- Choose from 3 sound options: Chime, Bell, or Gentle
- Test notifications before starting work sessions
- Notifications work even when tab is not active

## Keyboard Shortcuts

- **Arrow Up/Down** - Adjust time inputs
- **Space** - Start/Pause timer (when focused)
- **Escape** - Reset timer

## Technical Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Backend**: Express.js (for serving)

## Project Structure

```
timekeeper/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions
│   │   └── pages/          # Page components
├── server/                 # Backend Express server
├── shared/                 # Shared types and schemas
└── README.md
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Key Components

- **SimpleTimer** - Main timer interface component
- **useSimpleTimer** - Core timer logic and state management
- **ThemeProvider** - Dark/light mode functionality
- **Notification System** - Browser notifications with sound

## Browser Compatibility

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

**Note**: Notifications require user permission and HTTPS in production.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by the Pomodoro Technique by Francesco Cirillo
- Icons by [Lucide](https://lucide.dev/)
- Built with [Replit](https://replit.com)

---

**Made with ❤️ for productive developers**
