import { FunctionsHttpError } from '@supabase/supabase-js';

import { supabase } from '@/lib/supabase';

export type StudentPreview = {
  id: string;
  display_name: string;
  avatar_key: string | null;
};

export type ResolvedClass = {
  group_id: string;
  level: 'primary' | 'secondary';
  grade: number;
  section: string;
  language: 'es' | 'en' | 'miq';
  students: StudentPreview[];
};

export type StudentLoginFailureCode = 'INVALID_PIN' | 'PIN_LOCKED' | 'PIN_NOT_SET' | 'STUDENT_NOT_FOUND' | 'INVALID_PIN_FORMAT' | 'INVALID_INPUT' | 'RATE_LIMITED' | 'UNKNOWN';

export class StudentLoginError extends Error {
  constructor(public readonly code: StudentLoginFailureCode, message: string, public readonly attemptsLeft?: number, public readonly retryAfterSeconds?: number) {
    super(message);
    this.name = 'StudentLoginError';
  }
}

/** Resuelve el código de seis caracteres antes de mostrar la lista de estudiantes. */
export async function resolveClass(classCode: string): Promise<ResolvedClass> {
  const { data, error } = await supabase.functions.invoke<ResolvedClass>('student-login/resolve-class', {
    body: { class_code: classCode },
  });

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error('La respuesta de resolve-class no contiene datos.');
  }

  return data;
}

/** Verifica el PIN, convierte la respuesta en una sesión real de Supabase y devuelve el nivel. */
export async function verifyStudentPin(groupId: string, studentId: string, pin: string): Promise<{ id: string; level: 'primary' | 'secondary' }> {
  const { data, error } = await supabase.functions.invoke<{ access_token: string; refresh_token: string; student: { id: string; level: 'primary' | 'secondary' } }>('student-login/verify', {
    body: { group_id: groupId, student_id: studentId, pin },
  });

  if (error) {
    if (error instanceof FunctionsHttpError) {
      try {
        const body = await error.context.json() as { error?: { code?: StudentLoginFailureCode; message?: string; attempts_left?: number; retry_after_seconds?: number } };
        const details = body.error;
        throw new StudentLoginError(details?.code ?? 'UNKNOWN', details?.message ?? 'No pudimos verificar el PIN.', details?.attempts_left, details?.retry_after_seconds);
      } catch (cause) {
        if (cause instanceof StudentLoginError) throw cause;
      }
    }
    throw new StudentLoginError('UNKNOWN', 'No pudimos verificar el PIN. Revisá tu conexión e intentá de nuevo.');
  }

  if (!data?.access_token || !data.refresh_token || !data.student) {
    throw new StudentLoginError('UNKNOWN', 'La respuesta de acceso está incompleta.');
  }

  const { error: sessionError } = await supabase.auth.setSession({ access_token: data.access_token, refresh_token: data.refresh_token });
  if (sessionError) throw sessionError;
  return data.student;
}

/** Comprueba si la persona adulta ya dejó el consentimiento inicial. */
export async function familyConsentAccepted(): Promise<boolean> {
  const { data, error } = await supabase.from('family_consents').select('accepted').maybeSingle();
  if (error) throw error;
  return data?.accepted === true;
}

export async function recordFamilyConsent(): Promise<void> {
  const { error } = await supabase.rpc('record_family_consent', { p_version: '2026-11', p_accepted: true });
  if (error) throw error;
}
