import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

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
  return (
    <View style={{ alignItems: "center" }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 8 }}>Delete Event</Text>
      <Text style={{ fontSize: 16, marginBottom: 20, textAlign: "center" }}>
        Are you sure you want to delete this event?
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
            {deleting ? "Deleting..." : "Confirm"}
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
          <Text style={{ color: "#222", fontWeight: "bold" }}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
