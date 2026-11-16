import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from '@/components/localized-native';

import { Button, PioMark, Screen, SectionTitle, palette } from '@/components/pio-ui';
import { useAppState } from '@/lib/app-state';
import { languageOptions, t } from '@/lib/i18n';

export default function LanguageScreen() {
  const { language, setLanguage } = useAppState();
  return <Screen color={palette.white}><View style={local.brand}><PioMark pose="hello" size={112} /><Text style={local.wordmark}>pío</Text></View><SectionTitle eyebrow="Siento y Crezco" title={t('chooseLanguage', language)} body={t('languageHint', language)} />
    <View style={local.list}>{languageOptions.map((option) => <Pressable accessibilityRole="radio" accessibilityState={{ selected: language === option.id }} key={option.id} onPress={() => setLanguage(option.id)} style={[local.option, language === option.id && local.selected]}><View style={local.globe}><Text style={local.globeText}>◎</Text></View><View style={local.optionCopy}><Text style={local.name}>{option.native}</Text><Text style={local.caption}>{option.label}</Text></View><View style={[local.radio, language === option.id && local.radioActive]}>{language === option.id ? <View style={local.radioDot} /> : null}</View></Pressable>)}</View>
    <View style={local.bottom}><Button title={t('continue', language)} onPress={() => router.push('/access/class-code')} /></View>
  </Screen>;
}
const local = StyleSheet.create({ brand: { alignItems: 'center', gap: 0, paddingTop: 4, paddingBottom: 2 }, wordmark: { color: palette.roseDeep, fontFamily: 'Baloo2_700Bold', fontSize: 30, lineHeight: 34 }, list: { gap: 10 }, option: { minHeight: 70, borderRadius: 18, borderWidth: 1.5, borderColor: palette.line, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', backgroundColor: palette.white }, selected: { borderColor: palette.rose, backgroundColor: '#FFF6F9' }, globe: { width: 38, height: 38, borderRadius: 19, backgroundColor: palette.sand, alignItems: 'center', justifyContent: 'center' }, globeText: { color: palette.ink, fontSize: 23, lineHeight: 28 }, optionCopy: { flex: 1, marginLeft: 12 }, name: { fontFamily: 'Nunito_800ExtraBold', fontSize: 17, color: palette.ink }, caption: { fontFamily: 'Nunito_400Regular', color: palette.muted, marginTop: 1, fontSize: 13 }, radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, borderColor: '#A7A3A0', alignItems: 'center', justifyContent: 'center' }, radioActive: { borderColor: palette.roseDeep }, radioDot: { width: 11, height: 11, borderRadius: 6, backgroundColor: palette.roseDeep }, bottom: { marginTop: 'auto', paddingTop: 28 } });
