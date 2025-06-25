import { configureStore } from '@reduxjs/toolkit';
import profileReducer from './profileSlice';
import eventsReducer from './eventsSlice';

const store = configureStore({
  reducer: {
    profile: profileReducer,
    events: eventsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
