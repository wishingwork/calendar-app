import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useTranslation } from 'react-i18next';

interface DeleteEventModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  deleting: boolean;
}

export default function DeleteEventModal({
  visible,
  onConfirm,
  onCancel,
  deleting,
}: DeleteEventModalProps) {
  const { t } = useTranslation();
  return (
    <View style={{ alignItems: "center" }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 8 }}>{t('deleteEventModalTitle')}</Text>
      <Text style={{ fontSize: 16, marginBottom: 20, textAlign: "center" }}>
        {t('deleteEventModalConfirmText')}
      </Text>
      <View style={{ flexDirection: "row", gap: 12 }}>
        <TouchableOpacity
          style={{
            backgroundColor: "#d11a2a",
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 6,
            marginRight: 8
          }}
          onPress={onConfirm}
          disabled={deleting}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>
            {deleting ? t('deleteEventModalDeleting') : t('deleteEventModalConfirm')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: "#ccc",
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 6
          }}
          onPress={onCancel}
          disabled={deleting}
        >
          <Text style={{ color: "#222", fontWeight: "bold" }}>{t('deleteEventModalCancel')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
