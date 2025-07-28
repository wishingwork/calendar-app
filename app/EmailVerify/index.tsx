import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Image, useWindowDimensions, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { common } from '../../styles/common';
import { typography } from '../../styles/typography';
import { verifyEmailCode, resendVerificationEmail, updateProfile } from '../../utils/fetchAPI';
import { RootState } from '../../Redux/store';
import { useSelector, useDispatch } from 'react-redux';
import styles from './styles';
import { router, useLocalSearchParams } from 'expo-router';
import { setProfile } from '../../Redux/features/profileSlice';
import { useTranslation } from 'react-i18next';

export default function EmailVerify () {
  const { token } = useLocalSearchParams();
  const userToken = Array.isArray(token) ? token[0] : token;
  const apiServerIp = process.env.EXPO_PUBLIC_MISSION_API_SERVER_IP || process.env.EXPO_PUBLIC_API_SERVER_IP;
  const user = useSelector((state: RootState) => state.profile.profile) as { is_activated: boolean; email: string } | null;
  
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const { width } = useWindowDimensions();
  const dispatch = useDispatch();
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
      const {data} = await verifyEmailCode(code, userToken, apiServerIp);
      if (data.success === true) {
        const { data: profile } = await updateProfile({ is_activated: true }, userToken, apiServerIp);
        dispatch(setProfile(profile));
        setSuccess(t('verifyEmailSuccess'));
        router.push('/(tabs)');
      } else {
        setError(t('verifyEmailInvalidCode'));
      }
    } catch {
      setError(t('verifyEmailFailed'));
    } finally {
      setLoading(false);
    }
  };
  const handleResend = async () => {
    if (!apiServerIp) {
      setError(t('serverMisconfiguration'));
      setResendLoading(false);
      return;
    }
    if (!user) {
      setError(t('verifyEmailUserUnavailable'));
      setResendLoading(false);
      return;
    }
    setResendLoading(true);
    setError('');
    setSuccess('');
    try {
      const { data } = await resendVerificationEmail(user.email, userToken, apiServerIp);
      if (data.message === "Verification email sent") {
        setError(t('verifyEmailAlreadySent'));
      } else {
        setError(t('verifyEmailResendFailed'));
      }
    } catch {
      setError(t('verifyEmailResendFailed'));
    } finally {
      setResendLoading(false);
    }
  };

   useEffect(() => {
     if (user && user.is_activated === true && token) {
       router.push({ pathname:'/(tabs)', params: { token } });
     }
   }, [user, token]); 

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >     
      <ScrollView contentContainerStyle={styles.inner}>
        {/* Logo Section */}
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
        {/* Form Section */}
        <View style={{ alignItems: 'center', width: '100%', paddingHorizontal: 20 }}>
          <Text style={[typography.logo, { marginBottom: 18, fontSize: 24, fontWeight: '700' }]}>
          {t('verifyEmailTitle')}
          </Text>
          <Text style={[typography.subheader, { marginBottom: 10, fontSize: 16 }]}>
          {t('verifyEmailInstruction')}
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
              color: '#000', // User's entry in black
            },
          ]}
          value={code}
          onChangeText={setCode}
          keyboardType="numeric"
          maxLength={6}
          placeholder={t('verifyEmailPlaceholder')}
          placeholderTextColor="#bbb" // Placeholder in gray
          />
          {error ? <Text style={[typography.error, { marginBottom: 6 }]}>{error}</Text> : null}
          {success ? <Text style={[typography.link, { marginBottom: 6 }]}>{success}</Text> : null}
          <TouchableOpacity style={common.button} onPress={handleVerify} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={common.buttonText}>{t('verifyEmailButton')}</Text>}
          </TouchableOpacity>
          <TouchableOpacity style={{ marginTop: 12 }} onPress={handleResend} disabled={resendLoading}>
          <Text style={[typography.link, { fontWeight: '500' }]}>
            {resendLoading ? t('verifyEmailResending') : t('verifyEmailResend')}
          </Text>
          </TouchableOpacity>
          <Text style={styles.link} onPress={() => router.push('/LoginView')}>{t('backToLogin')}</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// export default EmailVerify;
