import React, { useState } from "react";
import { Platform, View, Text, TouchableOpacity } from "react-native";
import DateTimePicker, { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

type Props = {
  value: Date;
  onChange: (date: Date) => void;
};

export default function DatePicker({ value, onChange }: Props) {
  const [showPicker, setShowPicker] = useState(false);


  const onChangeAndroid = (event: any, selectedDate: any) => {
    const currentDate = selectedDate;
    onChange(currentDate);
  };

  const showMode = (currentMode: any) => {
    DateTimePickerAndroid.open({
      value: value,
      onChange: onChangeAndroid,
      mode: currentMode,
      is24Hour: true,
    });
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  const datetimePickerWeb = ({ value, onChange, setShowPicker }) => {
    return  (         
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
        <input
          type="datetime-local"
          value={
            (() => {
              const local = new Date(value.getTime() - value.getTimezoneOffset() * 60000);
              return local.toISOString().slice(0, 16);
            })()
          }
          onChange={e => {
            const localValue = e.target.value;
            const [datePart, timePart] = localValue.split("T");
            if (!datePart || !timePart) {
              console.error("Invalid date-time format:", localValue);
              return;
            }
            const [year, month, day] = datePart.split("-").map(Number);
            const [hour, minute] = timePart.split(":").map(Number);
            const localDate = new Date(year, month - 1, day, hour, minute);
            onChange(localDate);
          }}
          style={{
            padding: 12,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 8,
            backgroundColor: "#fff",
            fontSize: 16,
            marginRight: 8,
          }}
          autoFocus
        />
        <TouchableOpacity
          onPress={() => setShowPicker(false)}
          style={{
            paddingVertical: 8,
            paddingHorizontal: 12,
            backgroundColor: "#eee",
            borderRadius: 6,
            borderWidth: 1,
            borderColor: "#ccc",
          }}
        >
          <Text style={{ fontSize: 16, color: "#333" }}>Close</Text>
        </TouchableOpacity>
    </View>);
  }

  return (
    <>
      <TouchableOpacity
        style={!showPicker && {
          padding: 12,
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          marginBottom: 16,
          backgroundColor: "#fff",
        }}
        onPress={() => setShowPicker(!showPicker)}
      >
        {!showPicker && (
          <Text style={{ fontSize: 16, color: "#333" }}>
            {value ? `${value.toLocaleDateString()} ${value.toLocaleTimeString()}` : ""}
          </Text>
        )}
      </TouchableOpacity>
      {showPicker && (
        Platform.OS === "web" ? (
          datetimePickerWeb({ value, onChange, setShowPicker })
        ) : (
            Platform.OS === "ios" ? (
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
            <DateTimePicker
              value={value || new Date()}
              mode="datetime"
              display="default"
              onChange={(event, selectedDate) => {
                if (selectedDate) onChange(selectedDate);
              }}
              style={{ marginBottom: 16 }}
            />
            <TouchableOpacity
              onPress={() => setShowPicker(false)}
              style={{
                marginLeft: 8,
                paddingVertical: 8,
                paddingHorizontal: 12,
                backgroundColor: "#eee",
                borderRadius: 6,
                borderWidth: 1,
                borderColor: "#ccc",
              }}
            >
              <Text style={{ fontSize: 16, color: "#333" }}>Finish</Text>
            </TouchableOpacity>
          </View>
            ) : (
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
                <Text onPress={showDatepicker} style={{
                  marginLeft: 8,
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  backgroundColor: "#eee",
                  borderRadius: 6,
                  borderWidth: 1,
                  borderColor: "#ccc",
                }}>{value
                  ? value.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    })
                  : ""}</Text> 
                <Text onPress={showTimepicker} style={{
                  marginLeft: 8,
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  backgroundColor: "#eee",
                  borderRadius: 6,
                  borderWidth: 1,
                  borderColor: "#ccc",
                }}>{value
                  ? value.toLocaleTimeString("en-US", {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                    })
                  : ""}</Text>                

                <TouchableOpacity
                  onPress={() => setShowPicker(false)}
                  style={{
                  marginLeft: 8,
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  backgroundColor: "#eee",
                  borderRadius: 6,
                  borderWidth: 1,
                  borderColor: "#ccc",
                  }}
                >
                  <Text style={{ fontSize: 16, color: "#333" }}>Finish</Text>
                </TouchableOpacity>
                </View>
            )
        )
      )}
    </>
  );
}
