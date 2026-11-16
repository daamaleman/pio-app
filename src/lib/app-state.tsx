import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { demoLessons } from '@/lib/mock-data';
import type { AppLanguage, AppSession, Emotion, Lesson, StudentProfile, UserRole } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { verifyStudentPin, type ResolvedClass, type StudentPreview } from '@/features/access/student-login';
import { getMyWeek, type StudentWeek } from '@/features/student/my-week';
import { t } from '@/lib/i18n';
import { flushProgressQueue, queueDailyCheckin, queueLessonStep } from '@/features/student/sync-progress';

type AppState = {
  language: AppLanguage;
  session: AppSession;
  online: boolean;
  selectedStudent?: StudentProfile;
  resolvedClass?: ResolvedClass;
  studentWeek?: StudentWeek;
  studentWeekError?: string;
  lessons: Lesson[];
  todayEmotion?: Emotion;
  todayScale?: number;
  todaySkipped: boolean;
  setLanguage: (language: AppLanguage) => void;
  setResolvedClass: (resolvedClass: ResolvedClass) => void;
  selectStudent: (student: StudentPreview) => void;
  signInStudent: (pin: string) => Promise<void>;
  signInStaff: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  setEmotion: (emotion?: Emotion, intensity?: 'a_little' | 'quite' | 'a_lot') => void;
  setScaleCheckin: (scale: number) => void;
  skipCheckin: () => void;
  completeStep: (lessonSlug: string, position: number, contentVersion?: number, currentPosition?: number, status?: 'completed' | 'skipped', isLast?: boolean) => void;
  setOnline: (online: boolean) => void;
  refreshStudentWeek: () => Promise<void>;
};

