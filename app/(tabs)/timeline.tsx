import { View, Text, FlatList, Image, RefreshControl } from "react-native";
import { StyleSheet } from "react-native";
import { useEffect, useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { setEvents } from "../eventsSlice";
import { fetchEvents } from "../../utils/fetchAPI";
import { loadData } from '../../utils/storage';
import {WEATHER_CONDITIONS} from "../../constants/weather";

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
    <View style={styles.card}>
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
)};

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
        renderItem={renderCard}
        keyExtractor={(ev) => ev.id}
        contentContainerStyle={styles.container}
      />          
    </>
  );
};

export default function Timeline() {
  const dispatch = useDispatch();
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

  return (
    <FlatList
      data={filteredEventsData}
      renderItem={renderCalendarCard}
      keyExtractor={(item) => item.date}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={fetchAndSetEvents} />
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  bar: {
    marginVertical: 8,
    padding: 16,
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dateText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  eventRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  leftColumn: {
    width: "30%",
    alignItems: "center",
  },
  eventTime: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
  },
  verticalLine: {
    width: 2,
    height: 100,
    backgroundColor: "#ffd33d",
  },
  card: {
    width: "65%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  eventName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  city: {
    fontSize: 12,
    color: "#999",
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
    fontSize: 12,
    color: "#333",
  },
  temperature: {
    fontSize: 14,
    color: "#777",
  },
});