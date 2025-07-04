import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { IPostDto } from "./feedSlide";
import { extractErrorMessage } from "./utils";
import handleAPI from "../cfgs/handleAPI";

interface ProfileSlideState{
    posts: IPostDto[]
    status: {
        fetchPostsByUserId: 'idle' | 'loading'| 'succeeded' | 'failed'
    }
    error: {
        fetchPostsByUserId?: string
    }
}


const initialState : ProfileSlideState = {
    posts: [],
    status:{
        fetchPostsByUserId: 'idle'
    },
    error: {}
}

export const fetchPostsByUserId = createAsyncThunk<IPostDto[], {userId: number}>(
    "profileSlide/fetchPostsByUserId", async ({userId}, {rejectWithValue})=>{
        try {
            const data = await handleAPI<IPostDto[]>({
                endpoint: "/feed/posts/users/" + userId,
                isAuth: true,
                method: 'get'
            })
            return data;
        } catch (error) {
            return rejectWithValue(extractErrorMessage(error));
        }
    }
)

const profileSlide = createSlice({
    initialState: initialState,
    name: "profile",
    reducers: {

    },
    extraReducers: (builder)=>{
        builder.addCase(fetchPostsByUserId.pending, (state)=>{
            state.status.fetchPostsByUserId = 'loading'
        }).addCase(fetchPostsByUserId.fulfilled, (state, action)=>{
            state.posts = action.payload
            state.status.fetchPostsByUserId = 'succeeded'
        }).addCase(fetchPostsByUserId.rejected, (state, action)=>{
            state.status.fetchPostsByUserId = 'failed'
            state.error.fetchPostsByUserId = action.payload as string
        })
    }
})

export default profileSlide.reducer;