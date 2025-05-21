import { useState } from "react";
import { View, Text, StyleSheet, FlatList, Image } from "react-native";
import {Calendar, LocaleConfig} from 'react-native-calendars';


const weatherData = [
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

export default function Home() {
  const [selected, setSelected] = useState('');


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

	return (
    <>
      <Calendar 
        onDayPress={day => {
          setSelected(day.dateString);
        }}
        markedDates={{
          [selected]: {selected: true, disableTouchEvent: true, selectedColor: 'orange'}
        }}
      />    

      <FlatList
        data={weatherData}
        renderItem={renderCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.container}
      />
    </>    
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