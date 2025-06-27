import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { extractErrorMessage } from "./utils";
import handleAPI from "../cfgs/handleAPI";

export interface IPostBackground {
  id: string;
  bgImgUrl: string;
  bgColor: string;
  bgStyle: string;
  textColor: string;
  type: "COLOR" | "IMAGE_URL";
}
interface IPostRequest {
  content: string;
  postBgId?: string;
  postType: "NORMAL" | "BACKGROUND";
  postMedias: IPostMediaRq[];
}
export interface IPostMediaRq {
  content: string;
  mediaUrl: string;
  mediaType: "IMAGE" | "VIDEO";
  height: number;
  width: number;
  duration?: number;
  thumbnailUrl?: string; // Thêm thumbnailUrl nếu cần
}

interface PostCreatorSlideState {
  isOpen: boolean;
  from: string;
  postBgs: IPostBackground[];
  postRq: IPostRequest;
  status: {
    fetchPostBackgrounds: "idle" | "loading" | "succeeded" | "failed";
  };
  error: {
    fetchPostBackgrounds: string | null;
  };
}
const initialState: PostCreatorSlideState = {
  isOpen: false,
  from: "",
  postRq: {
    content: "",
    postBgId: undefined,
    postType: "NORMAL",
    postMedias: [],
  },
  postBgs: [],
  status: {
    fetchPostBackgrounds: "idle",
  },
  error: {
    fetchPostBackgrounds: null,
  },
};

export const fetchPostBackgrounds = createAsyncThunk(
  "postCreatorSlide/fetchPostBackgrounds",
  async (_, { rejectWithValue }) => {
    try {
      const data = await handleAPI<IPostBackground[]>({
        endpoint: "/feed/post-bgs",
        method: "get",
        isAuth: true,
      });
      return data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const createPost = createAsyncThunk(
  "postCreatorSlide/createPost",
  async (postRequest: IPostRequest, { rejectWithValue }) => {
    try {
      const data = await handleAPI<IPostRequest>({
        endpoint: "/feed/posts",
        method: "post",
        isAuth: true,
        body: postRequest,
      });
      return data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

const postCreatorSlide = createSlice({
  name: "postCreatorSlide",
  initialState,
  reducers: {
    openPostCreatorModel: (state, action: PayloadAction<{ from?: string }>) => {
      state.isOpen = true;
      state.from = action.payload.from || "";
    },
    closePostCreatorModel: (state) => {
      state.isOpen = false;
      state.from = "";
    },
    setPostContent: (state, action: PayloadAction<{ content?: string }>) => {
      state.postRq.content = action.payload.content || "";
      if (state.postRq.content.length > 130) {
        state.postRq.postBgId = undefined; // Reset selected background if content exceeds 130 characters
      }
    },
    setSelectPostBgId: (
      state,
      action: PayloadAction<{ selectPostBgId?: string }>
    ) => {
      state.postRq.postBgId = action.payload.selectPostBgId;
      if (state.postRq.postBgId === undefined) {
        state.postRq.postType = "NORMAL"; // Reset post type if no background is selected
      } else {
        state.postRq.postType = "BACKGROUND"; // Set post type to BACKGROUND if a background is selected
      }
    },
    updateMedias: (
      state,
      action: PayloadAction<{ postMedias: IPostMediaRq[] }>
    ) => {
      state.postRq.postMedias = action.payload.postMedias;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPostBackgrounds.pending, (state) => {
        state.status.fetchPostBackgrounds = "loading";
        state.error.fetchPostBackgrounds = null;
      })
      .addCase(
        fetchPostBackgrounds.fulfilled,
        (state, action: PayloadAction<IPostBackground[]>) => {
          state.status.fetchPostBackgrounds = "succeeded";
          state.postBgs = action.payload;
        }
      )
      .addCase(fetchPostBackgrounds.rejected, (state, action) => {
        state.status.fetchPostBackgrounds = "failed";
        state.error.fetchPostBackgrounds = action.payload as string;
      })
      .addCase(createPost.pending, (state) => {
        state.status.fetchPostBackgrounds = "loading";
      })
      .addCase(
        createPost.fulfilled,
        (state, action: PayloadAction<IPostRequest>) => {
          state.status.fetchPostBackgrounds = "succeeded";
          state.isOpen = false; // Close the modal after successful post creation
          state.postRq = initialState.postRq; // Reset post request state
          state.from = ""; // Reset from state
        }
      )
      .addCase(createPost.rejected, (state, action) => {
        state.status.fetchPostBackgrounds = "failed";
        state.error.fetchPostBackgrounds = action.payload as string;
      });
  },
});

export const {
  openPostCreatorModel,
  closePostCreatorModel,
  setPostContent,
  setSelectPostBgId,
  updateMedias,
} = postCreatorSlide.actions;
export default postCreatorSlide.reducer;
