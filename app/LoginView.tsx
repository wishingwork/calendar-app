import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Link } from "expo-router";

export default function LoginView() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigation = useNavigation();

  const validateAndLogin = () => {
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Invalid email format');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    setError('');
    navigation.navigate('index');
  };

  return (
    <View style={styles.container}>
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
      {error.includes('email') && <Text style={styles.error}>{error}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error.includes('Password') && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity style={styles.button} onPress={validateAndLogin}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      <Link href={"/SignupView"}>
        <Text style={styles.link}>Don't have an account? Sign Up</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
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
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginBottom: 8,
  },
});