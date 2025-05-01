import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../axios";

const registerUser = async (params, rejectWithValue, userType) => {
    try {
        const response = await axios.post("/auth-service/auth/register", params);

        if (response.status !== 200) {
            throw new Error(response.data.message || `Ошибка регистрации ${userType}`);
        }

        const data = response.data.data;

        return data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || `Ошибка регистрации ${userType}`;
        return rejectWithValue(errorMessage);
    }
};

export const registerDirectorData = createAsyncThunk(
    "auth/registerDirectorData",
    async (params, { rejectWithValue }) => {
        return registerUser(params, rejectWithValue, "директора");
    }
);

export const registerUserData = createAsyncThunk(
    "auth/registerUserData",
    async (params, { rejectWithValue }) => {
        return registerUser(params, rejectWithValue, "пользователя");
    }
);

export const fetchLoginData = createAsyncThunk(
    "auth/fetchLoginData",
    async (params, { rejectWithValue }) => {
        try {
            const response = await axios.post("/login", params);

            if (response.status !== 200) {
                throw new Error(response.data.message || "Ошибка входа");
            }

            const data = response.data.data;
            localStorage.setItem("user", JSON.stringify(data));

            return data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Ошибка входа";
            return rejectWithValue(errorMessage);
        }
    }
);

const initialState = {
    user: null,
    status: "",
    errorMessage: "",
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logOut(state) {
            state.user = null;
            state.status = "";
            state.errorMessage = "";
            localStorage.removeItem("user");
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerDirectorData.pending, (state) => {
                state.status = "pending";
                state.errorMessage = "";
            })
            .addCase(registerDirectorData.fulfilled, (state, action) => {
                state.status = "loaded";
                state.user = action.payload;
            })
            .addCase(registerDirectorData.rejected, (state, action) => {
                state.status = "error";
                state.errorMessage = action.payload;
            })

            .addCase(registerUserData.pending, (state) => {
                state.status = "pending";
                state.errorMessage = "";
            })
            .addCase(registerUserData.fulfilled, (state, action) => {
                state.status = "loaded";
                state.user = action.payload;
            })
            .addCase(registerUserData.rejected, (state, action) => {
                state.status = "error";
                state.errorMessage = action.payload;
            })

            // Логин
            .addCase(fetchLoginData.pending, (state) => {
                state.status = "pending";
                state.errorMessage = "";
            })
            .addCase(fetchLoginData.fulfilled, (state, action) => {
                state.status = "loaded";
                state.user = action.payload;
            })
            .addCase(fetchLoginData.rejected, (state, action) => {
                state.status = "error";
                state.errorMessage = action.payload;
            });
    },
});

export const { logOut } = authSlice.actions;
export const AuthReducer = authSlice.reducer;
