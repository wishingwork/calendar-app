import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, useWindowDimensions, Image, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { router } from "expo-router";
import { saveData } from '../utils/storage';  
import { useDispatch } from 'react-redux';
import { setProfile } from './profileSlice';

export default function SignupView() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigation = useNavigation();
  const dispatch = useDispatch();


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
    // Stronger password validation
    if (password.length < 8 || !/[0-9]/.test(password) || !/[!@#$%^&*]/.test(password)) {
      setError('Invalid password format. Must be at least 8 characters long and include a number and a special character.');
      return;
    }
    if (!process.env.EXPO_PUBLIC_API_SERVER_IP) {
      setError('Server misconfiguration. Please contact support.');
      return;
    }
    // Warn if not HTTPS
    // if (!`https://${process.env.EXPO_PUBLIC_API_SERVER_IP}`.startsWith('https://')) {
    //   setError('Insecure connection. Please use HTTPS.');
    //   return;
    // }
    try {
      const response = await fetch(`http://${process.env.EXPO_PUBLIC_API_SERVER_IP}:3133/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ first_name: firstName, last_name: lastName, email, password }),
      });
      const data = await response.json();
      if (data.errors || !data.token) {
        if(data.error) {
          setError(data.error);
        } else {
          setError('Invalid email or password');
        }
      } else {
        await saveData('userToken', data.token);
        dispatch(setProfile({first_name:data.first_name, last_name:data.last_name, email:data.email}));
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setError('');
        navigation.navigate('(tabs)');
      }
    } catch (error) {
      setError('A server error occurred. Please try again.');
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
    backgroundColor: '#005FA0',
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
    textAlign: 'center',    
  },
});