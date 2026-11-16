import { toMiskituDraft } from '@/lib/miskitu-draft';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from '@/components/localized-native';
import { PioMark, palette } from '@/components/pio-ui';
import type { AppLanguage } from '@/lib/types';
export function SecondaryChatPill({ language }: {
    language: AppLanguage;
}) {
    return <Pressable accessibilityRole="button" accessibilityLabel={language === 'en' ? 'Pío listens. Open the chat preview.' : language === "miq" ? toMiskituDraft('Pío te escucha. Abrir vista previa del chat.') : 'Pío te escucha. Abrir vista previa del chat.'} onPress={() => router.push('/student/listen')} style={({ pressed }) => [styles.pill, pressed && styles.pressed]}><View style={styles.avatar}><PioMark pose="story" size={44}/><View style={styles.online}/></View><Text style={styles.copy}><Text style={styles.title}>{language === 'en' ? 'Pío listens' : language === "miq" ? toMiskituDraft('Pío te escucha') : 'Pío te escucha'}</Text>{'\n'}<Text style={styles.meta}>{language === 'en' ? 'Chat · AI' : language === "miq" ? toMiskituDraft('Chat · IA') : 'Chat · IA'}</Text></Text></Pressable>;
}
const styles = StyleSheet.create({ pill: { alignSelf: 'flex-end', minWidth: 172, minHeight: 62, paddingHorizontal: 9, paddingVertical: 5, borderRadius: 32, borderWidth: 4, borderColor: '#BDE7F4', backgroundColor: palette.ink, flexDirection: 'row', alignItems: 'center', gap: 8, shadowColor: '#0B1847', shadowOpacity: .26, shadowRadius: 8, shadowOffset: { width: 0, height: 5 }, elevation: 6 }, avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#DDF3FA', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'visible' }, online: { position: 'absolute', right: -1, top: -1, width: 12, height: 12, borderRadius: 6, backgroundColor: palette.lime, borderWidth: 2, borderColor: palette.ink }, pressed: { opacity: .82, transform: [{ scale: .98 }] }, copy: { color: palette.white, lineHeight: 16 }, title: { fontFamily: 'Nunito_800ExtraBold', fontSize: 12 }, meta: { fontFamily: 'Nunito_700Bold', fontSize: 9.5, color: '#9EDDF4' } });
