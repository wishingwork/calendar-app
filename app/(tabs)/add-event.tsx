import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Switch,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function AddEvent() {
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [eventCity, setEventCity] = useState("");
  const [saveAsFrequent, setSaveAsFrequent] = useState(false);
  const [travelMode, setTravelMode] = useState("Driving");

  const validateInput = (input) => {
    const forbiddenPatterns = /(;|--|DROP|SELECT|INSERT|DELETE|UPDATE|CREATE|ALTER|EXEC|UNION)/i;
    return !forbiddenPatterns.test(input);
  };

  const handleSaveEvent = () => {
    if (!validateInput(eventName) || !validateInput(eventCity)) {
      Alert.alert("Invalid Input", "Please avoid using special SQL keywords or symbols.");
      return;
    }

    Alert.alert("Event Saved", `Event "${eventName}" has been saved successfully!`);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Event Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter event name"
        value={eventName}
        onChangeText={(text) => setEventName(text)}
      />

      <Text style={styles.label}>Event Date and Time</Text>
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.dateText}>
          {eventDate.toLocaleDateString()} {eventDate.toLocaleTimeString()}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={eventDate}
          mode="datetime"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setEventDate(selectedDate);
          }}
        />
      )}

      <Text style={styles.label}>Event City</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter city"
        value={eventCity}
        onChangeText={(text) => setEventCity(text)}
      />

      <View style={styles.switchRow}>
        <Text style={styles.label}>Save as Frequent Location</Text>
        <Switch
          value={saveAsFrequent}
          onValueChange={(value) => setSaveAsFrequent(value)}
        />
      </View>

      <Text style={styles.label}>Travel Mode</Text>
      <Picker
        selectedValue={travelMode}
        onValueChange={(itemValue) => setTravelMode(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Driving" value="Driving" />
        <Picker.Item label="Flight" value="Flight" />
        <Picker.Item label="Train" value="Train" />
        <Picker.Item label="Bus/Public Transit" value="Bus/Public Transit" />
        <Picker.Item label="Walking" value="Walking" />
      </Picker>

      <View style={styles.buttonRow}>
        <Button title="Save Event" onPress={handleSaveEvent} color="#007BFF" />
        <Button title="Cancel" onPress={() => Alert.alert("Cancelled")} color="#6c757d" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  dateButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  dateText: {
    fontSize: 16,
    color: "#333",
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
});