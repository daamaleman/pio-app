import { toMiskituDraft } from '@/lib/miskitu-draft';
import { router, usePathname } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { Text } from '@/components/localized-native';
import { BrandIcon, palette, type BrandIconName } from '@/components/pio-ui';
import { useAppState } from '@/lib/app-state';
import { t } from '@/lib/i18n';
const tabs: {
    path: '/student/home' | '/student/week' | '/student/garden' | '/student/profile';
    label: string;
    icon: BrandIconName;
}[] = [
    { path: '/student/home', label: 'home', icon: 'home' },
    { path: '/student/week', label: 'week', icon: 'week' },
    { path: '/student/garden', label: 'garden', icon: 'garden' },
    { path: '/student/profile', label: 'me', icon: 'profile' },
] as const;
const navHorizontalPadding = 12;
const activePillWidth = 54;
export function StudentNav() {
    const pathname = usePathname();
    const { language, session } = useAppState();
    const secondary = session.kind === 'student' && session.student.level === 'secondary';
    const activeIndex = Math.max(0, tabs.findIndex((tab) => pathname === tab.path || tab.path === '/student/garden' && (pathname.startsWith('/student/cards') || pathname.startsWith('/student/card/') || pathname.startsWith('/student/tool/'))));
    const [navWidth, setNavWidth] = useState(0);
    const indicatorX = useRef(new Animated.Value(0)).current;
    const tabWidth = (navWidth - navHorizontalPadding * 2) / tabs.length;
    useEffect(() => {
        if (!tabWidth)
            return;
        Animated.spring(indicatorX, { toValue: navHorizontalPadding + activeIndex * tabWidth + (tabWidth - activePillWidth) / 2, damping: 18, stiffness: 170, mass: 0.7, useNativeDriver: true }).start();
    }, [activeIndex, indicatorX, tabWidth]);
    return <View accessibilityRole="tablist" onLayout={(event) => setNavWidth(event.nativeEvent.layout.width)} style={[styles.nav, secondary && styles.navSecondary]}>
    {navWidth ? <Animated.View pointerEvents="none" style={[styles.activePill, secondary && styles.activePillSecondary, { transform: [{ translateX: indicatorX }] }]}/> : null}
    {tabs.map((tab, index) => { const active = index === activeIndex; const secondaryLabel = tab.path === '/student/home' ? (language === 'en' ? 'Home' : language === "miq" ? toMiskituDraft('Inicio') : 'Inicio') : tab.path === '/student/week' ? (language === 'en' ? 'Weeks' : language === "miq" ? toMiskituDraft('Semanas') : 'Semanas') : tab.path === '/student/garden' ? (language === 'en' ? 'My box' : language === "miq" ? toMiskituDraft('Mi caja') : 'Mi caja') : (language === 'en' ? 'Me' : language === "miq" ? toMiskituDraft('Yo') : 'Yo'); const icon = secondary && tab.path === '/student/garden' ? 'book' : tab.icon; return <Pressable accessibilityRole="tab" accessibilityState={{ selected: active }} key={tab.path} onPress={() => { if (!active)
        router.replace(tab.path); }} style={[styles.tab, secondary && styles.tabSecondary]}><View style={styles.iconWrap}><BrandIcon name={icon} color={active ? palette.ink : '#AAA39A'} size={23}/></View><Text style={[styles.label, secondary && styles.labelSecondary, active && (secondary ? styles.activeTextSecondary : styles.activeText)]}>{secondary ? secondaryLabel : t(tab.label, language)}</Text></Pressable>; })}
  </View>;
}
export function StudentNavSpacer() { return <View style={styles.spacer}/>; }
const styles = StyleSheet.create({ nav: { minHeight: 70, flexDirection: 'row', backgroundColor: palette.white, paddingTop: 6, paddingHorizontal: navHorizontalPadding, borderTopWidth: 1, borderTopColor: '#E7E2DC' }, navSecondary: { backgroundColor: palette.white, borderTopColor: '#E7E2DC' }, tab: { zIndex: 1, flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 2, gap: 2 }, tabSecondary: { backgroundColor: 'transparent' }, iconWrap: { width: activePillWidth, height: 33, borderRadius: 18, alignItems: 'center', justifyContent: 'center' }, activePill: { position: 'absolute', top: 8, left: 0, width: activePillWidth, height: 33, borderRadius: 18, backgroundColor: '#FFE1EC' }, activePillSecondary: { backgroundColor: '#DDF3FA' }, label: { fontFamily: 'Nunito_800ExtraBold', fontSize: 10.5, color: '#AAA39A' }, labelSecondary: { color: '#AAA39A' }, activeText: { color: palette.roseDeep }, activeTextSecondary: { color: palette.ink }, spacer: { height: 70 } });
