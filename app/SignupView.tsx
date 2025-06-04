import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, useWindowDimensions, Image  } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Link } from "expo-router";
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


  const validateAndSignup = () => {
    if (!firstName.match(/^[a-zA-Z-]+$/)) {
      setError('First name can only contain letters and hyphens');
      return;
    }
    if (!lastName.match(/^[a-zA-Z]+$/)) {
      setError('Last name can only contain letters');
      return;
    }
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Invalid email format');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 8 characters and include a number');
      return;
    }

    
    fetch('http://localhost:3133/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ first_name: firstName, last_name: lastName, email, password }),
    })
      .then((response) => response.json())
      .then(async (data) => {
        if (data.errors) {
          setError('Invalid email or password');
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
      })
      .catch((error) => {
        setError('An server error occurred. Please try again.');
        return;
      });    
  };
  const { width } = useWindowDimensions();

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/logo.png')}
        style={{
          width: width * 0.25,
          height: width * 0.25,
          resizeMode: 'contain',
          marginBottom: 16,
        }}
      />      
      <Text style={styles.logo}>Weather Calendar</Text>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />
      {error.includes('First name') && <Text style={styles.error}>{error}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />
      {error.includes('Last name') && <Text style={styles.error}>{error}</Text>}

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

      <TouchableOpacity style={styles.button} onPress={validateAndSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      {error.includes('server') && <Text style={styles.error}>{error}</Text>}

        <Link href={"/LoginView"}>
          <Text style={styles.link}>Already have an account? Log In</Text>
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
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginBottom: 8,
  },
});