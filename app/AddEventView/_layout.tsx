import { Stack, router } from 'expo-router';
import { loadData } from '../../utils/storage';

import React, { useEffect } from "react";
export const unstable_settings = {
  initialRouteName: 'index',
};

export default function AddEventViewLayout() {
  // Check for userToken and redirect to LoginView if not present
  useEffect(() => {
    loadData('userToken').then(token => {
      if (!token) {
        router.replace('/LoginView');
      }
    });
  }, []);

  return <Stack screenOptions={{headerShown: false}} />;

}
