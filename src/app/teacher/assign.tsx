import { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { Text, TextInput } from '@/components/localized-native';

import { Button, Card, Screen, TopBar, palette } from '@/components/pio-ui';
import { supabase } from '@/lib/supabase';

type AssignmentDetails = { id: string; slug: string; week: number; title: Record<string, string>; duration_min: number; level: string; grade: number; section: string };
const dateValue = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
const addDays = (date: Date, days: number) => { const next = new Date(date); next.setDate(next.getDate() + days); return dateValue(next); };

export default function Assign() {
  const { groupId, lessonId } = useLocalSearchParams<{ groupId: string; lessonId: string }>();
  const [lesson, setLesson] = useState<AssignmentDetails>();
  const [groupName, setGroupName] = useState('');
  const [classDate, setClassDate] = useState(() => dateValue(new Date()));
  const [dueDate, setDueDate] = useState(() => addDays(new Date(), 7));
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    async function load() {
      if (!groupId || !lessonId) { setError('Falta seleccionar el grupo o la lección.'); setLoading(false); return; }
      const [groupResult, lessonResult] = await Promise.all([
        supabase.from('groups').select('grade, section').eq('id', groupId).single(),
        supabase.from('lessons').select('id, slug, week, title, duration_min, level, grade').eq('id', lessonId).single(),
      ]);
      if (!active) return;
      if (groupResult.error || lessonResult.error || !groupResult.data || !lessonResult.data) setError('No pudimos preparar la asignación. Volvé a la biblioteca e intentá otra vez.');
      else {
        setGroupName(`${groupResult.data.grade}.º ${groupResult.data.section}`);
        setLesson(lessonResult.data as unknown as AssignmentDetails);
      }
      setLoading(false);
    }
    void load();
    return () => { active = false; };
  }, [groupId, lessonId]);

  async function save() {
    if (!groupId || !lessonId || !lesson || saving) return;
    const validDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T12:00:00`));
    if (!validDate(classDate) || !validDate(dueDate) || dueDate < classDate) {
      setError('Revisá las fechas. Usá AAAA-MM-DD y asegurate de que la entrega sea el mismo día o después de la clase.');
      return;
    }
    setSaving(true); setError('');
    const { error: insertError } = await supabase.from('assignments').insert({
      group_id: groupId, lesson_id: lessonId, class_date: classDate, due_date: dueDate,
      message: message.trim() || null, mode: 'home', targets_all: true, notify_families: true, remind_day_before: true,
    });
    setSaving(false);
    if (insertError) {
      setError(insertError.code === '23505' ? 'Esta lección ya se asignó a este grupo.' : insertError.code === '23514' ? 'La lección no corresponde al nivel o grado de este grupo.' : 'No pudimos guardar la asignación. Revisá las fechas e intentá de nuevo.');
      return;
    }
    router.replace({ pathname: '/teacher/group', params: { groupId } });
  }

  return <Screen><TopBar title="Asignar lección" onBack={() => router.back()} />
    {loading ? <ActivityIndicator color={palette.teacherBlue} /> : null}
    {lesson ? <><Card tone="sky"><Text style={local.kicker}>SEMANA {lesson.week} · {lesson.duration_min} MIN</Text><Text style={local.title}>{lesson.title.es ?? lesson.slug}</Text><Text style={local.meta}>Grupo: {groupName}</Text></Card>
      <Card><Text style={local.label}>Fecha de clase</Text><TextInput accessibilityLabel="Fecha de clase, formato AAAA-MM-DD" value={classDate} onChangeText={setClassDate} placeholder="AAAA-MM-DD" style={local.input} /><Text style={local.label}>Fecha de entrega</Text><TextInput accessibilityLabel="Fecha de entrega, formato AAAA-MM-DD" value={dueDate} onChangeText={setDueDate} placeholder="AAAA-MM-DD" style={local.input} /><Text style={local.label}>Mensaje para el grupo (opcional)</Text><TextInput accessibilityLabel="Mensaje para el grupo" value={message} onChangeText={setMessage} multiline maxLength={240} placeholder="Escribí una nota para tu grupo" style={[local.input, local.multiline]} /></Card>
      <Text style={local.meta}>Se asignará a todo el grupo y se avisará a las familias.</Text>
    </> : null}
    {error ? <Text accessibilityRole="alert" style={local.error}>{error}</Text> : null}
    <Button title={saving ? 'Guardando…' : 'Asignar lección'} disabled={!lesson || loading || saving} onPress={save} />
  </Screen>;
}

const local = StyleSheet.create({ kicker: { color: palette.teacherBlue, fontFamily: 'Nunito_800ExtraBold', fontSize: 10, letterSpacing: 0.8 }, title: { color: palette.ink, fontFamily: 'Baloo2_700Bold', fontSize: 22 }, meta: { color: palette.muted, fontFamily: 'Nunito_400Regular', lineHeight: 20 }, label: { color: palette.ink, fontFamily: 'Nunito_800ExtraBold' }, input: { minHeight: 44, borderRadius: 12, borderWidth: 1, borderColor: palette.line, paddingHorizontal: 12, color: palette.ink, fontFamily: 'Nunito_400Regular', backgroundColor: palette.sand }, multiline: { minHeight: 76, paddingTop: 10, textAlignVertical: 'top' }, error: { color: '#B23551', fontFamily: 'Nunito_700Bold', lineHeight: 20 } });
