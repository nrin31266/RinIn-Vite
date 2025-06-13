import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import handleAPI from "../cfgs/handleAPI";
import { extractErrorMessage } from "./utils";
import { updateUserProfile } from "./userProfile";

export interface IUser {
  id: number;
  email: string;
  emailVerified: boolean;
  firstName?: string;
  lastName?: string;
  company?: string;
  position?: string;
  location?: string;
  profileComplete: boolean;
  profilePicture?: string;
}

export interface ILoginRes {
  token: "string";
  message: "string";
}

export interface IPasswordResetRequest {
  email: string;
  newPassword: string;
  token: string;
}

interface AuthState {
  user: IUser | null;
  sentEmailVerification: boolean;
  sentResetPassword: boolean;

  // trạng thái per-thunk
  status: {
    fetchUser: "idle" | "loading" | "succeeded" | "failed";
    login: "idle" | "loading" | "succeeded" | "failed";
    register: "idle" | "loading" | "succeeded" | "failed";
    sendEmailVerification: "idle" | "loading" | "succeeded" | "failed";
    verifyEmail: "idle" | "loading" | "succeeded" | "failed";
    sendResetPassword: "idle" | "loading" | "succeeded" | "failed";
    resetPassword: "idle" | "loading" | "succeeded" | "failed";
  };
  // error message per-thunk
  error: {
    fetchUser: string | null;
    login: string | null;
    register: string | null;
    sendEmailVerification: string | null;
    verifyEmail: string | null;
    sendResetPassword: string | null;
    resetPassword: string | null;
  };
}

const initialState: AuthState = {
  user: null,
  sentEmailVerification: false,
  sentResetPassword: false,
  status: {
    fetchUser: "idle",
    login: "idle",
    register: "idle",
    sendEmailVerification: "idle",
    verifyEmail: "idle",
    sendResetPassword: "idle",
    resetPassword: "idle",
  },
  error: {
    fetchUser: null,
    login: null,
    register: null,
    sendEmailVerification: null,
    verifyEmail: null,
    sendResetPassword: null,
    resetPassword: null,
  },
};

export const fetchUser = createAsyncThunk<IUser>(
  "auth/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const data = await handleAPI<IUser>({
        endpoint: "/authentication/user",
        isAuth: true,
      });
      return data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const login = createAsyncThunk<
  ILoginRes,
  { email: string; password: string }
>("auth/login", async ({ email, password }, { rejectWithValue }) => {
  try {
    const data = await handleAPI<ILoginRes>({
      endpoint: "/authentication/login",
      body: { email, password },
      method: "post",
    });
    return data;
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const register = createAsyncThunk<
  ILoginRes,
  { email: string; password: string }
>("auth/register", async ({ email, password }, { rejectWithValue }) => {
  try {
    const data = await handleAPI<ILoginRes>({
      endpoint: "/authentication/register",
      body: { email, password },
      method: "post",
    });
    return data;
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});
export const sendEmailVerification = createAsyncThunk<void, void>(
  "auth/sendEmailVerification",
  async (_, { rejectWithValue }) => {
    try {
      await handleAPI<void>({
        endpoint: "/authentication/send-email-verification-token",
        method: "put",
        isAuth: true,
      });
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);
export const verifyEmail = createAsyncThunk<void, { token: string }>(
  "auth/verifyEmail",
  async ({ token }, { rejectWithValue }) => {
    try {
      await handleAPI<void>({
        endpoint: `/authentication/validate-email-verification-token?token=${token}`,
        method: "put",
        isAuth: true,
      });
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);
export const sendResetPassword = createAsyncThunk<void, { email: string }>(
  "auth/sendResetPassword",
  async ({ email }, { rejectWithValue }) => {
    try {
      await handleAPI<void>({
        endpoint: `/authentication/send-password-reset-token?email=${email}`,
        method: "put",
      });
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);
export const resetPassword = createAsyncThunk<void, IPasswordResetRequest>(
  "auth/resetPassword",
  async (rq, { rejectWithValue }) => {
    try {
      await handleAPI<void>({
        endpoint: `/authentication/reset-password`,
        method: "put",
        body: rq,
      });
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.clear();
    },
    setUser: (state, action : PayloadAction<IUser>) => {
      state.user = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.status.fetchUser = "loading";
        state.error.fetchUser = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status.fetchUser = "succeeded";
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status.fetchUser = "failed";
        state.error.fetchUser = action.payload as string;
      })
      .addCase(login.pending, (state) => {
        state.status.login = "loading";
        state.error.login = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status.login = "succeeded";
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.status.login = "failed";
        state.error.login = action.payload as string;
      })
      .addCase(register.pending, (state) => {
        state.status.register = "loading";
        state.error.register = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status.register = "succeeded";
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(register.rejected, (state, action) => {
        state.status.register = "failed";
        state.error.register = action.payload as string;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(sendEmailVerification.pending, (state) => {
        state.status.sendEmailVerification = "loading";
        state.error.sendEmailVerification = null;
        state.error.verifyEmail = null;
      })
      .addCase(sendEmailVerification.fulfilled, (state) => {
        state.status.sendEmailVerification = "succeeded";
      })
      .addCase(sendEmailVerification.rejected, (state, action) => {
        state.status.sendEmailVerification = "failed";
        state.error.sendEmailVerification = action.payload as string;
      })
      .addCase(verifyEmail.pending, (state) => {
        state.status.verifyEmail = "loading";
      })
      .addCase(verifyEmail.fulfilled, (state) => {
        state.user!.emailVerified = true; // Assuming user is always defined here
        state.status.verifyEmail = "succeeded";
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.status.verifyEmail = "failed";
        state.error.verifyEmail = action.payload as string;
      })
      .addCase(sendResetPassword.pending, (state) => {
        state.status.sendResetPassword = "loading";
      })
      .addCase(sendResetPassword.fulfilled, (state) => {
        state.status.sendResetPassword = "succeeded";
      })
      .addCase(sendResetPassword.rejected, (state, action) => {
        state.status.sendResetPassword = "failed";
        state.error.sendResetPassword = action.payload as string;
      })
      .addCase(resetPassword.pending, (state) => {
        state.status.resetPassword = "loading";
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.status.resetPassword = "succeeded";
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.status.resetPassword = "failed";
        state.error.resetPassword = action.payload as string;
      });
  },
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;
