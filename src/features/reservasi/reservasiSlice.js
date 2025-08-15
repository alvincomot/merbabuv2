import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/api/axios";

const pickErr = (e) => e?.response?.data?.message || e?.message || "Error";

export const fetchReservasi = createAsyncThunk("reservasi/fetchAll", async (_, { rejectWithValue }) => {
  try { const { data } = await api.get("/reservasi"); return data; }
  catch (e) { return rejectWithValue(pickErr(e)); }
});

export const fetchReservasiById = createAsyncThunk("reservasi/fetchById", async (id, { rejectWithValue }) => {
  try { const { data } = await api.get(`/reservasi/${id}`); return data; }
  catch (e) { return rejectWithValue(pickErr(e)); }
});

export const createReservasi = createAsyncThunk("reservasi/create", async (payload, { rejectWithValue }) => {
  try { const { data } = await api.post("/reservasi", payload); return data.reservasi; }
  catch (e) { return rejectWithValue(pickErr(e)); }
});

export const updateReservasi = createAsyncThunk("reservasi/update", async ({ id, payload }, { rejectWithValue }) => {
  try { const { data } = await api.patch(`/reservasi/${id}`, payload); return data.reservasi; }
  catch (e) { return rejectWithValue(pickErr(e)); }
});

export const deleteReservasi = createAsyncThunk("reservasi/delete", async (id, { rejectWithValue }) => {
  try { await api.delete(`/reservasi/${id}`); return id; }
  catch (e) { return rejectWithValue(pickErr(e)); }
});

const reservasiSlice = createSlice({
  name: "reservasi",
  initialState: { items: [], current: null, status: "idle", error: null },
  reducers: { clearReservasi: (s) => { s.current = null; } },
  extraReducers: (b) => {
    b
      .addCase(fetchReservasi.pending, (s) => { s.status = "loading"; })
      .addCase(fetchReservasi.fulfilled, (s, a) => { s.status = "succeeded"; s.items = a.payload; s.error = null; })
      .addCase(fetchReservasi.rejected, (s, a) => { s.status = "failed"; s.error = a.payload; })

      .addCase(fetchReservasiById.fulfilled, (s, a) => { s.current = a.payload; })
      .addCase(createReservasi.fulfilled, (s, a) => { s.items.unshift(a.payload); })
      .addCase(updateReservasi.fulfilled, (s, a) => {
        s.items = s.items.map((x) => (x.id === a.payload.id ? a.payload : x));
        if (s.current?.id === a.payload.id) s.current = a.payload;
      })
      .addCase(deleteReservasi.fulfilled, (s, a) => {
        s.items = s.items.filter((x) => x.id !== a.payload);
        if (s.current?.id === a.payload) s.current = null;
      });
  },
});

export const { clearReservasi } = reservasiSlice.actions;
export default reservasiSlice.reducer;
