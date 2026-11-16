import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Text } from '@/components/localized-native';

import { BrandIcon, Button, EmotionDot, PioMark, Screen, palette, type BrandIconName, type PioPose } from '@/components/pio-ui';
import { completeFirstUse, saveTrustedAdults, type TrustedAdultKind } from '@/features/access/first-use';
import { useAppState } from '@/lib/app-state';
import { t } from '@/lib/i18n';
import type { Emotion } from '@/lib/types';

const emotions: Emotion[] = ['joy', 'sadness', 'anger', 'fear', 'calm', 'love'];
const emotionPose: Record<Emotion, PioPose> = { joy: 'success', sadness: 'sad', anger: 'angry', fear: 'fear', calm: 'calm', love: 'love' };
const emotionResponse = {
  joy: { title: 'joyResponseTitle', body: 'joyResponseBody', background: '#FFF2C9', accent: '#F3B900' },
  sadness: { title: 'sadnessResponseTitle', body: 'sadnessResponseBody', background: '#E4F5FC', accent: '#45AEDA' },
  anger: { title: 'angerResponseTitle', body: 'angerResponseBody', background: '#FFE7E2', accent: '#E86F61' },
  fear: { title: 'fearResponseTitle', body: 'fearResponseBody', background: '#F2E7F5', accent: '#A777B5' },
  calm: { title: 'calmResponseTitle', body: 'calmResponseBody', background: '#E9F4DF', accent: '#70A948' },
  love: { title: 'loveResponseTitle', body: 'loveResponseBody', background: '#FDE7EF', accent: '#DD7397' },
} as const;
type AdultCopyKey = 'adultMother' | 'adultFather' | 'adultGrandparent' | 'adultTeacher' | 'adultUncleAunt' | 'adultOther';
const adults: { kind: TrustedAdultKind; key: AdultCopyKey; icon: BrandIconName; tone: string }[] = [
  { kind: 'mother', key: 'adultMother', icon: 'heart', tone: '#FDE7EF' },
  { kind: 'father', key: 'adultFather', icon: 'home', tone: '#E8EEFF' },
  { kind: 'grandparent', key: 'adultGrandparent', icon: 'smile', tone: '#FFF4D6' },
  { kind: 'teacher', key: 'adultTeacher', icon: 'book', tone: '#E4F5FC' },
  { kind: 'uncle_aunt', key: 'adultUncleAunt', icon: 'family', tone: '#E6F4E4' },
  { kind: 'other', key: 'adultOther', icon: 'star', tone: '#F3E8F6' },
];
const intensities = [
  { value: 'a_little', key: 'intensityLittle' },
  { value: 'quite', key: 'intensityQuite' },
  { value: 'a_lot', key: 'intensityALot' },
] as const;
const weekDays = [
  { number: '1', day: 'mondayShort' },
  { number: '', day: 'tuesdayShort' },
  { number: '2', day: 'wednesdayShort' },
  { number: '', day: 'thursdayShort' },
  { number: '3', day: 'fridayShort' },
] as const;

