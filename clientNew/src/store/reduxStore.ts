// // src/redux/reduxStore.ts
// import { configureStore } from '@reduxjs/toolkit';
// import reduxSlice from './reduxSlice';

// export const store = configureStore({
//   reducer: {
//     user: reduxSlice,
//   },
// });

// // Types for dispatch and state
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
// src/store/reduxStore.ts
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage
import { combineReducers } from "redux";
import reduxReducer from "./reduxSlice"; // your reducer

const rootReducer = combineReducers({
  user: reduxReducer,
});

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // for redux-persist
    }),
});

export const persistor = persistStore(store);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
