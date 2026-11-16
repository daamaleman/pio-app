import { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { Text } from '@/components/localized-native';

import { Button, Card, Screen, TopBar, palette } from '@/components/pio-ui';
import { supabase } from '@/lib/supabase';

type Overview = {
  group: { id: string; level: 'primary' | 'secondary'; grade: number; section: string; class_code: string; school_name?: string };
  students: number;
  badges_earned: number;
  climate: { hidden: boolean; checkins?: number; declined?: number; distribution?: { emotion: string; count: number; pct: number }[] };
  assignments: { assignment_id: string; lesson_slug: string; title: Record<string, string>; week: number; due_date: string | null; targeted: number; completed: number }[];
};

const colors: Record<string, string> = { joy: palette.joy, sadness: palette.sadness, anger: palette.anger, fear: palette.fear, calm: palette.calm, love: palette.love };
const emotionNames: Record<string, string> = { joy: 'Alegría', sadness: 'Tristeza', anger: 'Enojo', fear: 'Miedo', calm: 'Calma', love: 'Cariño' };

export default function GroupScreen() {
  const { groupId } = useLocalSearchParams<{ groupId: string }>();
  const [overview, setOverview] = useState<Overview>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!groupId) return;
    let active = true;
    supabase.rpc('group_overview', { p_group_id: groupId }).then(({ data, error: rpcError }) => {
      if (!active) return;
      if (rpcError) setError('No pudimos cargar el resumen del grupo. Revisá la conexión.');
      else setOverview(data as unknown as Overview);
      setLoading(false);
    });
    return () => { active = false; };
  }, [groupId]);

  const climate = overview?.climate;
  return <Screen><TopBar title={overview ? `${overview.group.grade}.º ${overview.group.section}` : 'Grupo'} onBack={() => router.back()} />
    {!groupId ? <Text accessibilityRole="alert" style={local.error}>No encontramos este grupo. Volvé a elegirlo.</Text> : loading ? <ActivityIndicator color={palette.teacherBlue} /> : null}
    {error ? <Text accessibilityRole="alert" style={local.error}>{error}</Text> : null}
    {overview ? <>
      <Card tone="sky"><Text style={local.big}>{overview.students} estudiantes</Text><Text style={local.meta}>{overview.group.school_name ?? 'Grupo activo'} · Código {overview.group.class_code}</Text><Text style={local.meta}>{overview.badges_earned} sellos obtenidos</Text></Card>
      <Card><Text style={local.title}>Cómo se sintió el grupo</Text>{climate?.hidden ? <Text style={local.meta}>Todavía hay pocas respuestas esta semana para mostrar un resumen.</Text> : <><Text style={local.meta}>{climate?.checkins ?? 0} respuestas · {climate?.declined ?? 0} prefirieron no responder</Text>{climate?.distribution?.map((item) => <View key={item.emotion} style={local.moodRow}><View style={[local.moodDot, { backgroundColor: colors[item.emotion] ?? palette.line }]} /><Text style={local.moodName}>{emotionNames[item.emotion] ?? item.emotion}</Text><View style={local.track}><View style={[local.fill, { width: `${Math.max(0, Math.min(100, item.pct))}%`, backgroundColor: colors[item.emotion] ?? palette.teacherBlue }]} /></View><Text style={local.percent}>{item.pct}%</Text></View>)}</>}</Card>
      <View style={local.sectionRow}><Text style={local.title}>Tareas activas</Text><Pressable onPress={() => router.push({ pathname: '/teacher/library', params: { groupId } })}><Text style={local.link}>Biblioteca  ›</Text></Pressable></View>
      {overview.assignments.map((assignment) => <Pressable accessibilityRole="button" key={assignment.assignment_id} onPress={() => router.push({ pathname: '/teacher/progress', params: { assignmentId: assignment.assignment_id } })}><Card tone="white"><Text style={local.assignment}>Semana {assignment.week} · {assignment.title.es ?? assignment.lesson_slug}</Text><Text style={local.meta}>{assignment.completed} de {assignment.targeted} completaron</Text><View style={local.track}><View style={[local.fill, { width: `${assignment.targeted ? assignment.completed / assignment.targeted * 100 : 0}%`, backgroundColor: palette.teacherBlue }]} /></View></Card></Pressable>)}
      {!overview.assignments.length ? <Card><Text style={local.meta}>Todavía no hay una lección asignada a este grupo.</Text></Card> : null}
      <Button title="Ver alertas de apoyo" variant="secondary" onPress={() => router.push({ pathname: '/teacher/alerts', params: { groupId } })} />
      <Button title="Asignar una lección" onPress={() => router.push({ pathname: '/teacher/library', params: { groupId } })} />
    </> : null}
  </Screen>;
}

const local = StyleSheet.create({ big: { color: palette.ink, fontFamily: 'Baloo2_700Bold', fontSize: 27 }, meta: { color: palette.muted, fontFamily: 'Nunito_400Regular', lineHeight: 21 }, title: { color: palette.ink, fontFamily: 'Baloo2_700Bold', fontSize: 19 }, sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, link: { color: palette.teacherBlue, fontFamily: 'Nunito_800ExtraBold', fontSize: 12 }, moodRow: { minHeight: 30, flexDirection: 'row', alignItems: 'center', gap: 8 }, moodDot: { width: 13, height: 13, borderRadius: 7 }, moodName: { width: 75, color: palette.ink, fontFamily: 'Nunito_700Bold', fontSize: 12 }, track: { flex: 1, height: 8, borderRadius: 5, overflow: 'hidden', backgroundColor: palette.sand }, fill: { height: '100%', borderRadius: 5 }, percent: { width: 32, color: palette.muted, fontFamily: 'Nunito_700Bold', textAlign: 'right', fontSize: 11 }, assignment: { color: palette.ink, fontFamily: 'Baloo2_700Bold', fontSize: 16 }, error: { color: '#B23551', fontFamily: 'Nunito_700Bold', lineHeight: 20 } });
