import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useModal } from '../../ModalContext';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../Redux/store';
import { clearProfile } from '../../../Redux/features/profileSlice';
import { router } from "expo-router";
import { updateProfile, updatePassword, logout } from '../../../utils/fetchAPI';
import styles from './styles';
import { loadData, deleteData } from '../../../utils/storage';
import LogoutModal from '../../Modals/LogoutModal';
import { useTranslation } from 'react-i18next';

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

export default function ProfileView() {
  const profile = useSelector((state: RootState) => state.profile.profile);
  const [user, setUser] = useState<User>(profile || initialUser);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [currentPassword, setCurrentPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileExpanded, setProfileExpanded] = useState(true);
  const [passwordExpanded, setPasswordExpanded] = useState(false);
  const dispatch = useDispatch();
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false); // for profile save
  const [updateSuccess, setUpdateSuccess] = useState(false); // for password update
  const { setModalVisible, setModalContent } = useModal();
  const { t } = useTranslation();
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
    } else if (currentPassword.length < 8 || !/[0-9]/.test(currentPassword) || !/[!@#$%^&*]/.test(currentPassword)) {
      newErrors.password = 'Password must be at least 8 characters, include a number and a special character.';
      valid = false;
    }
    setErrors(newErrors);
    return valid;
  }
  const handleSave = async () => {
    const userTokenRaw = await loadData('userToken');
    const userToken = userTokenRaw || '';
    if (!validate()) return;
    setSaving(true);
    updateProfile(user, userToken, process.env.EXPO_PUBLIC_MISSION_API_SERVER_IP || process.env.EXPO_PUBLIC_API_SERVER_IP as string)
      .then((data) => {
        setSaving(false);
        if (data.error) {
          Alert.alert('Error', data.error);
        } else {
          setSaveSuccess(true); // show success
          setTimeout(() => setSaveSuccess(false), 2000); // revert after 2s
          Alert.alert('Success', 'Profile updated successfully!');
        }
      })
      .catch(() => {
        setSaving(false);
        Alert.alert('Error', 'An error occurred. Please try again.');
      });
  };
  const handlePasswordUpdate = async () => {
    const userTokenRaw = await loadData('userToken');
    const userToken = userTokenRaw || '';
    if (!validatePassword()) return;
    if (!process.env.EXPO_PUBLIC_API_SERVER_IP) {
      setErrors({ password: 'Server misconfiguration. Please contact support.' });
      return;
    }
    setSaving(true);
    updatePassword(currentPassword, confirmPassword, userToken, process.env.EXPO_PUBLIC_MISSION_API_SERVER_IP || process.env.EXPO_PUBLIC_API_SERVER_IP as string)
      .then((data) => {
        setSaving(false);
        if (data.error) {
          setErrors({ password: 'Password update failed. Please try again.' });
        } else {
          setCurrentPassword('');
          setConfirmPassword('');
          setErrors({});
          setUpdateSuccess(true); // show success
          setTimeout(() => setUpdateSuccess(false), 2000); // revert after 2s
          Alert.alert('Success', 'Password updated successfully!');
        }
      })
      .catch(() => {
        setSaving(false);
        setErrors({ password: 'A server error occurred. Please try again.' });
      });
  };

  useEffect(() => {
    if (profile) {
      setUser(profile);
    }
  }, [profile]);
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => setProfileExpanded((prev) => !prev)}
          activeOpacity={0.8}
        >
          <Text style={styles.sectionHeaderText}>{t('userProfileLabel')}</Text>
          <Ionicons
            name={profileExpanded ? 'chevron-up' : 'chevron-down'}
            size={22}
            color="#333"
            style={{ marginLeft: 8 }}
          />
        </TouchableOpacity>
        {profileExpanded && (
          <View style={styles.sectionContent}>
            <View style={styles.fieldRow}>
              <Text style={styles.label}>{t('firstNameLabel')}:</Text>
              <TextInput
                style={styles.input}
                value={user.first_name}
                onChangeText={(text) => setUser({ ...user, first_name: text })}
                placeholder={t('firstNameLabel')}
                autoCapitalize="words"
              />
            </View>
            {errors.first_name && <Text style={styles.error}>{errors.first_name}</Text>}
            <View style={styles.fieldRow}>
              <Text style={styles.label}>{t('lastNameLabel')}:</Text>
              <TextInput
                style={styles.input}
                value={user.last_name}
                onChangeText={(text) => setUser({ ...user, last_name: text })}
                placeholder={t('lastNameLabel')}
                autoCapitalize="words"
              />
            </View>
            {errors.last_name && <Text style={styles.error}>{errors.last_name}</Text>}
            <View style={styles.fieldRow}>
              <Text style={styles.label}>{t('emailLabel')}:</Text>
              <TextInput
                style={styles.input}
                value={user.email}
                onChangeText={(text) => setUser({ ...user, email: text })}
                placeholder={t('emailLabel')}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            {errors.email && <Text style={styles.error}>{errors.email}</Text>}
            <TouchableOpacity
              style={[
                styles.saveButton,
                saveSuccess && { backgroundColor: "#007BFF" },
                saving && { opacity: 0.4 }
              ]}
              onPress={handleSave}
              disabled={saving || saveSuccess}
            >
              <Text style={[styles.saveButtonText, saveSuccess && { color: "#fff" }]}>
                {saveSuccess ? t('savedLabel') : saving ? t('savingLabel') : t('saveLabel')}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => setPasswordExpanded((prev) => !prev)}
          activeOpacity={0.8}
        >
          <Text style={styles.sectionHeaderText}>{t('settingPasswordLabel')}</Text>
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
                placeholder={t('currentPasswordLabel')}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry
              />
              <TextInput
                style={styles.input}
                placeholder={t('confirmPasswordLabel')}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
              {errors.password && <Text style={styles.error}>{errors.password}</Text>}
            </View>
            <TouchableOpacity
              style={[
                styles.saveButton,
                updateSuccess && { backgroundColor: "#007BFF" },
                saving && { opacity: 0.4 }
              ]}
              onPress={handlePasswordUpdate}
              disabled={saving || updateSuccess}
            >
              <Text style={[styles.saveButtonText, updateSuccess && { color: "#fff" }]}>
                {updateSuccess ? t('updatedLabel') : saving ? t('updatingLabel') : t('updateLabel')}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {/* Remove local Modal, use context modal instead */}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
