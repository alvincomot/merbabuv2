import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../src/api/axios";

const pickErr = (e) => e?.response?.data?.message || e?.message || "Error";

// GET /reservasi
export const fetchReservasi = createAsyncThunk(
  "reservasi/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/reservasi");
      return data; // array
    } catch (e) {
      return rejectWithValue(pickErr(e));
    }
  }
);

// GET /reservasi/:id
export const fetchReservasiById = createAsyncThunk(
  "reservasi/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/reservasi/${id}`);
      return data; // object
    } catch (e) {
      return rejectWithValue(pickErr(e));
    }
  }
);

// POST /reservasi  (FormData atau JSON)
export const createReservasi = createAsyncThunk(
  "reservasi/create",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/reservasi", payload);
      // backend mengembalikan { reservasi: {...} }
      return data.reservasi;
    } catch (e) {
      return rejectWithValue(pickErr(e));
    }
  }
);

// PATCH /reservasi/:id  <-- NOTE: param diganti ke { id, formData } agar cocok dg Dashboard.jsx
export const updateReservasi = createAsyncThunk(
  "reservasi/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/reservasi/${id}`, formData);
      return data.reservasi;
    } catch (e) {
      return rejectWithValue(pickErr(e));
    }
  }
);

// DELETE /reservasi/:id
export const deleteReservasi = createAsyncThunk(
  "reservasi/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/reservasi/${id}`);
      return id;
    } catch (e) {
      return rejectWithValue(pickErr(e));
    }
  }
);

const initialState = {
  items: [],
  current: null,
  status: "idle",      // untuk fetch list/detail
  formStatus: "idle",  // untuk create/update
  error: null,
};

const reservasiSlice = createSlice({
  name: "reservasi",
  initialState,
  reducers: {
    clearReservasi: (s) => {
      s.current = null;
    },
    resetFormStatus: (s) => {
      s.formStatus = "idle";
      s.error = null;
    },
  },
  extraReducers: (b) => {
    b
      // list
      .addCase(fetchReservasi.pending, (s) => {
        s.status = "loading";
      })
      .addCase(fetchReservasi.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.items = a.payload;
        s.error = null;
      })
      .addCase(fetchReservasi.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload;
      })

      // detail
      .addCase(fetchReservasiById.pending, (s) => {
        s.status = "loading";
      })
      .addCase(fetchReservasiById.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.current = a.payload;
        s.error = null;
      })
      .addCase(fetchReservasiById.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload;
      })

      // create
      .addCase(createReservasi.pending, (s) => {
        s.formStatus = "loading";
      })
      .addCase(createReservasi.fulfilled, (s, a) => {
        s.formStatus = "succeeded";
        if (a.payload) s.items.unshift(a.payload);
        s.error = null;
      })
      .addCase(createReservasi.rejected, (s, a) => {
        s.formStatus = "failed";
        s.error = a.payload;
      })

      // update
      .addCase(updateReservasi.pending, (s) => {
        s.formStatus = "loading";
      })
      .addCase(updateReservasi.fulfilled, (s, a) => {
        s.formStatus = "succeeded";
        if (a.payload) {
          s.items = s.items.map((x) => (x.id === a.payload.id ? a.payload : x));
          if (s.current?.id === a.payload.id) s.current = a.payload;
        }
        s.error = null;
      })
      .addCase(updateReservasi.rejected, (s, a) => {
        s.formStatus = "failed";
        s.error = a.payload;
      })

      // delete
      .addCase(deleteReservasi.fulfilled, (s, a) => {
        s.items = s.items.filter((x) => x.id !== a.payload);
        if (s.current?.id === a.payload) s.current = null;
      });
  },
});

export const { clearReservasi, resetFormStatus } = reservasiSlice.actions;
export default reservasiSlice.reducer;
