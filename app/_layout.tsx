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
          headerShown: false
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{headerShown: true }} />
        <Stack.Screen name="EventDetailView" options={{ 
          headerShown: true, headerBackButtonDisplayMode: 'minimal', 
          headerStyle: {
            backgroundColor: "#FAF8F4",
            elevation: 0, // Android - removes shadow
            shadowOpacity: 0, // iOS - just in case
            borderBottomWidth: 0, // removes border            
          },
          headerShadowVisible : false,
          headerTintColor: "#0077CC",            
          }} />
        <Stack.Screen name="AddEventView" options={{ 
          title:'Add Event', headerShown: true, 
          headerBackButtonDisplayMode: 'minimal',        
          headerStyle: {
            backgroundColor: "#FAF8F4",
            elevation: 0, // Android - removes shadow
            shadowOpacity: 0, // iOS - just in case
            borderBottomWidth: 0, // removes border            
          },
          headerShadowVisible : false,
          headerTintColor: "#0077CC",  
        }} />
      </Stack>
    </ReduxProvider>
  );
}
