import { createAsyncThunk } from "@reduxjs/toolkit";
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
}

interface IMessagingState {
  conversation: IConversation | null;
  conversations: IConversation[];
  connections: IConnection[];
  checkConversation: ICheckConversation | null;

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
  connections: [],
  checkConversation: null,
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