import { View, Text, FlatList, Image } from "react-native";
import { StyleSheet } from "react-native";

const calendarData = [
  { id: "1", weekday: "Monday", month: "Jan", day: "01", year: "2023" },
  { id: "2", weekday: "Tuesday", month: "Jan", day: "02", year: "2023" },
  { id: "3", weekday: "Wednesday", month: "Jan", day: "03", year: "2023" },
  { id: "4", weekday: "Thursday", month: "Jan", day: "04", year: "2023" },
  { id: "5", weekday: "Friday", month: "Jan", day: "05", year: "2023" },
  { id: "6", weekday: "Saturday", month: "Jan", day: "06", year: "2023" },
  { id: "7", weekday: "Sunday", month: "Jan", day: "07", year: "2023" },
];

const eventData = [
	{
		id: "1",
		date: "2025-05-21",
		city: "New York",
		weather: "Sunny",
		icon: "https://cdn-icons-png.flaticon.com/512/869/869869.png", // Example icon URL
		highTemp: "25°C",
		lowTemp: "15°C",
	},
	{
		id: "2",
		date: "2025-05-22",
		city: "Los Angeles",
		weather: "Cloudy",
		icon: "https://cdn-icons-png.flaticon.com/512/414/414825.png",
		highTemp: "22°C",
		lowTemp: "16°C",
	},
	{
		id: "3",
		date: "2025-05-23",
		city: "Chicago",
		weather: "Rainy",
		icon: "https://cdn-icons-png.flaticon.com/512/1163/1163624.png",
		highTemp: "18°C",
		lowTemp: "10°C",
	},
	{
		id: "4",
		date: "2025-05-24",
		city: "Houston",
		weather: "Stormy",
		icon: "https://cdn-icons-png.flaticon.com/512/1146/1146869.png",
		highTemp: "28°C",
		lowTemp: "20°C",
	},
	{
		id: "5",
		date: "2025-05-25",
		city: "Miami",
		weather: "Sunny",
		icon: "https://cdn-icons-png.flaticon.com/512/869/869869.png",
		highTemp: "30°C",
		lowTemp: "24°C",
	},
];

const renderCard = ({ item }) => (
  <View style={styles.card}>
    <Text style={styles.date}>{item.date}</Text>
    <Text style={styles.city}>{item.city}</Text>
    <View style={styles.weatherRow}>
      <Image source={{ uri: item.icon }} style={styles.icon} />
      <Text style={styles.weather}>{item.weather}</Text>
    </View>
    <Text style={styles.temperature}>
      High: {item.highTemp} | Low: {item.lowTemp}
    </Text>
  </View>
);

const renderCalendarCard = ({ item }: { item: typeof calendarData[0] }) => {
  return (
    <>
      <View style={styles.bar}>
        <Text style={styles.dateText}>
          {`${item.weekday}, ${item.month} ${item.day}, ${item.year}`}
        </Text>
      </View>
      <FlatList
        data={eventData}
        renderItem={renderCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.container}
      />          
    </>
  );
};



export default function Timeline() {
  return (
    <>
      <FlatList
        data={calendarData}
        renderItem={renderCalendarCard}
        keyExtractor={(item) => item.id}
        // contentContainerStyle={styles.container}
      />    
    </>
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
	card: {
		backgroundColor: "#fff",
		borderRadius: 8,
		padding: 16,
		marginBottom: 16,
    margin: 16,
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