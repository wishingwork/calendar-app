// app/(tabs)/index.tsx
import { Redirect } from 'expo-router';

export default function RedirectToHome() {
  return <Redirect href="/(tabs)/CalendarView" />;
}
