import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import styles from './styles';
import { useTranslation } from 'react-i18next';
import { loadData } from '../../utils/storage';

export default function ResetPasswordView() {
  const { email, code } = useLocalSearchParams();
  const userEmail = Array.isArray(email) ? email[0] : email;
  const resetCode = Array.isArray(code) ? code[0] : code;

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [saving, setSaving] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const { t } = useTranslation();

  const validatePassword = () => {
    let valid = true;
    let newErrors: { [key: string]: string } = {};
    if (!newPassword || !confirmPassword) {
      newErrors.password = t('profileError_passwordRequired');
      valid = false;
    } else if (newPassword !== confirmPassword) {
      newErrors.password = t('profileError_passwordMismatch');
      valid = false;
    } else if (newPassword.length < 8 || !/[0-9]/.test(newPassword) || !/[!@#$%^&*()_+\-\=\[\]\{\}\|;:'",.<>\/?`~]/.test(newPassword)) {
      newErrors.password = t('profileError_passwordFormat');
      valid = false;
    }
    setErrors(newErrors);
    return valid;
  };

  const handlePasswordReset = async () => {
    if (!validatePassword()) return;

    const apiServerIp = process.env.EXPO_PUBLIC_MISSION_API_SERVER_IP || process.env.EXPO_PUBLIC_API_SERVER_IP;    
    if (!apiServerIp) {
      setErrors({ password: t('serverMisconfiguration') });
      return;
    }

    setSaving(true);
    try {
      const userTokenRaw = await loadData('userToken');
      const userToken = userTokenRaw || '';
      if (userToken) {      
        const response = await fetch(`${apiServerIp}/auth/me/password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`
          },
          body: JSON.stringify({ new_password: newPassword, confirm_password: newPassword }),      
        });

        const data = await response.json();

        if (data.success) {
          setNewPassword('');
          setConfirmPassword('');
          setErrors({});
          setUpdateSuccess(true);
          Alert.alert(t('passwordResetSuccessTitle'), t('passwordResetSuccessMessage'));
          router.replace('/LoginView');
        } else {
          setErrors({ password: t('passwordResetFailed') });
        }
      }      
    } catch (error) {
      setErrors({ password: t('passwordResetFailed') });
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.sectionContent}>
          <Text style={styles.sectionHeaderText}>{t('resetPasswordTitle')}</Text>
          <View style={styles.passwordInputs}>
            <TextInput
              style={styles.input}
              placeholder={t('newPasswordLabel')}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              placeholderTextColor="#999"
            />
            <TextInput
              style={styles.input}
              placeholder={t('confirmPasswordLabel')}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              placeholderTextColor="#999"
            />
            {errors.password && <Text style={styles.error}>{errors.password}</Text>}
          </View>
          <TouchableOpacity
            style={[
              styles.saveButton,
              updateSuccess && { backgroundColor: '#007BFF' },
              saving && { opacity: 0.4 },
            ]}
            onPress={handlePasswordReset}
            disabled={saving || updateSuccess}
          >
            <Text style={[styles.saveButtonText, updateSuccess && { color: '#fff' }]}>
              {updateSuccess ? t('updatedLabel') : saving ? t('updatingLabel') : t('resetPasswordButton')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
