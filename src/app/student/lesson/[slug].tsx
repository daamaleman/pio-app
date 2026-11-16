import { toMiskituDraft } from '@/lib/miskitu-draft';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, PanResponder, Pressable, StyleSheet, View } from 'react-native';
import { Text, TextInput } from '@/components/localized-native';
import Svg, { Path as SvgPath } from 'react-native-svg';
import { BrandIcon, Button, Card, EmotionDot, PioMark, Screen, TopBar, palette } from '@/components/pio-ui';
import { MinigameClosure } from '@/components/minigame-closure';
import { EmotionDrop, PrimaryMinigame } from '@/components/primary-minigame';
import { SecondaryMinigame } from '@/components/secondary-minigame';
import { getLessonContent, type VersionedLessonContent } from '@/features/student/lesson-content';
import { useAppState } from '@/lib/app-state';
import { t } from '@/lib/i18n';
import type { AppLanguage, Emotion } from '@/lib/types';
const emotionValues: Emotion[] = ['joy', 'sadness', 'anger', 'fear', 'calm', 'love'];
const emotionPoses: Record<Emotion, 'hello' | 'sad' | 'angry' | 'fear' | 'calm' | 'love'> = { joy: 'hello', sadness: 'sad', anger: 'angry', fear: 'fear', calm: 'calm', love: 'love' };
export default function LessonScreen() {
    const { slug, position: requestedPosition } = useLocalSearchParams<{
        slug: string;
        position?: string;
    }>();
    const { lessons, language, completeStep, studentWeek } = useAppState();
    const lesson = lessons.find((item) => item.slug === slug);
    const requested = Number(requestedPosition);
    const initialPosition = Number.isFinite(requested) && requested > 0 ? requested : studentWeek?.current?.lesson_slug === slug ? studentWeek.current.current_position : 1;
    const [content, setContent] = useState<VersionedLessonContent>();
    const [position, setPosition] = useState(initialPosition || 1);
    const [pageIndex, setPageIndex] = useState(0);
    const [selected, setSelected] = useState('');
    const [checked, setChecked] = useState(false);
    const [gameRound, setGameRound] = useState(0);
    const [gameIntro, setGameIntro] = useState(true);
    const [learnIndex, setLearnIndex] = useState(0);
    const [cardFlipped, setCardFlipped] = useState(false);
    const [questionRound, setQuestionRound] = useState(0);
    const [showClosure, setShowClosure] = useState(false);
    const [loadedKey, setLoadedKey] = useState('');
    const loading = loadedKey !== `${slug}:${language}`;
    const [error, setError] = useState('');
    useEffect(() => {
        let active = true;
        getLessonContent(slug, language).then((result) => {
            if (active) {
                setContent(result);
                setPosition(initialPosition || 1);
                setError('');
            }
        }).catch(() => { if (active) {
            setContent(undefined);
            setError(t('contentNotReady', language));
        } })
            .finally(() => { if (active)
            setLoadedKey(`${slug}:${language}`); });
        return () => { active = false; };
    }, [slug, language, initialPosition]);
    const steps = content?.payload.steps ?? [];
    const step = steps.find((item) => item.position === position) ?? steps[0];
    const pages = step?.pages ?? [];
    const currentPage = pages[pageIndex];
    const part = content?.payload.parts.find((item) => item.part === step?.part);
    const questions = step?.questions?.slice(0, 3) ?? [];
    const question = questions[questionRound] ?? questions[0];
    const situations = step?.play?.situations ?? [];
    const situation = situations[gameRound % Math.max(situations.length, 1)];
    const stepIndex = Math.max(0, steps.findIndex((item) => item.position === step?.position));
    const introEmotionCount = step?.items?.filter((item) => item.emotion).length ?? step?.learn?.this_is?.emotions?.length ?? 0;
    const hasCatchIntro = step?.template === 'catch' && introEmotionCount > 0;
    const needsAnswer = step?.kind === 'quiz' || step?.kind === 'minigame' || step?.kind === 'poll';
    const expectedAnswer = question?.answer_id ?? situation?.answer ?? (step?.template === 'sequence' || step?.template === 'guided_breathing' ? 'complete' : undefined);
    const choiceCorrect = step?.no_wrong_answer === true
        ? Boolean(selected)
        : step?.template === 'catch'
            ? Boolean(selected && normalizeCatchEmotion(selected) === normalizeCatchEmotion(expectedAnswer))
            : Boolean(expectedAnswer && selected && selected === expectedAnswer);
    const currentPose = step?.kind === 'story' ? 'story' : step?.kind === 'calm' ? 'calm' : step?.kind === 'minigame' && emotionValues.includes(selected as Emotion) ? emotionPoses[selected as Emotion] : 'hello';
    const body = useMemo(() => firstText(step?.body, step?.instructions, step?.situation, step?.challenge, step?.prompt, step?.key_message, currentPage?.text, step?.pio?.text), [step, currentPage]);
    const isPrivate = step?.is_private === true || step?.kind === 'application' || step?.kind === 'plan';
    const lastStep = Boolean(step && steps.at(-1)?.position === step.position);
    const primaryCustom = Boolean(step && lesson?.level === 'primary' && (step.template || step.kind === 'concept' && step.items?.some((item) => item.emotion)));
    const secondaryTemplates = ['true_myth_trivia', 'before_after', 'anonymous_question', 'compare_images', 'digital_traffic', 'screen_rules', 'communication_styles', 'choice_adventure', 'healthy_friendship', 'healthy_week', 'support_network', 'pressure_intro', 'pressure_definition', 'pressure_reasons', 'communication_overview', 'assertive_formula', 'assertive_example', 'formula_quiz', 'pressure_practice', 'assertive_response', 'assertive_plan', 'family_conversation', 'pressure_summary'];
    const secondaryCustom = Boolean(step && secondaryTemplates.includes(step.template ?? ''));
    function moveForward() {
        if (!showClosure && primaryCustom && step && (step.kind === 'minigame' || step.kind === 'calm')) {
            setShowClosure(true);
            return;
        }
        advanceStep();
    }
    function advanceStep() {
        if (!step || !content || !slug)
            return;
        if (step.kind === 'story' && pageIndex < pages.length - 1) {
            setPageIndex((value) => value + 1);
            return;
        }
        const next = steps.find((item) => item.position > step.position);
        completeStep(slug, step.position, content.version, next?.position ?? step.position, 'completed', lastStep);
        if (lastStep || !next) {
            router.replace('/student/week-complete');
            return;
        }
        setPosition(next.position);
        setPageIndex(0);
        setSelected('');
        setChecked(false);
        setCardFlipped(false);
        setGameRound(0);
        setGameIntro(true);
        setLearnIndex(0);
        setQuestionRound(0);
        setShowClosure(false);
    }
    function skipStep() {
        if (!step || !content || !slug || step.is_skippable !== true)
            return;
        const next = steps.find((item) => item.position > step.position);
        completeStep(slug, step.position, content.version, next?.position ?? step.position, 'skipped', lastStep);
        if (lastStep || !next)
            router.replace('/student/week-complete');
        else {
            setPosition(next.position);
            setPageIndex(0);
            setSelected('');
            setChecked(false);
            setGameRound(0);
            setGameIntro(true);
            setLearnIndex(0);
            setQuestionRound(0);
        }
    }
    function primaryAction() {
        if (!step)
            return;
        if (step.template === 'calm_week_intro') {
            if (selected === 'story')
                moveForward();
            return;
        }
        if (step.template === 'traffic_example') {
            if (selected === 'complete')
                moveForward();
            else
                setSelected('complete');
            return;
        }
        if (['traffic_reward_card', 'traffic_home_challenge'].includes(step.template ?? '')) {
            moveForward();
            return;
        }
        if (step.template === 'traffic_plan') {
            if (selected)
                moveForward();
            return;
        }
        if (step.template === 'garden_breathing') {
            if (selected === 'complete')
                moveForward();
            return;
        }
        if (hasCatchIntro && gameIntro) {
            if (learnIndex + 1 < introEmotionCount)
                setLearnIndex((value) => value + 1);
            else {
                setGameIntro(false);
                setLearnIndex(0);
            }
            return;
        }
        if (step.kind === 'concept') {
            if (learnIndex + 1 < introEmotionCount)
                setLearnIndex((value) => value + 1);
            else
                moveForward();
            return;
        }
        if (step.template === 'sequence') {
            const rounds = Math.max(Math.min(step.play?.rounds ?? situations.length, situations.length), 1);
            if (gameRound + 1 < rounds) {
                setGameRound((value) => value + 1);
                setSelected('');
            }
            else
                moveForward();
            return;
        }
        if (step.template === 'drag_to_zones') {
            const rounds = Math.max(step.prompts?.length ?? 3, 1);
            if (gameRound + 1 < rounds) {
                setGameRound((value) => value + 1);
                setSelected('');
            }
            else
                moveForward();
            return;
        }
        if (step.template === 'guided_breathing') {
            moveForward();
            return;
        }
        if (['empathy_story', 'cooperation_chest', 'shield_builder', 'trusted_circle', 'month_self_assessment'].includes(step.template ?? '')) {
            if (selected === 'complete')
                moveForward();
            return;
        }
        if (!checked) {
            setChecked(true);
            return;
        }
        if (!choiceCorrect) {
            setChecked(false);
            setSelected('');
            return;
        }
        const maxRounds = Math.min(step.play?.rounds ?? situations.length, situations.length);
        if ((step.template === 'catch' || step.template === 'classify' || step.template === 'kindness_cards') && gameRound + 1 < maxRounds) {
            setGameRound((value) => value + 1);
            setSelected('');
            setChecked(false);
            return;
        }
        moveForward();
    }
    function primaryButtonTitle() {
        if (!step)
            return t('continueLesson', language);
        if (step.template === 'calm_week_intro')
            return selected === 'story' ? (language === 'en' ? 'I understand' : language === "miq" ? toMiskituDraft('Entendido') : 'Entendido') : (language === 'en' ? 'Open the story above' : language === "miq" ? toMiskituDraft('Abrí el cuento arriba') : 'Abrí el cuento arriba');
        if (step.template === 'traffic_example')
            return selected === 'complete' ? (language === 'en' ? 'Practice now' : language === "miq" ? toMiskituDraft('Practicar ahora') : 'Practicar ahora') : (language === 'en' ? 'Part 1 complete' : language === "miq" ? toMiskituDraft('Terminar la parte 1') : 'Terminar la parte 1');
        if (step.template === 'traffic_plan')
            return language === 'en' ? 'Save my plan' : language === "miq" ? toMiskituDraft('Guardar mi plan') : 'Guardar mi plan';
        if (step.template === 'traffic_reward_card')
            return language === 'en' ? 'Save and continue' : language === "miq" ? toMiskituDraft('Guardar y seguir') : 'Guardar y seguir';
        if (step.template === 'traffic_home_challenge')
            return language === 'en' ? 'I accept the challenge!' : language === "miq" ? toMiskituDraft('¡Acepto el reto!') : '¡Acepto el reto!';
        if (step.template === 'garden_breathing')
            return language === 'en' ? 'Finish the week' : language === "miq" ? toMiskituDraft('Terminar la semana') : 'Terminar la semana';
        if ((hasCatchIntro && gameIntro) || step.kind === 'concept')
            return learnIndex + 1 < introEmotionCount ? t('nextDrop', language) : (language === 'en' ? 'Let’s play!' : language === "miq" ? toMiskituDraft('¡A jugar!') : '¡A jugar!');
        if (step.template === 'sequence') {
            const rounds = Math.max(Math.min(step.play?.rounds ?? situations.length, situations.length), 1);
            return gameRound + 1 < rounds ? (language === 'en' ? 'Next situation' : language === "miq" ? toMiskituDraft('Siguiente situación') : 'Siguiente situación') : t('continueLesson', language);
        }
        if (step.template === 'drag_to_zones')
            return gameRound + 1 < Math.max(step.prompts?.length ?? 3, 1) ? (language === 'en' ? 'Next feeling' : language === "miq" ? toMiskituDraft('Siguiente emoción') : 'Siguiente emoción') : t('continueLesson', language);
        if (step.template === 'guided_breathing')
            return t('continueLesson', language);
        if (['empathy_story', 'cooperation_chest', 'shield_builder', 'trusted_circle', 'month_self_assessment'].includes(step.template ?? ''))
            return lastStep ? (language === 'en' ? 'Finish the month' : language === "miq" ? toMiskituDraft('Terminar el mes') : 'Terminar el mes') : t('continueLesson', language);
        if (!checked)
            return t('checkAnswer', language);
        if (!choiceCorrect)
            return t('tryAgainButton', language);
        const maxRounds = Math.min(step.play?.rounds ?? situations.length, situations.length);
        return gameRound + 1 < maxRounds ? (step.template === 'kindness_cards' ? (language === 'en' ? 'Next scene' : language === "miq" ? toMiskituDraft('Siguiente escena') : 'Siguiente escena') : t('nextDrop', language)) : t('continueLesson', language);
    }
    const completionTemplates = ['empathy_story', 'cooperation_chest', 'shield_builder', 'trusted_circle', 'month_self_assessment', 'garden_breathing'];
    const passiveTemplates = ['traffic_example', 'traffic_reward_card', 'traffic_home_challenge'];
    const primaryReady = step?.template === 'calm_week_intro' ? selected === 'story' : passiveTemplates.includes(step?.template ?? '') ? true : step?.template === 'traffic_plan' ? Boolean(selected) : hasCatchIntro && gameIntro ? true : step?.template === 'sequence' || step?.template === 'guided_breathing' || completionTemplates.includes(step?.template ?? '') ? selected === 'complete' : step?.template === 'drag_to_zones' ? Boolean(selected) : step?.kind === 'concept' ? true : checked || Boolean(selected);
    function genericAction() {
        if (needsAnswer && checked) {
            if (!choiceCorrect) {
                setChecked(false);
                setSelected('');
                return;
            }
            if (step?.kind === 'quiz' && questionRound + 1 < questions.length) {
                setQuestionRound((value) => value + 1);
                setSelected('');
                setChecked(false);
                return;
            }
        }
        moveForward();
    }
    function genericButtonTitle() {
        if (needsAnswer && checked && !choiceCorrect)
            return t('tryAgainButton', language);
        if (step?.kind === 'quiz' && checked && questionRound + 1 < questions.length)
            return language === 'en' ? 'Next question' : language === "miq" ? toMiskituDraft('Siguiente pregunta') : 'Siguiente pregunta';
        if (step?.kind === 'story' && pageIndex < pages.length - 1)
            return t('nextPage', language);
        return lastStep ? t('finishLesson', language) : t('continueLesson', language);
    }
    return <Screen color="#FFFCF7">{(primaryCustom || secondaryCustom) && step ? <LessonGameHeader title={step.title ?? content?.payload.title ?? 'Mini-juego'} part={part?.title} position={stepIndex + 1} total={steps.length} onClose={() => router.back()} secondary={secondaryCustom}/> : <TopBar title={content?.payload.title ?? lesson?.title[language] ?? 'Lección'} onBack={() => router.back()}/>}
    {loading ? <View style={local.loading}><ActivityIndicator color={palette.roseDeep}/><Text style={local.meta}>{t('loadingLesson', language)}</Text></View> : null}
    {error ? <Card tone="yellow"><PioMark small/><Text style={local.body}>{error}</Text><Button title={t('back', language)} variant="ghost" onPress={() => router.back()}/></Card> : null}
    {step && !loading && !error && showClosure ? <MinigameClosure language={language} emotion={lesson?.emotion ?? 'joy'} gameTitle={step.title ?? content?.payload.title ?? 'Mini-juego'} isLastGame={lastStep} onDone={() => { setShowClosure(false); advanceStep(); }}/> : null}
    {step && !loading && !error && primaryCustom && !showClosure ? <><PrimaryMinigame step={step} language={language} selected={selected} checked={checked} correct={choiceCorrect} round={gameRound} intro={gameIntro} learnIndex={learnIndex} situation={situation} body={body} onSelect={(value) => { setSelected(value); setChecked(false); }}/><Button title={primaryButtonTitle()} disabled={!primaryReady} onPress={primaryAction}/></> : null}
    {step && !loading && !error && secondaryCustom && !showClosure ? <SecondaryMinigame step={step} language={language} onDone={advanceStep}/> : null}
    {step && !loading && !error && !primaryCustom && !secondaryCustom && !showClosure ? <><View style={local.progressRow}><Text style={local.part}>{part?.title ?? `Parte ${step.part ?? 1}`}</Text><Text style={local.counter}>{step.position} / {steps.length}</Text></View><View style={local.track}><View style={[local.progress, { width: `${step.position / Math.max(steps.length, 1) * 100}%` }]}/></View>
      <Card tone={step.kind === 'minigame' ? 'yellow' : 'white'}>{!needsAnswer || !checked ? <PioMark small pose={currentPose}/> : null}{step.title ? <Text style={local.title}>{step.title}</Text> : null}{body ? <Text style={local.body}>{body}</Text> : null}
        {pages.length > 1 ? <Text style={local.meta}>{t('page', language)} {pageIndex + 1} / {pages.length}</Text> : null}
        {step.kind === 'concept' && step.items?.length ? <View style={local.items}>{step.items.map((item, index) => <View key={`${item.name ?? item.emotion}-${index}`} style={local.item}><Text style={local.itemTitle}>{item.name ?? item.emotion}</Text><Text style={local.meta}>{item.text ?? item.example ?? item.body_hint}</Text></View>)}</View> : null}
        {step.kind === 'worked_example' && Array.isArray(step.steps) ? <View style={local.items}>{(step.steps as {
            label?: string;
            text?: string;
        }[]).map((item, index) => <View key={index} style={local.item}><Text style={local.itemTitle}>{item.label}</Text><Text style={local.meta}>{item.text}</Text></View>)}</View> : null}
        {step.kind === 'quiz' && question ? <View style={local.quizWrap}><Text style={local.quizCounter}>{language === 'en' ? 'Question' : language === "miq" ? toMiskituDraft('Pregunta') : 'Pregunta'} {questionRound + 1} {t('of', language)} {questions.length}</Text>{answerEmotion(question) ? <View style={local.quizDrop}><EmotionDrop emotion={answerEmotion(question)!} size={92}/></View> : <PioMark pose="story" size={82} style={local.quizPio}/>}<Text style={local.quizPrompt}>{question.prompt}</Text><View style={local.options}>{question.options.map((option) => { const emotion = optionEmotion(option.id, option.text); return <Pressable accessibilityRole="radio" accessibilityState={{ selected: selected === option.id }} key={option.id} onPress={() => { setSelected(option.id); setChecked(false); }} style={[local.option, emotion && local.emotionOption, selected === option.id && local.optionSelected]}>{emotion ? <EmotionDrop emotion={emotion} size={48}/> : null}<Text style={[local.optionText, emotion && local.emotionOptionText]}>{option.text}</Text></Pressable>; })}</View></View> : null}
        {step.kind === 'minigame' && situation ? <View style={local.drops}><Text style={local.prompt}>{situation.text}</Text>{emotionValues.map((emotion) => <EmotionDot key={emotion} emotion={emotion} language={language} label selected={selected === emotion} onPress={() => { setSelected(emotion); setChecked(false); }}/>)}</View> : null}
        {step.kind === 'poll' && step.items?.length ? <View style={local.options}>{step.items.map((item, index) => { const option = item.text ?? item.name ?? ''; return <Pressable key={index} onPress={() => { setSelected(option); setChecked(false); }} style={[local.option, selected === option && local.optionSelected]}><Text style={local.optionText}>{option}</Text></Pressable>; })}</View> : null}
        {step.kind === 'card' && step.front ? <Pressable accessibilityRole="button" onPress={() => setCardFlipped((value) => !value)} style={local.cardFace}><Text style={local.itemTitle}>{cardFlipped ? step.back?.text : step.front.title}</Text><Text style={local.body}>{cardFlipped ? step.back?.text : step.front.text}</Text><Text style={local.meta}>{t('cardTap', language)}</Text></Pressable> : null}
        {step.kind === 'calm' && step.breathing ? <View style={local.breath}><Text style={local.itemTitle}>{step.breathing.rounds ?? 3} rondas</Text><Text style={local.meta}>{step.breathing.inhale_s ?? 4} · {step.breathing.hold_s ?? 2} · {step.breathing.exhale_s ?? 4} segundos</Text></View> : null}
        {step.kind === 'application' ? <PrivateExpression language={language}/> : null}
        {isPrivate ? <Text style={local.private}>{step.privacy_note ?? 'Privado · Esto no se comparte con nadie.'}</Text> : null}
        {needsAnswer && checked ? <View style={local.feedbackRow}><PioMark small pose={choiceCorrect ? 'success' : 'sad'}/><Text style={[local.feedback, choiceCorrect && local.correct]}>{choiceCorrect ? t('correctAnswer', language) : question?.explanation ?? t('tryAgain', language)}</Text></View> : null}
      </Card>
      {needsAnswer && !checked ? <Button title={t('checkAnswer', language)} disabled={!selected} onPress={() => setChecked(true)}/> : <Button title={genericButtonTitle()} onPress={genericAction}/>}
      {step.is_skippable === true ? <Button title={t('skipStep', language)} variant="ghost" onPress={skipStep}/> : null}
    </> : null}
  </Screen>;
}
function PrivateExpression({ language }: {
    language: AppLanguage;
}) {
    const [mode, setMode] = useState<'write' | 'draw'>('draw');
    const [note, setNote] = useState('');
    const [strokes, setStrokes] = useState<string[]>([]);
    const [draft, setDraft] = useState('');
    const activeStroke = useRef('');
    const [responder] = useState(() => {
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
    return <View style={local.expression}><Text style={local.expressionTitle}>{language === 'en' ? 'Choose how you want to tell it' : language === "miq" ? toMiskituDraft('Elegí cómo querés contarlo') : 'Elegí cómo querés contarlo'}</Text><View style={local.modeRow}><Pressable onPress={() => setMode('draw')} style={[local.mode, mode === 'draw' && local.modeActive]}><Text style={[local.modeText, mode === 'draw' && local.modeTextActive]}>✏️ {language === 'en' ? 'Draw' : language === "miq" ? toMiskituDraft('Dibujar') : 'Dibujar'}</Text></Pressable><Pressable onPress={() => setMode('write')} style={[local.mode, mode === 'write' && local.modeActive]}><Text style={[local.modeText, mode === 'write' && local.modeTextActive]}>Aa {language === 'en' ? 'Write' : language === "miq" ? toMiskituDraft('Escribir') : 'Escribir'}</Text></Pressable></View>{mode === 'write' ? <TextInput multiline value={note} onChangeText={setNote} placeholder={language === 'en' ? 'Write what happened and how you felt…' : language === "miq" ? toMiskituDraft('Escribí qué pasó y cómo te sentiste…') : 'Escribí qué pasó y cómo te sentiste…'} placeholderTextColor="#98938C" style={local.noteInput}/> : <View><View style={local.drawingPad} {...responder.panHandlers}><Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>{strokes.map((path, index) => <SvgPath key={index} d={path} fill="none" stroke={palette.ink} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round"/>)}{draft ? <SvgPath d={draft} fill="none" stroke={palette.ink} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round"/> : null}</Svg>{!strokes.length && !draft ? <Text pointerEvents="none" style={local.drawHint}>{language === 'en' ? 'Draw here with your finger' : language === "miq" ? toMiskituDraft('Dibujá aquí con tu dedo') : 'Dibujá aquí con tu dedo'}</Text> : null}</View><Pressable onPress={() => setStrokes([])} style={local.clearDrawing}><Text style={local.clearDrawingText}>{language === 'en' ? 'Clear drawing' : language === "miq" ? toMiskituDraft('Borrar dibujo') : 'Borrar dibujo'}</Text></Pressable></View>}</View>;
}
function LessonGameHeader({ title, part, position, total, onClose, secondary = false }: {
    title: string;
    part?: string;
    position: number;
    total: number;
    onClose: () => void;
    secondary?: boolean;
}) {
    const segment = Math.min(3, Math.max(1, Math.ceil(position / Math.max(total / 3, 1))));
    const bars = secondary ? Array.from({ length: Math.min(total, 13) }, (_, index) => index + 1) : [1, 2, 3, 4];
    return <View style={local.gameHeader}><Pressable accessibilityRole="button" onPress={onClose} style={local.close}><Text style={local.closeText}>×</Text></Pressable><View style={local.gameHeadCenter}><View style={local.segments}>{bars.map((item) => <View key={item} style={[local.segment, item <= (secondary ? position : segment) && (secondary ? local.segmentSecondary : local.segmentActive)]}/>)}</View><Text numberOfLines={1} style={local.gameLabel}>{secondary ? `${position}/${total}` : part ?? title}</Text></View><View style={local.audio}><BrandIcon name="speaker" color={palette.ink} size={17}/></View></View>;
}
function firstText(...values: unknown[]) {
    return values.find((value): value is string => typeof value === 'string' && value.trim().length > 0);
}
function normalizeCatchEmotion(value?: string): Emotion | undefined {
    const key = value?.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();
    if (!key)
        return undefined;
    if (['joy', 'alegria', 'feliz', 'lilia laka'].includes(key))
        return 'joy';
    if (['sadness', 'sad', 'tristeza', 'triste', 'sari laka'].includes(key))
        return 'sadness';
    if (['anger', 'enojo', 'ira', 'rabia', 'lawanka', 'kupia baiwanka'].includes(key))
        return 'anger';
    if (['fear', 'miedo', 'temor', 'sibrin laka'].includes(key))
        return 'fear';
    return emotionValues.includes(key as Emotion) ? key as Emotion : undefined;
}
function optionEmotion(id: string, text: string): Emotion | undefined {
    const normalized = normalizeCatchEmotion(id) ?? normalizeCatchEmotion(text);
    if (normalized)
        return normalized;
    if (emotionValues.includes(id as Emotion))
        return id as Emotion;
    const value = text.toLowerCase();
    if (value.includes('alegr') || value.includes('joy'))
        return 'joy';
    if (value.includes('triste') || value.includes('sad'))
        return 'sadness';
    if (value.includes('enojo') || value.includes('anger'))
        return 'anger';
    if (value.includes('miedo') || value.includes('fear'))
        return 'fear';
    return undefined;
}
function answerEmotion(question: {
    answer_id?: string;
    options: {
        id: string;
        text: string;
    }[];
}): Emotion | undefined {
    const answer = question.options.find((option) => option.id === question.answer_id);
    return answer ? optionEmotion(answer.id, answer.text) : undefined;
}
const local = StyleSheet.create({ gameHeader: { minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 9 }, close: { width: 34, height: 34, borderRadius: 17, borderWidth: 1, borderColor: '#E3DDD6', alignItems: 'center', justifyContent: 'center' }, closeText: { color: palette.ink, fontSize: 23, lineHeight: 25 }, gameHeadCenter: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 }, segments: { flex: 1, flexDirection: 'row', gap: 4 }, segment: { flex: 1, height: 5, borderRadius: 3, backgroundColor: '#E8E2DA' }, segmentActive: { backgroundColor: palette.roseDeep }, segmentSecondary: { backgroundColor: palette.ink }, gameLabel: { maxWidth: 82, color: '#77716C', fontFamily: 'Nunito_700Bold', fontSize: 8 }, audio: { width: 34, height: 34, borderRadius: 17, borderWidth: 1, borderColor: '#E3DDD6', alignItems: 'center', justifyContent: 'center' }, loading: { alignItems: 'center', gap: 10, paddingVertical: 28 }, meta: { color: palette.muted, fontFamily: 'Nunito_400Regular', lineHeight: 20 }, progressRow: { flexDirection: 'row', justifyContent: 'space-between' }, part: { color: palette.roseDeep, fontFamily: 'Nunito_800ExtraBold', fontSize: 12 }, counter: { color: palette.muted, fontFamily: 'Nunito_700Bold', fontSize: 12 }, track: { height: 8, borderRadius: 4, overflow: 'hidden', backgroundColor: palette.line }, progress: { height: '100%', backgroundColor: palette.roseDeep }, title: { color: palette.ink, fontFamily: 'Baloo2_700Bold', fontSize: 25 }, body: { color: palette.ink, fontFamily: 'Nunito_400Regular', lineHeight: 24, fontSize: 16 }, items: { gap: 8 }, item: { borderRadius: 15, padding: 12, backgroundColor: palette.sand }, itemTitle: { color: palette.ink, fontFamily: 'Baloo2_700Bold', fontSize: 17 }, quizWrap: { gap: 10 }, quizCounter: { alignSelf: 'center', color: palette.roseDeep, fontFamily: 'Nunito_800ExtraBold', fontSize: 11, letterSpacing: .5 }, quizDrop: { alignSelf: 'center', width: 112, height: 112, borderRadius: 56, backgroundColor: '#FFF6D6', alignItems: 'center', justifyContent: 'center' }, quizPio: { alignSelf: 'center' }, quizPrompt: { color: palette.ink, fontFamily: 'Nunito_800ExtraBold', fontSize: 17, lineHeight: 22, textAlign: 'center' }, options: { gap: 8 }, option: { paddingVertical: 12, paddingHorizontal: 13, borderRadius: 15, backgroundColor: palette.sand, borderWidth: 1.5, borderColor: palette.line }, emotionOption: { minHeight: 66, flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: palette.white }, optionSelected: { backgroundColor: palette.roseSoft, borderColor: palette.roseDeep }, optionText: { color: palette.ink, fontFamily: 'Nunito_700Bold', lineHeight: 21 }, emotionOptionText: { fontFamily: 'Nunito_800ExtraBold', fontSize: 15 }, drops: { gap: 9, alignItems: 'center' }, prompt: { color: palette.ink, fontFamily: 'Nunito_800ExtraBold', textAlign: 'center' }, cardFace: { borderRadius: 16, padding: 15, backgroundColor: palette.roseSoft, alignItems: 'center', gap: 6 }, breath: { borderRadius: 16, padding: 14, backgroundColor: '#EAF4DF' }, private: { color: palette.muted, fontFamily: 'Nunito_700Bold', fontSize: 12 }, feedbackRow: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 10, borderRadius: 15, backgroundColor: '#FFF5CE' }, feedback: { flex: 1, color: '#7C392D', fontFamily: 'Nunito_800ExtraBold' }, correct: { color: palette.green }, expression: { gap: 10, paddingTop: 5 }, expressionTitle: { color: palette.ink, fontFamily: 'Nunito_800ExtraBold', textAlign: 'center', fontSize: 13 }, modeRow: { flexDirection: 'row', gap: 8 }, mode: { flex: 1, minHeight: 42, borderRadius: 21, borderWidth: 1.5, borderColor: palette.line, alignItems: 'center', justifyContent: 'center', backgroundColor: palette.white }, modeActive: { borderColor: palette.roseDeep, backgroundColor: palette.roseSoft }, modeText: { color: palette.muted, fontFamily: 'Nunito_800ExtraBold', fontSize: 12 }, modeTextActive: { color: palette.roseDeep }, noteInput: { minHeight: 170, borderRadius: 18, borderWidth: 2, borderColor: '#E5DED6', backgroundColor: '#FFFDF9', padding: 14, color: palette.ink, fontFamily: 'Nunito_700Bold', fontSize: 15, textAlignVertical: 'top' }, drawingPad: { height: 220, borderRadius: 18, borderWidth: 2, borderStyle: 'dashed', borderColor: '#D9CFC5', backgroundColor: '#FFFDF9', overflow: 'hidden', alignItems: 'center', justifyContent: 'center' }, drawHint: { color: '#AAA39C', fontFamily: 'Nunito_700Bold', fontSize: 13 }, clearDrawing: { alignSelf: 'flex-end', paddingVertical: 7, paddingHorizontal: 10 }, clearDrawingText: { color: palette.roseDeep, fontFamily: 'Nunito_800ExtraBold', fontSize: 11 } });
