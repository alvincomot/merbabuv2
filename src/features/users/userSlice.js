// /src/features/users/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/api/axios";

const pickErr = (e) => e?.response?.data?.message || e?.message || "Error";

export const fetchUsers = createAsyncThunk(
  "users/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/users");
      return Array.isArray(data) ? data : [];
    } catch (e) {
      return rejectWithValue(pickErr(e));
    }
  }
);

export const fetchUserById = createAsyncThunk(
  "users/fetchById",
  async (uuid, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/users/${uuid}`);
      return data ?? null;
    } catch (e) {
      return rejectWithValue(pickErr(e));
    }
  }
);

export const createUser = createAsyncThunk(
  "users/create",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/users", payload);
      return data.user;
    } catch (e) {
      return rejectWithValue(pickErr(e));
    }
  }
);

export const updateUser = createAsyncThunk(
  "users/update",
  async ({ uuid, payload }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/users/${uuid}`, payload);
      return data.user;
    } catch (e) {
      return rejectWithValue(pickErr(e));
    }
  }
);

export const deleteUser = createAsyncThunk(
  "users/delete",
  async (uuid, { rejectWithValue }) => {
    try {
      await api.delete(`/users/${uuid}`);
      return uuid;
    } catch (e) {
      return rejectWithValue(pickErr(e));
    }
  }
);

const initialState = {
  items: [],
  current: null,
  status: "idle",
  formStatus: "idle",
  error: null,
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearUser: (s) => { s.current = null; },
    resetFormStatus: (s) => { s.formStatus = "idle"; s.error = null; },
  },
  extraReducers: (b) => {
    b
      .addCase(fetchUsers.pending, (s) => { s.status = "loading"; })
      .addCase(fetchUsers.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.items = Array.isArray(a.payload) ? a.payload : [];
        s.error = null;
      })
      .addCase(fetchUsers.rejected, (s, a) => {
        s.status = "failed"; s.error = a.payload;
      })

      .addCase(fetchUserById.pending, (s) => { s.status = "loading"; })
      .addCase(fetchUserById.fulfilled, (s, a) => {
        s.status = "succeeded"; s.current = a.payload ?? null; s.error = null;
      })
      .addCase(fetchUserById.rejected, (s, a) => {
        s.status = "failed"; s.error = a.payload;
      })

      .addCase(createUser.pending, (s) => { s.formStatus = "loading"; })
      .addCase(createUser.fulfilled, (s, a) => {
        s.formStatus = "succeeded";
        if (a.payload) s.items.unshift(a.payload);
        s.error = null;
      })
      .addCase(createUser.rejected, (s, a) => {
        s.formStatus = "failed"; s.error = a.payload;
      })

      .addCase(updateUser.pending, (s) => { s.formStatus = "loading"; })
      .addCase(updateUser.fulfilled, (s, a) => {
        s.formStatus = "succeeded";
        const updated = a.payload;
        if (updated?.uuid) {
          s.items = s.items.map((x) => (x.uuid === updated.uuid ? updated : x));
          if (s.current?.uuid === updated.uuid) s.current = updated;
        }
        s.error = null;
      })
      .addCase(updateUser.rejected, (s, a) => {
        s.formStatus = "failed"; s.error = a.payload;
      })

      .addCase(deleteUser.fulfilled, (s, a) => {
        s.items = s.items.filter((x) => x.uuid !== a.payload);
        if (s.current?.uuid === a.payload) s.current = null;
      });
  },
});

export const { clearUser, resetFormStatus } = userSlice.actions;
export default userSlice.reducer;
