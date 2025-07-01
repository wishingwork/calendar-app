import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, Modal, TouchableOpacity, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useDispatch } from "react-redux";
import { setEvents } from "../../Redux/features/eventsSlice";
import { fetchEvents, deleteEvent as deleteEventAPI, fetchEventById } from "../../utils/fetchAPI";
import { loadData } from '../../utils/storage';

dayjs.extend(utc);
dayjs.extend(timezone);

function formatEventTime(dt: string, tz?: string) {
  const d = tz ? dayjs(dt).tz(tz) : dayjs(dt);
  const tzOffset = d.format("Z");
  return {
    main: d.format("ddd, MMM D [at] h:mm A"),
    tz: `(GMT${tzOffset})`,
  };
}

export default function EventDetailView() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute();
  const eventId = route.params?.eventId;

  const [event, setEvent] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const token = await loadData('userToken');
        // fetchEventById returns the event detail object
        const eventData = await fetchEventById(eventId, token);
        setEvent(eventData);
      } catch (err) {
        Alert.alert("Error", "Failed to load event.");
        navigation.goBack();
      }
    };
    if (eventId) fetchEvent();
  }, [eventId]);

  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: "#FAF8F4",
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
      },
      headerShadowVisible: false,
      headerTintColor: "#0077CC",
      title: "Event Detail",
      headerShown: true, 
      headerRight: () => (
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={{ marginRight: 16 }}
          accessibilityLabel="Delete Event"
        >
          <Ionicons name="trash-outline" size={26} color="#0077CC" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, setModalVisible]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const token = await loadData('userToken');
      await deleteEventAPI(event.id, token);
      // Refresh events in redux
      const events = await fetchEvents(token);
      dispatch(setEvents(events));
      setModalVisible(false);
      navigation.goBack();
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to delete event.");
    } finally {
      setDeleting(false);
    }
  };

  if (!event) {
    return (
      <View style={styles.container}>
        <Text>Loading event...</Text>
      </View>
    );
  }

  const tz = event.timezone || dayjs.tz.guess();
  const start = formatEventTime(event.start_datetime, tz);
  const end = formatEventTime(event.end_datetime, tz);

  return (
    <View style={styles.container}>
      {/* Delete Confirmation Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Delete Event</Text>
            <Text style={styles.modalMessage}>Are you sure you want to delete this event?</Text>
            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#d11a2a" }]}
                onPress={handleDelete}
                disabled={deleting}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>
                  {deleting ? "Deleting..." : "Confirm"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#ccc" }]}
                onPress={() => setModalVisible(false)}
                disabled={deleting}
              >
                <Text style={{ color: "#222", fontWeight: "bold" }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>

      {/* Title */}
      <Text style={styles.title}>{event.title}</Text>

      {/* Time Window */}
      <Text style={styles.label}>Start</Text>
      <View style={styles.timeRow}>
        <Text style={styles.timeText}>{start.main}</Text>
        <Text style={styles.tzText}>{start.tz}</Text>
      </View>
      <Text style={styles.label}>End</Text>
      <View style={styles.timeRow}>
        <Text style={styles.timeText}>{end.main}</Text>
        <Text style={styles.tzText}>{end.tz}</Text>
      </View>

      {/* Address */}
      <Text style={styles.label}>Address</Text>
      <Text style={styles.value}>{event.location?.address || event.address}</Text>

      {/* Travel Mode */}
      <Text style={styles.label}>Travel Mode</Text>
      <Text style={styles.value}>{event.travel_mode || "N/A"}</Text>

      {/* Weather */}
      <Text style={styles.label}>Weather</Text>
      <Text style={styles.value}>
        {event.weather ? `${event.weather}` : "N/A"}
        {event.temperature !== undefined && event.temperature !== null
          ? `, ${event.temperature}°${event.temp_unit || "C"}`
          : ""}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "rgb(250 248 244 / var(--tw-bg-opacity, 1))"
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 64,
    marginBottom: 24,
    color: "#222",
    textAlign: "center",
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 4,
  },
  timeText: {
    fontSize: 18,
    color: "#333",
    marginRight: 6,
  },
  tzText: {
    fontSize: 13,
    color: "#888",
    marginBottom: 2,
  },
  label: {
    marginTop: 18,
    fontSize: 15,
    color: "#666",
    fontWeight: "600",
  },
  value: {
    fontSize: 17,
    color: "#222",
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    minWidth: 240,
    alignItems: "center",
    elevation: 4,
  },
  modalTitle: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 12,
    color: "#d11a2a",
  },
  modalMessage: {
    fontSize: 16,
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 8,
    borderRadius: 6,
    alignItems: "center",
  },
});
