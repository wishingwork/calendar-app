import { saveData } from './storage';
import * as Localization from 'expo-localization'; // Optional if using Expo
const language = Localization.getLocales()[0].languageTag.split('-')[0]; // Get the language code (e.g., 'en', 'zh')
async function doFetch({
  url,
  method = 'GET',
  headers = {},
  body,
}: {
  url: string;
  method?: string;
  headers?: Record<string, string>;
  body?: any;
}) {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };
  if (body) {
    options.body = JSON.stringify(body);
  }
  const response = await fetch(url, options);
  const data = await response.json();
  if (data.error || data.errors) {
    throw new Error(data.error || data.errors || 'A server error occurred');
  }
  return data;
}

export async function loginAndFetchProfile(email: string, password: string, apiServerIp: string) {
  const loginUrl = `${apiServerIp}/auth/login`;
  const profileUrl = `${apiServerIp}/auth/me`;
  const { data: loginData  } = await doFetch({
    url: loginUrl,
    method: 'POST',
    body: { email, password },
  });
  if (!loginData.token) {
    throw new Error('Invalid email or password');
  }
  await saveData('userToken', loginData.token);
  const { data } = await doFetch({
    url: profileUrl,
    method: 'GET',
    headers: { 'Authorization': `Bearer ${loginData.token}` },
  });
  return { profile: data.profile, token: loginData.token };
}

export async function signupAndFetchProfile(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  apiServerIp: string,
  dispatch: any,
  setProfile: any
) {
  const signupUrl = `${apiServerIp}/auth/register`;
  const {message, data} = await doFetch({
    url: signupUrl,
    method: 'POST',
    body: { first_name: firstName, last_name: lastName, email, password, language },
  });
  if (!data) {
    throw new Error(message || 'Invalid email or password');
  }
  await saveData('userToken', data.token);
  if (dispatch && setProfile) {
    dispatch(setProfile({ first_name: data.first_name, last_name: data.last_name, email: data.email, is_activated: data.is_activated }));
  }
  return data;
}

export async function updateProfile(user: any, userToken: string, apiServerIp: string) {
  const url = `${apiServerIp}/auth/me`;
  return doFetch({
    url,
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${userToken}` },
    body: user,
  });
}

export async function updatePassword(
  currentPassword: string,
  confirmPassword: string,
  userToken: string,
  apiServerIp: string
) {
  const url = `${apiServerIp}/auth/me/password`;
  return doFetch({
    url,
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${userToken}` },
    body: {
      new_password: currentPassword,
      confirm_password: confirmPassword,
    },
  });
}

export async function logout(userToken: string, apiServerIp: string) {
  const url = `${apiServerIp}/auth/logout`;
  return doFetch({
    url,
    method: 'POST',
    headers: { 'Authorization': `Bearer ${userToken}` },
  });
}

export async function verifyEmailCode(code: string, userToken: string, apiServerIp: string) {
  return doFetch({
    url: `${apiServerIp}/auth/verifystatus?code=${code}`,
    method: 'GET',
    headers: { 'Authorization': `Bearer ${userToken}` },
  });
}

export async function resendVerificationEmail(email: string, userToken: string, apiServerIp: string) {
  return doFetch({
    url: `${apiServerIp}/auth/verifyemail`,
    method: 'POST',
    headers: { 'Authorization': `Bearer ${userToken}` },
    body: { email, language },
  });
}

export async function createEvent(
  event: { title: string; event_datetime: string; address: string; travel_mode: number },
  token: string
) {
  const apiServerIp = process.env.EXPO_PUBLIC_MISSION_API_SERVER_IP || process.env.EXPO_PUBLIC_API_SERVER_IP || "localhost";
  const url = `${apiServerIp}/events`;
  // Ensure event_datetime is in UTC ISO format
  const utcEventDatetime = new Date(event.event_datetime).toISOString();
  return doFetch({
    url,
    method: "POST",
    headers: { 'Authorization': `Bearer ${token}` },
    body: { ...event, event_datetime: utcEventDatetime },
  });
}

// Delete event by id
export async function deleteEvent(id: string, token: string) {
  const apiServerIp = process.env.EXPO_PUBLIC_MISSION_API_SERVER_IP || process.env.EXPO_PUBLIC_API_SERVER_IP || "localhost";
  const url = `${apiServerIp}/events/${id}`;
  return doFetch({
    url,
    method: "DELETE",
    headers: { 'Authorization': `Bearer ${token}` },
  });
}

export async function fetchEvents(token: string) {
  const apiServerIp = process.env.EXPO_PUBLIC_MISSION_API_SERVER_IP || process.env.EXPO_PUBLIC_API_SERVER_IP || "localhost";
  const url = `${apiServerIp}/events`;
  return doFetch({
    url,
    method: "GET",
    headers: { 'Authorization': `Bearer ${token}` },
  });
}

export async function fetchEventById(id: string, token: string) {
  const apiServerIp = process.env.EXPO_PUBLIC_MISSION_API_SERVER_IP || process.env.EXPO_PUBLIC_API_SERVER_IP || "localhost";
  const url = `${apiServerIp}/events/${id}`;
  const {data} = await doFetch({
    url,
    method: "GET",
    headers: { 'Authorization': `Bearer ${token}` },
  });
  return data;
}

