import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { IUser } from "./authSlice";
import type { IPostBackground } from "./postCreatorSlide";
import handleAPI from "../cfgs/handleAPI";
import { extractErrorMessage } from "./utils";

export interface IPostDto {
  id: number;
  content: string;
  author: IUser;
  creationDate: string;
  updateDate: any;
  isReacted: boolean; // Biến này để xác định người dùng đã phản ứng với bài viết hay chưa
  myReactType?: 'LIKE' | 'LOVE' | 'WOW' | 'HAHA' | 'SAD' | 'ANGRY'; // Biến này để xác định loại phản ứng của người dùng với bài viết
  postMedias: IPostMedia[];
  reactCounts: Record<'LIKE' | 'LOVE' | 'WOW' | 'HAHA' | 'SAD' | 'ANGRY', number>; // Mảng các đối tượng phản ứng với type và số lượng
  commentCount: number;
  postBg?: IPostBackground;
  postType: "NORMAL" | "BACKGROUND";
  // Only front end use - Backup state for rollback
  tempState?: {
    isReacted: boolean;
    myReactType?: 'LIKE' | 'LOVE' | 'WOW' | 'HAHA' | 'SAD' | 'ANGRY';
    reactCounts: Record<'LIKE' | 'LOVE' | 'WOW' | 'HAHA' | 'SAD' | 'ANGRY', number>;
  };

}
export interface IPostMedia {
  id: number;
  content: string;
  mediaUrl: string;
  mediaType: "IMAGE" | "VIDEO";
  height: number;
  width: number;
  duration?: number;
  thumbnailUrl?: string; // Thêm thumbnailUrl nếu cần
}
export interface ICommentDtoRq{
  content: string;
  targetId: number;
  targetAction: "POST" | "POST_MEDIA" | "COMMENT";
  repliedToId?: number;
}

