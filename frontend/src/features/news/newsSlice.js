import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from '@/api/axios';

const API_URL = "http://localhost:3000/news"; // Kita bisa gunakan path relatif jika baseURL sudah diatur di api/axios.js

// Thunks untuk operasi CRUD User
export const fetchNews = createAsyncThunk(
  "news/fetchNews", 
  async () => {
    const response = await api.get(API_URL);
    return response.data;
});

export const fetchNewsById = createAsyncThunk("news/fetchNewsById", async (id) => {
    const response = await api.get(`http://localhost:3000/news/${id}`);
    return response.data;
});

export const createNews = createAsyncThunk("news/createNews", async (formData, { rejectWithValue }) => {
    try {
        const response = await api.post(API_URL, formData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const updateNews = createAsyncThunk("news/updateNews", async ({ id, formData }, { rejectWithValue }) => {
    try {
        const response = await api.patch(`${API_URL}/${id}`, formData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const deleteNews = createAsyncThunk("news/deleteNews", async (id, { rejectWithValue }) => {
    try {
        await api.delete(`${API_URL}/${id}`);
        return id;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

const newsSlice = createSlice({
    name: "news",
    initialState: {
        items: [],
        selectedItem: null,
        status: "idle",
        formStatus: "idle",
        error: null
    },
    reducers: {
        resetFormStatus: (state) => {
            state.formStatus = 'idle';
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Kasus untuk Fetch
            .addCase(fetchNews.pending, (state) => { state.status = "loading"; })
            .addCase(fetchNews.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.items = action.payload;
            })
            .addCase(fetchNews.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })
            // Kasus untuk Create
            .addCase(createNews.pending, (state) => { state.formStatus = "loading"; })
            .addCase(createNews.fulfilled, (state, action) => {
                state.formStatus = "succeeded";
                state.items.unshift(action.payload.news);
            })
            .addCase(createNews.rejected, (state, action) => {
                state.formStatus = "failed";
                state.error = action.payload?.message || "Gagal membuat berita.";
            })
            // Kasus untuk Update
            .addCase(updateNews.pending, (state) => { state.formStatus = "loading"; })
            .addCase(updateNews.fulfilled, (state, action) => {
                state.formStatus = "succeeded";
                const index = state.items.findIndex(item => item.id === action.payload.news.id);
                if (index !== -1) {
                    state.items[index] = action.payload.news;
                }
            })
            .addCase(updateNews.rejected, (state, action) => {
                state.formStatus = "failed";
                state.error = action.payload?.message || "Gagal mengupdate berita.";
            })
            .addCase(deleteNews.fulfilled, (state, action) => {
                state.items = state.items.filter(item => item.id !== action.payload);
            })
            
            .addCase(fetchNewsById.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchNewsById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.selectedItem = action.payload;
            })
            .addCase(fetchNewsById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
    }
}
);

export const { resetFormStatus } = newsSlice.actions;
export default newsSlice.reducer;