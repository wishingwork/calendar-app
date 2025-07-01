import { configureStore } from '@reduxjs/toolkit';
import profileReducer from './features/profileSlice';
import eventsReducer from './features/eventsSlice';

const store = configureStore({
  reducer: {
    profile: profileReducer,
    events: eventsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
