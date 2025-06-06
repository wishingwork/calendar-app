import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, useWindowDimensions, Image, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { router } from "expo-router";
import { useDispatch } from 'react-redux';
import { setProfile } from '../profileSlice';
import { loginAndFetchProfile } from '../../utils/fetchAPI';
import styles from './styles';

export default function LoginView() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const { width } = useWindowDimensions();
 
  const validateAndLogin = async () => {
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Invalid email or password');
      return;
    }
    if (password.length < 8 || !/[0-9]/.test(password) || !/[!@#$%^&*]/.test(password)) {
      setError('Invalid email or password');
      return;
    }
    if (!process.env.EXPO_PUBLIC_API_SERVER_IP) {
      setError('Server misconfiguration. Please contact support.');
      return;
    }
    try {
      const { profile } = await loginAndFetchProfile(email, password, process.env.EXPO_PUBLIC_API_SERVER_IP);
      if (profile) {
        dispatch(setProfile(profile));
      }
      setEmail('');
      setPassword('');
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
          <View style={[styles.featureBlock, { borderColor: '#FF5733' }]}> {/* TODO: move borderColor to styles if needed */}
            <Text style={styles.featureText}>🌤️ Calendar View</Text>
            <Text style={styles.featureDescription}>See your 10-day trip timeline with daily weather</Text>
          </View>
          <View style={[styles.featureBlock, { borderColor: '#33C1FF' }]}> {/* TODO: move borderColor to styles if needed */}
            <Text style={styles.featureText}>🗺️ Trip Timeline</Text>
            <Text style={styles.featureDescription}>Visualize city transitions and weather information</Text>
          </View>
          <View style={[styles.featureBlock, { borderColor: '#33FF57' }]}> {/* TODO: move borderColor to styles if needed */}
            <Text style={styles.featureText}>✈️ Travel Planning</Text>
            <Text style={styles.featureDescription}>Add events with transportation and location details</Text>
          </View>
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
          {error.includes('email') && <Text style={styles.error}>{error}</Text>}
          <TouchableOpacity style={styles.button} onPress={validateAndLogin}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
          {(error.includes('server') || error.includes('Server')) && <Text style={styles.error}>{error}</Text>}
          <Text style={styles.link} onPress={() => router.push('/SignupView')}>Don&apos;t have an account? Sign Up</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}