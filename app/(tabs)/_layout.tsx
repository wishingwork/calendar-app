import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from 'react-native';
import { ModalProvider, useModal } from './ModalContext';

function TabLayoutInner() {
  const { setModalVisible } = useModal();

  return <Tabs
    screenOptions={{
        tabBarActiveTintColor: "#0077CC",
        tabBarInactiveTintColor: "#aaa",
        headerStyle: {
            backgroundColor: "rgb(250 248 244 / var(--tw-bg-opacity, 1))",
        },
        headerShadowVisible : false,
        headerTintColor: "#0077CC",
        tabBarStyle: {
            backgroundColor: "rgb(250 248 244 / var(--tw-bg-opacity, 1))",
        }
    }}
  >
    <Tabs.Screen 
        name="index" 
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
        name="add-event" 
        options={{ 
            headerTitle: "Add Event",
            tabBarLabel: "Add Event",
            tabBarIcon: ({focused, color}) => (
                <Ionicons 
                    name={ focused ? "add-circle-outline" : "add-circle-outline" } 
                    color={color}
                    size={24} 
                />
            ),            
        }} 
    />
    <Tabs.Screen 
        name="timeline" 
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
        name="Profile"
        options={{
          title: 'Profile',
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