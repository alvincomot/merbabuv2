import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/api/axios";

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
      const response = await api.post(
        "http://localhost:3000/register",
        userData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post(
        "http://localhost:3000/login",
        credentials
      );
      return response.data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue({ message: error.message });
      }
    }
  }
);

export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  await api.delete("http://localhost:3000/logout");
});

export const getMe = createAsyncThunk(
  "auth/getMe",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/me");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
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
      state.formStatus = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.formStatus = "loading";
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.formStatus = "succeeded";
        state.error = null; // Bersihkan error jika sukses
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.formStatus = "failed";
        state.error = action.payload?.message || "Registrasi gagal.";
      })
      // Kasus untuk Login
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload.message;
      })
      // Kasus untuk Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
      })
      // Kasus untuk GetMe (memeriksa sesi)
      .addCase(getMe.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(getMe.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export const { resetAuth } = authSlice.actions;
export default authSlice.reducer;
