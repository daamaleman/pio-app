import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from '@/components/localized-native';

import { Button, Card, PioMark, Screen, SectionTitle, palette } from '@/components/pio-ui';
import { recordFamilyConsent } from '@/features/access/student-login';
import { useAppState } from '@/lib/app-state';
import { t } from '@/lib/i18n';

export default function ConsentScreen() {
  const { language } = useAppState();
  const [challengePassed, setChallengePassed] = useState(false);
  const [guardianConsent, setGuardianConsent] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  async function finishConsent() {
    if (!challengePassed || !guardianConsent || saving) return;
    setSaving(true); setError('');
    try { await recordFamilyConsent(); router.replace('/access/first-use'); }
    catch { setError(t('consentError', language)); }
    finally { setSaving(false); }
  }
  return <Screen><PioMark small pose="love" /><SectionTitle eyebrow={t('familySpace', language)} title={t('familyConsentTitle', language)} body={t('familyConsentHint', language)} />
    <Card tone="white"><Text style={local.text}>{t('familyConsentInfo', language)}</Text><Text style={local.question}>{t('familyMath', language)}</Text><View style={local.answers}>{['10', '12', '15'].map((answer) => <Pressable accessibilityRole="radio" accessibilityState={{ selected: challengePassed && answer === '12' }} key={answer} onPress={() => setChallengePassed(answer === '12')} style={[local.answer, challengePassed && answer === '12' && local.answerSelected]}><Text style={local.answerText}>{answer}</Text></Pressable>)}</View></Card>
    <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: guardianConsent }} onPress={() => setGuardianConsent((value) => !value)} style={local.checkRow}><View style={[local.checkbox, guardianConsent && local.checked]}>{guardianConsent ? <Text style={local.checkmark}>✓</Text> : null}</View><Text style={local.text}>{t('familyConsentCheck', language)}</Text></Pressable>
    {error ? <Text accessibilityRole="alert" style={local.error}>{error}</Text> : null}
    <Button title={saving ? t('saving', language) : t('familyContinue', language)} disabled={!challengePassed || !guardianConsent || saving} onPress={finishConsent} />
  </Screen>;
}
const local = StyleSheet.create({ text: { color: palette.ink, fontFamily: 'Nunito_400Regular', lineHeight: 22, fontSize: 15 }, question: { fontFamily: 'Baloo2_700Bold', fontSize: 20, color: palette.ink, marginTop: 8 }, answers: { flexDirection: 'row', gap: 9 }, answer: { flex: 1, minHeight: 48, alignItems: 'center', justifyContent: 'center', backgroundColor: palette.sand, borderRadius: 14, borderWidth: 1.5, borderColor: palette.line }, answerSelected: { borderColor: palette.roseDeep, backgroundColor: palette.roseSoft }, answerText: { color: palette.ink, fontFamily: 'Nunito_800ExtraBold', fontSize: 18 }, checkRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 }, checkbox: { width: 24, height: 24, borderWidth: 1.5, borderColor: palette.roseDeep, borderRadius: 6, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }, checkmark: { color: palette.white, fontSize: 16, lineHeight: 19, fontWeight: '900' }, checked: { backgroundColor: palette.roseDeep }, error: { color: '#B23551', fontFamily: 'Nunito_700Bold', lineHeight: 20 } });
