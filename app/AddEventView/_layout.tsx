import { Stack } from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function AddEventViewLayout() {
  return <Stack screenOptions={{
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
    }} />;
}
