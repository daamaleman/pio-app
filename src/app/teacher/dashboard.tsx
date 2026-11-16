import { toMiskituDraft } from '@/lib/miskitu-draft';
import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { Text } from '@/components/localized-native';
import { Button, Card, PioMark, Screen, SectionTitle, palette } from '@/components/pio-ui';
import { supabase } from '@/lib/supabase';
import { useAppState } from '@/lib/app-state';
import { t } from '@/lib/i18n';
type TeacherGroup = {
    id: string;
    level: 'primary' | 'secondary';
    grade: number;
    section: string;
    class_code: string;
    schools?: {
        name: string;
    } | {
        name: string;
    }[] | null;
};
export default function TeacherDashboard() {
    const { language, session, signOut } = useAppState();
    const [groups, setGroups] = useState<TeacherGroup[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    useEffect(() => {
        let active = true;
        supabase.from('groups').select('id, level, grade, section, class_code, schools(name)').eq('active', true).then(({ data, error: queryError }) => {
            if (!active)
                return;
            if (queryError)
                setError('No pudimos cargar tus grupos. Revisá tu conexión e intentá de nuevo.');
            else
                setGroups((data ?? []) as unknown as TeacherGroup[]);
            setLoading(false);
        });
        return () => { active = false; };
    }, []);
    const displayName = session.kind === 'staff' ? session.displayName.split(' ')[0] : '';
    return <Screen><View style={local.header}><PioMark small pose="hello"/><View><Text style={local.hello}>{t('hello', language)}, {displayName}</Text><Text style={local.meta}>Siento y Crezco</Text></View></View><SectionTitle title={t('yourGroups', language)} body={t('chooseGroup', language)}/>
    {loading ? <ActivityIndicator color={palette.teacherBlue}/> : null}
    {error ? <Text accessibilityRole="alert" style={local.error}>{error}</Text> : null}
    {!loading && !error && groups.length === 0 ? <Card><Text style={local.emptyTitle}>{t('noGroups', language)}</Text><Text style={local.meta}>{language === 'en' ? 'Your groups will appear here when assigned.' : language === "miq" ? toMiskituDraft('Cuando el equipo te asigne uno, va a aparecer aquí.') : 'Cuando el equipo te asigne uno, va a aparecer aquí.'}</Text></Card> : null}
    {groups.map((group) => { const school = Array.isArray(group.schools) ? group.schools[0]?.name : group.schools?.name; return <Pressable accessibilityRole="button" key={group.id} onPress={() => router.push({ pathname: '/teacher/group', params: { groupId: group.id } })}><Card tone="sky"><Text style={local.className}>{group.grade}.º {group.section} · {group.level === 'primary' ? 'Primaria' : 'Secundaria'}</Text><Text style={local.meta}>{school ?? 'Centro educativo'} · Código {group.class_code}</Text><Text style={local.open}>Abrir grupo  ›</Text></Card></Pressable>; })}
    <Button title="Cerrar sesión" variant="ghost" onPress={async () => { await signOut(); router.replace('/access'); }}/>
  </Screen>;
}
const local = StyleSheet.create({ header: { flexDirection: 'row', alignItems: 'center', gap: 11 }, hello: { color: palette.ink, fontFamily: 'Baloo2_700Bold', fontSize: 22 }, meta: { color: palette.muted, fontFamily: 'Nunito_400Regular', marginTop: 2 }, className: { color: palette.ink, fontFamily: 'Baloo2_700Bold', fontSize: 20 }, open: { color: palette.teacherBlue, fontFamily: 'Nunito_800ExtraBold', fontSize: 12, marginTop: 2 }, emptyTitle: { color: palette.ink, fontFamily: 'Baloo2_700Bold', fontSize: 18 }, error: { color: '#B23551', fontFamily: 'Nunito_700Bold', textAlign: 'center' } });
