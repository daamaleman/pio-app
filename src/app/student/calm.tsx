import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from '@/components/localized-native';

import { BrandIcon, Button, Card, PioMark, Screen, TopBar, palette, type BrandIconName } from '@/components/pio-ui';
import { useAppState } from '@/lib/app-state';
import { t } from '@/lib/i18n';

type ExerciseId = 'balloon' | 'traffic' | 'count' | 'hug' | 'hammock';
const exercises: { id: ExerciseId; title: string; icon: BrandIconName; tone: 'sky' | 'pink' | 'leaf' | 'yellow' }[] = [
  { id: 'balloon', title: 'balloonTitle', icon: 'drop', tone: 'sky' },
  { id: 'traffic', title: 'trafficTitle', icon: 'traffic', tone: 'pink' },
  { id: 'count', title: 'countTitle', icon: 'clock', tone: 'leaf' },
  { id: 'hug', title: 'hugTitle', icon: 'heart', tone: 'pink' },
  { id: 'hammock', title: 'hammockTitle', icon: 'hammock', tone: 'yellow' },
];
const breathPhases = [
  { label: 'breatheIn', seconds: 4 },
  { label: 'holdBreath', seconds: 2 },
  { label: 'breatheOut', seconds: 6 },
] as const;

export default function CalmScreen() {
  const { language } = useAppState();
  const [activeExercise, setActiveExercise] = useState<ExerciseId>();
  const [phase, setPhase] = useState(0);
  const [round, setRound] = useState(1);
  const [count, setCount] = useState(1);
  const currentPhase = breathPhases[phase];
  const active = exercises.find((exercise) => exercise.id === activeExercise);

  function begin(id: ExerciseId) {
    setActiveExercise(id); setPhase(0); setRound(1); setCount(1);
  }
  function next() {
    if (activeExercise === 'balloon') {
      if (phase < breathPhases.length - 1) setPhase((value) => value + 1);
      else if (round < 3) { setPhase(0); setRound((value) => value + 1); }
      else setActiveExercise(undefined);
      return;
    }
    if (activeExercise === 'count' && count < 10) { setCount((value) => value + 1); return; }
    setActiveExercise(undefined);
  }

  return <Screen color="#FFFCF7"><TopBar title={t('calmTitle', language)} onBack={() => activeExercise ? setActiveExercise(undefined) : router.back()} />
    {!active ? <>
      <View style={local.intro}><PioMark pose="calm" size={58} style={local.introPio} /><View style={local.introBubble}><Text style={local.introText}>{t('calmIntro', language)}</Text></View></View>
      <View style={local.grid}>{exercises.slice(0, 4).map((exercise) => <Pressable accessibilityRole="button" key={exercise.id} onPress={() => begin(exercise.id)} style={[local.tile, local[`tile_${exercise.tone}`]]}><BrandIcon name={exercise.icon} color={palette.ink} size={32} /><Text style={local.tileTitle}>{t(exercise.title, language)}</Text><Text style={local.duration}>1 min</Text></Pressable>)}</View>
      <Pressable accessibilityRole="button" onPress={() => begin('hammock')} style={local.hammock}><BrandIcon name="hammock" color={palette.ink} size={64} /><View style={local.hammockCopy}><Text style={local.tileTitle}>{t('hammockTitle', language)}</Text><Text style={local.duration}>{t('hammockHint', language)}</Text></View></Pressable>
      <Pressable accessibilityRole="button" onPress={() => router.push('/student/help')} style={local.adult}><BrandIcon name="family" color={palette.ink} size={22} /><Text style={local.adultText}>{t('calmSupport', language)}</Text><Text style={local.arrow}>›</Text></Pressable>
    </> : <>
      <View style={local.session}><PioMark pose={activeExercise === 'balloon' ? 'calm' : activeExercise === 'hug' ? 'love' : 'hello'} /><Text style={local.sessionTitle}>{t(active?.title ?? 'calmTitle', language)}</Text>
        {activeExercise === 'balloon' ? <><Text style={local.sessionBody}>{t('breathingHint', language)}</Text><View accessibilityLiveRegion="polite" style={local.circle}><Text style={local.number}>{currentPhase.seconds}</Text><Text style={local.action}>{t(currentPhase.label, language)}</Text></View><Text style={local.counter}>{t('round', language)} {round} {t('of', language)} 3 · {t('step', language)} {phase + 1} {t('of', language)} 3</Text></> : activeExercise === 'count' ? <><Text style={local.sessionBody}>{t('countGuidance', language)}</Text><View style={local.circle}><Text style={local.number}>{count}</Text></View></> : <Card tone={active?.tone ?? 'sky'}><Text style={local.sessionBody}>{t(`${activeExercise}Guidance`, language)}</Text><Text style={local.sessionBody}>{t(`${activeExercise}Closing`, language)}</Text></Card>}
      </View>
      <Button title={activeExercise === 'balloon' && phase === 2 && round === 3 || activeExercise !== 'balloon' && (activeExercise !== 'count' || count === 10) ? t('finish', language) : t('nextStep', language)} onPress={next} />
    </>}
  </Screen>;
}

