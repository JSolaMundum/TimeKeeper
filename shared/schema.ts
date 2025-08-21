import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";

// Timer session types
export const TimerMode = z.enum(["timer", "stopwatch", "pomodoro"]);
export type TimerMode = z.infer<typeof TimerMode>;

export const PomodoroPhase = z.enum(["work", "shortBreak", "longBreak"]);
export type PomodoroPhase = z.infer<typeof PomodoroPhase>;

// Sound options
export const SoundOption = z.enum(["chime", "bell", "notification"]);
export type SoundOption = z.infer<typeof SoundOption>;

// Timer session configuration
export const TimerSessionSchema = z.object({
  id: z.string(),
  mode: TimerMode,
  isRunning: z.boolean(),
  isMinimized: z.boolean(),
  
  // Timer settings
  timerHours: z.number().min(0).max(23),
  timerMinutes: z.number().min(0).max(59),
  timerSeconds: z.number().min(0).max(59),
  
  // Current time remaining/elapsed (in seconds)
  currentTime: z.number(),
  
  // Pomodoro settings
  pomodoroWorkMinutes: z.number().min(1).max(180),
  pomodoroShortBreakMinutes: z.number().min(1).max(60),
  pomodoroLongBreakMinutes: z.number().min(1).max(120),
  pomodoroSessionsUntilLongBreak: z.number().min(1).max(10),
  
  // Adaptive Pomodoro settings for extended sessions
  adaptiveMode: z.boolean(),
  totalWorkHours: z.number().min(1).max(12),
  currentPomodoroSession: z.number(),
  currentPhase: PomodoroPhase,
  
  // Notification and sound settings
  notificationsEnabled: z.boolean(),
  selectedSound: SoundOption,
  
  // Timestamps
  startTime: z.number().nullable(),
  pausedAt: z.number().nullable(),
});

export type TimerSession = z.infer<typeof TimerSessionSchema>;

// Insert schemas
export const insertTimerSessionSchema = createInsertSchema(TimerSessionSchema as any).omit({
  id: true,
});

export type InsertTimerSession = z.infer<typeof insertTimerSessionSchema>;