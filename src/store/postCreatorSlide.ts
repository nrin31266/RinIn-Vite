import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { extractErrorMessage } from "./utils";
import handleAPI from "../cfgs/handleAPI";

interface IPostBackground {
    id: string;
   bgImgUrl: string;
   bgColor: string;
   bgStyle: string;
   textColor: string;
   type: "COLOR" | "IMAGE_URL";
}

interface PostCreatorSlideState {
    isOpen: boolean;
    content: string;
    from: string;
    postBgs: IPostBackground[];
    selectedPostBgId?: string;
    
    status: {
        fetchPostBackgrounds: 'idle' | 'loading' | 'succeeded' | 'failed';
    }
    error: {
        fetchPostBackgrounds: string | null;
    }
}
const initialState: PostCreatorSlideState = {
    isOpen: false,
    content: '',
    from: '',
    postBgs: [
    ],
    status: {
        fetchPostBackgrounds: 'idle',
    },
    error: {
        fetchPostBackgrounds: null,
    },
};

export const fetchPostBackgrounds = createAsyncThunk(
    "postCreatorSlide/fetchPostBackgrounds", async (_, { rejectWithValue }) => {
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

const postCreatorSlide = createSlice({
    name: 'postCreatorSlide',
    initialState,
    reducers: {
        openPostCreatorModel: (state, action: PayloadAction<{ from?: string }>) => {
            state.isOpen = true;
            state.from = action.payload.from || '';
        },
        closePostCreatorModel: (state) => {
            state.isOpen = false;
            state.content = '';
            state.from = '';
        },
        setPostContent: (state, action: PayloadAction<{ content?: string }>) => {
            state.content = action.payload.content || '';
            if (state.content.length > 130){
                state.selectedPostBgId = undefined; // Reset selected background if content exceeds 130 characters
            }
        },
        setSelectPostBgId: (state, action: PayloadAction<{ selectPostBgId?: string }>) => {
            state.selectedPostBgId = action.payload.selectPostBgId;
        },

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPostBackgrounds.pending, (state) => {
                state.status.fetchPostBackgrounds = 'loading';
                state.error.fetchPostBackgrounds = null;
            })
            .addCase(fetchPostBackgrounds.fulfilled, (state, action: PayloadAction<IPostBackground[]>) => {
                state.status.fetchPostBackgrounds = 'succeeded';
                state.postBgs = action.payload;
            })
            .addCase(fetchPostBackgrounds.rejected, (state, action) => {
                state.status.fetchPostBackgrounds = 'failed';
                state.error.fetchPostBackgrounds = action.payload as string;
            });
    },

});

export const { openPostCreatorModel, closePostCreatorModel, setPostContent, setSelectPostBgId } = postCreatorSlide.actions;
export default postCreatorSlide.reducer;
