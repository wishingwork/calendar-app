import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  return <Tabs
    screenOptions={{
        tabBarActiveTintColor: "#ffd33d",
        headerStyle: {
            backgroundColor: "#25292e",
        },
        headerShadowVisible : false,
        headerTintColor: "#fff",
        tabBarStyle: {
            backgroundColor: "#25292e",
        }
    }}
  >
    <Tabs.Screen 
        name="index" 
        options={{ 
            headerTitle: "Calendar app", 
            tabBarIcon: ({focused, color}) => (
                <Ionicons 
                    name={ focused ? "home-sharp" : "home-outline"} 
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
            tabBarIcon: ({focused, color}) => (
                <Ionicons 
                    name={ focused ? "list-sharp" : "list-outline"} 
                    color={color}
                    size={24} 
                />
            ),            
        }} 
    />    
  </Tabs>;
}
