import {configureStore} from '@reduxjs/toolkit'
import userAuthReducer from '../component/features/userSlice/UserSlice'
export const store = configureStore({
    reducer:{
        userAuthReducer
    }
}) 