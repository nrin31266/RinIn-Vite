import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import handleAPI from "../cfgs/handleAPI";
import type { IUser } from "./authSlice";
import { extractErrorMessage } from "./utils";

export interface IUpdateUserProfileReq {
  firstName?: string;
  lastName?: string;
  company?: string;
  position?: string;
  location?: string;
}

interface IUserProfileState {
  state: {
    updateProfile: "idle" | "loading" | "succeeded" | "failed";
  };
  error: {
    updateProfile: string | null;
  };
}

const initialState: IUserProfileState = {
  state: {
    updateProfile: "idle",
  },
  error: {
    updateProfile: null,
  },
};

export const updateUserProfile = createAsyncThunk<
  IUser,
  { body: IUpdateUserProfileReq; id: string }
>(
  "userProfile/updateUserProfile",
  async ({ body, id }, { rejectWithValue }) => {
    try {
      const data = await handleAPI<IUser, IUpdateUserProfileReq>({
        endpoint: `/authentication/profile/${id}`,
        method: "put",
        body: body,
        isAuth: true,
      });
      return data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

const userProfileSlice = createSlice({
  name: "userProfile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.state.updateProfile = "loading";
        state.error.updateProfile = null;
      })
      .addCase(updateUserProfile.fulfilled, (state) => {
        state.state.updateProfile = "succeeded";
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.state.updateProfile = "failed";
        state.error.updateProfile = action.payload as string;
      });
  },
});

export default userProfileSlice.reducer;