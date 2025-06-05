import { saveData } from './storage';

export async function loginAndFetchProfile(email: string, password: string, apiServerIp: string) {
  const loginUrl = `http://${apiServerIp}:3133/auth/login`;
  const profileUrl = `http://${apiServerIp}:3133/auth/me`;

  const response = await fetch(loginUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  if (data.error || !data.token) {
    throw new Error('Invalid email or password');
  }
  await saveData('userToken', data.token);

  const profileResponse = await fetch(profileUrl, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${data.token}`,
      'Content-Type': 'application/json',
    },
  });
  const profile = await profileResponse.json();
  return { token: data.token, profile };
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
  const signupUrl = `http://${apiServerIp}:3133/auth/register`;
  const response = await fetch(signupUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ first_name: firstName, last_name: lastName, email, password }),
  });
  const data = await response.json();
  if (data.errors || !data.token) {
    throw new Error(data.error || 'Invalid email or password');
  }
  await saveData('userToken', data.token);
  dispatch(setProfile({ first_name: data.first_name, last_name: data.last_name, email: data.email }));
  return data;
}

export async function updateProfile(user: any, userToken: string, apiServerIp: string) {
  const url = `http://${apiServerIp}:3133/auth/me`;
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${userToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });
  return response.json();
}

export async function updatePassword(
  currentPassword: string,
  confirmPassword: string,
  userToken: string,
  apiServerIp: string
) {
  const url = `http://${apiServerIp}:3133/auth/me/password`;
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${userToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      new_password: currentPassword,
      confirm_password: confirmPassword,
    }),
  });
  return response.json();
}

export async function logout(userToken: string, apiServerIp: string) {
  const url = `http://${apiServerIp}:3133/auth/logout`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${userToken}`,
      'Content-Type': 'application/json',
    },
  });
  return response.json();
}