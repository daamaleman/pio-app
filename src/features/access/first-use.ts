import AsyncStorage from '@react-native-async-storage/async-storage';

import { supabase } from '@/lib/supabase';

export type TrustedAdultKind = 'mother' | 'father' | 'grandparent' | 'teacher' | 'uncle_aunt' | 'other';

const completionKey = (studentId: string) => `pio.first-use.completed.${studentId}`;
const trustedAdultsKey = (studentId: string) => `pio.trusted-adults.${studentId}`;

export async function firstUseCompleted(studentId: string) {
  return (await AsyncStorage.getItem(completionKey(studentId))) === 'true';
}

export async function completeFirstUse(studentId: string) {
  await AsyncStorage.setItem(completionKey(studentId), 'true');
}

export async function saveTrustedAdults(adults: TrustedAdultKind[], studentId?: string) {
  const payload = adults.map((kind) => ({ kind }));
  const { error } = await supabase.rpc('set_trusted_adults', { p_adults: payload });
  if (error) throw error;
  if (studentId) await AsyncStorage.setItem(trustedAdultsKey(studentId), JSON.stringify(adults));
}

export async function loadSavedTrustedAdults(studentId: string): Promise<TrustedAdultKind[]> {
  const stored = await AsyncStorage.getItem(trustedAdultsKey(studentId));
  if (!stored) return [];
  try { return JSON.parse(stored) as TrustedAdultKind[]; } catch { return []; }
}
