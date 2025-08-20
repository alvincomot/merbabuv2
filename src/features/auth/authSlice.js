import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/api/axios"; // pastikan api set { baseURL: import.meta.env.VITE_API_URL || "/api", withCredentials: true }

const initialState = {
  user: null,
  isAuthenticated: false,
  status: "idle",
  error: null,
};

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/register", userData);
      return data;
    } catch (err) {
      return rejectWithValue(err?.response?.data || { message: err.message });
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/login", credentials);
      return data;
    } catch (err) {
      return rejectWithValue(err?.response?.data || { message: err.message });
    }
  }
);

export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  await api.delete("/auth/logout");
});

export const getMe = createAsyncThunk(
  "auth/getMe",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/auth/me");
      return data;
    } catch (err) {
      return rejectWithValue(err?.response?.data || { message: err.message });
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (s) => { s.status = "loading"; })
      .addCase(registerUser.fulfilled, (s) => { s.status = "succeeded"; s.error = null; })
      .addCase(registerUser.rejected, (s, a) => { s.status = "failed"; s.error = a.payload?.message || "Registrasi gagal."; })

      .addCase(loginUser.pending, (s) => { s.status = "loading"; })
      .addCase(loginUser.fulfilled, (s, a) => { s.status = "succeeded"; s.isAuthenticated = true; s.user = a.payload; s.error = null; })
      .addCase(loginUser.rejected, (s, a) => { s.status = "failed"; s.isAuthenticated = false; s.user = null; s.error = a.payload?.message || "Login gagal."; })

      .addCase(logoutUser.fulfilled, (s) => { s.isAuthenticated = false; s.user = null; })

      .addCase(getMe.fulfilled, (s, a) => { s.isAuthenticated = true; s.user = a.payload; })
      .addCase(getMe.rejected, (s) => { s.isAuthenticated = false; s.user = null; });
  },
});

export const { resetAuth } = authSlice.actions;
export default authSlice.reducer;
