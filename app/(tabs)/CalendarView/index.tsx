import { useEffect, useCallback, useState, useMemo } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Calendar } from "react-native-big-calendar";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../Redux/store";
import { setEvents } from "../../../Redux/features/eventsSlice";
import { fetchEvents } from "../../../utils/fetchAPI";
import { loadData } from '../../../utils/storage';
import { useNavigation, useRoute } from "@react-navigation/native";
import { router } from 'expo-router';
import { useCalendarMode } from '../../CalendarModeContext';
import styles from './styles';
import { WEATHER_CONDITIONS } from "../../../constants/weather";
import { getTemperatureColor } from '../../../utils/colorUtils';

export default function CalendarView() {
  const [selected, setSelected] = useState<string | null>(null);
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const { calendarMode } = useCalendarMode();

  // Get events from Redux
  const eventsData = useSelector((state: RootState) => state.events.events);
  // Map Redux events to BigCalendar format
  const events = eventsData.flatMap((group) => {
    return group.events.map((item) => ({
      title: item.title ,
      start: item.start_datetime ? new Date(item.start_datetime) : new Date(group.date + "T09:00:00"),
      end: item.end_datetime ? new Date(item.end_datetime) : new Date(group.date + "T10:00:00"),
      id: item.id,
      weather: item.weather,
      icon: item.icon,
      city: item.location?.city,
      location: item.location,
      temperature: item.temperature,
      // ...add other fields as needed...
    }))}
  );

  const renderEvent = (
    event,
    touchableOpacityProps: any,
  ) => {
    type WeatherKey = keyof typeof WEATHER_CONDITIONS;
    const weatherKey = event.weather as WeatherKey;
    const iconSource = WEATHER_CONDITIONS[weatherKey]?.icon;
    return (
      <TouchableOpacity
        {...touchableOpacityProps}
        style={[
          touchableOpacityProps?.style,
          { backgroundColor: getTemperatureColor(event.temperature) }
        ]}
      >
        <Text style={{ color: '#333', height: calendarMode === 'month' && 15 }}>
          {event.title}
          {event.weather && calendarMode !== 'month'&& (
            <>
              {iconSource ? <Image source={iconSource} style={styles.icon} /> : null}
            </>
          )}
        </Text>
      </TouchableOpacity>
    );
  };

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
      <Calendar
        events={events}
        height={400}
        mode={calendarMode}
        onPressEvent={(event) => router.push(`/EventDetailView/${event.id}`)}
        renderEvent={renderEvent}
        dayHeaderHighlightColor="#007BFF" // Highlight the current day's header with blue
        dayHeaderStyle={{
          overflow: 'hidden', // Ensure the background color respects the border radius
        }}        
      />
    </View>
  );
}