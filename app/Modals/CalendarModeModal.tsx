import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useTranslation } from 'react-i18next';

type CalendarMode = "day" | "week" | "month";

interface CalendarModeModalProps {
  calendarMode: CalendarMode;
  setCalendarMode: (mode: CalendarMode) => void;
}

const CalendarModeModal: React.FC<CalendarModeModalProps> = ({ calendarMode, setCalendarMode }) => {
  const { t } = useTranslation();
  return (
    <View style={{ alignItems: "center" }}>
      <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 16 }}>{t('calendarModeModalTitle')}</Text>
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
            {t(`calendarMode_${mode}`)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default CalendarModeModal;
