import { toMiskituDraft } from '@/lib/miskitu-draft';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { Text } from '@/components/localized-native';
import Svg, { Circle, Ellipse, Line, Path, Rect } from 'react-native-svg';
import { BrandIcon, emotionColor, PioMark, Screen, palette } from '@/components/pio-ui';
import { StudentNavSpacer } from '@/components/student-nav';
import { SecondaryToolbox } from '@/components/secondary-toolbox';
import { useAppState } from '@/lib/app-state';
import { t } from '@/lib/i18n';
import { supabase } from '@/lib/supabase';
import type { Emotion } from '@/lib/types';
type GardenItem = {
    emotion: Emotion;
    planted_at: string;
};
export default function GardenScreen() {
    const { language, studentWeek, lessons, session } = useAppState();
    const flowerCount = studentWeek?.garden.flowers ?? 0;
    const completedWeeks = new Set(lessons.filter((lesson) => lesson.status === 'completed').map((lesson) => lesson.week)).size;
    const [gardenItems, setGardenItems] = useState<GardenItem[]>([]);
    const [selectedFlower, setSelectedFlower] = useState<Emotion>();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        let active = true;
        supabase.from('garden_items').select('emotion, planted_at').order('planted_at', { ascending: true }).then(({ data, error }) => {
            if (!active)
                return;
            if (!error)
                setGardenItems((data ?? []) as GardenItem[]);
            setLoading(false);
        });
        return () => { active = false; };
    }, []);
    if (session.kind === 'student' && session.student.level === 'secondary')
        return <SecondaryToolbox language={language}/>;
    const displayFlowers = gardenItems.length ? gardenItems : Array.from({ length: Math.min(flowerCount, 5) }, (_, index) => ({ emotion: (['joy', 'love', 'sadness', 'anger', 'calm'] as Emotion[])[index % 5], planted_at: String(index) }));
    const selectedFlowerName = selectedFlower ? { joy: 'Alegría', sadness: 'Tristeza', anger: 'Enojo', fear: 'Miedo', calm: 'Calma', love: 'Cariño' }[selectedFlower] : undefined;
    return <Screen color="#FFFCF7" footer={<StudentNavSpacer />}>
    <View style={local.heading}><Text style={local.title}>{t('gardenTitle', language)}</Text><Text style={local.subtitle}>{t('gardenDescription', language)}</Text></View>
    <View style={local.scene}><Svg width="100%" height="100%" viewBox="0 0 360 260" preserveAspectRatio="none"><Rect width="360" height="260" fill="#FFF1C9"/><Circle cx="52" cy="45" r="24" fill="#FFD454"/><Circle cx="52" cy="45" r="34" fill="#FFD454" opacity=".2"/><Path d="M18 86c0-10 9-18 20-18 5-12 23-15 32-4 14-3 26 7 26 19 0 2 0 3-1 5H18z" fill="#FFFDF5"/><Path d="M0 162 76 82l61 80z" fill="#B8DC8E"/><Path d="m72 162 92-101 98 101z" fill="#86BF56"/><Path d="M0 161h360v28H0z" fill="#E9D99E" opacity=".55"/><Line x1="26" y1="145" x2="26" y2="213" stroke="#678A48" strokeWidth="4"/><Line x1="101" y1="145" x2="101" y2="213" stroke="#678A48" strokeWidth="4"/><Line x1="176" y1="145" x2="176" y2="213" stroke="#678A48" strokeWidth="4"/><Line x1="251" y1="145" x2="251" y2="213" stroke="#678A48" strokeWidth="4"/><Line x1="326" y1="145" x2="326" y2="213" stroke="#678A48" strokeWidth="4"/><Line x1="12" y1="158" x2="348" y2="158" stroke="#678A48" strokeWidth="4"/><Path d="M0 194Q58 177 120 193t121 0q59-16 119 1v66H0z" fill="#B97C4B"/><Path d="M0 211q64-14 129 0t131 0 100 0" fill="none" stroke="#DCA46F" strokeWidth="3" opacity=".65"/><Ellipse cx="72" cy="230" rx="31" ry="7" fill="#8A5937" opacity=".22"/><Ellipse cx="178" cy="232" rx="35" ry="7" fill="#8A5937" opacity=".22"/><Ellipse cx="290" cy="229" rx="31" ry="7" fill="#8A5937" opacity=".22"/></Svg><View style={local.growChip}><Text style={local.growChipText}>🌱 {language === 'en' ? 'Your garden is growing!' : language === "miq" ? toMiskituDraft('¡Tu jardín está creciendo!') : '¡Tu jardín está creciendo!'}</Text></View><PioMark pose="success" size={84} style={local.flying}/>{loading ? <ActivityIndicator style={local.sceneLoading} color={palette.green}/> : null}<View style={local.planted}>{displayFlowers.slice(0, 6).map((flower, index) => <Pressable accessibilityRole="button" accessibilityLabel={selectedFlowerName ?? 'Flor'} key={`${flower.planted_at}-${index}`} onPress={() => setSelectedFlower(flower.emotion)} style={({ pressed }) => [pressed && { transform: [{ scale: 0.92 }] }]}><GardenSprout color={emotionColor[flower.emotion]} compact={index % 2 === 1}/></Pressable>)}</View></View>
    <View style={local.metrics}><View style={[local.metric, local.metricGreen]}><Text style={local.number}>{flowerCount}</Text><Text style={local.label}>{t('gardenFlowers', language)}</Text></View><View style={[local.metric, local.metricBlue]}><Text style={local.numberBlue}>{completedWeeks}</Text><Text style={local.label}>{t('gardenWeeks', language)}</Text></View></View>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 16, padding: 12, backgroundColor: '#FFF4D7' }}><BrandIcon name="plant" color={palette.green} size={26}/><View style={{ flex: 1 }}><Text style={{ color: palette.ink, fontFamily: 'Nunito_800ExtraBold', fontSize: 12 }}>{selectedFlowerName ? `${selectedFlowerName} floreció aquí` : 'Tocá una flor para conocerla'}</Text><Text style={{ color: '#726C63', fontFamily: 'Nunito_400Regular', fontSize: 10, marginTop: 2 }}>{selectedFlowerName ? 'Cada flor recuerda una emoción que pudiste reconocer.' : 'Cada actividad terminada ayuda a que tu jardín crezca.'}</Text></View></View>
    <View style={local.sealHeading}><Text style={local.sealTitle}>{language === 'en' ? 'MY CARDS' : language === "miq" ? toMiskituDraft('MIS TARJETAS') : 'MIS TARJETAS'}</Text><Pressable accessibilityRole="button" onPress={() => router.push('/student/cards')}><Text style={local.seeAll}>{t('seeAll', language)}</Text></Pressable></View>
    <View style={local.seals}><Seal icon="drop" tone="pink" label={language === 'en' ? 'Four drops' : language === "miq" ? toMiskituDraft('Las 4 gotas') : 'Las 4 gotas'}/><Seal icon="profile" tone="blue" label={language === 'en' ? 'My body warns me' : language === "miq" ? toMiskituDraft('Mi cuerpo me avisa') : 'Mi cuerpo me avisa'}/><Seal icon="traffic" tone="pink" label={language === 'en' ? 'Calm traffic light' : language === "miq" ? toMiskituDraft('Semáforo de calma') : 'Semáforo de calma'}/><Seal icon="drop" tone="blue" label={language === 'en' ? 'Balloon breath' : language === "miq" ? toMiskituDraft('Respiración globo') : 'Respiración globo'}/></View>
  </Screen>;
}
function Seal({ icon = 'lock', tone = 'plain', locked = false, label }: {
    icon?: 'family' | 'drop' | 'lock' | 'profile' | 'traffic';
    tone?: 'pink' | 'blue' | 'plain';
    locked?: boolean;
    label: string;
}) {
    return <View style={local.sealItem}><View style={[local.seal, tone === 'pink' && local.sealPink, tone === 'blue' && local.sealBlue]}><BrandIcon name={locked ? 'lock' : icon} color={locked ? '#B4A99B' : palette.ink} size={24}/></View><Text numberOfLines={2} style={[local.sealLabel, locked && local.sealLabelLocked]}>{label}</Text></View>;
}
function GardenSprout({ color, compact = false }: {
    color: string;
    compact?: boolean;
}) {
    return <View style={[local.sprout, compact && local.sproutCompact]}><View style={local.flowerHead}><View style={[local.petal, local.petalTop, { backgroundColor: color }]}/><View style={[local.petal, local.petalLeft, { backgroundColor: color }]}/><View style={[local.petal, local.petalRight, { backgroundColor: color }]}/><View style={[local.petal, local.petalBottom, { backgroundColor: color }]}/><View style={local.flowerCenter}/></View><View style={local.stem}/><View style={local.leaf}/></View>;
}
const local = StyleSheet.create({
    heading: { gap: 3 }, title: { color: palette.ink, fontFamily: 'Baloo2_700Bold', fontSize: 25, lineHeight: 29 }, subtitle: { color: '#656A79', fontFamily: 'Nunito_400Regular', fontSize: 12, lineHeight: 17 },
    scene: { height: 260, borderRadius: 24, overflow: 'hidden', backgroundColor: '#FFF1C6', position: 'relative', borderWidth: 1, borderColor: '#F4E3B7' }, growChip: { position: 'absolute', left: 13, top: 13, paddingHorizontal: 10, paddingVertical: 7, backgroundColor: '#FFFFFFE8', borderRadius: 15 }, growChipText: { color: palette.ink, fontFamily: 'Nunito_800ExtraBold', fontSize: 10 }, flying: { position: 'absolute', width: 84, height: 84, top: 34, right: 13 }, sceneLoading: { position: 'absolute', top: '45%', alignSelf: 'center' }, planted: { position: 'absolute', left: 20, right: 18, bottom: 22, height: 79, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end' }, sprout: { height: 75, width: 38, alignItems: 'center', justifyContent: 'flex-start' }, sproutCompact: { transform: [{ scale: 0.82 }], marginBottom: -5 }, flowerHead: { width: 31, height: 31, position: 'relative', alignItems: 'center', justifyContent: 'center' }, petal: { position: 'absolute', width: 13, height: 13, borderRadius: 8, borderWidth: 1.5, borderColor: palette.white }, petalTop: { top: 0 }, petalBottom: { bottom: 0 }, petalLeft: { left: 0 }, petalRight: { right: 0 }, flowerCenter: { width: 11, height: 11, borderRadius: 6, backgroundColor: palette.yellow, borderWidth: 1.5, borderColor: palette.white }, stem: { width: 4, height: 38, backgroundColor: palette.green, borderRadius: 2 }, leaf: { position: 'absolute', width: 14, height: 9, backgroundColor: palette.lime, borderTopLeftRadius: 10, borderBottomRightRadius: 10, top: 43, left: 3, transform: [{ rotate: '-28deg' }] },
    metrics: { flexDirection: 'row', gap: 10 }, metric: { flex: 1, borderRadius: 16, padding: 12, minHeight: 72, justifyContent: 'center' }, metricGreen: { backgroundColor: '#E9F4D9' }, metricBlue: { backgroundColor: '#DDF3FA' }, number: { color: '#367D28', fontFamily: 'Baloo2_700Bold', fontSize: 25, lineHeight: 27 }, numberBlue: { color: '#007DAE', fontFamily: 'Baloo2_700Bold', fontSize: 25, lineHeight: 27 }, label: { color: palette.ink, fontFamily: 'Nunito_700Bold', fontSize: 10 },
    sealHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, sealTitle: { color: palette.ink, fontFamily: 'Nunito_800ExtraBold', fontSize: 11, letterSpacing: 1 }, seeAll: { color: '#25429B', fontFamily: 'Nunito_800ExtraBold', fontSize: 11 }, seals: { flexDirection: 'row', justifyContent: 'space-between', gap: 7 }, sealItem: { flex: 1, alignItems: 'center', gap: 5 }, seal: { width: 56, height: 56, borderRadius: 28, borderWidth: 2, borderStyle: 'dashed', borderColor: '#D6CABC', backgroundColor: '#FFFDF9', alignItems: 'center', justifyContent: 'center' }, sealPink: { borderColor: palette.rose, backgroundColor: '#FFF0F6' }, sealBlue: { borderColor: palette.cyan, backgroundColor: '#EAF8FD' }, sealLabel: { minHeight: 28, color: palette.ink, fontFamily: 'Nunito_700Bold', fontSize: 8.5, lineHeight: 11, textAlign: 'center' }, sealLabelLocked: { color: '#A9A198' },
});
