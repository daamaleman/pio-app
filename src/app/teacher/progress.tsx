import { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { Text } from '@/components/localized-native';

import { Card, Screen, TopBar, palette } from '@/components/pio-ui';
import { supabase } from '@/lib/supabase';

type StudentProgress = { id: string; display_name: string; status: 'completed' | 'in_progress' | 'not_started'; completed_at: string | null; on_time: boolean | null; current_position: number; latest_emotion: string | null; indicators?: { number: number; name: Record<string, string>; result: 'achieved' | 'in_progress' | 'needs_support' | null }[] };
type ProgressData = { summary: { students: number; completed: number; in_progress: number; not_started: number; completed_pct: number; badges_earned: number }; students: StudentProgress[] };
type Filter = 'all' | 'completed' | 'pending';

export default function Progress() {
  const { assignmentId } = useLocalSearchParams<{ assignmentId: string }>();
  const [data, setData] = useState<ProgressData>();
  const [filter, setFilter] = useState<Filter>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    if (!assignmentId) return;
    supabase.rpc('assignment_progress', { p_assignment_id: assignmentId }).then(({ data: result, error: rpcError }) => {
      if (!active) return;
      if (rpcError) setError('No pudimos cargar el progreso de esta tarea.');
      else setData(result as unknown as ProgressData);
      setLoading(false);
    });
    return () => { active = false; };
  }, [assignmentId]);

  const visible = (data?.students ?? []).filter((student) => filter === 'all' || (filter === 'completed' ? student.status === 'completed' : student.status !== 'completed'));
  return <Screen><TopBar title="Progreso del grupo" onBack={() => router.back()} />
    {!assignmentId ? <Text accessibilityRole="alert" style={local.error}>Elegí una tarea del grupo para ver su progreso.</Text> : loading ? <ActivityIndicator color={palette.teacherBlue} /> : null}
    {error ? <Text accessibilityRole="alert" style={local.error}>{error}</Text> : null}
    {data ? <><Card tone="sky"><Text style={local.big}>{data.summary.completed_pct}% completado</Text><Text style={local.meta}>{data.summary.completed} de {data.summary.students} estudiantes · {data.summary.badges_earned} sellos</Text><View style={local.track}><View style={[local.fill, { width: `${Math.max(0, Math.min(100, data.summary.completed_pct))}%` }]} /></View></Card>
      <View style={local.filters}>{([{ id: 'all', label: 'Todas' }, { id: 'completed', label: `Terminaron · ${data.summary.completed}` }, { id: 'pending', label: `Pendientes · ${data.summary.students - data.summary.completed}` }] as const).map((item) => <Pressable key={item.id} onPress={() => setFilter(item.id)} style={[local.filter, filter === item.id && local.filterActive]}><Text style={[local.filterText, filter === item.id && local.filterTextActive]}>{item.label}</Text></Pressable>)}</View>
      {visible.map((student) => <Card key={student.id}><View style={local.studentRow}><View style={local.avatar}><Text style={local.initials}>{student.display_name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()}</Text></View><View style={local.studentCopy}><Text style={local.name}>{student.display_name}</Text><Text style={local.meta}>{student.status === 'completed' ? (student.on_time ? 'Completó a tiempo' : 'Lección completada') : student.status === 'in_progress' ? `En curso · paso ${student.current_position}` : 'Todavía no comienza'}</Text></View><View style={[local.statusDot, { backgroundColor: student.status === 'completed' ? palette.green : student.status === 'in_progress' ? palette.yellow : palette.line }]} /></View></Card>)}
      {!visible.length ? <Card><Text style={local.meta}>No hay estudiantes en esta categoría.</Text></Card> : null}
    </> : null}
  </Screen>;
}

const local = StyleSheet.create({ big: { color: palette.ink, fontFamily: 'Baloo2_700Bold', fontSize: 25 }, meta: { color: palette.muted, fontFamily: 'Nunito_400Regular', lineHeight: 20 }, track: { height: 9, borderRadius: 5, overflow: 'hidden', backgroundColor: palette.white }, fill: { height: '100%', backgroundColor: palette.teacherBlue, borderRadius: 5 }, filters: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 }, filter: { borderRadius: 15, paddingVertical: 8, paddingHorizontal: 11, backgroundColor: palette.white, borderWidth: 1, borderColor: palette.line }, filterActive: { backgroundColor: '#E8EAF4', borderColor: palette.teacherBlue }, filterText: { color: palette.muted, fontFamily: 'Nunito_700Bold', fontSize: 11 }, filterTextActive: { color: palette.teacherBlue }, studentRow: { flexDirection: 'row', alignItems: 'center', gap: 11 }, avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#E8EAF4', alignItems: 'center', justifyContent: 'center' }, initials: { color: palette.teacherBlue, fontFamily: 'Nunito_800ExtraBold', fontSize: 12 }, studentCopy: { flex: 1 }, name: { color: palette.ink, fontFamily: 'Nunito_800ExtraBold' }, statusDot: { width: 10, height: 10, borderRadius: 5 }, error: { color: '#B23551', fontFamily: 'Nunito_700Bold' } });
