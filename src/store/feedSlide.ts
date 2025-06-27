import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { IUser } from "./authSlice"
import type { IPostBackground } from "./postCreatorSlide"
import handleAPI from "../cfgs/handleAPI"
import { extractErrorMessage } from "./utils"

export interface IPostDto {
  id: number
  content: string
  author: IUser
  creationDate: string
  updateDate: any
  postMedias: IPostMedia[]
  reactCounts: Map<string, number>
  commentCount: number
  postBg?: IPostBackground
  postType: 'NORMAL' | 'BACKGROUND'
}
export interface IPostMedia {
  id: number
  content: string
  mediaUrl: string
  mediaType: 'IMAGE' | 'VIDEO'
  height: number
  width: number
  duration?: number
  thumbnailUrl?: string // Thêm thumbnailUrl nếu cần
}

export const fetchPosts = createAsyncThunk(
  "feed/fetchPosts", async (_, { rejectWithValue }) => {
    try {
      const data = await handleAPI<IPostDto[]>({
        endpoint: `/feed/posts`,
        method: "get",
        isAuth: true,
      });
      return data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

interface IFeedSlideState {
    posts: IPostDto[]
    status: {
        fetchPosts: 'idle' | 'loading' | 'succeeded' | 'failed'
    }
    error: {
        fetchPosts: string | null
    }
}
const initialState: IFeedSlideState = {
  posts: [],
  status: {
    fetchPosts: 'idle',
  },
  error: {
    fetchPosts: null,
  },
};
const feedSlide = createSlice({
  name: "feedSlide",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status.fetchPosts = 'loading';
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status.fetchPosts = 'succeeded';
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status.fetchPosts = 'failed';
        state.error.fetchPosts = action.payload as string;
      });
  },
});

export default feedSlide.reducer;