export default function FirstUseScreen() {
  const { session, language, setEmotion, skipCheckin } = useAppState();
  const [step, setStep] = useState(0);
  const [selectedAdults, setSelectedAdults] = useState<TrustedAdultKind[]>([]);
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion>();
  const [intensity, setIntensity] = useState<'a_little' | 'quite' | 'a_lot'>('quite');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const student = session.kind === 'student' ? session.student : undefined;

  useEffect(() => { if (session.kind === 'guest') router.replace('/access'); }, [session.kind]);
  if (!student) return null;

  const firstName = student.displayName.split(' ')[0];
  if (step === 0) return <Screen scroll={false} color="#FFF9F0" horizontalPadding={22} footer={<Button title={t('letsGo', language)} onPress={() => setStep(1)} />}>
    <ProgressDots active={0} />
    <View style={local.introContent}>
      <Image source={require('../../../assets/images/brand/first-use-intro-art.png')} resizeMode="contain" style={local.introArt} />
      <Text style={local.heroTitle}>{t('firstHello', language).replace('{name}', firstName)}</Text>
      <Text style={local.heroBody}>{t('firstPioIntro', language)}</Text>
    </View>
  </Screen>;

  if (step === 1) return <Screen scroll={false} color="#FFF9F0" horizontalPadding={22} footer={<Button title={t('continue', language)} onPress={() => setStep(2)} />}>
    <ProgressDots active={1} />
    <View style={local.weekCard}>
      <View style={local.weekHeading}><BrandIcon name="book" color={palette.ink} size={22} /><Text style={local.weekCardTitle}>{t('weekLesson', language)}</Text></View>
      <View style={local.weekSteps}>{weekDays.map((item) => <View key={item.day} style={local.weekStepWrap}><View style={[local.weekStep, !item.number && local.weekStepMuted]}><Text style={local.weekStepNumber}>{item.number}</Text></View><Text style={local.weekStepLabel}>{t(item.day, language)}</Text></View>)}</View>
      <Text style={local.weekCaption}>{t('threeMiniGames', language)}</Text>
    </View>
    <View style={local.explainWrap}><Text style={local.explainTitle}>{t('afterClassTitle', language)}</Text><Text style={local.explainBody}>{t('afterClassBody', language)}</Text></View>
  </Screen>;

  if (step === 2) return <Screen scroll={false} color="#FFF9F0" horizontalPadding={22} footer={<View style={local.footerStack}>{error ? <Text accessibilityRole="alert" style={local.error}>{error}</Text> : null}<Button title={saving ? t('saving', language) : t('readyToPlay', language)} disabled={selectedAdults.length < 2 || saving} onPress={async () => { setSaving(true); setError(''); try { await saveTrustedAdults(selectedAdults, student.id); setStep(3); } catch { setError(t('trustedAdultsError', language)); } finally { setSaving(false); } }} /></View>}>
    <ProgressDots active={2} />
      <View style={local.pioPrompt}><PioMark pose="story" size={72} style={local.promptPio} /><View style={local.promptBubble}><Text style={local.promptText}>{t('trustedPrompt', language)}</Text></View></View>
    <Text style={local.chooseHint}>{t('trustedChooseTwo', language)}</Text>
    <View style={local.adultGrid}>{adults.map((adult) => { const selected = selectedAdults.includes(adult.kind); return <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: selected }} key={adult.kind} onPress={() => setSelectedAdults((current) => selected ? current.filter((kind) => kind !== adult.kind) : [...current, adult.kind])} style={[local.adultCard, selected && local.adultSelected]}><View style={[local.adultIcon, { backgroundColor: adult.tone }]}><BrandIcon name={adult.icon} color={selected ? palette.roseDeep : palette.ink} size={24} /></View><Text style={local.adultLabel}>{t(adult.key, language)}</Text>{selected ? <View style={local.checkBadge}><Text style={local.checkText}>✓</Text></View> : null}</Pressable>; })}</View>
  </Screen>;

  if (step === 3) return <Screen scroll={false} color="#FFF9F0" horizontalPadding={22} footer={<Button title={t('tellPio', language)} disabled={!selectedEmotion} onPress={() => { if (!selectedEmotion) return; setEmotion(selectedEmotion, intensity); setStep(4); }} />}>
    <View style={local.pioPrompt}><PioMark pose="hello" size={72} style={local.promptPio} /><View style={local.promptBubble}><Text style={local.promptText}>{t('morningPrompt', language)}</Text></View></View>
    <View style={local.emotionGrid}>{emotions.map((emotion) => <View key={emotion} style={local.emotionCell}><EmotionDot emotion={emotion} language={language} selected={selectedEmotion === emotion} onPress={() => setSelectedEmotion(emotion)} style={local.emotionCard} /></View>)}</View>
    <Pressable accessibilityRole="button" onPress={() => { skipCheckin(); setSelectedEmotion(undefined); setStep(4); }}><Text style={local.skip}>{t('preferNotSay', language)}</Text></Pressable>
    <Text style={local.intensityLabel}>{t('intensityQuestion', language)}</Text>
    <View style={local.intensityRow}>{intensities.map((option) => <Pressable accessibilityRole="radio" accessibilityState={{ selected: intensity === option.value }} key={option.value} onPress={() => setIntensity(option.value)} style={[local.intensity, intensity === option.value && local.intensitySelected]}><Text style={[local.intensityText, intensity === option.value && local.intensityTextSelected]}>{t(option.key, language)}</Text></Pressable>)}</View>
    <View style={local.privacy}><BrandIcon name="heart" color={palette.teacherBlue} size={16} /><Text style={local.privacyText}>{t('privacyTeacher', language)}</Text></View>
  </Screen>;

  const response = selectedEmotion ? emotionResponse[selectedEmotion] : undefined;
  return <Screen scroll={false} color="#FFF9F0" horizontalPadding={22} footer={<Button title={t('goHome', language)} onPress={async () => { await completeFirstUse(student.id); router.replace('/student/home'); }} />}>
    <View style={local.responseContent}>
      <View style={local.responseFrame}>{selectedEmotion === 'joy' ? <Image source={require('../../../assets/images/brand/first-use-joy-art.png')} resizeMode="contain" style={local.joyArt} /> : <View style={[local.responseArt, { backgroundColor: response?.background ?? '#F3F0EA', borderColor: response?.accent ?? palette.line }]}><PioMark pose={selectedEmotion ? emotionPose[selectedEmotion] : 'hello'} size={168} style={local.responsePio} />{selectedEmotion ? <View style={local.responseDrop}><EmotionDot emotion={selectedEmotion} language={language} label={false} style={local.responseEmotion} /></View> : null}</View>}</View>
      <Text style={local.heroTitle}>{response ? t(response.title, language) : t('skipResponseTitle', language)}</Text>
      <Text style={local.heroBody}>{response ? t(response.body, language) : t('skipResponseBody', language)}</Text>
    </View>
  </Screen>;
}

