import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/api/axios";

const pickErr = (e) => e?.response?.data?.message || e?.message || "Error";

/** ===== Thunks ===== */
export const fetchDestinations = createAsyncThunk(
  "destinations/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/destinations");
      return data;
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
      return data;
    } catch (e) {
      return rejectWithValue(pickErr(e));
    }
  }
);

export const createDestination = createAsyncThunk(
  "destinations/create",
  async (payload, { rejectWithValue }) => {
    try {
      // payload boleh FormData (image)
      const { data } = await api.post("/destinations", payload);
      return data.destination; // sesuai controller
    } catch (e) {
      return rejectWithValue(pickErr(e));
    }
  }
);

export const updateDestination = createAsyncThunk(
  "destinations/update",
  async ({ uuid, payload }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/destinations/${uuid}`, payload);
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

/** ===== Slice ===== */
const initialState = {
  items: [],
  current: null,
  status: "idle",      // untuk fetch list/detail
  formStatus: "idle",  // untuk create/update form
  error: null,
};

const destinationSlice = createSlice({
  name: "destinations",
  initialState,
  reducers: {
    clearCurrent: (s) => {
      s.current = null;
    },
    resetAddEditStatus: (s) => {
      s.formStatus = "idle";
      s.error = null;
    },
  },
  extraReducers: (b) => {
    b
      // ===== fetch list
      .addCase(fetchDestinations.pending, (s) => {
        s.status = "loading";
      })
      .addCase(fetchDestinations.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.items = a.payload;
        s.error = null;
      })
      .addCase(fetchDestinations.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload;
      })

      // ===== fetch by id
      .addCase(fetchDestinationById.pending, (s) => {
        // boleh pakai status umum juga, tapi tidak wajib
        s.status = "loading";
      })
      .addCase(fetchDestinationById.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.current = a.payload;
        s.error = null;
      })
      .addCase(fetchDestinationById.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload;
      })

      // ===== create
      .addCase(createDestination.pending, (s) => {
        s.formStatus = "loading";
      })
      .addCase(createDestination.fulfilled, (s, a) => {
        s.formStatus = "succeeded";
        s.items.unshift(a.payload);
        s.error = null;
      })
      .addCase(createDestination.rejected, (s, a) => {
        s.formStatus = "failed";
        s.error = a.payload;
      })

      // ===== update
      .addCase(updateDestination.pending, (s) => {
        s.formStatus = "loading";
      })
      .addCase(updateDestination.fulfilled, (s, a) => {
        s.formStatus = "succeeded";
        s.items = s.items.map((x) => (x.uuid === a.payload.uuid ? a.payload : x));
        if (s.current?.uuid === a.payload.uuid) s.current = a.payload;
        s.error = null;
      })
      .addCase(updateDestination.rejected, (s, a) => {
        s.formStatus = "failed";
        s.error = a.payload;
      })

      // ===== delete
      .addCase(deleteDestination.fulfilled, (s, a) => {
        s.items = s.items.filter((x) => x.uuid !== a.payload);
        if (s.current?.uuid === a.payload) s.current = null;
      });
  },
});

export const { clearCurrent, resetAddEditStatus } = destinationSlice.actions;
export default destinationSlice.reducer;
