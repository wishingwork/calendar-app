import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView, Image, useWindowDimensions } from 'react-native';
import styles from './styles';

export default function PasswordResetLayout() {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();

  return (
    <Stack screenOptions={{ 
        title: t('eventDetailTitle'), headerShown: false}}>
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
      <Stack.Screen
        name="index"
        options={{
          title: t('resetPasswordTitle'),
        }}
      />
      <Stack.Screen
        name="verify"
        options={{
          title: t('passwordResetVerifyTitle'),
        }}
      />
      <Stack.Screen
        name="reset"
        options={{
          title: t('resetPasswordTitle'),
        }}
      />
    </Stack>
  );
}
