export interface Reminder {
  id: string;
  patientId: string;
  category: 'medicine' | 'hydration' | 'meals' | 'exercise' | 'appointments' | 'family' | 'other';
  title: string;
  description: string;
  time: string;
  date: string;
  status: 'Upcoming' | 'Scheduled' | 'Completed' | 'Missed';
  repeat: string;
  enabled: boolean;
  translations?: Record<string, { title: string; description?: string }>;
}

export interface Activity {
  id: string;
  time: string;
  title: string;
  completed: boolean;
  isCurrent?: boolean;
  translations?: Record<string, { title: string; description?: string }>;
}

export interface Memory {
  id: string;
  patientId: string;
  title: string;
  description: string;
  date: string;
  category: 'family' | 'places' | 'events' | 'other';
  people: string;
  image: string | null;
}

export interface Contact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  avatarSeed: string;
}

export interface GameScore {
  gameId: string;
  gameName: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  progress: number;
  bestScore: number;
  completedToday: boolean;
}

export interface GameSession {
  sessionId: string;
  patientId: string;
  gameId: string;
  level: number;
  startedAt: string;
  completedAt: string | null;
  score: number;
  accuracy: number;
  mistakes: number;
  duration: number;
  completed: boolean;
}

export interface CaregiverAlert {
  id: string;
  type: 'warning' | 'success' | 'info';
  title: string;
  message?: string;
  createdAt: string;
}

export interface PatientSettings {
  textSize: 'normal' | 'large' | 'xlarge';
  highContrast: boolean;
  reduceMotion: boolean;
  voiceAssistant: boolean;
  language: string;
}
