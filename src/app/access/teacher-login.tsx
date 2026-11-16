import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Text, TextInput } from '@/components/localized-native';

import { Button, Card, PioMark, Screen, SectionTitle, palette } from '@/components/pio-ui';
import { useAppState } from '@/lib/app-state';
import { t } from '@/lib/i18n';

export default function TeacherLoginScreen() {
  const { language, signInStaff } = useAppState();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit() {
    if (!email.trim() || !password || loading) return;
    setLoading(true); setError('');
    try { await signInStaff(email, password); router.replace('/teacher/dashboard'); }
    catch { setError(t('genericLoginError', language)); }
    finally { setLoading(false); }
  }

  return <Screen><PioMark small pose="hello" /><SectionTitle eyebrow={t('teacherArea', language)} title={t('teacherLogin', language)} body={t('teacherLoginHint', language)} />
    <Card><Text style={local.label}>Correo</Text><TextInput accessibilityLabel="Correo electrónico" value={email} onChangeText={setEmail} autoCapitalize="none" autoCorrect={false} keyboardType="email-address" textContentType="emailAddress" style={local.input} /><Text style={local.label}>Contraseña</Text><TextInput accessibilityLabel="Contraseña" value={password} onChangeText={setPassword} secureTextEntry textContentType="password" style={local.input} placeholder="••••••••" placeholderTextColor="#A19BA0" /></Card>
    {error ? <Text accessibilityRole="alert" style={local.error}>{error}</Text> : null}
    <Button title={loading ? t('checking', language) : t('loginButton', language)} disabled={!email.trim() || !password || loading} onPress={submit} />
    <Button title={t('back', language)} variant="ghost" onPress={() => router.replace('/access')} />
  </Screen>;
}

const local = StyleSheet.create({ label: { color: palette.ink, fontFamily: 'Nunito_800ExtraBold' }, input: { minHeight: 48, borderRadius: 13, borderWidth: 1, borderColor: palette.line, paddingHorizontal: 12, color: palette.ink, backgroundColor: palette.sand, fontFamily: 'Nunito_400Regular' }, error: { color: '#B23551', fontFamily: 'Nunito_700Bold', lineHeight: 20, textAlign: 'center' } });
