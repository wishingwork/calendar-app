import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, useWindowDimensions, Image, KeyboardAvoidingView, ScrollView, Platform, ActivityIndicator } from 'react-native';
import { router } from "expo-router";
import { useTranslation } from 'react-i18next';
import styles from './styles';
import { common } from '../../styles/common';
import * as Localization from 'expo-localization'; // Optional if using Expo
const language = Localization.getLocales()[0].languageTag.split('-')[0]; // Get the language code (e.g., 'en', 'zh')

export default function PasswordResetRequestView() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { width } = useWindowDimensions();
  const { t } = useTranslation();

  const handlePasswordResetRequest = async () => {    
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError(t('invalidEmailFormat'));
      return;
    }

    if (!process.env.EXPO_PUBLIC_API_SERVER_IP) {
      setError(t('serverMisconfiguration'));
      return;
    }

    setLoading(true);
    try {
      const apiServerIp = process.env.EXPO_PUBLIC_MISSION_API_SERVER_IP || process.env.EXPO_PUBLIC_API_SERVER_IP;
      const response = await fetch(`${apiServerIp}/auth/resetcode`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, language }),
      });

      const data = await response.json();
      console.log(61, data);
      if (data.status === 'success') {
        router.replace({ pathname: '/PasswordResetVerifyView', params: { email } });
      } else {
        setError(data.message || t('passwordResetRequestError'));
      }
    } catch (error: any) {
      setError(error.message || t('serverGeneralError'));
    } finally {
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
        <Text style={styles.logo}>{t('resetPasswordTitle')}</Text>
        <Text style={{...common.text, textAlign: 'center', marginBottom: 20}}>{t('resetPasswordInstruction')}</Text>
        <TextInput
          style={styles.input}
          placeholder={t('emailLabel')}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          placeholderTextColor="#999"
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TouchableOpacity style={styles.button} onPress={handlePasswordResetRequest} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>{t('submitButton')}</Text>
          )}
        </TouchableOpacity>
        <Text style={styles.link} onPress={() => router.replace('/LoginView')}>{t('backToLogin')}</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
