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
import { createEvent, fetchEvents } from "../../utils/fetchAPI"; // import the helper
import { loadData, deleteData } from '../../utils/storage';
import { colors } from '../../styles/colors';
import { useDispatch } from "react-redux";
import { setEvents } from "../eventsSlice";
// import { fetchEvents } from "../../utils/fetchAPI";
import DatetimePicker from "./DatetimePicker"; // <-- import the new component
import { useNavigation, useRoute } from "@react-navigation/native";

const travelModeOptions = [
  { label: "Car", value: 0 },
  { label: "Transit", value: 1 },
  { label: "Bike", value: 2 },
  { label: "Walking", value: 3 },
  { label: "Flight", value: 4 },
];

export default function AddEventView() {
  const [title, setTitle] = useState("");
  const [eventDate, setEventDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTravelModePicker, setShowTravelModePicker] = useState(false);
  const [address, setAddress] = useState("");
  const [travelMode, setTravelMode] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [startDatetime, setStartDatetime] = useState(new Date());
  const [endDatetime, setEndDatetime] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const dispatch = useDispatch();
  const navigation = useNavigation();

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
    if (!startDatetime || !endDatetime) {
      Alert.alert("Missing DateTime", "Please select both start and end times.");
      return;
    }
    setLoading(true);
    try {
      // const token = await localStorage.getItem("token");
      const userTokenRaw = await loadData('userToken');
      const token = userTokenRaw || '';
      if (!token) throw new Error("Not authenticated");
      const payload = {
        title,
        event_datetime: eventDate.toISOString(),
        address,
        travel_mode: travelMode,
        start_datetime: startDatetime.toISOString(),
        end_datetime: endDatetime.toISOString(),
      };
      await createEvent(payload, token);
      // Refetch events and update redux
      const events = await fetchEvents(token);
      dispatch(setEvents(events));
      Alert.alert("Event Saved", `Event "${title}" has been saved successfully!`);
      setTitle("");
      setAddress("");
      setEventDate(new Date());
      setTravelMode(0);
      setStartDatetime(new Date());
      setEndDatetime(new Date());
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to save event.");
    } finally {
      setLoading(false);
    }
  };

  // Set navigation title to "Add Event"
  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: "Add Event",
    });
  }, [navigation]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Event Title *</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter event title"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Start Time *</Text>
      <DatetimePicker
        value={startDatetime}
        onChange={setStartDatetime}
      />

      <Text style={styles.label}>End Time *</Text>
      <DatetimePicker
        value={endDatetime}
        onChange={setEndDatetime}
      />

      <Text style={styles.label}>Event City (Address) *</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter city/address"
        value={address}
        onChangeText={setAddress}
      />

      <Text style={styles.label}>Travel Mode</Text>
      <TouchableOpacity
        style={!showTravelModePicker && styles.dateButton}
        onPress={() => setShowTravelModePicker(!showTravelModePicker)}
      >
        {!showTravelModePicker && (
        <Text style={styles.dateText}>
          {travelModeOptions[travelMode].label}
        </Text>
        )}
      </TouchableOpacity>    
      {showTravelModePicker && (    
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
            <Picker
              selectedValue={travelMode}
              onValueChange={(itemValue) => setTravelMode(Number(itemValue))}
              style={[
              styles.picker,
              Platform.OS === "ios" ? { height: undefined } : {},
              ]}
            >
              {travelModeOptions.map((opt) => (
              <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
              ))}
            </Picker>
            <TouchableOpacity
              onPress={() => setShowTravelModePicker(false)}
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
      )}
      {errors.required && <Text style={styles.error}>{errors.required}</Text>}



      <View style={styles.buttonRow}>
        <Button title={loading ? "Saving..." : "Save Event"} onPress={handleSaveEvent} color="#007BFF" disabled={loading} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "rgb(250 248 244 / var(--tw-bg-opacity, 1))"    
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
    backgroundColor: "#fff",
    width: "80%",
    height: 40, // Match the close button height (approx 40px)
    justifyContent: "center",
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