import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text, TextInput } from '@/components/localized-native';

import { BrandIcon, Screen, SectionTitle, TopBar, palette } from '@/components/pio-ui';
import { useAppState } from '@/lib/app-state';
import { t } from '@/lib/i18n';

const avatarColors = ['#701C7B', '#17A9DA', '#F36B21', '#00843D', '#FF5C93', '#3B51A1'];

export default function StudentScreen() {
  const { resolvedClass, language, selectStudent, selectedStudent } = useAppState();
  const [query, setQuery] = useState('');
  const students = resolvedClass?.students.filter((student) => student.display_name.toLocaleLowerCase().includes(query.toLocaleLowerCase())) ?? [];
  useEffect(() => { if (!resolvedClass) router.replace('/access/class-code'); }, [resolvedClass]);

  if (!resolvedClass) return <Screen><TopBar title={t('stepTwo', language)} onBack={() => router.back()} /><SectionTitle title="Primero necesitamos el código de tu clase" /></Screen>;

  return <Screen><TopBar title={t('stepTwo', language)} onBack={() => router.back()} /><SectionTitle title={t('chooseName', language)} />
    <View style={local.classChip}><Text style={local.classText}>{resolvedClass.grade}.º {t('grade', language)} {resolvedClass.section} · {t(resolvedClass.level, language)} · {t('school', language)}</Text></View>
    <View style={local.search}><BrandIcon name="search" color={palette.muted} size={18} /><TextInput accessibilityLabel={t('searchName', language)} placeholder={t('searchName', language)} placeholderTextColor={palette.muted} value={query} onChangeText={setQuery} style={local.searchInput} /></View>
    <View style={local.list}>{students.map((student, index) => <Pressable accessibilityRole="button" key={student.id} onPress={() => { selectStudent(student); router.push('/access/pin'); }}><View style={[local.personRow, selectedStudent?.id === student.id && local.personSelected]}><View style={[local.avatar, { backgroundColor: avatarColors[index % avatarColors.length] }]}><Text style={local.initials}>{student.display_name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()}</Text></View><View style={local.nameWrap}><Text style={local.name}>{student.display_name}</Text></View><Text style={local.arrow}>›</Text></View></Pressable>)}</View>
  </Screen>;
}

const local = StyleSheet.create({ classChip: { alignSelf: 'flex-start', borderRadius: 18, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#DDF3FB', borderWidth: 1, borderColor: palette.cyan }, classText: { color: palette.ink, fontFamily: 'Nunito_800ExtraBold', fontSize: 12 }, search: { height: 46, borderRadius: 23, borderWidth: 1.5, borderColor: palette.line, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 8 }, searchInput: { flex: 1, color: palette.ink, fontFamily: 'Nunito_400Regular' }, list: { gap: 3 }, personRow: { minHeight: 61, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 12, borderRadius: 16 }, personSelected: { backgroundColor: '#FFE3EE', borderWidth: 1.5, borderColor: palette.roseDeep }, avatar: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' }, initials: { fontFamily: 'Nunito_800ExtraBold', color: palette.white }, nameWrap: { flex: 1 }, name: { fontFamily: 'Nunito_800ExtraBold', fontSize: 15, color: palette.ink }, arrow: { color: palette.muted, fontFamily: 'Nunito_700Bold', fontSize: 25 } });
