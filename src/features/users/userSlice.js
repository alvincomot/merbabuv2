import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/api/axios";

const pickErr = (e) => e?.response?.data?.message || e?.message || "Error";

export const fetchUsers = createAsyncThunk("users/fetchAll", async (_, { rejectWithValue }) => {
  try { const { data } = await api.get("/users"); return data; }
  catch (e) { return rejectWithValue(pickErr(e)); }
});

export const fetchUserById = createAsyncThunk("users/fetchById", async (uuid, { rejectWithValue }) => {
  try { const { data } = await api.get(`/users/${uuid}`); return data; }
  catch (e) { return rejectWithValue(pickErr(e)); }
});

export const createUser = createAsyncThunk("users/create", async (payload, { rejectWithValue }) => {
  try { const { data } = await api.post("/users", payload); return data.user; }
  catch (e) { return rejectWithValue(pickErr(e)); }
});

export const updateUser = createAsyncThunk("users/update", async ({ uuid, payload }, { rejectWithValue }) => {
  try { const { data } = await api.patch(`/users/${uuid}`, payload); return data.user; }
  catch (e) { return rejectWithValue(pickErr(e)); }
});

export const deleteUser = createAsyncThunk("users/delete", async (uuid, { rejectWithValue }) => {
  try { await api.delete(`/users/${uuid}`); return uuid; }
  catch (e) { return rejectWithValue(pickErr(e)); }
});

const userSlice = createSlice({
  name: "users",
  initialState: { items: [], current: null, status: "idle", error: null },
  reducers: { clearUser: (s) => { s.current = null; } },
  extraReducers: (b) => {
    b
      .addCase(fetchUsers.pending, (s) => { s.status = "loading"; })
      .addCase(fetchUsers.fulfilled, (s, a) => { s.status = "succeeded"; s.items = a.payload; s.error = null; })
      .addCase(fetchUsers.rejected, (s, a) => { s.status = "failed"; s.error = a.payload; })

      .addCase(fetchUserById.fulfilled, (s, a) => { s.current = a.payload; })
      .addCase(createUser.fulfilled, (s, a) => { s.items.unshift(a.payload); })
      .addCase(updateUser.fulfilled, (s, a) => {
        s.items = s.items.map((x) => (x.uuid === a.payload.uuid ? a.payload : x));
        if (s.current?.uuid === a.payload.uuid) s.current = a.payload;
      })
      .addCase(deleteUser.fulfilled, (s, a) => {
        s.items = s.items.filter((x) => x.uuid !== a.payload);
        if (s.current?.uuid === a.payload) s.current = null;
      });
  },
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer;
