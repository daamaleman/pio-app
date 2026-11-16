import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from '@/components/localized-native';

import { BrandIcon, Button, PioMark, Screen, palette } from '@/components/pio-ui';
import { NicaIllustration } from '@/components/nica-illustration';
import { learningCards } from '@/features/student/toolbox-content';

export default function LearningCardDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const card = learningCards.find((item) => item.id === id) ?? learningCards[2];
  const [narrating, setNarrating] = useState(false);
  const [printReady, setPrintReady] = useState(false);
  return <Screen color="#FFFCF7">
    <View style={styles.top}><Pressable onPress={() => router.back()} style={styles.round}><Text style={styles.close}>×</Text></Pressable><Text style={[styles.kicker, { color: card.color }]}>TARJETA #{card.number} · SEMANA {card.week}</Text><Pressable onPress={() => setNarrating((value) => !value)} style={styles.round}><BrandIcon name="speaker" color={palette.ink} /></Pressable></View>
    <View style={[styles.poster, { borderColor: palette.ink, backgroundColor: card.soft }]}><View style={styles.flags}><NicaIllustration name="flags" width={310} height={65} /></View><View style={styles.landscape}><NicaIllustration name={card.id === 'balloon-breath' ? 'hammock' : 'volcanoes'} width={155} height={100} /></View><View style={styles.posterArt}><BrandIcon name={card.icon} color={card.color} size={70} /><PioMark pose={card.pose} size={116} /></View></View>
    <Text style={styles.title}>{card.title}</Text>
    <View style={styles.steps}>{card.steps.map((step, index) => <View key={step.title} style={styles.step}><View style={[styles.number, { backgroundColor: step.color }]}><Text style={styles.numberText}>{index + 1}</Text></View><View style={styles.stepCopy}><Text style={styles.stepTitle}>{step.title}</Text><Text style={styles.stepBody}>{step.body}</Text></View></View>)}</View>
    <View style={styles.homeTip}><Text style={styles.homeIcon}>🏠</Text><Text style={styles.homeText}><Text style={styles.homeStrong}>Usala en casa: </Text>{card.homeTip}</Text></View>
    {narrating ? <Text style={styles.feedback}>🔊 Pío está leyendo la tarjeta. Tocá el parlante para pausar.</Text> : null}
    {printReady ? <Text style={styles.feedback}>✓ Tarjeta preparada. Pedile ayuda a una persona adulta para imprimirla.</Text> : null}
    <View style={styles.actions}><View style={styles.action}><Button title="Imprimir" variant="ghost" onPress={() => setPrintReady(true)} /></View><View style={styles.action}><Button title={narrating ? 'Pausar' : 'Escuchar'} onPress={() => setNarrating((value) => !value)} /></View></View>
  </Screen>;
}

const styles = StyleSheet.create({
  top: { minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 }, round: { width: 42, height: 42, borderRadius: 21, borderWidth: 1.5, borderColor: palette.line, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF' }, close: { color: palette.ink, fontFamily: 'Nunito_700Bold', fontSize: 27, lineHeight: 28 }, kicker: { flex: 1, textAlign: 'center', fontFamily: 'Nunito_800ExtraBold', letterSpacing: 1.5, fontSize: 11 },
  poster: { minHeight: 255, borderWidth: 3, borderRadius: 28, overflow: 'hidden', justifyContent: 'center' }, flags: { position: 'absolute', left: 0, right: 0, top: -4, height: 52, alignItems: 'center' }, landscape: { position: 'absolute', left: 7, bottom: 5 }, posterArt: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end', gap: 18, paddingTop: 30, paddingRight: 18 }, title: { color: palette.ink, fontFamily: 'Baloo2_700Bold', fontSize: 28, lineHeight: 32 },
  steps: { gap: 12 }, step: { flexDirection: 'row', alignItems: 'center', gap: 13 }, number: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' }, numberText: { color: '#FFF', fontFamily: 'Baloo2_700Bold', fontSize: 23 }, stepCopy: { flex: 1 }, stepTitle: { color: palette.ink, fontFamily: 'Nunito_800ExtraBold', fontSize: 17 }, stepBody: { color: '#777169', fontFamily: 'Nunito_400Regular', fontSize: 13, lineHeight: 18 },
  homeTip: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 18, backgroundColor: '#FFF5CE', padding: 14 }, homeIcon: { fontSize: 24 }, homeText: { flex: 1, color: '#7C5800', fontFamily: 'Nunito_400Regular', fontSize: 13, lineHeight: 19 }, homeStrong: { fontFamily: 'Nunito_800ExtraBold' }, feedback: { color: '#3C6D28', backgroundColor: '#EAF4DF', padding: 10, borderRadius: 12, fontFamily: 'Nunito_700Bold', fontSize: 11 }, actions: { marginTop: 'auto', flexDirection: 'row', gap: 10, paddingTop: 8 }, action: { flex: 1 },
});
