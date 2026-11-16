import { toMiskituDraft } from '@/lib/miskitu-draft';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text, TextInput } from '@/components/localized-native';
import type { LessonContentStep } from '@/features/student/lesson-content';
import type { AppLanguage } from '@/lib/types';
import { BrandIcon, Button, PioMark, palette } from './pio-ui';
type CardItem = {
    id: string;
    category: string;
    text: string;
    answer: 'myth' | 'fact';
    explanation: string;
};
type PhotoPair = {
    id: string;
    answer: 'a' | 'b';
    prompt: string;
    clue: string;
    tags: string[];
};
type DigitalScenario = {
    id: string;
    text: string;
    answer: 'green' | 'yellow' | 'red';
    feedback: string;
};
type CommunicationScene = {
    id: string;
    message: string;
    options: {
        id: string;
        text: string;
        style: string;
    }[];
    answer: string;
};
type AdventureScene = {
    id: string;
    scene: string;
    choices: {
        id: string;
        text: string;
        responsible: boolean;
        consequence: string;
    }[];
};
type FriendshipCard = {
    id: string;
    text: string;
    answer: 'respect' | 'support' | 'pressure' | 'chantage';
    explanation: string;
};
type SupportPerson = {
    id: string;
    initials: string;
    name: string;
};
type TriviaQuestion = {
    id: string;
    prompt: string;
    options: {
        id: string;
        text: string;
    }[];
    answer_id: string;
    explanation: string;
};
export function SecondaryMinigame({ step, language, onDone }: {
    step: LessonContentStep;
    language: AppLanguage;
    onDone: () => void;
}) {
    if (['pressure_intro', 'pressure_definition', 'pressure_reasons', 'communication_overview', 'assertive_formula', 'assertive_example', 'formula_quiz', 'pressure_practice', 'assertive_response', 'assertive_plan', 'family_conversation', 'pressure_summary'].includes(step.template ?? ''))
        return <PressureModule key={step.position} step={step} language={language} onDone={onDone}/>;
    if (step.template === 'true_myth_trivia')
        return <Myths step={step} language={language} onDone={onDone}/>;
    if (step.template === 'before_after')
        return <BeforeAfter step={step} language={language} onDone={onDone}/>;
    if (step.template === 'anonymous_question')
        return <AnonymousQuestion step={step} language={language} onDone={onDone}/>;
    if (step.template === 'compare_images')
        return <EditedPhotos step={step} language={language} onDone={onDone}/>;
    if (step.template === 'digital_traffic')
        return <DigitalTraffic step={step} language={language} onDone={onDone}/>;
    if (step.template === 'screen_rules')
        return <ScreenRules step={step} language={language} onDone={onDone}/>;
    if (step.template === 'communication_styles')
        return <CommunicationStyles step={step} language={language} onDone={onDone}/>;
    if (step.template === 'choice_adventure')
        return <ChoiceAdventure step={step} language={language} onDone={onDone}/>;
    if (step.template === 'healthy_friendship')
        return <HealthyFriendship step={step} language={language} onDone={onDone}/>;
    if (step.template === 'healthy_week')
        return <HealthyWeek step={step} language={language} onDone={onDone}/>;
    if (step.template === 'support_network')
        return <SupportNetwork step={step} language={language} onDone={onDone}/>;
    return null;
}
type InfoItem = {
    id?: string;
    title: string;
    text?: string;
    body?: string;
    example?: string;
};
function PressureModule({ step, language, onDone }: GameProps) {
    const en = language === 'en';
    const [phase, setPhase] = useState(0);
    const [selected, setSelected] = useState('');
    const [checked, setChecked] = useState(false);
    const [round, setRound] = useState(0);
    const [draft, setDraft] = useState('');
    const [place, setPlace] = useState('');
    const [support, setSupport] = useState('');
    const title = step.title ?? '';
    const continueTitle = en ? 'Continue' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Seguir') : 'Seguir') : (language as AppLanguage) === "miq" ? toMiskituDraft('Seguir') : 'Seguir';
    if (step.template === 'pressure_intro') {
        const goals = (step.goals as string[] | undefined) ?? [];
        const options = (step.pollOptions as string[] | undefined) ?? [];
        if (phase === 0)
            return <View style={styles.stack}><View style={styles.pressureHero}><Text style={styles.pressureHeroKicker}>SEMANA 3 · DIGO NO Y DECIDO</Text><Text style={styles.pressureHeroTitle}>{en ? 'Peer pressure and assertive communication' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Presión de grupo y comunicación asertiva') : 'Presión de grupo y comunicación asertiva') : (language as AppLanguage) === "miq" ? toMiskituDraft('Presión de grupo y comunicación asertiva') : 'Presión de grupo y comunicación asertiva'}</Text><Text style={styles.pressureHeroBody}>{en ? 'What your friends think matters. What you decide matters too.' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Lo que tus amigos piensan importa. Lo que vos decidís, también.') : 'Lo que tus amigos piensan importa. Lo que vos decidís, también.') : (language as AppLanguage) === "miq" ? toMiskituDraft('Lo que tus amigos piensan importa. Lo que vos decidís, también.') : 'Lo que tus amigos piensan importa. Lo que vos decidís, también.'}</Text><View style={styles.heroMountains}><View style={styles.heroMountainA}/><View style={styles.heroMountainB}/></View></View><Text style={styles.smallCaps}>{en ? 'YOU WILL LEARN TO' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('VAS A APRENDER A') : 'VAS A APRENDER A') : (language as AppLanguage) === "miq" ? toMiskituDraft('VAS A APRENDER A') : 'VAS A APRENDER A'}</Text><View style={styles.goalList}>{goals.map((goal) => <View key={goal} style={styles.goalRow}><View style={styles.cyanDot}/><Text style={styles.goalText}>{goal}</Text></View>)}</View><View style={styles.chapterStrip}>{['01', '02', '03', '04'].map((chapter, index) => <View key={chapter} style={[styles.chapterTile, index === 0 && styles.chapterTileActive]}><Text style={[styles.chapterNumber, index === 0 && styles.chapterTextActive]}>{chapter}</Text><Text style={[styles.chapterName, index === 0 && styles.chapterTextActive]}>{[en ? 'Understand' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Entender') : 'Entender') : (language as AppLanguage) === "miq" ? toMiskituDraft('Entender') : 'Entender', en ? 'Examples' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Ejemplos') : 'Ejemplos') : (language as AppLanguage) === "miq" ? toMiskituDraft('Ejemplos') : 'Ejemplos', en ? 'Practice' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Practicar') : 'Practicar') : (language as AppLanguage) === "miq" ? toMiskituDraft('Practicar') : 'Practicar', en ? 'Apply' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Aplicar') : 'Aplicar') : (language as AppLanguage) === "miq" ? toMiskituDraft('Aplicar') : 'Aplicar'][index]}</Text></View>)}</View><Button variant="secondary" title={en ? 'Start' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Empezar') : 'Empezar') : (language as AppLanguage) === "miq" ? toMiskituDraft('Empezar') : 'Empezar'} onPress={() => setPhase(1)}/></View>;
        return <View style={styles.stack}><Text style={styles.pressureKicker}>01 · {en ? 'UNDERSTAND' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('ENTENDER') : 'ENTENDER') : (language as AppLanguage) === "miq" ? toMiskituDraft('ENTENDER') : 'ENTENDER'}</Text><Text style={styles.screenTitle}>{title}</Text><View style={styles.pollRow}>{options.map((option) => <Pressable key={option} onPress={() => setSelected(option)} style={[styles.pollChoice, selected === option && styles.pollChoiceActive]}><Text style={[styles.pollChoiceText, selected === option && styles.pollChoiceTextActive]}>{option}</Text></Pressable>)}</View>{selected ? <View style={styles.pollResults}><View style={styles.resultHead}><Text style={styles.copyStrong}>{en ? 'What your group answered' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Lo que respondió tu grupo') : 'Lo que respondió tu grupo') : (language as AppLanguage) === "miq" ? toMiskituDraft('Lo que respondió tu grupo') : 'Lo que respondió tu grupo'}</Text><Text style={styles.meta}>{en ? 'anonymous' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('anónimo') : 'anónimo') : (language as AppLanguage) === "miq" ? toMiskituDraft('anónimo') : 'anónimo'}</Text></View>{[[options[0], 58], [options[1], 31], [options[2], 11]].map(([label, value], index) => <View key={String(label)} style={styles.resultItem}><View style={styles.resultLabel}><Text style={styles.copyStrong}>{label}</Text><Text style={styles.meta}>{value}%</Text></View><View style={styles.resultTrack}><View style={[styles.resultFill, { width: `${value}%`, backgroundColor: index === 0 ? palette.cyan : index === 1 ? '#405DB4' : '#A9A49C' }]}/></View></View>)}</View> : null}<View style={styles.yellowNote}><Text style={styles.explanationTitle}>{en ? 'You are not alone' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('No sos el único') : 'No sos el único') : (language as AppLanguage) === "miq" ? toMiskituDraft('No sos el único') : 'No sos el único'}</Text><Text style={styles.copy}>{en ? 'Almost everyone has felt peer pressure. Today you will learn what to do.' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Casi todos sentimos presión del grupo alguna vez. Hoy vas a aprender qué hacer con ella.') : 'Casi todos sentimos presión del grupo alguna vez. Hoy vas a aprender qué hacer con ella.') : (language as AppLanguage) === "miq" ? toMiskituDraft('Casi todos sentimos presión del grupo alguna vez. Hoy vas a aprender qué hacer con ella.') : 'Casi todos sentimos presión del grupo alguna vez. Hoy vas a aprender qué hacer con ella.'}</Text></View><Button variant="secondary" title={continueTitle} disabled={!selected} onPress={onDone}/></View>;
    }
    if (step.template === 'pressure_definition') {
        const types = (step.pressureTypes as InfoItem[] | undefined) ?? [];
        return <View style={styles.stack}><Text style={styles.pressureKicker}>01 · {en ? 'UNDERSTAND' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('ENTENDER') : 'ENTENDER') : (language as AppLanguage) === "miq" ? toMiskituDraft('ENTENDER') : 'ENTENDER'}</Text><Text style={styles.screenTitle}>{title}</Text><View style={styles.definitionCard}><Text style={styles.definitionText}>{step.body as string}</Text></View><Text style={styles.smallCaps}>{en ? 'IT CAN BE' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('PUEDE SER') : 'PUEDE SER') : (language as AppLanguage) === "miq" ? toMiskituDraft('PUEDE SER') : 'PUEDE SER'}</Text>{types.map((item, index) => <View key={item.title} style={[styles.infoLine, { borderLeftColor: ['#E9342F', '#FFB818', palette.cyan][index] }]}><View style={styles.infoIcon}><BrandIcon name={index === 2 ? 'chat' : 'people'} size={20} color={palette.ink}/></View><View style={{ flex: 1 }}><Text style={styles.infoTitle}>{item.title}</Text><Text style={styles.copy}>{item.text}</Text></View></View>)}<Button variant="secondary" title={continueTitle} onPress={onDone}/></View>;
    }
    if (step.template === 'pressure_reasons') {
        const reasons = (step.reasons as InfoItem[] | undefined) ?? [];
        return <View style={styles.stack}><Text style={styles.pressureKicker}>01 · {en ? 'UNDERSTAND' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('ENTENDER') : 'ENTENDER') : (language as AppLanguage) === "miq" ? toMiskituDraft('ENTENDER') : 'ENTENDER'}</Text><Text style={styles.screenTitle}>{title}</Text><View style={styles.dataCard}><View style={styles.phoneGlyph}><BrandIcon name="chat" size={30} color={palette.ink}/></View><View style={{ flex: 1 }}><Text style={styles.pressureKicker}>DATO</Text><Text style={styles.copyStrong}>{en ? 'During adolescence, the group’s opinion can feel stronger. It is a normal part of growing up.' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('En la adolescencia, lo que opina el grupo se siente más fuerte. Es parte normal de crecer.') : 'En la adolescencia, lo que opina el grupo se siente más fuerte. Es parte normal de crecer.') : (language as AppLanguage) === "miq" ? toMiskituDraft('En la adolescencia, lo que opina el grupo se siente más fuerte. Es parte normal de crecer.') : 'En la adolescencia, lo que opina el grupo se siente más fuerte. Es parte normal de crecer.'}</Text></View></View>{reasons.map((reason, index) => <View key={reason.title} style={[styles.reasonCard, { borderLeftColor: index === 0 ? '#FF5D91' : '#405DB4' }]}><Text style={styles.infoTitle}>{reason.title}</Text><Text style={styles.copy}>{reason.text}</Text></View>)}<View style={styles.pioNote}><PioMark small pose="hello"/><Text style={styles.copyStrong}>{en ? 'The good news: saying no can be learned, like any skill.' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('La buena noticia: decir «no» se aprende, como cualquier habilidad.') : 'La buena noticia: decir «no» se aprende, como cualquier habilidad.') : (language as AppLanguage) === "miq" ? toMiskituDraft('La buena noticia: decir «no» se aprende, como cualquier habilidad.') : 'La buena noticia: decir «no» se aprende, como cualquier habilidad.'}</Text></View><Button variant="secondary" title={continueTitle} onPress={onDone}/></View>;
    }
    if (step.template === 'communication_overview') {
        const items = (step.styles as InfoItem[] | undefined) ?? [];
        if (phase === 1)
            return <View style={styles.chapterComplete}><Text style={styles.completeNumber}>01</Text><View style={styles.completeCheck}><Text style={styles.completeCheckText}>✓</Text></View><Text style={styles.completeKicker}>{en ? 'CHAPTER READY' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('CAPÍTULO LISTO') : 'CAPÍTULO LISTO') : (language as AppLanguage) === "miq" ? toMiskituDraft('CAPÍTULO LISTO') : 'CAPÍTULO LISTO'}</Text><Text style={styles.completeTitle}>{en ? 'You understood peer pressure' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Entendiste qué es la presión de grupo') : 'Entendiste qué es la presión de grupo') : (language as AppLanguage) === "miq" ? toMiskituDraft('Entendiste qué es la presión de grupo') : 'Entendiste qué es la presión de grupo'}</Text><View style={styles.completeTrack}><View style={styles.completeFill}/></View><Text style={styles.completeNext}>{en ? 'Next: examples and the formula to say no.' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Siguiente: ejemplos y la fórmula para decir «no».') : 'Siguiente: ejemplos y la fórmula para decir «no».') : (language as AppLanguage) === "miq" ? toMiskituDraft('Siguiente: ejemplos y la fórmula para decir «no».') : 'Siguiente: ejemplos y la fórmula para decir «no».'}</Text><Button title={en ? 'Continue now' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Seguir ahora') : 'Seguir ahora') : (language as AppLanguage) === "miq" ? toMiskituDraft('Seguir ahora') : 'Seguir ahora'} onPress={onDone}/></View>;
        return <View style={styles.stack}><Text style={styles.pressureKicker}>01 · {en ? 'UNDERSTAND' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('ENTENDER') : 'ENTENDER') : (language as AppLanguage) === "miq" ? toMiskituDraft('ENTENDER') : 'ENTENDER'}</Text><Text style={styles.screenTitle}>{title}</Text>{items.map((item, index) => <View key={item.title} style={[styles.responseStyle, { borderLeftColor: ['#A49F96', '#E9342F', '#65A83D'][index] }]}><View style={styles.responseHead}><Text style={[styles.responseName, { color: ['#8A867E', '#E9342F', '#55972F'][index] }]}>{item.title}</Text><Text style={styles.meta}>{index === 0 ? (en ? 'Low voice' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Voz baja') : 'Voz baja') : (language as AppLanguage) === "miq" ? toMiskituDraft('Voz baja') : 'Voz baja') : index === 1 ? (en ? 'Shouting' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Gritos') : 'Gritos') : (language as AppLanguage) === "miq" ? toMiskituDraft('Gritos') : 'Gritos') : (en ? 'Firm and calm' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Voz firme y tranquila') : 'Voz firme y tranquila') : (language as AppLanguage) === "miq" ? toMiskituDraft('Voz firme y tranquila') : 'Voz firme y tranquila')}</Text></View><Text style={styles.copyStrong}>{item.body}</Text><Text style={styles.styleExample}>{item.example}</Text></View>)}<View style={styles.definitionCard}><Text style={styles.noticeText}>{en ? 'Assertiveness protects what you want and your relationship with the other person.' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('La respuesta asertiva cuida lo que vos querés y la relación con el otro.') : 'La respuesta asertiva cuida lo que vos querés y la relación con el otro.') : (language as AppLanguage) === "miq" ? toMiskituDraft('La respuesta asertiva cuida lo que vos querés y la relación con el otro.') : 'La respuesta asertiva cuida lo que vos querés y la relación con el otro.'}</Text></View><Button variant="secondary" title={en ? 'See examples' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Ver ejemplos') : 'Ver ejemplos') : (language as AppLanguage) === "miq" ? toMiskituDraft('Ver ejemplos') : 'Ver ejemplos'} onPress={() => setPhase(1)}/></View>;
    }
    if (step.template === 'assertive_formula') {
        const formula = (step.formulaSteps as string[] | undefined) ?? [];
        return <View style={styles.stack}><Text style={styles.pressureKicker}>02 · {en ? 'EXAMPLES' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('EJEMPLOS') : 'EJEMPLOS') : (language as AppLanguage) === "miq" ? toMiskituDraft('EJEMPLOS') : 'EJEMPLOS'}</Text><Text style={styles.screenTitle}>{title}</Text><View style={styles.formulaCard}>{formula.map((item, index) => <View key={item} style={styles.formulaRow}><View style={styles.formulaNumber}><Text style={styles.formulaNumberText}>{index + 1}</Text></View><View style={{ flex: 1 }}><Text style={styles.infoTitle}>{item}</Text><Text style={styles.meta}>{[en ? 'No detours or long excuses.' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Sin rodeos ni disculpas largas.') : 'Sin rodeos ni disculpas largas.') : (language as AppLanguage) === "miq" ? toMiskituDraft('Sin rodeos ni disculpas largas.') : 'Sin rodeos ni disculpas largas.', en ? 'You do not owe a long explanation.' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('No debés una explicación larga.') : 'No debés una explicación larga.') : (language as AppLanguage) === "miq" ? toMiskituDraft('No debés una explicación larga.') : 'No debés una explicación larga.', en ? 'Offer a safe alternative.' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Ofrecé una alternativa segura.') : 'Ofrecé una alternativa segura.') : (language as AppLanguage) === "miq" ? toMiskituDraft('Ofrecé una alternativa segura.') : 'Ofrecé una alternativa segura.', en ? 'You do not have to convince anyone.' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('No tenés que convencer a nadie.') : 'No tenés que convencer a nadie.') : (language as AppLanguage) === "miq" ? toMiskituDraft('No tenés que convencer a nadie.') : 'No tenés que convencer a nadie.'][index]}</Text></View></View>)}</View><View style={styles.twoMiniCards}><View style={[styles.miniTip, { borderLeftColor: '#79B94B' }]}><Text style={styles.infoTitle}>{en ? 'Tone' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Tono') : 'Tono') : (language as AppLanguage) === "miq" ? toMiskituDraft('Tono') : 'Tono'}</Text><Text style={styles.copy}>{en ? 'Calm and firm' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Tranquilo y firme') : 'Tranquilo y firme') : (language as AppLanguage) === "miq" ? toMiskituDraft('Tranquilo y firme') : 'Tranquilo y firme'}</Text></View><View style={[styles.miniTip, { borderLeftColor: palette.cyan }]}><Text style={styles.infoTitle}>{en ? 'Look' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Mirada') : 'Mirada') : (language as AppLanguage) === "miq" ? toMiskituDraft('Mirada') : 'Mirada'}</Text><Text style={styles.copy}>{en ? 'At the eyes' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('A los ojos') : 'A los ojos') : (language as AppLanguage) === "miq" ? toMiskituDraft('A los ojos') : 'A los ojos'}</Text></View></View><Button variant="secondary" title={en ? 'See a real example' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Ver un ejemplo real') : 'Ver un ejemplo real') : (language as AppLanguage) === "miq" ? toMiskituDraft('Ver un ejemplo real') : 'Ver un ejemplo real'} onPress={onDone}/></View>;
    }
    if (step.template === 'assertive_example') {
        const messages = (step.messages as string[] | undefined) ?? [];
        return <View style={styles.stack}><Text style={styles.pressureKicker}>02 · {en ? 'EXAMPLES' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('EJEMPLOS') : 'EJEMPLOS') : (language as AppLanguage) === "miq" ? toMiskituDraft('EJEMPLOS') : 'EJEMPLOS'}</Text><Text style={styles.screenTitle}>{title}</Text><View style={styles.groupChat}><Text style={styles.groupTitle}>Grupo · Los del barrio</Text><View style={styles.incomingBubble}><Text style={styles.copy}>Vale, esta noche nos salimos a la fiesta sin permiso. ¿Venís? Si no, sos aburrida 🙄</Text></View>{messages.map((message, index) => <View key={message} style={styles.annotatedMessage}><View style={styles.annotation}><Text style={styles.annotationText}>{index + 1}</Text></View><View style={styles.outgoingBubble}><Text style={styles.outgoingText}>{message}</Text></View></View>)}</View><View style={styles.pioNote}><Text style={styles.infoTitle}>☆ {en ? 'What did she do well?' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('¿Qué hizo bien?') : '¿Qué hizo bien?') : (language as AppLanguage) === "miq" ? toMiskituDraft('¿Qué hizo bien?') : '¿Qué hizo bien?'}</Text><Text style={styles.copy}>{en ? 'She used all four steps and did not insult anyone.' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Usó los 4 pasos y no insultó a nadie.') : 'Usó los 4 pasos y no insultó a nadie.') : (language as AppLanguage) === "miq" ? toMiskituDraft('Usó los 4 pasos y no insultó a nadie.') : 'Usó los 4 pasos y no insultó a nadie.'}</Text></View><Button variant="secondary" title={en ? 'Practice' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Practicar') : 'Practicar') : (language as AppLanguage) === "miq" ? toMiskituDraft('Practicar') : 'Practicar'} onPress={onDone}/></View>;
    }
    if (step.template === 'formula_quiz') {
        const options = [{ id: 'no', label: en ? 'Clear “no”' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('«No» claro') : '«No» claro') : (language as AppLanguage) === "miq" ? toMiskituDraft('«No» claro') : '«No» claro' }, { id: 'reason', label: en ? 'Brief explanation' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Explicación corta') : 'Explicación corta') : (language as AppLanguage) === "miq" ? toMiskituDraft('Explicación corta') : 'Explicación corta' }, { id: 'alternative', label: en ? 'Another option' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Otra opción') : 'Otra opción') : (language as AppLanguage) === "miq" ? toMiskituDraft('Otra opción') : 'Otra opción' }, { id: 'leave', label: en ? 'Leave' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Retirarse') : 'Retirarse') : (language as AppLanguage) === "miq" ? toMiskituDraft('Retirarse') : 'Retirarse' }];
        const correct = selected === step.answer;
        return <View style={styles.stack}><Text style={styles.pressureKicker}>02 · {en ? 'EXAMPLES' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('EJEMPLOS') : 'EJEMPLOS') : (language as AppLanguage) === "miq" ? toMiskituDraft('EJEMPLOS') : 'EJEMPLOS'}</Text><Text style={styles.screenTitle}>{title}</Text><View style={styles.groupChat}><Text style={styles.groupTitle}>Jessica</Text><View style={styles.incomingBubble}><Text style={styles.copy}>Vamos a copiarnos en el examen, ¿va?</Text></View><View style={styles.outgoingBubble}><Text style={styles.outgoingText}>{step.prompt as string}</Text></View></View>{options.map((option, index) => <Pressable key={option.id} onPress={() => { setSelected(option.id); setChecked(false); }} style={[styles.formulaChoice, selected === option.id && styles.formulaChoiceSelected, checked && option.id === step.answer && styles.formulaChoiceCorrect]}><View style={[styles.formulaNumber, option.id === 'alternative' && { backgroundColor: '#FFB718' }]}><Text style={styles.formulaNumberText}>{index + 1}</Text></View><Text style={styles.ruleText}>{option.label}</Text>{checked ? <Text style={styles.choiceStatus}>{option.id === step.answer ? '✓' : ''}</Text> : null}</Pressable>)}{checked ? <View style={[styles.explanation, correct ? styles.goodBox : styles.careBox]}><Text style={styles.explanationTitle}>{correct ? (en ? 'Exactly, step 3!' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('¡Exacto, el paso 3!') : '¡Exacto, el paso 3!') : (language as AppLanguage) === "miq" ? toMiskituDraft('¡Exacto, el paso 3!') : '¡Exacto, el paso 3!') : (en ? 'Look at the four steps' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Revisá los cuatro pasos') : 'Revisá los cuatro pasos') : (language as AppLanguage) === "miq" ? toMiskituDraft('Revisá los cuatro pasos') : 'Revisá los cuatro pasos')}</Text><Text style={styles.copy}>{en ? 'Offering another option protects the friendship.' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Proponer otra opción cuida la amistad.') : 'Proponer otra opción cuida la amistad.') : (language as AppLanguage) === "miq" ? toMiskituDraft('Proponer otra opción cuida la amistad.') : 'Proponer otra opción cuida la amistad.'}</Text></View> : null}<Button variant="secondary" title={!checked ? (en ? 'Check' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Comprobar') : 'Comprobar') : (language as AppLanguage) === "miq" ? toMiskituDraft('Comprobar') : 'Comprobar') : continueTitle} disabled={!selected} onPress={() => checked ? onDone() : setChecked(true)}/></View>;
    }
    if (step.template === 'pressure_practice') {
        const questions = (step.questions as TriviaQuestion[] | undefined) ?? [];
        const question = questions[round];
        const correct = selected === question?.answer_id;
        if (!question)
            return null;
        function nextQuestion() {
            if (!checked) {
                setChecked(true);
                return;
            }
            if (round + 1 === questions.length) {
                onDone();
                return;
            }
            setRound((value) => value + 1);
            setSelected('');
            setChecked(false);
        }
        return <View style={styles.stack}><Text style={styles.pressureKicker}>03 · {en ? 'PRACTICE' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('PRACTICAR') : 'PRACTICAR') : (language as AppLanguage) === "miq" ? toMiskituDraft('PRACTICAR') : 'PRACTICAR'}</Text><Text style={styles.counter}>{en ? 'QUESTION' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('PREGUNTA') : 'PREGUNTA') : (language as AppLanguage) === "miq" ? toMiskituDraft('PREGUNTA') : 'PREGUNTA'} {round + 1} {en ? 'OF' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('DE') : 'DE') : (language as AppLanguage) === "miq" ? toMiskituDraft('DE') : 'DE'} {questions.length}</Text><Text style={styles.bigQuestion}>{question.prompt}</Text>{question.options.map((option, index) => <Pressable key={option.id} onPress={() => { setSelected(option.id); setChecked(false); }} style={[styles.triviaOption, selected === option.id && styles.adventureSelected, checked && option.id === question.answer_id && styles.triviaSelected]}><View style={styles.choiceLetter}><Text style={styles.choiceLetterText}>{String.fromCharCode(65 + index)}</Text></View><Text style={styles.ruleText}>{option.text}</Text></Pressable>)}{checked ? <View style={[styles.explanation, correct ? styles.goodBox : styles.careBox]}><Text style={styles.explanationTitle}>{correct ? (en ? 'Good choice!' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('¡Chiva! Buena elección') : '¡Chiva! Buena elección') : (language as AppLanguage) === "miq" ? toMiskituDraft('¡Chiva! Buena elección') : '¡Chiva! Buena elección') : (en ? 'Let’s review it' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Revisémoslo') : 'Revisémoslo') : (language as AppLanguage) === "miq" ? toMiskituDraft('Revisémoslo') : 'Revisémoslo')}</Text><Text style={styles.copy}>{question.explanation}</Text></View> : null}<Button variant="secondary" title={!checked ? (en ? 'Check' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Comprobar') : 'Comprobar') : (language as AppLanguage) === "miq" ? toMiskituDraft('Comprobar') : 'Comprobar') : round + 1 < questions.length ? (en ? 'Next question' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Siguiente pregunta') : 'Siguiente pregunta') : (language as AppLanguage) === "miq" ? toMiskituDraft('Siguiente pregunta') : 'Siguiente pregunta') : (en ? 'Finish practice' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Terminar práctica') : 'Terminar práctica') : (language as AppLanguage) === "miq" ? toMiskituDraft('Terminar práctica') : 'Terminar práctica')} disabled={!selected} onPress={nextQuestion}/></View>;
    }
    if (step.template === 'assertive_response') {
        const checklist = [en ? 'Clear “no”' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Dijiste «no» claro') : 'Dijiste «no» claro') : (language as AppLanguage) === "miq" ? toMiskituDraft('Dijiste «no» claro') : 'Dijiste «no» claro', en ? 'Brief explanation' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Explicaste corto') : 'Explicaste corto') : (language as AppLanguage) === "miq" ? toMiskituDraft('Explicaste corto') : 'Explicaste corto', en ? 'Another option' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Propusiste otra cosa') : 'Propusiste otra cosa') : (language as AppLanguage) === "miq" ? toMiskituDraft('Propusiste otra cosa') : 'Propusiste otra cosa', en ? 'Respectful tone' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Tono respetuoso') : 'Tono respetuoso') : (language as AppLanguage) === "miq" ? toMiskituDraft('Tono respetuoso') : 'Tono respetuoso'];
        async function saveResponse() { await AsyncStorage.setItem('pio:secondary:assertive-response', JSON.stringify({ text: draft.trim(), savedAt: new Date().toISOString() })); onDone(); }
        return <View style={styles.stack}><Text style={styles.pressureKicker}>03 · {en ? 'PRACTICE' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('PRACTICAR') : 'PRACTICAR') : (language as AppLanguage) === "miq" ? toMiskituDraft('PRACTICAR') : 'PRACTICAR'}</Text><Text style={styles.screenTitle}>{title}</Text><View style={styles.chatHeader}><View style={[styles.chatAvatar, { backgroundColor: '#159948' }]}><Text style={styles.chatInitial}>KO</Text></View><Text style={styles.messageAuthor}>Kevin</Text></View><View style={styles.incomingBubble}><Text style={styles.copy}>{step.prompt as string}</Text></View><TextInput multiline value={draft} onChangeText={setDraft} placeholder={en ? 'Write a clear and respectful answer…' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Escribí una respuesta clara y respetuosa…') : 'Escribí una respuesta clara y respetuosa…') : (language as AppLanguage) === "miq" ? toMiskituDraft('Escribí una respuesta clara y respetuosa…') : 'Escribí una respuesta clara y respetuosa…'} placeholderTextColor="#8B887F" style={[styles.questionInput, { minHeight: 145, borderColor: palette.cyan }]}/><View style={styles.reviewCard}><Text style={styles.infoTitle}>{en ? 'Review your answer' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Revisión de tu respuesta') : 'Revisión de tu respuesta') : (language as AppLanguage) === "miq" ? toMiskituDraft('Revisión de tu respuesta') : 'Revisión de tu respuesta'}</Text>{checklist.map((item, index) => <View key={item} style={styles.checkRow}><View style={[styles.checkDot, draft.trim().length > (index + 1) * 10 && styles.checkDotOn]}><Text style={styles.checkDotText}>✓</Text></View><Text style={styles.copyStrong}>{item}</Text></View>)}</View><View style={styles.privacy}><BrandIcon name="lock" size={17} color={palette.ink}/><Text style={styles.privacyText}>{step.privacy_note as string}</Text></View><Button variant="secondary" title={en ? 'Save response' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Guardar respuesta') : 'Guardar respuesta') : (language as AppLanguage) === "miq" ? toMiskituDraft('Guardar respuesta') : 'Guardar respuesta'} disabled={draft.trim().length < 12} onPress={() => void saveResponse()}/></View>;
    }
    if (step.template === 'assertive_plan') {
        const places = (step.places as string[] | undefined) ?? [];
        const people = (step.supportPeople as string[] | undefined) ?? [];
        async function savePlan() { await AsyncStorage.setItem('pio:secondary:assertive-plan', JSON.stringify({ place, phrase: draft.trim(), support, savedAt: new Date().toISOString() })); onDone(); }
        return <View style={styles.stack}><Text style={styles.pressureKicker}>04 · {en ? 'APPLY' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('APLICAR') : 'APLICAR') : (language as AppLanguage) === "miq" ? toMiskituDraft('APLICAR') : 'APLICAR'}</Text><Text style={styles.screenTitle}>{title}</Text><Text style={styles.smallCaps}>{en ? 'WHERE DO YOU FEEL MORE PRESSURE?' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('¿DÓNDE SENTÍS MÁS PRESIÓN?') : '¿DÓNDE SENTÍS MÁS PRESIÓN?') : (language as AppLanguage) === "miq" ? toMiskituDraft('¿DÓNDE SENTÍS MÁS PRESIÓN?') : '¿DÓNDE SENTÍS MÁS PRESIÓN?'}</Text><View style={styles.planGrid}>{places.map((item) => <Pressable key={item} onPress={() => setPlace(item)} style={[styles.planChoice, place === item && styles.planChoiceActive]}><BrandIcon name={item.toLowerCase().includes('red') || item.toLowerCase().includes('online') ? 'chat' : 'people'} size={18} color={place === item ? palette.white : palette.ink}/><Text style={[styles.planChoiceText, place === item && { color: palette.white }]}>{item}</Text></Pressable>)}</View><View style={styles.reviewCard}><Text style={styles.pressureKicker}>{en ? 'MY READY PHRASE' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('MI FRASE LISTA') : 'MI FRASE LISTA') : (language as AppLanguage) === "miq" ? toMiskituDraft('MI FRASE LISTA') : 'MI FRASE LISTA'}</Text><TextInput value={draft} onChangeText={setDraft} placeholder={en ? 'No thanks. That is not for me.' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('No, gracias. Eso no va conmigo.') : 'No, gracias. Eso no va conmigo.') : (language as AppLanguage) === "miq" ? toMiskituDraft('No, gracias. Eso no va conmigo.') : 'No, gracias. Eso no va conmigo.'} placeholderTextColor="#88837C" style={styles.planInput}/></View><Text style={styles.smallCaps}>{en ? 'IF IT DOES NOT WORK, I WILL TALK TO' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('SI NO FUNCIONA, VOY A HABLAR CON') : 'SI NO FUNCIONA, VOY A HABLAR CON') : (language as AppLanguage) === "miq" ? toMiskituDraft('SI NO FUNCIONA, VOY A HABLAR CON') : 'SI NO FUNCIONA, VOY A HABLAR CON'}</Text><View style={styles.chips}>{people.map((person) => <Pressable key={person} onPress={() => setSupport(person)} style={[styles.chip, support === person && styles.chipActive]}><Text style={styles.chipText}>{person}</Text></Pressable>)}</View><View style={styles.privacy}><BrandIcon name="lock" size={17} color={palette.ink}/><Text style={styles.privacyText}>{en ? 'This plan is private and is not graded.' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Este plan es privado y no se califica.') : 'Este plan es privado y no se califica.') : (language as AppLanguage) === "miq" ? toMiskituDraft('Este plan es privado y no se califica.') : 'Este plan es privado y no se califica.'}</Text></View><Button variant="secondary" title={en ? 'Save to my toolbox' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Guardar en mi caja de herramientas') : 'Guardar en mi caja de herramientas') : (language as AppLanguage) === "miq" ? toMiskituDraft('Guardar en mi caja de herramientas') : 'Guardar en mi caja de herramientas'} disabled={!place || draft.trim().length < 8 || !support} onPress={() => void savePlan()}/></View>;
    }
    if (step.template === 'family_conversation') {
        const people = en ? ['Mom', 'Grandmother', 'Uncle', 'Another person'] : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft(['Mamá', 'Abuela', 'Tío', 'Otra persona']) : ['Mamá', 'Abuela', 'Tío', 'Otra persona']) : (language as AppLanguage) === "miq" ? toMiskituDraft(['Mamá', 'Abuela', 'Tío', 'Otra persona']) : ['Mamá', 'Abuela', 'Tío', 'Otra persona'];
        async function saveFamily() { await AsyncStorage.setItem('pio:secondary:family-conversation', JSON.stringify({ person: selected, pending: true, savedAt: new Date().toISOString() })); onDone(); }
        return <View style={styles.stack}><Text style={styles.pressureKicker}>04 · {en ? 'APPLY' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('APLICAR') : 'APLICAR') : (language as AppLanguage) === "miq" ? toMiskituDraft('APLICAR') : 'APLICAR'}</Text><View style={styles.homeIllustration}><View style={styles.hammockPost}/><View style={[styles.hammockPost, { right: 28, left: undefined }]}/><View style={styles.hammockLine}/><Text style={styles.homeEmoji}>🏠</Text></View><Text style={styles.smallCaps}>{en ? 'CONVERSATION AT HOME' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('CONVERSACIÓN EN CASA') : 'CONVERSACIÓN EN CASA') : (language as AppLanguage) === "miq" ? toMiskituDraft('CONVERSACIÓN EN CASA') : 'CONVERSACIÓN EN CASA'}</Text><Text style={styles.screenTitle}>{step.body as string}</Text><Text style={styles.copy}>{en ? 'Choose who you will talk to this week. It can be a short conversation at dinner or on the way somewhere.' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Elegí con quién hablarlo esta semana. Puede ser una conversación corta, en la cena o de camino a algún lado.') : 'Elegí con quién hablarlo esta semana. Puede ser una conversación corta, en la cena o de camino a algún lado.') : (language as AppLanguage) === "miq" ? toMiskituDraft('Elegí con quién hablarlo esta semana. Puede ser una conversación corta, en la cena o de camino a algún lado.') : 'Elegí con quién hablarlo esta semana. Puede ser una conversación corta, en la cena o de camino a algún lado.'}</Text><View style={styles.chips}>{people.map((person) => <Pressable key={person} onPress={() => setSelected(person)} style={[styles.chip, selected === person && styles.planChoiceActive]}><Text style={[styles.chipText, selected === person && { color: palette.white }]}>{person}</Text></Pressable>)}</View><View style={styles.privacy}><BrandIcon name="lock" size={18} color={palette.ink}/><View style={{ flex: 1 }}><Text style={styles.infoTitle}>{en ? 'It is private' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Es privado') : 'Es privado') : (language as AppLanguage) === "miq" ? toMiskituDraft('Es privado') : 'Es privado'}</Text><Text style={styles.privacyText}>{step.privacy_note as string}</Text></View></View><Button variant="secondary" title={en ? 'Ready, I will talk about it' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Listo, lo voy a conversar') : 'Listo, lo voy a conversar') : (language as AppLanguage) === "miq" ? toMiskituDraft('Listo, lo voy a conversar') : 'Listo, lo voy a conversar'} disabled={!selected} onPress={() => void saveFamily()}/></View>;
    }
    const takeaways = (step.takeaways as string[] | undefined) ?? [];
    return <View style={styles.stack}><Text style={styles.pressureKicker}>{en ? 'SUMMARY' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('RESUMEN') : 'RESUMEN') : (language as AppLanguage) === "miq" ? toMiskituDraft('RESUMEN') : 'RESUMEN'}</Text><View style={styles.summaryHero}><Text style={styles.pressureHeroKicker}>{en ? 'LESSON COMPLETED' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('LECCIÓN COMPLETADA') : 'LECCIÓN COMPLETADA') : (language as AppLanguage) === "miq" ? toMiskituDraft('LECCIÓN COMPLETADA') : 'LECCIÓN COMPLETADA'}</Text><Text style={styles.pressureHeroTitle}>{title}</Text><View style={styles.summaryBadge}><BrandIcon name="chat" size={24} color="#A5E9FA"/><Text style={styles.noticeText}>{en ? 'New badge: I say no without fighting' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Nueva insignia: Digo no sin pelear') : 'Nueva insignia: Digo no sin pelear') : (language as AppLanguage) === "miq" ? toMiskituDraft('Nueva insignia: Digo no sin pelear') : 'Nueva insignia: Digo no sin pelear'}</Text></View></View><Text style={styles.smallCaps}>{en ? 'WHAT YOU TAKE WITH YOU' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('LO QUE TE LLEVÁS') : 'LO QUE TE LLEVÁS') : (language as AppLanguage) === "miq" ? toMiskituDraft('LO QUE TE LLEVÁS') : 'LO QUE TE LLEVÁS'}</Text>{takeaways.map((item, index) => <View key={item} style={styles.summaryRow}><View style={styles.summaryNumber}><Text style={styles.summaryNumberText}>{index + 1}</Text></View><Text style={styles.goalText}>{item}</Text></View>)}<View style={styles.reasonCard}><Text style={styles.infoTitle}>{en ? 'To talk about at home' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Para conversar en casa') : 'Para conversar en casa') : (language as AppLanguage) === "miq" ? toMiskituDraft('Para conversar en casa') : 'Para conversar en casa'}</Text><Text style={styles.copy}>{en ? 'What makes a good friend? How do you say no without fighting in your family?' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('¿Qué hace a una buena amistad? ¿Cómo dicen «no» sin pelear en tu familia?') : '¿Qué hace a una buena amistad? ¿Cómo dicen «no» sin pelear en tu familia?') : (language as AppLanguage) === "miq" ? toMiskituDraft('¿Qué hace a una buena amistad? ¿Cómo dicen «no» sin pelear en tu familia?') : '¿Qué hace a una buena amistad? ¿Cómo dicen «no» sin pelear en tu familia?'}</Text></View><Button variant="secondary" title={en ? 'Finish' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Terminar') : 'Terminar') : (language as AppLanguage) === "miq" ? toMiskituDraft('Terminar') : 'Terminar'} onPress={onDone}/></View>;
}
function Myths({ step, language, onDone }: GameProps) {
    const cards = (step.cards as CardItem[] | undefined) ?? [];
    const [round, setRound] = useState(0);
    const [choice, setChoice] = useState<'myth' | 'fact' | ''>('');
    const [checked, setChecked] = useState(false);
    const [score, setScore] = useState(0);
    const card = cards[round];
    const correct = choice === card?.answer;
    function next() {
        if (!checked) {
            setChecked(true);
            if (correct)
                setScore((value) => value + 1);
            return;
        }
        if (round + 1 >= cards.length) {
            onDone();
            return;
        }
        setRound((value) => value + 1);
        setChoice('');
        setChecked(false);
    }
    if (!card)
        return null;
    return <View style={styles.stack}>
    <Text style={styles.counter}>{language === 'en' ? 'CARD' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('TARJETA') : 'TARJETA') : (language as AppLanguage) === "miq" ? toMiskituDraft('TARJETA') : 'TARJETA') : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('TARJETA') : 'TARJETA') : (language as AppLanguage) === "miq" ? toMiskituDraft('TARJETA') : 'TARJETA'} {round + 1} {language === 'en' ? 'OF' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('DE') : 'DE') : (language as AppLanguage) === "miq" ? toMiskituDraft('DE') : 'DE') : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('DE') : 'DE') : (language as AppLanguage) === "miq" ? toMiskituDraft('DE') : 'DE'} {cards.length}</Text>
    <View style={styles.mythShadow}><View style={styles.mythCard}>
      <View style={styles.cardTop}><Text style={styles.category}>{card.category}</Text><Text style={[styles.badge, card.answer === 'fact' && styles.factBadge]}>{checked ? (card.answer === 'myth' ? 'MITO' : 'VERDAD') : '?'}</Text></View>
      <Text style={styles.statement}>«{card.text}»</Text><Text style={styles.swipeHint}>Deslizá a un lado</Text>
    </View></View>
    {checked ? <View style={[styles.explanation, correct ? styles.goodBox : styles.careBox]}><Text style={styles.explanationKicker}>{correct ? '¡Bien visto!' : 'Mirá esta pista'}</Text><Text style={styles.explanationTitle}>{card.answer === 'myth' ? 'Es un mito' : 'Es verdad'}</Text><Text style={styles.copy}>{card.explanation}</Text>{round + 1 === cards.length ? <Text style={styles.score}>{score + (correct ? 1 : 0)} / {cards.length} · La meta es 7</Text> : null}</View> : <View style={styles.twoButtons}><ChoiceButton label="← Mito" active={choice === 'myth'} color="#F27D79" onPress={() => setChoice('myth')}/><ChoiceButton label="Verdad →" active={choice === 'fact'} color="#79B94B" onPress={() => setChoice('fact')}/></View>}
    <Button variant="secondary" title={!checked ? 'Comprobar' : round + 1 < cards.length ? 'Siguiente tarjeta' : 'Terminar'} disabled={!choice} onPress={next}/>
  </View>;
}
function BeforeAfter({ step, language, onDone }: GameProps) {
    const ideas = (step.ideas as string[] | undefined) ?? [];
    const [before, setBefore] = useState('Me daba pena hablar en clase.');
    const [now, setNow] = useState('Me gusta opinar cuando sé del tema.');
    const [extraBefore, setExtraBefore] = useState('');
    const [extraNow, setExtraNow] = useState('');
    const ready = before.trim().length > 2 && now.trim().length > 2;
    async function save() {
        await AsyncStorage.setItem('pio:secondary:before-after', JSON.stringify({ before, now, extraBefore, extraNow, savedAt: new Date().toISOString() }));
        onDone();
    }
    return <View style={styles.stack}>
    <Text style={styles.bigQuestion}>¿Qué cambió en vos desde la primaria?</Text>
    <View style={styles.beforeGrid}><LabeledInput label="ANTES" value={before} onChange={setBefore}/><LabeledInput label="AHORA" value={now} onChange={setNow} blue/><LabeledInput label="ANTES" value={extraBefore} onChange={setExtraBefore} placeholder="Escribí o elegí…" dashed/><LabeledInput label="AHORA" value={extraNow} onChange={setExtraNow} placeholder="Escribí o elegí…" dashed/></View>
    <Text style={styles.smallCaps}>IDEAS</Text><View style={styles.chips}>{ideas.map((idea) => <Pressable key={idea} onPress={() => extraBefore ? setExtraNow(idea) : setExtraBefore(idea)} style={styles.chip}><Text style={styles.chipText}>{idea}</Text></Pressable>)}</View>
    <View style={styles.privacy}><BrandIcon name="lock" size={17} color={palette.ink}/><Text style={styles.privacyText}>{step.privacy_note}</Text></View>
    <Button variant="secondary" title={language === 'en' ? 'Save' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Guardar') : 'Guardar') : (language as AppLanguage) === "miq" ? toMiskituDraft('Guardar') : 'Guardar') : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Guardar') : 'Guardar') : (language as AppLanguage) === "miq" ? toMiskituDraft('Guardar') : 'Guardar'} disabled={!ready} onPress={() => void save()}/>
  </View>;
}
function AnonymousQuestion({ step, language, onDone }: GameProps) {
    const [question, setQuestion] = useState('');
    const [sent, setSent] = useState(false);
    async function send() {
        const raw = await AsyncStorage.getItem('pio:anonymous-question-outbox');
        const outbox = raw ? JSON.parse(raw) as {
            text: string;
            createdAt: string;
        }[] : [];
        outbox.push({ text: question.trim(), createdAt: new Date().toISOString() });
        await AsyncStorage.setItem('pio:anonymous-question-outbox', JSON.stringify(outbox.slice(-20)));
        setSent(true);
    }
    return <View style={styles.stack}>
    <Text style={styles.screenTitle}>Pregunta anónima</Text>
    <View style={styles.navyNotice}><BrandIcon name="lock" color="#FFFFFF" size={18}/><Text style={styles.noticeText}>Tu nombre no se guarda con la pregunta. Cuando el buzón esté conectado, tu docente podrá responderla para todo el grupo.</Text></View>
    {!sent ? <><TextInput multiline maxLength={280} value={question} onChangeText={setQuestion} placeholder="¿Es normal que a veces me sienta triste sin razón?" placeholderTextColor="#6F7483" style={styles.questionInput}/>
      <View style={styles.inputMeta}><Text style={styles.meta}>{question.length} / 280</Text><Text style={styles.meta}>No escribás nombres de otras personas</Text></View>
      <Button variant="secondary" title="Enviar pregunta" disabled={question.trim().length < 8} onPress={() => void send()}/></> : <View style={styles.sentBox}><PioMark pose="success" size={105}/><Text style={styles.bigQuestion}>Pregunta guardada</Text><Text style={styles.copy}>Quedó en la bandeja anónima del dispositivo y se enviará cuando el backend habilite el buzón de texto.</Text><Button variant="secondary" title="Continuar" onPress={onDone}/></View>}
    <Text style={styles.centerMeta}>Las preguntas se revisan antes de responderse.</Text>
  </View>;
}
function EditedPhotos({ step, language, onDone }: GameProps) {
    const pairs = (step.pairs as PhotoPair[] | undefined) ?? [];
    const [round, setRound] = useState(0);
    const [choice, setChoice] = useState<'a' | 'b' | ''>('');
    const [checked, setChecked] = useState(false);
    const [score, setScore] = useState(0);
    const pair = pairs[round];
    const correct = choice === pair?.answer;
    function next() {
        if (!checked) {
            setChecked(true);
            if (correct)
                setScore((v) => v + 1);
            return;
        }
        if (round + 1 >= pairs.length) {
            onDone();
            return;
        }
        setRound((v) => v + 1);
        setChoice('');
        setChecked(false);
    }
    if (!pair)
        return null;
    return <View style={styles.stack}><Text style={styles.bigQuestion}>{pair.prompt}</Text><View style={styles.photoRow}><PhotoCard label="A" edited={pair.answer === 'a'} selected={choice === 'a'} reveal={checked} onPress={() => setChoice('a')}/><PhotoCard label="B" edited={pair.answer === 'b'} selected={choice === 'b'} reveal={checked} onPress={() => setChoice('b')}/></View>
    {checked ? <View style={[styles.explanation, correct ? styles.skyBox : styles.careBox]}><Text style={styles.explanationTitle}>{correct ? `Elegiste ${choice.toUpperCase()}. ¡Bien visto!` : `La editada era ${pair.answer.toUpperCase()}`}</Text><Text style={styles.copy}>{pair.clue}</Text><View style={styles.chips}>{pair.tags.map((tag) => <View key={tag} style={styles.clueChip}><Text style={styles.clueText}>{tag}</Text></View>)}</View>{round + 1 === pairs.length ? <Text style={styles.score}>{score + (correct ? 1 : 0)} / 6 · La meta es 4</Text> : null}</View> : <Text style={styles.centerMeta}>Tocá A o B y buscá pistas de filtro, recorte, ángulo o luz.</Text>}
    <Button variant="secondary" title={!checked ? 'Comprobar' : round + 1 < pairs.length ? 'Siguiente par' : 'Terminar'} disabled={!choice} onPress={next}/>
  </View>;
}
function DigitalTraffic({ step, onDone }: GameProps) {
    const scenarios = (step.scenarios as DigitalScenario[] | undefined) ?? [];
    const [round, setRound] = useState(0);
    const [choice, setChoice] = useState<'green' | 'yellow' | 'red' | ''>('');
    const [checked, setChecked] = useState(false);
    const [score, setScore] = useState(0);
    const scenario = scenarios[round];
    const correct = choice === scenario?.answer;
    function next() {
        if (!checked) {
            setChecked(true);
            if (correct)
                setScore((v) => v + 1);
            return;
        }
        if (round + 1 >= scenarios.length) {
            onDone();
            return;
        }
        setRound((v) => v + 1);
        setChoice('');
        setChecked(false);
    }
    if (!scenario)
        return null;
    return <View style={styles.stack}><Text style={styles.counter}>SITUACIÓN {round + 1} DE {scenarios.length}</Text><View style={styles.messageCard}><View style={styles.unknown}><Text style={styles.unknownText}>??</Text></View><View style={{ flex: 1 }}><Text style={styles.messageAuthor}>Usuario desconocido</Text><Text style={styles.meta}>Mensaje directo</Text><Text style={styles.message}>{scenario.text}</Text></View></View><Text style={styles.bigQuestion}>¿Qué color es?</Text>
    <View style={styles.trafficChoices}><TrafficChoice color="#79B94B" label="Verde · seguro" active={choice === 'green'} onPress={() => setChoice('green')}/><TrafficChoice color="#FFB718" label="Amarillo · cuidado" active={choice === 'yellow'} onPress={() => setChoice('yellow')}/><TrafficChoice color="#EA3734" label="Rojo · pedir ayuda" active={choice === 'red'} onPress={() => setChoice('red')}/></View>
    {checked ? <View style={[styles.explanation, correct ? styles.goodBox : styles.careBox]}><Text style={styles.explanationTitle}>{correct ? '¡Buena decisión!' : `La mejor opción es ${trafficLabel(scenario.answer)}.`}</Text><Text style={styles.copy}>{scenario.feedback}</Text>{round + 1 === scenarios.length ? <Text style={styles.score}>{score + (correct ? 1 : 0)} / 9 · La meta es 7</Text> : null}</View> : null}
    <Button variant="secondary" title={!checked ? 'Comprobar' : round + 1 < scenarios.length ? 'Siguiente situación' : 'Terminar'} disabled={!choice} onPress={next}/>
  </View>;
}
function ScreenRules({ step, onDone }: GameProps) {
    const suggestions = (step.suggestions as string[] | undefined) ?? [];
    const [rules, setRules] = useState<string[]>(suggestions.slice(0, 2));
    const [custom, setCustom] = useState('');
    const uniqueRules = useMemo(() => Array.from(new Set([...rules, custom.trim()].filter(Boolean))).slice(0, 3), [rules, custom]);
    function toggle(rule: string) { setRules((current) => current.includes(rule) ? current.filter((item) => item !== rule) : current.length < 3 ? [...current, rule] : current); }
    async function save() { await AsyncStorage.setItem('pio:secondary:screen-rules', JSON.stringify({ rules: uniqueRules, savedAt: new Date().toISOString() })); onDone(); }
    return <View style={styles.stack}><Text style={styles.screenTitle}>Armá tus reglas de pantalla</Text><View style={styles.dayCard}><Text style={styles.smallCaps}>MI DÍA</Text><View style={styles.dayBar}><View style={[styles.dayPart, { flex: 9, backgroundColor: '#4866C4' }]}/><View style={[styles.dayPart, { flex: 6, backgroundColor: '#FFB718' }]}/><View style={[styles.dayPart, { flex: 3, backgroundColor: '#72BE63' }]}/><View style={[styles.dayPart, { flex: 4, backgroundColor: '#E34D87' }]}/></View><Text style={styles.dayLegend}>■ Sueño 9 h   ■ Estudio   ■ Movimiento   ■ Pantalla 4 h</Text></View>
    <View style={styles.ruleList}>{uniqueRules.map((rule, index) => <View key={`${rule}-${index}`} style={styles.rule}><View style={styles.ruleNumber}><Text style={styles.ruleNumberText}>{index + 1}</Text></View><Text style={styles.ruleText}>{rule}</Text></View>)}{uniqueRules.length < 3 ? <TextInput value={custom} onChangeText={setCustom} placeholder="Elegí o escribí tu tercera regla" placeholderTextColor="#8B887F" style={styles.customRule}/> : null}</View>
    <View style={styles.chips}>{suggestions.map((suggestion) => <Pressable key={suggestion} onPress={() => toggle(suggestion)} style={[styles.chip, rules.includes(suggestion) && styles.chipActive]}><Text style={styles.chipText}>{suggestion}</Text></Pressable>)}</View>
    <View style={styles.privacy}><BrandIcon name="heart" size={18} color={palette.ink}/><Text style={styles.privacyText}>Buscá equilibrio entre descanso, estudio, movimiento y conexión. Las reglas deben cuidarte, no castigarte.</Text></View>
    <Button variant="secondary" title="Comprometerme" disabled={uniqueRules.length !== 3} onPress={() => void save()}/>
  </View>;
}
function CommunicationStyles({ step, onDone }: GameProps) {
    const scenes = (step.scenes as CommunicationScene[] | undefined) ?? [];
    const formula = (step.formula as string[] | undefined) ?? [];
    const [round, setRound] = useState(0);
    const [selected, setSelected] = useState('');
    const [checked, setChecked] = useState(false);
    const [draft, setDraft] = useState('');
    const [practice, setPractice] = useState(false);
    const scene = scenes[round];
    const option = scene?.options.find((item) => item.id === selected);
    const correct = selected === scene?.answer;
    function next() {
        if (!checked) {
            setChecked(true);
            return;
        }
        if (round + 1 < scenes.length) {
            setRound((value) => value + 1);
            setSelected('');
            setChecked(false);
            return;
        }
        setPractice(true);
    }
    if (practice)
        return <View style={styles.stack}><Text style={styles.screenTitle}>Ahora practicá la tuya</Text><View style={styles.navyNotice}><PioMark pose="hello" size={48}/><Text style={styles.noticeText}>Una respuesta asertiva dice lo que querés con claridad, sin atacar ni rendirte.</Text></View><Text style={styles.smallCaps}>ELEGÍ UNA FORMA PARA EMPEZAR</Text><View style={styles.chips}>{formula.map((item) => <Pressable key={item} onPress={() => setDraft(`${item} `)} style={styles.clueChip}><Text style={styles.clueText}>{item}</Text></Pressable>)}</View><TextInput multiline value={draft} onChangeText={setDraft} placeholder="Escribí una respuesta clara y respetuosa…" placeholderTextColor="#8B887F" style={styles.questionInput}/><View style={styles.privacy}><BrandIcon name="lock" size={17} color={palette.ink}/><Text style={styles.privacyText}>No se califica lo que escribís. Se registra únicamente que completaste la práctica.</Text></View><Button variant="secondary" title="Guardar mi respuesta" disabled={draft.trim().length < 12} onPress={onDone}/></View>;
    if (!scene)
        return null;
    return <View style={styles.stack}><View style={styles.chatHeader}><View style={styles.chatAvatar}><Text style={styles.chatInitial}>JM</Text></View><Text style={styles.messageAuthor}>Josué</Text></View><View style={styles.chatBubble}><Text style={styles.copy}>{scene.message}</Text></View><Text style={styles.smallCaps}>¿QUÉ ESTILO ES CADA UNA?</Text><View style={styles.stack}>{scene.options.map((item) => <Pressable key={item.id} onPress={() => { setSelected(item.id); setChecked(false); }} style={[styles.styleOption, selected === item.id && styles.styleOptionSelected]}><Text style={styles.styleOptionText}>«{item.text}»</Text><Text style={[styles.styleTag, item.style === 'Asertivo' ? styles.assertiveTag : item.style === 'Agresivo' ? styles.aggressiveTag : styles.passiveTag]}>{item.style}</Text></Pressable>)}</View>{checked ? <View style={[styles.explanation, correct ? styles.goodBox : styles.careBox]}><Text style={styles.explanationTitle}>{correct ? 'Respuesta asertiva' : `${option?.style ?? 'Esta respuesta'} no es asertiva`}</Text><Text style={styles.copy}>{correct ? 'Expresa un límite con respeto y ofrece una alternativa sin atacar.' : 'Buscá una respuesta que diga no con claridad y sin lastimar.'}</Text></View> : null}<Text style={styles.centerMeta}>Situación {round + 1} de {scenes.length}</Text><Button variant="secondary" title={!checked ? 'Comprobar' : round + 1 < scenes.length ? 'Siguiente situación' : 'Escribir mi respuesta'} disabled={!selected} onPress={next}/></View>;
}
function ChoiceAdventure({ step, onDone }: GameProps) {
    const story = (step.story as AdventureScene[] | undefined) ?? [];
    const [round, setRound] = useState(0);
    const [selected, setSelected] = useState('');
    const [revealed, setRevealed] = useState(false);
    const [responsible, setResponsible] = useState(0);
    const scene = story[round];
    const choice = scene?.choices.find((item) => item.id === selected);
    function next() {
        if (!revealed) {
            setRevealed(true);
            if (choice?.responsible)
                setResponsible((value) => value + 1);
            return;
        }
        if (round + 1 >= story.length) {
            onDone();
            return;
        }
        setRound((value) => value + 1);
        setSelected('');
        setRevealed(false);
    }
    if (!scene)
        return null;
    return <View style={styles.stack}><View style={styles.partyScene}><View style={styles.flags}><Text style={styles.flagsText}>▼ ▼ ▼ ▼ ▼ ▼ ▼</Text></View><View style={styles.people}><View style={[styles.person, { backgroundColor: '#F2729A' }]}/><View style={[styles.person, { backgroundColor: palette.cyan }]}/><View style={[styles.person, { backgroundColor: '#7DBE4A' }]}/></View><Text style={styles.partyBubble}>¿Probás, no pasa nada?</Text></View><Text style={styles.copyStrong}>{scene.scene}</Text><Text style={styles.smallCaps}>¿QUÉ HACÉS?</Text><View style={styles.stack}>{scene.choices.map((item, index) => <Pressable key={item.id} onPress={() => { setSelected(item.id); setRevealed(false); }} style={[styles.adventureChoice, selected === item.id && styles.adventureSelected]}><View style={styles.choiceLetter}><Text style={styles.choiceLetterText}>{String.fromCharCode(65 + index)}</Text></View><Text style={styles.ruleText}>{item.text}</Text></Pressable>)}</View>{revealed && choice ? <View style={[styles.explanation, choice.responsible ? styles.goodBox : styles.careBox]}><Text style={styles.explanationTitle}>{choice.responsible ? 'Decisión responsable' : 'Revisemos esta decisión'}</Text><Text style={styles.copy}>{choice.consequence}</Text>{round + 1 === story.length ? <Text style={styles.score}>{responsible + (choice.responsible ? 1 : 0)} decisiones que te cuidan</Text> : null}</View> : null}<Text style={styles.centerMeta}>Decisión {round + 1} de {story.length}</Text><Button variant="secondary" title={!revealed ? 'Ver consecuencia' : round + 1 < story.length ? 'Siguiente decisión' : 'Terminar aventura'} disabled={!selected} onPress={next}/></View>;
}
function HealthyFriendship({ step, onDone }: GameProps) {
    const cards = (step.friendshipCards as FriendshipCard[] | undefined) ?? [];
    const categories = [{ id: 'respect', label: 'Respeto' }, { id: 'support', label: 'Apoyo' }, { id: 'pressure', label: 'Presión' }, { id: 'chantage', label: 'Chantaje' }];
    const [round, setRound] = useState(0);
    const [selected, setSelected] = useState('');
    const [checked, setChecked] = useState(false);
    const [score, setScore] = useState(0);
    const card = cards[round];
    const correct = selected === card?.answer;
    function next() {
        if (!checked) {
            setChecked(true);
            if (correct)
                setScore((value) => value + 1);
            return;
        }
        if (round + 1 >= cards.length) {
            onDone();
            return;
        }
        setRound((value) => value + 1);
        setSelected('');
        setChecked(false);
    }
    if (!card)
        return null;
    return <View style={styles.stack}><Text style={styles.bigQuestion}>¿Esto pasa en una amistad sana?</Text><View style={styles.friendCard}><Text style={styles.category}>CONDUCTA {round + 1} DE {cards.length}</Text><Text style={styles.statement}>«{card.text}»</Text></View><View style={styles.chips}>{categories.map((item) => <Pressable key={item.id} onPress={() => { setSelected(item.id); setChecked(false); }} style={[styles.friendChip, selected === item.id && styles.friendChipSelected]}><Text style={styles.chipText}>{item.label}</Text></Pressable>)}</View>{checked ? <View style={[styles.explanation, correct ? styles.goodBox : styles.careBox]}><Text style={styles.explanationTitle}>{correct ? '¡Bien visto!' : `Es ${categories.find((item) => item.id === card.answer)?.label.toLowerCase()}.`}</Text><Text style={styles.copy}>{card.explanation}</Text>{round + 1 === cards.length ? <Text style={styles.score}>{score + (correct ? 1 : 0)} / 10 · La meta es 8</Text> : null}</View> : null}<Button variant="secondary" title={!checked ? 'Comprobar' : round + 1 < cards.length ? 'Siguiente' : 'Terminar'} disabled={!selected} onPress={next}/></View>;
}
function HealthyWeek({ step, onDone }: GameProps) {
    const habits = (step.habits as string[] | undefined) ?? [];
    const [phase, setPhase] = useState<'goal' | 'week'>('goal');
    const [goal, setGoal] = useState('');
    const [stepOne, setStepOne] = useState('');
    const [stepTwo, setStepTwo] = useState('');
    const [selected, setSelected] = useState<string[]>([]);
    const [cells, setCells] = useState<Record<string, string>>({});
    function toggleHabit(habit: string) { setSelected((current) => current.includes(habit) ? current.filter((item) => item !== habit) : current.length < 2 ? [...current, habit] : current); }
    function paintCell(day: number, row: number) { const key = `${day}-${row}`; const colors = ['#AFC4F1', '#F7B91D', '#83C842', '#F47EA7', '#C7BEB1']; setCells((current) => ({ ...current, [key]: colors[(colors.indexOf(current[key]) + 1) % colors.length] })); }
    async function save() { await AsyncStorage.setItem('pio:secondary:wellbeing-plan', JSON.stringify({ goal, steps: [stepOne, stepTwo], habits: selected, schedule: cells, savedAt: new Date().toISOString() })); onDone(); }
    if (phase === 'goal')
        return <View style={styles.stack}><Text style={styles.screenTitle}>Mi mapa de metas</Text><Text style={styles.copy}>Elegí una meta personal para este año y dividila en pasos que sí podás realizar.</Text><LabeledInput label="MI META" value={goal} onChange={setGoal} placeholder="Ej.: mejorar en matemática"/><LabeledInput label="PASO 1" value={stepOne} onChange={setStepOne} placeholder="Una acción pequeña" blue/><LabeledInput label="PASO 2" value={stepTwo} onChange={setStepTwo} placeholder="La siguiente acción" dashed/><View style={styles.privacy}><BrandIcon name="lock" size={17} color={palette.ink}/><Text style={styles.privacyText}>No se califica tu meta personal; se valora que tenga pasos claros.</Text></View><Button variant="secondary" title="Armar mi semana" disabled={[goal, stepOne, stepTwo].some((item) => item.trim().length < 4)} onPress={() => setPhase('week')}/></View>;
    return <View style={styles.stack}><Text style={styles.screenTitle}>Arrastrá bloques a tu semana</Text><Text style={styles.copy}>Tocá las casillas para distribuir sueño, estudio, movimiento, familia y tiempo de pantalla.</Text><View style={styles.weekGrid}><View style={styles.weekDays}>{['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, index) => <Text key={`${day}-${index}`} style={styles.dayLetter}>{day}</Text>)}</View>{[0, 1, 2, 3].map((row) => <View key={row} style={styles.weekDays}>{[0, 1, 2, 3, 4, 5, 6].map((day) => <Pressable key={day} onPress={() => paintCell(day, row)} style={[styles.weekCell, { backgroundColor: cells[`${day}-${row}`] ?? '#F3F0EC' }]}/>)}</View>)}</View><Text style={styles.smallCaps}>ELEGÍ MIS 2 HÁBITOS</Text><View style={styles.chips}>{habits.map((habit) => <Pressable key={habit} onPress={() => toggleHabit(habit)} style={[styles.chip, selected.includes(habit) && styles.chipActive]}><Text style={styles.chipText}>{habit}</Text></Pressable>)}</View><View style={styles.navyNotice}><PioMark pose="calm" size={46}/><Text style={styles.noticeText}>Tu plan puede cambiar. Lo importante es elegir hábitos realistas que puedas sostener.</Text></View><Button variant="secondary" title="Guardar mi plan" disabled={selected.length !== 2} onPress={() => void save()}/></View>;
}
function SupportNetwork({ step, onDone }: GameProps) {
    const people = (step.people as SupportPerson[] | undefined) ?? [];
    const trivia = (step.trivia as TriviaQuestion[] | undefined) ?? [];
    const assessment = (step.selfAssessment as string[] | undefined) ?? [];
    const [phase, setPhase] = useState<'network' | 'trivia' | 'assessment'>('network');
    const [selectedPeople, setSelectedPeople] = useState<string[]>([]);
    const [round, setRound] = useState(0);
    const [answer, setAnswer] = useState('');
    const [checked, setChecked] = useState(false);
    const [score, setScore] = useState(0);
    const [self, setSelf] = useState<Record<number, number>>({});
    const question = trivia[round];
    const correct = answer === question?.answer_id;
    function togglePerson(id: string) { setSelectedPeople((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]); }
    function triviaNext() {
        if (!checked) {
            setChecked(true);
            if (correct)
                setScore((value) => value + 1);
            return;
        }
        if (round + 1 >= trivia.length) {
            setPhase('assessment');
            return;
        }
        setRound((value) => value + 1);
        setAnswer('');
        setChecked(false);
    }
    async function finish() { await AsyncStorage.setItem('pio:secondary:support-network', JSON.stringify({ people: selectedPeople, triviaScore: score, selfAssessment: self, savedAt: new Date().toISOString() })); onDone(); }
    if (phase === 'network')
        return <View style={styles.stack}><Text style={styles.bigQuestion}>¿A quién acudís si necesitás ayuda?</Text><View style={styles.supportCircle}><View style={styles.you}><Text style={styles.youText}>Yo</Text></View>{people.slice(0, 4).map((person, index) => <Pressable key={person.id} onPress={() => togglePerson(person.id)} style={[styles.supportPerson, supportPositions[index], selectedPeople.includes(person.id) && styles.supportSelected]}><Text style={styles.supportInitial}>{person.initials}</Text><Text style={styles.supportName}>{person.name}</Text></Pressable>)}</View><View style={styles.chips}>{people.slice(4).map((person) => <Pressable key={person.id} onPress={() => togglePerson(person.id)} style={[styles.chip, selectedPeople.includes(person.id) && styles.chipActive]}><Text style={styles.chipText}>+ {person.name}</Text></Pressable>)}</View><Text style={styles.centerMeta}>Elegí al menos dos personas cercanas y accesibles.</Text><Button variant="secondary" title="Guardar mi red" disabled={selectedPeople.length < 2} onPress={() => setPhase('trivia')}/></View>;
    if (phase === 'assessment') {
        const ready = Object.keys(self).length === assessment.length;
        return <View style={styles.stack}><Text style={styles.screenTitle}>Cierre del mes</Text><Text style={styles.copy}>No hay respuestas incorrectas. Pensá qué aprendiste y qué querés mantener.</Text>{assessment.map((item, index) => <View key={item} style={styles.assessmentRow}><Text style={styles.assessmentText}>{item}</Text><View style={styles.assessmentButtons}>{['Todavía no', 'En proceso', 'Sí'].map((label, value) => <Pressable key={label} onPress={() => setSelf((current) => ({ ...current, [index]: value }))} style={[styles.assessmentChoice, self[index] === value && styles.assessmentSelected]}><Text style={styles.assessmentChoiceText}>{label}</Text></Pressable>)}</View></View>)}<Button variant="secondary" title="Terminar el mes" disabled={!ready} onPress={() => void finish()}/></View>;
    }
    if (!question)
        return null;
    return <View style={styles.stack}><Text style={styles.counter}>PREGUNTA {round + 1} DE {trivia.length} · REPASO DEL MES</Text><Text style={styles.bigQuestion}>{question.prompt}</Text><View style={styles.stack}>{question.options.map((option, index) => <Pressable key={option.id} onPress={() => { setAnswer(option.id); setChecked(false); }} style={[styles.triviaOption, answer === option.id && styles.triviaSelected]}><View style={styles.choiceLetter}><Text style={styles.choiceLetterText}>{String.fromCharCode(65 + index)}</Text></View><Text style={styles.ruleText}>{option.text}</Text></Pressable>)}</View>{checked ? <View style={[styles.explanation, correct ? styles.goodBox : styles.careBox]}><Text style={styles.explanationTitle}>{correct ? '¡Chiva! Correcto' : 'Revisemos'}</Text><Text style={styles.copy}>{question.explanation}</Text>{round + 1 === trivia.length ? <Text style={styles.score}>{score + (correct ? 1 : 0)} / {trivia.length}</Text> : null}</View> : null}<Button variant="secondary" title={!checked ? 'Comprobar' : round + 1 < trivia.length ? 'Siguiente' : 'Autoevaluación'} disabled={!answer} onPress={triviaNext}/></View>;
}
const supportPositions = [stylesLater({ top: 20, left: 130 }), stylesLater({ top: 105, right: 22 }), stylesLater({ bottom: 25, left: 130 }), stylesLater({ top: 105, left: 22 })];
function stylesLater(value: object) { return value; }
type GameProps = {
    step: LessonContentStep;
    language: AppLanguage;
    onDone: () => void;
};
function ChoiceButton({ label, active, color, onPress }: {
    label: string;
    active: boolean;
    color: string;
    onPress: () => void;
}) { return <Pressable onPress={onPress} style={[styles.choiceButton, { backgroundColor: `${color}24` }, active && { borderColor: color, borderWidth: 2 }]}><Text style={[styles.choiceLabel, { color }]}>{label}</Text></Pressable>; }
function LabeledInput({ label, value, onChange, placeholder, blue, dashed }: {
    label: string;
    value: string;
    onChange: (text: string) => void;
    placeholder?: string;
    blue?: boolean;
    dashed?: boolean;
}) { return <View style={[styles.labeledInput, blue && styles.blueInput, dashed && styles.dashedInput]}><Text style={styles.inputLabel}>{label}</Text><TextInput multiline value={value} onChangeText={onChange} placeholder={placeholder} placeholderTextColor="#8B887F" style={styles.inlineInput}/></View>; }
function PhotoCard({ label, edited, selected, reveal, onPress }: {
    label: string;
    edited: boolean;
    selected: boolean;
    reveal: boolean;
    onPress: () => void;
}) { return <Pressable onPress={onPress} style={[styles.photo, edited && styles.photoEdited, selected && styles.photoSelected]}><Text style={styles.photoLabel}>{label}</Text><View style={[styles.head, edited && { backgroundColor: '#F4BE9D' }]}/><View style={[styles.bodyShape, edited && { backgroundColor: '#55C9E5', transform: [{ scaleX: 1.08 }] }]}/>{edited ? <><View style={[styles.sparkle, { top: 32, right: 16 }]}/><View style={[styles.sparkle, { top: 70, left: 13 }]}/></> : null}{reveal && edited ? <Text style={styles.editedTag}>EDITADA</Text> : null}</Pressable>; }
function TrafficChoice({ color, label, active, onPress }: {
    color: string;
    label: string;
    active: boolean;
    onPress: () => void;
}) { return <Pressable onPress={onPress} style={[styles.trafficChoice, active && { borderColor: color, backgroundColor: `${color}16` }]}><View style={[styles.lightDot, { backgroundColor: color }]}/><Text style={styles.trafficText}>{label}</Text></Pressable>; }
function trafficLabel(value: string) { return value === 'green' ? 'verde: seguro' : value === 'yellow' ? 'amarillo: cuidado' : 'rojo: pedir ayuda'; }
const styles = StyleSheet.create({
    stack: { flex: 1, gap: 13 }, counter: { color: '#6D6A66', fontFamily: 'Nunito_800ExtraBold', fontSize: 10, letterSpacing: 1 }, screenTitle: { color: palette.ink, fontFamily: 'Baloo2_700Bold', fontSize: 27, lineHeight: 31 }, bigQuestion: { color: palette.ink, fontFamily: 'Baloo2_700Bold', fontSize: 22, lineHeight: 27 }, mythShadow: { marginHorizontal: 12, paddingBottom: 10, borderRadius: 22, backgroundColor: '#E5E1DB', transform: [{ rotate: '-2deg' }] }, mythCard: { minHeight: 290, borderRadius: 22, backgroundColor: palette.white, padding: 20, justifyContent: 'space-between', borderWidth: 1, borderColor: '#E5E0D9' }, cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, category: { color: palette.cyan, fontFamily: 'Nunito_800ExtraBold', fontSize: 9, letterSpacing: 1 }, badge: { color: '#C83D35', fontFamily: 'Nunito_800ExtraBold', fontSize: 10, backgroundColor: '#FFE1DD', padding: 8, borderRadius: 13, transform: [{ rotate: '7deg' }] }, factBadge: { color: '#387D27', backgroundColor: '#E6F4DA' }, statement: { color: palette.ink, fontFamily: 'Baloo2_700Bold', fontSize: 24, lineHeight: 30 }, swipeHint: { color: '#8D8983', fontFamily: 'Nunito_400Regular', fontSize: 10 }, twoButtons: { flexDirection: 'row', gap: 10 }, choiceButton: { flex: 1, minHeight: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center' }, choiceLabel: { fontFamily: 'Nunito_800ExtraBold', fontSize: 14 }, explanation: { padding: 14, borderRadius: 18, gap: 5 }, goodBox: { backgroundColor: '#E8F5DC' }, careBox: { backgroundColor: '#FFF0CB' }, skyBox: { backgroundColor: '#E2F4FA' }, explanationKicker: { color: palette.roseDeep, fontFamily: 'Nunito_800ExtraBold', fontSize: 10, letterSpacing: .5 }, explanationTitle: { color: palette.ink, fontFamily: 'Baloo2_700Bold', fontSize: 18 }, copy: { color: '#51586C', fontFamily: 'Nunito_400Regular', fontSize: 13, lineHeight: 19 }, copyStrong: { color: palette.ink, fontFamily: 'Nunito_700Bold', fontSize: 13, lineHeight: 19 }, score: { color: palette.teacherBlue, fontFamily: 'Nunito_800ExtraBold', marginTop: 4 }, beforeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 }, labeledInput: { width: '48.5%', minHeight: 105, borderRadius: 17, backgroundColor: '#FFF4CE', padding: 12, gap: 5 }, blueInput: { backgroundColor: '#E1F3FA' }, dashedInput: { backgroundColor: palette.white, borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#D9D3CB' }, inputLabel: { color: '#7A6857', fontFamily: 'Nunito_800ExtraBold', fontSize: 9, letterSpacing: 1 }, inlineInput: { flex: 1, color: palette.ink, fontFamily: 'Nunito_700Bold', fontSize: 12, textAlignVertical: 'top', padding: 0 }, smallCaps: { color: '#77736F', fontFamily: 'Nunito_800ExtraBold', fontSize: 10, letterSpacing: 1.2 }, chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 }, chip: { borderRadius: 16, backgroundColor: palette.white, borderWidth: 1, borderColor: '#E2DDD7', paddingHorizontal: 11, paddingVertical: 7 }, chipActive: { backgroundColor: '#E4F2FA', borderColor: palette.teacherBlue }, chipText: { color: palette.ink, fontFamily: 'Nunito_700Bold', fontSize: 10 }, privacy: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 10, borderRadius: 15, backgroundColor: '#F4F2EF' }, privacyText: { flex: 1, color: '#6E6B67', fontFamily: 'Nunito_700Bold', fontSize: 10.5, lineHeight: 15 }, navyNotice: { flexDirection: 'row', gap: 10, padding: 14, borderRadius: 17, backgroundColor: palette.ink, alignItems: 'center' }, noticeText: { flex: 1, color: palette.white, fontFamily: 'Nunito_700Bold', fontSize: 11.5, lineHeight: 16 }, questionInput: { minHeight: 175, borderRadius: 17, borderWidth: 1.5, borderColor: '#DDD7CF', backgroundColor: palette.white, padding: 14, textAlignVertical: 'top', color: palette.ink, fontFamily: 'Nunito_700Bold', fontSize: 14 }, inputMeta: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 }, meta: { color: '#87837E', fontFamily: 'Nunito_400Regular', fontSize: 9.5 }, centerMeta: { color: '#8A857F', fontFamily: 'Nunito_400Regular', fontSize: 10, textAlign: 'center' }, sentBox: { alignItems: 'center', gap: 10, paddingTop: 18 }, photoRow: { flexDirection: 'row', gap: 10 }, photo: { flex: 1, height: 245, borderRadius: 18, backgroundColor: '#E8DFD1', overflow: 'hidden', alignItems: 'center', justifyContent: 'flex-end', borderWidth: 3, borderColor: 'transparent' }, photoEdited: { backgroundColor: '#FFCDBA' }, photoSelected: { borderColor: palette.cyan }, photoLabel: { position: 'absolute', top: 9, left: 9, zIndex: 2, color: palette.ink, fontFamily: 'Nunito_800ExtraBold', backgroundColor: palette.white, width: 24, height: 24, borderRadius: 12, textAlign: 'center', lineHeight: 24 }, head: { width: 69, height: 69, borderRadius: 35, backgroundColor: '#C99875', marginBottom: -8 }, bodyShape: { width: 120, height: 126, borderTopLeftRadius: 60, borderTopRightRadius: 60, backgroundColor: '#829DB5' }, sparkle: { position: 'absolute', width: 5, height: 5, borderRadius: 3, backgroundColor: palette.white }, editedTag: { position: 'absolute', bottom: 8, color: palette.white, fontFamily: 'Nunito_800ExtraBold', fontSize: 9, backgroundColor: palette.cyan, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 }, clueChip: { borderRadius: 14, borderWidth: 1.5, borderColor: palette.cyan, paddingHorizontal: 10, paddingVertical: 5 }, clueText: { color: palette.ink, fontFamily: 'Nunito_800ExtraBold', fontSize: 9 }, messageCard: { flexDirection: 'row', gap: 10, padding: 13, borderRadius: 18, backgroundColor: palette.white, borderWidth: 1, borderColor: '#E2DDD7', alignItems: 'flex-start' }, unknown: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#B8B5B0', alignItems: 'center', justifyContent: 'center' }, unknownText: { color: palette.white, fontFamily: 'Nunito_800ExtraBold' }, messageAuthor: { color: palette.ink, fontFamily: 'Nunito_800ExtraBold', fontSize: 11 }, message: { color: palette.ink, fontFamily: 'Nunito_400Regular', fontSize: 12, lineHeight: 17, marginTop: 8 }, trafficChoices: { gap: 8 }, trafficChoice: { minHeight: 52, flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 15, borderWidth: 1.5, borderColor: '#E2DDD7', backgroundColor: palette.white, paddingHorizontal: 12 }, lightDot: { width: 28, height: 28, borderRadius: 14 }, trafficText: { color: palette.ink, fontFamily: 'Nunito_800ExtraBold', fontSize: 12 }, dayCard: { gap: 8, padding: 13, borderRadius: 18, backgroundColor: palette.white, borderWidth: 1, borderColor: '#E2DDD7' }, dayBar: { height: 18, borderRadius: 9, flexDirection: 'row', overflow: 'hidden' }, dayPart: { height: 18 }, dayLegend: { color: '#75716C', fontFamily: 'Nunito_700Bold', fontSize: 8 }, ruleList: { gap: 8 }, rule: { minHeight: 58, borderRadius: 15, borderWidth: 2, borderColor: palette.ink, backgroundColor: palette.white, flexDirection: 'row', alignItems: 'center', gap: 10, padding: 9 }, ruleNumber: { width: 32, height: 32, borderRadius: 16, backgroundColor: palette.ink, alignItems: 'center', justifyContent: 'center' }, ruleNumberText: { color: palette.white, fontFamily: 'Nunito_800ExtraBold' }, ruleText: { flex: 1, color: palette.ink, fontFamily: 'Nunito_700Bold', fontSize: 11 }, customRule: { minHeight: 54, borderRadius: 15, borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#D7D1C8', backgroundColor: palette.white, paddingHorizontal: 14, color: palette.ink, fontFamily: 'Nunito_700Bold', fontSize: 12 },
    chatHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 }, chatAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: palette.orange, alignItems: 'center', justifyContent: 'center' }, chatInitial: { color: palette.white, fontFamily: 'Nunito_800ExtraBold', fontSize: 9 }, chatBubble: { alignSelf: 'flex-start', maxWidth: '88%', borderRadius: 18, borderTopLeftRadius: 5, backgroundColor: palette.white, borderWidth: 1, borderColor: '#E3DDD6', padding: 13 }, styleOption: { minHeight: 56, borderRadius: 15, backgroundColor: palette.white, borderWidth: 1.5, borderColor: '#E3DDD6', padding: 10, flexDirection: 'row', alignItems: 'center', gap: 7 }, styleOptionSelected: { borderColor: palette.teacherBlue, backgroundColor: '#F1F4FF' }, styleOptionText: { flex: 1, color: palette.ink, fontFamily: 'Nunito_700Bold', fontSize: 11 }, styleTag: { color: palette.white, fontFamily: 'Nunito_800ExtraBold', fontSize: 8, paddingHorizontal: 7, paddingVertical: 4, borderRadius: 9 }, passiveTag: { backgroundColor: '#8D8A84' }, aggressiveTag: { backgroundColor: '#E63B32' }, assertiveTag: { backgroundColor: '#69A83D' }, partyScene: { height: 220, borderRadius: 21, backgroundColor: '#3E306F', overflow: 'hidden', justifyContent: 'flex-end', paddingBottom: 23 }, flags: { position: 'absolute', top: 7, left: 0, right: 0 }, flagsText: { color: palette.yellow, letterSpacing: 8, textAlign: 'center' }, people: { flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', gap: 10 }, person: { width: 60, height: 115, borderTopLeftRadius: 30, borderTopRightRadius: 30 }, partyBubble: { position: 'absolute', right: 10, top: 43, color: palette.ink, fontFamily: 'Nunito_800ExtraBold', fontSize: 9, backgroundColor: palette.white, padding: 8, borderRadius: 14 }, adventureChoice: { minHeight: 58, borderRadius: 16, borderWidth: 1.5, borderColor: '#E2DDD7', backgroundColor: palette.white, flexDirection: 'row', alignItems: 'center', gap: 9, padding: 9 }, adventureSelected: { borderColor: palette.ink, borderWidth: 2.5 }, choiceLetter: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#EDF0F7', alignItems: 'center', justifyContent: 'center' }, choiceLetterText: { color: palette.ink, fontFamily: 'Nunito_800ExtraBold', fontSize: 10 }, friendCard: { minHeight: 230, borderRadius: 20, backgroundColor: palette.white, padding: 22, justifyContent: 'center', gap: 17, transform: [{ rotate: '-2deg' }], borderWidth: 1, borderColor: '#E3DDD6' }, friendChip: { minWidth: '22%', borderRadius: 18, borderWidth: 1.5, borderColor: '#E2DDD7', backgroundColor: palette.white, paddingHorizontal: 10, paddingVertical: 8, alignItems: 'center' }, friendChipSelected: { borderColor: palette.roseDeep, backgroundColor: palette.roseSoft }, weekGrid: { padding: 10, borderRadius: 18, backgroundColor: palette.white, borderWidth: 1, borderColor: '#E3DDD6', gap: 5 }, weekDays: { flexDirection: 'row', gap: 5 }, dayLetter: { flex: 1, textAlign: 'center', color: palette.ink, fontFamily: 'Nunito_800ExtraBold', fontSize: 9 }, weekCell: { flex: 1, aspectRatio: 1.1, borderRadius: 5, borderWidth: 1, borderColor: '#E7E2DC' }, supportCircle: { height: 310, borderRadius: 155, borderWidth: 2, borderStyle: 'dashed', borderColor: '#C9BDAE', position: 'relative', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFEFA' }, you: { width: 74, height: 74, borderRadius: 37, backgroundColor: palette.ink, alignItems: 'center', justifyContent: 'center' }, youText: { color: palette.white, fontFamily: 'Baloo2_700Bold', fontSize: 22 }, supportPerson: { position: 'absolute', width: 72, minHeight: 72, alignItems: 'center', gap: 3 }, supportSelected: { transform: [{ scale: 1.12 }] }, supportInitial: { width: 42, height: 42, borderRadius: 21, backgroundColor: palette.rose, color: palette.white, fontFamily: 'Nunito_800ExtraBold', textAlign: 'center', lineHeight: 42, borderWidth: 3, borderColor: palette.white }, supportName: { color: palette.ink, fontFamily: 'Nunito_700Bold', fontSize: 8, textAlign: 'center' }, triviaOption: { minHeight: 58, borderRadius: 16, borderWidth: 1.5, borderColor: '#E2DDD7', backgroundColor: palette.white, flexDirection: 'row', alignItems: 'center', gap: 10, padding: 10 }, triviaSelected: { borderColor: '#67B748', backgroundColor: '#EFF8E9' }, assessmentRow: { gap: 8, padding: 12, borderRadius: 17, backgroundColor: palette.white, borderWidth: 1, borderColor: '#E2DDD7' }, assessmentText: { color: palette.ink, fontFamily: 'Nunito_800ExtraBold', fontSize: 12 }, assessmentButtons: { flexDirection: 'row', gap: 6 }, assessmentChoice: { flex: 1, minHeight: 38, borderRadius: 12, borderWidth: 1, borderColor: '#E2DDD7', alignItems: 'center', justifyContent: 'center', padding: 4 }, assessmentSelected: { borderColor: palette.teacherBlue, backgroundColor: '#E9EEFF' }, assessmentChoiceText: { color: palette.ink, fontFamily: 'Nunito_700Bold', fontSize: 8, textAlign: 'center' },
    pressureHero: { minHeight: 205, borderRadius: 24, padding: 18, overflow: 'hidden', backgroundColor: '#233D83', justifyContent: 'center', gap: 8 }, pressureHeroKicker: { color: '#9FE6F7', fontFamily: 'Nunito_800ExtraBold', fontSize: 9, letterSpacing: 1.4 }, pressureHeroTitle: { maxWidth: '78%', color: palette.white, fontFamily: 'Baloo2_700Bold', fontSize: 25, lineHeight: 28 }, pressureHeroBody: { maxWidth: '72%', color: '#D5DDF2', fontFamily: 'Nunito_400Regular', fontSize: 12, lineHeight: 18 }, heroMountains: { position: 'absolute', right: -8, bottom: -26, width: 150, height: 110 }, heroMountainA: { position: 'absolute', width: 92, height: 92, bottom: 0, left: 0, backgroundColor: '#2C4A91', transform: [{ rotate: '45deg' }] }, heroMountainB: { position: 'absolute', width: 84, height: 84, bottom: -5, right: -5, backgroundColor: '#294585', transform: [{ rotate: '45deg' }] }, pressureKicker: { color: '#20B6E7', fontFamily: 'Nunito_800ExtraBold', fontSize: 10, letterSpacing: 1.4 }, goalList: { gap: 10 }, goalRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 9 }, cyanDot: { width: 9, height: 9, marginTop: 5, borderRadius: 5, backgroundColor: palette.cyan }, goalText: { flex: 1, color: palette.ink, fontFamily: 'Nunito_700Bold', fontSize: 12, lineHeight: 17 }, chapterStrip: { flexDirection: 'row', gap: 7 }, chapterTile: { flex: 1, minHeight: 65, borderRadius: 14, borderWidth: 1, borderColor: '#E4DED6', backgroundColor: palette.white, padding: 9, justifyContent: 'center', gap: 2 }, chapterTileActive: { backgroundColor: palette.ink, borderColor: palette.ink }, chapterNumber: { color: palette.cyan, fontFamily: 'Baloo2_700Bold', fontSize: 18 }, chapterName: { color: palette.ink, fontFamily: 'Nunito_800ExtraBold', fontSize: 8 }, chapterTextActive: { color: palette.white }, pollRow: { flexDirection: 'row', gap: 8 }, pollChoice: { flex: 1, minHeight: 52, borderRadius: 26, borderWidth: 1.5, borderColor: '#E1DBD4', backgroundColor: palette.white, alignItems: 'center', justifyContent: 'center' }, pollChoiceActive: { backgroundColor: palette.ink, borderColor: palette.ink }, pollChoiceText: { color: palette.ink, fontFamily: 'Nunito_800ExtraBold', fontSize: 12 }, pollChoiceTextActive: { color: palette.white }, pollResults: { borderRadius: 20, padding: 14, gap: 10, backgroundColor: palette.white, borderWidth: 1, borderColor: '#E3DDD6' }, resultHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, resultItem: { gap: 4 }, resultLabel: { flexDirection: 'row', justifyContent: 'space-between' }, resultTrack: { height: 10, borderRadius: 5, overflow: 'hidden', backgroundColor: '#E8E3DC' }, resultFill: { height: '100%', borderRadius: 5 }, yellowNote: { borderRadius: 18, padding: 14, borderLeftWidth: 5, borderLeftColor: '#FFB718', backgroundColor: palette.white, gap: 3 }, definitionCard: { borderRadius: 20, padding: 18, backgroundColor: '#29458C' }, definitionText: { color: palette.white, fontFamily: 'Nunito_800ExtraBold', fontSize: 16, lineHeight: 23 }, infoLine: { minHeight: 82, flexDirection: 'row', alignItems: 'center', gap: 11, padding: 13, borderRadius: 18, borderLeftWidth: 5, backgroundColor: palette.white }, infoIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#E4F4FA', alignItems: 'center', justifyContent: 'center' }, infoTitle: { color: palette.ink, fontFamily: 'Nunito_800ExtraBold', fontSize: 13, lineHeight: 17 }, dataCard: { flexDirection: 'row', gap: 13, borderRadius: 20, padding: 16, backgroundColor: palette.white, alignItems: 'center' }, phoneGlyph: { width: 60, height: 90, borderRadius: 16, borderWidth: 2, borderColor: palette.ink, alignItems: 'center', justifyContent: 'center' }, reasonCard: { padding: 15, borderRadius: 18, borderLeftWidth: 5, borderLeftColor: palette.roseDeep, backgroundColor: palette.white, gap: 4 }, pioNote: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 18, backgroundColor: '#DFF3FA' }, responseStyle: { minHeight: 92, padding: 14, borderRadius: 18, borderLeftWidth: 5, backgroundColor: palette.white, gap: 4 }, responseHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, responseName: { fontFamily: 'Nunito_800ExtraBold', fontSize: 15 }, styleExample: { color: '#646B80', fontFamily: 'Nunito_800ExtraBold', fontSize: 12 }, chapterComplete: { flex: 1, marginHorizontal: -16, marginBottom: -18, padding: 22, backgroundColor: '#1E316E', justifyContent: 'center', gap: 13 }, completeNumber: { color: '#22B8E8', fontFamily: 'Baloo2_700Bold', fontSize: 86, lineHeight: 94 }, completeCheck: { position: 'absolute', top: 105, left: 135, width: 56, height: 56, borderRadius: 28, backgroundColor: '#82C43D', alignItems: 'center', justifyContent: 'center' }, completeCheckText: { color: palette.white, fontFamily: 'Nunito_800ExtraBold', fontSize: 28 }, completeKicker: { color: '#9EE4F5', fontFamily: 'Nunito_800ExtraBold', fontSize: 10, letterSpacing: 1.2 }, completeTitle: { color: palette.white, fontFamily: 'Baloo2_700Bold', fontSize: 29, lineHeight: 33 }, completeTrack: { height: 8, borderRadius: 4, overflow: 'hidden', backgroundColor: '#43558B' }, completeFill: { width: '25%', height: '100%', borderRadius: 4, backgroundColor: '#82C43D' }, completeNext: { color: '#D5DDF2', fontFamily: 'Nunito_400Regular', lineHeight: 20 }, formulaCard: { padding: 15, borderRadius: 20, backgroundColor: palette.white, borderWidth: 1, borderColor: '#E4DED7', gap: 14 }, formulaRow: { flexDirection: 'row', gap: 11, alignItems: 'flex-start' }, formulaNumber: { width: 32, height: 32, borderRadius: 16, backgroundColor: palette.ink, alignItems: 'center', justifyContent: 'center' }, formulaNumberText: { color: palette.white, fontFamily: 'Nunito_800ExtraBold', fontSize: 12 }, twoMiniCards: { flexDirection: 'row', gap: 10 }, miniTip: { flex: 1, minHeight: 76, padding: 12, borderRadius: 17, borderLeftWidth: 5, backgroundColor: palette.white }, groupChat: { padding: 14, borderRadius: 20, backgroundColor: palette.white, borderWidth: 1, borderColor: '#E3DDD6', gap: 10 }, groupTitle: { color: palette.ink, fontFamily: 'Nunito_800ExtraBold', fontSize: 12 }, incomingBubble: { alignSelf: 'flex-start', maxWidth: '88%', padding: 12, borderRadius: 16, borderTopLeftRadius: 5, backgroundColor: '#F2F0ED' }, outgoingBubble: { alignSelf: 'flex-end', maxWidth: '87%', padding: 12, borderRadius: 16, borderTopRightRadius: 5, backgroundColor: palette.ink }, outgoingText: { color: palette.white, fontFamily: 'Nunito_400Regular', fontSize: 12, lineHeight: 18 }, annotatedMessage: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 8 }, annotation: { width: 24, height: 24, borderRadius: 12, backgroundColor: palette.cyan, alignItems: 'center', justifyContent: 'center' }, annotationText: { color: palette.white, fontFamily: 'Nunito_800ExtraBold', fontSize: 10 }, formulaChoice: { minHeight: 56, padding: 10, borderRadius: 16, borderWidth: 1.5, borderColor: '#E2DDD7', backgroundColor: palette.white, flexDirection: 'row', alignItems: 'center', gap: 10 }, formulaChoiceSelected: { borderColor: '#FFB718' }, formulaChoiceCorrect: { backgroundColor: '#FFF5D5', borderColor: '#FFB718' }, choiceStatus: { marginLeft: 'auto', color: '#4E9A2C', fontFamily: 'Nunito_800ExtraBold', fontSize: 18 }, reviewCard: { padding: 14, borderRadius: 18, backgroundColor: palette.white, borderWidth: 1, borderColor: '#E3DDD6', gap: 9 }, checkRow: { flexDirection: 'row', alignItems: 'center', gap: 8 }, checkDot: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#D8D4CE', alignItems: 'center', justifyContent: 'center' }, checkDotOn: { backgroundColor: '#83C33E' }, checkDotText: { color: palette.white, fontFamily: 'Nunito_800ExtraBold', fontSize: 12 }, planGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 }, planChoice: { width: '48.5%', minHeight: 55, borderRadius: 17, borderWidth: 1.5, borderColor: '#E1DBD4', backgroundColor: palette.white, flexDirection: 'row', alignItems: 'center', gap: 7, padding: 10 }, planChoiceActive: { backgroundColor: palette.ink, borderColor: palette.ink }, planChoiceText: { flex: 1, color: palette.ink, fontFamily: 'Nunito_800ExtraBold', fontSize: 10 }, planInput: { minHeight: 44, color: palette.ink, fontFamily: 'Nunito_800ExtraBold', fontSize: 14, padding: 0 }, homeIllustration: { height: 155, borderRadius: 22, overflow: 'hidden', backgroundColor: '#FFE9F1', justifyContent: 'center', alignItems: 'center' }, hammockPost: { position: 'absolute', left: 28, bottom: 29, width: 9, height: 74, borderRadius: 5, backgroundColor: '#B7784C' }, hammockLine: { position: 'absolute', bottom: 56, width: 180, height: 50, borderBottomWidth: 7, borderBottomColor: palette.cyan, borderRadius: 90 }, homeEmoji: { fontSize: 58 }, summaryHero: { minHeight: 170, borderRadius: 23, padding: 18, backgroundColor: '#29458C', justifyContent: 'center', gap: 10 }, summaryBadge: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 16, padding: 11, backgroundColor: '#20366F' }, summaryRow: { flexDirection: 'row', alignItems: 'center', gap: 11 }, summaryNumber: { width: 36, height: 36, borderRadius: 18, backgroundColor: palette.cyan, alignItems: 'center', justifyContent: 'center' }, summaryNumberText: { color: palette.white, fontFamily: 'Nunito_800ExtraBold', fontSize: 14 },
});
