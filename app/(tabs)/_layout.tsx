import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, TouchableOpacity } from 'react-native';
import { ModalProvider, useModal } from '../ModalContext';
import { CalendarModeProvider, useCalendarMode } from '../CalendarModeContext';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../Redux/store';
import { loadData, deleteData } from '../../utils/storage';
import { router } from "expo-router";
import { logout as apiLogout } from '../../utils/fetchAPI';

import React, { useEffect, useState } from "react";
import CalendarModeModal from '../Modals/CalendarModeModal';
import LogoutModal from '../Modals/LogoutModal';
import { clearProfile } from '../../Redux/features/profileSlice';

function TabLayoutInner() {
  const dispatch = useDispatch();
  const { setModalVisible, setModalContent } = useModal();
  const { calendarMode, setCalendarMode } = useCalendarMode();
  const [token, setToken] = useState<string>('');
  const profile = useSelector((state: RootState) => state.profile.profile) as {is_activated: boolean} | null;

  useEffect(() => {
    loadData('userToken').then(userTokenRaw => {
      setToken(userTokenRaw || '');
    });
  }, []);

  useEffect(() => {
    if (profile && profile.is_activated === false && token) {
      router.push({ pathname:'/EmailVerify', params: { token } });
    }
  }, [profile, token]);

  // Universal logout handler for modal
  const handleLogout = async () => {
    setModalVisible(false);
    const userTokenRaw = await loadData('userToken');
    const userToken = userTokenRaw || '';
    apiLogout(userToken, process.env.EXPO_PUBLIC_API_SERVER_IP as string)
      .then(async () => {
        await deleteData('userToken');
        dispatch(clearProfile());
        router.push('/LoginView');
      })
      .catch((err) => {
        console.log(49,err);
        // Optionally handle error globally
      });
  };

  if (profile && profile.is_activated === false) {
    return null;
  }

  return <Tabs
    screenOptions={{
        tabBarActiveTintColor: "#0077CC",
        tabBarInactiveTintColor: "#aaa",
        headerStyle: {
            backgroundColor: "#FAF8F4",
            elevation: 0, // Android - removes shadow
            shadowOpacity: 0, // iOS - just in case
            borderBottomWidth: 0, // removes border            
        },
        headerShadowVisible : false,
        headerTintColor: "#0077CC",
        tabBarStyle: {
          backgroundColor: "#FAF8F4",
          borderTopWidth: 0, // removes top border
          elevation: 0, // Android - removes tab bar shadow
          shadowOpacity: 0, // iOS - shadow transparency
        },        
    }}
  >
    <Tabs.Screen 
        name="CalendarView" 
        options={{ 
            headerTitle: "Calendar",
            tabBarLabel: "Calendar",
            headerRight: () => (
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  onPress={() => {
                    setModalContent(
                      <CalendarModeModal
                        calendarMode={calendarMode}
                        setCalendarMode={(mode) => {
                          setCalendarMode(mode);
                          setModalVisible(false);
                        }}
                      />
                    );
                    setModalVisible(true);
                  }}
                  style={{ marginRight: 16 }}
                >
                  <Ionicons name="options-outline" size={24} color="#0077CC" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => router.push("AddEventView")}
                  style={{ marginRight: 16 }}
                  accessibilityLabel="Add Event"
                >
                  <Ionicons name="add-circle-outline" size={24} color="#0077CC" />
                </TouchableOpacity>                
              </View>
            ),
            tabBarIcon: ({focused, color}) => (
                <Ionicons 
                    name={ focused ? "calendar-sharp" : "calendar-outline"} 
                    color={color}
                    size={24} 
                />
            ),
        }} 
    />
    <Tabs.Screen 
        name="TimelineView" 
        options={{ 
            headerTitle: "Timeline",
            tabBarLabel: "Timeline",
            headerRight: () => (
              <TouchableOpacity
                onPress={() => router.push("AddEventView")}
                style={{ marginRight: 16 }}
                accessibilityLabel="Add Event"
              >
                <Ionicons name="add-circle-outline" size={24} color="#0077CC" />
              </TouchableOpacity>
            ),            
            tabBarIcon: ({focused, color}) => (
                <Ionicons 
                    name={ focused ? "list-sharp" : "list-outline"} 
                    color={color}
                    size={24} 
                />
            ),            
        }} 
    />    
      <Tabs.Screen
        name="ProfileView"
        options={{
          title: 'Profile',
          tabBarLabel: "Profile",
          headerRight: () => (
            <TouchableOpacity onPress={() => {
             setModalContent(<LogoutModal onLogout={handleLogout} />);
             setModalVisible(true)
            }} style={{ marginRight: 15 }}>
              <Ionicons name="information-circle-outline" size={24} color="#0077CC" />
            </TouchableOpacity>
          ),
          tabBarIcon: ({focused, color}) => (
              <Ionicons 
                  name={ focused ? "person-circle" : "person-circle-outline"} 
                  color={color}
                  size={24} 
              />
          ),             
        }}
      />    
      <Tabs.Screen
        name="index"
        options={{
          href: null, // Hides the tab from the bottom tab bar
        }}
      />      
  </Tabs>;
}

export default function TabLayout() {
  return (
    <ModalProvider>
      <CalendarModeProvider>
        <TabLayoutInner />
      </CalendarModeProvider>
    </ModalProvider>
  );
}