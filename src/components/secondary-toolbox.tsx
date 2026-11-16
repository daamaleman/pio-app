import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from '@/components/localized-native';

import { BrandIcon, Chip, Screen, palette } from '@/components/pio-ui';
import { SecondaryChatPill } from '@/components/secondary-chat-pill';
import { StudentNavSpacer } from '@/components/student-nav';
import { NicaIllustration } from '@/components/nica-illustration';
import { toolboxItems, type ToolboxItem } from '@/features/student/toolbox-content';
import type { AppLanguage } from '@/lib/types';

type Filter = 'all' | ToolboxItem['kind'];

export function SecondaryToolbox({ language }: { language: AppLanguage }) {
  const [filter, setFilter] = useState<Filter>('all');
  const [rules, setRules] = useState(['Nada de celular en la mesa', 'Apago a las 9', 'Pregunto antes de subir fotos']);
  useEffect(() => { void AsyncStorage.getItem('pio:secondary:screen-rules').then((saved) => { if (!saved) return; try { const parsed = JSON.parse(saved) as { rules?: string[] }; if (parsed.rules?.length) setRules(parsed.rules.slice(0, 3)); } catch { /* keep curriculum defaults */ } }); }, []);
  const items = useMemo(() => toolboxItems.filter((item) => filter === 'all' || item.kind === filter), [filter]);
  return <Screen color="#F7F5F2" footer={<StudentNavSpacer />}>
    <View style={styles.hero}><Text style={styles.private}>SOLO VOS LA VES</Text><Text style={styles.heroTitle}>Mi caja de{`\n`}herramientas</Text><Text style={styles.heroBody}>Lo que armaste en tus retos, listo para cuando lo necesités.</Text><View style={styles.heroIcons}><NicaIllustration name="pot" width={66} height={68} /><NicaIllustration name="hammock" width={112} height={66} /></View></View>
    <View style={styles.filters}><View style={styles.filterCell}><Chip label="Todas" selected={filter === 'all'} onPress={() => setFilter('all')} /></View><View style={styles.filterCell}><Chip label="Planes" selected={filter === 'plan'} onPress={() => setFilter('plan')} /></View><View style={styles.filterCell}><Chip label="Técnicas" selected={filter === 'technique'} onPress={() => setFilter('technique')} /></View><View style={styles.filterCell}><Chip label="Calma" selected={filter === 'calm'} onPress={() => setFilter('calm')} /></View></View>
    <View style={styles.list}>{items.map((item) => <Pressable key={item.id} onPress={() => router.push({ pathname: '/student/tool/[id]', params: { id: item.id } })} style={({ pressed }) => [styles.item, { borderLeftColor: item.color }, pressed && styles.pressed]}><View style={styles.icon}><BrandIcon name={item.icon} color={palette.ink} size={25} /></View><View style={styles.itemCopy}><Text style={[styles.itemMeta, { color: item.color }]}>{labelKind(item.kind)} · SEMANA {item.week}</Text><Text style={styles.itemTitle}>{item.title}</Text>{item.id === 'screen-rules' ? <View style={styles.chips}>{rules.map((rule) => <Text key={rule} style={styles.chip}>{rule}</Text>)}</View> : <Text style={styles.description}>{item.description}</Text>}</View><Text style={styles.chevron}>›</Text></Pressable>)}</View>
    <Text style={styles.privacy}>🔒 Esta caja es privada. Tu docente puede ver que completaste una herramienta, pero no su contenido.</Text>
    <SecondaryChatPill language={language} />
  </Screen>;
}

function labelKind(kind: ToolboxItem['kind']) { return kind === 'plan' ? 'PLAN' : kind === 'technique' ? 'TÉCNICA' : kind === 'calm' ? 'CALMA' : 'DIARIO PRIVADO'; }

const styles = StyleSheet.create({
  hero: { minHeight: 205, borderRadius: 28, padding: 20, backgroundColor: '#263B83', overflow: 'hidden' }, private: { color: '#9FE2F7', fontFamily: 'Nunito_800ExtraBold', fontSize: 10, letterSpacing: 2 }, heroTitle: { color: '#FFF', fontFamily: 'Baloo2_700Bold', fontSize: 31, lineHeight: 32, marginTop: 8 }, heroBody: { maxWidth: '64%', color: '#E3E9FF', fontFamily: 'Nunito_400Regular', fontSize: 13, lineHeight: 19, marginTop: 9 }, heroIcons: { position: 'absolute', right: 4, top: 18, alignItems: 'center', gap: 0 },
  filters: { flexDirection: 'row', gap: 7 }, filterCell: { flex: 1 },
  list: { gap: 11 }, item: { minHeight: 116, borderRadius: 20, borderLeftWidth: 6, backgroundColor: '#FFF', padding: 14, flexDirection: 'row', alignItems: 'flex-start', gap: 11, shadowColor: '#594C40', shadowOpacity: .07, shadowRadius: 9, elevation: 2 }, pressed: { opacity: .78 }, icon: { width: 45, height: 45, borderRadius: 14, backgroundColor: '#E6F6FB', alignItems: 'center', justifyContent: 'center' }, itemCopy: { flex: 1, gap: 5 }, itemMeta: { fontFamily: 'Nunito_800ExtraBold', fontSize: 9, letterSpacing: 1.4 }, itemTitle: { color: palette.ink, fontFamily: 'Baloo2_700Bold', fontSize: 18, lineHeight: 21 }, description: { color: '#7A746D', fontFamily: 'Nunito_400Regular', fontSize: 11, lineHeight: 16 }, chevron: { color: '#9D958C', fontSize: 26 }, chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 }, chip: { backgroundColor: '#DDF3FA', color: '#0D6E94', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, fontFamily: 'Nunito_700Bold', fontSize: 8.5 }, privacy: { color: '#726D66', fontFamily: 'Nunito_400Regular', fontSize: 10, lineHeight: 15, textAlign: 'center' },
});
