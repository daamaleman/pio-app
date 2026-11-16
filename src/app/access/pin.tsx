import { toMiskituDraft } from '@/lib/miskitu-draft';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, View } from 'react-native';
import { Text } from '@/components/localized-native';
import { BrandIcon, Button, Card, PioMark, Screen, SectionTitle, TopBar, palette } from '@/components/pio-ui';
import { familyConsentAccepted, StudentLoginError } from '@/features/access/student-login';
import { firstUseCompleted } from '@/features/access/first-use';
import { useAppState } from '@/lib/app-state';
import { t } from '@/lib/i18n';
const numericKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'];
const primaryKeys = [
    { image: require('../../../assets/images/brand/emotion-0.jpg'), background: '#FFF7D6', border: '#E7B92E' },
    { image: require('../../../assets/images/brand/emotion-1.jpg'), background: '#E4F5FC', border: '#67BDE0' },
    { image: require('../../../assets/images/brand/emotion-3.jpg'), background: '#F3E8F6', border: '#B486C0' },
    { icon: 'star', color: '#D49A00', background: '#FFF4D6', border: '#E7B330' },
    { icon: 'home', color: palette.teacherBlue, background: '#E8EEFF', border: '#7387CE' },
    { icon: 'plant', color: palette.green, background: '#E6F4E4', border: '#68A768' },
    { icon: 'book', color: palette.ink, background: '#E9F1FA', border: '#7185B9' },
    { icon: 'heart', color: palette.roseDeep, background: '#FDE7EF', border: '#DF789A' },
    { icon: 'clock', color: palette.teacherBlue, background: '#E8EDFF', border: '#7088CF' },
] as const;
export default function PinScreen() {
    const { language, selectedStudent, signInStudent } = useAppState();
    const [pin, setPin] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [invalidPin, setInvalidPin] = useState(false);
    const isSecondary = selectedStudent?.level === 'secondary';
    const add = (value: string) => {
        setError('');
        setInvalidPin(false);
        setPin((current) => current.length < 4 ? [...current, value] : current);
    };
    const removeLast = () => {
        setError('');
        setInvalidPin(false);
        setPin((current) => current.slice(0, -1));
    };
    async function enter() {
        if (pin.length !== 4 || loading)
            return;
        setLoading(true);
        setError('');
        try {
            const studentId = selectedStudent?.id;
            await signInStudent(pin.join(''));
            const hasConsent = await familyConsentAccepted();
            if (!hasConsent)
                router.replace('/access/consent');
            else if (studentId && await firstUseCompleted(studentId))
                router.replace('/student/home');
            else
                router.replace('/access/first-use');
        }
        catch (cause) {
            if (cause instanceof StudentLoginError && cause.code === 'INVALID_PIN') {
                setError(`${cause.attemptsLeft ?? '…'} intentos disponibles`);
                setInvalidPin(true);
            }
            else if (cause instanceof StudentLoginError && cause.code === 'PIN_LOCKED')
                setError(`${t('waitPin', language)} ${Math.max(1, Math.ceil((cause.retryAfterSeconds ?? 60) / 60))} ${t('minutesBeforeRetry', language)}`);
            else if (cause instanceof StudentLoginError && cause.code === 'PIN_NOT_SET')
                setError(t('pinHelpSet', language));
            else if (cause instanceof Error && cause.message.includes('family_consents'))
                setError(t('cannotVerifyConsent', language));
            else
                setError(t('cannotSignIn', language));
        }
        finally {
            setLoading(false);
        }
    }
    if (!isSecondary && invalidPin)
        return <Screen scroll={false} horizontalPadding={28}>
    <View style={local.pinErrorScreen}><PioMark pose="sad" size={150}/><Text style={local.pinErrorTitle}>Mmm, esos no son tus dibujos</Text><Text style={local.pinErrorCopy}>No pasa nada. Probá otra vez o pedile a tu profe que te ayude a crear dibujos nuevos.</Text><Text style={local.pinAttempts}>{error}</Text></View>
    <View style={local.primaryFooter}><Button title="Intentar otra vez" onPress={() => { setPin([]); setError(''); setInvalidPin(false); }}/><Button title="Pedir ayuda a mi profe" variant="ghost" onPress={() => Alert.alert('Pedí ayuda a tu profe', 'Tu docente puede ayudarte a recordar o cambiar tus dibujos secretos.')}/></View>
  </Screen>;
    if (!isSecondary)
        return <Screen scroll={false} horizontalPadding={28} footer={<View style={local.primaryFooter}><Text style={local.help}>{t('pinHelp', language)}</Text><Button title={loading ? t('checking', language) : t('enter', language)} disabled={pin.length !== 4 || loading} onPress={enter}/></View>}>
    <TopBar title={t('stepThree', language)} onBack={() => router.back()}/>
    <View style={local.greetingRow}><PioMark pose="hello" size={54} style={local.greetingPio}/><View style={local.speechBubble}><Text style={local.speechText}>{language === 'en' ? `Hi, ${selectedStudent?.displayName.split(' ')[0] ?? ''}! Tap your 4 secret pictures.` : language === "miq" ? toMiskituDraft(`¡Hola, ${selectedStudent?.displayName.split(' ')[0] ?? ''}! Tocá tus 4 dibujos secretos.`) : `¡Hola, ${selectedStudent?.displayName.split(' ')[0] ?? ''}! Tocá tus 4 dibujos secretos.`}</Text></View></View>
    <View style={local.patternRow}>
      <View style={local.pin}>{[0, 1, 2, 3].map((index) => { const key = pin[index]; const picture = key ? primaryKeys[Number(key) - 1] : undefined; return <View key={index} style={[local.pinSlot, picture && local.pinSlotActive, picture && { backgroundColor: picture.background, borderColor: picture.border }]}>{key ? <PinPicture value={key}/> : null}</View>; })}</View>
      <Pressable accessibilityRole="button" accessibilityLabel={t('deleteLast', language)} disabled={!pin.length} onPress={removeLast} style={({ pressed }) => [local.deleteButton, !pin.length && local.deleteDisabled, pressed && local.deletePressed]}><Text style={local.deleteIcon}>⌫</Text></Pressable>
    </View>
    {error ? <Card tone="yellow"><View style={local.errorRow}><PioMark small pose="sad"/><Text accessibilityRole="alert" style={local.error}>{error}</Text></View></Card> : null}
    <View style={local.grid}>{primaryKeys.map((item, index) => { const selected = pin.includes(String(index + 1)); return <Pressable accessibilityRole="button" accessibilityLabel={`Dibujo ${index + 1}`} accessibilityState={{ selected }} key={index} onPress={() => add(String(index + 1))} style={({ pressed }) => [local.icon, { backgroundColor: item.background, borderColor: item.border }, selected && local.iconSelected, pressed && local.iconPressed]}>{'image' in item ? <Image source={item.image} resizeMode="cover" style={local.emotionIcon}/> : <BrandIcon name={item.icon} color={item.color} size={42}/>}{selected ? <View style={local.selectedBadge}><Text style={local.selectedBadgeText}>✓</Text></View> : null}</Pressable>; })}</View>
  </Screen>;
    return <Screen><TopBar title={t('stepThree', language)} onBack={() => router.back()}/><SectionTitle title={t('pin', language)} body={t('pinDigits', language)}/>
    <View style={local.pin}>{[0, 1, 2, 3].map((index) => { const key = pin[index]; return <View key={index} style={[local.pinDot, key && local.pinDotActive]}><Text style={local.pinText}>{key ? '●' : ''}</Text></View>; })}</View>
    <View style={local.numericGrid}>{numericKeys.map((key, index) => key ? <Pressable accessibilityRole="button" key={index} onPress={() => key === '⌫' ? removeLast() : add(key)} style={local.numericKey}><Text style={local.numericText}>{key}</Text></Pressable> : <View key={index} style={local.numericKeyEmpty}/>)}</View>
    {error ? <Card tone="yellow"><View style={local.errorRow}><PioMark small pose="sad"/><Text accessibilityRole="alert" style={local.error}>{error}</Text></View></Card> : null}
    <Button title={loading ? t('checking', language) : t('continue', language)} disabled={pin.length !== 4 || loading} onPress={enter}/>
    <Text style={local.help}>{t('pinHelp', language)}</Text>
  </Screen>;
}
function PinPicture({ value }: {
    value: string;
}) {
    const item = primaryKeys[Number(value) - 1];
    if (!item)
        return null;
    if ('image' in item)
        return <Image source={item.image} resizeMode="cover" style={local.selectedEmotionIcon}/>;
    return <BrandIcon name={item.icon} color={item.color} size={25}/>;
}
const local = StyleSheet.create({ greetingRow: { flexDirection: 'row', alignItems: 'center', gap: 9 }, greetingPio: { width: 50, height: 50, borderRadius: 25, alignSelf: 'auto' }, speechBubble: { flex: 1, minHeight: 58, justifyContent: 'center', borderWidth: 1.2, borderColor: palette.line, borderRadius: 16, paddingHorizontal: 13, paddingVertical: 9, backgroundColor: palette.white }, speechText: { color: palette.ink, fontFamily: 'Nunito_700Bold', fontSize: 14, lineHeight: 18 }, patternRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }, pin: { flexDirection: 'row', justifyContent: 'center', gap: 8 }, pinSlot: { width: 47, height: 47, borderRadius: 13, backgroundColor: palette.white, borderWidth: 1.6, borderColor: palette.line, alignItems: 'center', justifyContent: 'center' }, pinSlotActive: { borderWidth: 1.8 }, deleteButton: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: palette.roseSoft, borderWidth: 1.5, borderColor: palette.roseDeep }, deleteDisabled: { opacity: 0.35, borderColor: palette.line, backgroundColor: palette.sand }, deletePressed: { transform: [{ scale: 0.94 }] }, deleteIcon: { color: palette.roseDeep, fontFamily: 'Nunito_800ExtraBold', fontSize: 22, lineHeight: 26 }, pinDot: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#E7E2DB', alignItems: 'center', justifyContent: 'center' }, pinDotActive: { backgroundColor: palette.ink }, pinDotDrawing: { backgroundColor: palette.white, borderWidth: 1.5, borderColor: palette.roseDeep }, pinText: { color: palette.white, fontSize: 17 }, grid: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', alignContent: 'center', alignItems: 'center', rowGap: 12, columnGap: 10, justifyContent: 'center', paddingHorizontal: 0 }, icon: { position: 'relative', width: '30%', aspectRatio: 0.98, borderRadius: 18, alignItems: 'center', justifyContent: 'center', borderWidth: 1.7, shadowColor: '#20305F', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.11, shadowRadius: 5, elevation: 3 }, iconSelected: { borderWidth: 2.8, borderColor: palette.roseDeep, shadowColor: palette.roseDeep, shadowOpacity: 0.24, transform: [{ scale: 1.02 }] }, iconPressed: { opacity: 0.72, transform: [{ scale: 0.96 }] }, selectedBadge: { position: 'absolute', top: 7, right: 7, width: 20, height: 20, borderRadius: 10, backgroundColor: palette.roseDeep, alignItems: 'center', justifyContent: 'center' }, selectedBadgeText: { color: palette.white, fontFamily: 'Nunito_800ExtraBold', fontSize: 12, lineHeight: 15 }, emotionIcon: { width: 52, height: 52, borderRadius: 26 }, selectedEmotionIcon: { width: 31, height: 31, borderRadius: 16 }, primaryFooter: { gap: 8 }, numericGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 9 }, numericKey: { width: '30%', aspectRatio: 1.08, backgroundColor: palette.sand, borderWidth: 1, borderColor: palette.line, borderRadius: 30, alignItems: 'center', justifyContent: 'center' }, numericKeyEmpty: { width: '30%', aspectRatio: 1.08 }, numericText: { color: palette.ink, fontFamily: 'Nunito_800ExtraBold', fontSize: 23 }, help: { color: palette.teacherBlue, fontFamily: 'Nunito_800ExtraBold', textAlign: 'center', fontSize: 12 }, errorRow: { flexDirection: 'row', alignItems: 'center', gap: 9 }, error: { flex: 1, color: palette.ink, fontFamily: 'Nunito_700Bold', textAlign: 'left', lineHeight: 20 }, pinErrorScreen: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 }, pinErrorTitle: { color: palette.ink, fontFamily: 'Baloo2_700Bold', fontSize: 24, textAlign: 'center' }, pinErrorCopy: { color: '#656A79', fontFamily: 'Nunito_400Regular', fontSize: 13, lineHeight: 19, textAlign: 'center' }, pinAttempts: { color: palette.roseDeep, fontFamily: 'Nunito_800ExtraBold', fontSize: 11 } });