const Context = createContext<AppState | null>(null);
const LANGUAGE_KEY = 'pio.language';
const appLanguages: AppLanguage[] = ['es', 'en', 'miq'];

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<AppLanguage>('es');
  const [languageChosen, setLanguageChosen] = useState(false);
  const [session, setSession] = useState<AppSession>({ kind: 'guest' });
  const [resolvedClass, setResolvedClassState] = useState<ResolvedClass>();
  const [studentWeek, setStudentWeek] = useState<StudentWeek>();
  const [studentWeekError, setStudentWeekError] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile>();
  const [lessons, setLessons] = useState<Lesson[]>(demoLessons);
  const [todayEmotion, setEmotion] = useState<Emotion>();
  const [todayScale, setTodayScale] = useState<number>();
  const [todaySkipped, setTodaySkipped] = useState(false);
  const [online, setOnline] = useState(true);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(LANGUAGE_KEY).then((saved) => {
      if (active && saved && appLanguages.includes(saved as AppLanguage)) {
        setLanguage(saved as AppLanguage);
        setLanguageChosen(true);
      }
    }).catch(() => undefined);
    return () => { active = false; };
  }, []);

  const chooseLanguage = useCallback((nextLanguage: AppLanguage) => {
    setLanguage(nextLanguage);
    setLanguageChosen(true);
    void AsyncStorage.setItem(LANGUAGE_KEY, nextLanguage);
    if (session.kind === 'student') {
      setSelectedStudent((current) => current ? { ...current, language: nextLanguage } : current);
      setSession((current) => current.kind === 'student' ? { ...current, student: { ...current.student, language: nextLanguage } } : current);
      void supabase.from('students').update({ language: nextLanguage }).eq('id', session.student.id);
    }
  }, [session]);

  const setResolvedClass = useCallback((result: ResolvedClass) => {
    setResolvedClassState(result);
    if (!languageChosen) {
      setLanguage(result.language);
      void AsyncStorage.setItem(LANGUAGE_KEY, result.language);
    }
  }, [languageChosen]);

  const chooseEmotion = useCallback((emotion?: Emotion, intensity?: 'a_little' | 'quite' | 'a_lot') => {
    setEmotion(emotion);
    setTodayScale(undefined);
    if (emotion) setTodaySkipped(false);
    if (session.kind === 'student') void queueDailyCheckin(emotion, intensity).catch(() => undefined);
  }, [session]);
  const chooseScaleCheckin = useCallback((scale: number) => {
    setTodayScale(scale); setEmotion(undefined); setTodaySkipped(false);
    if (session.kind === 'student') void queueDailyCheckin(undefined, undefined, scale).catch(() => undefined);
  }, [session]);
  const skipCheckin = useCallback(() => {
    setEmotion(undefined); setTodayScale(undefined);
    setTodaySkipped(true);
    if (session.kind === 'student') void queueDailyCheckin().catch(() => undefined);
  }, [session]);

  const selectStudent = useCallback((preview: StudentPreview) => {
    if (!resolvedClass) return;
    setSelectedStudent({
      id: preview.id,
      displayName: preview.display_name,
      level: resolvedClass.level,
      grade: resolvedClass.grade,
      section: resolvedClass.section,
      language,
      trustedAdults: [],
      accessibility: { textSize: 'normal', narration: false, reduceMotion: false },
    });
  }, [language, resolvedClass]);

  const signInStudent = useCallback(async (pin: string) => {
    if (!selectedStudent || !resolvedClass) throw new Error('Primero elegí un nombre de la lista de tu clase.');
    const verified = await verifyStudentPin(resolvedClass.group_id, selectedStudent.id, pin);
    const student = { ...selectedStudent, level: verified.level };
    setSelectedStudent(student);
    setSession({ kind: 'student', student, groupId: resolvedClass.group_id });
    void flushProgressQueue().catch(() => undefined);
    setStudentWeekError('');
    try {
      const week = await getMyWeek();
      setStudentWeek(week);
      setLessons(week.lessons.map((item) => {
        const demo = demoLessons.find((candidate) => candidate.slug === item.slug);
        return {
          slug: item.slug, week: item.week, level: week.group.level, title: item.title, emotion: item.emotion,
          duration: item.duration_min, parts: week.group.level === 'primary' ? 3 : 4, status: item.status,
          unlocked: item.unlocked, steps: demo?.steps ?? [],
        };
      }));
      setLanguage(week.student.language);
      setLanguageChosen(true);
      void AsyncStorage.setItem(LANGUAGE_KEY, week.student.language);
      setSelectedStudent((current) => current ? { ...current, language: week.student.language, grade: week.group.grade, section: week.group.section, level: week.group.level } : current);
      setSession((current) => current.kind === 'student' ? { ...current, student: { ...current.student, language: week.student.language, grade: week.group.grade, section: week.group.section, level: week.group.level } } : current);
      setEmotion(week.today_checkin?.emotion ?? undefined);
      setTodayScale(week.today_checkin?.scale_1_5 ?? undefined);
      setTodaySkipped(week.today_checkin?.prefers_not_to_say ?? false);
    } catch {
      setStudentWeek(undefined);
      setLessons([]);
      setStudentWeekError(t('weekLoadError', language));
    }
  }, [language, resolvedClass, selectedStudent]);

  const refreshStudentWeek = useCallback(async () => {
    if (session.kind !== 'student') return;
    setStudentWeekError('');
    try {
      const week = await getMyWeek();
      setStudentWeek(week);
      setLessons(week.lessons.map((item) => {
        const demo = demoLessons.find((candidate) => candidate.slug === item.slug);
        return { slug: item.slug, week: item.week, level: week.group.level, title: item.title, emotion: item.emotion, duration: item.duration_min, parts: week.group.level === 'primary' ? 3 : 4, status: item.status, unlocked: item.unlocked, steps: demo?.steps ?? [] };
      }));
    } catch { setStudentWeekError(t('weekRefreshError', language)); }
  }, [language, session]);

  const signInStaff = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) throw error;
    // The mobile MVP exposes the teacher screens. School leaders use the web portal.
    const { data: profile, error: profileError } = await supabase.from('profiles').select('role, full_name').eq('id', data.user.id).single();
    if (profileError || profile?.role !== 'teacher') {
      await supabase.auth.signOut();
      throw new Error(profileError?.message ?? 'Esta cuenta no tiene acceso al espacio docente de Pío.');
    }
    setSession({ kind: 'staff', role: profile.role as Exclude<UserRole, 'student'>, displayName: profile.full_name });
  }, []);
  const signOut = useCallback(async () => { await supabase.auth.signOut(); setSession({ kind: 'guest' }); setSelectedStudent(undefined); setResolvedClassState(undefined); setStudentWeek(undefined); setStudentWeekError(''); setLessons([]); setTodayScale(undefined); setEmotion(undefined); setTodaySkipped(false); }, []);

  const completeStep = useCallback((lessonSlug: string, position: number, contentVersion = 1, currentPosition = position + 1, status: 'completed' | 'skipped' = 'completed', isLast = false) => {
    setLessons((previous) => previous.map((lesson) => {
      if (lesson.slug !== lessonSlug) return lesson;
      // Algunas lecciones cargan sus pasos desde el contenido versionado, por lo
      // que la lista local puede estar vacía. Solo la pantalla de la lección
      // sabe con certeza si se llegó al último paso.
      return { ...lesson, status: isLast ? 'completed' : 'in_progress' };
    }));
    setStudentWeek((previous) => {
      if (!previous?.current || previous.current.lesson_slug !== lessonSlug) return previous;
      return { ...previous, current: { ...previous.current, current_position: Math.max(previous.current.current_position, currentPosition), status: isLast ? 'completed' : 'in_progress' } };
    });
    if (session.kind === 'student') void queueLessonStep(lessonSlug, contentVersion, position, status, currentPosition).catch(() => undefined);
  }, [session]);

  const value = useMemo(() => ({ language, session, online, selectedStudent, resolvedClass, studentWeek, studentWeekError, lessons, todayEmotion, todayScale, todaySkipped, setLanguage: chooseLanguage, setResolvedClass, selectStudent, signInStudent, signInStaff, signOut, setEmotion: chooseEmotion, setScaleCheckin: chooseScaleCheckin, skipCheckin, completeStep, setOnline, refreshStudentWeek }), [language, session, online, selectedStudent, resolvedClass, studentWeek, studentWeekError, lessons, todayEmotion, todayScale, todaySkipped, chooseLanguage, setResolvedClass, selectStudent, signInStudent, signInStaff, signOut, chooseEmotion, chooseScaleCheckin, skipCheckin, completeStep, refreshStudentWeek]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useAppState() {
  const state = useContext(Context);
  if (!state) throw new Error('useAppState must be used inside AppStateProvider');
  return state;
}

