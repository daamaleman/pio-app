import { toMiskituDraft } from '@/lib/miskitu-draft';
import { RecordingPresets, requestRecordingPermissionsAsync, setAudioModeAsync, useAudioRecorder, useAudioRecorderState } from 'expo-audio';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useRef, useState } from 'react';
import { Animated, PanResponder, Pressable, StyleSheet, View } from 'react-native';
import { Text } from '@/components/localized-native';
import Svg, { Path as SvgPath } from 'react-native-svg';
import { EmotionDrop } from '@/components/primary-minigame';
import { BrandIcon, Button, PioMark, emotionColor, palette } from '@/components/pio-ui';
import type { AppLanguage, Emotion } from '@/lib/types';
type Props = {
    language: AppLanguage;
    emotion: Emotion;
    gameTitle: string;
    isLastGame: boolean;
    onDone: () => void;
};
const breathingDurations = [4, 2, 4];
export function MinigameClosure({ language, emotion, gameTitle, isLastGame, onDone }: Props) {
    const [stage, setStage] = useState<0 | 1 | 2>(0);
    if (stage === 0)
        return <PrivateReflection language={language} emotion={emotion} gameTitle={gameTitle} onNext={() => setStage(1)}/>;
    if (stage === 1)
        return <GuidedBreathing language={language} onNext={() => setStage(2)}/>;
    return <GameReward language={language} emotion={emotion} gameTitle={gameTitle} isLastGame={isLastGame} onDone={onDone}/>;
}
function PrivateReflection({ language, emotion, gameTitle, onNext }: {
    language: AppLanguage;
    emotion: Emotion;
    gameTitle: string;
    onNext: () => void;
}) {
    const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
    const recorderState = useAudioRecorderState(recorder, 150);
    const [mode, setMode] = useState<'voice' | 'draw'>('voice');
    const [savedAudio, setSavedAudio] = useState(false);
    const [audioError, setAudioError] = useState('');
    const [strokes, setStrokes] = useState<string[]>([]);
    const [draft, setDraft] = useState('');
    const activeStroke = useRef('');
    const [drawingResponder] = useState(() => {
        return PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderTerminationRequest: () => false,
            onPanResponderGrant: (event) => { const { locationX: x, locationY: y } = event.nativeEvent; activeStroke.current = `M ${x} ${y}`; setDraft(activeStroke.current); },
            onPanResponderMove: (event) => { const { locationX: x, locationY: y } = event.nativeEvent; activeStroke.current += ` L ${x} ${y}`; setDraft(activeStroke.current); },
            onPanResponderRelease: () => { const finishedStroke = activeStroke.current; if (finishedStroke)
                setStrokes((value) => value.length < 100 ? [...value, finishedStroke] : value); activeStroke.current = ''; setDraft(''); },
            onPanResponderTerminate: () => { const finishedStroke = activeStroke.current; if (finishedStroke)
                setStrokes((value) => value.length < 100 ? [...value, finishedStroke] : value); activeStroke.current = ''; setDraft(''); },
        });
    });
    async function startRecording() {
        setAudioError('');
        const permission = await requestRecordingPermissionsAsync();
        if (!permission.granted) {
            setAudioError(language === 'en' ? 'Microphone permission is needed to record.' : language === "miq" ? toMiskituDraft('Necesitamos permiso del micrófono para grabar.') : 'Necesitamos permiso del micrófono para grabar.');
            return;
        }
        await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
        await recorder.prepareToRecordAsync();
        recorder.record();
    }
    async function stopRecording() {
        await recorder.stop();
        await setAudioModeAsync({ allowsRecording: false });
        setSavedAudio(Boolean(recorder.uri));
    }
    async function saveReflection() {
        const storageKey = 'pio.private-reflections';
        const stored = await AsyncStorage.getItem(storageKey);
        const reflections = stored ? JSON.parse(stored) as unknown[] : [];
        reflections.push({ gameTitle, emotion, mode, audioUri: savedAudio ? recorder.uri : null, strokes: mode === 'draw' ? strokes : [] });
        await AsyncStorage.setItem(storageKey, JSON.stringify(reflections.slice(-30)));
        onNext();
    }
    const ready = savedAudio || strokes.length > 0;
    const seconds = Math.max(0, Math.floor(recorderState.durationMillis / 1000));
    return <View style={styles.reflectionWrap}>
    <View style={styles.pioSpeech}><PioMark pose="hello" size={50}/><View style={styles.speech}><Text style={styles.speechText}>{reflectionPrompt(emotion, language)}</Text></View></View>
    <Text style={styles.instruction}>{language === 'en' ? 'Tell it with your voice or draw it. Choose the way you like best.' : language === "miq" ? toMiskituDraft('Contalo con tu voz o dibujalo. Elegí la forma que más te guste.') : 'Contalo con tu voz o dibujalo. Elegí la forma que más te guste.'}</Text>
    <View style={styles.modeRow}>
      <Pressable onPress={() => setMode('voice')} style={[styles.modeCard, mode === 'voice' && styles.modeCardActive]}><View style={[styles.modeIcon, styles.micIcon]}><Text style={styles.modeGlyph}>●</Text></View><Text style={styles.modeTitle}>{language === 'en' ? 'Tell it' : language === "miq" ? toMiskituDraft('Contar') : 'Contar'}</Text><Text style={styles.modeMeta}>{savedAudio ? (language === 'en' ? 'Ready' : language === "miq" ? toMiskituDraft('Listo') : 'Listo') : `${seconds}s`}</Text></Pressable>
      <Pressable onPress={() => setMode('draw')} style={[styles.modeCard, mode === 'draw' && styles.modeCardActive]}><View style={[styles.modeIcon, styles.pencilIcon]}><Text style={styles.pencilGlyph}>✎</Text></View><Text style={styles.modeTitle}>{language === 'en' ? 'Draw' : language === "miq" ? toMiskituDraft('Dibujar') : 'Dibujar'}</Text><Text style={styles.modeMeta}>{strokes.length ? (language === 'en' ? 'Ready' : language === "miq" ? toMiskituDraft('Listo') : 'Listo') : (language === 'en' ? 'Empty' : language === "miq" ? toMiskituDraft('Vacío') : 'Vacío')}</Text></Pressable>
    </View>
    {mode === 'voice' ? <View style={styles.voicePanel}>
      <Text style={{ color: '#9B3560', fontFamily: 'Nunito_800ExtraBold', fontSize: 11 }}>{recorderState.isRecording ? (language === 'en' ? 'Pío is listening…' : language === "miq" ? toMiskituDraft('Pío te está escuchando…') : 'Pío te está escuchando…') : (language === 'en' ? 'Tap to start your recording' : language === "miq" ? toMiskituDraft('Tocá para empezar a grabar') : 'Tocá para empezar a grabar')}</Text>
      <RecordingWaveform recording={recorderState.isRecording}/>
      <Pressable onPress={recorderState.isRecording ? stopRecording : startRecording} style={[styles.recordButton, recorderState.isRecording && styles.stopButton]}><Text style={styles.recordButtonText}>{recorderState.isRecording ? (language === 'en' ? 'Stop recording' : language === "miq" ? toMiskituDraft('Detener grabación') : 'Detener grabación') : savedAudio ? (language === 'en' ? 'Record again' : language === "miq" ? toMiskituDraft('Grabar otra vez') : 'Grabar otra vez') : (language === 'en' ? 'Start recording' : language === "miq" ? toMiskituDraft('Empezar a grabar') : 'Empezar a grabar')}</Text></Pressable>
      {audioError ? <Text style={styles.error}>{audioError}</Text> : null}
    </View> : <View>
      <View style={styles.drawingPad} {...drawingResponder.panHandlers}><Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>{strokes.map((path, index) => <SvgPath key={index} d={path} fill="none" stroke={palette.ink} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round"/>)}{draft ? <SvgPath d={draft} fill="none" stroke={palette.ink} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round"/> : null}</Svg>{!strokes.length && !draft ? <Text pointerEvents="none" style={styles.drawHint}>{language === 'en' ? 'Draw here with your finger. You can make several strokes.' : language === "miq" ? toMiskituDraft('Dibujá aquí con tu dedo. Podés hacer varios trazos.') : 'Dibujá aquí con tu dedo. Podés hacer varios trazos.'}</Text> : null}</View>
      {strokes.length ? <Pressable onPress={() => setStrokes([])}><Text style={styles.clearText}>{language === 'en' ? 'Clear drawing' : language === "miq" ? toMiskituDraft('Borrar dibujo') : 'Borrar dibujo'}</Text></Pressable> : null}
    </View>}
    <View style={styles.privacy}><BrandIcon name="lock" color="#77716C" size={15}/><Text style={styles.privacyText}>{language === 'en' ? 'Saved only on this device. Your voice and drawing are not shared.' : language === "miq" ? toMiskituDraft('Se guarda solo en este dispositivo. Tu voz y tu dibujo no se comparten.') : 'Se guarda solo en este dispositivo. Tu voz y tu dibujo no se comparten.'}</Text></View>
    <Button title={language === 'en' ? 'Save' : language === "miq" ? toMiskituDraft('Guardar') : 'Guardar'} disabled={!ready} onPress={saveReflection}/><Pressable onPress={onNext}><Text style={styles.skipText}>{language === 'en' ? 'Skip' : language === "miq" ? toMiskituDraft('Saltar') : 'Saltar'}</Text></Pressable>
  </View>;
}
function RecordingWaveform({ recording }: {
    recording: boolean;
}) {
    const barHeights = [12, 25, 18, 34, 22, 39, 17, 30, 14, 25, 18];
    const movement = useRef(barHeights.map(() => new Animated.Value(0.2))).current;
    useEffect(() => {
        if (!recording) {
            movement.forEach((bar) => bar.setValue(0.2));
            return;
        }
        const animation = Animated.loop(Animated.stagger(55, movement.map((bar, index) => Animated.sequence([Animated.timing(bar, { toValue: index % 2 ? 1 : 0.55, duration: 180, useNativeDriver: true }), Animated.timing(bar, { toValue: index % 2 ? 0.45 : 1, duration: 180, useNativeDriver: true })]))));
        animation.start();
        return () => animation.stop();
    }, [movement, recording]);
    return <View style={styles.waveform}>{barHeights.map((height, index) => <Animated.View key={index} style={[styles.waveBar, { height, transform: [{ scaleY: movement[index] }] }]}/>)}</View>;
}
function GuidedBreathing({ language, onNext }: {
    language: AppLanguage;
    onNext: () => void;
}) {
    const phases = language === 'en' ? ['Breathe in', 'Hold', 'Breathe out'] : language === "miq" ? toMiskituDraft(['Inhalá', 'Sostené', 'Soltá']) : ['Inhalá', 'Sostené', 'Soltá'];
    const [phase, setPhase] = useState(0);
    const [remaining, setRemaining] = useState(4);
    const [round, setRound] = useState(1);
    const [paused, setPaused] = useState(false);
    const [complete, setComplete] = useState(false);
    useEffect(() => {
        if (paused || complete)
            return;
        const timer = setTimeout(() => {
            if (remaining > 1) {
                setRemaining((value) => value - 1);
                return;
            }
            if (phase < 2) {
                const next = phase + 1;
                setPhase(next);
                setRemaining(breathingDurations[next]);
                return;
            }
            if (round < 3) {
                setRound((value) => value + 1);
                setPhase(0);
                setRemaining(4);
                return;
            }
            setComplete(true);
        }, 1000);
        return () => clearTimeout(timer);
    }, [complete, paused, phase, remaining, round]);
    const ringScale = phase === 0 ? 1 : phase === 1 ? .88 : .7;
    return <View style={styles.breathWrap}><Text style={styles.breathTitle}>{language === 'en' ? 'Breathe with Pío' : language === "miq" ? toMiskituDraft('Respirá con Pío') : 'Respirá con Pío'}</Text><Text style={styles.instruction}>{language === 'en' ? 'Follow the circle. There is no hurry.' : language === "miq" ? toMiskituDraft('Seguí el círculo. No hay apuro.') : 'Seguí el círculo. No hay apuro.'}</Text><View style={styles.breathStage}><View style={[styles.outerRing, { transform: [{ scale: ringScale }] }]}><View style={styles.middleRing}><View style={styles.innerRing}><PioMark pose="calm" size={112}/></View></View></View></View><Text style={styles.phaseText}>{complete ? (language === 'en' ? 'Done!' : language === "miq" ? toMiskituDraft('¡Listo!') : '¡Listo!') : `${phases[phase]}… ${remaining}`}</Text><View style={styles.phasePills}>{phases.map((label, index) => <View key={label} style={[styles.phasePill, phase === index && !complete && styles.phasePillActive]}><Text style={[styles.phasePillText, phase === index && !complete && styles.phasePillTextActive]}>{label} {breathingDurations[index]}</Text></View>)}</View><Text style={styles.roundText}>{language === 'en' ? 'Round' : language === "miq" ? toMiskituDraft('Ronda') : 'Ronda'} {round} {language === 'en' ? 'of' : language === "miq" ? toMiskituDraft('de') : 'de'} 3</Text>{complete ? <Button title={language === 'en' ? 'See my reward' : language === "miq" ? toMiskituDraft('Ver mi recompensa') : 'Ver mi recompensa'} onPress={onNext}/> : <Pressable onPress={() => setPaused((value) => !value)} style={styles.pauseButton}><Text style={styles.pauseText}>{paused ? (language === 'en' ? 'Continue' : language === "miq" ? toMiskituDraft('Continuar') : 'Continuar') : (language === 'en' ? 'Pause' : language === "miq" ? toMiskituDraft('Pausar') : 'Pausar')}</Text></Pressable>}</View>;
}
function GameReward({ language, emotion, gameTitle, isLastGame, onDone }: Props) {
    return <View style={styles.rewardWrap}><View style={styles.confetti}><Text style={styles.confettiText}>▼  ▼  ▼  ▼  ▼  ▼</Text></View><View style={styles.rewardHero}><PioMark pose="success" size={132}/><Text style={styles.rewardTitle}>{language === 'en' ? 'Great job!' : language === "miq" ? toMiskituDraft('¡Qué tuani!') : '¡Qué tuani!'}</Text><Text style={styles.rewardSubtitle}>{language === 'en' ? 'You completed this mini-game' : language === "miq" ? toMiskituDraft('Terminaste este mini-juego') : 'Terminaste este mini-juego'}</Text></View><View style={styles.rewardCards}><View style={[styles.rewardCard, { backgroundColor: `${emotionColor[emotion]}26` }]}><GardenFlower color={emotionColor[emotion]}/><Text style={styles.rewardCardText}>{language === 'en' ? 'You planted a flower' : language === "miq" ? toMiskituDraft('Sembraste una flor de alegría') : 'Sembraste una flor de alegría'}</Text></View><View style={[styles.rewardCard, styles.rewardCardBlue]}><EmotionDrop emotion={emotion} size={58}/><Text style={styles.rewardCardText}>{language === 'en' ? 'Your progress is saved' : language === "miq" ? toMiskituDraft('Tu avance quedó guardado') : 'Tu avance quedó guardado'}</Text></View></View><View style={styles.completedGame}><Text style={styles.completedLabel}>{language === 'en' ? 'COMPLETED' : language === "miq" ? toMiskituDraft('COMPLETADO') : 'COMPLETADO'}</Text><Text style={styles.completedTitle}>{gameTitle}</Text></View><Button title={isLastGame ? (language === 'en' ? 'Finish the week' : language === "miq" ? toMiskituDraft('Terminar la semana') : 'Terminar la semana') : (language === 'en' ? 'Continue to the next one' : language === "miq" ? toMiskituDraft('Seguir con el siguiente') : 'Seguir con el siguiente')} onPress={onDone}/>{!isLastGame ? <Pressable onPress={onDone}><Text style={styles.secondaryLink}>{language === 'en' ? 'I’ll play the next one later' : language === "miq" ? toMiskituDraft('Lo juego otro día') : 'Lo juego otro día'}</Text></Pressable> : null}</View>;
}
function GardenFlower({ color }: {
    color: string;
}) {
    return <View style={styles.flower}><View style={[styles.flowerPetal, styles.petalTop, { backgroundColor: color }]}/><View style={[styles.flowerPetal, styles.petalLeft, { backgroundColor: color }]}/><View style={[styles.flowerPetal, styles.petalRight, { backgroundColor: color }]}/><View style={[styles.flowerPetal, styles.petalBottom, { backgroundColor: color }]}/><View style={styles.flowerCenter}/><View style={styles.flowerStem}/><View style={styles.flowerLeaf}/></View>;
}
function reflectionPrompt(emotion: Emotion, language: AppLanguage) {
    const labels = language === 'en' ? { joy: 'joy', sadness: 'sadness', anger: 'anger', fear: 'fear', calm: 'calm', love: 'care' } : language === "miq" ? toMiskituDraft({ joy: 'alegría', sadness: 'tristeza', anger: 'enojo', fear: 'miedo', calm: 'calma', love: 'cariño' }) : { joy: 'alegría', sadness: 'tristeza', anger: 'enojo', fear: 'miedo', calm: 'calma', love: 'cariño' };
    return language === 'en' ? `When did you feel ${labels[emotion]} this week?` : language === "miq" ? toMiskituDraft(`¿Cuándo sentiste ${labels[emotion]} esta semana?`) : `¿Cuándo sentiste ${labels[emotion]} esta semana?`;
}
const styles = StyleSheet.create({
    reflectionWrap: { flex: 1, gap: 12 }, pioSpeech: { flexDirection: 'row', alignItems: 'center', gap: 8 }, speech: { flex: 1, minHeight: 62, padding: 11, borderRadius: 17, borderWidth: 1.5, borderColor: '#E6E0D9', backgroundColor: palette.white, justifyContent: 'center' }, speechText: { color: palette.ink, fontFamily: 'Nunito_800ExtraBold', fontSize: 13, lineHeight: 18 }, instruction: { color: '#646978', fontFamily: 'Nunito_700Bold', fontSize: 11.5, lineHeight: 16, textAlign: 'center' }, modeRow: { flexDirection: 'row', gap: 10 }, modeCard: { flex: 1, minHeight: 142, borderRadius: 20, borderWidth: 1.5, borderColor: '#E4DDD6', backgroundColor: palette.white, alignItems: 'center', justifyContent: 'center', gap: 6 }, modeCardActive: { borderWidth: 3, borderColor: palette.rose, backgroundColor: '#FFF5F8' }, modeIcon: { width: 58, height: 58, borderRadius: 29, alignItems: 'center', justifyContent: 'center' }, micIcon: { backgroundColor: palette.roseDeep }, pencilIcon: { backgroundColor: '#FFF0C8' }, modeGlyph: { color: palette.white, fontSize: 25 }, pencilGlyph: { color: palette.ink, fontSize: 31 }, modeTitle: { color: palette.ink, fontFamily: 'Nunito_800ExtraBold', fontSize: 13 }, modeMeta: { color: '#858079', fontFamily: 'Nunito_400Regular', fontSize: 9 }, voicePanel: { gap: 10, alignItems: 'center', padding: 14, borderRadius: 18, backgroundColor: '#FFF2F7' }, waveform: { height: 44, flexDirection: 'row', alignItems: 'center', gap: 4 }, waveBar: { width: 4, borderRadius: 3, backgroundColor: palette.roseDeep }, recordButton: { minHeight: 44, paddingHorizontal: 18, borderRadius: 22, backgroundColor: palette.roseDeep, alignItems: 'center', justifyContent: 'center' }, stopButton: { backgroundColor: '#B92357' }, recordButtonText: { color: palette.white, fontFamily: 'Nunito_800ExtraBold', fontSize: 11 }, error: { color: '#A63C36', fontFamily: 'Nunito_700Bold', fontSize: 10, textAlign: 'center' }, drawingPad: { height: 210, borderRadius: 18, borderWidth: 2, borderStyle: 'dashed', borderColor: '#D8CFC6', backgroundColor: palette.white, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' }, drawHint: { color: '#9B958D', fontFamily: 'Nunito_700Bold', fontSize: 12 }, clearText: { color: palette.roseDeep, fontFamily: 'Nunito_800ExtraBold', fontSize: 10, textAlign: 'right', paddingTop: 7 }, privacy: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, padding: 9, borderRadius: 14, backgroundColor: '#F2EFEA' }, privacyText: { flex: 1, color: '#77716C', fontFamily: 'Nunito_700Bold', fontSize: 9.5, lineHeight: 13 }, skipText: { color: '#8A847D', fontFamily: 'Nunito_700Bold', fontSize: 10, textAlign: 'center' },
    breathWrap: { flex: 1, gap: 12, alignItems: 'center' }, breathTitle: { color: palette.ink, fontFamily: 'Baloo2_700Bold', fontSize: 27 }, breathStage: { width: '100%', height: 340, borderRadius: 24, backgroundColor: '#DDF4FC', alignItems: 'center', justifyContent: 'center' }, outerRing: { width: 260, height: 260, borderRadius: 130, backgroundColor: '#BCEAF8', alignItems: 'center', justifyContent: 'center' }, middleRing: { width: 205, height: 205, borderRadius: 103, backgroundColor: '#93DDF4', alignItems: 'center', justifyContent: 'center' }, innerRing: { width: 155, height: 155, borderRadius: 78, backgroundColor: palette.white, alignItems: 'center', justifyContent: 'center' }, phaseText: { color: '#087CA8', fontFamily: 'Baloo2_700Bold', fontSize: 25 }, phasePills: { flexDirection: 'row', gap: 7 }, phasePill: { paddingHorizontal: 10, paddingVertical: 7, borderRadius: 16, backgroundColor: palette.white, borderWidth: 1.5, borderColor: '#DDD7D0' }, phasePillActive: { backgroundColor: palette.cyan, borderColor: palette.cyan }, phasePillText: { color: '#77716C', fontFamily: 'Nunito_800ExtraBold', fontSize: 9 }, phasePillTextActive: { color: palette.white }, roundText: { color: '#858079', fontFamily: 'Nunito_700Bold', fontSize: 10 }, pauseButton: { width: '100%', minHeight: 49, borderRadius: 25, borderWidth: 1.5, borderColor: '#DDD7D0', backgroundColor: palette.white, alignItems: 'center', justifyContent: 'center' }, pauseText: { color: palette.ink, fontFamily: 'Nunito_800ExtraBold', fontSize: 12 },
    rewardWrap: { flex: 1, gap: 14 }, confetti: { height: 25, overflow: 'hidden' }, confettiText: { color: palette.rose, letterSpacing: 17, textAlign: 'center' }, rewardHero: { alignItems: 'center', gap: 2 }, rewardTitle: { color: palette.roseDeep, fontFamily: 'Baloo2_700Bold', fontSize: 29 }, rewardSubtitle: { color: '#6C7080', fontFamily: 'Nunito_700Bold', fontSize: 12 }, rewardCards: { flexDirection: 'row', gap: 10 }, rewardCard: { flex: 1, minHeight: 170, borderRadius: 20, alignItems: 'center', justifyContent: 'center', gap: 9, padding: 11 }, rewardCardBlue: { backgroundColor: '#E4F6FC' }, rewardCardText: { color: palette.ink, fontFamily: 'Nunito_800ExtraBold', fontSize: 10.5, lineHeight: 14, textAlign: 'center' }, completedGame: { padding: 12, borderRadius: 16, backgroundColor: '#FFF5CE', alignItems: 'center', gap: 2 }, completedLabel: { color: '#977A12', fontFamily: 'Nunito_800ExtraBold', fontSize: 8, letterSpacing: 1 }, completedTitle: { color: palette.ink, fontFamily: 'Nunito_800ExtraBold', fontSize: 13 }, secondaryLink: { color: palette.ink, fontFamily: 'Nunito_800ExtraBold', fontSize: 10.5, textAlign: 'center', textDecorationLine: 'underline' }, flower: { width: 75, height: 100, position: 'relative', alignItems: 'center' }, flowerPetal: { position: 'absolute', width: 31, height: 31, borderRadius: 17, top: 13 }, petalTop: { top: 0, left: 22 }, petalLeft: { left: 8, top: 16 }, petalRight: { right: 8, top: 16 }, petalBottom: { top: 31, left: 22 }, flowerCenter: { position: 'absolute', top: 20, left: 28, width: 19, height: 19, borderRadius: 10, backgroundColor: palette.yellow }, flowerStem: { position: 'absolute', top: 46, width: 5, height: 50, borderRadius: 3, backgroundColor: palette.green }, flowerLeaf: { position: 'absolute', top: 65, left: 18, width: 20, height: 12, borderTopLeftRadius: 12, borderBottomRightRadius: 12, backgroundColor: palette.lime, transform: [{ rotate: '-28deg' }] },
});
