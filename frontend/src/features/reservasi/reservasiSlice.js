import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from '@/api/axios'; // Menggunakan instance axios terpusat Anda

const API_URL = "http://localhost:3000/reservasi"; 

// === ASYNC THUNKS UNTUK SEMUA OPERASI CRUD ===

// 1. Mengambil semua data layanan reservasi
export const fetchReservasi = createAsyncThunk(
    "reservasi/fetchReservasi", 
    async () => {
        const response = await api.get(API_URL);
        return response.data;
    }
);

// 2. Membuat layanan reservasi baru
export const createReservasi = createAsyncThunk(
    "reservasi/createReservasi", 
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post(API_URL, formData);
            return response.data; // Harapannya backend mengembalikan { message: "...", layanan: {...} }
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// 3. Mengupdate layanan reservasi
export const updateReservasi = createAsyncThunk(
    "reservasi/updateReservasi", 
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`${API_URL}/${id}`, formData);
            return response.data; // Harapannya backend mengembalikan data yang diupdate
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// 4. Menghapus layanan reservasi
export const deleteReservasi = createAsyncThunk(
    "reservasi/deleteReservasi", 
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`${API_URL}/${id}`);
            return id; // Kembalikan ID agar reducer tahu item mana yang harus dihapus
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);


// === SLICE UTAMA ===

const reservasiSlice = createSlice({
    name: "reservasi",
    initialState: {
        items: [],
        status: "idle",       // Untuk status fetch data utama (GET)
        formStatus: "idle",   // Status khusus untuk form (POST, PATCH)
        error: null
    },
    reducers: {
        // Reducer untuk mereset status form agar tidak terjebak di 'loading' atau 'failed'
        resetFormStatus: (state) => {
            state.formStatus = 'idle';
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Kasus untuk Fetch Layanan
            .addCase(fetchReservasi.pending, (state) => { state.status = "loading"; })
            .addCase(fetchReservasi.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.items = action.payload;
            })
            .addCase(fetchReservasi.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })

            // Kasus untuk Create Layanan
            .addCase(createReservasi.pending, (state) => { state.formStatus = "loading"; })
            .addCase(createReservasi.fulfilled, (state, action) => {
                state.formStatus = "succeeded";
                state.items.push(action.payload.layanan); // Langsung tambahkan ke state
            })
            .addCase(createReservasi.rejected, (state, action) => {
                state.formStatus = "failed";
                state.error = action.payload?.message || "Gagal membuat layanan.";
            })

            // Kasus untuk Update Layanan
            .addCase(updateReservasi.pending, (state) => { state.formStatus = "loading"; })
            .addCase(updateReservasi.fulfilled, (state, action) => {
                state.formStatus = "succeeded";
                const index = state.items.findIndex(item => item.id === action.payload.layanan.id);
                if (index !== -1) {
                    state.items[index] = action.payload.layanan; // Ganti data lama dengan data baru
                }
            })
            .addCase(updateReservasi.rejected, (state, action) => {
                state.formStatus = "failed";
                state.error = action.payload?.message || "Gagal mengupdate layanan.";
            })

            // Kasus untuk Delete Layanan
            .addCase(deleteReservasi.fulfilled, (state, action) => {
                // action.payload adalah 'id' yang kita kembalikan dari thunk
                state.items = state.items.filter(item => item.id !== action.payload);
            });
    }
});

export const { resetFormStatus } = reservasiSlice.actions;
export default reservasiSlice.reducer;