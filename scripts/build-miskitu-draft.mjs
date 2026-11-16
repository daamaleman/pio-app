import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const page = await fetch('https://lingojam.com/MiskAppTranslator').then((response) => {
  if (!response.ok) throw new Error(`No se pudo descargar el glosario (${response.status}).`);
  return response.text();
});
const match = page.match(/var jsonData = JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/);
if (!match) throw new Error('No se encontró el glosario miskitu.');

const source = JSON.parse(decodeURIComponent(match[1]));
const toPairs = (left, right) => Object.fromEntries(left.split('\n').map((value, index) => [value.trim(), right.split('\n')[index]?.trim()]).filter(([from, to]) => from && to));
const phrases = toPairs(source.phrases1, source.phrases2);
const words = toPairs(source.words1, source.words2);
const target = resolve('src/lib/miskitu-draft.ts');
const generated = [
  '/*',
  ' * BORRADOR AUTOMÁTICO PARA REVISIÓN LINGÜÍSTICA MÍSKITU.',
  ' * Fuente léxica: MiskApp Translator (Costa Caribe nicaragüense).',
  ' * No sustituye la validación de una persona hablante.',
  ' */',
  '',
  `const phrases: Record<string, string> = ${JSON.stringify(phrases, null, 2)};`,
  `const words: Record<string, string> = ${JSON.stringify(words, null, 2)};`,
  'const emotionTerms: Record<string, string> = {',
  "  Alegría: 'Lilia ĺaka',",
  "  Tristeza: 'Sari ĺaka',",
  "  Enojo: 'Lawanka',",
  "  Miedo: 'Sibrin ĺaka',",
  "  Calma: 'Lamni ĺaka',",
  "  Cariño: 'Latuan ĺaka',",
  '};',
  '',
  'function isWordCharacter(value: string | undefined) {',
  "  return Boolean(value && /[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/.test(value));",
  '}',
  '',
  'function replaceEntry(text: string, from: string, to: string, wholeWord: boolean) {',
  '  const lowerText = text.toLocaleLowerCase();',
  '  const lowerFrom = from.toLocaleLowerCase();',
  '  let start = 0;',
  "  let output = '';",
  '  let found = lowerText.indexOf(lowerFrom, start);',
  '',
  '  while (found !== -1) {',
  '    const endsAt = found + from.length;',
  '    const matchesWord = !wholeWord || (!isWordCharacter(text[found - 1]) && !isWordCharacter(text[endsAt]));',
  '    if (matchesWord) {',
  '      output += text.slice(start, found) + to;',
  '      start = endsAt;',
  '    }',
  '    found = lowerText.indexOf(lowerFrom, endsAt);',
  '  }',
  '',
  '  return output ? output + text.slice(start) : text;',
  '}',
  '',
  'function replaceEntries(text: string, entries: Record<string, string>, wholeWord: boolean) {',
  '  return Object.entries(entries)',
  '    .sort(([left], [right]) => right.length - left.length)',
  '    .reduce((result, [from, to]) => replaceEntry(result, from, to, wholeWord), text);',
  '}',
  '',
  'export function toMiskituDraft<T>(spanish: T): T {',
  "  if (typeof spanish === 'string') {",
  '    const withPhrases = replaceEntries(spanish, phrases, false);',
  '    const withEmotionTerms = replaceEntries(withPhrases, emotionTerms, true);',
  '    return replaceEntries(withEmotionTerms, words, true) as T;',
  '  }',
  '  if (Array.isArray(spanish)) {',
  '    return spanish.map((item) => toMiskituDraft(item)) as T;',
  '  }',
  "  if (spanish && typeof spanish === 'object') {",
  '    return Object.fromEntries(Object.entries(spanish).map(([key, value]) => [key, toMiskituDraft(value)])) as T;',
  '  }',
  '  return spanish;',
  '}',
  '',
].join('\n');
await mkdir(dirname(target), { recursive: true });
await writeFile(target, generated, 'utf8');
