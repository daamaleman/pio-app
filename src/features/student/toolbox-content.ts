import type { BrandIconName, PioPose } from '@/components/pio-ui';

export type LearningCard = {
  id: string;
  number: number;
  week: number;
  title: string;
  color: string;
  soft: string;
  icon: BrandIconName;
  pose: PioPose;
  isNew?: boolean;
  locked?: boolean;
  steps: { title: string; body: string; color: string }[];
  homeTip: string;
};

export const learningCards: LearningCard[] = [
  { id: 'four-drops', number: 1, week: 1, title: 'Las 4 gotas', color: '#C99412', soft: '#FFF5CE', icon: 'drop', pose: 'success', steps: [{ title: 'Miro', body: 'Reconozco qué emoción llegó.', color: '#FFC20E' }, { title: 'La nombro', body: 'Digo alegría, tristeza, enojo o miedo.', color: '#8FD6F2' }, { title: 'La comparto', body: 'Se la cuento a una persona de confianza.', color: '#FF9EBF' }], homeTip: 'Preguntá en casa qué gota visitó a cada persona hoy.' },
  { id: 'body-warns', number: 2, week: 1, title: 'Mi cuerpo me avisa', color: '#D6336C', soft: '#FFE7F0', icon: 'profile', pose: 'fear', steps: [{ title: 'Me detengo', body: 'Escucho las señales de mi cuerpo.', color: '#FF8A80' }, { title: 'Busco dónde', body: 'Puede sentirse en la cabeza, pecho, panza o manos.', color: '#C9A3D1' }, { title: 'Pido apoyo', body: 'Si lo necesito, se lo cuento a un adulto.', color: '#80BD41' }], homeTip: 'Jugá a señalar dónde se siente cada emoción.' },
  { id: 'calm-traffic-light', number: 3, week: 2, title: 'El semáforo de la calma', color: '#E52B1A', soft: '#FFE7E3', icon: 'traffic', pose: 'calm', isNew: true, steps: [{ title: 'Paro', body: 'Me quedo quieto un momento.', color: '#EE2B1C' }, { title: 'Respiro y pienso', body: 'Inflo el globo 3 veces.', color: '#FFC20E' }, { title: 'Actúo', body: 'Digo lo que siento sin lastimar.', color: '#80BD41' }], homeTip: 'Cuando alguien se enoje, digan juntos: «rojo, paro».' },
  { id: 'balloon-breath', number: 4, week: 2, title: 'La respiración del globo', color: '#188EBE', soft: '#DDF3FA', icon: 'drop', pose: 'calm', isNew: true, steps: [{ title: 'Inhalo 4', body: 'Tomo aire despacio.', color: '#1CABE2' }, { title: 'Sostengo 2', body: 'Mantengo el aire sin apurarme.', color: '#FFC20E' }, { title: 'Suelto 4', body: 'Dejo salir el aire y aflojo el cuerpo.', color: '#80BD41' }], homeTip: 'Practiquen tres rondas antes de dormir.' },
  { id: 'future-5', number: 5, week: 3, title: 'Próxima tarjeta', color: '#B8AFA4', soft: '#F7F5F2', icon: 'lock', pose: 'hello', locked: true, steps: [], homeTip: '' },
  { id: 'future-6', number: 6, week: 3, title: 'Próxima tarjeta', color: '#B8AFA4', soft: '#F7F5F2', icon: 'lock', pose: 'hello', locked: true, steps: [], homeTip: '' },
];

export type ToolboxItem = { id: string; kind: 'plan' | 'technique' | 'calm' | 'diary'; week: number; title: string; description: string; icon: BrandIconName; color: string };
export const toolboxItems: ToolboxItem[] = [
  { id: 'screen-rules', kind: 'plan', week: 2, title: 'Mis 3 reglas de pantalla', description: 'Un acuerdo personal para usar las pantallas con más calma.', icon: 'clock', color: '#1CABE2' },
  { id: 'digital-traffic-light', kind: 'technique', week: 2, title: 'El semáforo digital', description: 'Verde: comparto · Amarillo: lo pienso · Rojo: no lo subo.', icon: 'chat', color: '#FFC20E' },
  { id: 'calm-plan', kind: 'calm', week: 1, title: 'Mi plan para calmarme', description: 'Tres acciones que puedo usar cuando algo se siente demasiado.', icon: 'heart', color: '#80BD41' },
  { id: 'myths', kind: 'technique', week: 1, title: 'Mitos que ya no me creo', description: 'Cada persona cambia y crece a su propio ritmo.', icon: 'star', color: '#FF5C93' },
  { id: 'before-after', kind: 'diary', week: 1, title: 'Yo antes, yo ahora', description: 'Mis cambios, escritos de forma privada.', icon: 'lock', color: '#374EA2' },
];
