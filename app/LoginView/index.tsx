import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, useWindowDimensions, Image, KeyboardAvoidingView, ScrollView, Platform, ActivityIndicator } from 'react-native';
import Constants from 'expo-constants';
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
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { width } = useWindowDimensions();
  const { t } = useTranslation();
 
  const validateAndLogin = async () => {
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError(t('invalidEmailOrPassword'));
      return;
    }
    if (password.length < 8 || !/[0-9]/.test(password) || !/[!@#$%^&*()_+\-=\[\]{}|;:'",.<>/?`~]/.test(password)) {
      setError(t('invalidEmailOrPassword'));
      return;
    }
    if (!process.env.EXPO_PUBLIC_API_SERVER_IP) {
      setError(t('serverMisconfiguration'));
      return;
    }
    setLoading(true);
    try {
      const { profile, token } = await loginAndFetchProfile(email, password, process.env.EXPO_PUBLIC_MISSION_API_SERVER_IP || process.env.EXPO_PUBLIC_API_SERVER_IP);
      if (profile) {
        dispatch(setProfile(profile));
        // Check isActive and route accordingly
        if (profile.is_activated === false) {
          router.replace({ pathname:'/EmailVerify', params: { token } });
          return;
        }
        router.replace('/(tabs)');
      }
      setEmail('');
      setPassword('');
      setError('');
    } catch (error: any) {
      setError(error.message || t('serverGeneralError'));
    } finally {
      setPassword('');
      setLoading(false);
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
          placeholderTextColor="#999"
        />
        <TextInput
          style={styles.input}
          placeholder={t('passwordLabel')}
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#999"
          secureTextEntry
        />
        {(error.includes(t('errorCode_email')) || error.includes(t('errorCode_server'))) && <Text style={styles.error}>{error}</Text>}
        <TouchableOpacity style={styles.button} onPress={validateAndLogin} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>{t('signInLabel')}</Text>
          )}
        </TouchableOpacity>
        <Text style={styles.link} onPress={() => router.replace('/SignupView')}>{t('signupLink')}</Text>
        <Text style={styles.versionText}>App Version: {Constants.expoConfig.version}</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}