import React, { useState } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, Platform, KeyboardAvoidingView, ScrollView, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { useRouter } from 'expo-router';
import styles from './styles';
import { fetchAddressOptions } from '../../utils/fetchAPI';
import { loadData } from '../../utils/storage';
import { useAddress } from '../AddressContext';
import { useTranslation } from 'react-i18next';

interface AddressOption {
  formatted: string;
  geometry: {
    lat: number;
    lng: number;
  }
}

export default function AddAddressView() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [addressOptions, setAddressOptions] = useState<AddressOption[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<AddressOption | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const router = useRouter();
  const { setAddress } = useAddress();

  const handleSearch = async () => {
    setLoading(true);
    setSearched(false);
    try {
      const token = await loadData('userToken');
      if (token) {
        const data = await fetchAddressOptions(search, token);
        setAddressOptions(data || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  const handleSelectAddress = (address: AddressOption) => {
    setSelectedAddress(address);
    // setAddressOptions([]);
  };

  const handleConfirm = () => {
    if (selectedAddress) {
      setAddress(selectedAddress);
      router.back();
    }
  };

const formatCoord = (coord?: number) =>
  typeof coord === 'number' ? coord.toFixed(7) : '0.0000000';

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
      html, body { margin: 0; padding: 0; }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script>
      const lat = ${formatCoord(selectedAddress?.geometry.lat)};
      const lng = ${formatCoord(selectedAddress?.geometry.lng)};
      const map = L.map('map').setView([lat, lng], 16);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);
      L.marker([lat, lng]).addTo(map)
        .bindPopup(${JSON.stringify(selectedAddress?.formatted || '')})
        .openPopup();
    </script>
  </body>
</html>
`;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >     
      <ScrollView contentContainerStyle={styles.inner}>   
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.input}
            placeholder={t('searchAddress')}
            value={search}
            onChangeText={setSearch}
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.searchButtonText}>{t('search')}</Text>}
          </TouchableOpacity>
        </View>
        {searched && !loading && addressOptions.length === 0 && (
          <Text style={styles.noResults}>{t('noResults')}</Text>
        )}
        {addressOptions.length > 0 && (
          <FlatList
            data={addressOptions}
            keyExtractor={(item) => item.formatted}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleSelectAddress(item)} style={[styles.dropdownItem, selectedAddress?.formatted === item.formatted && styles.selectedDropdownItem]}>
                <Text style={[selectedAddress?.formatted === item.formatted && styles.selectedDropdownItemText]}>{item.formatted}</Text>
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

        <TouchableOpacity style={styles.saveButton} onPress={handleConfirm} disabled={!selectedAddress}>
          <Text style={styles.saveButtonText}>{t('saveAddress')}</Text>
        </TouchableOpacity>
      </ScrollView> 
    </KeyboardAvoidingView>
  );
};