function ProgressDots({ active }: { active: number }) {
  return <View style={local.progressDots}>{[0, 1, 2].map((index) => <View key={index} style={[local.progressDot, active === index && local.progressDotActive]} />)}</View>;
}

const local = StyleSheet.create({
  progressDots: { minHeight: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 2 },
  progressDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#DDD6CD' },
  progressDotActive: { width: 22, backgroundColor: palette.roseDeep },
  introContent: { flex: 1, alignItems: 'center', justifyContent: 'flex-start', gap: 12, paddingTop: 24 },
  introArt: { width: 248, height: 220 },
  heroTitle: { color: palette.ink, fontFamily: 'Baloo2_700Bold', fontSize: 25, lineHeight: 29, textAlign: 'center', maxWidth: 320 },
  heroBody: { color: palette.muted, fontFamily: 'Nunito_400Regular', fontSize: 14, lineHeight: 21, textAlign: 'center', maxWidth: 310 },
  weekCard: { borderRadius: 18, borderWidth: 1.5, borderColor: '#F1A7C0', backgroundColor: palette.white, padding: 14, gap: 10 },
  weekHeading: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 }, weekCardTitle: { color: palette.ink, fontFamily: 'Nunito_800ExtraBold', fontSize: 15 },
  weekSteps: { flexDirection: 'row', justifyContent: 'space-between' }, weekStepWrap: { alignItems: 'center', gap: 4 }, weekStep: { width: 34, height: 34, borderRadius: 17, backgroundColor: palette.rose, alignItems: 'center', justifyContent: 'center' }, weekStepMuted: { backgroundColor: '#E8E2DA' }, weekStepNumber: { color: palette.white, fontFamily: 'Nunito_800ExtraBold' }, weekStepLabel: { color: palette.muted, fontFamily: 'Nunito_400Regular', fontSize: 9 }, weekCaption: { color: palette.muted, fontFamily: 'Nunito_400Regular', fontSize: 11, textAlign: 'center' },
  explainWrap: { alignItems: 'center', gap: 9, paddingTop: 10, paddingHorizontal: 5 }, explainTitle: { color: palette.ink, fontFamily: 'Baloo2_700Bold', fontSize: 22, lineHeight: 26, textAlign: 'center' }, explainBody: { color: palette.muted, fontFamily: 'Nunito_400Regular', fontSize: 13, lineHeight: 19, textAlign: 'center' },
  pioPrompt: { flexDirection: 'row', alignItems: 'center', gap: 9, marginTop: 2 }, promptPio: { backgroundColor: palette.white, borderRadius: 36, alignSelf: 'auto' }, promptBubble: { flex: 1, borderRadius: 16, borderWidth: 1.2, borderColor: palette.line, backgroundColor: palette.white, padding: 13 }, promptText: { color: palette.ink, fontFamily: 'Nunito_700Bold', fontSize: 14, lineHeight: 19 },
  chooseHint: { color: palette.muted, fontFamily: 'Nunito_400Regular', fontSize: 12, textAlign: 'center' }, adultGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 10 }, adultCard: { position: 'relative', width: '31%', minHeight: 94, borderRadius: 16, borderWidth: 1.5, borderColor: palette.line, backgroundColor: palette.white, alignItems: 'center', justifyContent: 'center', gap: 7 }, adultSelected: { borderWidth: 2.3, borderColor: palette.rose, backgroundColor: '#FFF0F6' }, adultIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' }, adultLabel: { color: palette.ink, fontFamily: 'Nunito_800ExtraBold', fontSize: 11, textAlign: 'center' }, checkBadge: { position: 'absolute', top: 6, right: 6, width: 18, height: 18, borderRadius: 9, backgroundColor: palette.roseDeep, alignItems: 'center', justifyContent: 'center' }, checkText: { color: palette.white, fontFamily: 'Nunito_800ExtraBold', fontSize: 11 }, footerStack: { gap: 7 }, error: { color: '#B23551', fontFamily: 'Nunito_700Bold', fontSize: 12, textAlign: 'center' },
  emotionGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 8 }, emotionCell: { width: '48%' }, emotionCard: { width: '100%', minHeight: 78, borderRadius: 16 }, skip: { color: palette.teacherBlue, fontFamily: 'Nunito_700Bold', fontSize: 11, textAlign: 'center' }, intensityLabel: { color: palette.ink, fontFamily: 'Nunito_800ExtraBold', fontSize: 11, textTransform: 'uppercase' }, intensityRow: { flexDirection: 'row', gap: 7 }, intensity: { flex: 1, minHeight: 35, borderRadius: 18, borderWidth: 1.2, borderColor: palette.line, alignItems: 'center', justifyContent: 'center', backgroundColor: palette.white }, intensitySelected: { borderColor: palette.yellow, backgroundColor: '#FFF4D6' }, intensityText: { color: palette.muted, fontFamily: 'Nunito_700Bold', fontSize: 10 }, intensityTextSelected: { color: palette.ink }, privacy: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#F1EFEC', borderRadius: 15, paddingHorizontal: 12, paddingVertical: 7 }, privacyText: { color: palette.muted, fontFamily: 'Nunito_700Bold', fontSize: 11 },
  responseContent: { flex: 1, alignItems: 'center', justifyContent: 'flex-start', gap: 13, paddingTop: 56 }, responseFrame: { width: 252, height: 205, alignItems: 'center', justifyContent: 'center' }, joyArt: { width: 252, height: 198 }, responseArt: { position: 'relative', width: 202, height: 202, borderRadius: 101, borderWidth: 2, alignItems: 'center', justifyContent: 'center' }, responsePio: { backgroundColor: palette.white, borderRadius: 84 }, responseDrop: { position: 'absolute', right: -9, top: -7 }, responseEmotion: { minWidth: 58, width: 58, minHeight: 58, height: 58, padding: 4, borderRadius: 29, borderWidth: 3, borderColor: palette.white },
});
