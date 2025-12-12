// import { configureStore } from "@reduxjs/toolkit";
// import profileReducer from "./profileSlice";
// import storage from "redux-persist/lib/storage";
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

// const persistConfig = { key: "root", storage };
// const persistedReducer = persistReducer(persistConfig, profileReducer);

// const store = configureStore({
//   reducer: { profile: persistedReducer },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: {
//         ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
//       },
//     }),
// });

// export const persistor = persistStore(store);
// export default store;
import { configureStore } from "@reduxjs/toolkit";
import profileReducer from "../redux/profileSlice.js";

const store = configureStore({
  reducer: { profile: profileReducer },
});

export default store;
