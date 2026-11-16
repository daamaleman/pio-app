import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from '@/components/localized-native';

import { BrandIcon, PioMark, Screen, palette } from '@/components/pio-ui';
import { StudentNavSpacer } from '@/components/student-nav';
import { learningCards, type LearningCard } from '@/features/student/toolbox-content';

export default function CardsScreen() {
  const [printReady, setPrintReady] = useState(false);
  return <Screen color="#FFFCF7" footer={<StudentNavSpacer />}>
    <View style={styles.top}><Pressable onPress={() => router.back()} style={styles.round}><BrandIcon name="back" color={palette.ink} /></Pressable><Pressable onPress={() => setPrintReady(true)} style={styles.print}><BrandIcon name="download" color={palette.ink} size={19} /><Text style={styles.printText}>Imprimir</Text></Pressable></View>
    <View style={styles.heading}><View style={styles.headingCopy}><Text style={styles.title}>Mis tarjetas</Text><Text style={styles.subtitle}><Text style={styles.count}>4 de 8</Text> · lo que aprendiste, para repasar cuando quieras.</Text></View><PioMark pose="success" size={78} /></View>
    {printReady ? <View style={styles.notice}><Text style={styles.noticeText}>✓ Tus 4 tarjetas están listas para repasar o imprimir con una persona adulta.</Text></View> : null}
    <View style={styles.grid}>{learningCards.map((card, index) => <LearningCardTile key={card.id} card={card} tilt={index % 2 === 0 ? '-1.5deg' : '1.5deg'} />)}</View>
  </Screen>;
}

function LearningCardTile({ card, tilt }: { card: LearningCard; tilt: string }) {
  return <Pressable disabled={card.locked} accessibilityRole="button" accessibilityState={{ disabled: card.locked }} onPress={() => router.push({ pathname: '/student/card/[id]', params: { id: card.id } })} style={({ pressed }) => [styles.tile, { backgroundColor: card.soft, transform: [{ rotate: tilt }] }, card.locked && styles.lockedTile, pressed && styles.pressed]}>
    {card.isNew ? <Text style={styles.newTag}>¡Nueva!</Text> : null}
    <View style={[styles.art, { backgroundColor: card.locked ? '#F7F5F2' : `${card.color}18` }]}>{card.locked ? <BrandIcon name="lock" color="#B6ADA1" size={31} /> : <><BrandIcon name={card.icon} color={card.color} size={54} /><PioMark pose={card.pose} size={47} style={styles.miniPio} /></>}</View>
    <Text style={[styles.eyebrow, { color: card.color }]}>TARJETA #{card.number} · SEMANA {card.week}</Text>
    <Text style={[styles.cardTitle, card.locked && styles.lockedText]}>{card.locked ? `Semana ${card.week}` : card.title}</Text>
  </Pressable>;
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, round: { width: 44, height: 44, borderRadius: 22, borderWidth: 1.5, borderColor: palette.line, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center' }, print: { minHeight: 42, borderRadius: 22, paddingHorizontal: 16, backgroundColor: '#FFF5CE', flexDirection: 'row', gap: 8, alignItems: 'center' }, printText: { color: palette.ink, fontFamily: 'Nunito_800ExtraBold', fontSize: 13 },
  heading: { flexDirection: 'row', alignItems: 'center', gap: 6 }, headingCopy: { flex: 1, gap: 4 }, title: { color: palette.ink, fontFamily: 'Baloo2_700Bold', fontSize: 31, lineHeight: 34 }, subtitle: { color: '#777169', fontFamily: 'Nunito_400Regular', fontSize: 13, lineHeight: 19 }, count: { color: '#B47A00', fontFamily: 'Nunito_800ExtraBold' }, notice: { backgroundColor: '#EAF4DF', borderRadius: 14, padding: 10 }, noticeText: { color: '#3D6E27', fontFamily: 'Nunito_700Bold', fontSize: 11, lineHeight: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 14, paddingBottom: 8 }, tile: { width: '48%', minHeight: 188, borderRadius: 22, borderWidth: 2.5, borderColor: palette.ink, padding: 10, gap: 7, overflow: 'hidden' }, lockedTile: { borderStyle: 'dashed', borderColor: '#D8D0C6', justifyContent: 'center' }, pressed: { opacity: .82 }, newTag: { position: 'absolute', right: -2, top: 4, zIndex: 2, backgroundColor: palette.roseDeep, color: '#FFF', fontFamily: 'Nunito_800ExtraBold', fontSize: 10, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 14 }, art: { height: 94, borderRadius: 16, alignItems: 'center', justifyContent: 'center' }, miniPio: { position: 'absolute', right: 5, bottom: 1 }, eyebrow: { fontFamily: 'Nunito_800ExtraBold', fontSize: 9, lineHeight: 12, letterSpacing: 1.1 }, cardTitle: { color: palette.ink, fontFamily: 'Baloo2_700Bold', fontSize: 16, lineHeight: 19 }, lockedText: { color: '#AAA095', textAlign: 'center' },
});
