import type { Lesson, StudentProfile } from '@/lib/types';
import { toMiskituDraft } from '@/lib/miskitu-draft';

const tr = (es: string, en: string): Partial<Record<'es' | 'en' | 'miq', string>> => ({ es, en, miq: toMiskituDraft(es) });

export const demoStudents: StudentProfile[] = [
  { id: '30000000-0000-4000-8000-000000000001', displayName: 'María Rivera', level: 'primary', grade: 3, section: 'B', language: 'es', trustedAdults: ['Mamá', 'Abuela', 'Maestra Ana'], accessibility: { textSize: 'normal', narration: true, reduceMotion: false } },
  { id: '30000000-0000-4000-8000-000000000002', displayName: 'Carlos Martínez', level: 'primary', grade: 3, section: 'B', language: 'es', trustedAdults: ['Papá', 'Tía', 'Maestra Ana'], accessibility: { textSize: 'normal', narration: true, reduceMotion: false } },
];

export const demoLessons: Lesson[] = [
  {
    slug: 'p3-w1', week: 1, level: 'primary', title: tr('Reconozco lo que siento', 'I recognize what I feel'), emotion: 'joy', duration: 20, parts: 3, status: 'in_progress', unlocked: true,
    steps: [
      { position: 1, part: 1, kind: 'story', title: tr('El día de las gotas', 'The day of the drops'), body: tr('Una mañana, Pío vio cuatro gotas en su ventana. Cada una tenía una carita diferente.', 'One morning, Pío saw four drops in his window. Each one had a different face.') },
      { position: 2, part: 1, kind: 'concept', title: tr('Las cuatro gotas', 'The four drops'), body: tr('Alegría, tristeza, enojo y miedo. Todas las emociones son normales.', 'Joy, sadness, anger and fear. All emotions are normal.') },
      { position: 3, part: 1, kind: 'concept', title: tr('Mi cuerpo también siente', 'My body feels too'), body: tr('Tu cuerpo te da pistas sobre lo que sentís.', 'Your body gives you clues about what you feel.') },
      { position: 4, part: 2, kind: 'minigame', title: tr('Atrapa gota', 'Catch a drop'), body: tr('Escuchá la situación y tocá la gota que corresponde.', 'Listen to the situation and tap the matching drop.') },
      { position: 5, part: 2, kind: 'minigame', title: tr('¿Dónde siento mis emociones?', 'Where do I feel my emotions?'), body: tr('Cada cuerpo siente de una manera distinta.', 'Every body feels in a different way.') },
      { position: 6, part: 3, kind: 'application', title: tr('Lo uso en mi vida', 'I use it in my life'), body: tr('Pensá cuándo te visitó una gota. Esto es solo para vos.', 'Think about when a drop visited you. This is only for you.'), private: true, optional: true },
      { position: 7, part: 3, kind: 'card', title: tr('Mi tarjeta', 'My card'), body: tr('Cuando no sé qué siento, escucho mi cuerpo.', 'When I do not know what I feel, I listen to my body.') },
      { position: 8, part: 3, kind: 'calm', title: tr('Respirá con Pío', 'Breathe with Pío'), body: tr('Inhalá 4, sostené 2 y soltá 4.', 'Breathe in for 4, hold for 2 and release for 4.') },
    ],
  },
  { slug: 'p3-w2', week: 2, level: 'primary', title: tr('Me calmo y me controlo', 'I calm and control myself'), emotion: 'anger', duration: 20, parts: 3, status: 'not_started', unlocked: false, steps: [] },
  { slug: 'p3-w3', week: 3, level: 'primary', title: tr('Buen trato para todos', 'Kind treatment for everyone'), emotion: 'love', duration: 20, parts: 3, status: 'not_started', unlocked: false, steps: [] },
  { slug: 'p3-w4', week: 4, level: 'primary', title: tr('Soy valioso y pido ayuda', 'I am valuable and ask for help'), emotion: 'calm', duration: 20, parts: 3, status: 'not_started', unlocked: false, steps: [] },
];
