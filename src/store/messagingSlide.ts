import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { IUser } from "./authSlice";
import { fetchConnections, type IConnection } from "./networkingSlide";
import { extractErrorMessage } from "./utils";
import handleAPI from "../cfgs/handleAPI";

export interface IMessage {
  id: string;
  sender: IUser;
  recipient: IUser;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export interface IConversation {
  id: string;
  author: IUser;
  recipient: IUser;
  messages: IMessage[];
}

export interface ICheckConversation{
    isConversationExists: boolean;
    receiver: IUser | null;
    conversationId: string | null;
}

interface IMessagingState {
  conversation: IConversation | null;
  conversations: IConversation[];
  checkConversation: ICheckConversation | null;
  recipient: IUser | null;

  status: {
    fetchConversations: "idle" | "loading" | "succeeded" | "failed";
    fetchConversation: "idle" | "loading" | "succeeded" | "failed";
    checkConversation: "idle" | "loading" | "succeeded" | "failed";
  };
  error: {
    fetchConversations: string | null;
    fetchConversation: string | null;
    checkConversation: string | null;

  };
}
const initialState: IMessagingState = {
  conversation: null,
  conversations: [],
  checkConversation: null,
  recipient: null,
  status: {
    fetchConversations: "idle",
    fetchConversation: "idle",
    checkConversation: "idle",
  },
  error: {
    fetchConversations: null,
    fetchConversation: null,
    checkConversation: null,
  },
};

export const fetchConversations = createAsyncThunk<IConversation[]>(
  "messaging/fetchConversations",
  async (_, { rejectWithValue }) => {
    try {
      const data = await handleAPI<IConversation[]>({
        endpoint: "/messaging/conversations",
        isAuth: true,
      });
      return data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);
export const fetchConversation = createAsyncThunk<IConversation, string>(
  "messaging/fetchConversation",
  async (conversationId, { rejectWithValue }) => {
    try {
      const data = await handleAPI<IConversation>({
        endpoint: `/messaging/conversations/${conversationId}`,
        isAuth: true,
      });
      return data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const checkConversation = createAsyncThunk<ICheckConversation, string>(
  "messaging/checkConversation",
  async (recipientId, { rejectWithValue }) => {
    try {
      const data = await handleAPI<ICheckConversation>({
        endpoint: `/messaging/conversations/with/${recipientId}`,
        isAuth: true,
      });
      return data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);


const messagingSlice = createSlice({
  name: "messaging",
  initialState,
  reducers: {
    setRecipient: (state, action) => {
      state.recipient = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.status.fetchConversations = "loading";
        state.error.fetchConversations = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.status.fetchConversations = "succeeded";
        state.conversations = action.payload;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.status.fetchConversations = "failed";
        state.error.fetchConversations = action.payload as string;
      })
      .addCase(fetchConversation.pending, (state) => {
        state.status.fetchConversation = "loading";
        state.error.fetchConversation = null;
      })
      .addCase(fetchConversation.fulfilled, (state, action) => {
        state.status.fetchConversation = "succeeded";
        state.conversation = action.payload;
      })
      .addCase(fetchConversation.rejected, (state, action) => {
        state.status.fetchConversation = "failed";
        state.error.fetchConversation = action.payload as string;
      })
      .addCase(checkConversation.pending, (state) => {
        state.status.checkConversation = "loading";
        state.error.checkConversation = null;
      })
      .addCase(checkConversation.fulfilled, (state, action) => {
        state.status.checkConversation = "succeeded";
        state.checkConversation = action.payload;
      })
      .addCase(checkConversation.rejected, (state, action) => {
        state.status.checkConversation = "failed";
        state.error.checkConversation = action.payload as string;
      });
  },
});
export const { setRecipient } = messagingSlice.actions;
export default messagingSlice.reducer;