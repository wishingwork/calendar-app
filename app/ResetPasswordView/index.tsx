import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView, Image, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import styles from './styles';
import { useTranslation } from 'react-i18next';
import { loadData } from '../../utils/storage';
import { updatePassword } from '../../utils/fetchAPI';
import { typography } from '../../styles/typography';

export default function ResetPasswordView() {

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [saving, setSaving] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const { t } = useTranslation();
  const { width } = useWindowDimensions();

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
        updatePassword(newPassword, confirmPassword, userToken, process.env.EXPO_PUBLIC_MISSION_API_SERVER_IP || process.env.EXPO_PUBLIC_API_SERVER_IP as string)
          .then((data) => {
            setSaving(false);
            if (data.error) {
              setErrors({ password: t('profileError_passwordUpdate') });
            } else {
              setNewPassword('');
              setConfirmPassword('');
              setErrors({});
              setUpdateSuccess(true); // show success
              setTimeout(() => setUpdateSuccess(false), 2000); // revert after 2s
              Alert.alert(t('passwordResetSuccessTitle'), t('passwordResetSuccessMessage'));
              setTimeout(() => router.replace('/LoginView'), 1000);;
            }
          })
          .catch(() => {
            setErrors({ password: t('passwordResetFailed') });
          });
      }      
    } catch (error) {
      setErrors({ password: t('passwordResetFailed') });
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >     
      <ScrollView contentContainerStyle={styles.inner}>
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
          {t('appTitle')}
          </Text>
        </View>
        <View style={{ alignItems: 'center', width: '100%', paddingHorizontal: 20 }}>
          <Text style={[typography.logo, { marginBottom: 18, fontSize: 24, fontWeight: '700' }]}>
          {t('resetPasswordTitle')}
          </Text>
          <Text style={[typography.subheader, { marginBottom: 10, fontSize: 16 }]}>
          {t('resetPasswordInstruction')}
          </Text>
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
