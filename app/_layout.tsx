import { Stack } from "expo-router";
import { LogBox } from "react-native";
import ReduxProvider from "./ReduxProvider";

LogBox.ignoreAllLogs(true);

export default function RootLayout() {
  return (
    <ReduxProvider>
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: "rgb(250 248 244 / var(--tw-bg-opacity, 1))" },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{}} />
        <Stack.Screen name="LoginView" options={{ headerShown: false }} />
        <Stack.Screen name="SignupView" options={{ headerShown: false }} />
      </Stack>
    </ReduxProvider>
  );
}
