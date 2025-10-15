import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Image, useWindowDimensions, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { common } from '../../styles/common';
import { typography } from '../../styles/typography';
import styles from './verify-styles';

import { useLocalSearchParams, router } from 'expo-router';
import { verifyPasswordResetCode } from '../../utils/fetchAPI';
import { useTranslation } from 'react-i18next';

export default function PasswordResetVerifyScreen() {
  const { email } = useLocalSearchParams();
  const userEmail = Array.isArray(email) ? email[0] : email;
  const apiServerIp = process.env.EXPO_PUBLIC_MISSION_API_SERVER_IP || process.env.EXPO_PUBLIC_API_SERVER_IP;
  
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { width } = useWindowDimensions();
  const { t } = useTranslation();

  const handleVerify = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      if (!apiServerIp) {
        setError(t('serverMisconfiguration'));
        setLoading(false);
        return;
      }
      const data = await verifyPasswordResetCode(userEmail as string, code, apiServerIp as string);

      if (data.data.success === true) {
        setSuccess(t('passwordResetVerifySuccess'));
        router.push({ pathname: '/PasswordReset/reset', params: { email: userEmail, token: data.data.token } });
      } else {
        setError(t('passwordResetVerifyInvalidCode'));
      }
    } catch {
      setError(t('passwordResetVerifyFailed'));
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
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <Image
          source={require('../../assets/images/logo.png')}
          style={{
            width: width * 0.22,
            height: width * 0.22,
            resizeMode: 'contain',
            marginBottom: 12,
            alignSelf: 'center',
          }}
          />
          <Text style={[styles.logo, { fontSize: 22, fontWeight: '700', letterSpacing: 1 }]}>
          {t('appTitle')}
          </Text>
        </View>
        <View style={{ alignItems: 'center', width: '100%', paddingHorizontal: 20 }}>
          <Text style={[typography.logo, { marginBottom: 18, fontSize: 24, fontWeight: '700' }]}>
          {t('passwordResetVerifyTitle')}
          </Text>
          <Text style={[typography.subheader, { marginBottom: 10, fontSize: 16 }]}>
          {t('passwordResetVerifyInstruction')}
          </Text>
          <TextInput
          style={[
            common.input,
            {
              textAlign: 'center',
              fontSize: 20,
              fontWeight: '600',
              letterSpacing: 4,
              marginBottom: 10,
              color: '#000',
            },
          ]}
          value={code}
          onChangeText={setCode}
          keyboardType="numeric"
          maxLength={6}
          placeholder={t('verifyEmailPlaceholder')}
          placeholderTextColor="#999"
          />
          {error ? <Text style={[typography.error, { marginBottom: 6 }]}>{error}</Text> : null}
          {success ? <Text style={[typography.link, { marginBottom: 6 }]}>{success}</Text> : null}
          <TouchableOpacity style={common.button} onPress={handleVerify} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={common.buttonText}>{t('verifyEmailButton')}</Text>}
          </TouchableOpacity>
          <Text style={styles.link} onPress={() => router.replace('/LoginView')}>{t('backToLogin')}</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
