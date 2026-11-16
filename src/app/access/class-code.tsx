import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from '@/components/localized-native';

import { BrandIcon, Button, Card, Screen, TopBar, palette } from '@/components/pio-ui';
import { useAppState } from '@/lib/app-state';
import { resolveClass } from '@/features/access/student-login';
import { t } from '@/lib/i18n';

export default function ClassCodeScreen() {
  const { language, setResolvedClass } = useAppState();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [keyboardLetters, setKeyboardLetters] = useState(false);
  const codeCharacters = code.split('');
  const numberKeys = [...'123456789'.split(''), 'ABC', '0', '⌫'];
  const letterRows = ['QWERTYUIOP', 'ASDFGHJKL', '123ZXCVBNM⌫'];

  function pressKey(key: string) {
    if (key === 'ABC') { setKeyboardLetters(true); return; }
    if (key === '123') { setKeyboardLetters(false); return; }
    if (key === '⌫') { setCode((current) => current.slice(0, -1)); return; }
    setCode((current) => current.length < 6 ? current + key : current);
  }

  async function continueToStudents() {
    if (code.length < 6) return;
    setLoading(true); setError('');
    try {
      const result = await resolveClass(code);
      setResolvedClass(result);
      router.push('/access/student');
    } catch {
      setError(t('errorClass', language));
    } finally { setLoading(false); }
  }

  return <Screen scroll={false} horizontalPadding={24} footer={<Button title={loading ? '…' : t('continue', language)} disabled={loading || code.length < 6} onPress={continueToStudents} />}>
    <TopBar title={t('stepOne', language)} onBack={() => router.back()} />
    <Text style={local.title}>{t('classCode', language)}</Text>
    <Card tone="yellow"><View style={local.hintRow}><BrandIcon name="heart" color={palette.ink} size={17} /><Text style={local.hint}>{t('classCodeHint', language)}</Text></View></Card>
    <View style={local.codeBoxes}>{Array.from({ length: 6 }, (_, index) => <View key={index} style={[local.codeBox, index < code.length && local.codeBoxActive]}><Text style={local.codeText}>{codeCharacters[index] ?? ''}</Text></View>)}</View>
    <View style={local.keyboardArea}>
      {keyboardLetters ? <View style={local.letterKeyboard}>{letterRows.map((row) => <View key={row} style={local.letterRow}>{row.match(/123|⌫|./g)?.map((key) => <Pressable accessibilityRole="button" accessibilityLabel={key === '⌫' ? 'Borrar' : key} key={key} onPress={() => pressKey(key)} style={[local.letterKey, key.length > 1 && local.letterSpecialKey]}><Text style={[local.letterKeyText, key.length > 1 && local.specialKeyText]}>{key}</Text></Pressable>)}</View>)}</View> : <View style={local.keyboard}>{numberKeys.map((key, index) => <Pressable accessibilityRole="button" accessibilityLabel={key === '⌫' ? 'Borrar' : key} key={`${key}-${index}`} onPress={() => pressKey(key)} style={[local.key, key.length > 1 && local.specialKey]}><Text style={[local.keyText, key.length > 1 && local.specialKeyText]}>{key}</Text></Pressable>)}</View>}
      <Text style={local.example}>{t('codeExample', language)}</Text>
      {error ? <Text style={local.error}>{error}</Text> : null}
    </View>
  </Screen>;
}
const local = StyleSheet.create({ title: { color: palette.ink, fontFamily: 'Baloo2_700Bold', fontSize: 21, lineHeight: 25, marginTop: 2 }, hintRow: { flexDirection: 'row', alignItems: 'center', gap: 7 }, hint: { flex: 1, fontFamily: 'Nunito_700Bold', color: palette.ink, lineHeight: 17, fontSize: 12 }, codeBoxes: { flexDirection: 'row', gap: 6, justifyContent: 'center' }, codeBox: { flex: 1, maxWidth: 46, height: 45, borderRadius: 11, borderWidth: 1.5, borderColor: palette.line, alignItems: 'center', justifyContent: 'center', backgroundColor: palette.white }, codeBoxActive: { borderColor: palette.roseDeep, backgroundColor: '#FFF7FA' }, codeText: { color: palette.ink, fontFamily: 'Baloo2_700Bold', fontSize: 21 }, keyboardArea: { marginTop: 'auto', gap: 9 }, keyboard: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 7, columnGap: 5 }, key: { width: '31.5%', height: 43, borderRadius: 22, backgroundColor: '#F4F1ED', alignItems: 'center', justifyContent: 'center' }, letterKeyboard: { gap: 6, paddingHorizontal: 1 }, letterRow: { flexDirection: 'row', justifyContent: 'center', gap: 4 }, letterKey: { width: 29, height: 42, borderRadius: 11, backgroundColor: '#F4F1ED', alignItems: 'center', justifyContent: 'center' }, letterSpecialKey: { width: 42, backgroundColor: '#EAE6E1' }, specialKey: { backgroundColor: '#EAE6E1' }, keyText: { color: palette.ink, fontFamily: 'Nunito_800ExtraBold', fontSize: 17 }, letterKeyText: { color: palette.ink, fontFamily: 'Nunito_800ExtraBold', fontSize: 17 }, specialKeyText: { color: palette.muted, fontSize: 12 }, example: { color: palette.muted, fontFamily: 'Nunito_400Regular', textAlign: 'center', fontSize: 11 }, error: { color: '#B63A3A', textAlign: 'center', fontFamily: 'Nunito_700Bold', fontSize: 12 } });
