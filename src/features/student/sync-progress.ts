import AsyncStorage from '@react-native-async-storage/async-storage';

import { supabase } from '@/lib/supabase';

type CheckinEvent = { date: string; context: 'daily' | 'lesson_start'; emotion?: string; intensity?: 'a_little' | 'quite' | 'a_lot'; scale_1_5?: number; prefers_not_to_say?: true };
type LessonEvent = { lesson_slug: string; content_version: number; current_position: number; device_updated_at: string; steps: { position: number; status: 'in_progress' | 'completed' | 'skipped'; device_updated_at?: string }[] };
type ProgressPayload = { checkins?: CheckinEvent[]; lessons?: LessonEvent[] };
const QUEUE_KEY = 'pio.progress.queue.v1';

function localDate() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

export async function queueDailyCheckin(emotion?: string, intensity?: 'a_little' | 'quite' | 'a_lot', scale_1_5?: number) {
  const checkin: CheckinEvent = scale_1_5
    ? { date: localDate(), context: 'daily', scale_1_5 }
    : emotion ? { date: localDate(), context: 'daily', emotion, intensity }
      : { date: localDate(), context: 'daily', prefers_not_to_say: true };
  await queueProgress({ checkins: [checkin] });
}

export async function queueLessonStep(lessonSlug: string, contentVersion: number, position: number, status: LessonEvent['steps'][number]['status'], currentPosition: number) {
  const timestamp = new Date().toISOString();
  await queueProgress({ lessons: [{
    lesson_slug: lessonSlug,
    content_version: contentVersion,
    current_position: currentPosition,
    device_updated_at: timestamp,
    steps: [{ position, status, device_updated_at: timestamp }],
  }] });
}

export async function queueProgress(payload: ProgressPayload) {
  const queue = await readQueue();
  queue.push(payload);
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  await flushProgressQueue();
}

export async function flushProgressQueue() {
  const queue = await readQueue();
  while (queue.length) {
    const { error } = await supabase.rpc('sync_progress', { p_payload: queue[0] });
    if (error) return;
    // Accepted and rejected rows both leave the queue, as required by the API.
    queue.shift();
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  }
  await AsyncStorage.removeItem(QUEUE_KEY);
}

async function readQueue(): Promise<ProgressPayload[]> {
  const raw = await AsyncStorage.getItem(QUEUE_KEY);
  if (!raw) return [];
  try {
    const value = JSON.parse(raw) as unknown;
    return Array.isArray(value) ? value as ProgressPayload[] : [];
  } catch {
    await AsyncStorage.removeItem(QUEUE_KEY);
    return [];
  }
}
