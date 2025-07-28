import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, useWindowDimensions, Image, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { router } from "expo-router";
import { useDispatch } from 'react-redux';
import { setProfile } from '../../Redux/features/profileSlice';
import { signupAndFetchProfile } from '../../utils/fetchAPI';
import { useTranslation } from 'react-i18next';
import styles from './styles';

export default function SignupView() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const { width } = useWindowDimensions();
  const { t } = useTranslation();

  const validateAndSignup = async () => {
    if (!firstName.match(/^[a-zA-Z-]+$/)) {
      setError(t('invalidFirstOrLastName'));
      return;
    }
    if (!lastName.match(/^[a-zA-Z]+$/)) {
      setError(t('invalidFirstOrLastName'));
      return;
    }
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError(t('invalidEmailFormat'));
      return;
    }
    if (password.length < 8 || !/[0-9]/.test(password) || !/[!@#$%^&*]/.test(password)) {
      setError(t('invalidPasswordFormat'));
      return;
    }
    if (!process.env.EXPO_PUBLIC_API_SERVER_IP) {
      setError(t('serverMisconfiguration'));
      return;
    }
    try {
      const data = await signupAndFetchProfile(
        firstName,
        lastName,
        email,
        password,
        process.env.EXPO_PUBLIC_MISSION_API_SERVER_IP || process.env.EXPO_PUBLIC_API_SERVER_IP,
        dispatch,
        setProfile
      );
      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
      setError('');
      // Check isActive and route accordingly
      if (data.is_activated === false) {
        router.push({ pathname:'/EmailVerify', params: { token: data.token } });
        return;
      }
      router.push('/(tabs)');
    } catch (error: any) {
      setError(error.message || t('serverGeneralError'));
    } finally {
      setPassword('');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView contentContainerStyle={styles.inner}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={{
              width: width * 0.25,
              height: width * 0.25,
              resizeMode: 'contain',
              marginBottom: 16,
              alignSelf: 'center',
            }}
          />
          <Text style={styles.logo}>{t('appTitle')}</Text>
          <TextInput
            style={styles.input}
            placeholder={t('firstNameLabel')}
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            style={styles.input}
            placeholder={t('lastNameLabel')}
            value={lastName}
            onChangeText={setLastName}
          />
          <TextInput
            style={styles.input}
            placeholder={t('emailLabel')}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder={t('passwordLabel')}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          {(error.includes(t('errorCode_invalid')) || error.includes(t('errorCode_server')) ) && <Text style={styles.error}>{error}</Text>}
          <TouchableOpacity style={styles.button} onPress={validateAndSignup}>
            <Text style={styles.buttonText}>{t('signUpLabel')}</Text>
          </TouchableOpacity>
          <Text style={styles.link} onPress={() => router.push('/LoginView')}>{t('loginLink')}</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
