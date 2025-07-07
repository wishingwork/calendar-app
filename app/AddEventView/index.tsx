import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { createEvent, fetchEvents } from "../../utils/fetchAPI"; // import the helper
import { loadData } from '../../utils/storage';
import { useDispatch } from "react-redux";
import { setEvents } from "../../Redux/features/eventsSlice";
import DatetimePicker from "./DatetimePicker"; // <-- import the new component
import styles from './styles';
import { travelModeOptions } from "../../constants/travelMode";

export default function AddEventView() {
  const [title, setTitle] = useState("");
  const [eventDate, setEventDate] = useState(new Date());
  const [showTravelModePicker, setShowTravelModePicker] = useState(false);
  const [address, setAddress] = useState("");
  const [travelMode, setTravelMode] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [startDatetime, setStartDatetime] = useState(new Date());
  const [endDatetime, setEndDatetime] = useState(new Date());
  const [success, setSuccess] = useState(false); // <-- add success state

  const dispatch = useDispatch();

  const validateInput = (input: string) => {
    const forbiddenPatterns = /(;|--|DROP|SELECT|INSERT|DELETE|UPDATE|CREATE|ALTER|EXEC|UNION)/i;
    return !forbiddenPatterns.test(input);
  };

  const handleSaveEvent = async () => {
    if (!validateInput(title) || !validateInput(address)) {
      setErrors({ password: "Please avoid using special SQL keywords or symbols." });
      return;
    }
    if (!title || !address) {
      setErrors({ required: "Please fill in all required fields." });
      return;
    }
    if (!startDatetime || !endDatetime) {
      Alert.alert("Missing DateTime", "Please select both start and end times.");
      return;
    }
    setLoading(true);
    try {
      const userTokenRaw = await loadData('userToken');
      const token = userTokenRaw || '';
      if (!token) throw new Error("Not authenticated");
      const payload = {
        title,
        event_datetime: eventDate.toISOString(),
        address,
        travel_mode: travelMode || 1,
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
      setSuccess(true); // <-- show success
      setTimeout(() => setSuccess(false), 2000); // <-- revert after 2s
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
        <TouchableOpacity
          onPress={handleSaveEvent}
          disabled={loading || success}
          style={[
            styles.saveButton,
            success && { backgroundColor: "#007BFF" },
            loading && { opacity: 0.5 }
          ]}
        >
          <Text style={[styles.saveButtonText, success && { color: "#fff" }]}>
            {success ? "Saved!" : loading ? "Saving..." : "Save Event"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}