import { router } from 'expo-router';
import { StyleSheet } from 'react-native';
import { Text } from '@/components/localized-native';

import { Button, PioMark, Screen, SectionTitle, palette } from '@/components/pio-ui';
import { useAppState } from '@/lib/app-state';
import { t } from '@/lib/i18n';

export default function NotFoundScreen() {
  const { language } = useAppState();
  return <Screen><PioMark /><Text style={local.mark}>pío</Text><SectionTitle title={t('routeMissingTitle', language)} body={t('routeMissingHint', language)} /><Button title={t('routeMissingButton', language)} onPress={() => router.replace('/access')} /></Screen>;
}

const local = StyleSheet.create({ mark: { color: palette.roseDeep, fontFamily: 'Baloo2_700Bold', fontSize: 35, textAlign: 'center', marginTop: -12 } });
