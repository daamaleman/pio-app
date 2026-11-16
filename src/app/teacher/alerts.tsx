import { useCallback, useState } from 'react';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Text } from '@/components/localized-native';

import { Button, Card, Screen, TopBar, palette } from '@/components/pio-ui';
import { supabase } from '@/lib/supabase';

type AlertItem = { id: string; status: 'open' | 'in_attention' | 'closed'; reason_code: string; details: { difficult_days?: number; window_days?: number } | null; opened_at: string; students?: { display_name: string } | { display_name: string }[] | null };

export default function Alerts() {
  const { groupId } = useLocalSearchParams<{ groupId: string }>();
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState('');
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!groupId) { setError('No encontramos el grupo de estas alertas.'); setLoading(false); return; }
    setLoading(true); setError('');
    const { data, error: queryError } = await supabase.from('alerts').select('id, status, reason_code, details, opened_at, students(display_name)').eq('group_id', groupId).neq('status', 'closed').order('opened_at', { ascending: false });
    if (queryError) setError('No pudimos cargar las alertas de apoyo.');
    else setAlerts((data ?? []) as unknown as AlertItem[]);
    setLoading(false);
  }, [groupId]);

  useFocusEffect(useCallback(() => { void load(); }, [load]));

  async function updateStatus(alertId: string, status: 'in_attention' | 'closed') {
    setSavingId(alertId); setError('');
    const { error: updateError } = await supabase.from('alerts').update({ status }).eq('id', alertId);
    if (updateError) setError('No pudimos actualizar esta alerta.');
    else if (status === 'closed') setAlerts((current) => current.filter((alert) => alert.id !== alertId));
    else setAlerts((current) => current.map((alert) => alert.id === alertId ? { ...alert, status } : alert));
    setSavingId('');
  }

  return <Screen><TopBar title="Alertas de apoyo" onBack={() => router.back()} />
    {loading ? <ActivityIndicator color={palette.teacherBlue} /> : null}
    {error ? <Text accessibilityRole="alert" style={local.error}>{error}</Text> : null}
    {!loading && !error && !alerts.length ? <Card tone="leaf"><Text style={local.title}>No hay alertas activas</Text><Text style={local.text}>Las alertas se revisan con cuidado y en privado.</Text></Card> : null}
    {alerts.map((alert) => { const student = Array.isArray(alert.students) ? alert.students[0]?.display_name : alert.students?.display_name; const days = alert.details?.difficult_days; const window = alert.details?.window_days; return <Card key={alert.id} tone="yellow"><Text style={local.kicker}>{alert.status === 'open' ? 'PENDIENTE DE ACOMPAÑAMIENTO' : 'EN ACOMPAÑAMIENTO'}</Text><Text style={local.title}>{student ?? 'Estudiante del grupo'}</Text><Text style={local.text}>{days && window ? `Se registraron ${days} días difíciles en los últimos ${window} días.` : 'Revisá cómo está y ofrecé un espacio para conversar.'}</Text><View style={local.actions}>{alert.status === 'open' ? <Button title={savingId === alert.id ? 'Guardando…' : 'Conversé con el estudiante'} disabled={savingId === alert.id} onPress={() => updateStatus(alert.id, 'in_attention')} /> : <Button title={savingId === alert.id ? 'Guardando…' : 'Cerrar alerta'} disabled={savingId === alert.id} onPress={() => updateStatus(alert.id, 'closed')} />}</View></Card>; })}
  </Screen>;
}

const local = StyleSheet.create({ kicker: { color: palette.roseDeep, fontFamily: 'Nunito_800ExtraBold', fontSize: 10, letterSpacing: 0.7 }, title: { color: palette.ink, fontFamily: 'Baloo2_700Bold', fontSize: 19 }, text: { color: palette.ink, fontFamily: 'Nunito_400Regular', lineHeight: 22 }, actions: { marginTop: 3 }, error: { color: '#B23551', fontFamily: 'Nunito_700Bold' } });
