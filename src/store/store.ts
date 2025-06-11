

import { combineReducers, configureStore } from '@reduxjs/toolkit';
 // Thunk không cần destructure
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux'; 
import authSlide from './authSlice';
import userProfile from './userProfile';
import networkingSlide from './networkingSlide';
import messagingSlide from  './messagingSlide';

const rootReducer = combineReducers({
  auth: authSlide,
  userProfile: userProfile,
  networking: networkingSlide,
  messaging: messagingSlide,
});


const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof rootReducer>;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
