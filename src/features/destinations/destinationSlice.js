// src/features/destinations/destinationSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../src/api/axios";

const pickErr = (e) => e?.response?.data?.message || e?.message || "Error";

// ==== THUNKS ====
export const fetchDestinations = createAsyncThunk(
  "destinations/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/destinations");
      return data; // array of { uuid, name, description, location, image }
    } catch (e) {
      return rejectWithValue(pickErr(e));
    }
  }
);

export const fetchDestinationById = createAsyncThunk(
  "destinations/fetchById",
  async (uuid, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/destinations/${uuid}`);
      return data; // single destination
    } catch (e) {
      return rejectWithValue(pickErr(e));
    }
  }
);

export const createDestination = createAsyncThunk(
  "destinations/create",
  async (formDataOrObj, { rejectWithValue }) => {
    try {
      // NOTE: create di backend membalas { message, destination }
      const { data } = await api.post("/destinations", formDataOrObj);
      return data.destination;
    } catch (e) {
      return rejectWithValue(pickErr(e));
    }
  }
);

export const updateDestination = createAsyncThunk(
  "destinations/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      // kompatibel dengan Dashboard.jsx kamu: id = uuid
      const { data } = await api.patch(`/destinations/${id}`, formData);
      return data.destination;
    } catch (e) {
      return rejectWithValue(pickErr(e));
    }
  }
);

export const deleteDestination = createAsyncThunk(
  "destinations/delete",
  async (uuid, { rejectWithValue }) => {
    try {
      await api.delete(`/destinations/${uuid}`);
      return uuid;
    } catch (e) {
      return rejectWithValue(pickErr(e));
    }
  }
);

// ==== SLICE ====
const initialState = {
  items: [],
  current: null,
  status: "idle",
  error: null,
  addEditStatus: "idle", // untuk form create/edit (Dashboard.jsx pakai ini)
};

const destinationSlice = createSlice({
  name: "destinations",
  initialState,
  reducers: {
    clearCurrent: (s) => { s.current = null; },
    resetAddEditStatus: (s) => { s.addEditStatus = "idle"; s.error = null; },
  },
  extraReducers: (b) => {
    b
      // list
      .addCase(fetchDestinations.pending, (s) => { s.status = "loading"; })
      .addCase(fetchDestinations.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.items = Array.isArray(a.payload) ? a.payload : [];
        s.error = null;
      })
      .addCase(fetchDestinations.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload;
      })

      // detail
      .addCase(fetchDestinationById.pending, (s) => { s.status = "loading"; })
      .addCase(fetchDestinationById.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.current = a.payload;
        s.error = null;
      })
      .addCase(fetchDestinationById.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload;
      })

      // create
      .addCase(createDestination.pending, (s) => { s.addEditStatus = "loading"; })
      .addCase(createDestination.fulfilled, (s, a) => {
        s.addEditStatus = "succeeded";
        if (a.payload) s.items.unshift(a.payload);
        s.error = null;
      })
      .addCase(createDestination.rejected, (s, a) => {
        s.addEditStatus = "failed";
        s.error = a.payload;
      })

      // update
      .addCase(updateDestination.pending, (s) => { s.addEditStatus = "loading"; })
      .addCase(updateDestination.fulfilled, (s, a) => {
        s.addEditStatus = "succeeded";
        const updated = a.payload;
        s.items = s.items.map((x) => (x.uuid === updated.uuid ? updated : x));
        if (s.current?.uuid === updated.uuid) s.current = updated;
        s.error = null;
      })
      .addCase(updateDestination.rejected, (s, a) => {
        s.addEditStatus = "failed";
        s.error = a.payload;
      })

      // delete
      .addCase(deleteDestination.fulfilled, (s, a) => {
        s.items = s.items.filter((x) => x.uuid !== a.payload);
        if (s.current?.uuid === a.payload) s.current = null;
      });
  },
});

export const { clearCurrent, resetAddEditStatus } = destinationSlice.actions;
export default destinationSlice.reducer;
