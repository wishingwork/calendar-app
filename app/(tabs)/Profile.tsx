import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Pressable, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useModal } from './ModalContext';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import * as SecureStore from 'expo-secure-store';
import { clearProfile } from '../profileSlice';

interface User {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

const initialUser: User = {
  first_name: 'John',
  last_name: 'Doe',
  email: 'john.doe@example.com',
  password: '',
};

async function loadData(key: string) {
  const isAvailable = await SecureStore.isAvailableAsync();
  if (!isAvailable) {
    // alert("SecureStore is not available on this platform");
    return localStorage.getItem(key);
  }
  return await SecureStore.getItemAsync(key);
}

async function deleteData(key: string) {
  const isAvailable = await SecureStore.isAvailableAsync();
  if (!isAvailable) {
    localStorage.removeItem(key);
    return
  }
  await SecureStore.deleteItemAsync(key);
}



export default function ProfileView() {
  const profile = useSelector((state: RootState) => state.profile.profile);
  const [user, setUser] = useState<User>(profile || initialUser);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPasswordInputs, setShowPasswordInputs] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileExpanded, setProfileExpanded] = useState(true);
  const [passwordExpanded, setPasswordExpanded] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [saving, setSaving] = useState(false);
  const { modalVisible , setModalVisible } = useModal();
  // Validation regex
  const nameRegex = /^[a-zA-Z-]+$/;
  const lastNameRegex = /^[a-zA-Z]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const sqlInjectionRegex = /('|;|--|\b(SELECT|UPDATE|DELETE|INSERT|DROP|ALTER|CREATE|TRUNCATE|EXEC|UNION|OR|AND)\b)/i;

  const validate = () => {
    let valid = true;
    let newErrors: { [key: string]: string } = {};
    if (!nameRegex.test(user.first_name) || sqlInjectionRegex.test(user.first_name)) {
      newErrors.first_name = 'First name can only contain letters and hyphens, and no SQL keywords.';
      valid = false;
    }
    if (!lastNameRegex.test(user.last_name) || sqlInjectionRegex.test(user.last_name)) {
      newErrors.last_name = 'Last name can only contain letters, and no SQL keywords.';
      valid = false;
    }
    if (!emailRegex.test(user.email) || sqlInjectionRegex.test(user.email)) {
      newErrors.email = 'Invalid email format or contains SQL keywords.';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };
  const validatePassword = () => {
    let valid = true;
    let newErrors: { [key: string]: string } = {};
    if (!currentPassword || !confirmPassword) {
      newErrors.password = 'Please fill out both password fields.';
      valid = false;
    } else if (currentPassword !== confirmPassword) {
      newErrors.password = 'Passwords do not match.';
      valid = false;
    } else if (currentPassword.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
      valid = false;
    } else if (sqlInjectionRegex.test(currentPassword)) {
      newErrors.password = 'Password contains SQL keywords.';
      valid = false;
    }
    
    setErrors(newErrors);
    return valid;    
  }

  const handleSave = async () => {
    const userToken = await loadData('userToken');

    if (!validate()) return;
    setSaving(true);
    fetch('http://localhost:3133/auth/me', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...user,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setSaving(false);
        if (data.error) {
          Alert.alert('Error', data.error);
        } else {
          Alert.alert('Success', 'Profile updated successfully!');
        }
      })
      .catch(() => {
        setSaving(false);
        Alert.alert('Error', 'An error occurred. Please try again.');
      });
  };

  const handlePasswordUpdate = async () => {
    const userToken = await loadData('userToken');
    if (!validatePassword()) return;
    fetch('http://localhost:3133/auth/me/password', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        new_password: showPasswordInputs ? currentPassword : undefined,
        confirm_password: showPasswordInputs ? confirmPassword : undefined,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setSaving(false);
        if (data.error) {
          Alert.alert('Error', data.error);
        } else {
          Alert.alert('Success', 'Password updated successfully!');
          setShowPasswordInputs(false);
          setCurrentPassword('');
          setConfirmPassword('');
        }
      })
      .catch(() => {
        setSaving(false);
        Alert.alert('Error', 'An error occurred. Please try again.');
      });
  };  

  const handleLogout = async () => {
    setModalVisible(false);
    // Use expo-router for navigation
    // @ts-ignore
    const userToken = await loadData('userToken');
    fetch('http://localhost:3133/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Content-Type': 'application/json',
      },
    })
      .then(async (response) => {
        await deleteData('userToken');
        dispatch(clearProfile());
        return response.json()
      })
      .catch((error) => {
        setErrors({server: 'An server error occurred. Please try again.'});
        return;
      });  

    navigation.navigate('LoginView');
  };
  useEffect(() => {
    if (profile) {
      setUser(profile);
    }
  }, [profile]);

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {/* User Profile Section */}
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => setProfileExpanded((prev) => !prev)}
          activeOpacity={0.8}
        >
          <Text style={styles.sectionHeaderText}>User Profile</Text>
          <Ionicons
            name={profileExpanded ? 'chevron-up' : 'chevron-down'}
            size={22}
            color="#333"
            style={{ marginLeft: 8 }}
          />
        </TouchableOpacity>
        {profileExpanded && (
          <View style={styles.sectionContent}>
            {/* First Name */}
            <View style={styles.fieldRow}>
              <Text style={styles.label}>First name:</Text>
              <TextInput
                style={styles.input}
                value={user.first_name}
                onChangeText={(text) => setUser({ ...user, first_name: text })}
                placeholder="First Name"
                autoCapitalize="words"
              />
            </View>
            {errors.first_name && <Text style={styles.error}>{errors.first_name}</Text>}

            {/* Last Name */}
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Last name:</Text>
              <TextInput
                style={styles.input}
                value={user.last_name}
                onChangeText={(text) => setUser({ ...user, last_name: text })}
                placeholder="Last Name"
                autoCapitalize="words"
              />
            </View>
            {errors.last_name && <Text style={styles.error}>{errors.last_name}</Text>}

            {/* Email */}
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Email:</Text>
              <TextInput
                style={styles.input}
                value={user.email}
                onChangeText={(text) => setUser({ ...user, email: text })}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            {errors.email && <Text style={styles.error}>{errors.email}</Text>}

            {/* Save Button */}
            <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={saving}>
              <Text style={styles.saveButtonText}>{saving ? 'Saving...' : 'Save'}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Setting Password Section */}
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => setPasswordExpanded((prev) => !prev)}
          activeOpacity={0.8}
        >
          <Text style={styles.sectionHeaderText}>Setting Password</Text>
          <Ionicons
            name={passwordExpanded ? 'chevron-up' : 'chevron-down'}
            size={22}
            color="#333"
            style={{ marginLeft: 8 }}
          />
        </TouchableOpacity>
        {passwordExpanded && (
          <View style={styles.sectionContent}>
            <View style={styles.passwordInputs}>
              <TextInput
                style={styles.input}
                placeholder="Current Password"
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry
              />
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
              {errors.password && <Text style={styles.error}>{errors.password}</Text>}
            </View>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => {
                setShowPasswordInputs(true);
                handlePasswordUpdate();
              }}
              disabled={saving}
            >
              <Text style={styles.saveButtonText}>{saving ? 'Updating...' : 'Update'}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Modal for Logout */}
        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
            <View style={styles.modalContent}>
              <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
    padding: 24,
    paddingTop: 48,
    alignItems: 'center',
  },
  infoIcon: {
    position: 'absolute',
    top: 40,
    right: 24,
    zIndex: 10,
  },
  sectionHeader: {
    width: '100%',
    backgroundColor: '#fff',
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  sectionHeaderText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#333',
    flex: 1,
  },
  sectionContent: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 1,
    shadowOffset: { width: 0, height: 1 },
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    width: '100%',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    width: 110,
    color: '#333',
  },
  value: {
    fontSize: 16,
    color: '#555',
    flex: 1,
  },
  input: {
    flex: 1,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    backgroundColor: '#fff',
    marginLeft: 8,
    marginBottom: 0,
  },
  passwordInputs: {
    marginBottom: 16,
    width: '100%',
  },
  saveButton: {
    backgroundColor: '#ffd33d',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginTop: 8,
    marginBottom: 0,
  },
  saveButtonText: {
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    fontSize: 13,
    marginBottom: 8,
    alignSelf: 'flex-start',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 24,
    minWidth: 200,
    alignItems: 'center',
  },
  logoutButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 6,
    backgroundColor: '#ffd33d',
  },
  logoutText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
