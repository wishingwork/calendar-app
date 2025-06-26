import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

function formatEventTime(dt: string, tz?: string) {
  // dt: ISO string, tz: e.g. "America/Chicago"
  const d = tz ? dayjs(dt).tz(tz) : dayjs(dt);
  const tzAbbr = d.format("z"); // e.g. CDT
  const tzOffset = d.format("Z"); // e.g. -05:00
  return {
    main: d.format("ddd, MMM D [at] h:mm A"),
    tz: `(GMT${tzOffset})`,
  };
}

export default function EventDetailView() {
  const navigation = useNavigation();
  const route = useRoute();
  // Expect event passed as param: { event }
  const { event } = route.params as { event: any };

  // You may want to get the user's timezone or use event.timezone if available
  const tz = event.timezone || dayjs.tz.guess();

  const start = formatEventTime(event.start_datetime, tz);
  const end = formatEventTime(event.end_datetime, tz);

  // Set custom header style
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: "#FAF8F4",
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
      },
      headerShadowVisible: false,
      headerTintColor: "#0077CC",
    });
  }, [navigation]);

  return (
    <View style={styles.container}>

      {/* Title */}
      <Text style={styles.title}>{event.title}</Text>

      {/* Time Window */}
      <Text style={styles.label}>Start</Text>
      <View style={styles.timeRow}>
        <Text style={styles.timeText}>
            {start.main}
        </Text>
        <Text style={styles.tzText}>{start.tz}</Text>
      </View>
      <Text style={styles.label}>End</Text>
      <View style={styles.timeRow}>
        <Text style={styles.timeText}>
            {end.main}
        </Text>
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
    // backgroundColor: "#fafbfc",
    padding: 24,
    backgroundColor: "rgb(250 248 244 / var(--tw-bg-opacity, 1))"    
  },
  backButton: {
    position: "absolute",
    left: 16,
    top: 48,
    zIndex: 10,
    padding: 8,
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
    // justifyContent: "center",
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
});
