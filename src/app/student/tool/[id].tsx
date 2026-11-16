import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text, TextInput } from '@/components/localized-native';

import { BrandIcon, Button, Screen, palette } from '@/components/pio-ui';
import { toolboxItems } from '@/features/student/toolbox-content';

const RULES_KEY = 'pio:secondary:screen-rules';
const CHECKS_KEY = 'pio:secondary:screen-rules-checks';
const fallbackRules = ['Nada de celular en la mesa', 'Apago a las 9', 'Pregunto antes de subir fotos'];

export default function ToolDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const item = toolboxItems.find((candidate) => candidate.id === id) ?? toolboxItems[0];
  if (item.id !== 'screen-rules') return <GenericTool item={item} />;
  return <ScreenRulesTool />;
}

function ScreenRulesTool() {
  const [editing, setEditing] = useState(false);
  const [rules, setRules] = useState(fallbackRules);
  const [checks, setChecks] = useState([true, true, false, true, false, false, false]);
  const [saved, setSaved] = useState(false);
  useEffect(() => { void Promise.all([AsyncStorage.getItem(RULES_KEY), AsyncStorage.getItem(CHECKS_KEY)]).then(([savedRules, savedChecks]) => { try { if (savedRules) { const parsed = JSON.parse(savedRules) as { rules?: string[] }; if (parsed.rules?.length) setRules(parsed.rules.slice(0, 3)); } if (savedChecks) setChecks(JSON.parse(savedChecks) as boolean[]); } catch { /* keep safe defaults */ } }); }, []);
  const updateRule = (index: number, text: string) => setRules((current) => current.map((rule, ruleIndex) => ruleIndex === index ? text : rule));
  const save = async () => { await Promise.all([AsyncStorage.setItem(RULES_KEY, JSON.stringify({ rules, savedAt: new Date().toISOString() })), AsyncStorage.setItem(CHECKS_KEY, JSON.stringify(checks))]); setEditing(false); setSaved(true); };
  return <Screen color="#F7F5F2">
    <View style={styles.top}><Pressable onPress={() => router.back()} style={styles.round}><BrandIcon name="back" color={palette.ink} /></Pressable><Text style={styles.meta}>PLAN · SEMANA 2</Text><Pressable onPress={() => setEditing((value) => !value)} style={styles.edit}><Text style={styles.editText}>{editing ? 'Cancelar' : 'Editar'}</Text></Pressable></View>
    <View style={styles.titleRow}><View><Text style={styles.title}>Mis 3 reglas de{`\n`}pantalla</Text><Text style={styles.subtitle}>Las armaste en «Mi vida en las redes».</Text></View><BrandIcon name="traffic" color={palette.ink} size={62} /></View>
    <View style={styles.rules}>{rules.map((rule, index) => <View key={index} style={styles.rule}><View style={styles.ruleNumber}><Text style={styles.ruleNumberText}>{index + 1}</Text></View><View style={styles.ruleCopy}>{editing ? <TextInput value={rule} maxLength={60} onChangeText={(text) => updateRule(index, text)} style={styles.input} /> : <Text style={styles.ruleTitle}>{rule}</Text>}<Text style={styles.ruleHint}>{index === 0 ? 'Cuando comemos en familia.' : index === 1 ? 'Lo dejo cargando fuera del cuarto.' : 'De otras personas, siempre.'}</Text></View></View>)}</View>
    <View style={styles.weekCard}><Text style={styles.sectionLabel}>¿CÓMO TE FUE ESTA SEMANA?</Text><View style={styles.days}>{['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, index) => <Pressable key={`${day}-${index}`} onPress={() => { setSaved(false); setChecks((current) => current.map((value, checkIndex) => checkIndex === index ? !value : value)); }} style={styles.dayWrap}><View style={[styles.dayBox, checks[index] && styles.dayChecked]}><Text style={styles.check}>{checks[index] ? '✓' : ''}</Text></View><Text style={styles.day}>{day}</Text></Pressable>)}</View><Text style={styles.weekHint}>Marcá los días que cumpliste tus reglas. Nadie más lo ve.</Text></View>
    <View style={styles.reminder}><View style={styles.reminderIcon}><BrandIcon name="heart" color={palette.ink} /></View><View style={styles.reminderCopy}><Text style={styles.reminderTitle}>Pío te recuerda</Text><Text style={styles.reminderText}>Si te cuesta cumplirlas, está bien. Podés cambiarlas cuando querás.</Text></View></View>
    {saved ? <Text style={styles.saved}>✓ Cambios guardados solo en tu caja.</Text> : null}
    <View style={styles.bottom}><Button title={editing ? 'Guardar cambios' : 'Listo'} variant="secondary" onPress={() => { if (editing || !saved) void save(); else router.back(); }} /></View>
  </Screen>;
}

function GenericTool({ item }: { item: (typeof toolboxItems)[number] }) {
  const [saved, setSaved] = useState(false);
  return <Screen color="#F7F5F2"><View style={styles.top}><Pressable onPress={() => router.back()} style={styles.round}><BrandIcon name="back" color={palette.ink} /></Pressable><Text style={[styles.meta, { color: item.color }]}>SEMANA {item.week}</Text><View style={styles.round} /></View><View style={[styles.genericHero, { borderColor: item.color }]}><BrandIcon name={item.icon} color={item.color} size={70} /><Text style={styles.title}>{item.title}</Text><Text style={styles.genericBody}>{item.description}</Text></View><View style={styles.reminder}><View style={styles.reminderIcon}><BrandIcon name="lock" color={palette.ink} /></View><View style={styles.reminderCopy}><Text style={styles.reminderTitle}>Solo vos la ves</Text><Text style={styles.reminderText}>Esta herramienta queda guardada para usarla cuando la necesités.</Text></View></View>{saved ? <Text style={styles.saved}>✓ Herramienta marcada como repasada.</Text> : null}<View style={styles.bottom}><Button title={saved ? 'Volver a mi caja' : 'La repasé'} variant="secondary" onPress={() => saved ? router.back() : setSaved(true)} /></View></Screen>;
}

const styles = StyleSheet.create({
  top: { minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 }, round: { width: 42, height: 42, borderRadius: 21, borderWidth: 1.5, borderColor: palette.line, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center' }, meta: { flex: 1, textAlign: 'center', color: '#1CABE2', fontFamily: 'Nunito_800ExtraBold', fontSize: 11, letterSpacing: 1.6 }, edit: { minWidth: 65, height: 42, paddingHorizontal: 12, borderRadius: 21, borderWidth: 1.5, borderColor: palette.line, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center' }, editText: { color: palette.ink, fontFamily: 'Nunito_800ExtraBold', fontSize: 12 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, title: { color: palette.ink, fontFamily: 'Baloo2_700Bold', fontSize: 30, lineHeight: 32 }, subtitle: { color: '#8A837A', fontFamily: 'Nunito_400Regular', fontSize: 12, marginTop: 7 }, rules: { borderRadius: 22, padding: 14, backgroundColor: '#FFF', gap: 14, shadowColor: '#55493E', shadowOpacity: .07, shadowRadius: 9, elevation: 2 }, rule: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' }, ruleNumber: { width: 37, height: 37, borderRadius: 19, backgroundColor: palette.ink, alignItems: 'center', justifyContent: 'center' }, ruleNumberText: { color: '#FFF', fontFamily: 'Nunito_800ExtraBold', fontSize: 15 }, ruleCopy: { flex: 1, paddingTop: 2 }, ruleTitle: { color: palette.ink, fontFamily: 'Nunito_800ExtraBold', fontSize: 15 }, ruleHint: { color: '#8B847B', fontFamily: 'Nunito_400Regular', fontSize: 11, lineHeight: 16, marginTop: 3 }, input: { borderWidth: 1.5, borderColor: '#1CABE2', borderRadius: 10, minHeight: 38, paddingHorizontal: 10, color: palette.ink, fontFamily: 'Nunito_700Bold', fontSize: 13 },
  weekCard: { borderRadius: 22, padding: 15, backgroundColor: '#FFF', gap: 12 }, sectionLabel: { color: '#8A837A', fontFamily: 'Nunito_800ExtraBold', fontSize: 10, letterSpacing: 1.6 }, days: { flexDirection: 'row', justifyContent: 'space-between' }, dayWrap: { alignItems: 'center', gap: 5 }, dayBox: { width: 34, height: 34, borderRadius: 10, backgroundColor: '#EEEAE5', alignItems: 'center', justifyContent: 'center' }, dayChecked: { backgroundColor: '#80BD41' }, check: { color: '#FFF', fontFamily: 'Nunito_800ExtraBold', fontSize: 17 }, day: { color: '#8B847B', fontFamily: 'Nunito_700Bold', fontSize: 10 }, weekHint: { color: '#8B847B', fontFamily: 'Nunito_400Regular', fontSize: 11, lineHeight: 16 }, reminder: { borderLeftWidth: 5, borderLeftColor: '#80BD41', borderRadius: 20, backgroundColor: '#FFF', padding: 14, flexDirection: 'row', gap: 11, alignItems: 'center' }, reminderIcon: { width: 46, height: 46, borderRadius: 15, backgroundColor: '#DDF3FA', alignItems: 'center', justifyContent: 'center' }, reminderCopy: { flex: 1 }, reminderTitle: { color: palette.ink, fontFamily: 'Nunito_800ExtraBold', fontSize: 14 }, reminderText: { color: '#66708D', fontFamily: 'Nunito_400Regular', fontSize: 11, lineHeight: 16, marginTop: 3 }, saved: { color: '#3B6F28', backgroundColor: '#EAF4DF', borderRadius: 12, padding: 10, fontFamily: 'Nunito_700Bold', fontSize: 11 }, bottom: { marginTop: 'auto', paddingTop: 10 }, genericHero: { minHeight: 300, borderRadius: 28, borderWidth: 3, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', padding: 28, gap: 16 }, genericBody: { color: '#716B64', fontFamily: 'Nunito_400Regular', fontSize: 15, lineHeight: 22, textAlign: 'center' },
});
