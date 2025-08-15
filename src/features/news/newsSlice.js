import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/api/axios";

const pickErr = (e) => e?.response?.data?.message || e?.message || "Error";

export const fetchNews = createAsyncThunk("news/fetchAll", async (_, { rejectWithValue }) => {
  try { const { data } = await api.get("/news"); return data; }
  catch (e) { return rejectWithValue(pickErr(e)); }
});

export const fetchNewsById = createAsyncThunk("news/fetchById", async (uuid, { rejectWithValue }) => {
  try { const { data } = await api.get(`/news/${uuid}`); return data; }
  catch (e) { return rejectWithValue(pickErr(e)); }
});

export const createNews = createAsyncThunk("news/create", async (payload, { rejectWithValue }) => {
  try { const { data } = await api.post("/news", payload); return data.news; }
  catch (e) { return rejectWithValue(pickErr(e)); }
});

export const updateNews = createAsyncThunk("news/update", async ({ uuid, payload }, { rejectWithValue }) => {
  try { const { data } = await api.patch(`/news/${uuid}`, payload); return data.news; }
  catch (e) { return rejectWithValue(pickErr(e)); }
});

export const deleteNews = createAsyncThunk("news/delete", async (uuid, { rejectWithValue }) => {
  try { await api.delete(`/news/${uuid}`); return uuid; }
  catch (e) { return rejectWithValue(pickErr(e)); }
});

const newsSlice = createSlice({
  name: "news",
  initialState: { items: [], current: null, status: "idle", error: null },
  reducers: { clearNews: (s) => { s.current = null; } },
  extraReducers: (b) => {
    b
      .addCase(fetchNews.pending, (s) => { s.status = "loading"; })
      .addCase(fetchNews.fulfilled, (s, a) => { s.status = "succeeded"; s.items = a.payload; s.error = null; })
      .addCase(fetchNews.rejected, (s, a) => { s.status = "failed"; s.error = a.payload; })

      .addCase(fetchNewsById.fulfilled, (s, a) => { s.current = a.payload; })
      .addCase(createNews.fulfilled, (s, a) => { s.items.unshift(a.payload); })
      .addCase(updateNews.fulfilled, (s, a) => {
        s.items = s.items.map((x) => (x.uuid === a.payload.uuid ? a.payload : x));
        if (s.current?.uuid === a.payload.uuid) s.current = a.payload;
      })
      .addCase(deleteNews.fulfilled, (s, a) => {
        s.items = s.items.filter((x) => x.uuid !== a.payload);
        if (s.current?.uuid === a.payload) s.current = null;
      });
  },
});

export const { clearNews } = newsSlice.actions;
export default newsSlice.reducer;
