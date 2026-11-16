import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from '@/components/localized-native';

import { BrandIcon, Button, Screen, TopBar, palette } from '@/components/pio-ui';
import { loadSavedTrustedAdults, type TrustedAdultKind } from '@/features/access/first-use';
import { useAppState } from '@/lib/app-state';
import { t } from '@/lib/i18n';

const avatarColors = ['#FF5C93', '#FFB80E', '#374EA2'];
const adultLabels: Record<string, string> = { mother: 'adultMother', father: 'adultFather', grandparent: 'adultGrandmother', teacher: 'adultTeacherAna', uncle_aunt: 'adultUncleAunt', other: 'adultOther' };

export default function HelpScreen() {
  const { session, language } = useAppState();
  const student = session.kind === 'student' ? session.student : undefined;
  const stored = student?.trustedAdults ?? [];
  const [saved, setSaved] = useState<TrustedAdultKind[]>([]);
  useEffect(() => { if (student) void loadSavedTrustedAdults(student.id).then(setSaved); }, [student]);
  const adults = (stored.length ? stored : saved.length ? saved : ['mother', 'grandparent', 'teacher']).slice(0, 3).map((adult) => adultLabels[adult] ? t(adultLabels[adult], language) : adult);

  return <Screen color="#FFFCF7" footer={<Button variant="cyan" title={t('breatheFirst', language)} onPress={() => router.push('/student/calm')} />}>
    <TopBar title={t('helpTitle', language)} onBack={() => router.back()} />
    <View style={local.intro}><Text style={local.school}>🏫</Text><Text style={local.note}><Text style={local.bold}>{t('helpTitleCopy', language)}. </Text>{t('helpRequestCopy', language)}</Text></View>
    <Text style={local.eyebrow}>{t('trustedAdultsUpper', language)}</Text>
    <View style={local.list}>{adults.map((adult, index) => <Pressable accessibilityRole="button" key={`${adult}-${index}`} style={local.adult}><View style={[local.avatar, { backgroundColor: avatarColors[index] }]}><BrandIcon name="smile" color={palette.white} size={20} /></View><Text style={local.name}>{adult}</Text><Text style={local.contact}>{t('tellAdult', language)}</Text></Pressable>)}</View>
    <View style={local.emergency}><Text style={local.heading}>{t('dangerNow', language)}</Text><Text style={local.emergencyCopy}>{t('emergencyServicesPending', language)}</Text></View>
  </Screen>;
}

const local = StyleSheet.create({
  intro: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 18, backgroundColor: '#FFDDE9', padding: 13 }, school: { fontSize: 26 }, note: { flex: 1, color: palette.ink, fontFamily: 'Nunito_400Regular', fontSize: 12, lineHeight: 17 }, bold: { fontFamily: 'Nunito_800ExtraBold' }, eyebrow: { color: palette.ink, fontFamily: 'Nunito_800ExtraBold', fontSize: 10, letterSpacing: 1 }, list: { gap: 9 }, adult: { minHeight: 63, borderRadius: 18, borderWidth: 1.5, borderColor: '#E6E0D9', backgroundColor: palette.white, flexDirection: 'row', alignItems: 'center', gap: 11, paddingHorizontal: 12 }, avatar: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' }, name: { flex: 1, color: palette.ink, fontFamily: 'Nunito_800ExtraBold', fontSize: 13 }, contact: { color: '#77716C', fontFamily: 'Nunito_400Regular', fontSize: 10.5 }, emergency: { borderRadius: 18, backgroundColor: '#F5F2EE', borderWidth: 1.5, borderColor: '#E5DED7', padding: 14, gap: 5 }, heading: { color: palette.ink, fontFamily: 'Nunito_800ExtraBold', fontSize: 12 }, emergencyCopy: { color: '#74707A', fontFamily: 'Nunito_400Regular', fontSize: 10.5, lineHeight: 15 },
});
