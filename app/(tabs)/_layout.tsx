import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from 'react-native';
import { ModalProvider, useModal } from '../ModalContext';
import { useSelector } from 'react-redux';
import { RootState } from '../../Redux/store';
import { loadData } from '../../utils/storage';
import { router } from "expo-router";

import React, { useEffect, useState } from "react";

function TabLayoutInner() {
  const { setModalVisible } = useModal();
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
            <TouchableOpacity onPress={() => setModalVisible(true)} style={{ marginRight: 15 }}>
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
  </Tabs>;
}
export default function TabLayout() {
  return (
    <ModalProvider>
      <TabLayoutInner />
    </ModalProvider>
  );
}