// import { configureStore } from "@reduxjs/toolkit";
// import authReducer from "./slices/authSlice";
// import userReducer from "./userStore";
// import productReducer from "./productStore";
// import {
//   persistStore,
//   persistReducer,
//   FLUSH,
//   REHYDRATE,
//   PAUSE,
//   PERSIST,
//   PURGE,
//   REGISTER,
// } from "redux-persist";
// import storage from "redux-persist/lib/storage";

// // تكوين التخزين المؤقت للمصادقة فقط
// const persistConfig = {
//   key: "auth",
//   storage,
//   whitelist: ["user", "accessToken", "refreshToken"],
// };

// const persistedAuthReducer = persistReducer(persistConfig, authReducer);

// export const store = configureStore({
//   reducer: {
//     auth: persistedAuthReducer, // تخزين مؤقت
//     user: userReducer, // بدون تخزين مؤقت
//     products: productReducer,
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: {
//         ignoredActions: [
//           FLUSH,
//           REHYDRATE,
//           PAUSE,
//           PERSIST,
//           PURGE,
//           REGISTER,
//           "user/uploadProfileImage/pending",
//           "products/createProduct/pending", // ← إضافة
//           "products/updateProduct/pending", // ← إضافة
//         ],
//       },
//     }),
// });

// export const persistor = persistStore(store);

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import userReducer from "./userStore";
import productReducer from "./productStore";
import blogReducer from "./blogStore"; // Add this
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

// تكوين التخزين المؤقت للمصادقة فقط
const persistConfig = {
  key: "auth",
  storage,
  whitelist: ["user", "accessToken", "refreshToken"],
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

// تكوين التخزين المؤقت للمقالات (اختياري)
const blogPersistConfig = {
  key: "blog",
  storage,
  whitelist: ["posts", "lastFetched"], // خزن المقالات ووقت آخر جلب
  // يمكنك إزالة lastFetched من whitelist إذا أردت إعادة جلب البيانات دائماً
};

const persistedBlogReducer = persistReducer(blogPersistConfig, blogReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    user: userReducer,
    products: productReducer,
    blog: persistedBlogReducer, // Add this
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
          "user/uploadProfileImage/pending",
          "products/createProduct/pending",
          "products/updateProduct/pending",
          "blog/createBlogPost/pending", // Add blog actions
          "blog/updateBlogPost/pending",
        ],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;