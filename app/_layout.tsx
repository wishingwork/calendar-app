import { Stack, useRouter } from "expo-router";
import { LogBox, AppState } from "react-native";
import ReduxProvider from "../Redux/ReduxProvider";
import { ModalProvider } from './ModalContext';
import { AddressProvider } from './AddressContext';
import DeleteEventHeaderButton from './DeleteEventHeaderButton';
import i18n from '../utils/i18n'; // Must come before App
import { I18nextProvider, useTranslation } from 'react-i18next';
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { clearProfile, setProfile } from '../Redux/features/profileSlice';
import { setEvents } from '../Redux/features/eventsSlice';
import { saveData, loadData, deleteData } from '../utils/storage';
import { fetchProfile, fetchEvents } from '../utils/fetchAPI';

LogBox.ignoreAllLogs(true);

function RootLayoutInner() {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();
  const appState = useRef(AppState.currentState);
  const apiServerIp = process.env.EXPO_PUBLIC_API_SERVER_IP || 'localhost';

  useEffect(() => {
    const checkUserSession = async () => {
      const userToken = await loadData('userToken');
      if (userToken) {
        try {
          const profile = await fetchProfile(userToken, apiServerIp);
          const events = await fetchEvents(userToken);
          dispatch(setProfile(profile));
          dispatch(setEvents(events));
        } catch (error) {
          console.error('Failed to fetch user data:', error);
          await deleteData('userToken');
          router.replace('/LoginView');
        }
      } else {
        router.replace('/LoginView');
      }
    };

    checkUserSession();

    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        loadData('backgroundTime').then(backgroundTime => {
          if (backgroundTime) {
            const now = new Date().getTime();
            const diff = now - parseInt(backgroundTime, 10);
            const hours = Math.floor(diff / (1000 * 60 * 60));
            if (hours >= 24) {
              dispatch(clearProfile());
              router.replace('/LoginView');
            }
          }
        });
      }

      appState.current = nextAppState;
      if (appState.current === 'background') {
        saveData('backgroundTime', new Date().getTime().toString());
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: "rgb(250 248 244 / var(--tw-bg-opacity, 1))" },
        headerShown: false
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" options={{headerShown: true }} />
      <Stack.Screen name="AddAddressView" options={{ 
        title: t('addAddress'), headerShown: true, 
        headerBackButtonDisplayMode: 'minimal',        
        headerStyle: {
          backgroundColor: "#FAF8F4",
          elevation: 0, // Android - removes shadow
          shadowOpacity: 0, // iOS - just in case
          borderBottomWidth: 0, // removes border            
        },
        headerShadowVisible : false,
        headerTintColor: "#0077CC",  
      }}  />
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
          <AddressProvider>
            <RootLayoutInner />
          </AddressProvider>
        </ModalProvider>
      </I18nextProvider>
    </ReduxProvider>
  );
}
