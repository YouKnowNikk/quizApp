
import extractErrorMessage from "../../../utils/ExtractError";
import instance from "../../api/Api";
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export const userLogin = createAsyncThunk("auth/login", async (data, { rejectWithValue }) => {
    try {
        const response = await instance.post("users/login", data);
        return response.data
    }
    catch (error) {
        if (error.response) {
            const { status, data } = error.response;
            let errorsMessage = extractErrorMessage(data)

            return rejectWithValue({ status, message: errorsMessage || 'Login failed' });
        } else {
            return rejectWithValue({ message: 'Network error' });
        }
    }
});

export const userRegistration = createAsyncThunk("auth/register", async (data, { rejectWithValue }) => {
    try {
        const response = await instance.post("users/register", data);
        return response.data;
    }
    catch (error) {
        if (error.response) {
            const { status, data } = error.response;
            let errorsMessage = extractErrorMessage(data)
            return rejectWithValue({ status, message: errorsMessage || 'Registration failed' });
        } else {
            return rejectWithValue({ message: 'Network error' });
        }
    }
});

export const getuser = createAsyncThunk("auth/getUser",async (_,{rejectWithValue})=>{
    try{
        const response = await instance.get("users/getuser");
        return response.data
    }
    catch(error){
        if (error.response) {
            const { status, data } = error.response;
            let errorsMessage = extractErrorMessage(data)
            return rejectWithValue({ status, message: errorsMessage || 'Registration failed' });
        } else {
            return rejectWithValue({ message: 'Network error' });
        }
    }
})

export const verifyOTP = createAsyncThunk("auth/verifyOTP",async (data,{rejectWithValue})=>{
    try{
        const response = await instance.post("users/verifyotp",data);
        return response.data;
    }
    catch(error){
        if (error.response) {
            const { status, data } = error.response;
            let errorsMessage = extractErrorMessage(data)
            return rejectWithValue({ status, message: errorsMessage || 'Something went wrong' });
        } else {
            return rejectWithValue({ message: 'Network error' });
        }
    }
})

const userSlice = createSlice({
    name: 'userAuth',
    initialState: {
        user: null,
        token: null,
        state: "idle",
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(userLogin.pending, (state) => {
                state.status = "pending";
            })
            .addCase(userLogin.fulfilled, (state, action) => {
                state.status = "fulfilled";
                state.user = action.payload.data.user;
                state.token = action.payload.data.accessToken;
            })
            .addCase(userLogin.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            .addCase(userRegistration.pending, (state) => {
                state.status = "pending";
            })
            .addCase(userRegistration.fulfilled, (state, action) => {
                state.status = "fulfilled"
            })
            .addCase(userRegistration.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            .addCase(getuser.pending,(state)=>{
                state.status = "pending"
            })
            .addCase(getuser.fulfilled, (state, action) => {
                state.status = "fulfilled";
                state.user = action.payload
            })
            .addCase(getuser.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            .addCase(verifyOTP.pending,(state)=>{
                state.status = "pending"
            })
            .addCase(verifyOTP.fulfilled, (state, action) => {
                state.status = "fulfilled";
                
            })
            .addCase(verifyOTP.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
    }
})
export default userSlice.reducer