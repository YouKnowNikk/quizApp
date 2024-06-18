import { createSlice } from '@reduxjs/toolkit'
import { getuser, userLogin, userRegistration, verifyOTP } from './UserAction';


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