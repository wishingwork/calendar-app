import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  events: [],
  currentEvent: null, // <-- add currentEvent
};

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setEvents: (state, action) => {
      state.events = action.payload.data;
    },
    clearEvents: (state) => {
      state.events = [];
    },
    setCurrentEvent: (state, action) => {
      state.currentEvent = action.payload;
    },
    deleteCurrentEvent: (state) => {
      state.currentEvent = null;
    },
  },
});

export const { setEvents, clearEvents, setCurrentEvent, deleteCurrentEvent } = eventsSlice.actions;
export default eventsSlice.reducer;
