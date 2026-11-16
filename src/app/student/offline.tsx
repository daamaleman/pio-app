import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from '@/components/localized-native';

import { BrandIcon, Button, Card, PioMark, Screen, palette } from '@/components/pio-ui';
import { StudentNavSpacer } from '@/components/student-nav';

type OfflineView = 'home' | 'download' | 'ready';

export default function OfflineScreen() {
  const params = useLocalSearchParams<{ view?: string }>();
  const initial: OfflineView = params.view === 'download' ? 'download' : params.view === 'ready' ? 'ready' : 'home';
  const [view, setView] = useState<OfflineView>(initial);
  if (view === 'download') return <DownloadLesson onLater={() => setView('home')} onDone={() => setView('ready')} />;
  if (view === 'ready') return <ReadyOffline />;
  return <OfflineHome onDownload={() => setView('download')} />;
}

function OfflineHome({ onDownload }: { onDownload: () => void }) {
  return <Screen color="#F8F7F4" footer={<StudentNavSpacer />}><View style={styles.offlineBanner}><Text style={styles.offlineBadge}>Sin conexión · tus avances se guardan aquí</Text><View style={styles.bannerRow}><View style={{ flex: 1 }}><Text style={styles.hello}>¡Hola, María!</Text><Text style={styles.copy}>Podés seguir jugando sin internet.</Text></View><PioMark pose="hello" size={72} /></View></View><View style={styles.lessonCard}><Text style={styles.kicker}>DESCARGADA ✓</Text><Text style={styles.lessonTitle}>Me calmo y me controlo</Text><Button title="Jugar" onPress={() => router.push({ pathname: '/student/lesson/[slug]', params: { slug: 'p3-w2', position: '1' } })} /><Text style={styles.saved}>Tus avances se enviarán cuando vuelva la conexión.</Text></View><Card tone="yellow"><Text style={styles.small}>La lección de la semana 3 no está descargada todavía.</Text><Button title="Prepararla para después" variant="ghost" onPress={onDownload} /></Card></Screen>;
}

function DownloadLesson({ onLater, onDone }: { onLater: () => void; onDone: () => void }) {
  const [progress, setProgress] = useState(12);
  useEffect(() => { const timer = setInterval(() => setProgress((value) => Math.min(100, value + 8)), 350); return () => clearInterval(timer); }, []);
  useEffect(() => { if (progress === 100) { const timer = setTimeout(onDone, 600); return () => clearTimeout(timer); } }, [progress, onDone]);
  return <Screen color="#F8F7F4"><View style={styles.download}><PioMark pose="calm" size={150} /><Text style={styles.downloadTitle}>{progress < 100 ? 'Preparando tu lección…' : '¡Lección preparada!'}</Text><View style={styles.track}><View style={[styles.fill, { width: `${progress}%` }]} /></View><Text style={styles.progress}>{progress}% · {progress < 100 ? 'Falta poco' : 'Lista para usar sin conexión'}</Text><View style={styles.downloadTip}><BrandIcon name="download" size={20} color={palette.ink} /><Text style={styles.tipText}>Usá una red conocida. La descarga se guarda solo en este dispositivo.</Text></View></View><View style={styles.bottom}><Button title="Descargar después" variant="ghost" onPress={onLater} /></View></Screen>;
}

function ReadyOffline() {
  return <Screen color="#F8F7F4" footer={<StudentNavSpacer />}><View style={styles.ready}><View style={styles.hammock}><BrandIcon name="hammock" size={115} color={palette.ink} /><PioMark pose="calm" size={92} style={styles.hammockPio} /></View><Text style={styles.downloadTitle}>¡Estás al día!</Text><Text style={styles.copyCenter}>Pío está descansando en la hamaca. Tu próxima lección llegó después de la clase del jueves.</Text></View><View style={styles.quickActions}><Pressable onPress={() => router.push('/student/garden')} style={[styles.quick, { backgroundColor: '#7DBE41' }]}><BrandIcon name="garden" color={palette.white} /><Text style={styles.quickText}>Mi jardín</Text></Pressable><Pressable onPress={() => router.push('/student/calm')} style={[styles.quick, { backgroundColor: palette.cyan }]}><BrandIcon name="smile" color={palette.white} /><Text style={styles.quickText}>Calmarme</Text></Pressable></View></Screen>;
}

const styles = StyleSheet.create({ offlineBanner: { borderRadius: 22, overflow: 'hidden', backgroundColor: '#F6D9E6', padding: 14, gap: 7 }, offlineBadge: { alignSelf: 'center', color: palette.white, backgroundColor: palette.ink, borderRadius: 13, paddingHorizontal: 10, paddingVertical: 5, fontFamily: 'Nunito_800ExtraBold', fontSize: 8 }, bannerRow: { flexDirection: 'row', alignItems: 'center' }, hello: { color: palette.ink, fontFamily: 'Baloo2_700Bold', fontSize: 22 }, copy: { color: '#5E6576', fontFamily: 'Nunito_400Regular', fontSize: 11, lineHeight: 16 }, lessonCard: { borderRadius: 20, backgroundColor: palette.white, borderWidth: 1, borderColor: '#E2DDD6', padding: 14, gap: 9 }, kicker: { color: palette.roseDeep, fontFamily: 'Nunito_800ExtraBold', fontSize: 9, letterSpacing: 1 }, lessonTitle: { color: palette.ink, fontFamily: 'Baloo2_700Bold', fontSize: 21 }, saved: { color: '#77716C', fontFamily: 'Nunito_400Regular', fontSize: 9, textAlign: 'center' }, small: { color: palette.ink, fontFamily: 'Nunito_700Bold', fontSize: 11, lineHeight: 16 }, download: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 15 }, downloadTitle: { color: palette.ink, fontFamily: 'Baloo2_700Bold', fontSize: 23, textAlign: 'center' }, track: { width: '78%', height: 9, borderRadius: 5, overflow: 'hidden', backgroundColor: '#E5DFD8' }, fill: { height: '100%', borderRadius: 5, backgroundColor: palette.roseDeep }, progress: { color: '#77716C', fontFamily: 'Nunito_700Bold', fontSize: 10 }, downloadTip: { width: '88%', flexDirection: 'row', gap: 9, borderRadius: 16, backgroundColor: '#F1EFEB', padding: 12, alignItems: 'center' }, tipText: { flex: 1, color: '#6D6862', fontFamily: 'Nunito_400Regular', fontSize: 9.5, lineHeight: 14 }, bottom: { marginTop: 'auto' }, ready: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 }, hammock: { width: 220, height: 160, borderRadius: 24, backgroundColor: '#E8F4DA', alignItems: 'center', justifyContent: 'center', position: 'relative' }, hammockPio: { position: 'absolute', top: 24 }, copyCenter: { color: '#5E6576', fontFamily: 'Nunito_400Regular', fontSize: 11, lineHeight: 17, textAlign: 'center' }, quickActions: { flexDirection: 'row', gap: 10 }, quick: { flex: 1, minHeight: 54, borderRadius: 27, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7 }, quickText: { color: palette.white, fontFamily: 'Nunito_800ExtraBold', fontSize: 11 } });
