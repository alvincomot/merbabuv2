import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/api/axios";

const initialState = {
  user: null,
  isAuthenticated: false,
  status: "idle", // "idle" | "loading" | "succeeded" | "failed"
  error: null,
};

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      // backend: { message: "...", user?: {...} } (kita tidak auto-login)
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
      // backend: { message: "Login sukses", user: {...} }
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
      // backend: langsung user object { uuid, name, email, role }
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
      // REGISTER
      .addCase(registerUser.pending, (s) => {
        s.status = "loading";
        s.error = null;
      })
      .addCase(registerUser.fulfilled, (s) => {
        s.status = "succeeded";
        s.error = null;
      })
      .addCase(registerUser.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload?.message || "Registrasi gagal.";
      })

      // LOGIN
      .addCase(loginUser.pending, (s) => {
        s.status = "loading";
        s.error = null;
      })
      .addCase(loginUser.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.isAuthenticated = true;
        s.user = a.payload?.user || null; // << penting: backend bungkus di { user }
        s.error = null;
      })
      .addCase(loginUser.rejected, (s, a) => {
        s.status = "failed";
        s.isAuthenticated = false;
        s.user = null;
        s.error = a.payload?.message || "Login gagal.";
      })

      // LOGOUT
      .addCase(logoutUser.fulfilled, (s) => {
        s.isAuthenticated = false;
        s.user = null;
        s.status = "idle";
        s.error = null;
      })

      // GET ME
      .addCase(getMe.pending, (s) => {
        s.status = "loading";
      })
      .addCase(getMe.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.isAuthenticated = true;
        s.user = a.payload || null; // /auth/me mengembalikan user langsung
        s.error = null;
      })
      .addCase(getMe.rejected, (s, a) => {
        s.status = "failed";
        s.isAuthenticated = false;
        s.user = null;
        s.error = a.payload?.message || "Gagal mengambil data user.";
      });
  },
});

export const { resetAuth } = authSlice.actions;
export default authSlice.reducer;
