import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Text } from '@/components/localized-native';
import Svg, { Path, Polygon } from 'react-native-svg';

import { Screen, palette } from '@/components/pio-ui';
import { useAppState } from '@/lib/app-state';
import { t } from '@/lib/i18n';

export default function WelcomeScreen() {
  const { language } = useAppState();
  return <Screen scroll={false} color={palette.rose}>
    <StatusBar style="light" />
    <Pressable accessibilityRole="button" accessibilityLabel={language === 'es' ? 'Comenzar' : t('start', language)} onPress={() => router.push('/access/language')} style={local.page}>
      <View style={local.bunting}>
        {['#FFC20E', '#1CABE2', '#80BD41', '#FFC20E', '#1CABE2', '#80BD41', '#FFC20E'].map((color, index) => <Svg key={index} width={30} height={23} viewBox="0 0 30 23"><Polygon points="0,0 30,0 15,22" fill={color} /></Svg>)}
      </View>
      <View style={local.center}>
        <View style={local.brandLockup}>
          <Image accessibilityLabel="Pío te saluda desde su laguna" source={require('../../../assets/images/brand/pio-intro-circle.png')} resizeMode="contain" style={local.mascotCircle} />
          <Text style={local.wordmark}>pío</Text>
          <Text style={local.subtitle}>{t('subtitle', language)}</Text>
        </View>
        <View style={local.dots}><View style={local.activeDot} /><View style={local.dot} /><View style={local.dot} /></View>
      </View>
      <View style={local.landscape}><Landscape /></View>
      <View style={local.footer}><Text style={local.support}>Con el apoyo de UNICEF Nicaragua</Text></View>
    </Pressable>
  </Screen>;
}

function Landscape() {
  return <Svg width="100%" height="100%" viewBox="0 0 640 360" preserveAspectRatio="none">
    <Path d="M121 57c15-21 52-28 84-24 14-18 42-15 55 0 22-4 34 8 32 23-2 15-20 23-43 20-25 13-76 9-103-2-17-7-31-9-25-17z" fill="#FFF" />
    <Path d="M260 14c10-7 24-3 27 8 4 12-6 24-19 23-13-1-19-18-8-31z" fill="#FFF" />
    <Path d="M93 294 225 72q21-31 44 1l133 221z" fill="#80BD41" stroke="#1D2A5C" strokeWidth="10" strokeLinejoin="round" />
    <Path d="M216 89q21-28 45-2l25 29-17-6-17 24-28-31-18 10z" fill="#F7FFE5" />
    <Path d="M349 297q73-111 115-126 23-8 48 7 57 37 118 119z" fill="#4F9D31" stroke="#1D2A5C" strokeWidth="10" strokeLinejoin="round" />
    <Path d="M0 286q65-11 128-8 65 3 125 1 65-2 128 11 55 11 119 8 72-4 140-11v73H0z" fill="#1CABE2" />
    <Path d="M54 321q22-14 44 0M247 335q25-16 50 0M446 316q26-14 52 0" fill="none" stroke="#BDEBFA" strokeWidth="8" strokeLinecap="round" />
  </Svg>;
}

const local = StyleSheet.create({ page: { flex: 1, justifyContent: 'space-between', paddingHorizontal: 4, paddingTop: 4, paddingBottom: 4 }, bunting: { flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: -16, height: 23, overflow: 'hidden' }, center: { flex: 1, alignItems: 'center', justifyContent: 'space-around' }, brandLockup: { alignItems: 'center', gap: 0 }, mascotCircle: { width: 270, height: 270 }, wordmark: { color: palette.white, fontFamily: 'Baloo2_700Bold', fontSize: 62, lineHeight: 68 }, subtitle: { color: palette.white, fontFamily: 'Nunito_800ExtraBold', fontSize: 15 }, dots: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 28 }, activeDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: palette.white }, dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#FFC6D8' }, landscape: { height: 166, marginHorizontal: -20, justifyContent: 'flex-end' }, footer: { alignItems: 'center', marginTop: 1 }, support: { color: palette.white, fontFamily: 'Nunito_400Regular', fontSize: 10 } });
