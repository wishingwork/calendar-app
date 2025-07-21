import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { colors } from '../../styles/colors';
import { useTranslation } from 'react-i18next';

interface LogoutModalProps {
  onLogout: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ onLogout }) => {
  const { t } = useTranslation();
  return (
    <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
      <Text style={styles.logoutText}>{t('logoutButton')}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  logoutButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 6,
    backgroundColor: colors.accent,
  },
  logoutText: {
    color: colors.text,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default LogoutModal;
