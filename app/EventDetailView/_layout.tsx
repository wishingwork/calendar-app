import { Stack, router } from 'expo-router';
import { loadData } from '../../utils/storage';

import React, { useEffect } from "react";

export default function EventDetailViewLayout() {
  // Check for userToken and redirect to LoginView if not present
  useEffect(() => {
    loadData('userToken').then(token => {
      if (!token) {
        router.replace('/LoginView');
      }
    });
  }, []);

  return (
   <Stack screenOptions={{headerShown: false}} />

  );
}
