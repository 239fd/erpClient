import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../axios";

// Async thunk для регистрации директора
export const registerDirectorData = createAsyncThunk(
    "auth/registerDirectorData",
    async (params, { rejectWithValue }) => {
        try {
            const response = await axios.post("/registerdirector", params);

            if (!response.status) {
                throw new Error("ServerError: 500");
            }

            const data = response.data.data;
            localStorage.user = JSON.stringify(data);

            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk для регистрации пользователя
export const registerUserData = createAsyncThunk(
    "auth/registerUserData",
    async (params, { rejectWithValue }) => {
        try {
            const response = await axios.post("/register", params);

            if (!response.status) {
                throw new Error("ServerError: 500");
            }

            const data = response.data.data;
            localStorage.user = JSON.stringify(data);

            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk для входа
export const fetchLoginData = createAsyncThunk(
    "auth/fetchLoginData",
    async (params, { rejectWithValue }) => {
        try {
            const response = await axios.post("/login", params);

            if (response.status !== 200) {
                throw new Error(response.data.message || "Ошибка сервера");
            }

            const data = response.data.data;
            localStorage.user = JSON.stringify(data);

            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Начальное состояние
const initialState = {
    user: {
        id: 0,
        login: "",
        firstName: "",
        token: "",
    },
    status: "",
    errorMessage: "",
};

// Slice для auth
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logOut(state) {
            state.user = null;
            localStorage.removeItem("user");
        },
    },
    extraReducers: (builder) => {
        builder
            // Регистрация директора
            .addCase(registerDirectorData.pending, (state) => {
                state.status = "pending";
            })
            .addCase(registerDirectorData.fulfilled, (state, action) => {
                state.status = "loaded";
                state.user = action.payload;
            })
            .addCase(registerDirectorData.rejected, (state, action) => {
                state.status = "error";
                state.errorMessage = action.payload || "Ошибка регистрации директора";
            })

            // Регистрация пользователя
            .addCase(registerUserData.pending, (state) => {
                state.status = "pending";
            })
            .addCase(registerUserData.fulfilled, (state, action) => {
                state.status = "loaded";
                state.user = action.payload;
            })
            .addCase(registerUserData.rejected, (state, action) => {
                state.status = "error";
                state.errorMessage = action.payload || "Ошибка регистрации пользователя";
            })

            // Логин
            .addCase(fetchLoginData.pending, (state) => {
                state.status = "pending";
            })
            .addCase(fetchLoginData.fulfilled, (state, action) => {
                state.status = "loaded";
                state.user = action.payload;
            })
            .addCase(fetchLoginData.rejected, (state, action) => {
                state.status = "error";
                state.errorMessage = action.payload || "Ошибка входа";
            });
    },
});

export const { logOut } = authSlice.actions;
export const AuthReducer = authSlice.reducer;
