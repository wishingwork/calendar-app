import React, { useState, useEffect } from "react";
import { View, Text, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentEvent } from "../../Redux/features/eventsSlice";
import { fetchEventById } from "../../utils/fetchAPI";
import { loadData } from '../../utils/storage';
import { travelModeOptions } from "../../constants/travelMode";
import styles from './styles';
import { RootState } from "../../Redux/store";

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
  const eventId: string = (route as any)?.params?.eventId ?? "";

  const [event, setEvent] = useState<any>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const token = await loadData('userToken') ?? '';
        if (!eventId || !token) throw new Error('Missing eventId or token');
        const eventData = await fetchEventById(eventId, token);
        setEvent(eventData);
        dispatch(setCurrentEvent(eventData)); // <-- set current event
      } catch {
        Alert.alert("Error", "Failed to load event.");
        navigation.goBack();
      }
    };
    if (eventId) fetchEvent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId, navigation]);

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
      <Text style={styles.value}>
        {
          (() => {
            const found = travelModeOptions.find(opt => opt.value === parseInt(event.travel_mode, 10));
            return found ? found.label : "N/A";
          })()
        }
      </Text>

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
