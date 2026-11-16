import type { ReactNode } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View, type ImageStyle, type StyleProp, type ViewStyle } from 'react-native';
import { Text } from '@/components/localized-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import type { AppLanguage, Emotion } from '@/lib/types';
import { t } from '@/lib/i18n';

// Tokens taken from pages 4-10 of the Siento y Crezco brand manual.
export const palette = {
  rose: '#FF5C93', roseDeep: '#D6336C', roseSoft: '#FFE3EE',
  cyan: '#1CABE2', teacherBlue: '#374EA2',
  ink: '#1D2A5C', sand: '#F7F5F2', line: '#ECE7E1', white: '#FFFFFF',
  yellow: '#FFC20E', green: '#00833D', lime: '#80BD41', orange: '#F26A21',
  purple: '#6A1E74', gray: '#777779', muted: '#747887',
  // Compatibility aliases used by the existing screen files while they migrate.
  blue: '#1CABE2', sky: '#E3F5FA', leaf: '#00833D', navy: '#1D2A5C', paper: '#F7F5F2',
  joy: '#FFC20E', sadness: '#8FD6F2', anger: '#FF8A80', fear: '#C9A3D1', calm: '#B8DC8E', love: '#FF9EBF',
} as const;

export const emotionColor: Record<Emotion, string> = { joy: palette.joy, sadness: palette.sadness, anger: palette.anger, fear: palette.fear, calm: palette.calm, love: palette.love };
export const emotionLabel: Record<Emotion, string> = { joy: 'Alegría', sadness: 'Tristeza', anger: 'Enojo', fear: 'Miedo', calm: 'Calma', love: 'Cariño' };

const emotionArt: Record<Emotion, number> = {
  joy: require('../../assets/images/brand/emotion-0.jpg'),
  sadness: require('../../assets/images/brand/emotion-1.jpg'),
  anger: require('../../assets/images/brand/emotion-2.jpg'),
  fear: require('../../assets/images/brand/emotion-3.jpg'),
  calm: require('../../assets/images/brand/emotion-4.jpg'),
  love: require('../../assets/images/brand/emotion-5.jpg'),
};
const emotionCopy = { joy: 'emotionJoy', sadness: 'emotionSadness', anger: 'emotionAnger', fear: 'emotionFear', calm: 'emotionCalm', love: 'emotionLove' } as const;

