import React from 'react';
import { View, Text, useWindowDimensions, Image, KeyboardAvoidingView, ScrollView, Platform, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from 'react-i18next';
import styles from './styles';

export default function ContactView() {
  const { type } = useLocalSearchParams<{ type?: 'signup' | 'reset' }>();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { t } = useTranslation();

  let messageKey = 'defaultContactMessage';
  if (type === 'signup') {
    messageKey = 'signupContactMessage';
  } else if (type === 'reset') {
    messageKey = 'passwordResetContactMessage';
  }

  const handleEmailPress = () => {
    Linking.openURL('mailto:info@meteosync.com');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView contentContainerStyle={styles.inner}>
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
        <Text style={styles.logo}>{t('appTitle')}</Text>
        
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>
            {t(messageKey)}
          </Text>
          <Text style={styles.emailText} onPress={handleEmailPress}>
            info@meteosync.com
          </Text>
        </View>

        <Text style={styles.link} onPress={() => router.replace('/LoginView')}>
          {t('backToLogin')}
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
