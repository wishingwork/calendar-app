import React, { useState } from 'react';
import { View, TextInput, Button, FlatList, Text, TouchableOpacity, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { useRouter } from 'expo-router';
import styles from './styles';
import { fetchAddressOptions } from '../../utils/fetchAPI';
import { loadData } from '../../utils/storage';
import { useAddress } from '../AddressContext';

interface AddressOption {
  formatted: string;
  geometry: {
    lat: number;
    lng: number;
  }
}

export default function AddAddressView() {
  const [search, setSearch] = useState('');
  const [addressOptions, setAddressOptions] = useState<AddressOption[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<AddressOption | null>(null);
  const router = useRouter();
  const { setAddress } = useAddress();

  const handleSearch = async () => {
    try {
      const token = await loadData('userToken');
      if (token) {
        const data = await fetchAddressOptions(search, token);
        setAddressOptions(data || []);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectAddress = (address: AddressOption) => {
    setSelectedAddress(address);
    // setAddressOptions([]);
  };

  const handleConfirm = () => {
    if (selectedAddress) {
      setAddress(selectedAddress.formatted);
      router.back();
    }
  };

const leafletHTML = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Leaflet Map</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <style>
      #map { height: 100vh; margin: 0; padding: 0; }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script>
      const map = L.map('map').setView([${selectedAddress?.geometry.lat || null}, ${selectedAddress?.geometry.lng || null}], 16);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);
      L.marker([${selectedAddress?.geometry.lat || null}, ${selectedAddress?.geometry.lng || null}]).addTo(map)
        .bindPopup(${selectedAddress?.formatted || null})
        .openPopup();
    </script>
  </body>
</html>
`;

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search for an address"
          value={search}
          onChangeText={setSearch}
        />
        <Button title="Search" onPress={handleSearch} />
      </View>
      {addressOptions.length > 0 && (
        <FlatList
          data={addressOptions}
          keyExtractor={(item) => item.formatted}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSelectAddress(item)}>
              <Text style={styles.dropdownItem}>{item.formatted}</Text>
            </TouchableOpacity>
          )}
          style={styles.dropdown}
        />
      )}
      {selectedAddress && (
        Platform.OS !== 'web' ? (
          <WebView
            originWhitelist={['*']}
            source={{ html: leafletHTML }}
            style={styles.webview}
            javaScriptEnabled={true}
            domStorageEnabled={true}         
          />
        ) : (
          <Text>Map only available on mobile (iOS/Android)</Text>
        )
      )}

      <Button title="Confirm" onPress={handleConfirm} disabled={!selectedAddress} />
    </View>
  );
};