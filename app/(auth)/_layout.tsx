import { Redirect, Stack } from 'expo-router';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { useAuthStore } from '@/store/authStore';

export default function AuthLayout() {
  const { isAuthenticated, isHydrating } = useAuthStore();

  if (isHydrating) {
    return <LoadingScreen message="Starting AgroTech..." />;
  }

  if (isAuthenticated) {
    return <Redirect href="/(app)/(tabs)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}
