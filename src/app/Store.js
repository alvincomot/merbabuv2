import { configureStore } from "@reduxjs/toolkit";
import destinationReducer from "@/features/destinations/destinationSlice";
import authReducer from "@/features/auth/authSlice";
import newsReducer from "@/features/news/newsSlice";
import userReducer from "@/features/users/userSlice";
import reservasiReducer from "@/features/reservasi/reservasiSlice";

export const Store = configureStore({
  reducer: {
    destinations: destinationReducer,
    auth: authReducer,
    news: newsReducer,
    users: userReducer,
    reservasi: reservasiReducer
  },
});