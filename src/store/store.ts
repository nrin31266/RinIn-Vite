

import { combineReducers, configureStore } from '@reduxjs/toolkit';
 // Thunk không cần destructure
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux'; 
import authSlide from './authSlice';
import userProfile from './userProfile';
import networkingSlide from './networkingSlide';
import messagingSlide from  './messagingSlide';
import onlineStatusSlice from './onlineUserStatusSlide'; // Uncomment if you need online status management
import postCreatorSlide from './postCreatorSlide'; // Uncomment if you need post creation functionality
import postsSlice from './postsSlice'; // Renamed from feedSlide - manages all posts (feed + user posts)
import profileSlide from './profileSlide';

const rootReducer = combineReducers({
  auth: authSlide,
  userProfile: userProfile,
  networking: networkingSlide,
  messaging: messagingSlide,
  onlineStatus: onlineStatusSlice,
  postCreator: postCreatorSlide,
  posts: postsSlice, // Renamed from feed
  profile: profileSlide
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
