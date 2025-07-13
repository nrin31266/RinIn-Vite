import { createAsyncThunk } from "@reduxjs/toolkit";
import { extractErrorMessage } from "./utils";
import handleAPI from "../cfgs/handleAPI";

export const search = createAsyncThunk("search/fetch", async (term: string, {rejectWithValue}) => {
  try {
    const data = handleAPI({
        method: 'get',
        endpoint: '/search/users?query=' + term,
        isAuth: true,
    })
    return data;
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});