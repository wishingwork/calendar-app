import { useEffect, useCallback, useState } from "react";
import { View, Text, Image, TouchableOpacity, Button } from "react-native";
import { Calendar } from "react-native-big-calendar";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../Redux/store";
import { setEvents } from "../../../Redux/features/eventsSlice";
import { fetchEvents } from "../../../utils/fetchAPI";
import { loadData } from '../../../utils/storage';
import { router } from 'expo-router';
import { useCalendarMode } from '../../CalendarModeContext';
import styles from './styles';
import { WEATHER_CONDITIONS } from "../../../constants/weather";
import { getTemperatureColor } from '../../../utils/colorUtils';
import dayjs from 'dayjs';

export default function CalendarView() {
  const dispatch = useDispatch();
  const { calendarMode } = useCalendarMode();
  const [date, setDate] = useState(dayjs().toDate());

  const _onPrevDate = () => {
    setDate(dayjs(date).add(-1, calendarMode).toDate());
  };

  const _onNextDate = () => {
    setDate(dayjs(date).add(1, calendarMode).toDate());
  };
  const today = new Date()
  const _onToday = () => {
    setDate(today)
  }  

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
        key={event.id}
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

  const fetchAndSetEvents = useCallback(async () => {
	try {
	  const token = await loadData('userToken');
	  if (!token) return;
	  const data = await fetchEvents(token);
	  dispatch(setEvents(data));
	} catch (e) {
	  console.error(e);
	}
  }, [dispatch]);

  useEffect(() => {
	fetchAndSetEvents();
  }, [fetchAndSetEvents]);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 10 }}>
        <TouchableOpacity onPress={_onPrevDate} style={styles.headerButton}>
          <Text style={styles.headerText}>&#60;</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={_onToday} style={styles.headerButton}>
          <Text style={[styles.headerText, {fontWeight: 'bold'}]}>{dayjs(date).format('MMM YYYY')}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={_onNextDate} style={styles.headerButton}>
          <Text style={styles.headerText}>&#62;</Text>
        </TouchableOpacity>                
      </View>
      <Calendar
        events={events}
        height={400}
        mode={calendarMode}
        date={date}
        onPressEvent={(event) => router.push(`/EventDetailView/${event.id}`)}
        renderEvent={renderEvent}
        dayHeaderHighlightColor="#007BFF" // Highlight the current day's header with blue
        dayHeaderStyle={{
          overflow: 'hidden', // Ensure the background color respects the border radius
        }}
        swipeEnabled={false}
        maxVisibleEventCount={2}
      />
    </View>
  );
}