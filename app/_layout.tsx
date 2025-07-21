import { Stack } from "expo-router";
import { LogBox } from "react-native";
import ReduxProvider from "../Redux/ReduxProvider";
import { ModalProvider } from './ModalContext';
import DeleteEventHeaderButton from './DeleteEventHeaderButton';
import i18n from '../utils/i18n'; // Must come before App
import { I18nextProvider } from 'react-i18next';
import { useTranslation } from 'react-i18next';
LogBox.ignoreAllLogs(true);

function RootLayoutInner() {
  const { t } = useTranslation();
  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: "rgb(250 248 244 / var(--tw-bg-opacity, 1))" },
        headerShown: false
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" options={{headerShown: true }} />
      <Stack.Screen name="AddEventView" options={{ 
        title: t('addEventTitle'), headerShown: true, 
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
      <Stack.Screen name="EventDetailView" options={{ 
        title: t('eventDetailTitle'), headerShown: true, 
        headerBackButtonDisplayMode: 'minimal',        
        headerStyle: {
          backgroundColor: "#FAF8F4",
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,         
        },
        headerShadowVisible : false,
        headerTintColor: "#0077CC",  
        headerRight: () => <DeleteEventHeaderButton />,           
      }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <ReduxProvider>
      <I18nextProvider i18n={i18n}>
        <ModalProvider>
          <RootLayoutInner />
        </ModalProvider>
      </I18nextProvider>
    </ReduxProvider>
  );
}
