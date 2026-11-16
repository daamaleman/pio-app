import { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import { Text } from '@/components/localized-native';

import { Card, Screen, TopBar, palette } from '@/components/pio-ui';
import { supabase } from '@/lib/supabase';

type Group = { level: 'primary' | 'secondary'; grade: number; section: string };
type LessonItem = { id: string; slug: string; week: number; title: Record<string, string>; emotion: string; duration_min: number };

export default function Library() {
  const { groupId } = useLocalSearchParams<{ groupId: string }>();
  const [group, setGroup] = useState<Group>();
  const [lessons, setLessons] = useState<LessonItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    async function load() {
      if (!groupId) { setError('Elegí un grupo antes de abrir la biblioteca.'); setLoading(false); return; }
      const { data: groupData, error: groupError } = await supabase.from('groups').select('level, grade, section').eq('id', groupId).single();
      if (groupError || !groupData) { if (active) { setError('No encontramos ese grupo.'); setLoading(false); } return; }
      if (active) setGroup(groupData as Group);
      const { data: lessonData, error: lessonError } = await supabase.from('lessons').select('id, slug, week, title, emotion, duration_min').eq('level', groupData.level).eq('grade', groupData.grade).order('week');
      if (!active) return;
      if (lessonError) setError('No pudimos cargar las lecciones disponibles.');
      else setLessons((lessonData ?? []) as unknown as LessonItem[]);
      setLoading(false);
    }
    void load();
    return () => { active = false; };
  }, [groupId]);

  return <Screen><TopBar title="Biblioteca" onBack={() => router.back()} />
    {group ? <Text style={local.caption}>{group.grade}.º {group.section} · {group.level === 'primary' ? 'Primaria' : 'Secundaria'}</Text> : null}
    {loading ? <ActivityIndicator color={palette.teacherBlue} /> : null}
    {error ? <Text accessibilityRole="alert" style={local.error}>{error}</Text> : null}
    {!loading && !error && lessons.length === 0 ? <Card><Text style={local.meta}>No hay lecciones disponibles para este grupo todavía.</Text></Card> : null}
    {lessons.map((lesson, index) => <Pressable accessibilityRole="button" key={lesson.id} onPress={() => router.push({ pathname: '/teacher/assign', params: { groupId, lessonId: lesson.id } })}><Card tone={index % 2 ? 'sky' : 'white'}><Text style={local.week}>SEMANA {lesson.week}</Text><Text style={local.title}>{lesson.title.es ?? lesson.slug}</Text><Text style={local.meta}>{lesson.duration_min} min · {lesson.emotion}</Text><Text style={local.action}>Preparar asignación  ›</Text></Card></Pressable>)}
  </Screen>;
}

const local = StyleSheet.create({ caption: { color: palette.muted, fontFamily: 'Nunito_700Bold' }, week: { color: palette.roseDeep, fontFamily: 'Nunito_800ExtraBold', fontSize: 10, letterSpacing: 0.8 }, title: { color: palette.ink, fontFamily: 'Baloo2_700Bold', fontSize: 18 }, meta: { color: palette.muted, fontFamily: 'Nunito_400Regular', marginTop: 4 }, action: { color: palette.teacherBlue, fontFamily: 'Nunito_800ExtraBold', fontSize: 12, marginTop: 3 }, error: { color: '#B23551', fontFamily: 'Nunito_700Bold' } });
