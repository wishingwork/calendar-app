import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, useWindowDimensions, Image, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { router } from "expo-router";
import { useDispatch } from 'react-redux';
import { setProfile } from '../../Redux/features/profileSlice';
import { loginAndFetchProfile } from '../../utils/fetchAPI';
import { useTranslation } from 'react-i18next';
import styles from './styles';

export default function LoginView() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const { width } = useWindowDimensions();
  const { t } = useTranslation();
 
  const validateAndLogin = async () => {
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError(t('invalidEmailOrPassword'));
      return;
    }
    if (password.length < 8 || !/[0-9]/.test(password) || !/[!@#$%^&*]/.test(password)) {
      setError(t('invalidEmailOrPassword'));
      return;
    }
    if (!process.env.EXPO_PUBLIC_API_SERVER_IP) {
      setError(t('serverMisconfiguration'));
      return;
    }
    try {
      const { profile, token } = await loginAndFetchProfile(email, password, process.env.EXPO_PUBLIC_MISSION_API_SERVER_IP || process.env.EXPO_PUBLIC_API_SERVER_IP);
      if (profile) {
        dispatch(setProfile(profile));
        // Check isActive and route accordingly
        if (profile.is_activated === false) {
          router.push({ pathname:'/EmailVerify', params: { token } });
          return;
        }
        router.push('/(tabs)');
      }
      setEmail('');
      setPassword('');
      setError('');
    } catch (error: any) {
      setError(error.message || 'A server error occurred. Please try again.');
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
        <View style={styles.container}>
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
            <View style={[styles.featureBlock, { borderColor: '#FF5733' }]}>
            <Text style={styles.featureText}>🌤️ {t('calendarViewFeature')}</Text>
            <Text style={styles.featureDescription}>{t('calendarViewDescription')}</Text>
            </View>
            <View style={[styles.featureBlock, { borderColor: '#33C1FF' }]}>
            <Text style={styles.featureText}>🗺️ {t('tripTimelineFeature')}</Text>
            <Text style={styles.featureDescription}>{t('tripTimelineDescription')}</Text>
            </View>
            <View style={[styles.featureBlock, { borderColor: '#33FF57' }]}>
            <Text style={styles.featureText}>✈️ {t('travelPlanningFeature')}</Text>
            <Text style={styles.featureDescription}>{t('travelPlanningDescription')}</Text>
            </View>
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
          {error.includes('email') && <Text style={styles.error}>{error}</Text>}
          <TouchableOpacity style={styles.button} onPress={validateAndLogin}>
            <Text style={styles.buttonText}>{t('signInLabel')}</Text>
          </TouchableOpacity>
          {(error.includes('server') || error.includes('Server')) && <Text style={styles.error}>{error}</Text>}
          <Text style={styles.link} onPress={() => router.push('/SignupView')}>{t('signupLink')}</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}