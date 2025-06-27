import { useEffect, useCallback, useState, useRef } from "react";
import { View, Text, StyleSheet, FlatList, Image, PanResponder, Modal, TouchableOpacity } from "react-native";
import { Calendar } from "react-native-big-calendar";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { setEvents } from "../eventsSlice";
import { fetchEvents } from "../../utils/fetchAPI";
import { loadData } from '../../utils/storage';
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

export default function Home() {
  const [selected, setSelected] = useState<string | null>(null);
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  // Calendar mode state and modal state
  const [calendarMode, setCalendarMode] = useState<"day" | "week" | "month">("week");
  const [modeModalVisible, setModeModalVisible] = useState(false);

  // Set header right button for Add Event and mode switch
  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerRight: () => (
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              onPress={() => navigation.navigate("AddEventView")}
              style={{ marginRight: 12 }}
              accessibilityLabel="Add Event"
            >
              <Ionicons name="add-circle-outline" size={26} color="#0077CC" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModeModalVisible(true)} style={{ marginRight: 4 }}>
              <Ionicons name="options-outline" size={24} color="#0077CC" />
            </TouchableOpacity>
          </View>
        ),
      });
    }, [navigation, setModeModalVisible])
  );

  // Get events from Redux
  const eventsData = useSelector((state: RootState) => state.events.events);
  // Map Redux events to BigCalendar format
  const events = eventsData.flatMap((group) => {
    return group.events.map((item) => ({
      title: item.title,
      start: item.start_datetime ? new Date(item.start_datetime) : new Date(group.date + "T09:00:00"),
      end: item.end_datetime ? new Date(item.end_datetime) : new Date(group.date + "T10:00:00"),
      id: item.id,
      weather: item.weather,
      icon: item.icon,
      city: item.location?.city,
      location: item.location,
      // ...add other fields as needed...
    }))}
  );

  const renderEvent = (event) => (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      {event.icon && (
        <Image source={{ uri: event.icon }} style={{ width: 20, height: 20, marginRight: 4 }} />
      )}
      <Text style={{ fontWeight: "bold" }}>{event.city || ""}</Text>
      <Text style={{ marginLeft: 4 }}>{event.weather || ""}</Text>
      <Text style={{ marginLeft: 8, color: "#888", fontSize: 12 }}>
        {event.start && event.end
          ? `${event.start.toISOString().slice(11, 16)} - ${event.end.toISOString().slice(11, 16)}`
          : ""}
      </Text>
    </View>
  );

  // Optionally filter events/cards by selected date
  const filteredEvents = selected
    ? events.filter(
        (ev) =>
          ev.start.toISOString().slice(0, 10) === selected
      )
    : events;

  const fetchAndSetEvents = useCallback(async () => {
	setRefreshing(true);
	try {
	  const token = await loadData('userToken');
	  if (!token) return;
	  const data = await fetchEvents(token);
	  dispatch(setEvents(data));
	} catch (e) {
	  // handle error if needed
	} finally {
	  setRefreshing(false);
	}
  }, [dispatch]);

  useEffect(() => {
	fetchAndSetEvents();
  }, [fetchAndSetEvents]);

  return (
    <View style={{ flex: 1 }}>
      {/* Calendar Mode Modal */}
      <Modal
        visible={modeModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModeModalVisible(false)}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.2)",
            justifyContent: "center",
            alignItems: "center",
          }}
          activeOpacity={1}
          onPressOut={() => setModeModalVisible(false)}
        >
          <View style={{
            backgroundColor: "#fff",
            borderRadius: 12,
            padding: 24,
            minWidth: 220,
            alignItems: "center",
            elevation: 4,
          }}>
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
                onPress={() => {
                  setCalendarMode(mode as "day" | "week" | "month");
                  setModeModalVisible(false);
                }}
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
        </TouchableOpacity>
      </Modal>

      <Calendar
        events={events}
        height={400}
        mode={calendarMode}
        onPressEvent={(event) => navigation.navigate("EventDetailView", { event })}
        // renderEvent={renderEvent}
        // swipeEnabled={true}
      />

      {/* <FlatList
        data={filteredEvents}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.date}>
              {item.start ? item.start.toISOString().slice(0, 10) : ""}
            </Text>
            <Text style={styles.city}>{item.city}</Text>
            <View style={styles.weatherRow}>
              {item.icon && (
                <Image source={{ uri: item.icon }} style={styles.icon} />
              )}
              <Text style={styles.weather}>{item.weather}</Text>
            </View>
            <Text style={styles.temperature}>
              {item.start && item.end
                ? `Time: ${item.start.toISOString().slice(11, 16)} - ${item.end.toISOString().slice(11, 16)}`
                : ""}
            </Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.container}
        style={{ flex: 1 }}
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  date: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  city: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
  },
  weatherRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  icon: {
    width: 32,
    height: 32,
    marginRight: 8,
  },
  weather: {
    fontSize: 14,
    color: "#333",
  },
  temperature: {
    fontSize: 14,
    color: "#777",
  },
});