const local = StyleSheet.create({ intro: { flexDirection: 'row', alignItems: 'center', gap: 9 }, introPio: { width: 58, height: 58, borderRadius: 29 }, introBubble: { flex: 1, minHeight: 62, borderRadius: 16, borderWidth: 1.5, borderColor: '#E8E2DC', backgroundColor: palette.white, paddingHorizontal: 14, justifyContent: 'center' }, introText: { color: palette.ink, fontFamily: 'Nunito_800ExtraBold', fontSize: 13, lineHeight: 18 }, grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'space-between' }, tile: { width: '48%', minHeight: 126, borderRadius: 20, padding: 15, gap: 6, justifyContent: 'center' }, tile_sky: { backgroundColor: '#DDF3FA' }, tile_pink: { backgroundColor: '#FDE0DF' }, tile_leaf: { backgroundColor: '#E8F3DA' }, tile_yellow: { backgroundColor: '#FCE0EC' }, tileTitle: { color: palette.ink, fontFamily: 'Baloo2_700Bold', fontSize: 16, lineHeight: 19 }, duration: { color: '#827D76', fontFamily: 'Nunito_400Regular', fontSize: 11 }, hammock: { minHeight: 100, flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 16, borderRadius: 20, backgroundColor: '#FFF7DD', borderWidth: 1, borderColor: '#F6E7AE' }, hammockCopy: { flex: 1 }, adult: { marginTop: 'auto', minHeight: 72, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, borderRadius: 18, backgroundColor: '#FFF3C8' }, adultText: { flex: 1, color: palette.ink, fontFamily: 'Nunito_800ExtraBold', fontSize: 11.5, lineHeight: 15 }, arrow: { color: palette.muted, fontFamily: 'Nunito_700Bold', fontSize: 24 }, session: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 }, sessionTitle: { color: palette.ink, fontFamily: 'Baloo2_700Bold', fontSize: 25, textAlign: 'center' }, sessionBody: { color: palette.ink, fontFamily: 'Nunito_400Regular', textAlign: 'center', lineHeight: 23 }, circle: { width: 178, height: 178, borderRadius: 89, backgroundColor: '#DFF3FB', borderWidth: 8, borderColor: '#B7E6F6', alignItems: 'center', justifyContent: 'center', marginVertical: 8, gap: 4 }, number: { color: palette.ink, fontFamily: 'Baloo2_700Bold', fontSize: 42 }, action: { color: palette.ink, fontFamily: 'Nunito_800ExtraBold', fontSize: 14, textAlign: 'center' }, counter: { color: palette.muted, fontFamily: 'Nunito_700Bold', fontSize: 12 } });
