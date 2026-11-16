import { supabase } from '@/lib/supabase';
import type { AppLanguage } from '@/lib/types';
import { toMiskituDraft } from '@/lib/miskitu-draft';
export type LessonPage = {
    text?: string;
    image?: string;
    audio?: string;
    pio_pose?: string;
};
export type LessonQuestion = {
    id: string;
    prompt: string;
    options: {
        id: string;
        text: string;
    }[];
    answer_id?: string;
    explanation?: string;
};
export type LessonContentStep = {
    position: number;
    part?: number;
    kind: string;
    title?: string;
    body?: string;
    instructions?: string;
    situation?: string;
    challenge?: string;
    prompt?: string;
    privacy_note?: string;
    key_message?: string;
    pio?: {
        pose?: string;
        text?: string;
        audio?: string;
    };
    pages?: LessonPage[];
    items?: {
        emotion?: string;
        name?: string;
        text?: string;
        example?: string;
        body_hint?: string;
    }[];
    play?: {
        situations?: {
            id: string;
            text: string;
            answer?: string;
        }[];
        rounds?: number;
    };
    template?: 'catch' | 'drag_to_zones' | 'sequence' | 'guided_breathing' | 'classify' | string;
    learn?: {
        this_is?: {
            prompt?: string;
            emotions?: string[];
        };
        show_me?: {
            prompt?: string;
        };
        which_is?: {
            prompt?: string;
        };
    };
    feedback?: {
        correct?: string | string[];
        error_hint?: string;
        after_each?: string;
    };
    zones?: {
        id: string;
        label: string;
    }[];
    prompts?: {
        emotion: string;
        text: string;
    }[];
    no_wrong_answer?: boolean;
    questions?: LessonQuestion[];
    front?: {
        title?: string;
        text?: string;
        image?: string;
    };
    back?: {
        text?: string;
    };
    breathing?: {
        rounds?: number;
        inhale_s?: number;
        hold_s?: number;
        exhale_s?: number;
    };
    closing?: string;
    [key: string]: unknown;
};
export type LessonContent = {
    lesson_slug: string;
    title: string;
    parts: {
        part: number;
        title: string;
        done_message?: string;
    }[];
    steps: LessonContentStep[];
};
export type VersionedLessonContent = {
    version: number;
    schema_version: string;
    language: AppLanguage;
    payload: LessonContent;
};
export async function getLessonContent(lessonSlug: string, language: AppLanguage): Promise<VersionedLessonContent> {
    const preferred = await fetchVersion(lessonSlug, language).catch(() => null);
    if (preferred)
        return preferred;
    if (language !== 'es') {
        const spanish = await fetchVersion(lessonSlug, 'es').catch(() => null);
        if (spanish)
            return language === 'miq' ? { ...spanish, language, payload: toMiskituDraft(spanish.payload) } : spanish;
    }
    const local = localLessonContent(lessonSlug, language);
    if (local)
        return language === 'miq' ? { ...local, payload: toMiskituDraft(local.payload) } : local;
    throw new Error('Todavía no hay contenido para esta lección.');
}
async function fetchVersion(lessonSlug: string, language: AppLanguage): Promise<VersionedLessonContent | null> {
    const { data, error } = await supabase.from('lesson_contents')
        .select('version, schema_version, language, payload, lessons!inner(slug)')
        .eq('lessons.slug', lessonSlug)
        .eq('language', language)
        .order('version', { ascending: false })
        .limit(1)
        .maybeSingle();
    if (error)
        throw error;
    if (!data)
        return null;
    if (data.schema_version !== '1')
        throw new Error(`Versión de contenido no compatible: ${data.schema_version}`);
    return { version: data.version, schema_version: data.schema_version, language: data.language as AppLanguage, payload: data.payload as unknown as LessonContent };
}
function localLessonContent(lessonSlug: string, language: AppLanguage): VersionedLessonContent | null {
    const en = language === 'en';
    if (lessonSlug === 's1-w1')
        return secondaryWeekOne(lessonSlug, language);
    if (lessonSlug === 's1-w2')
        return secondaryWeekTwo(lessonSlug, language);
    if (lessonSlug === 's1-w3')
        return secondaryWeekThree(lessonSlug, language);
    if (lessonSlug === 's1-w4')
        return secondaryWeekFour(lessonSlug, language);
    if (lessonSlug === 'p3-w1')
        return {
            version: 1,
            schema_version: '1',
            language,
            payload: {
                lesson_slug: lessonSlug,
                title: en ? 'I recognize what I feel' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Reconozco lo que siento') : 'Reconozco lo que siento') : (language as AppLanguage) === "miq" ? toMiskituDraft('Reconozco lo que siento') : 'Reconozco lo que siento',
                parts: [
                    { part: 1, title: en ? 'Meet the drops' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Conocé las gotas') : 'Conocé las gotas') : (language as AppLanguage) === "miq" ? toMiskituDraft('Conocé las gotas') : 'Conocé las gotas' },
                    { part: 2, title: en ? 'Catch a drop' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Atrapa la gota') : 'Atrapa la gota') : (language as AppLanguage) === "miq" ? toMiskituDraft('Atrapa la gota') : 'Atrapa la gota' },
                    { part: 3, title: en ? 'Where do I feel my emotions?' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('¿Dónde siento mis emociones?') : '¿Dónde siento mis emociones?') : (language as AppLanguage) === "miq" ? toMiskituDraft('¿Dónde siento mis emociones?') : '¿Dónde siento mis emociones?' },
                ],
                steps: [
                    {
                        position: 1, part: 1, kind: 'concept', title: en ? 'Meet the drops' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Conocé las gotas') : 'Conocé las gotas') : (language as AppLanguage) === "miq" ? toMiskituDraft('Conocé las gotas') : 'Conocé las gotas',
                        body: en ? 'All emotions are normal and give us useful clues.' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Todas las emociones son normales y nos dan pistas importantes.') : 'Todas las emociones son normales y nos dan pistas importantes.') : (language as AppLanguage) === "miq" ? toMiskituDraft('Todas las emociones son normales y nos dan pistas importantes.') : 'Todas las emociones son normales y nos dan pistas importantes.',
                        items: [
                            { emotion: 'joy', name: en ? 'Joy' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Alegría') : 'Alegría') : (language as AppLanguage) === "miq" ? toMiskituDraft('Alegría') : 'Alegría', example: en ? 'You feel it when something you really like happens.' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Se siente cuando pasa algo que te gusta mucho, como jugar con tus amigos.') : 'Se siente cuando pasa algo que te gusta mucho, como jugar con tus amigos.') : (language as AppLanguage) === "miq" ? toMiskituDraft('Se siente cuando pasa algo que te gusta mucho, como jugar con tus amigos.') : 'Se siente cuando pasa algo que te gusta mucho, como jugar con tus amigos.' },
                            { emotion: 'sadness', name: en ? 'Sadness' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Tristeza') : 'Tristeza') : (language as AppLanguage) === "miq" ? toMiskituDraft('Tristeza') : 'Tristeza', example: en ? 'You may feel it when you lose something important.' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Puede aparecer cuando perdés algo importante o extrañás a alguien.') : 'Puede aparecer cuando perdés algo importante o extrañás a alguien.') : (language as AppLanguage) === "miq" ? toMiskituDraft('Puede aparecer cuando perdés algo importante o extrañás a alguien.') : 'Puede aparecer cuando perdés algo importante o extrañás a alguien.' },
                            { emotion: 'anger', name: en ? 'Anger' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Enojo') : 'Enojo') : (language as AppLanguage) === "miq" ? toMiskituDraft('Enojo') : 'Enojo', example: en ? 'It appears when something bothers you or feels unfair.' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Aparece cuando algo te molesta o te parece injusto.') : 'Aparece cuando algo te molesta o te parece injusto.') : (language as AppLanguage) === "miq" ? toMiskituDraft('Aparece cuando algo te molesta o te parece injusto.') : 'Aparece cuando algo te molesta o te parece injusto.' },
                            { emotion: 'fear', name: en ? 'Fear' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Miedo') : 'Miedo') : (language as AppLanguage) === "miq" ? toMiskituDraft('Miedo') : 'Miedo', example: en ? 'It warns you when something seems dangerous.' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Te avisa cuando algo parece peligroso o no sabés qué va a pasar.') : 'Te avisa cuando algo parece peligroso o no sabés qué va a pasar.') : (language as AppLanguage) === "miq" ? toMiskituDraft('Te avisa cuando algo parece peligroso o no sabés qué va a pasar.') : 'Te avisa cuando algo parece peligroso o no sabés qué va a pasar.' },
                        ],
                    },
                    {
                        position: 6, part: 2, kind: 'minigame', template: 'catch', title: en ? 'Catch a drop' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Atrapa la gota') : 'Atrapa la gota') : (language as AppLanguage) === "miq" ? toMiskituDraft('Atrapa la gota') : 'Atrapa la gota',
                        instructions: en ? 'Listen to the situation and choose the matching drop.' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Escuchá la situación y tocá la gota que corresponde.') : 'Escuchá la situación y tocá la gota que corresponde.') : (language as AppLanguage) === "miq" ? toMiskituDraft('Escuchá la situación y tocá la gota que corresponde.') : 'Escuchá la situación y tocá la gota que corresponde.',
                        play: { rounds: 4, situations: [
                                { id: 'drop-1', text: en ? 'You got an ice cream. Which drop do you feel?' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Te regalaron un helado. ¿Qué gota sentís?') : 'Te regalaron un helado. ¿Qué gota sentís?') : (language as AppLanguage) === "miq" ? toMiskituDraft('Te regalaron un helado. ¿Qué gota sentís?') : 'Te regalaron un helado. ¿Qué gota sentís?', answer: 'joy' },
                                { id: 'drop-2', text: en ? 'Your puppy got lost. Which drop do you feel?' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Se perdió tu perrito. ¿Qué gota sentís?') : 'Se perdió tu perrito. ¿Qué gota sentís?') : (language as AppLanguage) === "miq" ? toMiskituDraft('Se perdió tu perrito. ¿Qué gota sentís?') : 'Se perdió tu perrito. ¿Qué gota sentís?', answer: 'sadness' },
                                { id: 'drop-3', text: en ? 'Someone tore your drawing without asking. Which drop do you feel?' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Alguien rompió tu dibujo sin preguntar. ¿Qué gota sentís?') : 'Alguien rompió tu dibujo sin preguntar. ¿Qué gota sentís?') : (language as AppLanguage) === "miq" ? toMiskituDraft('Alguien rompió tu dibujo sin preguntar. ¿Qué gota sentís?') : 'Alguien rompió tu dibujo sin preguntar. ¿Qué gota sentís?', answer: 'anger' },
                                { id: 'drop-4', text: en ? 'You heard a loud noise at night. Which drop do you feel?' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Escuchaste un ruido fuerte de noche. ¿Qué gota sentís?') : 'Escuchaste un ruido fuerte de noche. ¿Qué gota sentís?') : (language as AppLanguage) === "miq" ? toMiskituDraft('Escuchaste un ruido fuerte de noche. ¿Qué gota sentís?') : 'Escuchaste un ruido fuerte de noche. ¿Qué gota sentís?', answer: 'fear' },
                            ] },
                        feedback: { error_hint: en ? 'Look at Pío’s face and try again.' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Mirá la carita de Pío y volvé a intentar.') : 'Mirá la carita de Pío y volvé a intentar.') : (language as AppLanguage) === "miq" ? toMiskituDraft('Mirá la carita de Pío y volvé a intentar.') : 'Mirá la carita de Pío y volvé a intentar.' },
                    },
                    {
                        position: 7, part: 3, kind: 'minigame', template: 'drag_to_zones', title: en ? 'Where do I feel my emotions?' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('¿Dónde siento mis emociones?') : '¿Dónde siento mis emociones?') : (language as AppLanguage) === "miq" ? toMiskituDraft('¿Dónde siento mis emociones?') : '¿Dónde siento mis emociones?',
                        no_wrong_answer: true,
                        zones: [{ id: 'head', label: en ? 'Head' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Cabeza') : 'Cabeza') : (language as AppLanguage) === "miq" ? toMiskituDraft('Cabeza') : 'Cabeza' }, { id: 'hands', label: en ? 'Hands' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Manos') : 'Manos') : (language as AppLanguage) === "miq" ? toMiskituDraft('Manos') : 'Manos' }, { id: 'chest', label: en ? 'Chest' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Pecho') : 'Pecho') : (language as AppLanguage) === "miq" ? toMiskituDraft('Pecho') : 'Pecho' }, { id: 'belly', label: en ? 'Belly' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Panza') : 'Panza') : (language as AppLanguage) === "miq" ? toMiskituDraft('Panza') : 'Panza' }],
                        prompts: [
                            { emotion: 'anger', text: en ? 'Where do you feel anger? Tap a body area.' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('¿Dónde sentís el enojo? Tocá una parte del cuerpo.') : '¿Dónde sentís el enojo? Tocá una parte del cuerpo.') : (language as AppLanguage) === "miq" ? toMiskituDraft('¿Dónde sentís el enojo? Tocá una parte del cuerpo.') : '¿Dónde sentís el enojo? Tocá una parte del cuerpo.' },
                            { emotion: 'fear', text: en ? 'Where do you feel fear? Tap a body area.' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('¿Dónde sentís el miedo? Tocá una parte del cuerpo.') : '¿Dónde sentís el miedo? Tocá una parte del cuerpo.') : (language as AppLanguage) === "miq" ? toMiskituDraft('¿Dónde sentís el miedo? Tocá una parte del cuerpo.') : '¿Dónde sentís el miedo? Tocá una parte del cuerpo.' },
                            { emotion: 'joy', text: en ? 'Where do you feel joy? Tap a body area.' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('¿Dónde sentís la alegría? Tocá una parte del cuerpo.') : '¿Dónde sentís la alegría? Tocá una parte del cuerpo.') : (language as AppLanguage) === "miq" ? toMiskituDraft('¿Dónde sentís la alegría? Tocá una parte del cuerpo.') : '¿Dónde sentís la alegría? Tocá una parte del cuerpo.' },
                            { emotion: 'sadness', text: en ? 'Where do you feel sadness? Tap a body area.' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('¿Dónde sentís la tristeza? Tocá una parte del cuerpo.') : '¿Dónde sentís la tristeza? Tocá una parte del cuerpo.') : (language as AppLanguage) === "miq" ? toMiskituDraft('¿Dónde sentís la tristeza? Tocá una parte del cuerpo.') : '¿Dónde sentís la tristeza? Tocá una parte del cuerpo.' },
                        ],
                    },
                    {
                        position: 8, part: 3, kind: 'home', title: en ? 'Share it at home' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Compartilo en casa') : 'Compartilo en casa') : (language as AppLanguage) === "miq" ? toMiskituDraft('Compartilo en casa') : 'Compartilo en casa',
                        body: en ? 'Play “Catch a drop” again with your family. Ask: “What feeling visited you today, and why?”' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Repetí «Atrapa la gota» con tu familia y preguntá: «¿Qué gota te visitó hoy y por qué?»') : 'Repetí «Atrapa la gota» con tu familia y preguntá: «¿Qué gota te visitó hoy y por qué?»') : (language as AppLanguage) === "miq" ? toMiskituDraft('Repetí «Atrapa la gota» con tu familia y preguntá: «¿Qué gota te visitó hoy y por qué?»') : 'Repetí «Atrapa la gota» con tu familia y preguntá: «¿Qué gota te visitó hoy y por qué?»',
                    },
                ],
            },
        };
    if (lessonSlug === 'p3-w3')
        return {
            version: 1,
            schema_version: '1',
            language,
            payload: {
                lesson_slug: lessonSlug,
                title: en ? 'Kind treatment for everyone' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Buen trato para todos') : 'Buen trato para todos') : (language as AppLanguage) === "miq" ? toMiskituDraft('Buen trato para todos') : 'Buen trato para todos',
                parts: [
                    { part: 1, title: en ? 'Kind or unkind?' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('¿Buen trato o maltrato?') : '¿Buen trato o maltrato?') : (language as AppLanguage) === "miq" ? toMiskituDraft('¿Buen trato o maltrato?') : '¿Buen trato o maltrato?' },
                    { part: 2, title: en ? 'In someone else’s shoes' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('En los zapatos de otro') : 'En los zapatos de otro') : (language as AppLanguage) === "miq" ? toMiskituDraft('En los zapatos de otro') : 'En los zapatos de otro' },
                    { part: 3, title: en ? 'Everyone’s treasure' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('El tesoro de todos') : 'El tesoro de todos') : (language as AppLanguage) === "miq" ? toMiskituDraft('El tesoro de todos') : 'El tesoro de todos' },
                ],
                steps: [
                    {
                        position: 1, part: 1, kind: 'minigame', template: 'kindness_cards', title: en ? 'Kind or unkind?' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('¿Buen trato o maltrato?') : '¿Buen trato o maltrato?') : (language as AppLanguage) === "miq" ? toMiskituDraft('¿Buen trato o maltrato?') : '¿Buen trato o maltrato?',
                        instructions: en ? 'Look at each scene and decide whether everyone is treated with care.' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Mirá cada escena y decidí si todas las personas reciben cuidado y respeto.') : 'Mirá cada escena y decidí si todas las personas reciben cuidado y respeto.') : (language as AppLanguage) === "miq" ? toMiskituDraft('Mirá cada escena y decidí si todas las personas reciben cuidado y respeto.') : 'Mirá cada escena y decidí si todas las personas reciben cuidado y respeto.',
                        play: { rounds: 6, situations: [
                                { id: 'kind-1', text: en ? 'They invite a classmate to join the game.' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Invitan a una compañera a jugar.') : 'Invitan a una compañera a jugar.') : (language as AppLanguage) === "miq" ? toMiskituDraft('Invitan a una compañera a jugar.') : 'Invitan a una compañera a jugar.', answer: 'kind' },
                                { id: 'kind-2', text: en ? 'They laugh because someone made a mistake.' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Se ríen porque alguien se equivocó.') : 'Se ríen porque alguien se equivocó.') : (language as AppLanguage) === "miq" ? toMiskituDraft('Se ríen porque alguien se equivocó.') : 'Se ríen porque alguien se equivocó.', answer: 'unkind' },
                                { id: 'kind-3', text: en ? 'They share the ball and take turns.' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Comparten la pelota y respetan los turnos.') : 'Comparten la pelota y respetan los turnos.') : (language as AppLanguage) === "miq" ? toMiskituDraft('Comparten la pelota y respetan los turnos.') : 'Comparten la pelota y respetan los turnos.', answer: 'kind' },
                                { id: 'kind-4', text: en ? 'They hide a classmate’s backpack.' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Esconden la mochila de un compañero.') : 'Esconden la mochila de un compañero.') : (language as AppLanguage) === "miq" ? toMiskituDraft('Esconden la mochila de un compañero.') : 'Esconden la mochila de un compañero.', answer: 'unkind' },
                                { id: 'kind-5', text: en ? 'They help someone who fell down.' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Ayudan a una niña que se cayó.') : 'Ayudan a una niña que se cayó.') : (language as AppLanguage) === "miq" ? toMiskituDraft('Ayudan a una niña que se cayó.') : 'Ayudan a una niña que se cayó.', answer: 'kind' },
                                { id: 'kind-6', text: en ? 'They leave someone out on purpose.' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Dejan a alguien fuera a propósito.') : 'Dejan a alguien fuera a propósito.') : (language as AppLanguage) === "miq" ? toMiskituDraft('Dejan a alguien fuera a propósito.') : 'Dejan a alguien fuera a propósito.', answer: 'unkind' },
                            ] },
                    },
                    {
                        position: 2, part: 2, kind: 'minigame', template: 'empathy_story', title: en ? 'In someone else’s shoes' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('En los zapatos de otro') : 'En los zapatos de otro') : (language as AppLanguage) === "miq" ? toMiskituDraft('En los zapatos de otro') : 'En los zapatos de otro',
                        instructions: en ? 'Notice how Lupita feels and choose a caring action.' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Reconocé cómo se siente Lupita y elegí una acción que la cuide.') : 'Reconocé cómo se siente Lupita y elegí una acción que la cuide.') : (language as AppLanguage) === "miq" ? toMiskituDraft('Reconocé cómo se siente Lupita y elegí una acción que la cuide.') : 'Reconocé cómo se siente Lupita y elegí una acción que la cuide.',
                    },
                    {
                        position: 3, part: 3, kind: 'minigame', template: 'cooperation_chest', title: en ? 'Everyone’s treasure' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('El tesoro de todos') : 'El tesoro de todos') : (language as AppLanguage) === "miq" ? toMiskituDraft('El tesoro de todos') : 'El tesoro de todos',
                        instructions: en ? 'Invite all five children. The chest opens only when everyone is included.' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Invitá a los cinco estudiantes. El cofre se abre únicamente cuando nadie queda fuera.') : 'Invitá a los cinco estudiantes. El cofre se abre únicamente cuando nadie queda fuera.') : (language as AppLanguage) === "miq" ? toMiskituDraft('Invitá a los cinco estudiantes. El cofre se abre únicamente cuando nadie queda fuera.') : 'Invitá a los cinco estudiantes. El cofre se abre únicamente cuando nadie queda fuera.',
                    },
                ],
            },
        };
    if (lessonSlug === 'p3-w4')
        return {
            version: 1,
            schema_version: '1',
            language,
            payload: {
                lesson_slug: lessonSlug,
                title: en ? 'I am valuable and ask for help' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Soy valioso y pido ayuda') : 'Soy valioso y pido ayuda') : (language as AppLanguage) === "miq" ? toMiskituDraft('Soy valioso y pido ayuda') : 'Soy valioso y pido ayuda',
                parts: [
                    { part: 1, title: en ? 'My superhero shield' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Mi escudo de superhéroe') : 'Mi escudo de superhéroe') : (language as AppLanguage) === "miq" ? toMiskituDraft('Mi escudo de superhéroe') : 'Mi escudo de superhéroe' },
                    { part: 2, title: en ? 'My trusted adults' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Mis adultos de confianza') : 'Mis adultos de confianza') : (language as AppLanguage) === "miq" ? toMiskituDraft('Mis adultos de confianza') : 'Mis adultos de confianza' },
                    { part: 3, title: en ? 'Month check-in' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Cierre del mes') : 'Cierre del mes') : (language as AppLanguage) === "miq" ? toMiskituDraft('Cierre del mes') : 'Cierre del mes' },
                ],
                steps: [
                    {
                        position: 1, part: 1, kind: 'minigame', template: 'shield_builder', title: en ? 'My superhero shield' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Mi escudo de superhéroe') : 'Mi escudo de superhéroe') : (language as AppLanguage) === "miq" ? toMiskituDraft('Mi escudo de superhéroe') : 'Mi escudo de superhéroe',
                        instructions: en ? 'Choose three qualities that you recognize in yourself.' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Elegí tres cualidades que reconocés en vos.') : 'Elegí tres cualidades que reconocés en vos.') : (language as AppLanguage) === "miq" ? toMiskituDraft('Elegí tres cualidades que reconocés en vos.') : 'Elegí tres cualidades que reconocés en vos.',
                    },
                    {
                        position: 2, part: 2, kind: 'minigame', template: 'trusted_circle', title: en ? 'My trusted adults' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Mis adultos de confianza') : 'Mis adultos de confianza') : (language as AppLanguage) === "miq" ? toMiskituDraft('Mis adultos de confianza') : 'Mis adultos de confianza',
                        instructions: en ? 'Choose at least two adults you can turn to when something worries you.' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Elegí al menos dos personas adultas a quienes podés acudir cuando algo te preocupa.') : 'Elegí al menos dos personas adultas a quienes podés acudir cuando algo te preocupa.') : (language as AppLanguage) === "miq" ? toMiskituDraft('Elegí al menos dos personas adultas a quienes podés acudir cuando algo te preocupa.') : 'Elegí al menos dos personas adultas a quienes podés acudir cuando algo te preocupa.',
                    },
                    {
                        position: 3, part: 3, kind: 'minigame', template: 'month_self_assessment', title: en ? 'How was this month?' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('¿Cómo te fue este mes?') : '¿Cómo te fue este mes?') : (language as AppLanguage) === "miq" ? toMiskituDraft('¿Cómo te fue este mes?') : '¿Cómo te fue este mes?',
                        instructions: en ? 'Choose the face that best shows how you feel about each statement.' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Elegí la carita que mejor representa cómo te sentís con cada frase.') : 'Elegí la carita que mejor representa cómo te sentís con cada frase.') : (language as AppLanguage) === "miq" ? toMiskituDraft('Elegí la carita que mejor representa cómo te sentís con cada frase.') : 'Elegí la carita que mejor representa cómo te sentís con cada frase.',
                        no_wrong_answer: true,
                    },
                ],
            },
        };
    if (lessonSlug !== 'p3-w2')
        return null;
    return {
        version: 2,
        schema_version: '1',
        language,
        payload: {
            lesson_slug: lessonSlug,
            title: en ? 'The calm traffic light · 20 min' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('El semáforo de la calma · 20 min') : 'El semáforo de la calma · 20 min') : (language as AppLanguage) === "miq" ? toMiskituDraft('El semáforo de la calma · 20 min') : 'El semáforo de la calma · 20 min',
            parts: [
                { part: 1, title: en ? 'Learn' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Aprendo') : 'Aprendo') : (language as AppLanguage) === "miq" ? toMiskituDraft('Aprendo') : 'Aprendo' },
                { part: 2, title: en ? 'Practice' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Practico') : 'Practico') : (language as AppLanguage) === "miq" ? toMiskituDraft('Practico') : 'Practico' },
                { part: 3, title: en ? 'Use it' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Lo uso') : 'Lo uso') : (language as AppLanguage) === "miq" ? toMiskituDraft('Lo uso') : 'Lo uso' },
            ],
            steps: [
                {
                    position: 1, part: 1, kind: 'story', template: 'calm_week_intro', title: en ? 'Calm traffic light' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('El semáforo de la calma') : 'El semáforo de la calma') : (language as AppLanguage) === "miq" ? toMiskituDraft('El semáforo de la calma') : 'El semáforo de la calma',
                    body: en ? 'Pío spent the afternoon drawing for his grandmother. Chepita grabbed the drawing and it tore. Pío felt his face getting hot.' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Pío pasó toda la tarde haciendo un dibujo para su abuela. Su hermanita Chepita lo agarró y… ¡se rompió! Pío sintió que le hervía la cara.') : 'Pío pasó toda la tarde haciendo un dibujo para su abuela. Su hermanita Chepita lo agarró y… ¡se rompió! Pío sintió que le hervía la cara.') : (language as AppLanguage) === "miq" ? toMiskituDraft('Pío pasó toda la tarde haciendo un dibujo para su abuela. Su hermanita Chepita lo agarró y… ¡se rompió! Pío sintió que le hervía la cara.') : 'Pío pasó toda la tarde haciendo un dibujo para su abuela. Su hermanita Chepita lo agarró y… ¡se rompió! Pío sintió que le hervía la cara.',
                },
                {
                    position: 2, part: 1, kind: 'concept', template: 'anger_body_signals', title: en ? 'What happens to your body when you get angry?' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('¿Qué le pasa a tu cuerpo cuando te enojás?') : '¿Qué le pasa a tu cuerpo cuando te enojás?') : (language as AppLanguage) === "miq" ? toMiskituDraft('¿Qué le pasa a tu cuerpo cuando te enojás?') : '¿Qué le pasa a tu cuerpo cuando te enojás?',
                    body: en ? 'A hot face, tight hands, a fast heart and short breathing are body alarms. They tell you that you need a pause.' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('La cara caliente, las manos apretadas, el corazón rápido y la respiración corta son alarmas del cuerpo. Te avisan que necesitás una pausa.') : 'La cara caliente, las manos apretadas, el corazón rápido y la respiración corta son alarmas del cuerpo. Te avisan que necesitás una pausa.') : (language as AppLanguage) === "miq" ? toMiskituDraft('La cara caliente, las manos apretadas, el corazón rápido y la respiración corta son alarmas del cuerpo. Te avisan que necesitás una pausa.') : 'La cara caliente, las manos apretadas, el corazón rápido y la respiración corta son alarmas del cuerpo. Te avisan que necesitás una pausa.',
                },
                {
                    position: 3, part: 1, kind: 'concept', template: 'anger_is_normal', title: en ? 'Getting angry is normal' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Enojarse es normal') : 'Enojarse es normal') : (language as AppLanguage) === "miq" ? toMiskituDraft('Enojarse es normal') : 'Enojarse es normal',
                    body: en ? 'Feeling anger is okay. Hurting someone is not. You can learn what to do with that feeling.' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Sentir enojo está bien. Lastimar no está bien. Podés aprender qué hacer con lo que sentís.') : 'Sentir enojo está bien. Lastimar no está bien. Podés aprender qué hacer con lo que sentís.') : (language as AppLanguage) === "miq" ? toMiskituDraft('Sentir enojo está bien. Lastimar no está bien. Podés aprender qué hacer con lo que sentís.') : 'Sentir enojo está bien. Lastimar no está bien. Podés aprender qué hacer con lo que sentís.',
                },
                {
                    position: 4, part: 1, kind: 'concept', template: 'traffic_lesson', title: en ? 'The calm traffic light' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('El semáforo de la calma') : 'El semáforo de la calma') : (language as AppLanguage) === "miq" ? toMiskituDraft('El semáforo de la calma') : 'El semáforo de la calma',
                    body: en ? 'Red: stop. Yellow: breathe and think. Green: act calmly.' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Rojo: paro. Amarillo: respiro y pienso. Verde: actúo con calma.') : 'Rojo: paro. Amarillo: respiro y pienso. Verde: actúo con calma.') : (language as AppLanguage) === "miq" ? toMiskituDraft('Rojo: paro. Amarillo: respiro y pienso. Verde: actúo con calma.') : 'Rojo: paro. Amarillo: respiro y pienso. Verde: actúo con calma.',
                },
                {
                    position: 5, part: 1, kind: 'worked_example', template: 'traffic_example', title: en ? 'See how Pío used it' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Mirá cómo lo usó Pío') : 'Mirá cómo lo usó Pío') : (language as AppLanguage) === "miq" ? toMiskituDraft('Mirá cómo lo usó Pío') : 'Mirá cómo lo usó Pío',
                    body: en ? 'Pío stopped, took three balloon breaths and told Chepita what bothered him without hurting her.' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Pío paró, respiró como globo tres veces y le dijo a Chepita lo que le molestó sin lastimarla.') : 'Pío paró, respiró como globo tres veces y le dijo a Chepita lo que le molestó sin lastimarla.') : (language as AppLanguage) === "miq" ? toMiskituDraft('Pío paró, respiró como globo tres veces y le dijo a Chepita lo que le molestó sin lastimarla.') : 'Pío paró, respiró como globo tres veces y le dijo a Chepita lo que le molestó sin lastimarla.',
                },
                {
                    position: 6, part: 2, kind: 'minigame', template: 'sequence', title: en ? 'The traffic light' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('El semáforo') : 'El semáforo') : (language as AppLanguage) === "miq" ? toMiskituDraft('El semáforo') : 'El semáforo',
                    instructions: en ? 'Put the three lights in order to help Pío calm down.' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Tocá las luces en orden para ayudar a Pío a calmarse.') : 'Tocá las luces en orden para ayudar a Pío a calmarse.') : (language as AppLanguage) === "miq" ? toMiskituDraft('Tocá las luces en orden para ayudar a Pío a calmarse.') : 'Tocá las luces en orden para ayudar a Pío a calmarse.',
                    play: { rounds: 3, situations: [
                            { id: 'traffic-1', text: en ? 'Someone took Pío’s pencil. Put the traffic light in order.' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Juan le quitó el lápiz a Pío. Ordená el semáforo.') : 'Juan le quitó el lápiz a Pío. Ordená el semáforo.') : (language as AppLanguage) === "miq" ? toMiskituDraft('Juan le quitó el lápiz a Pío. Ordená el semáforo.') : 'Juan le quitó el lápiz a Pío. Ordená el semáforo.', answer: 'complete' },
                            { id: 'traffic-2', text: en ? 'Someone erased Pío’s drawing. Help him calm down.' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Chepita le rayó el cuaderno a Pío. Ayudalo a calmarse.') : 'Chepita le rayó el cuaderno a Pío. Ayudalo a calmarse.') : (language as AppLanguage) === "miq" ? toMiskituDraft('Chepita le rayó el cuaderno a Pío. Ayudalo a calmarse.') : 'Chepita le rayó el cuaderno a Pío. Ayudalo a calmarse.', answer: 'complete' },
                            { id: 'traffic-3', text: en ? 'Pío lost a turn in the game. What does he do first?' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Pío perdió su turno en el juego. Ordená lo que puede hacer.') : 'Pío perdió su turno en el juego. Ordená lo que puede hacer.') : (language as AppLanguage) === "miq" ? toMiskituDraft('Pío perdió su turno en el juego. Ordená lo que puede hacer.') : 'Pío perdió su turno en el juego. Ordená lo que puede hacer.', answer: 'complete' },
                        ] },
                },
                {
                    position: 7, part: 2, kind: 'calm', template: 'guided_breathing', title: en ? 'Balloon breathing' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('La respiración del globo') : 'La respiración del globo') : (language as AppLanguage) === "miq" ? toMiskituDraft('La respiración del globo') : 'La respiración del globo',
                    body: en ? 'Press and hold to inhale. Release to exhale.' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Mantené presionado para inflar. Soltá para que Pío saque el aire.') : 'Mantené presionado para inflar. Soltá para que Pío saque el aire.') : (language as AppLanguage) === "miq" ? toMiskituDraft('Mantené presionado para inflar. Soltá para que Pío saque el aire.') : 'Mantené presionado para inflar. Soltá para que Pío saque el aire.',
                    breathing: { rounds: 3, inhale_s: 4, hold_s: 2, exhale_s: 4 },
                },
                {
                    position: 8, part: 2, kind: 'minigame', template: 'classify', title: en ? 'Anger without hurting' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Enojo sin lastimar') : 'Enojo sin lastimar') : (language as AppLanguage) === "miq" ? toMiskituDraft('Enojo sin lastimar') : 'Enojo sin lastimar',
                    instructions: en ? 'Is this a way to express anger without hurting?' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('¿Esta forma de sacar el enojo lastima o no lastima?') : '¿Esta forma de sacar el enojo lastima o no lastima?') : (language as AppLanguage) === "miq" ? toMiskituDraft('¿Esta forma de sacar el enojo lastima o no lastima?') : '¿Esta forma de sacar el enojo lastima o no lastima?',
                    play: { rounds: 8, situations: [
                            { id: 'anger-1', text: en ? 'Say: “That bothers me.”' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Decir: «eso me molesta»') : 'Decir: «eso me molesta»') : (language as AppLanguage) === "miq" ? toMiskituDraft('Decir: «eso me molesta»') : 'Decir: «eso me molesta»', answer: 'no_hurt' },
                            { id: 'anger-2', text: en ? 'Push someone.' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Empujar a alguien') : 'Empujar a alguien') : (language as AppLanguage) === "miq" ? toMiskituDraft('Empujar a alguien') : 'Empujar a alguien', answer: 'hurt' },
                            { id: 'anger-3', text: en ? 'Ask for a pause.' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Pedir una pausa') : 'Pedir una pausa') : (language as AppLanguage) === "miq" ? toMiskituDraft('Pedir una pausa') : 'Pedir una pausa', answer: 'no_hurt' },
                            { id: 'anger-4', text: en ? 'Break someone else’s things.' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Romper las cosas de otra persona') : 'Romper las cosas de otra persona') : (language as AppLanguage) === "miq" ? toMiskituDraft('Romper las cosas de otra persona') : 'Romper las cosas de otra persona', answer: 'hurt' },
                            { id: 'anger-5', text: en ? 'Breathe and explain what happened.' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Respirar y explicar lo que pasó') : 'Respirar y explicar lo que pasó') : (language as AppLanguage) === "miq" ? toMiskituDraft('Respirar y explicar lo que pasó') : 'Respirar y explicar lo que pasó', answer: 'no_hurt' },
                            { id: 'anger-6', text: en ? 'Insult a classmate.' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Insultar a un compañero') : 'Insultar a un compañero') : (language as AppLanguage) === "miq" ? toMiskituDraft('Insultar a un compañero') : 'Insultar a un compañero', answer: 'hurt' },
                            { id: 'anger-7', text: en ? 'Ask a trusted adult for help.' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Pedir ayuda a una persona adulta de confianza') : 'Pedir ayuda a una persona adulta de confianza') : (language as AppLanguage) === "miq" ? toMiskituDraft('Pedir ayuda a una persona adulta de confianza') : 'Pedir ayuda a una persona adulta de confianza', answer: 'no_hurt' },
                            { id: 'anger-8', text: en ? 'Hit or kick.' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Pegar o patear') : 'Pegar o patear') : (language as AppLanguage) === "miq" ? toMiskituDraft('Pegar o patear') : 'Pegar o patear', answer: 'hurt' },
                        ] },
                },
                {
                    position: 9, part: 3, kind: 'quiz', template: 'traffic_quiz', title: en ? 'What would you do?' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('¿Qué harías?') : '¿Qué harías?') : (language as AppLanguage) === "miq" ? toMiskituDraft('¿Qué harías?') : '¿Qué harías?',
                    questions: [{ id: 'bus', prompt: en ? 'On the bus, a child pushes Pío and knocks over his backpack. He already stopped and breathed. What can he do on green?' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('En el bus, un niño empuja a Pío y le bota la mochila. Ya paró y respiró. ¿Qué puede hacer en el verde?') : 'En el bus, un niño empuja a Pío y le bota la mochila. Ya paró y respiró. ¿Qué puede hacer en el verde?') : (language as AppLanguage) === "miq" ? toMiskituDraft('En el bus, un niño empuja a Pío y le bota la mochila. Ya paró y respiró. ¿Qué puede hacer en el verde?') : 'En el bus, un niño empuja a Pío y le bota la mochila. Ya paró y respiró. ¿Qué puede hacer en el verde?', options: [
                                { id: 'shout', text: en ? 'Yell: “You are silly!”' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Gritarle: «¡Sos un tonto!»') : 'Gritarle: «¡Sos un tonto!»') : (language as AppLanguage) === "miq" ? toMiskituDraft('Gritarle: «¡Sos un tonto!»') : 'Gritarle: «¡Sos un tonto!»' },
                                { id: 'calm_words', text: en ? 'Say calmly: “That bothered me.”' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Decir con calma: «Eso me molestó»') : 'Decir con calma: «Eso me molestó»') : (language as AppLanguage) === "miq" ? toMiskituDraft('Decir con calma: «Eso me molestó»') : 'Decir con calma: «Eso me molestó»' },
                                { id: 'take_toy', text: en ? 'Take away his toy too' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Quitarle su juguete también') : 'Quitarle su juguete también') : (language as AppLanguage) === "miq" ? toMiskituDraft('Quitarle su juguete también') : 'Quitarle su juguete también' },
                            ], answer_id: 'calm_words', explanation: en ? 'Green means acting calmly: use words or ask an adult for help.' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Verde significa actuar con calma: usar palabras o pedir ayuda a una persona adulta.') : 'Verde significa actuar con calma: usar palabras o pedir ayuda a una persona adulta.') : (language as AppLanguage) === "miq" ? toMiskituDraft('Verde significa actuar con calma: usar palabras o pedir ayuda a una persona adulta.') : 'Verde significa actuar con calma: usar palabras o pedir ayuda a una persona adulta.' }],
                },
                {
                    position: 10, part: 3, kind: 'application', template: 'traffic_plan', title: en ? 'Where will you use your traffic light?' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('¿Dónde vas a usar tu semáforo?') : '¿Dónde vas a usar tu semáforo?') : (language as AppLanguage) === "miq" ? toMiskituDraft('¿Dónde vas a usar tu semáforo?') : '¿Dónde vas a usar tu semáforo?',
                    instructions: en ? 'Choose a place and make a simple plan.' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Elegí un lugar y armá un plan sencillo.') : 'Elegí un lugar y armá un plan sencillo.') : (language as AppLanguage) === "miq" ? toMiskituDraft('Elegí un lugar y armá un plan sencillo.') : 'Elegí un lugar y armá un plan sencillo.', is_private: true,
                },
                {
                    position: 11, part: 3, kind: 'card', template: 'traffic_reward_card', title: en ? 'You earned a new card!' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('¡Ganaste una tarjeta nueva!') : '¡Ganaste una tarjeta nueva!') : (language as AppLanguage) === "miq" ? toMiskituDraft('¡Ganaste una tarjeta nueva!') : '¡Ganaste una tarjeta nueva!',
                    body: en ? 'Keep your calm traffic light close: stop, breathe and think, then act calmly.' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Guardá cerca tu semáforo de la calma: paro, respiro y pienso, luego actúo con calma.') : 'Guardá cerca tu semáforo de la calma: paro, respiro y pienso, luego actúo con calma.') : (language as AppLanguage) === "miq" ? toMiskituDraft('Guardá cerca tu semáforo de la calma: paro, respiro y pienso, luego actúo con calma.') : 'Guardá cerca tu semáforo de la calma: paro, respiro y pienso, luego actúo con calma.',
                },
                {
                    position: 12, part: 3, kind: 'home', template: 'traffic_home_challenge', title: en ? 'Teach it to your family' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Enseñale el semáforo a tu familia') : 'Enseñale el semáforo a tu familia') : (language as AppLanguage) === "miq" ? toMiskituDraft('Enseñale el semáforo a tu familia') : 'Enseñale el semáforo a tu familia',
                    body: en ? 'Show your card, practice balloon breathing together and choose a family signal for “stop”.' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Mostrales tu tarjeta, practiquen juntos la respiración del globo y elijan una señal familiar para decir «rojo, paro».') : 'Mostrales tu tarjeta, practiquen juntos la respiración del globo y elijan una señal familiar para decir «rojo, paro».') : (language as AppLanguage) === "miq" ? toMiskituDraft('Mostrales tu tarjeta, practiquen juntos la respiración del globo y elijan una señal familiar para decir «rojo, paro».') : 'Mostrales tu tarjeta, practiquen juntos la respiración del globo y elijan una señal familiar para decir «rojo, paro».',
                },
                {
                    position: 13, part: 3, kind: 'calm', template: 'garden_breathing', title: en ? 'Breathe and plant your flower' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Respirá y sembrá tu flor') : 'Respirá y sembrá tu flor') : (language as AppLanguage) === "miq" ? toMiskituDraft('Respirá y sembrá tu flor') : 'Respirá y sembrá tu flor',
                    body: en ? 'Take three slow balloon breaths. Each round helps your flower grow.' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Hacé tres respiraciones lentas de globo. Cada ronda ayuda a crecer tu flor.') : 'Hacé tres respiraciones lentas de globo. Cada ronda ayuda a crecer tu flor.') : (language as AppLanguage) === "miq" ? toMiskituDraft('Hacé tres respiraciones lentas de globo. Cada ronda ayuda a crecer tu flor.') : 'Hacé tres respiraciones lentas de globo. Cada ronda ayuda a crecer tu flor.',
                    breathing: { rounds: 3, inhale_s: 4, hold_s: 2, exhale_s: 4 },
                },
            ],
        },
    };
}
function secondaryWeekOne(lessonSlug: string, language: AppLanguage): VersionedLessonContent {
    const en = language === 'en';
    return {
        version: 1, schema_version: '1', language,
        payload: {
            lesson_slug: lessonSlug,
            title: en ? 'I am changing' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Estoy cambiando') : 'Estoy cambiando') : (language as AppLanguage) === "miq" ? toMiskituDraft('Estoy cambiando') : 'Estoy cambiando',
            parts: [
                { part: 3, title: en ? 'Myths and facts' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Mitos y verdades') : 'Mitos y verdades') : (language as AppLanguage) === "miq" ? toMiskituDraft('Mitos y verdades') : 'Mitos y verdades' },
                { part: 4, title: en ? 'Before and now' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Yo antes, yo ahora') : 'Yo antes, yo ahora') : (language as AppLanguage) === "miq" ? toMiskituDraft('Yo antes, yo ahora') : 'Yo antes, yo ahora' },
            ],
            steps: [
                {
                    position: 8, part: 3, kind: 'minigame', template: 'true_myth_trivia',
                    title: en ? 'Myths and facts' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Mitos y verdades') : 'Mitos y verdades') : (language as AppLanguage) === "miq" ? toMiskituDraft('Mitos y verdades') : 'Mitos y verdades',
                    instructions: en ? 'Read each card and decide whether it is a myth or a fact.' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Leé cada tarjeta y decidí si es un mito o una verdad.') : 'Leé cada tarjeta y decidí si es un mito o una verdad.') : (language as AppLanguage) === "miq" ? toMiskituDraft('Leé cada tarjeta y decidí si es un mito o una verdad.') : 'Leé cada tarjeta y decidí si es un mito o una verdad.',
                    cards: [
                        { id: 'm1', category: 'CAMBIOS DEL CUERPO', text: 'Todas las personas crecen al mismo ritmo en la adolescencia.', answer: 'myth', explanation: 'Cada cuerpo tiene su propio ritmo. Empezar antes o después es normal.' },
                        { id: 'm2', category: 'EMOCIONES', text: 'Durante la adolescencia puedo sentir emociones más intensas.', answer: 'fact', explanation: 'Es normal sentir cambios en la intensidad de las emociones y aprender nuevas formas de manejarlas.' },
                        { id: 'm3', category: 'CAMBIOS DEL CUERPO', text: 'Los cambios físicos pueden empezar en momentos distintos.', answer: 'fact', explanation: 'No existe una única edad exacta ni un orden idéntico para todas las personas.' },
                        { id: 'm4', category: 'RELACIONES', text: 'Cambiar de gustos significa que ya no soy yo.', answer: 'myth', explanation: 'Tus gustos pueden cambiar mientras seguís construyendo tu identidad.' },
                        { id: 'm5', category: 'RESPETO', text: 'Burlarse del cuerpo de otra persona puede lastimarla.', answer: 'fact', explanation: 'Todos los cuerpos merecen respeto. No comparamos ni hacemos bromas sobre ellos.' },
                        { id: 'm6', category: 'EMOCIONES', text: 'Pedir ayuda cuando algo me preocupa es una señal de debilidad.', answer: 'myth', explanation: 'Pedir apoyo es una decisión valiente y responsable.' },
                        { id: 'm7', category: 'RELACIONES', text: 'En la adolescencia pueden cambiar algunas amistades.', answer: 'fact', explanation: 'Las relaciones también cambian; lo importante es el respeto y el buen trato.' },
                        { id: 'm8', category: 'CAMBIOS DEL CUERPO', text: 'Hay un cuerpo “correcto” al que todas las personas deben parecerse.', answer: 'myth', explanation: 'Los cuerpos son diversos y cada persona se desarrolla de manera diferente.' },
                        { id: 'm9', category: 'EMOCIONES', text: 'Puedo sentir dos emociones diferentes al mismo tiempo.', answer: 'fact', explanation: 'Las emociones pueden mezclarse; reconocerlas ayuda a comprender lo que necesitás.' },
                        { id: 'm10', category: 'RESPETO', text: 'Está bien poner límites si un comentario sobre mi cuerpo me incomoda.', answer: 'fact', explanation: 'Podés decir que no te gusta y hablar con una persona adulta de confianza.' },
                    ],
                    achievement: { achieved: 7, in_progress: 5, total: 10 },
                },
                {
                    position: 9, part: 4, kind: 'minigame', template: 'before_after', is_private: true,
                    title: en ? 'Before and now' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Yo antes, yo ahora') : 'Yo antes, yo ahora') : (language as AppLanguage) === "miq" ? toMiskituDraft('Yo antes, yo ahora') : 'Yo antes, yo ahora',
                    instructions: en ? 'Write or choose two things that changed since primary school.' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Escribí o elegí dos cosas que cambiaron en vos desde la primaria.') : 'Escribí o elegí dos cosas que cambiaron en vos desde la primaria.') : (language as AppLanguage) === "miq" ? toMiskituDraft('Escribí o elegí dos cosas que cambiaron en vos desde la primaria.') : 'Escribí o elegí dos cosas que cambiaron en vos desde la primaria.',
                    ideas: ['Mis gustos', 'Mis amistades', 'Mi cuerpo', 'Lo que me preocupa', 'Mi familia'],
                    privacy_note: en ? 'This is not graded. Only your teacher sees your participation, not what you wrote.' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('No se califica el contenido. Tu docente solo ve que participaste.') : 'No se califica el contenido. Tu docente solo ve que participaste.') : (language as AppLanguage) === "miq" ? toMiskituDraft('No se califica el contenido. Tu docente solo ve que participaste.') : 'No se califica el contenido. Tu docente solo ve que participaste.',
                },
                {
                    position: 10, part: 4, kind: 'practice', template: 'anonymous_question',
                    title: en ? 'Anonymous question' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Pregunta anónima') : 'Pregunta anónima') : (language as AppLanguage) === "miq" ? toMiskituDraft('Pregunta anónima') : 'Pregunta anónima',
                    instructions: en ? 'Leave a respectful question about the changes of this stage.' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Dejá una duda respetuosa sobre los cambios de esta etapa.') : 'Dejá una duda respetuosa sobre los cambios de esta etapa.') : (language as AppLanguage) === "miq" ? toMiskituDraft('Dejá una duda respetuosa sobre los cambios de esta etapa.') : 'Dejá una duda respetuosa sobre los cambios de esta etapa.',
                    privacy_note: en ? 'Your name is not sent. Do not include other people’s names.' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Tu nombre no se envía. No escribás nombres de otras personas.') : 'Tu nombre no se envía. No escribás nombres de otras personas.') : (language as AppLanguage) === "miq" ? toMiskituDraft('Tu nombre no se envía. No escribás nombres de otras personas.') : 'Tu nombre no se envía. No escribás nombres de otras personas.',
                },
            ],
        },
    };
}
function secondaryWeekTwo(lessonSlug: string, language: AppLanguage): VersionedLessonContent {
    const en = language === 'en';
    return {
        version: 1, schema_version: '1', language,
        payload: {
            lesson_slug: lessonSlug,
            title: en ? 'My life online' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Mi vida en las redes') : 'Mi vida en las redes') : (language as AppLanguage) === "miq" ? toMiskituDraft('Mi vida en las redes') : 'Mi vida en las redes',
            parts: [{ part: 3, title: en ? 'Think before sharing' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Pensá antes de compartir') : 'Pensá antes de compartir') : (language as AppLanguage) === "miq" ? toMiskituDraft('Pensá antes de compartir') : 'Pensá antes de compartir' }],
            steps: [
                {
                    position: 8, part: 3, kind: 'minigame', template: 'compare_images', title: en ? 'Real or edited?' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('¿Real o filtrado?') : '¿Real o filtrado?') : (language as AppLanguage) === "miq" ? toMiskituDraft('¿Real o filtrado?') : '¿Real o filtrado?',
                    instructions: en ? 'Look for clues and choose which image was edited.' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Buscá las pistas y elegí cuál imagen fue editada.') : 'Buscá las pistas y elegí cuál imagen fue editada.') : (language as AppLanguage) === "miq" ? toMiskituDraft('Buscá las pistas y elegí cuál imagen fue editada.') : 'Buscá las pistas y elegí cuál imagen fue editada.',
                    pairs: [
                        { id: 'f1', answer: 'b', prompt: '¿Cuál de las dos fue editada?', clue: 'Tiene filtro de piel, colores más fuertes y la imagen fue recortada.', tags: ['Filtro', 'Recorte', 'Color'] },
                        { id: 'f2', answer: 'a', prompt: '¿Cuál usa un ángulo para cambiar la apariencia?', clue: 'El ángulo desde arriba modifica cómo se ven las proporciones.', tags: ['Ángulo', 'Encuadre'] },
                        { id: 'f3', answer: 'b', prompt: '¿Cuál cambió la luz de la escena?', clue: 'La iluminación fue aumentada y suavizada digitalmente.', tags: ['Luz', 'Filtro'] },
                        { id: 'f4', answer: 'a', prompt: '¿Cuál ocultó una parte de la foto?', clue: 'El recorte deja fuera información importante del contexto.', tags: ['Recorte', 'Contexto'] },
                        { id: 'f5', answer: 'b', prompt: '¿Cuál intensificó los colores?', clue: 'La saturación hace que los colores se vean menos naturales.', tags: ['Color', 'Filtro'] },
                        { id: 'f6', answer: 'a', prompt: '¿Cuál combinó varios cambios?', clue: 'Usa luz, recorte y filtro. En redes casi nunca vemos toda la historia.', tags: ['Luz', 'Recorte', 'Filtro'] },
                    ],
                    achievement: { achieved: 4, in_progress: 2, total: 6 },
                },
                {
                    position: 9, part: 3, kind: 'minigame', template: 'digital_traffic', title: 'Semáforo digital',
                    instructions: 'Clasificá cada situación: verde es seguro, amarillo es cuidado y rojo es pedir ayuda.',
                    scenarios: [
                        { id: 'd1', text: 'Una persona desconocida te pide una foto y dice: “No le digás a nadie”.', answer: 'red', feedback: 'No respondás. Bloqueá, reportá y contale a una persona adulta de confianza.' },
                        { id: 'd2', text: 'Una amiga te pregunta antes de publicar una foto donde aparecés.', answer: 'green', feedback: 'Pedir permiso cuida la privacidad y muestra respeto.' },
                        { id: 'd3', text: 'Una aplicación nueva pide tu ubicación todo el tiempo.', answer: 'yellow', feedback: 'Revisá los permisos con una persona adulta antes de aceptarlos.' },
                        { id: 'd4', text: 'Alguien publica una burla sobre un compañero.', answer: 'red', feedback: 'No la compartás. Guardá evidencia y pedí ayuda para detenerla.' },
                        { id: 'd5', text: 'Usás una contraseña larga y distinta para tu cuenta.', answer: 'green', feedback: 'Una contraseña segura protege tu cuenta. No la compartás.' },
                        { id: 'd6', text: 'Un enlace promete premios y pide tu contraseña.', answer: 'red', feedback: 'No abras el enlace ni ingresés datos. Reportalo y pedí ayuda.' },
                        { id: 'd7', text: 'Una cuenta conocida cambia de pronto y te pide dinero.', answer: 'yellow', feedback: 'Verificá por otro medio antes de responder; la cuenta podría haber sido robada.' },
                        { id: 'd8', text: 'Terminás una conversación que te incomoda y bloqueás la cuenta.', answer: 'green', feedback: 'Poner límites y bloquear es una forma válida de cuidarte.' },
                        { id: 'd9', text: 'Una amistad quiere subir una foto de otra persona sin preguntarle.', answer: 'yellow', feedback: 'Primero debe pedir permiso. La privacidad también es respeto.' },
                    ],
                    achievement: { achieved: 7, in_progress: 5, total: 9 },
                },
                {
                    position: 10, part: 3, kind: 'minigame', template: 'screen_rules', title: 'Mis 3 reglas',
                    instructions: 'Elegí o escribí tres reglas claras y realistas sobre tiempo, privacidad y respeto.',
                    suggestions: ['Sin celular 1 hora antes de dormir', 'No comparto fotos de otros sin permiso', 'Apago notificaciones al estudiar', 'Cuenta privada', 'Pausa cada hora', 'No respondo mensajes que me incomodan'],
                    achievement: { achieved: 3, in_progress: 1, total: 3 },
                },
            ],
        },
    };
}
function secondaryWeekThree(lessonSlug: string, language: AppLanguage): VersionedLessonContent {
    const en = language === 'en';
    return {
        version: 2, schema_version: '1', language,
        payload: {
            lesson_slug: lessonSlug,
            title: en ? 'Peer pressure and assertive communication' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Presión de grupo y comunicación asertiva') : 'Presión de grupo y comunicación asertiva') : (language as AppLanguage) === "miq" ? toMiskituDraft('Presión de grupo y comunicación asertiva') : 'Presión de grupo y comunicación asertiva',
            parts: [
                { part: 1, title: en ? 'Understand' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Entender') : 'Entender') : (language as AppLanguage) === "miq" ? toMiskituDraft('Entender') : 'Entender' },
                { part: 2, title: en ? 'Examples' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Ejemplos') : 'Ejemplos') : (language as AppLanguage) === "miq" ? toMiskituDraft('Ejemplos') : 'Ejemplos' },
                { part: 3, title: en ? 'Practice' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Practicar') : 'Practicar') : (language as AppLanguage) === "miq" ? toMiskituDraft('Practicar') : 'Practicar' },
                { part: 4, title: en ? 'Apply' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Aplicar') : 'Aplicar') : (language as AppLanguage) === "miq" ? toMiskituDraft('Aplicar') : 'Aplicar' },
            ],
            steps: [
                {
                    position: 1, part: 1, kind: 'poll', template: 'pressure_intro', title: en ? 'Have you ever done something only because others did it?' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('¿Alguna vez hiciste algo solo porque los demás lo hacían?') : '¿Alguna vez hiciste algo solo porque los demás lo hacían?') : (language as AppLanguage) === "miq" ? toMiskituDraft('¿Alguna vez hiciste algo solo porque los demás lo hacían?') : '¿Alguna vez hiciste algo solo porque los demás lo hacían?',
                    goals: en ? ['Recognize peer pressure, including online', 'Distinguish passive, aggressive and assertive', 'Use a formula to say no without fighting', 'Build your own plan'] : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft(['Reconocer la presión de grupo, también en redes', 'Distinguir los estilos pasivo, agresivo y asertivo', 'Usar una fórmula para decir «no» sin pelear', 'Armar tu propio plan']) : ['Reconocer la presión de grupo, también en redes', 'Distinguir los estilos pasivo, agresivo y asertivo', 'Usar una fórmula para decir «no» sin pelear', 'Armar tu propio plan']) : (language as AppLanguage) === "miq" ? toMiskituDraft(['Reconocer la presión de grupo, también en redes', 'Distinguir los estilos pasivo, agresivo y asertivo', 'Usar una fórmula para decir «no» sin pelear', 'Armar tu propio plan']) : ['Reconocer la presión de grupo, también en redes', 'Distinguir los estilos pasivo, agresivo y asertivo', 'Usar una fórmula para decir «no» sin pelear', 'Armar tu propio plan'],
                    pollOptions: en ? ['Yes', 'Sometimes', 'Never'] : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft(['Sí', 'A veces', 'Nunca']) : ['Sí', 'A veces', 'Nunca']) : (language as AppLanguage) === "miq" ? toMiskituDraft(['Sí', 'A veces', 'Nunca']) : ['Sí', 'A veces', 'Nunca'],
                },
                {
                    position: 2, part: 1, kind: 'concept', template: 'pressure_definition', title: en ? 'What is peer pressure?' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('¿Qué es la presión de grupo?') : '¿Qué es la presión de grupo?') : (language as AppLanguage) === "miq" ? toMiskituDraft('¿Qué es la presión de grupo?') : '¿Qué es la presión de grupo?',
                    body: en ? 'It is when you feel you have to do something so the group accepts you, even when you do not want to.' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Es cuando sentís que tenés que hacer algo para que el grupo te acepte, aunque no querás.') : 'Es cuando sentís que tenés que hacer algo para que el grupo te acepte, aunque no querás.') : (language as AppLanguage) === "miq" ? toMiskituDraft('Es cuando sentís que tenés que hacer algo para que el grupo te acepte, aunque no querás.') : 'Es cuando sentís que tenés que hacer algo para que el grupo te acepte, aunque no querás.',
                    pressureTypes: en ? [{ title: 'Direct', text: 'They ask or insist.' }, { title: 'Indirect', text: 'No one says it, but you feel everyone expects it.' }, { title: 'Online', text: 'Challenges, likes or messages that ask for photos or shares.' }] : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft([{ title: 'Directa', text: 'Te lo piden o te insisten: «Dale, no seas aburrido».' }, { title: 'Indirecta', text: 'Nadie te dice nada, pero sentís que todos esperan algo de vos.' }, { title: 'En redes', text: 'Retos virales, likes o mensajes que piden fotos o compartir algo.' }]) : [{ title: 'Directa', text: 'Te lo piden o te insisten: «Dale, no seas aburrido».' }, { title: 'Indirecta', text: 'Nadie te dice nada, pero sentís que todos esperan algo de vos.' }, { title: 'En redes', text: 'Retos virales, likes o mensajes que piden fotos o compartir algo.' }]) : (language as AppLanguage) === "miq" ? toMiskituDraft([{ title: 'Directa', text: 'Te lo piden o te insisten: «Dale, no seas aburrido».' }, { title: 'Indirecta', text: 'Nadie te dice nada, pero sentís que todos esperan algo de vos.' }, { title: 'En redes', text: 'Retos virales, likes o mensajes que piden fotos o compartir algo.' }]) : [{ title: 'Directa', text: 'Te lo piden o te insisten: «Dale, no seas aburrido».' }, { title: 'Indirecta', text: 'Nadie te dice nada, pero sentís que todos esperan algo de vos.' }, { title: 'En redes', text: 'Retos virales, likes o mensajes que piden fotos o compartir algo.' }],
                },
                {
                    position: 3, part: 1, kind: 'concept', template: 'pressure_reasons', title: en ? 'Why is it hard to say no?' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('¿Por qué cuesta tanto decir que no?') : '¿Por qué cuesta tanto decir que no?') : (language as AppLanguage) === "miq" ? toMiskituDraft('¿Por qué cuesta tanto decir que no?') : '¿Por qué cuesta tanto decir que no?',
                    reasons: en ? [{ title: 'Fear of being left out', text: 'We think the group may leave us alone.' }, { title: 'Not knowing what to say', text: 'We stay quiet because we do not have a phrase ready.' }] : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft([{ title: 'Miedo a quedar fuera', text: 'Pensamos que si decimos «no», nos van a dejar solos.' }, { title: 'No saber qué decir', text: 'Nos quedamos callados porque no tenemos la frase lista.' }]) : [{ title: 'Miedo a quedar fuera', text: 'Pensamos que si decimos «no», nos van a dejar solos.' }, { title: 'No saber qué decir', text: 'Nos quedamos callados porque no tenemos la frase lista.' }]) : (language as AppLanguage) === "miq" ? toMiskituDraft([{ title: 'Miedo a quedar fuera', text: 'Pensamos que si decimos «no», nos van a dejar solos.' }, { title: 'No saber qué decir', text: 'Nos quedamos callados porque no tenemos la frase lista.' }]) : [{ title: 'Miedo a quedar fuera', text: 'Pensamos que si decimos «no», nos van a dejar solos.' }, { title: 'No saber qué decir', text: 'Nos quedamos callados porque no tenemos la frase lista.' }],
                },
                {
                    position: 4, part: 1, kind: 'concept', template: 'communication_overview', title: en ? 'Three ways to respond' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Tres formas de responder') : 'Tres formas de responder') : (language as AppLanguage) === "miq" ? toMiskituDraft('Tres formas de responder') : 'Tres formas de responder',
                    styles: en ? [{ id: 'passive', title: 'Passive', body: 'You hide what you want', example: 'Well… okay.' }, { id: 'aggressive', title: 'Aggressive', body: 'You attack the other person', example: 'Leave me alone, idiot!' }, { id: 'assertive', title: 'Assertive', body: 'You say what you think respectfully', example: 'No thanks. I prefer something else.' }] : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft([{ id: 'passive', title: 'Pasivo', body: 'Callás lo que querés', example: '«Bueno… está bien»' }, { id: 'aggressive', title: 'Agresivo', body: 'Atacás al otro', example: '«¡Dejame en paz, idiota!»' }, { id: 'assertive', title: 'Asertivo', body: 'Decís lo que pensás con respeto', example: '«No, gracias. Prefiero otra cosa»' }]) : [{ id: 'passive', title: 'Pasivo', body: 'Callás lo que querés', example: '«Bueno… está bien»' }, { id: 'aggressive', title: 'Agresivo', body: 'Atacás al otro', example: '«¡Dejame en paz, idiota!»' }, { id: 'assertive', title: 'Asertivo', body: 'Decís lo que pensás con respeto', example: '«No, gracias. Prefiero otra cosa»' }]) : (language as AppLanguage) === "miq" ? toMiskituDraft([{ id: 'passive', title: 'Pasivo', body: 'Callás lo que querés', example: '«Bueno… está bien»' }, { id: 'aggressive', title: 'Agresivo', body: 'Atacás al otro', example: '«¡Dejame en paz, idiota!»' }, { id: 'assertive', title: 'Asertivo', body: 'Decís lo que pensás con respeto', example: '«No, gracias. Prefiero otra cosa»' }]) : [{ id: 'passive', title: 'Pasivo', body: 'Callás lo que querés', example: '«Bueno… está bien»' }, { id: 'aggressive', title: 'Agresivo', body: 'Atacás al otro', example: '«¡Dejame en paz, idiota!»' }, { id: 'assertive', title: 'Asertivo', body: 'Decís lo que pensás con respeto', example: '«No, gracias. Prefiero otra cosa»' }],
                },
                {
                    position: 5, part: 2, kind: 'concept', template: 'assertive_formula', title: en ? 'The formula for saying no' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('La fórmula para decir «no»') : 'La fórmula para decir «no»') : (language as AppLanguage) === "miq" ? toMiskituDraft('La fórmula para decir «no»') : 'La fórmula para decir «no»',
                    formulaSteps: en ? ['Say “no” clearly', 'Explain briefly, if you want', 'Suggest something else', 'If they insist, repeat and leave'] : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft(['Decí «no» claro', 'Explicá corto, si querés', 'Proponé otra cosa', 'Si insisten, repetí y retirate']) : ['Decí «no» claro', 'Explicá corto, si querés', 'Proponé otra cosa', 'Si insisten, repetí y retirate']) : (language as AppLanguage) === "miq" ? toMiskituDraft(['Decí «no» claro', 'Explicá corto, si querés', 'Proponé otra cosa', 'Si insisten, repetí y retirate']) : ['Decí «no» claro', 'Explicá corto, si querés', 'Proponé otra cosa', 'Si insisten, repetí y retirate'],
                },
                {
                    position: 6, part: 2, kind: 'worked_example', template: 'assertive_example', title: en ? 'This is how Valeria did it' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Así lo hizo Valeria') : 'Así lo hizo Valeria') : (language as AppLanguage) === "miq" ? toMiskituDraft('Así lo hizo Valeria') : 'Así lo hizo Valeria',
                    messages: en ? ['No, I am not going this time.', 'I do not want to get in trouble with my mother.', 'How about we watch a movie at my house on Saturday?', 'I already said no. See you Saturday.'] : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft(['No, esta vez no voy.', 'No quiero meterme en problemas con mi mamá.', '¿Y si el sábado vemos una peli en mi casa?', 'Ya les dije que no. Nos vemos el sábado 👋']) : ['No, esta vez no voy.', 'No quiero meterme en problemas con mi mamá.', '¿Y si el sábado vemos una peli en mi casa?', 'Ya les dije que no. Nos vemos el sábado 👋']) : (language as AppLanguage) === "miq" ? toMiskituDraft(['No, esta vez no voy.', 'No quiero meterme en problemas con mi mamá.', '¿Y si el sábado vemos una peli en mi casa?', 'Ya les dije que no. Nos vemos el sábado 👋']) : ['No, esta vez no voy.', 'No quiero meterme en problemas con mi mamá.', '¿Y si el sábado vemos una peli en mi casa?', 'Ya les dije que no. Nos vemos el sábado 👋'],
                },
                {
                    position: 7, part: 2, kind: 'quiz', template: 'formula_quiz', title: en ? 'Which step is missing?' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('¿Qué paso de la fórmula le falta?') : '¿Qué paso de la fórmula le falta?') : (language as AppLanguage) === "miq" ? toMiskituDraft('¿Qué paso de la fórmula le falta?') : '¿Qué paso de la fórmula le falta?',
                    prompt: en ? '“No, I will not copy. I do not want to get in trouble. Well, bye.”' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('«No, no me copio. No quiero meterme en problemas. Bueno, me voy»') : '«No, no me copio. No quiero meterme en problemas. Bueno, me voy»') : (language as AppLanguage) === "miq" ? toMiskituDraft('«No, no me copio. No quiero meterme en problemas. Bueno, me voy»') : '«No, no me copio. No quiero meterme en problemas. Bueno, me voy»',
                    answer: 'alternative',
                },
                {
                    position: 8, part: 3, kind: 'minigame', template: 'choice_adventure', title: en ? 'Choose your adventure' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Elige tu aventura') : 'Elige tu aventura') : (language as AppLanguage) === "miq" ? toMiskituDraft('Elige tu aventura') : 'Elige tu aventura',
                    instructions: en ? 'Make decisions under peer pressure and see the consequences.' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Tomá decisiones frente a la presión del grupo y mirá sus consecuencias.') : 'Tomá decisiones frente a la presión del grupo y mirá sus consecuencias.') : (language as AppLanguage) === "miq" ? toMiskituDraft('Tomá decisiones frente a la presión del grupo y mirá sus consecuencias.') : 'Tomá decisiones frente a la presión del grupo y mirá sus consecuencias.',
                    story: [
                        { id: 'a1', scene: 'En las fiestas del barrio, el grupo te invita a salir sin permiso. Todos te miran.', choices: [
                                { id: 'change', text: 'Digo que no y propongo vernos otro día', responsible: true, consequence: 'Marcaste un límite sin pelear y cuidaste la amistad.' },
                                { id: 'accept', text: 'Voy para que no se burlen', responsible: false, consequence: 'La presión decidió por vos. Podés detenerte y buscar apoyo.' },
                                { id: 'leave', text: 'Me retiro y le escribo a una persona de confianza', responsible: true, consequence: 'Salir de la situación y contactar a alguien de confianza también es cuidarte.' },
                            ] },
                        { id: 'a2', scene: 'El grupo quiere entrar a una cuenta ajena “solo por diversión”.', choices: [
                                { id: 'refuse', text: 'Digo que no: eso invade su privacidad', responsible: true, consequence: 'Defendiste un límite y el derecho a la privacidad.' },
                                { id: 'watch', text: 'No participo, pero me quedo mirando', responsible: false, consequence: 'Quedarte puede reforzar la acción. Es mejor alejarte y pedir ayuda.' },
                                { id: 'join', text: 'Participo para no quedar fuera', responsible: false, consequence: 'La presión del grupo no vuelve segura una acción que puede dañar.' },
                            ] },
                        { id: 'a3', scene: 'Tus amistades se burlan de alguien y te piden que compartás el video.', choices: [
                                { id: 'stop', text: 'No lo comparto y digo que paremos', responsible: true, consequence: 'Elegiste no amplificar la burla y cuidar a la persona afectada.' },
                                { id: 'share', text: 'Lo comparto porque ya está publicado', responsible: false, consequence: 'Cada reenvío aumenta el daño, aunque no hayas creado el video.' },
                                { id: 'adult', text: 'Guardo evidencia y lo cuento a un adulto', responsible: true, consequence: 'Buscar apoyo permite detener la situación de forma segura.' },
                            ] },
                    ],
                },
                {
                    position: 9, part: 3, kind: 'quiz', template: 'pressure_practice', title: en ? 'Practice with real situations' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Practicá con situaciones reales') : 'Practicá con situaciones reales') : (language as AppLanguage) === "miq" ? toMiskituDraft('Practicá con situaciones reales') : 'Practicá con situaciones reales',
                    questions: [
                        { id: 'q1', prompt: 'Un amigo te presiona por chat para salir sin permiso. ¿Cuál respuesta es asertiva?', options: [{ id: 'a', text: 'No respondo nunca más' }, { id: 'b', text: 'No, gracias. Prefiero otra cosa.' }, { id: 'c', text: 'Le grito por audio' }], answer_id: 'b', explanation: 'Decís lo que pensás sin atacar y proponés un límite.' },
                        { id: 'q2', prompt: 'Comparten una foto vergonzosa de un compañero y todos se ríen. ¿Qué es lo más asertivo?', options: [{ id: 'a', text: 'Reírme para no quedar mal' }, { id: 'b', text: 'Decir: «No me parece. Bórrenla, porfa»' }, { id: 'c', text: 'Insultar al grupo' }], answer_id: 'b', explanation: 'Protegés a la persona y expresás tu opinión sin atacar.' },
                        { id: 'q3', prompt: '«Si no me pasás la tarea, ya no somos amigos». ¿Qué conducta es?', options: [{ id: 'a', text: 'Apoyo' }, { id: 'b', text: 'Chantaje' }, { id: 'c', text: 'Respeto' }], answer_id: 'b', explanation: 'Usar la amistad para obligar es chantaje, no una amistad sana.' },
                    ],
                },
                {
                    position: 10, part: 3, kind: 'application', template: 'assertive_response', title: en ? 'Now write your response' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Ahora escribí tu respuesta') : 'Ahora escribí tu respuesta') : (language as AppLanguage) === "miq" ? toMiskituDraft('Ahora escribí tu respuesta') : 'Ahora escribí tu respuesta', is_private: true,
                    prompt: en ? 'Send me the exam answers. Aren’t we friends?' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Pasame las respuestas del examen, ¿no somos amigos pues?') : 'Pasame las respuestas del examen, ¿no somos amigos pues?') : (language as AppLanguage) === "miq" ? toMiskituDraft('Pasame las respuestas del examen, ¿no somos amigos pues?') : 'Pasame las respuestas del examen, ¿no somos amigos pues?',
                    privacy_note: en ? 'Your personal response is not graded.' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Tu respuesta personal no se califica.') : 'Tu respuesta personal no se califica.') : (language as AppLanguage) === "miq" ? toMiskituDraft('Tu respuesta personal no se califica.') : 'Tu respuesta personal no se califica.',
                },
                {
                    position: 11, part: 4, kind: 'plan', template: 'assertive_plan', title: en ? 'Your plan for saying no' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Tu plan para decir «no»') : 'Tu plan para decir «no»') : (language as AppLanguage) === "miq" ? toMiskituDraft('Tu plan para decir «no»') : 'Tu plan para decir «no»', is_private: true,
                    places: en ? ['Online', 'At parties', 'At school', 'With my partner or close friends'] : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft(['En redes', 'En fiestas', 'En el colegio', 'Con mi pareja o amigos cercanos']) : ['En redes', 'En fiestas', 'En el colegio', 'Con mi pareja o amigos cercanos']) : (language as AppLanguage) === "miq" ? toMiskituDraft(['En redes', 'En fiestas', 'En el colegio', 'Con mi pareja o amigos cercanos']) : ['En redes', 'En fiestas', 'En el colegio', 'Con mi pareja o amigos cercanos'],
                    supportPeople: en ? ['Mother', 'Teacher', 'School counselor', 'Another trusted adult'] : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft(['Mamá', 'Docente guía', 'Orientación escolar', 'Otra persona adulta de confianza']) : ['Mamá', 'Docente guía', 'Orientación escolar', 'Otra persona adulta de confianza']) : (language as AppLanguage) === "miq" ? toMiskituDraft(['Mamá', 'Docente guía', 'Orientación escolar', 'Otra persona adulta de confianza']) : ['Mamá', 'Docente guía', 'Orientación escolar', 'Otra persona adulta de confianza'],
                },
                {
                    position: 12, part: 4, kind: 'home', template: 'family_conversation', title: en ? 'Conversation at home' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Conversación en casa') : 'Conversación en casa') : (language as AppLanguage) === "miq" ? toMiskituDraft('Conversación en casa') : 'Conversación en casa', is_private: true,
                    body: en ? 'How do we say no in our family without fighting?' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('¿Cómo se dice que no en nuestra familia, sin pelear?') : '¿Cómo se dice que no en nuestra familia, sin pelear?') : (language as AppLanguage) === "miq" ? toMiskituDraft('¿Cómo se dice que no en nuestra familia, sin pelear?') : '¿Cómo se dice que no en nuestra familia, sin pelear?',
                    privacy_note: en ? 'Your family can see that this conversation is pending, not what you wrote in the lesson.' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Tu familia puede ver que tenés esta conversación pendiente, no lo que escribiste en la lección.') : 'Tu familia puede ver que tenés esta conversación pendiente, no lo que escribiste en la lección.') : (language as AppLanguage) === "miq" ? toMiskituDraft('Tu familia puede ver que tenés esta conversación pendiente, no lo que escribiste en la lección.') : 'Tu familia puede ver que tenés esta conversación pendiente, no lo que escribiste en la lección.',
                },
                {
                    position: 13, part: 4, kind: 'summary', template: 'pressure_summary', title: en ? 'I say no and decide' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Digo no y decido') : 'Digo no y decido') : (language as AppLanguage) === "miq" ? toMiskituDraft('Digo no y decido') : 'Digo no y decido',
                    takeaways: en ? ['Peer pressure can be direct, indirect or online.', 'An assertive response protects what you want and the friendship.', 'Formula: clear no · brief explanation · another option · leave.'] : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft(['La presión de grupo puede ser directa, indirecta o en redes.', 'La respuesta asertiva cuida lo que querés y la amistad.', 'Fórmula: «no» claro · explicación corta · otra opción · retirarse.']) : ['La presión de grupo puede ser directa, indirecta o en redes.', 'La respuesta asertiva cuida lo que querés y la amistad.', 'Fórmula: «no» claro · explicación corta · otra opción · retirarse.']) : (language as AppLanguage) === "miq" ? toMiskituDraft(['La presión de grupo puede ser directa, indirecta o en redes.', 'La respuesta asertiva cuida lo que querés y la amistad.', 'Fórmula: «no» claro · explicación corta · otra opción · retirarse.']) : ['La presión de grupo puede ser directa, indirecta o en redes.', 'La respuesta asertiva cuida lo que querés y la amistad.', 'Fórmula: «no» claro · explicación corta · otra opción · retirarse.'],
                },
            ],
        },
    };
}
function secondaryWeekFour(lessonSlug: string, language: AppLanguage): VersionedLessonContent {
    const en = language === 'en';
    return {
        version: 1, schema_version: '1', language,
        payload: {
            lesson_slug: lessonSlug,
            title: en ? 'My project and wellbeing' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Mi proyecto y mi bienestar') : 'Mi proyecto y mi bienestar') : (language as AppLanguage) === "miq" ? toMiskituDraft('Mi proyecto y mi bienestar') : 'Mi proyecto y mi bienestar',
            parts: [{ part: 3, title: en ? 'My wellbeing plan' : (language as AppLanguage) === "miq" ? toMiskituDraft((language as AppLanguage) === "miq" ? toMiskituDraft('Mi plan de bienestar') : 'Mi plan de bienestar') : (language as AppLanguage) === "miq" ? toMiskituDraft('Mi plan de bienestar') : 'Mi plan de bienestar' }],
            steps: [
                {
                    position: 8, part: 3, kind: 'minigame', template: 'healthy_week', title: 'Mi semana saludable',
                    instructions: 'Definí una meta con pasos y elegí al menos dos hábitos que cuiden tu bienestar.',
                    habits: ['Dormir a una hora regular', 'Moverme 30 minutos', 'Hacer una pausa de pantalla', 'Compartir con mi familia', 'Hablar con una amistad', 'Preparar mis tareas con tiempo'],
                    achievement: { total: 3, achieved: 3, in_progress: 1 },
                },
                {
                    position: 9, part: 3, kind: 'minigame', template: 'support_network', title: 'Mi red de apoyo',
                    instructions: 'Elegí al menos dos personas a quienes acudirías y completá el repaso del mes.',
                    people: [
                        { id: 'orientation', initials: 'OE', name: 'Orientación escolar' },
                        { id: 'mother', initials: 'MA', name: 'Mamá' },
                        { id: 'sibling', initials: 'HE', name: 'Hermana/o' },
                        { id: 'teacher', initials: 'DG', name: 'Docente guía' },
                        { id: 'family', initials: 'FA', name: 'Otra persona adulta de mi familia' },
                    ],
                    trivia: [
                        { id: 't1', prompt: 'Un amigo te presiona por chat. ¿Cuál es una respuesta asertiva?', options: [{ id: 'a', text: 'No respondo nunca más' }, { id: 'b', text: 'No, gracias. Prefiero otra cosa.' }, { id: 'c', text: 'Le grito por audio' }], answer_id: 'b', explanation: 'Decís lo que pensás sin atacar y sostenés tu límite.' },
                        { id: 't2', prompt: '¿Qué hace una amistad sana cuando decís “no”?', options: [{ id: 'a', text: 'Respeta tu decisión' }, { id: 'b', text: 'Insiste hasta convencerte' }, { id: 'c', text: 'Te amenaza' }], answer_id: 'a', explanation: 'Una amistad sana respeta tus límites.' },
                        { id: 't3', prompt: 'Si un mensaje de una persona desconocida te incomoda, ¿qué hacés?', options: [{ id: 'a', text: 'Lo guardo en secreto' }, { id: 'b', text: 'Respondo para saber qué quiere' }, { id: 'c', text: 'Bloqueo, reporto y pido ayuda' }], answer_id: 'c', explanation: 'No tenés que responder. Buscar apoyo es cuidarte.' },
                        { id: 't4', prompt: '¿Cuál es una regla saludable de pantalla?', options: [{ id: 'a', text: 'Dormir con notificaciones activas' }, { id: 'b', text: 'Hacer pausas y cuidar el sueño' }, { id: 'c', text: 'Compartir todas mis contraseñas' }], answer_id: 'b', explanation: 'Las pausas y el descanso protegen tu bienestar.' },
                        { id: 't5', prompt: 'Una foto con filtro…', options: [{ id: 'a', text: 'Puede cambiar cómo se ve la realidad' }, { id: 'b', text: 'Siempre muestra toda la verdad' }, { id: 'c', text: 'Nunca influye en cómo me comparo' }], answer_id: 'a', explanation: 'Filtros, luz, recorte y ángulo pueden modificar lo que vemos.' },
                        { id: 't6', prompt: '¿Qué es presión de grupo?', options: [{ id: 'a', text: 'Escuchar una opinión distinta' }, { id: 'b', text: 'Sentir que debo hacer algo para ser aceptado' }, { id: 'c', text: 'Pedir tiempo para decidir' }], answer_id: 'b', explanation: 'La presión intenta que el grupo decida por vos.' },
                        { id: 't7', prompt: 'Una meta clara necesita…', options: [{ id: 'a', text: 'Pasos que pueda realizar' }, { id: 'b', text: 'Ser perfecta desde el primer día' }, { id: 'c', text: 'Depender solo de la suerte' }], answer_id: 'a', explanation: 'Los pasos pequeños y realistas acercan a la meta.' },
                        { id: 't8', prompt: 'Si algo me preocupa mucho, puedo…', options: [{ id: 'a', text: 'Aislarme siempre' }, { id: 'b', text: 'Acudir a mi red de apoyo' }, { id: 'c', text: 'Prometer que no se lo diré a nadie' }], answer_id: 'b', explanation: 'Tu red existe para acompañarte y ayudarte.' },
                        { id: 't9', prompt: 'Ser asertivo significa…', options: [{ id: 'a', text: 'Callar para evitar problemas' }, { id: 'b', text: 'Atacar para ganar' }, { id: 'c', text: 'Hablar claro y con respeto' }], answer_id: 'c', explanation: 'La asertividad combina claridad, respeto y límites.' },
                        { id: 't10', prompt: '¿Quién puede formar parte de tu red de apoyo?', options: [{ id: 'a', text: 'Solo amistades de internet' }, { id: 'b', text: 'Familia, docente u orientación escolar' }, { id: 'c', text: 'Nadie más que yo' }], answer_id: 'b', explanation: 'Conviene tener más de una persona adulta de confianza.' },
                        { id: 't11', prompt: 'Si alguien publica una foto tuya sin permiso…', options: [{ id: 'a', text: 'Podés pedir que la retire y buscar apoyo' }, { id: 'b', text: 'No podés hacer nada' }, { id: 'c', text: 'Debés publicar otra foto' }], answer_id: 'a', explanation: 'Tu privacidad importa y podés pedir ayuda.' },
                        { id: 't12', prompt: 'Un hábito saludable se construye mejor…', options: [{ id: 'a', text: 'Con pasos realistas y constancia' }, { id: 'b', text: 'Cambiando todo de golpe' }, { id: 'c', text: 'Comparándome con los demás' }], answer_id: 'a', explanation: 'Los cambios pequeños y constantes son más sostenibles.' },
                    ],
                    selfAssessment: ['Puedo decir no con respeto', 'Sé elegir hábitos que me cuidan', 'Sé a quién acudir si necesito ayuda'],
                    achievement: { total: 3, achieved: 3, in_progress: 1 },
                },
            ],
        },
    };
}
