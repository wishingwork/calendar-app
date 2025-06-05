import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, useWindowDimensions, Image, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { router } from "expo-router";
import { useDispatch } from 'react-redux';
import { setProfile } from './profileSlice';
import { saveData } from '../utils/storage';
import { loginAndFetchProfile } from '../utils/fetchAPI';

export default function LoginView() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const validateAndLogin = async () => {
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Invalid email or password');
      return;
    }
    // Stronger password validation
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
      navigation.navigate('(tabs)');
    } catch (error: any) {
      setError(error.message || 'A server error occurred. Please try again.');
    } finally {
      setPassword('');
    }
  };

  const { width } = useWindowDimensions();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0} // Adjust if needed
    >
      <ScrollView contentContainerStyle={styles.inner}>
        <View style={styles.container}>
          <Image
            source={require('../assets/images/logo.png')}
            style={{
              width: width * 0.25,
              height: width * 0.25,
              resizeMode: 'contain',
              marginBottom: 16,
              alignSelf: 'center',    
            }}
          />
          <Text style={styles.logo}>Weather Calendar</Text>
          <View style={[styles.featureBlock, { borderColor: '#FF5733' }]}>
            <Text style={styles.featureText}>
              🌤️ Calendar View
            </Text>
            <Text style={styles.featureDescription}>
              See your 10-day trip timeline with daily weather
            </Text>
          </View>
          <View style={[styles.featureBlock, { borderColor: '#33C1FF' }]}>
            <Text style={styles.featureText}>
              🗺️ Trip Timeline
            </Text>
            <Text style={styles.featureDescription}>
              Visualize city transitions and weather information
            </Text>
          </View>
          <View style={[styles.featureBlock, { borderColor: '#33FF57' }]}>
            <Text style={styles.featureText}>
              ✈️ Travel Planning
            </Text>
            <Text style={styles.featureDescription}>
              Add events with transportation and location details
            </Text>
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

          <Text style={styles.link} onPress={() => router.push('SignupView')}>Don't have an account? Sign Up</Text>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  inner: {
    flex: 1,
  },  
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  featureBlock: {
    width: '100%',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    textAlign: 'center',
  },
  featureText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  featureDescription: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    justifyContent: 'center',
  },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    color: '#007BFF',
    fontSize: 14,
    marginTop: 12,
    textAlign: 'center', 
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginBottom: 8,
  },
});