export function Screen({ children, scroll = true, color = palette.white, footer, horizontalPadding = 16 }: { children: ReactNode; scroll?: boolean; color?: string; footer?: ReactNode; horizontalPadding?: number }) {
  const content = <View style={[styles.content, { paddingHorizontal: horizontalPadding }]}>{children}</View>;
  return <SafeAreaView style={[styles.safe, { backgroundColor: color }]}>{scroll ? <ScrollView style={styles.flex} contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">{content}</ScrollView> : <View style={styles.flex}>{content}</View>}{footer ? <View style={[styles.footer, { paddingHorizontal: horizontalPadding }]}>{footer}</View> : null}</SafeAreaView>;
}

export type PioPose = 'hello' | 'love' | 'success' | 'story' | 'sad' | 'angry' | 'fear' | 'calm';
const pioPoses: Record<PioPose, number> = {
  hello: require('../../assets/images/brand/pio-hello-transparent.png'),
  love: require('../../assets/images/brand/pio-love.png'),
  success: require('../../assets/images/brand/pio-success-transparent.png'),
  story: require('../../assets/images/brand/pio-story.png'),
  sad: require('../../assets/images/brand/pio-sad-transparent.png'),
  angry: require('../../assets/images/brand/pio-angry-transparent.png'),
  fear: require('../../assets/images/brand/pio-fear-transparent.png'),
  calm: require('../../assets/images/brand/pio-calm-transparent.png'),
};

export function PioMark({ small = false, pose, size = 116, style }: { small?: boolean; pose?: PioPose; size?: number; style?: StyleProp<ImageStyle> }) {
  const source = pose ? pioPoses[pose] : require('../../assets/images/brand/pio-mascot.jpg');
  return <Image accessibilityLabel="Pío, el guardabarranco" source={source} resizeMode="contain" style={[styles.pio, { width: small ? 42 : size, height: small ? 42 : size, borderRadius: pose ? 0 : small ? 21 : size / 2 }, small && styles.pioSmall, pose && styles.pioPose, style]} />;
}

type ButtonVariant = 'primary' | 'secondary' | 'cyan' | 'ghost' | 'danger';
export function Button({ title, onPress, variant = 'primary', disabled = false }: { title: string; onPress: () => void; variant?: ButtonVariant; disabled?: boolean }) {
  return <Pressable accessibilityRole="button" accessibilityState={{ disabled }} disabled={disabled} onPress={onPress} style={({ pressed }) => [styles.button, styles[`button_${variant}`], disabled && styles.buttonDisabled, pressed && !disabled && styles.buttonPressed]}><Text style={[styles.buttonText, variant === 'ghost' && styles.ghostText, disabled && styles.buttonTextDisabled]}>{title}</Text></Pressable>;
}

type ChipTone = 'neutral' | 'rose' | 'yellow' | 'cyan' | 'green' | 'navy';
export function Chip({ label, tone = 'neutral', selected = false, onPress }: { label: string; tone?: ChipTone; selected?: boolean; onPress?: () => void }) {
  const content = <Text style={[styles.chipText, styles[`chipText_${tone}`], selected && styles.chipTextSelected]}>{label}</Text>;
  const chipStyle = [styles.chip, styles[`chip_${tone}`], selected && styles.chipSelected];
  return onPress ? <Pressable accessibilityRole="button" accessibilityState={{ selected }} onPress={onPress} style={({ pressed }) => [chipStyle, pressed && styles.chipPressed]}>{content}</Pressable> : <View style={chipStyle}>{content}</View>;
}

type CardTone = 'white' | 'sky' | 'yellow' | 'leaf' | 'pink';
export function Card({ children, tone = 'white' }: { children: ReactNode; tone?: CardTone }) {
  return <View style={[styles.card, styles[`card_${tone}`]]}>{children}</View>;
}

export function SectionTitle({ eyebrow, title, body }: { eyebrow?: string; title: string; body?: string }) {
  return <View style={styles.titleWrap}>{eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}<Text style={styles.title}>{title}</Text>{body ? <Text style={styles.body}>{body}</Text> : null}</View>;
}

export function EmotionDot({ emotion, label = true, selected = false, language = 'es', onPress, style }: { emotion: Emotion; label?: boolean; selected?: boolean; language?: AppLanguage; onPress?: () => void; style?: StyleProp<ViewStyle> }) {
  const name = t(emotionCopy[emotion], language);
  return <Pressable accessibilityRole="button" accessibilityLabel={name} accessibilityState={{ selected }} onPress={onPress} style={[styles.emotion, { backgroundColor: `${emotionColor[emotion]}30` }, selected && styles.emotionSelected, style]}><Image source={emotionArt[emotion]} resizeMode="cover" style={styles.emotionIcon} />{label ? <Text style={styles.emotionText}>{name}</Text> : null}</Pressable>;
}

export type BrandIconName = 'home' | 'week' | 'garden' | 'profile' | 'star' | 'plant' | 'drop' | 'book' | 'heart' | 'clock' | 'family' | 'people' | 'chat' | 'smile' | 'globe' | 'search' | 'back' | 'lock' | 'traffic' | 'hammock' | 'speaker' | 'download' | 'check' | 'close' | 'chevron' | 'settings' | 'bell' | 'chest' | 'draw' | 'send' | 'shield' | 'plus' | 'microphone' | 'reflection' | 'pause';
export function BrandIcon({ name, color = palette.muted, size = 22 }: { name: BrandIconName; color?: string; size?: number }) {
  const common = { fill: 'none', stroke: color, strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityLabel={name}>
    {name === 'home' ? <Path {...common} d="M3.8 10.8 12 4l8.2 6.8v8.7a.7.7 0 0 1-.7.7h-5.2v-6h-4.6v6H4.5a.7.7 0 0 1-.7-.7z" /> : null}
    {name === 'week' ? <><Rect {...common} x="4" y="5.5" width="16" height="15" rx="2.3" /><Path {...common} d="M8 3.8v3.3m8-3.3v3.3M4 9.5h16m-11 5 1.7 1.7 3.5-3.5" /></> : null}
    {name === 'garden' ? <><Path {...common} d="M12 20V9m0 5c-4.7 0-7-2.4-7-6 4.7 0 7 2 7 6zm0-3c0-4.7 2.5-7 6.5-7 0 4.6-2.2 7-6.5 7zM7 20h10" /></> : null}
    {name === 'profile' ? <><Circle {...common} cx="12" cy="12" r="8.5" /><Path {...common} d="M8.3 14.3c.9 1.7 2.1 2.5 3.7 2.5s2.8-.8 3.7-2.5" /><Circle cx="9" cy="10" r=".7" fill={color} /><Circle cx="15" cy="10" r=".7" fill={color} /></> : null}
    {name === 'star' ? <Path {...common} d="m12 3 2.8 5.8 6.4.9-4.6 4.5 1.1 6.4-5.7-3-5.7 3 1.1-6.4-4.6-4.5 6.4-.9z" /> : null}
    {name === 'plant' ? <><Path {...common} d="M12 20V8m0 6c-4.4 0-6.5-2.2-6.5-5.6 4.2 0 6.5 1.8 6.5 5.6zm0-3c0-4.4 2.3-6.7 6.5-6.7 0 4.3-2.1 6.7-6.5 6.7z" /><Path {...common} d="M7 20h10" /></> : null}
    {name === 'drop' ? <><Path {...common} d="M12 3s-6 7-6 11a6 6 0 0 0 12 0c0-4-6-11-6-11z" /><Circle cx="10" cy="13" r=".7" fill={color} /><Circle cx="14" cy="13" r=".7" fill={color} /><Path {...common} d="M9.5 16c1.5 1.5 3.5 1.5 5 0" /></> : null}
    {name === 'book' ? <Path {...common} d="M3.5 5.5c3.5-1.5 6-.7 8.5 1.3v13c-2.5-2-5-2.8-8.5-1.3zm17 0c-3.5-1.5-6-.7-8.5 1.3v13c2.5-2 5-2.8 8.5-1.3z" /> : null}
    {name === 'heart' ? <Path {...common} d="M20.5 8.8c0 4.2-8.5 10.2-8.5 10.2S3.5 13 3.5 8.8A4.2 4.2 0 0 1 12 7a4.2 4.2 0 0 1 8.5 1.8z" /> : null}
    {name === 'clock' ? <><Circle {...common} cx="12" cy="12" r="8.5" /><Path {...common} d="M12 7v5l3 2" /></> : null}
    {name === 'family' ? <><Circle {...common} cx="9" cy="8" r="2.5" /><Circle {...common} cx="16.5" cy="9" r="2" /><Path {...common} d="M3.5 19v-1.2a5.5 5.5 0 0 1 11 0V19zm12.5-5a4 4 0 0 1 4.5 4v1" /></> : null}
    {name === 'people' ? <><Circle {...common} cx="8.5" cy="8" r="2.5" /><Circle {...common} cx="16" cy="8.8" r="2.2" /><Path {...common} d="M3.5 19v-1.1a5 5 0 0 1 10 0V19m1-5.2a4.2 4.2 0 0 1 6 3.8V19" /></> : null}
    {name === 'chat' ? <><Path {...common} d="M4 5.5h12.5a2 2 0 0 1 2 2v6.8a2 2 0 0 1-2 2H11L6.5 20v-3.7H4a2 2 0 0 1-2-2V7.5a2 2 0 0 1 2-2z" /><Circle cx="7" cy="11" r=".7" fill={color} /><Circle cx="10.5" cy="11" r=".7" fill={color} /><Circle cx="14" cy="11" r=".7" fill={color} /></> : null}
    {name === 'smile' ? <><Circle {...common} cx="12" cy="12" r="8.5" /><Circle cx="9" cy="10" r=".7" fill={color} /><Circle cx="15" cy="10" r=".7" fill={color} /><Path {...common} d="M8.5 14c.8 1.8 2 2.7 3.5 2.7s2.7-.9 3.5-2.7" /></> : null}
    {name === 'globe' ? <><Circle {...common} cx="12" cy="12" r="8.5" /><Path {...common} d="M3.7 12h16.6M12 3.5c2 2.3 3 5.1 3 8.5s-1 6.2-3 8.5c-2-2.3-3-5.1-3-8.5s1-6.2 3-8.5z" /></> : null}
    {name === 'search' ? <><Circle {...common} cx="10.5" cy="10.5" r="5.8" /><Path {...common} d="m15 15 5 5" /></> : null}
    {name === 'back' ? <Path {...common} d="m14.5 5-7 7 7 7" /> : null}
    {name === 'lock' ? <><Rect {...common} x="5" y="10" width="14" height="11" rx="2" /><Path {...common} d="M8 10V7a4 4 0 0 1 8 0v3" /></> : null}
    {name === 'traffic' ? <><Rect {...common} x="6" y="3" width="12" height="18" rx="5" /><Circle cx="12" cy="7" r="1.7" fill="#E83828" /><Circle cx="12" cy="12" r="1.7" fill="#FFC20E" /><Circle cx="12" cy="17" r="1.7" fill="#72B843" /></> : null}
    {name === 'hammock' ? <><Path {...common} d="M5 4 5 20m14-16v16M5 7c3.5 9 10.5 9 14 0m-14 0 2-2m-2 2-2-2m16 2-2-2m2 2 2-2" /><Path d="M7 8c2.8 6 7.2 6 10 0" stroke={color} strokeWidth="1.8" fill="none" strokeLinecap="round" /></> : null}
    {name === 'speaker' ? <><Path {...common} d="M4 10h4l5-4v12l-5-4H4z" /><Path {...common} d="M16 9c1.7 1.7 1.7 4.3 0 6m2.5-8.5c3.1 3.1 3.1 7.9 0 11" /></> : null}
    {name === 'download' ? <><Path {...common} d="M12 3v11m-4-4 4 4 4-4" /><Path {...common} d="M5 16v4h14v-4" /></> : null}
    {name === 'check' ? <Path {...common} d="m4 12 5 5L20 6" /> : null}
    {name === 'close' ? <Path {...common} d="M5 5l14 14M19 5 5 19" /> : null}
    {name === 'chevron' ? <Path {...common} d="m8 4 8 8-8 8" /> : null}
    {name === 'settings' ? <><Circle {...common} cx="12" cy="12" r="3" /><Path {...common} d="M12 2v3m0 14v3M2 12h3m14 0h3M4.9 4.9 7 7m10 10 2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1" /></> : null}
    {name === 'bell' ? <Path {...common} d="M6 17h12l-1.5-2V10a4.5 4.5 0 0 0-9 0v5zm4 2c.4 1 1 1.5 2 1.5s1.6-.5 2-1.5" /> : null}
    {name === 'chest' ? <><Rect {...common} x="4" y="8" width="16" height="11" rx="2" /><Path {...common} d="M5 8c0-3 2.2-5 7-5s7 2 7 5M4 11h16" /><Rect {...common} x="10" y="10" width="4" height="5" rx="1" /></> : null}
    {name === 'draw' ? <Path {...common} d="m4 20 4.5-1 10-10-3.5-3.5-10 10zm9-12 3.5 3.5M4 20l1-4.5" /> : null}
    {name === 'send' ? <Path {...common} d="m3 11 18-8-7 18-3-7zm8 3 5-6" /> : null}
    {name === 'shield' ? <Path {...common} d="M12 3 5 6v5c0 4.8 2.4 8 7 10 4.6-2 7-5.2 7-10V6z" /> : null}
    {name === 'plus' ? <Path {...common} d="M12 4v16M4 12h16" /> : null}
    {name === 'microphone' ? <><Rect {...common} x="9" y="3" width="6" height="11" rx="3" /><Path {...common} d="M6 11a6 6 0 0 0 12 0m-6 6v4m-3 0h6" /></> : null}
    {name === 'reflection' ? <><Path {...common} d="M20 8.8c0 4.2-8 10.2-8 10.2S4 13 4 8.8A4.1 4.1 0 0 1 12 7a4.1 4.1 0 0 1 8 1.8z" /><Path {...common} d="M10.5 9.5c.2-1 2.7-1.3 3 0 .3 1.8-2 1.8-2 3m0 2h.1" /></> : null}
    {name === 'pause' ? <><Path {...common} d="M8 5v14M16 5v14" /></> : null}
  </Svg>;
}

export function TopBar({ title, onBack }: { title: string; onBack?: () => void }) {
  return <View style={styles.topBar}>{onBack ? <Pressable accessibilityRole="button" accessibilityLabel="Volver" onPress={onBack} style={styles.back}><Text style={styles.backText}>‹</Text></Pressable> : <View style={styles.topMark} />}<Text numberOfLines={1} style={styles.topTitle}>{title}</Text><View style={styles.topMark} /></View>;
}

export const styles = StyleSheet.create({
  safe: { flex: 1 }, flex: { flex: 1 }, scroll: { flexGrow: 1 }, content: { flexGrow: 1, padding: 16, paddingBottom: 22, gap: 14, maxWidth: 500, width: '100%', alignSelf: 'center' }, footer: { width: '100%', maxWidth: 500, alignSelf: 'center', paddingHorizontal: 16, paddingBottom: 5 },
  pio: { width: 116, height: 116, borderRadius: 58, alignSelf: 'center', backgroundColor: '#FFF4D2' }, pioSmall: { width: 42, height: 42, borderRadius: 21, alignSelf: 'auto' }, pioPose: { backgroundColor: 'transparent' },
  titleWrap: { gap: 7 }, eyebrow: { color: palette.roseDeep, fontFamily: 'Nunito_800ExtraBold', fontSize: 12, letterSpacing: 1.2, textTransform: 'uppercase' }, title: { color: palette.ink, fontFamily: 'Baloo2_700Bold', fontSize: 29, lineHeight: 35 }, body: { color: '#50566E', fontFamily: 'Nunito_400Regular', fontSize: 15, lineHeight: 22 },
  button: { minHeight: 52, paddingHorizontal: 22, borderRadius: 28, alignItems: 'center', justifyContent: 'center' }, button_primary: { backgroundColor: palette.roseDeep }, button_secondary: { backgroundColor: palette.ink }, button_cyan: { backgroundColor: palette.cyan }, button_ghost: { backgroundColor: palette.white, borderWidth: 1.5, borderColor: '#E5DED6' }, button_danger: { backgroundColor: '#C8383A' }, buttonText: { color: palette.white, fontFamily: 'Nunito_800ExtraBold', fontSize: 15 }, ghostText: { color: palette.ink }, buttonPressed: { opacity: .84, transform: [{ scale: .985 }] }, buttonDisabled: { backgroundColor: '#E8E1D8', borderColor: '#E8E1D8' }, buttonTextDisabled: { color: '#AAA198' },
  chip: { minHeight: 38, borderRadius: 20, borderWidth: 1.8, paddingHorizontal: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: palette.white }, chip_neutral: { borderColor: '#E5DED6' }, chip_rose: { borderColor: palette.rose, backgroundColor: '#FFF1F6' }, chip_yellow: { borderColor: '#F4B900', backgroundColor: '#FFF5CE' }, chip_cyan: { borderColor: palette.cyan, backgroundColor: '#E3F5FA' }, chip_green: { borderColor: '#70AD39', backgroundColor: '#EDF6E4' }, chip_navy: { borderColor: palette.ink, backgroundColor: palette.ink }, chipSelected: { backgroundColor: palette.ink, borderColor: palette.ink }, chipPressed: { opacity: .78 }, chipText: { color: palette.ink, fontFamily: 'Nunito_800ExtraBold', fontSize: 12 }, chipText_neutral: { color: palette.ink }, chipText_rose: { color: palette.roseDeep }, chipText_yellow: { color: '#805400' }, chipText_cyan: { color: palette.ink }, chipText_green: { color: '#2F732C' }, chipText_navy: { color: palette.white }, chipTextSelected: { color: palette.white },
  card: { borderRadius: 22, padding: 16, gap: 10, borderWidth: 1, borderColor: palette.line }, card_white: { backgroundColor: palette.white }, card_sky: { backgroundColor: '#E3F5FA', borderColor: '#B8E4F0' }, card_yellow: { backgroundColor: '#FFF5CE', borderColor: '#F4E5AB' }, card_leaf: { backgroundColor: '#EAF4DF', borderColor: '#D4E5C6' }, card_pink: { backgroundColor: palette.roseSoft, borderColor: '#F4BED0' },
  emotion: { minWidth: 92, minHeight: 88, padding: 8, borderRadius: 18, alignItems: 'center', justifyContent: 'center', gap: 3, borderWidth: 2, borderColor: 'transparent' }, emotionSelected: { borderColor: palette.roseDeep }, emotionIcon: { width: 40, height: 40, borderRadius: 20 }, emotionText: { color: palette.ink, fontWeight: '800', fontSize: 12, textAlign: 'center' },
  topBar: { minHeight: 46, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 }, topTitle: { flex: 1, color: palette.ink, fontFamily: 'Baloo2_700Bold', fontSize: 17 }, topMark: { width: 42 }, back: { width: 40, height: 40, borderRadius: 20, backgroundColor: palette.white, borderWidth: 1, borderColor: palette.line, alignItems: 'center', justifyContent: 'center' }, backText: { color: palette.ink, fontSize: 32, lineHeight: 34 },
});
