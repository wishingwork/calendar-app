import { Stack } from "expo-router";
import { LogBox } from "react-native";
import ReduxProvider from "./ReduxProvider";

LogBox.ignoreAllLogs(true);

export default function RootLayout() {
  return (
    <ReduxProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{}} />
      </Stack>
    </ReduxProvider>
  );
}
