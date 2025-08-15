import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, useWindowDimensions, Image, KeyboardAvoidingView, ScrollView, Platform, ActivityIndicator } from 'react-native';
import { router } from "expo-router";
import { useDispatch } from 'react-redux';
import { setProfile } from '../../Redux/features/profileSlice';
import { signupAndFetchProfile } from '../../utils/fetchAPI';
import { useTranslation } from 'react-i18next';
import styles from './styles';
import { usePrivacyPolicy } from './usePrivacyPolicy';
import PrivacyPolicyModal from './PrivacyPolicyModal';
import { Ionicons } from '@expo/vector-icons';

export default function SignupView() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { width } = useWindowDimensions();
  const { t } = useTranslation();
  const {
    isPolicyModalVisible,
    hasAgreedToPolicy,
    hasScrolledToPolicyBottom,
    handleOpenPolicy,
    handleClosePolicy,
    handleScrollToPolicyBottom,
    handleToggleAgreement,
  } = usePrivacyPolicy();

  const validateAndSignup = async () => {
    setLoading(true);
    if (!firstName.match(/^[a-zA-Z-]+$/)) {
      setError(t('invalidFirstOrLastName'));
      setLoading(false);
      return;
    }
    if (!lastName.match(/^[a-zA-Z]+$/)) {
      setError(t('invalidFirstOrLastName'));
      setLoading(false);
      return;
    }
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError(t('invalidEmailFormat'));
      setLoading(false);
      return;
    }
    if (password.length < 8 || !/[0-9]/.test(password) || !/[!@#$%^&*()_+\-=\[\]{}|;:'",.<>/?`~]/.test(password)) {
      setError(t('invalidPasswordFormat'));
      setLoading(false);
      return;
    }
    if (!process.env.EXPO_PUBLIC_API_SERVER_IP) {
      setError(t('serverMisconfiguration'));
      setLoading(false);
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
        router.replace({ pathname:'/EmailVerify', params: { token: data.token } });
        return;
      }
      router.replace('/(tabs)');
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
          <TextInput
            style={styles.input}
            placeholder={t('firstNameLabel')}
            value={firstName}
            onChangeText={setFirstName}
            placeholderTextColor="#999"
          />
          <TextInput
            style={styles.input}
            placeholder={t('lastNameLabel')}
            value={lastName}
            onChangeText={setLastName}
            placeholderTextColor="#999"
          />
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
            secureTextEntry
            placeholderTextColor="#999"
          />
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <TouchableOpacity onPress={handleToggleAgreement} disabled={!hasScrolledToPolicyBottom}>
              <Ionicons name={hasAgreedToPolicy ? "checkbox" : "square-outline"} size={24} color={hasScrolledToPolicyBottom ? "black" : "grey"} />
            </TouchableOpacity>
            <Text style={{ marginLeft: 8 }}>
              {t('iHaveReadThe')}
              <Text style={{ color: 'blue', textDecorationLine: 'underline' }} onPress={Platform.OS === 'web' ? handleScrollToPolicyBottom : handleOpenPolicy}>
                {t('privacyPolicy')}
              </Text>
            </Text>
          </View>
          {(error.includes(t('errorCode_invalid')) || error.includes(t('errorCode_server')) ) && <Text style={styles.error}>{error}</Text>}
          <TouchableOpacity style={[styles.button, { backgroundColor: hasAgreedToPolicy ? '#007bff' : '#ccc' }]} onPress={validateAndSignup} disabled={loading || !hasAgreedToPolicy}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>{t('signUpLabel')}</Text>
            )}
          </TouchableOpacity>
          <Text style={styles.link} onPress={() => router.replace('/LoginView')}>{t('loginLink')}</Text>
      </ScrollView>
      <PrivacyPolicyModal
        visible={isPolicyModalVisible}
        onClose={handleClosePolicy}
        onScrollToBottom={handleScrollToPolicyBottom}
      />
    </KeyboardAvoidingView>
  );
}
