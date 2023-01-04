import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchUser } from "../../apis/users";

export const fetchCurrentUser = createAsyncThunk("users/loadUser", async () => {
  try {
    const response = await fetchUser();

    return response;
  } catch (err) {
    throw err;
  }
});

const usersSlice = createSlice({
  name: "users",
  initialState: {
    currentUser: {},
    isLoggedIn: false,
    loadingUser: false,
    failedToFetchUser: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loadingUser = true;
        state.failedToFetchUser = false;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loadingUser = false;
        state.failedToFetchUser = false;
        state.currentUser = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.loadingUser = false;
        state.failedToFetchUser = true;
      });
  },
});

export const selectCurrentUser = (state) => state.users.currentUser;
export const selectLoadingUser = (state) => state.users.loadingUser;
export const selectFailedToFetchUser = (state) => state.users.failedToFetchUser;

export default usersSlice.reducer;
