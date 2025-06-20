import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, useWindowDimensions, Image, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { router } from "expo-router";
import { useDispatch } from 'react-redux';
import { setProfile } from '../profileSlice';
import { signupAndFetchProfile } from '../../utils/fetchAPI';
import styles from './styles';

export default function SignupView() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const { width } = useWindowDimensions();

  const validateAndSignup = async () => {
    if (!firstName.match(/^[a-zA-Z-]+$/)) {
      setError('Invalid first or last name');
      return;
    }
    if (!lastName.match(/^[a-zA-Z]+$/)) {
      setError('Invalid first or last name');
      return;
    }
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Invalid email format');
      return;
    }
    if (password.length < 8 || !/[0-9]/.test(password) || !/[!@#$%^&*]/.test(password)) {
      setError('Invalid password format. Must be at least 8 characters long and include a number and a special character.');
      return;
    }
    if (!process.env.EXPO_PUBLIC_API_SERVER_IP) {
      setError('Server misconfiguration. Please contact support.');
      return;
    }
    try {
      const data = await signupAndFetchProfile(
        firstName,
        lastName,
        email,
        password,
        process.env.EXPO_PUBLIC_API_SERVER_IP,
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
          <Text style={styles.logo}>Weather Calendar</Text>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          {(error.includes('Invalid') || error.includes('already')) && <Text style={styles.error}>{error}</Text>}
          <TouchableOpacity style={styles.button} onPress={validateAndSignup}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
          {error.includes('server') && <Text style={styles.error}>{error}</Text>}
          <Text style={styles.link} onPress={() => router.push('/LoginView')}>Already have an account? Log In</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
