import { Redirect } from 'expo-router';

export default function Index() {
  // In a real app, you would check if user is logged in
  // For now, we'll redirect to onboarding
  return <Redirect href="/(onboarding)" />;
}