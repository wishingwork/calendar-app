import * as SecureStore from 'expo-secure-store';

export async function saveData(key: string, value: string) {
  const isAvailable = await SecureStore.isAvailableAsync();
  if (!isAvailable) {
    localStorage.setItem(key, value);
    return;
  }
  await SecureStore.setItemAsync(key, value);
}