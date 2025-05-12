import { Calendar } from 'react-native-calendars';

export default function App() {
  return (
    <Calendar
      onDayPress={day => {
        console.log('selected day', day);
      }}
      markedDates={{
        '2025-05-12': { selected: true, marked: true, selectedColor: 'blue' },
      }}
    />
  );
}
