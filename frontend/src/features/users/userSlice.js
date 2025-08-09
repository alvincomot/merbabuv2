  // src/features/users/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from '@/api/axios'; // Menggunakan instance axios terpusat

// Thunks untuk operasi CRUD User
export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
    const response = await api.get("/users");
    return response.data;
});

export const createUser = createAsyncThunk("users/createUser", async (userData, { rejectWithValue }) => {
    try {
        const response = await api.post('/users', userData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const updateUser = createAsyncThunk("users/updateUser", async ({ id, userData }, { rejectWithValue }) => {
    try {
        const response = await api.patch(`/users/${id}`, userData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const deleteUser = createAsyncThunk("users/deleteUser", async (id, { rejectWithValue }) => {
    try {
        await api.delete(`/users/${id}`);
        return id;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

const userSlice = createSlice({
    name: "users",
    initialState: {
        items: [],
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
            // Fetch Users
            .addCase(fetchUsers.pending, (state) => { state.status = "loading"; })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.items = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })
            // Create User
            .addCase(createUser.pending, (state) => { state.formStatus = "loading"; })
            .addCase(createUser.fulfilled, (state, action) => {
                state.formStatus = "succeeded";
                if (action.payload && action.payload.user) {
                    state.items.push(action.payload.user);
                }
            })
            .addCase(createUser.rejected, (state, action) => {
                state.formStatus = "failed";
                state.error = action.payload?.message || "Gagal membuat user.";
            })
            // Update User
            .addCase(updateUser.pending, (state) => { state.formStatus = "loading"; })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.formStatus = "succeeded";
                const index = state.items.findIndex(user => user.uuid === action.payload.uuid);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.formStatus = "failed";
                state.error = action.payload?.message || "Gagal mengupdate user.";
            })
            // Delete User
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.items = state.items.filter(user => user.uuid !== action.payload);
            });
    }
});

export const { resetFormStatus } = userSlice.actions;
export default userSlice.reducer;