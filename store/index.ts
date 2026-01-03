// import { configureStore } from "@reduxjs/toolkit";
// import authReducer from "./slices/authSlice";

// import {
//   persistStore,
//   persistReducer,
// } from "redux-persist";
// import storage from "redux-persist/lib/storage"; // localStorage

// const persistConfig = {
//   key: "auth",
//   storage,
//   whitelist: ["user", "accessToken", "refreshToken"],
// };

// const persistedAuthReducer = persistReducer(
//   persistConfig,
//   authReducer
// );

// export const store = configureStore({
//   reducer: {
//     auth: persistedAuthReducer,
//   },
// });

// export const persistor = persistStore(store);

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "auth",
  storage,
  whitelist: ["user", "accessToken", "refreshToken"],
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;