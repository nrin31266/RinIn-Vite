import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import handleAPI from "../cfgs/handleAPI";
import type { IPageableDto } from "../types";
import type { IUser } from "./authSlice";
import { extractErrorMessage } from "./utils";

export interface IMessage {
  id: number
  sender: IUser
  content: string
  createdAt: string
}

export interface IConversation {
  id: number
  createdBy: IUser
  name: any
  isGroup: boolean
  lastMessage: IMessage | null
  createdAt: string
}

export interface ICheckConversation{
    isConversationExists: boolean;
    receiver: IUser | null;
    conversationId: string | null;
}

export interface IConversationDto {
  conversationId: number
  isGroup: boolean
  groupName: string | null
  otherUserId: number
  otherUserName: string
  otherUserProfilePictureUrl: string | null
  lastMessageId: number | null
  lastMessageContent: string | null
  lastMessageCreatedAt: string | null
  lastMessageSenderId: number | null
  unreadCount: number
}

export interface IConversationDetailsDto {
  conversationId: number
  isGroup: boolean
  groupName: string | null
  totalMembers: number
  otherUserId: number
  otherUserFirstName: string | null
  otherUserLastName: string | null
  otherUserProfilePictureUrl: string | null
  otherUserPosition: string | null
  otherUserCompany: string | null
  myLastReadAt: string | null
  participants: IConversationParticipant[]
}
export interface IConversationParticipant {
  id: number
  user: IUser
  unreadCount: number
  lastReadAt: string
}


export interface IMessageDto{
  receiverId: number;
  content: string;
}

interface IMessagingState {
  conversation: IConversationDetailsDto | null;
  conversations: IConversationDto[];
  checkConversation: ICheckConversation | null;
  recipient: IUser | null;
  messages: IPageableDto<IMessage>;

  status: {
    fetchConversations: "idle" | "loading" | "succeeded" | "failed";
    fetchConversation: "idle" | "loading" | "succeeded" | "failed";
    checkConversation: "idle" | "loading" | "succeeded" | "failed";
    createConversation: "idle" | "loading" | "succeeded" | "failed";
    addMessageToConversation: "idle" | "loading" | "succeeded" | "failed";
    markConversationAsRead: "idle" | "loading" | "succeeded" | "failed";
    loadMessages: "idle" | "loading" | "succeeded" | "failed";
  };
  error: {
    fetchConversations: string | null;
    fetchConversation: string | null;
    checkConversation: string | null;
    createConversation: string | null;
    addMessageToConversation: string | null;
    markConversationAsRead: string | null;
    loadMessages: string | null;
  };
}
const initialState: IMessagingState = {
  conversation: null,
  conversations: [],
  checkConversation: null,
  recipient: null,
  messages: {
    content: [],
    currentSize: 0,
    hasMore: false,
  },
  status: {
    fetchConversations: "idle",
    fetchConversation: "idle",
    checkConversation: "idle",
    createConversation: "idle",
    addMessageToConversation: "idle",
    markConversationAsRead: "idle",
    loadMessages: "idle",
  },
  error: {
    fetchConversations: null,
    fetchConversation: null,
    checkConversation: null,
    createConversation: null,
    addMessageToConversation: null,
    markConversationAsRead: null,
    loadMessages: null,
  },
};

