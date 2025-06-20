import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Image, useWindowDimensions } from 'react-native';
import { common } from '../../styles/common';
import { typography } from '../../styles/typography';
import { verifyEmailCode, resendVerificationEmail, updateProfile } from '../../utils/fetchAPI';
import { RootState } from '../store';
import { useSelector, useDispatch } from 'react-redux';
import styles from './styles';
import { router, useLocalSearchParams } from 'expo-router';
import { setProfile } from '../profileSlice';

export default function EmailVerify () {
  const { token } = useLocalSearchParams();
  const userToken = Array.isArray(token) ? token[0] : token;
  const apiServerIp = process.env.EXPO_PUBLIC_API_SERVER_IP ?? '';
  const user = useSelector((state: RootState) => state.profile.profile) as { is_activated: boolean; email: string } | null;
  
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const { width } = useWindowDimensions();
  const dispatch = useDispatch();

  const handleVerify = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      if (!apiServerIp) {
        setError('API server IP is not set.');
        setLoading(false);
        return;
      }
      const {data} = await verifyEmailCode(code, userToken, apiServerIp);
      if (data.success === true) {
        const { data: profile } = await updateProfile({ is_activated: true }, userToken, apiServerIp);
        dispatch(setProfile(profile));
        setSuccess('Email verified!');
        router.push('/(tabs)');
      } else {
        setError('Invalid verification code');
      }
    } catch {
      setError('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  const handleResend = async () => {
    if (!apiServerIp) {
      setError('API server IP is not set.');
      setResendLoading(false);
      return;
    }
    if (!user) {
      setError('User information is not available.');
      setResendLoading(false);
      return;
    }
    setResendLoading(true);
    setError('');
    setSuccess('');
    try {
      const { data } = await resendVerificationEmail(user.email, userToken, apiServerIp);
      if (data.message === "Verification email sent") {
        setError('Verification email already sent. Please check your inbox.');
      } else {
        setError('Failed to resend verification email.');
      }
    } catch {
      setError('Failed to resend verification email.');
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
    <View style={[common.container, { alignItems: 'center', flex: 1 }]}>
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
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
        Weather Calendar
        </Text>
      </View>
      {/* Form Section */}
      <View style={{ alignItems: 'center', width: '100%', paddingHorizontal: 20 }}>
        <Text style={[typography.logo, { marginBottom: 18, fontSize: 24, fontWeight: '700' }]}>
        Verify Your Email
        </Text>
        <Text style={[typography.subheader, { marginBottom: 10, fontSize: 16 }]}>
        Enter the 6-digit code sent to your email:
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
        placeholder="123456"
        placeholderTextColor="#bbb" // Placeholder in gray
        />
        {error ? <Text style={[typography.error, { marginBottom: 6 }]}>{error}</Text> : null}
        {success ? <Text style={[typography.link, { marginBottom: 6 }]}>{success}</Text> : null}
        <TouchableOpacity style={common.button} onPress={handleVerify} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={common.buttonText}>Verify</Text>}
        </TouchableOpacity>
        <TouchableOpacity style={{ marginTop: 12 }} onPress={handleResend} disabled={resendLoading}>
        <Text style={[typography.link, { fontWeight: '500' }]}>
          {resendLoading ? 'Resending...' : 'Resend Verification Email'}
        </Text>
        </TouchableOpacity>
      </View>
    </View>
    </View>
  );
};

// export default EmailVerify;
