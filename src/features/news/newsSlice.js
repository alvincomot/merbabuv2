// /src/features/news/newsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/api/axios";

const pickErr = (e) => e?.response?.data?.message || e?.message || "Error";

// GET /api/news
export const fetchNews = createAsyncThunk(
  "news/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/news");
      return Array.isArray(data) ? data : [];
    } catch (e) {
      return rejectWithValue(pickErr(e));
    }
  }
);

// GET /api/news/:id
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

// POST /api/news  (admin; payload bisa FormData atau object)
export const createNews = createAsyncThunk(
  "news/create",
  async (payload, { rejectWithValue }) => {
    try {
      const isForm = typeof FormData !== "undefined" && payload instanceof FormData;
      const { data } = await api.post("/news", payload, {
        headers: isForm ? undefined : { "Content-Type": "application/json" },
      });
      return data?.news;
    } catch (e) {
      return rejectWithValue(pickErr(e));
    }
  }
);

// PATCH /api/news/:id  (admin; payload bisa FormData atau object)
export const updateNews = createAsyncThunk(
  "news/update",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const isForm = typeof FormData !== "undefined" && payload instanceof FormData;
      const { data } = await api.patch(`/news/${id}`, payload, {
        headers: isForm ? undefined : { "Content-Type": "application/json" },
      });
      return data?.news;
    } catch (e) {
      return rejectWithValue(pickErr(e));
    }
  }
);

// DELETE /api/news/:id  (admin)
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
    clearNews: (s) => {
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
      .addCase(fetchNews.pending, (s) => {
        s.status = "loading";
      })
      .addCase(fetchNews.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.items = Array.isArray(a.payload) ? a.payload : [];
        s.error = null;
      })
      .addCase(fetchNews.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload;
      })

      // detail
      .addCase(fetchNewsById.pending, (s) => {
        s.status = "loading";
      })
      .addCase(fetchNewsById.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.current = a.payload ?? null;
        s.error = null;
      })
      .addCase(fetchNewsById.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload;
      })

      // create
      .addCase(createNews.pending, (s) => {
        s.formStatus = "loading";
      })
      .addCase(createNews.fulfilled, (s, a) => {
        s.formStatus = "succeeded";
        if (a.payload) s.items.unshift(a.payload);
        s.error = null;
      })
      .addCase(createNews.rejected, (s, a) => {
        s.formStatus = "failed";
        s.error = a.payload;
      })

      // update
      .addCase(updateNews.pending, (s) => {
        s.formStatus = "loading";
      })
      .addCase(updateNews.fulfilled, (s, a) => {
        s.formStatus = "succeeded";
        const updated = a.payload;
        if (updated && typeof updated?.id !== "undefined") {
          s.items = s.items.map((x) => (x.id === updated.id ? updated : x));
          if (s.current?.id === updated.id) s.current = updated;
        }
        s.error = null;
      })
      .addCase(updateNews.rejected, (s, a) => {
        s.formStatus = "failed";
        s.error = a.payload;
      })

      // delete
      .addCase(deleteNews.fulfilled, (s, a) => {
        s.items = s.items.filter((x) => x.id !== a.payload);
        if (s.current?.id === a.payload) s.current = null;
      });
  },
});

export const { clearNews, resetFormStatus } = newsSlice.actions;
export default newsSlice.reducer;
