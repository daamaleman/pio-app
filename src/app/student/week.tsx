import { toMiskituDraft } from '@/lib/miskitu-draft';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from '@/components/localized-native';
import { BrandIcon, PioMark, Screen, palette } from '@/components/pio-ui';
import { SecondaryChatPill } from '@/components/secondary-chat-pill';
import { StudentNavSpacer } from '@/components/student-nav';
import type { StudentWeek } from '@/features/student/my-week';
import { useAppState } from '@/lib/app-state';
import { localizedText, t } from '@/lib/i18n';
import { primaryWeekProgression } from '@/lib/primary-week-progression';
import type { AppLanguage } from '@/lib/types';
export default function WeekScreen() {
    const { studentWeek, lessons, language, session } = useAppState();
    const current = studentWeek?.current;
    const weekNumbers = [1, 2, 3, 4];
    const { activeWeek, isUnlocked, isCompleted } = primaryWeekProgression(lessons);
    const completedWeeks = weekNumbers.filter(isCompleted);
    const [selectedWeek, setSelectedWeek] = useState(1);
    if (session.kind === 'student' && session.student.level === 'secondary')
        return <SecondaryWeek language={language} lessons={lessons} current={current} activeWeek={activeWeek}/>;
    const selectedLesson = lessons.find((lesson) => lesson.week === selectedWeek);
    const selectedCurrent = current?.week === selectedWeek ? current : undefined;
    const lessonSlug = selectedCurrent?.lesson_slug ?? selectedLesson?.slug;
    const lessonTitle = selectedCurrent?.title ?? selectedLesson?.title;
    const duration = selectedCurrent?.duration_min ?? selectedLesson?.duration ?? 20;
    const activities = weekActivities(selectedWeek, language);
    const canOpen = Boolean(lessonSlug && isUnlocked(selectedWeek));
    const fallbackStatus = isCompleted(selectedWeek) ? 'completed' : selectedWeek === activeWeek ? 'in_progress' : 'not_started';
    function selectOrOpenWeek(week: number) {
        if (week !== selectedWeek) {
            setSelectedWeek(week);
            return;
        }
        const targetLesson = lessons.find((item) => item.week === week);
        const targetCurrent = current?.week === week ? current : undefined;
        const targetSlug = targetCurrent?.lesson_slug ?? targetLesson?.slug;
        const targetCanOpen = Boolean(targetSlug && isUnlocked(week));
        if (targetSlug && targetCanOpen)
            router.push({ pathname: '/student/lesson/[slug]', params: { slug: targetSlug, position: String(weekActivities(week, language)[0].position) } });
    }
    return <Screen color="#FFFCF7" footer={<StudentNavSpacer />}>
    <Text style={local.title}>{t('weekTitle', language)}</Text>
    <View style={local.weekSelector}><Text style={local.selectorLabel}>{t('weekNumber', language)}</Text>{weekNumbers.map((week) => <Pressable accessibilityRole="button" accessibilityHint={week === selectedWeek ? (language === 'en' ? 'Opens this week' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Abre esta semana') : 'Abre esta semana') : (language as AppLanguage) === "miq" ? toMiskituDraft('Abre esta semana') : 'Abre esta semana') : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Abre esta semana') : 'Abre esta semana') : (language as AppLanguage) === "miq" ? toMiskituDraft('Abre esta semana') : 'Abre esta semana') : (language === 'en' ? 'Shows this week' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Muestra esta semana') : 'Muestra esta semana') : (language as AppLanguage) === "miq" ? toMiskituDraft('Muestra esta semana') : 'Muestra esta semana') : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Muestra esta semana') : 'Muestra esta semana') : (language as AppLanguage) === "miq" ? toMiskituDraft('Muestra esta semana') : 'Muestra esta semana')} accessibilityState={{ selected: week === selectedWeek }} key={week} onPress={() => selectOrOpenWeek(week)} style={[local.weekCircle, week === selectedWeek && local.weekActive]}><Text style={[local.weekCircleText, week === selectedWeek && local.weekCircleTextActive]}>{completedWeeks.includes(week) ? `${week} ✓` : week}</Text></Pressable>)}</View>
    {lessonSlug && lessonTitle ? <>
      <View style={local.assignment}><Text style={local.eyebrow}>{t('fromTeacher', language)} · {(studentWeek?.teacher_name ?? 'Pío').toUpperCase()}</Text><View style={local.lessonHead}><View style={local.lessonCopy}><Text style={local.lessonTitle}>{localizedText(lessonTitle, language)}</Text><Text style={local.message}>{selectedCurrent?.message ?? t('weekHint', language)}{selectedCurrent ? ` · ${t('nextClass', language)}: ${formatWeekday(selectedCurrent.class_date, language)}` : ''}</Text></View><View style={local.lessonBadge}><BrandIcon name="smile" color={palette.white} size={28}/></View></View></View>
      <View style={local.parts}>{activities.map((activity, index) => { const part = selectedCurrent?.parts[index]; const status = part?.status ?? (fallbackStatus === 'completed' ? 'completed' : index === 0 ? fallbackStatus : 'not_started'); return <LessonRow key={activity.title} title={activity.title} status={status} disabled={!canOpen} detail={status === 'completed' ? t('done', language) : status === 'in_progress' ? `${duration} min · nuevo` : `${duration} min`} onPress={() => router.push({ pathname: '/student/lesson/[slug]', params: { slug: lessonSlug, position: String(activity.position) } })}/>; })}
        <LessonRow title={t('familyChallenge', language)} detail={t('familyChallengeHint', language)} status="home" disabled={!canOpen} onPress={() => router.push({ pathname: '/student/lesson/[slug]', params: { slug: lessonSlug } })}/>
      </View>
    </> : <View style={local.empty}><PioMark pose="story" size={86}/><Text style={local.lessonTitle}>{t('noAssignment', language)}</Text><Text style={local.message}>{t('weekHint', language)}</Text></View>}
  </Screen>;
}
function LessonRow({ title, detail, status, disabled = false, onPress }: {
    title: string;
    detail: string;
    status: 'completed' | 'in_progress' | 'not_started' | 'home';
    disabled?: boolean;
    onPress: () => void;
}) {
    const completed = status === 'completed';
    const active = status === 'in_progress';
    const home = status === 'home';
    return <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress} style={[local.partRow, active && local.partCurrent, home && local.partHome, disabled && local.partDisabled]}>
    <View style={[local.partIcon, completed && local.partIconDone, active && local.partIconCurrent]}>{completed || active ? <Text style={local.iconGlyph}>{completed ? '✓' : '→'}</Text> : <BrandIcon name={home ? 'family' : 'lock'} color={palette.ink} size={18}/>}</View>
    <View style={local.partCopy}><Text style={local.partTitle}>{title}</Text><Text style={local.partStatus}>{detail}</Text></View>
  </Pressable>;
}
function weekActivities(week: number, language: 'es' | 'en' | 'miq') {
    const en = language === 'en';
    if (week === 1)
        return [
            { title: en ? 'Meet the drops' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Conocé las gotas') : 'Conocé las gotas') : (language as AppLanguage) === "miq" ? toMiskituDraft('Conocé las gotas') : 'Conocé las gotas', position: 2 },
            { title: en ? 'Catch a drop' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Atrapa la gota') : 'Atrapa la gota') : (language as AppLanguage) === "miq" ? toMiskituDraft('Atrapa la gota') : 'Atrapa la gota', position: 6 },
            { title: en ? 'Where do I feel my emotions?' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('¿Dónde siento mis emociones?') : '¿Dónde siento mis emociones?') : (language as AppLanguage) === "miq" ? toMiskituDraft('¿Dónde siento mis emociones?') : '¿Dónde siento mis emociones?', position: 7 },
        ];
    if (week === 2)
        return [
            { title: t('partLearn', language), position: 1 },
            { title: t('partPractice', language), position: 2 },
            { title: t('partApply', language), position: 3 },
        ];
    if (week === 3)
        return [
            { title: en ? 'Kind or unkind?' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('¿Buen trato o maltrato?') : '¿Buen trato o maltrato?') : (language as AppLanguage) === "miq" ? toMiskituDraft('¿Buen trato o maltrato?') : '¿Buen trato o maltrato?', position: 1 },
            { title: en ? 'In someone else’s shoes' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('En los zapatos de otro') : 'En los zapatos de otro') : (language as AppLanguage) === "miq" ? toMiskituDraft('En los zapatos de otro') : 'En los zapatos de otro', position: 2 },
            { title: en ? 'Everyone’s treasure' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('El tesoro de todos') : 'El tesoro de todos') : (language as AppLanguage) === "miq" ? toMiskituDraft('El tesoro de todos') : 'El tesoro de todos', position: 3 },
        ];
    if (week === 4)
        return [
            { title: en ? 'My superhero shield' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Mi escudo de superhéroe') : 'Mi escudo de superhéroe') : (language as AppLanguage) === "miq" ? toMiskituDraft('Mi escudo de superhéroe') : 'Mi escudo de superhéroe', position: 1 },
            { title: en ? 'My trusted adults' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Mis adultos de confianza') : 'Mis adultos de confianza') : (language as AppLanguage) === "miq" ? toMiskituDraft('Mis adultos de confianza') : 'Mis adultos de confianza', position: 2 },
            { title: en ? 'Month check-in' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Cierre y autoevaluación') : 'Cierre y autoevaluación') : (language as AppLanguage) === "miq" ? toMiskituDraft('Cierre y autoevaluación') : 'Cierre y autoevaluación', position: 3 },
        ];
    return [
        { title: t('partLearn', language), position: 1 },
        { title: t('partPractice', language), position: 2 },
        { title: t('partApply', language), position: 3 },
    ];
}
function SecondaryWeek({ language, lessons, current, activeWeek }: {
    language: 'es' | 'en' | 'miq';
    lessons: ReturnType<typeof useAppState>['lessons'];
    current: StudentWeek['current'] | undefined;
    activeWeek: number;
}) {
    const { studentWeek } = useAppState();
    const [selectedWeek, setSelectedWeek] = useState(activeWeek);
    const lesson = lessons.find((item) => item.week === selectedWeek);
    const selectedCurrent = current?.week === selectedWeek ? current : undefined;
    const parts = selectedCurrent?.parts ?? [];
    const teacher = studentWeek?.teacher_name ?? 'Ana';
    const title = selectedCurrent ? localizedText(selectedCurrent.title, language) : lesson ? localizedText(lesson.title, language) : t('noAssignment', language);
    const canOpen = Boolean((selectedCurrent || lesson) && (__DEV__ || selectedCurrent || lesson?.unlocked || lesson?.status === 'completed'));
    const chapterTitles = language === 'en' ? ['Understand group pressure', 'Examples and the “no” formula', 'Practice: Choose your adventure', 'Apply: My plan'] : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft(['Entender la presión de grupo', 'Ejemplos y la fórmula del «no»', 'Practicar: Elegí tu aventura', 'Aplicar: Mi plan']) : ['Entender la presión de grupo', 'Ejemplos y la fórmula del «no»', 'Practicar: Elegí tu aventura', 'Aplicar: Mi plan']) : (language as AppLanguage) === "miq" ? toMiskituDraft(['Entender la presión de grupo', 'Ejemplos y la fórmula del «no»', 'Practicar: Elegí tu aventura', 'Aplicar: Mi plan']) : ['Entender la presión de grupo', 'Ejemplos y la fórmula del «no»', 'Practicar: Elegí tu aventura', 'Aplicar: Mi plan']) : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft(['Entender la presión de grupo', 'Ejemplos y la fórmula del «no»', 'Practicar: Elegí tu aventura', 'Aplicar: Mi plan']) : ['Entender la presión de grupo', 'Ejemplos y la fórmula del «no»', 'Practicar: Elegí tu aventura', 'Aplicar: Mi plan']) : (language as AppLanguage) === "miq" ? toMiskituDraft(['Entender la presión de grupo', 'Ejemplos y la fórmula del «no»', 'Practicar: Elegí tu aventura', 'Aplicar: Mi plan']) : ['Entender la presión de grupo', 'Ejemplos y la fórmula del «no»', 'Practicar: Elegí tu aventura', 'Aplicar: Mi plan'];
    const chapterDetails = language === 'en' ? ['Fact · 6 min', 'Next · 6 min', '9 min', '6 min'] : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft(['Hecho · 6 min', 'Siguiente · 6 min', '9 min', '6 min']) : ['Hecho · 6 min', 'Siguiente · 6 min', '9 min', '6 min']) : (language as AppLanguage) === "miq" ? toMiskituDraft(['Hecho · 6 min', 'Siguiente · 6 min', '9 min', '6 min']) : ['Hecho · 6 min', 'Siguiente · 6 min', '9 min', '6 min']) : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft(['Hecho · 6 min', 'Siguiente · 6 min', '9 min', '6 min']) : ['Hecho · 6 min', 'Siguiente · 6 min', '9 min', '6 min']) : (language as AppLanguage) === "miq" ? toMiskituDraft(['Hecho · 6 min', 'Siguiente · 6 min', '9 min', '6 min']) : ['Hecho · 6 min', 'Siguiente · 6 min', '9 min', '6 min'];
    const positions = [1, 5, 8, 11];
    function open(position: number) {
        const slug = selectedCurrent?.lesson_slug ?? lesson?.slug;
        if (slug && canOpen)
            router.push({ pathname: '/student/lesson/[slug]', params: { slug, position: String(position) } });
    }
    return <Screen color="#F8F7F4" footer={<StudentNavSpacer />}>
    <View style={secondary.weekHeading}><Text style={secondary.title}>{t('weekTitle', language)}</Text><View style={secondary.weeks}>{[1, 2, 3, 4].map((week) => <Pressable accessibilityRole="button" accessibilityState={{ selected: week === selectedWeek }} key={week} onPress={() => setSelectedWeek(week)} style={[secondary.circle, week === selectedWeek && secondary.active]}><Text style={[secondary.circleText, week === selectedWeek && secondary.circleTextActive]}>S{week}</Text></Pressable>)}</View></View>
    <View style={secondary.heroCard}><View style={secondary.zigzag}><Text style={secondary.zigzagText}>⌁⌁⌁⌁⌁⌁⌁⌁⌁</Text></View><Text style={secondary.kicker}>{language === 'en' ? `WEEK ${selectedWeek} · ASSIGNED BY ${teacher.toUpperCase()}` : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft(`SEMANA ${selectedWeek} · TAREA DE ${teacher.toUpperCase()}`) : `SEMANA ${selectedWeek} · TAREA DE ${teacher.toUpperCase()}`) : (language as AppLanguage) === "miq" ? toMiskituDraft(`SEMANA ${selectedWeek} · TAREA DE ${teacher.toUpperCase()}`) : `SEMANA ${selectedWeek} · TAREA DE ${teacher.toUpperCase()}`) : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft(`SEMANA ${selectedWeek} · TAREA DE ${teacher.toUpperCase()}`) : `SEMANA ${selectedWeek} · TAREA DE ${teacher.toUpperCase()}`) : (language as AppLanguage) === "miq" ? toMiskituDraft(`SEMANA ${selectedWeek} · TAREA DE ${teacher.toUpperCase()}`) : `SEMANA ${selectedWeek} · TAREA DE ${teacher.toUpperCase()}`}</Text><Text style={secondary.lessonTitle}>{title}</Text><Text style={secondary.heroBody}>{selectedCurrent?.message ?? (language === 'en' ? 'This week you will practice making decisions with confidence and respect.' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Esta semana practicamos cómo decidir con seguridad, respeto y confianza.') : 'Esta semana practicamos cómo decidir con seguridad, respeto y confianza.') : (language as AppLanguage) === "miq" ? toMiskituDraft('Esta semana practicamos cómo decidir con seguridad, respeto y confianza.') : 'Esta semana practicamos cómo decidir con seguridad, respeto y confianza.') : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Esta semana practicamos cómo decidir con seguridad, respeto y confianza.') : 'Esta semana practicamos cómo decidir con seguridad, respeto y confianza.') : (language as AppLanguage) === "miq" ? toMiskituDraft('Esta semana practicamos cómo decidir con seguridad, respeto y confianza.') : 'Esta semana practicamos cómo decidir con seguridad, respeto y confianza.')}</Text><View style={secondary.heroMountains}><View style={secondary.mountainOne}/><View style={secondary.mountainTwo}/></View></View>
    <View style={secondary.chapters}>{chapterTitles.map((chapter, index) => { const status = parts[index]?.status ?? (lesson?.status === 'completed' ? 'completed' : index === 0 && canOpen ? 'in_progress' : 'not_started'); const done = status === 'completed'; const active = status === 'in_progress'; return <Pressable accessibilityRole="button" disabled={!canOpen || status === 'not_started' && index > 1} key={chapter} onPress={() => open(positions[index])} style={[secondary.chapter, active && secondary.chapterActive, (!canOpen || status === 'not_started' && index > 1) && secondary.chapterLocked]}><View style={[secondary.chapterIcon, done && secondary.chapterDone, active && secondary.chapterCurrent]}>{done ? <Text style={secondary.chapterGlyph}>✓</Text> : active ? <Text style={secondary.chapterGlyph}>▣</Text> : <BrandIcon name="lock" color="#8D887F" size={15}/>}</View><View style={secondary.chapterCopy}><Text style={secondary.chapterKicker}>{language === 'en' ? `CHAPTER ${String(index + 1).padStart(2, '0')}` : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft(`CAPÍTULO ${String(index + 1).padStart(2, '0')}`) : `CAPÍTULO ${String(index + 1).padStart(2, '0')}`) : (language as AppLanguage) === "miq" ? toMiskituDraft(`CAPÍTULO ${String(index + 1).padStart(2, '0')}`) : `CAPÍTULO ${String(index + 1).padStart(2, '0')}`) : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft(`CAPÍTULO ${String(index + 1).padStart(2, '0')}`) : `CAPÍTULO ${String(index + 1).padStart(2, '0')}`) : (language as AppLanguage) === "miq" ? toMiskituDraft(`CAPÍTULO ${String(index + 1).padStart(2, '0')}`) : `CAPÍTULO ${String(index + 1).padStart(2, '0')}`}</Text><Text style={secondary.chapterTitle}>{chapter}</Text><Text style={secondary.chapterMeta}>{chapterDetails[index]}</Text></View></Pressable>; })}</View>
    <Pressable accessibilityRole="button" onPress={() => open(12)} style={secondary.homeChallenge}><BrandIcon name="family" color="#752B73" size={20}/><View style={secondary.chapterCopy}><Text style={secondary.chapterTitle}>{language === 'en' ? 'At home: talk it through' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('En casa: conversalo') : 'En casa: conversalo') : (language as AppLanguage) === "miq" ? toMiskituDraft('En casa: conversalo') : 'En casa: conversalo') : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('En casa: conversalo') : 'En casa: conversalo') : (language as AppLanguage) === "miq" ? toMiskituDraft('En casa: conversalo') : 'En casa: conversalo'}</Text><Text style={secondary.chapterMeta}>{language === 'en' ? 'A short activity with someone you trust' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Una actividad breve con alguien de confianza') : 'Una actividad breve con alguien de confianza') : (language as AppLanguage) === "miq" ? toMiskituDraft('Una actividad breve con alguien de confianza') : 'Una actividad breve con alguien de confianza') : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Una actividad breve con alguien de confianza') : 'Una actividad breve con alguien de confianza') : (language as AppLanguage) === "miq" ? toMiskituDraft('Una actividad breve con alguien de confianza') : 'Una actividad breve con alguien de confianza'}</Text></View></Pressable>
    <SecondaryChatPill language={language}/>
  </Screen>;
}
const local = StyleSheet.create({
    title: { color: palette.ink, fontFamily: 'Baloo2_700Bold', fontSize: 25, lineHeight: 29 },
    weekSelector: { flexDirection: 'row', alignItems: 'center', gap: 9 }, selectorLabel: { color: '#6E6964', fontFamily: 'Nunito_800ExtraBold', fontSize: 10, marginRight: 4 },
    weekCircle: { width: 42, height: 42, borderRadius: 21, borderWidth: 1.5, borderColor: '#E6E0D9', alignItems: 'center', justifyContent: 'center', backgroundColor: palette.white }, weekActive: { backgroundColor: '#FFE4ED', borderColor: palette.rose }, weekCircleText: { color: '#676D7C', fontFamily: 'Nunito_800ExtraBold', fontSize: 12 }, weekCircleTextActive: { color: palette.roseDeep },
    assignment: { backgroundColor: '#FFDCE9', borderRadius: 19, padding: 15, gap: 7 }, eyebrow: { color: palette.roseDeep, fontFamily: 'Nunito_800ExtraBold', fontSize: 10, letterSpacing: 1 }, lessonHead: { flexDirection: 'row', alignItems: 'center', gap: 10 }, lessonCopy: { flex: 1, gap: 4 }, lessonTitle: { color: palette.ink, fontFamily: 'Baloo2_700Bold', fontSize: 19, lineHeight: 22 }, message: { color: '#51566D', fontFamily: 'Nunito_400Regular', fontSize: 11, lineHeight: 16 }, lessonBadge: { width: 49, height: 49, borderRadius: 15, backgroundColor: '#C87846', borderWidth: 2, borderColor: palette.ink, alignItems: 'center', justifyContent: 'center' },
    parts: { gap: 8 }, partRow: { minHeight: 66, flexDirection: 'row', alignItems: 'center', gap: 11, borderRadius: 17, borderWidth: 1.5, borderColor: '#E6E0D9', paddingHorizontal: 12, backgroundColor: palette.white }, partCurrent: { borderWidth: 2, borderColor: palette.rose }, partHome: { backgroundColor: '#F7F4F0' }, partDisabled: { opacity: 0.45 }, partIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F3EEE8', alignItems: 'center', justifyContent: 'center' }, partIconDone: { backgroundColor: '#78BE43' }, partIconCurrent: { backgroundColor: palette.roseDeep }, iconGlyph: { color: palette.white, fontFamily: 'Nunito_800ExtraBold', fontSize: 20 }, partCopy: { flex: 1, gap: 1 }, partTitle: { color: palette.ink, fontFamily: 'Nunito_800ExtraBold', fontSize: 13 }, partStatus: { color: '#777779', fontFamily: 'Nunito_400Regular', fontSize: 10.5 }, empty: { minHeight: 230, alignItems: 'center', justifyContent: 'center', gap: 8 },
});
function formatWeekday(date: string, language: string) {
    const locale = language === 'en' ? 'en-US' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('es-NI') : 'es-NI') : (language as AppLanguage) === "miq" ? toMiskituDraft('es-NI') : 'es-NI') : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('es-NI') : 'es-NI') : (language as AppLanguage) === "miq" ? toMiskituDraft('es-NI') : 'es-NI';
    return new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(new Date(`${date}T12:00:00`));
}
const secondary = StyleSheet.create({ weekHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 }, title: { color: palette.ink, fontFamily: 'Baloo2_700Bold', fontSize: 25 }, weeks: { flexDirection: 'row', gap: 6 }, circle: { width: 38, height: 38, borderRadius: 19, backgroundColor: palette.white, borderWidth: 1.5, borderColor: '#E3DED7', alignItems: 'center', justifyContent: 'center' }, active: { backgroundColor: '#1D2A5C', borderColor: '#1D2A5C' }, circleText: { color: '#706B64', fontFamily: 'Nunito_800ExtraBold', fontSize: 10 }, circleTextActive: { color: palette.white }, heroCard: { minHeight: 183, borderRadius: 22, overflow: 'hidden', backgroundColor: '#213B83', padding: 17, gap: 6, position: 'relative' }, zigzag: { position: 'absolute', top: -5, left: 0, right: 0, overflow: 'hidden' }, zigzagText: { color: '#5A72AC', letterSpacing: 5, fontSize: 20 }, kicker: { marginTop: 6, color: '#91DDF4', fontFamily: 'Nunito_800ExtraBold', fontSize: 9, letterSpacing: 1 }, lessonTitle: { color: palette.white, fontFamily: 'Baloo2_700Bold', fontSize: 24, lineHeight: 27 }, heroBody: { maxWidth: '72%', color: '#E0E7F7', fontFamily: 'Nunito_400Regular', fontSize: 11, lineHeight: 16 }, heroMountains: { position: 'absolute', right: -8, bottom: -13, width: 130, height: 90 }, mountainOne: { position: 'absolute', bottom: 0, left: 0, width: 78, height: 78, backgroundColor: '#2D4B93', transform: [{ rotate: '45deg' }] }, mountainTwo: { position: 'absolute', bottom: -12, right: -2, width: 76, height: 76, backgroundColor: '#294486', transform: [{ rotate: '45deg' }] }, chapters: { gap: 8 }, chapter: { minHeight: 69, borderRadius: 17, borderWidth: 1.5, borderColor: '#E5E0D9', backgroundColor: palette.white, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 11 }, chapterActive: { borderWidth: 2.5, borderColor: '#203977', shadowColor: '#14234C', shadowOpacity: .08, shadowRadius: 4, elevation: 2 }, chapterLocked: { opacity: .65 }, chapterIcon: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#F0ECE7', alignItems: 'center', justifyContent: 'center' }, chapterDone: { backgroundColor: '#86C83F' }, chapterCurrent: { backgroundColor: '#263E82' }, chapterGlyph: { color: palette.white, fontFamily: 'Nunito_800ExtraBold', fontSize: 18 }, chapterCopy: { flex: 1, gap: 1 }, chapterKicker: { color: '#8A857E', fontFamily: 'Nunito_800ExtraBold', fontSize: 7.5, letterSpacing: 1 }, chapterTitle: { color: palette.ink, fontFamily: 'Nunito_800ExtraBold', fontSize: 12 }, chapterMeta: { color: '#858078', fontFamily: 'Nunito_400Regular', fontSize: 9 }, homeChallenge: { minHeight: 61, borderRadius: 17, backgroundColor: '#F9E5F2', paddingHorizontal: 13, flexDirection: 'row', alignItems: 'center', gap: 10 } });
