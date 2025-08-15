import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { colors } from '../../styles/colors';
import { useTranslation } from 'react-i18next';

interface DeleteUserModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteUserModal: React.FC<DeleteUserModalProps> = ({ onConfirm, onCancel }) => {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('deleteAccountConfirmationTitle')}</Text>
      <Text style={styles.message}>{t('deleteAccountConfirmationMessage')}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={onCancel} style={[styles.button, styles.cancelButton]}>
          <Text style={styles.buttonText}>{t('cancelButton')}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onConfirm} style={[styles.button, styles.confirmButton]}>
          <Text style={styles.buttonText}>{t('confirmButton')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: colors.text,
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: colors.text,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 6,
  },
  cancelButton: {
    backgroundColor: colors.primary,
  },
  confirmButton: {
    backgroundColor: colors.secondary,
  },
  buttonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default DeleteUserModal;
