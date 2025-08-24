# Timer & Stopwatch Tool

## Overview
A minimizable web-based timer and stopwatch tool with Pomodoro functionality. Users can minimize it to a corner widget showing time counting down or up. Includes adaptive Pomodoro sessions for extended work periods.

## Features
- Timer (countdown with hours/minutes/seconds input)
- Stopwatch (count up)
- Pomodoro sessions with adaptive intervals for extended work blocks
- Target hours setting (0.5-12 hours) with automatic session calculation
- Progress tracking with visual progress bar
- Auto-switching between work and break sessions
- Minimizable corner widget with smooth animations
- macOS-style notifications with 3 sound options (chime, bell, gentle)
- Keyboard arrow key controls for all number inputs
- Dark mode toggle
- Clean, simple interface with macOS-style design

## User Preferences
- Focus on simplicity and usability
- Prefer minimizable corner placement for continuous monitoring
- Wants adaptive Pomodoro for 4+ hour work stretches

## Project Architecture
- Frontend-focused application using React + TypeScript
- In-memory storage for session data
- Single-page application with timer controls
- Minimizable widget mode for corner placement

## Recent Changes
- Initial project setup (Aug 21, 2025)
- Fixed critical timer countdown issues - rebuilt with reliable 1-second intervals (Aug 21, 2025)
- Added complete Pomodoro functionality with adaptive sessions for extended work blocks (Aug 21, 2025)
- Implemented dark mode toggle and compact view for minimizable corner widget (Aug 21, 2025)
- Added target hours setting with flexible 0.5-12 hour range and progress tracking (Aug 21, 2025)
- Enhanced input controls with keyboard arrow key support for all number fields (Aug 23, 2025)
- Built minimizable corner widget with smooth animations and essential controls (Aug 23, 2025)
- Implemented macOS-style notifications with 3 sound options and permission handling (Aug 23, 2025)