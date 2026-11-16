import { Stack, usePathname } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { StudentNav } from '@/components/student-nav';

// Las secciones principales conservan un desplazamiento lateral visible para
// que el cambio desde la barra inferior se sienta como un recorrido continuo.
export default function StudentLayout() {
  const pathname = usePathname();
  const hasStudentNav = ['/student/home', '/student/week', '/student/garden', '/student/profile', '/student/cards', '/student/offline'].includes(pathname);
  return <View style={styles.root}>
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home" options={{ animation: 'fade', animationDuration: 180 }} />
      <Stack.Screen name="week" options={{ animation: 'fade', animationDuration: 180 }} />
      <Stack.Screen name="garden" options={{ animation: 'fade', animationDuration: 180 }} />
      <Stack.Screen name="profile" options={{ animation: 'fade', animationDuration: 180 }} />
    </Stack>
    {hasStudentNav ? <SafeAreaView edges={['bottom']} style={styles.navOverlay}><StudentNav /></SafeAreaView> : null}
  </View>;
}

const styles = StyleSheet.create({ root: { flex: 1 }, navOverlay: { position: 'absolute', left: 0, right: 0, bottom: 0 } });
