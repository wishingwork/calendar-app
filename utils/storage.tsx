import * as SecureStore from 'expo-secure-store';

export async function saveData(key: string, value: string) {
  const isAvailable = await SecureStore.isAvailableAsync();
  if (!isAvailable) {
    localStorage.setItem(key, value);
    return;
  }
  await SecureStore.setItemAsync(key, value);
}

export async function loadData(key: string) {
  const isAvailable = await SecureStore.isAvailableAsync();
  if (!isAvailable) {
    return localStorage.getItem(key);
  }
  return await SecureStore.getItemAsync(key);
}

export async function deleteData(key: string) {
  const isAvailable = await SecureStore.isAvailableAsync();
  if (!isAvailable) {
    localStorage.removeItem(key);
    return;
  }
  await SecureStore.deleteItemAsync(key);
}