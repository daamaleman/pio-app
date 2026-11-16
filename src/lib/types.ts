export type AppLanguage = 'es' | 'en' | 'miq';
export type UserRole = 'student' | 'teacher' | 'counselor' | 'director' | 'admin';
export type Emotion = 'joy' | 'sadness' | 'anger' | 'fear' | 'calm' | 'love';
export type Level = 'primary' | 'secondary';
export type LessonStatus = 'not_started' | 'in_progress' | 'completed';

export type StudentProfile = {
  id: string;
  displayName: string;
  level: Level;
  grade: number;
  section: string;
  language: AppLanguage;
  trustedAdults: string[];
  accessibility: { textSize: 'normal' | 'large'; narration: boolean; reduceMotion: boolean };
};

export type Lesson = {
  slug: string;
  week: number;
  level: Level;
  title: Partial<Record<AppLanguage, string>>;
  emotion: Emotion;
  duration: number;
  parts: number;
  status: LessonStatus;
  unlocked: boolean;
  steps: LessonStep[];
};

export type LessonStep = {
  position: number;
  part: number;
  kind: 'story' | 'concept' | 'worked_example' | 'minigame' | 'quiz' | 'poll' | 'application' | 'card' | 'home' | 'calm' | 'plan' | 'summary';
  title: Partial<Record<AppLanguage, string>>;
  body: Partial<Record<AppLanguage, string>>;
  private?: boolean;
  optional?: boolean;
};

export type AppSession =
  | { kind: 'guest' }
  | { kind: 'student'; student: StudentProfile; groupId: string }
  | { kind: 'staff'; role: Exclude<UserRole, 'student'>; displayName: string };
