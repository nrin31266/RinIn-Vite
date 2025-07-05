import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { extractErrorMessage } from "./utils"
import handleAPI from "../cfgs/handleAPI"
import type { IUser } from "./authSlice";
import { data } from 'react-router-dom';


export const fetchUserProfileById = createAsyncThunk<IUser, number>("profile/fetchUserProfileById", async (userId: number, {rejectWithValue}) => {
    try {
        const data = await handleAPI<IUser>({
            endpoint: `/authentication/profile/${userId}`,
            isAuth: true,
        })
        return data;
    } catch (error) {
        return rejectWithValue(extractErrorMessage(error))
    }
    
})
export const updateProfileAbout = createAsyncThunk<IUser, {about: string}>("profile/updateProfileAbout", async ({about}, {rejectWithValue}) => {
    try {
        const data = await handleAPI<IUser>({
            endpoint: `/authentication/profile/about`,
            method: "put",
            isAuth: true,
            body: { about }
        })
        return data;
    } catch (error) {
        return rejectWithValue(extractErrorMessage(error))
    }
    
})
interface ProfileSlideState{
    showUser: IUser | null;
    status: {
        fetchUserProfileById: "idle" | "loading" | "succeeded" | "failed";
        updateProfileAbout?: "idle" | "loading" | "succeeded" | "failed";
    }
    error: {
        fetchUserProfileById: string | null;
        updateProfileAbout?: string | null;
    }
}


const initialState : ProfileSlideState = {
    showUser: null,
    status:{
        fetchUserProfileById: "idle",
        updateProfileAbout: "idle"
    },
    error: {
        fetchUserProfileById: null,
        updateProfileAbout: null
    }
}

const profileSlide = createSlice({
    initialState: initialState,
    name: "profile",
    reducers: {
        setShowUser: (state, action) => {
            state.showUser = action.payload;
            state.status.fetchUserProfileById = "succeeded";
        }
    },
    extraReducers: (builder)=>{
    
        builder.addCase(fetchUserProfileById.pending, (state)=>{
            state.status.fetchUserProfileById = "loading";
            state.error.fetchUserProfileById = null;
        })
        builder.addCase(fetchUserProfileById.fulfilled, (state, action)=>{
            state.status.fetchUserProfileById = "succeeded";
            state.showUser = action.payload;
            state.error.fetchUserProfileById = null;
        })
        builder.addCase(fetchUserProfileById.rejected, (state, action)=>{
            state.status.fetchUserProfileById = "failed";
            state.error.fetchUserProfileById = action.payload as string;
        })
        builder.addCase(updateProfileAbout.pending, (state)=>{
            state.status.updateProfileAbout = "loading";
            state.error.updateProfileAbout = null;
        })
        builder.addCase(updateProfileAbout.fulfilled, (state, action)=>{
            state.status.updateProfileAbout = "succeeded";
            state.showUser = {...state.showUser, ...action.payload};
        })
        builder.addCase(updateProfileAbout.rejected, (state, action)=>{
            state.status.updateProfileAbout = "failed";
            state.error.updateProfileAbout = action.payload as string;
        })
    }
})

export default profileSlide.reducer;
export const { setShowUser } = profileSlide.actions;
