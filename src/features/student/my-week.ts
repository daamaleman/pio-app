import { supabase } from '@/lib/supabase';
import type { AppLanguage, Emotion, Level, LessonStatus } from '@/lib/types';

export type WeekLesson = {
  slug: string;
  week: number;
  title: Partial<Record<AppLanguage, string>>;
  emotion: Emotion;
  duration_min: number;
  unlocked: boolean;
  status: LessonStatus;
  assignment_id: string | null;
  due_date: string | null;
};

export type StudentWeek = {
  today: string;
  student: { id: string; display_name: string; language: AppLanguage };
  group: { id: string; level: Level; grade: number; section: string; class_weekday: number | null; next_class_date: string | null };
  teacher_name: string | null;
  today_checkin: { emotion: Emotion | null; prefers_not_to_say: boolean; intensity: string | null; scale_1_5: number | null } | null;
  current: { assignment_id: string; lesson_slug: string; title: Partial<Record<AppLanguage, string>>; week: number; emotion: Emotion; duration_min: number; class_date: string; due_date: string; message: string | null; status: LessonStatus; current_position: number; parts: { part: number; status: LessonStatus; steps_done: number; steps_total: number }[] } | null;
  garden: { flowers: number; seeds: number; days_this_week: number };
  lessons: WeekLesson[];
};

export async function getMyWeek(): Promise<StudentWeek> {
  const { data, error } = await supabase.rpc('my_week');
  if (error) throw error;
  if (!data) throw new Error('my_week no devolvió datos.');
  return data as unknown as StudentWeek;
}
