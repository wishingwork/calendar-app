import { useModal } from './ModalContext';
import DeleteEventModal from './Modals/DeleteEventModal';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setEvents, deleteCurrentEvent } from '../Redux/features/eventsSlice';
import { fetchEvents, deleteEvent as deleteEventAPI } from '../utils/fetchAPI';
import { loadData } from '../utils/storage';
import { RootState } from '../Redux/store';
import { router } from 'expo-router';

export default function DeleteEventHeaderButton() {
  const { setModalVisible, setModalContent } = useModal();
  const [deleting, setDeleting] = useState(false);
  const dispatch = useDispatch();
  const currentEvent = useSelector((state: RootState) => state.events.currentEvent);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const token = await loadData('userToken') ?? '';
      if (!currentEvent?.id || !token) throw new Error('Missing event id or token');
      await deleteEventAPI(currentEvent.id, token);
      const events = await fetchEvents(token);
      dispatch(setEvents(events));
      dispatch(deleteCurrentEvent());
      setModalVisible(false);
      setModalContent(null);
      router.replace("/(tabs)/TimelineView");
    } catch (err) {
      console.log('Delete error:', err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <TouchableOpacity
      onPress={() => {
        setModalContent(
        <DeleteEventModal
            visible={true}
            deleting={deleting}
            onConfirm={handleDelete}
            onCancel={() => setModalVisible(false)}
        />
        );
        setModalVisible(true);
      }}
      style={{ marginRight: 16 }}
    >
      <Ionicons name="trash-outline" size={24} color="#0077CC" />
    </TouchableOpacity>
  );
}
