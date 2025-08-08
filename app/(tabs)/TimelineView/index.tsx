import { View, Text, FlatList, Image, RefreshControl, TouchableOpacity } from "react-native";
import { useEffect, useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../Redux/store";
import { setEvents } from "../../../Redux/features/eventsSlice";
import { fetchEvents } from "../../../utils/fetchAPI";
import { loadData } from '../../../utils/storage';
import { WEATHER_CONDITIONS } from "../../../constants/weather";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { router } from 'expo-router';
import styles from './styles';
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useTranslation } from 'react-i18next';

dayjs.extend(utc);
dayjs.extend(timezone);

function formatEventTime(dt: string, tz?: string) {
  if (!dt) return { main: "", tz: "" };
  const d = tz ? dayjs(dt).tz(tz) : dayjs(dt);
  const tzOffset = d.format("Z");
  return {
    main: d.format("HH:mm"),
    tz: `(GMT${tzOffset})`,
  };
}

type EventItem = {
  id: string;
  time: string; // e.g. "09:00 - 10:00"
  title: string;
  location?: { address?: string };
  weather?: string;
  temperature?: number | string;
  start_datetime?: string;
  end_datetime?: string;
  timezone?: string;
};

const renderCard = ({ item }: { item: EventItem }) => {
  type WeatherKey = keyof typeof WEATHER_CONDITIONS;
  const weatherKey = item.weather as WeatherKey;
  const iconSource = WEATHER_CONDITIONS[weatherKey]?.icon;
  const weatherLabel = WEATHER_CONDITIONS[weatherKey]?.label;

  // Timezone logic
  const tz = item.timezone || dayjs.tz.guess();
  const start = formatEventTime(item.start_datetime, tz);
  const end = formatEventTime(item.end_datetime, tz);

  return (
    <View style={styles.eventRow}>
      {/* Left Side: Event Time */}
      <View style={styles.leftColumn}>
        <Text style={styles.eventTime}>
          {item.start_datetime && item.end_datetime
            ? `${start.main} - ${end.main}`
            : item.time}
        </Text>
        <Text style={[styles.tzText, { fontSize: 10, color: "#888" }]}>
          {item.start_datetime ? start.tz : ""}
        </Text>
        <View style={styles.verticalLine} />
      </View>

      {/* Right Side: Event Details */}
      <View
        style={styles.card}
        onTouchEnd={() => {
          router.push(`/EventDetailView/${item.id}`);
        }}
      >
        <Text style={styles.eventName}>{item.title}</Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{ flex: 2 }}>
            <Text style={styles.city}>{item.location?.address}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.weatherRow}>
              {/* Weather icon and text, if available */}
              {item.weather && (
                <>
                  {iconSource ? <Image source={iconSource} style={styles.icon} /> : null}
                  <Text style={styles.weather}>
                    {weatherLabel ?? item.weather}
                  </Text>
                </>
              )}
            </View>
            <Text style={styles.temperature}>
              {item.temperature ? `${item.temperature}°C` : ""}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

// Update renderCalendarCard to pass navigation to renderCard
const renderCalendarCard = ({ item }) => {
  return (
    <>
      <View style={styles.bar}>
        <Text style={styles.dateText}>
          {item.date}
        </Text>
      </View>
      <FlatList
        data={item.events}
        renderItem={({ item }) => renderCard({ item })}
        keyExtractor={(ev) => ev.id}
        contentContainerStyle={styles.container}
      />
    </>
  );
};

export default function TimelineView() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const eventsData = useSelector((state: RootState) => state.events.events);
  // Select the time window from Redux (adjust the selector as per your state shape)
  const timeWindow = useSelector((state: RootState) => state.calendar?.timeWindow); // e.g., { start: string, end: string }

  const [refreshing, setRefreshing] = useState(false);

  // Filter eventsData based on the time window
  const filteredEventsData = timeWindow
    ? eventsData.filter((item) => {
      // item.date is assumed to be in 'YYYY-MM-DD' format
      return item.date >= timeWindow.start && item.date <= timeWindow.end;
    })
    : eventsData;

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

  if (filteredEventsData.length === 0) {
    return (
      <TouchableOpacity style={styles.noEventsContainer} onPress={() => router.push('/AddEventView')}>
        <Text style={styles.noEventsText}>{t('noEvents')}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <FlatList
      data={filteredEventsData}
      renderItem={({ item }) => renderCalendarCard({ item })}
      keyExtractor={(item) => item.date}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={fetchAndSetEvents} />
      }
    />
  );
}