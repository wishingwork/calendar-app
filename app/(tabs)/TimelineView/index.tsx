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

type EventItem = {
  id: string;
  time: string; // e.g. "09:00 - 10:00"
  title: string;
  location?: { address?: string };
  weather?: string;
  temperature?: number | string;
  start_datetime?: string;
  end_datetime?: string;
};

const renderCard = ({ item }: { item: EventItem }) => {
  type WeatherKey = keyof typeof WEATHER_CONDITIONS;
  const weatherKey = item.weather as WeatherKey;
  const iconSource = WEATHER_CONDITIONS[weatherKey]?.icon;
  const weatherLabel = WEATHER_CONDITIONS[weatherKey]?.label
  return (
    <View style={styles.eventRow}>
      {/* Left Side: Event Time */}
      <View style={styles.leftColumn}>
        <Text style={styles.eventTime}>
          {/* Show time window if available */}
          {item.start_datetime && item.end_datetime
            ? `${item.start_datetime.slice(11, 16)} - ${item.end_datetime.slice(11, 16)}`
            : item.time}
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
                  {(() => {

                    if (iconSource) {
                      return <Image source={iconSource} style={styles.icon} />;
                    }
                    return null;
                  })()}
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

  // Set header right button for Add Event
  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity
            onPress={() => navigation.navigate("AddEventView")}
            style={{ marginRight: 16 }}
            accessibilityLabel="Add Event"
          >
            <Ionicons name="add-circle-outline" size={26} color="#0077CC" />
          </TouchableOpacity>
        ),
      });
    }, [navigation])
  );

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