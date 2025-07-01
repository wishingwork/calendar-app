import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

type CalendarMode = "day" | "week" | "month";

interface CalendarModeModalProps {
  calendarMode: CalendarMode;
  setCalendarMode: (mode: CalendarMode) => void;
}

const CalendarModeModal: React.FC<CalendarModeModalProps> = ({ calendarMode, setCalendarMode }) => (
  <View style={{ alignItems: "center" }}>
    <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 16 }}>Calendar Mode</Text>
    {["day", "week", "month"].map((mode) => (
      <TouchableOpacity
        key={mode}
        style={{
          paddingVertical: 10,
          paddingHorizontal: 24,
          borderRadius: 6,
          backgroundColor: calendarMode === mode ? "#0077CC" : "#F0F0F0",
          marginBottom: 10,
          width: 120,
          alignItems: "center",
        }}
        onPress={() => setCalendarMode(mode as CalendarMode)}
      >
        <Text style={{
          color: calendarMode === mode ? "#fff" : "#222",
          fontWeight: "600",
          fontSize: 16,
        }}>
          {mode.charAt(0).toUpperCase() + mode.slice(1)}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

export default CalendarModeModal;
