import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { extractErrorMessage } from "./utils";
import handleAPI from "../cfgs/handleAPI";

export interface OnlineUserDto{
  id: number;
  isOnline: boolean;
  lastOnline: string | null;
}

export const fetchOnlineUsersByIds = createAsyncThunk<OnlineUserDto[], number[]>(
  "onlineStatus/fetchOnlineUsersByIds",
  async (userIds: number[], { rejectWithValue }) => {
    try {
      const data = await handleAPI<OnlineUserDto[]>({
        method: "post",
        endpoint: "/online-users/by-ids",
        body: userIds,
        isAuth: true,
      });
      return data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

interface OnlineStatusState {
  [userId: string]: OnlineUserDto;
}

const initialState: OnlineStatusState = {};
const onlineStatusSlice = createSlice({
  name: "onlineStatus",
  initialState,
  reducers: {
    updateOnlineStatus(
      state,
      action: PayloadAction<OnlineUserDto>
    ) {
      state[action.payload.id] = action.payload;
    },
    resetOnlineStatus() {
      return {};
    },
    setOnlineStatus(
      state,
      action: PayloadAction<OnlineUserDto[]>
    ) {
      console.log("Setting online status for users:", action.payload);
      action.payload.forEach((online) => {
        state[online.id] = online;
      });
    },
  },
});
export const { updateOnlineStatus, resetOnlineStatus, setOnlineStatus } =
  onlineStatusSlice.actions;
export default onlineStatusSlice.reducer;
