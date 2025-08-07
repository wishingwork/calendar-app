import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { createEvent, fetchEvents } from "../../utils/fetchAPI"; // import the helper
import { loadData } from '../../utils/storage';
import { useDispatch } from "react-redux";
import { setEvents } from "../../Redux/features/eventsSlice";
import DatetimePicker from "./DatetimePicker"; // <-- import the new component
import styles from './styles';
import { travelModeOptions } from "../../constants/travelMode";
import { useTranslation } from 'react-i18next';
import { useRouter } from "expo-router";
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { useAddress } from "../AddressContext";

export default function AddEventView() {
  const [title, setTitle] = useState("");
  const [eventDate, setEventDate] = useState(new Date());
  const [showTravelModePicker, setShowTravelModePicker] = useState(false);
  const { address, setAddress } = useAddress();
  const [travelMode, setTravelMode] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [startDatetime, setStartDatetime] = useState(new Date());
  const [endDatetime, setEndDatetime] = useState(new Date());
  const [success, setSuccess] = useState(false); // <-- add success state
  const [errorState, setErrorState] = useState(false); // <-- add error state

  const dispatch = useDispatch();
  const { t } = useTranslation();
  const router = useRouter();

  const route = useRoute();

  useFocusEffect(
    useCallback(() => {
      const myData = route.params?.address;
      if (myData) {
        console.log('Received updated param:', myData);
      }
    }, [route.params?.address])
  );  

  const validateInput = (input: string) => {
    const forbiddenPatterns = /(;|--|DROP|SELECT|INSERT|DELETE|UPDATE|CREATE|ALTER|EXEC|UNION)/i;
    return !forbiddenPatterns.test(input);
  };

  const handleSaveEvent = async () => {
    if (!validateInput(title) || !validateInput(address)) {
      setErrors({ password: t('addEventSqlError') });
      return;
    }
    if (!title || !address) {
      setErrors({ required: t('addEventRequiredError') });
      return;
    }
    if (!startDatetime || !endDatetime) {
      Alert.alert(t('addEventMissingDateTimeTitle'), t('addEventMissingDateTimeMsg'));
      return;
    }
    setLoading(true);
    try {
      const userTokenRaw = await loadData('userToken');
      const token = userTokenRaw || '';
      if (!token) throw new Error("Not authenticated");
      const payload = {
        title,
        event_datetime: eventDate.toISOString(),
        address,
        travel_mode: travelMode || 1,
        start_datetime: startDatetime.toISOString(),
        end_datetime: endDatetime.toISOString(),
      };
      const createEventResponse = await createEvent(payload, token);
      if(createEventResponse.status === 'error') {
        setErrorState(true);
        setTimeout(() => setErrorState(false), 2000);
        throw new Error(createEventResponse.message);
      }
      // Refetch events and update redux
      const events = await fetchEvents(token);
      dispatch(setEvents(events));
      Alert.alert(t('addEventSavedTitle'), t('addEventSavedMsg', { title }));
      setTitle("");
      setAddress("");
      setEventDate(new Date());
      setTravelMode(1);
      setStartDatetime(new Date());
      setEndDatetime(new Date());
      setSuccess(true); // <-- show success
      setTimeout(() => setSuccess(false), 2000); // <-- revert after 2s
    } catch (err: any) {
      Alert.alert(t('addEventErrorTitle'), err.message || t('addEventErrorMsg'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    > 
      <ScrollView contentContainerStyle={styles.inner}>
        <Text style={styles.label}>{t('addEventTitleLabel')}</Text>
        <TextInput
          style={styles.input}
          placeholder={t('addEventTitlePlaceholder')}
          value={title}
          onChangeText={setTitle}
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>{t('addEventStartTimeLabel')}</Text>
        <DatetimePicker
          value={startDatetime}
          onChange={setStartDatetime}
        />

        <Text style={styles.label}>{t('addEventEndTimeLabel')}</Text>
        <DatetimePicker
          value={endDatetime}
          onChange={setEndDatetime}
        />

        <Text style={styles.label}>{t('addEventAddressLabel')}</Text>
        <TouchableOpacity onPress={() => router.push('/AddAddressView')}>
          <TextInput
            style={styles.input}
            placeholder={t('addEventAddressPlaceholder')}
            value={address}
            editable={false}
            placeholderTextColor="#999"
            onPress={() => router.push('/AddAddressView')}
          />
        </TouchableOpacity>

        <Text style={styles.label}>{t('addEventTravelModeLabel')}</Text>
        <TouchableOpacity
          style={!showTravelModePicker && styles.dateButton}
          onPress={() => setShowTravelModePicker(!showTravelModePicker)}
        >
          {!showTravelModePicker && (
          <Text style={styles.dateText}>
            {travelModeOptions.find(e => e.value === travelMode)?.label}
          </Text>
          )}
        </TouchableOpacity>    
        {showTravelModePicker && (    
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
              <Picker
                selectedValue={travelMode}
                onValueChange={(itemValue) => setTravelMode(Number(itemValue))}
                style={[
                styles.picker,
                Platform.OS === "ios" && { height: undefined },
                Platform.OS === "android" && { height: 60 },
                ]}
              >
                {travelModeOptions.map((opt) => (
                <Picker.Item key={opt.value} label={opt.label} value={opt.value} color="#000"/>
                ))}
              </Picker>
              <TouchableOpacity
                onPress={() => setShowTravelModePicker(false)}
                style={{
                  marginLeft: 8,
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  backgroundColor: "#eee",
                  borderRadius: 6,
                  borderWidth: 1,
                  borderColor: "#ccc",
                }}
              >
              <Text style={{ fontSize: 16, color: "#333" }}>{t('addEventTravelModeFinish')}</Text>
              </TouchableOpacity>      
            </View>  
        )}
        {errors.required && <Text style={styles.error}>{t('addEventRequiredError')}</Text>}
        {errors.password && <Text style={styles.error}>{t('addEventSqlError')}</Text>}

        <View style={styles.buttonRow}>
          <TouchableOpacity
            onPress={handleSaveEvent}
            disabled={loading || success}
            style={[
              styles.saveButton,
              success && { backgroundColor: "#007BFF" },
              errorState && { backgroundColor: "#d11a2a" }, // <-- red on error
              loading && { opacity: 0.5 }
            ]}
          >
            <Text style={[
              styles.saveButtonText,
              success && { color: "#fff" },
              errorState && { color: "#fff" }
            ]}>
              {errorState
                ? t('addEventFailedLabel')
                : success
                  ? t('addEventSavedLabel')
                  : loading
                    ? t('addEventSavingLabel')
                    : t('addEventSaveButton')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}