export interface ICommentDto {
  id: number
  author: IUser
  content: string
  creationDate: string
  updateDate?: string
  parentCommentId: number
  repliedTo: IUser
  repliedCount: number
  postId: number
  //Only front end use
  replies?: ICommentDto[]; // Biến này để lưu các comment đã reply
}
export const fetchPosts = createAsyncThunk(
  "feed/fetchPosts",
  async (_, { rejectWithValue }) => {
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

export interface IPostReactionRq {
  targetId: number;
  reactType: 'LIKE' | 'LOVE' | 'WOW' | 'HAHA' | 'SAD' | 'ANGRY';
  targetAction: "POST" | "POST_MEDIA" | "COMMENT";
}
export const reactToPost = createAsyncThunk(
  "feed/reactToPost",
  async (reaction: IPostReactionRq, { rejectWithValue }) => {
    try {
      const data = await handleAPI({
        endpoint: `/feed/posts/react`,
        method: "post",
        isAuth: true,
        body: reaction,
      });
      return data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);
export const unReactToPost = createAsyncThunk(
  "feed/un-reactToPost",
  async (reaction: IPostReactionRq, { rejectWithValue }) => {
    try {
      const data = await handleAPI({
        endpoint: `/feed/posts/un-react`,
        method: "delete",
        isAuth: true,
        body: reaction,
      });
      return data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);
export const createComment = createAsyncThunk(
  "feed/createComment",
  async (commentData: ICommentDtoRq, { rejectWithValue }) => {
    try {
      const data = await handleAPI<ICommentDto>({
        endpoint: `/feed/posts/comment`,
        method: "post",
        isAuth: true,
        body: commentData,
      });
      return data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);
export const fetchPostComments = createAsyncThunk<ICommentDto[], { targetId: number; targetAction: "POST" | "POST_MEDIA" | "COMMENT" }>(
  "feed/fetchPostComments",
  async ({targetAction, targetId}, { rejectWithValue }) => {
    try {
      const data = await handleAPI<ICommentDto[]>({
        endpoint: `/feed/comments?targetId=${targetId}&targetAction=${targetAction}`,
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
  posts: IPostDto[];
  selectedPost?: IPostDto; // Thêm biến để lưu post được chọn
  openPostDetailsModel: boolean; // Biến để xác định có mở model chi tiết post hay không
  currentPostComments: ICommentDto[]; // Biến để lưu các comment của post hiện tại
  status: {
    fetchPosts: "idle" | "loading" | "succeeded" | "failed";
    reactToPost: "idle" | "loading" | "succeeded" | "failed";
    unReactToPost: "idle" | "loading" | "succeeded" | "failed";
    createComment: "idle" | "loading" | "succeeded" | "failed";
    fetchComments: "idle" | "loading" | "succeeded" | "failed";
    fetchRepliedComments: Record<number, "idle" | "loading" | "succeeded" | "failed">; // Trạng thái của các comment đã reply
  };
  error: {
    fetchPosts: string | null;
    reactToPost: string | null;
    unReactToPost: string | null;
    createComment?: string | null; // Thêm error cho createComment nếu cần
    fetchComments?: string | null; // Thêm error cho fetchComments nếu cần
    fetchRepliedComments: Record<number, string | null>; // Thêm error cho fetch
  };
}
const initialState: IFeedSlideState = {
  posts: [],
  selectedPost: undefined,
  openPostDetailsModel: false,
  currentPostComments: [], // Biến để lưu các comment của post hiện tại
  status: {
    fetchPosts: "idle",
    reactToPost: "idle",
    unReactToPost: "idle",
    createComment: "idle",
    fetchComments: "idle", // Trạng thái của fetchComments
    fetchRepliedComments: {}, // Trạng thái của các comment đã reply
  },
  error: {
    fetchPosts: null,
    reactToPost: null,
    unReactToPost: null,
    createComment: null, // Thêm error cho createComment nếu cần
    fetchComments: null, // Thêm error cho fetchComments nếu cần
    fetchRepliedComments: {}, // Thêm error cho fetchRepliedComments nếu cần
  },
};

// Helper functions for state management
const backupPostState = (post: IPostDto) => {
  post.tempState = {
    isReacted: post.isReacted,
    myReactType: post.myReactType,
    reactCounts: { ...post.reactCounts }
  };
};

const restorePostState = (post: IPostDto) => {
  if (post.tempState) {
    post.isReacted = post.tempState.isReacted;
    post.myReactType = post.tempState.myReactType;
    post.reactCounts = { ...post.tempState.reactCounts };
    post.tempState = undefined;
  }
};

const clearTempState = (post: IPostDto) => {
  post.tempState = undefined;
};

const updateSelectedPost = (state: IFeedSlideState, updatedPost: IPostDto) => {
  if (state.selectedPost && state.selectedPost.id === updatedPost.id) {
    state.selectedPost = { ...updatedPost };
  }
};
const feedSlide = createSlice({
  name: "feedSlide",
  initialState,
  reducers: {
    setSelectedPost: (state, action) => {
      state.selectedPost = action.payload;
    },
    clearSelectedPost: (state) => {
      state.selectedPost = undefined;
    },
    togglePostDetailsModel: (state) => {
      state.openPostDetailsModel = !state.openPostDetailsModel;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status.fetchPosts = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status.fetchPosts = "succeeded";
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status.fetchPosts = "failed";
        state.error.fetchPosts = action.payload as string;
      })
      .addCase(reactToPost.pending, (state, action) => {
        state.status.reactToPost = "loading";
        const { targetId, reactType } = action.meta.arg;
        // Tìm post tương ứng để cập nhật trạng thái react
        const post = state.posts.find((p) => p.id === targetId);
        
        if (post) {
          // Backup trạng thái hiện tại trước khi thay đổi
          backupPostState(post);
          
          // Nếu người dùng đã phản ứng trước đó, trừ reaction cũ
          if (post.isReacted && post.myReactType) {
            post.reactCounts[post.myReactType] -= 1;
            if (post.reactCounts[post.myReactType] <= 0) {
              delete post.reactCounts[post.myReactType];
            }
          }
          
          // Thêm reaction mới
          const existingReaction = post.reactCounts[reactType];
          if (existingReaction === undefined) {
            post.reactCounts[reactType] = 1;
          } else {
            post.reactCounts[reactType] += 1;
          }
          
          // Cập nhật trạng thái đã phản ứng
          post.isReacted = true;
          post.myReactType = reactType;

          // Cập nhật selectedPost nếu có
          updateSelectedPost(state, post);
        }
      })
      .addCase(reactToPost.fulfilled, (state, action) => {
        state.status.reactToPost = "succeeded";
        const { targetId } = action.meta.arg;
        const post = state.posts.find((p) => p.id === targetId);
        if (post) {
          // Xóa backup state vì thành công
          clearTempState(post);
          // Cập nhật selectedPost nếu có
          updateSelectedPost(state, post);
        }
      })
      .addCase(reactToPost.rejected, (state, action) => {
        state.status.reactToPost = "failed";
        state.error.reactToPost = action.payload as string;
        const { targetId } = action.meta.arg;
        // Xử lý lỗi phản ứng: hoàn tác thay đổi tạm thời
        const post = state.posts.find((p) => p.id === targetId);
        if (post) {
          // Restore trạng thái từ backup
          restorePostState(post);
          // Cập nhật selectedPost nếu có
          updateSelectedPost(state, post);
        }
      })
      .addCase(unReactToPost.pending, (state, action) => {
        state.status.unReactToPost = "loading";
        const { targetId, reactType } = action.meta.arg;
        const post = state.posts.find((p) => p.id === targetId);  
        if (post) {
          // Backup trạng thái hiện tại trước khi thay đổi
          backupPostState(post);
          
          // Trừ reaction hiện tại
          const existingReaction = post.reactCounts[reactType];
          if (existingReaction !== undefined) {
            post.reactCounts[reactType] -= 1;
            if (post.reactCounts[reactType] <= 0) {
              delete post.reactCounts[reactType];
            }
          }
          
          // Đặt lại trạng thái phản ứng
          post.isReacted = false;
          post.myReactType = undefined;

          // Cập nhật selectedPost nếu có
          updateSelectedPost(state, post);
        }
      })
      .addCase(unReactToPost.fulfilled, (state, action) => {
        state.status.unReactToPost = "succeeded";
        const { targetId } = action.meta.arg;
        const post = state.posts.find((p) => p.id === targetId);
        if (post) {
          // Xóa backup state vì thành công
          clearTempState(post);
          // Cập nhật selectedPost nếu có
          updateSelectedPost(state, post);
        }
      })
      .addCase(unReactToPost.rejected, (state, action) => {
        state.status.unReactToPost = "failed";
        state.error.unReactToPost = action.payload as string;
        const { targetId } = action.meta.arg;
        // Xử lý lỗi bỏ phản ứng: hoàn tác thay đổi tạm thời
        const post = state.posts.find((p) => p.id === targetId);
        if (post) {
          // Restore trạng thái từ backup
          restorePostState(post);
          // Cập nhật selectedPost nếu có
          updateSelectedPost(state, post);
        }
      }).addCase(createComment.pending, (state) => {
        state.status.createComment = "loading";
      }).addCase(createComment.fulfilled, (state, action) => {
        state.status.createComment = "succeeded";
        const newComment = action.payload;
        
        const post = state.posts.find((p) => p.id === newComment.postId);
        if(post) {
          state.currentPostComments = [newComment, ...state.currentPostComments]
          
          // Cập nhật số lượng comment của post
          post.commentCount += 1;

          // Cập nhật selectedPost nếu có
          updateSelectedPost(state, post);
        }
      }).addCase(createComment.rejected, (state, action) => {
        state.status.createComment = "failed";
        state.error.createComment = action.payload as string;
      })
      .addCase(fetchPostComments.pending, (state, action) => {
        const { targetId, targetAction } = action.meta.arg;
        switch (targetAction) {
          case "POST":
            state.status.fetchComments = "loading";
            break;
          case "COMMENT":
            // Cập nhật trạng thái của comment đã reply
            if (!state.status.fetchRepliedComments[targetId]) {
              state.status.fetchRepliedComments[targetId] = "loading";
            }
            break;
        }
      })
      .addCase(fetchPostComments.fulfilled, (state, action) => {
        const { targetId, targetAction } = action.meta.arg;
        switch (targetAction) {
          case "POST":
            state.status.fetchComments = "succeeded";
            state.currentPostComments = action.payload;
            break;
          case "COMMENT":
            // Cập nhật trạng thái của comment đã reply
            if (state.status.fetchRepliedComments[targetId] === "loading") {
              state.status.fetchRepliedComments[targetId] = "succeeded";
            }
            // Thêm các comment đã reply vào currentPostComments
            state.currentPostComments.push(...action.payload);
            break;
        }
      })
      .addCase(fetchPostComments.rejected, (state, action) => {
        const { targetId, targetAction } = action.meta.arg;
        switch (targetAction) {
          case "POST":
            state.status.fetchComments = "failed";
            state.error.fetchComments = action.payload as string;
            break;
          case "COMMENT":
            // Cập nhật trạng thái của comment đã reply
            if (state.status.fetchRepliedComments[targetId] === "loading") {
              state.status.fetchRepliedComments[targetId] = "failed";
              state.error.fetchRepliedComments[targetId] = action.payload as string;
            }
            break;
        }
      });
  },
});

export default feedSlide.reducer;
export const { setSelectedPost, clearSelectedPost, togglePostDetailsModel } = feedSlide.actions;
