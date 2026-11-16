import { toMiskituDraft } from '@/lib/miskitu-draft';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from '@/components/localized-native';
import { BrandIcon, Screen, palette, type BrandIconName } from '@/components/pio-ui';
import { SecondaryChatPill } from '@/components/secondary-chat-pill';
import { StudentNavSpacer } from '@/components/student-nav';
import { useAppState } from '@/lib/app-state';
import { t } from '@/lib/i18n';
import type { AppLanguage } from '@/lib/types';
const languages: {
    id: AppLanguage;
    name: string;
}[] = [{ id: 'es', name: 'Español' }, { id: 'en', name: 'English' }, { id: 'miq', name: 'Miskitu' }];
export default function ProfileScreen() {
    const { session, language, setLanguage, signOut, studentWeek } = useAppState();
    const student = session.kind === 'student' ? session.student : undefined;
    const [largeText, setLargeText] = useState(student?.accessibility.textSize === 'large');
    const [narration, setNarration] = useState(student?.accessibility.narration ?? true);
    const [reduceMotion, setReduceMotion] = useState(student?.accessibility.reduceMotion ?? false);
    async function leave() { await signOut(); router.replace('/access'); }
    if (student?.level === 'secondary')
        return <SecondaryProfile language={language} student={student} setLanguage={setLanguage} onSwitch={() => router.replace('/access/class-code')} onSignOut={leave}/>;
    const languageIndex = languages.findIndex((item) => item.id === language);
    const currentLanguage = languages[languageIndex] ?? languages[0];
    const initials = student?.displayName.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase() ?? 'MR';
    const adultsCount = student?.trustedAdults.length || 3;
    return <Screen color="#FFFCF7" footer={<StudentNavSpacer />}>
    <View style={local.person}><View style={local.avatar}><Text style={local.avatarText}>{initials}</Text></View><Text style={local.name}>{student?.displayName ?? 'María José'}</Text><Text style={local.meta}>{student ? `${student.grade}.º grado ${student.section} · Esc. Rubén Darío` : '3.º grado A · Esc. Rubén Darío'}</Text><View style={local.stats}><View style={local.flowerPill}><Text style={local.flowerText}>{studentWeek?.garden.flowers ?? 0} {t('flowersShort', language)}</Text></View><View style={local.badgePill}><Text style={local.badgeText}>{Math.min(2, studentWeek?.garden.days_this_week ?? 0)} {t('badgesShort', language)}</Text></View></View></View>
    <View style={local.settings}>
      <ProfileRow icon="globe" label={t('language', language)} value={currentLanguage.name} onPress={() => setLanguage(languages[(languageIndex + 1) % languages.length].id)}/>
      <ProfileRow icon="week" label={t('textSize', language)} value={largeText ? t('large', language) : t('normal', language)} onPress={() => setLargeText(!largeText)}/>
      <ProfileRow icon="profile" label={t('narration', language)} value={narration ? t('enabled', language) : t('disabled', language)} onPress={() => setNarration(!narration)}/>
      <ProfileRow icon="back" label={t('animations', language)} value={reduceMotion ? t('reduced', language) : t('normal', language)} onPress={() => setReduceMotion(!reduceMotion)}/>
      <ProfileRow icon="family" label={t('trustedAdults', language)} value={String(adultsCount)} onPress={() => router.push('/student/help')}/>
      <ProfileRow icon="profile" label={t('switchProfile', language)} onPress={() => router.replace('/access/class-code')}/>
    </View>
    <Pressable accessibilityRole="button" onPress={() => router.push('/student/family')} style={local.familyLink}><BrandIcon name="family" color={palette.ink} size={19}/><Text style={local.familyText}>{t('familySpace', language)}</Text></Pressable>
  </Screen>;
}
function ProfileRow({ icon, label, value, onPress }: {
    icon: BrandIconName;
    label: string;
    value?: string;
    onPress: () => void;
}) {
    return <Pressable accessibilityRole="button" onPress={onPress} style={local.row}><BrandIcon name={icon} color={palette.ink} size={20}/><Text style={local.rowLabel}>{label}</Text>{value ? <Text style={local.rowValue}>{value}</Text> : null}<Text style={local.chevron}>›</Text></Pressable>;
}
function SecondaryProfile({ language, student, setLanguage, onSwitch, onSignOut }: {
    language: AppLanguage;
    student: NonNullable<ReturnType<typeof useAppState>['selectedStudent']>;
    setLanguage: (language: AppLanguage) => void;
    onSwitch: () => void;
    onSignOut: () => void;
}) {
    const { studentWeek, lessons } = useAppState();
    const completedLessons = lessons.filter((lesson) => lesson.status === 'completed').length;
    const completedParts = studentWeek?.current?.parts.filter((part) => part.status === 'completed').length ?? 0;
    const totalParts = studentWeek?.current?.parts.length || 4;
    const languageIndex = languages.findIndex((item) => item.id === language);
    const currentLanguage = languages[languageIndex] ?? languages[0];
    const badgeCount = Math.min(2, Math.max(completedLessons, completedParts));
    return <Screen color="#F8F7F4" footer={<StudentNavSpacer />}>
    <View style={secondary.editorial}><View style={secondary.editorialPattern}><Text style={secondary.patternText}>⌁⌁⌁⌁⌁⌁⌁⌁⌁</Text></View><Text style={secondary.school}>{student.grade}.ER AÑO {student.section} · INST. NACIONAL</Text><Text style={secondary.name}>{student.displayName}</Text><View style={secondary.stats}><View style={secondary.stat}><Text style={secondary.statValue}>{completedLessons}</Text><Text style={secondary.statLabel}>{language === 'en' ? 'lessons' : language === "miq" ? toMiskituDraft('lecciones') : 'lecciones'}</Text></View><View style={secondary.stat}><Text style={secondary.statValue}>{completedParts}</Text><Text style={secondary.statLabel}>{language === 'en' ? 'chapters' : language === "miq" ? toMiskituDraft('capítulos') : 'capítulos'}</Text></View><View style={secondary.stat}><Text style={secondary.statValue}>{badgeCount}</Text><Text style={secondary.statLabel}>{language === 'en' ? 'badges' : language === "miq" ? toMiskituDraft('insignias') : 'insignias'}</Text></View></View><View style={secondary.editorialMountains}><View style={secondary.profileMountainOne}/><View style={secondary.profileMountainTwo}/></View></View>
    <View style={secondary.goalCard}><Text style={secondary.goalKicker}>{language === 'en' ? 'MY MONTHLY GOAL' : language === "miq" ? toMiskituDraft('MI META DEL MES') : 'MI META DEL MES'}</Text><Text style={secondary.goalTitle}>{language === 'en' ? 'Finish my weekly plan' : language === "miq" ? toMiskituDraft('Completar mi plan de la semana') : 'Completar mi plan de la semana'}</Text><View style={secondary.goalProgress}><View style={[secondary.goalFill, { width: `${Math.min(100, completedParts / Math.max(totalParts, 1) * 100)}%` }]}/></View><Text style={secondary.goalMeta}>{completedParts} {language === 'en' ? `of ${totalParts} steps` : language === "miq" ? toMiskituDraft(`de ${totalParts} pasos`) : `de ${totalParts} pasos`}</Text></View>
    <View style={secondary.badgeSection}><Text style={secondary.sectionTitle}>{language === 'en' ? 'BADGES' : language === "miq" ? toMiskituDraft('INSIGNIAS') : 'INSIGNIAS'}</Text><View style={secondary.badges}><SecondaryBadge unlocked label={language === 'en' ? 'I take care online' : language === "miq" ? toMiskituDraft('Me cuido en línea') : 'Me cuido en línea'} icon="♡"/><SecondaryBadge unlocked={badgeCount > 1} label={language === 'en' ? 'I say no clearly' : language === "miq" ? toMiskituDraft('Digo no sin pelear') : 'Digo no sin pelear'} icon="◇"/><SecondaryBadge label={language === 'en' ? 'Full month' : language === "miq" ? toMiskituDraft('Mes completo') : 'Mes completo'} icon="□"/><SecondaryBadge label={language === 'en' ? 'I ask for help' : language === "miq" ? toMiskituDraft('Pido ayuda') : 'Pido ayuda'} icon="□"/></View></View>
    <View style={secondary.menu}><SecondaryProfileRow icon="book" label={language === 'en' ? 'My toolbox' : language === "miq" ? toMiskituDraft('Mi caja de herramientas') : 'Mi caja de herramientas'} onPress={() => router.push('/student/cards')}/><SecondaryProfileRow icon="globe" label={t('language', language)} value={currentLanguage.name} onPress={() => setLanguage(languages[(languageIndex + 1) % languages.length].id)}/><SecondaryProfileRow icon="family" label={language === 'en' ? 'AI chat settings' : language === "miq" ? toMiskituDraft('Ajustes del chat de IA') : 'Ajustes del chat de IA'} onPress={() => router.push('/student/listen?screen=settings')}/></View>
    <SecondaryChatPill language={language}/>
    <View style={secondary.accountLinks}><Pressable onPress={onSwitch}><Text style={secondary.accountLink}>{t('switchProfile', language)}</Text></Pressable><Text style={secondary.accountDot}>·</Text><Pressable onPress={onSignOut}><Text style={secondary.accountLink}>{t('signOut', language)}</Text></Pressable></View>
  </Screen>;
}
function SecondaryProfileRow({ icon, label, value, onPress }: {
    icon: BrandIconName;
    label: string;
    value?: string;
    onPress: () => void;
}) {
    return <Pressable accessibilityRole="button" onPress={onPress} style={secondary.menuRow}><BrandIcon name={icon} color={palette.ink} size={18}/><Text style={secondary.menuLabel}>{label}</Text>{value ? <Text style={secondary.menuValue}>{value}</Text> : null}<Text style={secondary.menuChevron}>›</Text></Pressable>;
}
function SecondaryBadge({ unlocked = false, label, icon }: {
    unlocked?: boolean;
    label: string;
    icon: string;
}) {
    return <View style={secondary.badgeItem}><View style={[secondary.badgeCircle, unlocked && secondary.badgeUnlocked]}><Text style={[secondary.badgeIcon, unlocked && secondary.badgeIconUnlocked]}>{unlocked ? icon : '⌑'}</Text></View><Text style={secondary.badgeLabel}>{label}</Text></View>;
}
const local = StyleSheet.create({
    person: { alignItems: 'center', gap: 3, paddingTop: 2 }, avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#761C80', alignItems: 'center', justifyContent: 'center', marginBottom: 3 }, avatarText: { color: palette.white, fontFamily: 'Nunito_800ExtraBold', fontSize: 22 }, name: { color: palette.ink, fontFamily: 'Baloo2_700Bold', fontSize: 21, lineHeight: 25 }, meta: { color: '#77716C', fontFamily: 'Nunito_400Regular', fontSize: 11 }, stats: { flexDirection: 'row', gap: 8, marginTop: 6 }, flowerPill: { borderRadius: 18, paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#E7F6D8', borderWidth: 1.5, borderColor: '#78BE43' }, badgePill: { borderRadius: 18, paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#E1F5FC', borderWidth: 1.5, borderColor: palette.cyan }, flowerText: { color: '#34761F', fontFamily: 'Nunito_800ExtraBold', fontSize: 11 }, badgeText: { color: '#095A84', fontFamily: 'Nunito_800ExtraBold', fontSize: 11 },
    settings: { marginTop: 2 }, row: { minHeight: 49, flexDirection: 'row', alignItems: 'center', gap: 11, borderBottomWidth: 1, borderColor: '#E6E0D9', paddingHorizontal: 2 }, rowLabel: { flex: 1, color: palette.ink, fontFamily: 'Nunito_800ExtraBold', fontSize: 12 }, rowValue: { color: '#77716C', fontFamily: 'Nunito_400Regular', fontSize: 10.5 }, chevron: { color: '#9A948C', fontFamily: 'Nunito_700Bold', fontSize: 22 }, familyLink: { marginTop: 'auto', minHeight: 42, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }, familyText: { color: '#354EA1', fontFamily: 'Nunito_800ExtraBold', fontSize: 12 },
});
const secondary = StyleSheet.create({ editorial: { minHeight: 178, borderRadius: 22, overflow: 'hidden', backgroundColor: '#213B83', padding: 17, gap: 4, position: 'relative' }, editorialPattern: { position: 'absolute', top: -7, left: 0, right: 0 }, patternText: { color: '#5A72AC', fontSize: 20, letterSpacing: 5 }, school: { marginTop: 5, color: '#9BE0F4', fontFamily: 'Nunito_800ExtraBold', fontSize: 9, letterSpacing: 1 }, name: { color: palette.white, fontFamily: 'Baloo2_700Bold', fontSize: 25, lineHeight: 29 }, stats: { flexDirection: 'row', gap: 18, marginTop: 6 }, stat: { minWidth: 48 }, statValue: { color: palette.white, fontFamily: 'Baloo2_700Bold', fontSize: 22, lineHeight: 24 }, statLabel: { color: '#C9D5EE', fontFamily: 'Nunito_400Regular', fontSize: 8.5 }, editorialMountains: { position: 'absolute', width: 125, height: 85, right: -7, bottom: -12 }, profileMountainOne: { position: 'absolute', width: 75, height: 75, bottom: 0, left: 1, backgroundColor: '#2D4B93', transform: [{ rotate: '45deg' }] }, profileMountainTwo: { position: 'absolute', width: 75, height: 75, bottom: -9, right: -3, backgroundColor: '#294486', transform: [{ rotate: '45deg' }] }, goalCard: { borderRadius: 17, borderWidth: 2, borderColor: '#82BE41', backgroundColor: palette.white, padding: 13, gap: 5 }, goalKicker: { color: '#5D9730', fontFamily: 'Nunito_800ExtraBold', fontSize: 8.5, letterSpacing: 1 }, goalTitle: { color: palette.ink, fontFamily: 'Nunito_800ExtraBold', fontSize: 13 }, goalProgress: { height: 7, borderRadius: 4, overflow: 'hidden', backgroundColor: '#E8E2DA' }, goalFill: { height: '100%', backgroundColor: '#84C241' }, goalMeta: { color: '#77716C', fontFamily: 'Nunito_400Regular', fontSize: 9 }, badgeSection: { gap: 8 }, sectionTitle: { color: '#65616A', fontFamily: 'Nunito_800ExtraBold', fontSize: 9, letterSpacing: 1.2 }, badges: { flexDirection: 'row', justifyContent: 'space-between', gap: 7 }, badgeItem: { flex: 1, alignItems: 'center', gap: 5 }, badgeCircle: { width: 55, height: 55, borderRadius: 28, borderWidth: 1.5, borderColor: '#DDD7D0', backgroundColor: palette.white, alignItems: 'center', justifyContent: 'center' }, badgeUnlocked: { backgroundColor: '#1D2A5C', borderColor: '#1D2A5C' }, badgeIcon: { color: '#B1AAA1', fontSize: 22 }, badgeIconUnlocked: { color: palette.white }, badgeLabel: { minHeight: 25, color: '#5F6270', fontFamily: 'Nunito_700Bold', fontSize: 7.5, lineHeight: 10, textAlign: 'center' }, menu: { borderRadius: 17, backgroundColor: palette.white, paddingHorizontal: 12, shadowColor: '#1D2A5C', shadowOpacity: .07, shadowRadius: 8, elevation: 2 }, menuRow: { minHeight: 51, flexDirection: 'row', alignItems: 'center', gap: 10, borderBottomWidth: 1, borderBottomColor: '#ECE7E1' }, menuLabel: { flex: 1, color: palette.ink, fontFamily: 'Nunito_800ExtraBold', fontSize: 11.5 }, menuValue: { color: '#77716C', fontFamily: 'Nunito_400Regular', fontSize: 10 }, menuChevron: { color: '#99928A', fontSize: 21 }, accountLinks: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }, accountLink: { color: '#6F6A64', fontFamily: 'Nunito_700Bold', fontSize: 9.5, textDecorationLine: 'underline' }, accountDot: { color: '#AAA39A' } });
