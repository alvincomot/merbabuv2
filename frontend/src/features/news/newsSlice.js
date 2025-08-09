import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from '@/api/axios';

export const fetchNews = createAsyncThunk(
  "news/fetchNews", 
  async () => {
    // Perbaikan: Gunakan path relatif
    const response = await api.get("/news");
    return response.data;
});

export const fetchNewsById = createAsyncThunk("news/fetchNewsById", async (id) => {
    // Perbaikan: Gunakan path relatif
    const response = await api.get(`/news/${id}`);
    return response.data;
});

export const createNews = createAsyncThunk("news/createNews", async (formData, { rejectWithValue }) => {
    try {
        // Perbaikan: Gunakan path relatif
        const response = await api.post("/news", formData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const updateNews = createAsyncThunk("news/updateNews", async ({ id, formData }, { rejectWithValue }) => {
    try {
        // Perbaikan: Gunakan path relatif
        const response = await api.patch(`/news/${id}`, formData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const deleteNews = createAsyncThunk("news/deleteNews", async (id, { rejectWithValue }) => {
    try {
        // Perbaikan: Gunakan path relatif
        await api.delete(`/news/${id}`);
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