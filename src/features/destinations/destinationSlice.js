import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from '@/api/axios.js';

export const fetchDestinations = createAsyncThunk(
  "destinations/fetchDestinations",
  async () => {
    const response = await api.get("/destinations");
    return response.data;
  }
);

// 2. Membuat destinasi baru (dengan FormData untuk gambar)
export const createDestination = createAsyncThunk(
  "destinations/createDestinations",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/destinations", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// 3. Mengupdate destinasi yang ada
export const updateDestination = createAsyncThunk(
  "destinations/updateDestination",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`${"/destinations"}/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// 4. Menghapus destinasi
export const deleteDestination = createAsyncThunk(
  "destinations/deleteDestination",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`${"/destinations"}/${id}`);
      // Kembalikan ID agar kita tahu item mana yang harus dihapus dari state
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


// --- SLICE UTAMA ---

const destinationSlice = createSlice({
  name: "destinations",
  initialState: {
    items: [],
    // Ini untuk status fetch data utama
    status: "idle", 
    // ✅ TAMBAHKAN STATE BARU INI untuk status form submit
    addEditStatus: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    // Tambahkan reducer untuk mereset status form
    resetAddEditStatus: (state) => {
        state.addEditStatus = 'idle';
    }
  },
  extraReducers: (builder) => {
    builder
      // Kasus untuk Fetch (hanya mengubah 'status' utama)
      .addCase(fetchDestinations.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDestinations.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchDestinations.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // Kasus untuk Create (hanya mengubah 'addEditStatus')
      .addCase(createDestination.pending, (state) => {
        state.addEditStatus = "loading"; // Gunakan state baru
      })
      .addCase(createDestination.fulfilled, (state, action) => {
        state.addEditStatus = "succeeded";
        state.items.push(action.payload.destination);
      })
      .addCase(createDestination.rejected, (state, action) => {
        state.addEditStatus = "failed";
        state.error = action.payload?.message || action.error.message;
      })

      // Kasus untuk Update (juga hanya mengubah 'addEditStatus')
      .addCase(updateDestination.pending, (state) => {
        state.addEditStatus = "loading"; // Gunakan state baru
      })
      .addCase(updateDestination.fulfilled, (state, action) => {
        state.addEditStatus = "succeeded";
        const index = state.items.findIndex((item) => item.uuid === action.payload.uuid);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateDestination.rejected, (state, action) => {
        state.addEditStatus = "failed";
        state.error = action.payload?.message || action.error.message;
      })
      
      // Kasus untuk delete bisa dibiarkan atau dibuatkan status sendiri jika perlu
      .addCase(deleteDestination.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.uuid !== action.payload);
      });
  },
});

// Ekspor reducer baru
export const { resetAddEditStatus } = destinationSlice.actions;
export default destinationSlice.reducer;