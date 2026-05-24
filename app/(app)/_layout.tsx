import { Redirect, Stack } from 'expo-router';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { useAuthStore } from '@/store/authStore';

export default function AppLayout() {
  const { isAuthenticated, isHydrating } = useAuthStore();

  if (isHydrating) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/welcome" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
