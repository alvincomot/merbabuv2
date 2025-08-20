import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../src/api/axios";

const pickErr = (e) => e?.response?.data?.message || e?.message || "Error";

export const fetchNews = createAsyncThunk(
  "news/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/news");
      return data;
    } catch (e) {
      return rejectWithValue(pickErr(e));
    }
  }
);

export const fetchNewsById = createAsyncThunk(
  "news/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/news/${id}`);
      return data;
    } catch (e) {
      return rejectWithValue(pickErr(e));
    }
  }
);

export const createNews = createAsyncThunk(
  "news/create",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/news", payload);
      return data.news;
    } catch (e) {
      return rejectWithValue(pickErr(e));
    }
  }
);

export const updateNews = createAsyncThunk(
  "news/update",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/news/${id}`, payload);
      return data.news;
    } catch (e) {
      return rejectWithValue(pickErr(e));
    }
  }
);

export const deleteNews = createAsyncThunk(
  "news/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/news/${id}`);
      return id;
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

const newsSlice = createSlice({
  name: "news",
  initialState,
  reducers: {
    clearNews: (s) => { s.current = null; },
    resetFormStatus: (s) => { s.formStatus = "idle"; s.error = null; },
  },
  extraReducers: (b) => {
    b
      .addCase(fetchNews.pending, (s) => { s.status = "loading"; })
      .addCase(fetchNews.fulfilled, (s, a) => {
        s.status = "succeeded"; s.items = a.payload; s.error = null;
      })
      .addCase(fetchNews.rejected, (s, a) => {
        s.status = "failed"; s.error = a.payload;
      })
      .addCase(fetchNewsById.pending, (s) => { s.status = "loading"; })
      .addCase(fetchNewsById.fulfilled, (s, a) => {
        s.status = "succeeded"; s.current = a.payload; s.error = null;
      })
      .addCase(fetchNewsById.rejected, (s, a) => {
        s.status = "failed"; s.error = a.payload;
      })
      .addCase(createNews.pending, (s) => { s.formStatus = "loading"; })
      .addCase(createNews.fulfilled, (s, a) => {
        s.formStatus = "succeeded"; s.items.unshift(a.payload); s.error = null;
      })
      .addCase(createNews.rejected, (s, a) => {
        s.formStatus = "failed"; s.error = a.payload;
      })
      .addCase(updateNews.pending, (s) => { s.formStatus = "loading"; })
      .addCase(updateNews.fulfilled, (s, a) => {
        s.formStatus = "succeeded";
        s.items = s.items.map((x) => (x.id === a.payload.id ? a.payload : x));
        if (s.current?.id === a.payload.id) s.current = a.payload;
        s.error = null;
      })
      .addCase(updateNews.rejected, (s, a) => {
        s.formStatus = "failed"; s.error = a.payload;
      })
      .addCase(deleteNews.fulfilled, (s, a) => {
        s.items = s.items.filter((x) => x.id !== a.payload);
        if (s.current?.id === a.payload) s.current = null;
      });
  },
});

export const { clearNews, resetFormStatus } = newsSlice.actions;
export default newsSlice.reducer;
