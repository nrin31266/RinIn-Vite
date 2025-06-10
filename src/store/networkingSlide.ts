import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { IUser } from "./authSlice";
import { extractErrorMessage } from "./utils";
import handleAPI from "../cfgs/handleAPI";

export interface IConnection {
  id: number;
  author: IUser;
  recipient: IUser;
  status: "PENDING" | "ACCEPTED";
  seen: boolean;
  connectionDate: string;
}

interface INetworkingState {
  suggestions: IUser[];
  connections: IConnection[];
  invitations: IConnection[];
  status: {
    fetchSuggestions: "idle" | "loading" | "succeeded" | "failed";
    fetchConnections: "idle" | "loading" | "succeeded" | "failed";
    fetchInvitations: "idle" | "loading" | "succeeded" | "failed";
    sendInvitation: "idle" | "loading" | "succeeded" | "failed";
    acceptInvitation: "idle" | "loading" | "succeeded" | "failed";
    rejectOrCancelInvitation: "idle" | "loading" | "succeeded" | "failed";
  };
  error: {
    fetchSuggestions: string | null;
    fetchConnections: string | null;
    fetchInvitations: string | null;
    sendInvitation: string | null;
    acceptInvitation: string | null;
    rejectOrCancelInvitation: string | null;
  };
}
const initialState: INetworkingState = {
  suggestions: [],
  connections: [],
  invitations: [],
  status: {
    fetchSuggestions: "idle",
    fetchConnections: "idle",
    fetchInvitations: "idle",
    sendInvitation: "idle",
    acceptInvitation: "idle",
    rejectOrCancelInvitation: "idle",
  },
  error: {
    fetchSuggestions: null,
    fetchConnections: null,
    fetchInvitations: null,
    sendInvitation: null,
    acceptInvitation: null,
    rejectOrCancelInvitation: null,
  },
};

export const fetchSuggestions = createAsyncThunk<IUser[]>(
  "networking/fetchSuggestions",
  async (_, { rejectWithValue }) => {
    try {
      const data = await handleAPI<IUser[]>({
        endpoint: "/networking/connections/suggestions",
        isAuth: true,
      });
      return data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const fetchConnections = createAsyncThunk<IConnection[]>(
  "networking/fetchConnections",
  async (_, { rejectWithValue }) => {
    try {
      const data = await handleAPI<IConnection[]>({
        endpoint: "/networking/connections?status=ACCEPTED",
        isAuth: true,
      });
      return data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);
export const fetchInvitations = createAsyncThunk<IConnection[]>(
  "networking/fetchInvitations",
  async (_, { rejectWithValue }) => {
    try {
      const data = await handleAPI<IConnection[]>({
        endpoint: "/networking/connections?status=PENDING",
        isAuth: true,
      });
      return data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);
export const sendInvitation = createAsyncThunk<
  IConnection,
  { recipientId: string }
>("networking/sendInvitation", async ({ recipientId }, { rejectWithValue }) => {
  try {
    const data = await handleAPI<IConnection>({
      endpoint: "/networking/connections?recipientId=" + recipientId,
      method: "post",
      isAuth: true,
    });
    return data;
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});
export const acceptInvitation = createAsyncThunk<IConnection, { id: number }>(
  "networking/acceptInvitation",
  async ({ id }, { rejectWithValue }) => {
    try {
      const data = await handleAPI<IConnection>({
        endpoint: `/networking/connections/${id}/accept`,
        method: "put",
        isAuth: true,
      });
      return data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);
export const rejectOrCancelInvitation = createAsyncThunk<
  IConnection,
  { id: number; action?: "REJECTED" | "CANCELED" | "DISCONNECTED" }
>(
  "networking/rejectOrCancelInvitation",
  async ({ id, action }, { rejectWithValue }) => {
    try {
      const data = await handleAPI<IConnection>({
        endpoint: `/networking/connections/${id}/reject`,
        method: "put",
        isAuth: true,
      });
      return data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);
const networkingSlice = createSlice({
  name: "networking",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSuggestions.pending, (state) => {
        state.status.fetchSuggestions = "loading";
      })
      .addCase(fetchSuggestions.fulfilled, (state, action) => {
        state.status.fetchSuggestions = "succeeded";
        state.suggestions = action.payload;
      })
      .addCase(fetchSuggestions.rejected, (state, action) => {
        state.status.fetchSuggestions = "failed";
        state.error.fetchSuggestions = action.payload as string;
      })
      .addCase(fetchConnections.pending, (state) => {
        state.status.fetchConnections = "loading";
      })
      .addCase(fetchConnections.fulfilled, (state, action) => {
        state.status.fetchConnections = "succeeded";
        state.connections = action.payload;
      })
      .addCase(fetchConnections.rejected, (state, action) => {
        state.status.fetchConnections = "failed";
        state.error.fetchConnections = action.payload as string;
      })
      .addCase(fetchInvitations.pending, (state) => {
        state.status.fetchInvitations = "loading";
      })
      .addCase(fetchInvitations.fulfilled, (state, action) => {
        state.status.fetchInvitations = "succeeded";
        state.invitations = action.payload;
      })
      .addCase(fetchInvitations.rejected, (state, action) => {
        state.status.fetchInvitations = "failed";
        state.error.fetchInvitations = action.payload as string;
      })
      .addCase(sendInvitation.pending, (state) => {
        state.status.sendInvitation = "loading";
      })
      .addCase(sendInvitation.fulfilled, (state, action) => {
        state.status.sendInvitation = "succeeded";
        state.invitations.push(action.payload);

        const index = state.suggestions.findIndex(
          (user) => user.id === action.payload.recipient.id
        );
        if (index !== -1) {
          state.suggestions.splice(index, 1);
        }
      })
      .addCase(sendInvitation.rejected, (state, action) => {
        state.status.sendInvitation = "failed";
        state.error.sendInvitation = action.payload as string;
      })
      .addCase(acceptInvitation.pending, (state) => {
        state.status.acceptInvitation = "loading";
      })
      .addCase(acceptInvitation.fulfilled, (state, action) => {
        state.status.acceptInvitation = "succeeded";
        const index = state.invitations.findIndex(
          (invitation) => invitation.id === action.payload.id
        );
        if (index !== -1) {
          state.invitations.splice(index, 1);
        }
        state.connections.push(action.payload);
      })
      .addCase(acceptInvitation.rejected, (state, action) => {
        state.status.acceptInvitation = "failed";
        state.error.acceptInvitation = action.payload as string;
      })
      .addCase(rejectOrCancelInvitation.pending, (state) => {
        state.status.rejectOrCancelInvitation = "loading";
      })
      .addCase(rejectOrCancelInvitation.fulfilled, (state, action) => {
        state.status.rejectOrCancelInvitation = "succeeded";
        if (action.meta.arg.action === "DISCONNECTED") {
          const index = state.connections.findIndex(
            (connection) => connection.id === action.payload.id
          );
          if (index !== -1) {
            state.connections.splice(index, 1);
          }
        } else {
          const index = state.invitations.findIndex(
            (invitation) => invitation.id === action.payload.id
          );
          if (index !== -1) {
            state.invitations.splice(index, 1);
          }
        }
      })
      .addCase(rejectOrCancelInvitation.rejected, (state, action) => {
        state.status.rejectOrCancelInvitation = "failed";
        state.error.rejectOrCancelInvitation = action.payload as string;
      });
  },
});

export default networkingSlice.reducer;