export const fetchConversations = createAsyncThunk<IConversationDto[]>(
  "messaging/fetchConversations",
  async (_, { rejectWithValue }) => {
    try {
      const data = await handleAPI<IConversationDto[]>({
        endpoint: "/messaging/conversations",
        isAuth: true,
      });
      return data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);
export const fetchConversation = createAsyncThunk<IConversationDetailsDto, string>(
  "messaging/fetchConversation",
  async (conversationId, { rejectWithValue }) => {
    try {
      const data = await handleAPI<IConversationDetailsDto>({
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

export const createConversation = createAsyncThunk<IConversationDto, IMessageDto>(
  "messaging/createConversation",
  async (messageDto, { rejectWithValue }) => {
    try {
      const data = await handleAPI<IConversationDto>({
        endpoint: "/messaging/conversations",
        method: "post",
        isAuth: true,
        body: messageDto,
      });
      return data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const addMessageToConversation = createAsyncThunk<IMessage, { conversationId: string; message: IMessageDto }>(
  "messaging/addMessageToConversation",
  async ({ conversationId, message }, { rejectWithValue }) => {
    try {
      const data = await handleAPI<IMessage>({
        endpoint: `/messaging/conversations/${conversationId}/message`,
        method: "post",
        isAuth: true,
        body: message,
      });
      return data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const markConversationAsRead = createAsyncThunk<void, string>(
  "messaging/markConversationAsRead",
  async (conversationId, { rejectWithValue }) => {
    try {
      await handleAPI<void>({
        endpoint: `/messaging/conversations/${conversationId}/mark-as-read`,
        method: "put",
        isAuth: true,
      });
      return;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const loadMoreMessages = createAsyncThunk<IPageableDto<IMessage>, { conversationId: string; limit: number; beforeTime: string | null, isLoadMore: boolean }>(
  "messaging/loadMoreMessages",
  async ({ conversationId, limit, beforeTime, isLoadMore }, { rejectWithValue }) => {
    try {
      const data = await handleAPI<IPageableDto<IMessage>>({
        endpoint: `/messaging/conversations/${conversationId}/messages`,
        isAuth: true,
        params: { limit: String(limit), beforeTime },
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
    resetMessages : (state) => {
      state.messages = {
        content: [],
        currentSize: 0,
        hasMore: false,
      };
      state.status.loadMessages = "idle";
    },
    setConversations: (state, action: PayloadAction<{ conversation: IConversationDto, authId: number }>) => {
      const c = action.payload.conversation;
      const index = state.conversations.findIndex(conv => conv.conversationId === c.conversationId);
      if (index !== -1) {
        const oldC = state.conversations[index];
        state.conversations.splice(index, 1); // Xóa cuộc trò chuyện cũ
        if (c.lastMessageSenderId !== Number(action.payload.authId)) {
          c.unreadCount = (oldC.unreadCount || 0) + 1; // Tăng số lượng tin nhắn chưa đọc nếu người gửi không phải là người dùng hiện tại
        }else{
          c.unreadCount = 0; // Nếu người gửi là người dùng hiện tại, không tăng số lượng tin nhắn chưa đọc
        }
        state.conversations.unshift(c); // Thêm cuộc trò chuyện mới vào đầu danh sách
      }else{
        if (c.lastMessageSenderId !== Number(action.payload.authId)) {
          c.unreadCount = 1; // Tăng số lượng tin nhắn chưa đọc nếu người gửi không phải là người dùng hiện tại
        }else{
          c.unreadCount = 0; // Nếu người gửi là người dùng hiện tại, không tăng số lượng tin nhắn chưa đọc
        }
        state.conversations.unshift(c);
      }
    },
    setMessages: (state, action: PayloadAction<{newMessage: IMessage, authId: number}>) => {
      const message = action.payload.newMessage;
      state.messages.content = [message, ...state.messages.content];
    },
    updateConversationParticipant: (state, action: PayloadAction<{ conversationId: string; participant: IConversationParticipant, authId: number }>) => {
      const { conversationId, participant } = action.payload;
      const index = state.conversation?.participants.findIndex(p => p.id === participant.id);
      if ( index != -1 && index !== undefined) {
        state.conversation!.participants[index] = participant; // Cập nhật thông tin người tham gia
        console.log("Updated participant:", participant);
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchConversations.pending, (state) => {
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
      })

      .addCase(createConversation.pending, (state) => {
        state.status.createConversation = "loading";
        state.error.createConversation = null;
      })
      .addCase(createConversation.fulfilled, (state, action) => {
        state.status.createConversation = "succeeded";
        // Bỏ vì đã có web socket cập nhật
        // const newConv = action.payload;
        // state.conversations = [newConv, ...state.conversations];
      })
      .addCase(createConversation.rejected, (state, action) => {
        state.status.createConversation = "failed";
        state.error.createConversation = action.payload as string;
      })
      .addCase(addMessageToConversation.pending, (state) => {
        state.status.addMessageToConversation = "loading";
        state.error.addMessageToConversation = null;
      })
      .addCase(addMessageToConversation.fulfilled, (state, action) => {
        state.status.addMessageToConversation = "succeeded";
        // Bỏ vì đã có web socket cập nhật
        // const message = action.payload;
        // state.messages.content = [message, ...state.messages.content];
        // const conversationId = action.meta.arg.conversationId;
        // const index = state.conversations.findIndex(conv => conv.conversationId === Number(conversationId));
        // if (index !== -1) {
        //   const updatedConversation = state.conversations[index];
        //   state.conversations.splice(index, 1);
        //   updatedConversation.lastMessageId = message.id;
        //   updatedConversation.lastMessageContent = message.content;
        //   updatedConversation.lastMessageCreatedAt = message.createdAt;
        //   updatedConversation.unreadCount = 0; // Reset unread count when a new message is added
        //   state.conversations.unshift(updatedConversation);
        // }
      })
      .addCase(addMessageToConversation.rejected, (state, action) => {
        state.status.addMessageToConversation = "failed";
        state.error.addMessageToConversation = action.payload as string;
      }).addCase(markConversationAsRead.pending, (state) => {
        state.status.markConversationAsRead = "loading";
        state.error.markConversationAsRead = null;
      })
      .addCase(markConversationAsRead.fulfilled, (state, action) => {
        state.status.markConversationAsRead = "succeeded";
        // Bỏ vì đã có web socket cập nhật
        // const conversationId = action.meta.arg;
        // const index = state.conversations.findIndex(conv => conv.conversationId === Number(conversationId));
        // if (index !== -1) {
        //   const updatedConversation = state.conversations[index];
        //   updatedConversation.unreadCount = 0;
        //   state.conversations[index] = updatedConversation;
        // }
      })
      .addCase(markConversationAsRead.rejected, (state, action) => {
        state.status.markConversationAsRead = "failed";
        state.error.markConversationAsRead = action.payload as string;
      }).addCase(loadMoreMessages.pending, (state) => {
        state.status.loadMessages = "loading";
      })
      .addCase(loadMoreMessages.fulfilled, (state, action) => {
        state.status.loadMessages = "succeeded";
        const page = action.payload;
        if (action.meta.arg.isLoadMore) {
          state.messages.content = [...state.messages.content, ...page.content];
        }
        else {
          state.messages.content = page.content;
        }
        state.messages.currentSize = page.currentSize;
        state.messages.hasMore = page.hasMore;
      })
      .addCase(loadMoreMessages.rejected, (state, action) => {
        state.status.loadMessages = "failed";
        state.error.loadMessages = action.payload as string;
      });}
});

export const { setRecipient, resetMessages, setConversations, setMessages, updateConversationParticipant } = messagingSlice.actions;
export default messagingSlice.reducer;