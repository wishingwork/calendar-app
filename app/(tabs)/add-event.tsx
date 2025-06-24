import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { createEvent } from "../../utils/fetchAPI"; // import the helper
import { loadData, deleteData } from '../../utils/storage';
import { colors } from '../../styles/colors';

const travelModeOptions = [
  { label: "Car", value: 0 },
  { label: "Transit", value: 1 },
  { label: "Bike", value: 2 },
  { label: "Walking", value: 3 },
  { label: "Flight", value: 4 },
];

export default function AddEvent() {
  const [title, setTitle] = useState("");
  const [eventDate, setEventDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [address, setAddress] = useState("");
  const [travelMode, setTravelMode] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateInput = (input: string) => {
    const forbiddenPatterns = /(;|--|DROP|SELECT|INSERT|DELETE|UPDATE|CREATE|ALTER|EXEC|UNION)/i;
    return !forbiddenPatterns.test(input);
  };

  const handleSaveEvent = async () => {
    if (!validateInput(title) || !validateInput(address)) {
      // Alert.alert("Invalid Input", "Please avoid using special SQL keywords or symbols.");
      setErrors({ password: "Please avoid using special SQL keywords or symbols." });
      return;
    }
    if (!title || !address) {
      // Alert.alert("Missing Fields", "Please fill in all required fields.");
      setErrors({ required: "Please fill in all required fields." });
      return;
    }
    setLoading(true);
    try {
      // const token = await localStorage.getItem("token");
      const userTokenRaw = await loadData('userToken');
      const token = userTokenRaw || '';
      if (!token) throw new Error("Not authenticated");
      await createEvent({
        title,
        event_datetime: eventDate.toISOString(),
        address,
        travel_mode: travelMode,
      }, token);
      Alert.alert("Event Saved", `Event "${title}" has been saved successfully!`);
      setTitle("");
      setAddress("");
      setEventDate(new Date());
      setTravelMode(0);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to save event.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Event Title *</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter event title"
        value={title}
        onChangeText={setTitle}
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
        Platform.OS === "web" ? (
          <input
        type="datetime-local"
        value={eventDate.toISOString().slice(0, 16)}
        onChange={e => {
          setShowDatePicker(false);
          const newDate = new Date(e.target.value);
          if (!isNaN(newDate.getTime())) setEventDate(newDate);
        }}
        style={{
          padding: 12,
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          marginBottom: 16,
          backgroundColor: "#fff",
          fontSize: 16,
        }}
        autoFocus
          />
        ) : (
          <DateTimePicker
        value={eventDate}
        mode="datetime"
        display="default"
        onChange={(event, selectedDate) => {
          setShowDatePicker(false);
          if (selectedDate) setEventDate(selectedDate);
        }}
          />
        )
      )}

      <Text style={styles.label}>Event City (Address) *</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter city/address"
        value={address}
        onChangeText={setAddress}
      />

      <Text style={styles.label}>Travel Mode</Text>
      <Picker
        selectedValue={travelMode}
        onValueChange={(itemValue) => setTravelMode(Number(itemValue))}
        style={styles.picker}
      >
        {travelModeOptions.map((opt) => (
          <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
        ))}
      </Picker>
      {errors.required && <Text style={styles.error}>{errors.required}</Text>}

      <View style={styles.buttonRow}>
        <Button title={loading ? "Saving..." : "Save Event"} onPress={handleSaveEvent} color="#007BFF" disabled={loading} />
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
  error: {
    color: colors.error,
    fontSize: 13,
    marginBottom: 8,
    alignSelf: 'flex-start',
    marginLeft: 8,
  },  
});