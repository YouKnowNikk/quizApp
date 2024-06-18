import { createAsyncThunk } from "@reduxjs/toolkit";
import instance from "../../api/Api";
import extractErrorMessage from "../../../utils/ExtractError";
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
