import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchUser } from "../../apis/users";
import { login, register } from "../../apis/auth";

export const fetchCurrentUser = createAsyncThunk(
  "users/fetchCurrentUser",
  async () => {
    try {
      const response = await fetchUser();

      return response;
    } catch (err) {
      throw err;
    }
  }
);

export const loginUser = createAsyncThunk(
  "users/loginUser",
  async (credentials) => {
    try {
      const response = await login(credentials);
      return {
        user: response,
        isAuthenticated: true,
      };
    } catch (err) {
      throw err;
    }
  }
);

export const registerUser = createAsyncThunk(
  "users/registerUser",
  async (credentials) => {
    try {
      const response = await register(credentials);
      return response;
    } catch (err) {
      throw err;
    }
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState: {
    currentUser: {},
    loadingUser: false,
    failedToFetchUser: false,
    isAuthenticated: false,
    isLoggingIn: false,
    failedToLogin: false,
    isRegistering: false,
    failedToRegister: false,
    error: {},
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
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoggingIn = true;
        state.failedToLogin = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loadingUser = false;
        state.failedToFetchUser = false;
        state.currentUser = action.payload;
        state.isAuthenticated = action.payload.isAuthenticated;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loadingUser = false;
        state.failedToLogin = true;
        state.error = action.payload.error;
      })
      .addCase(registerUser.pending, (state) => {
        state.isRegistering = true;
        state.failedToRegister = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isRegistering = false;
        state.failedToRegister = false;
        state.currentUser = {
          id: action.payload.id,
          username: action.payload.username,
          password: action.payload.password,
          email: action.payload.email,
          isadmin: action.payload.isadmin,
        };
      });
  },
});

export const selectCurrentUser = (state) => state.users.currentUser;
export const selectLoadingUser = (state) => state.users.loadingUser;
export const selectFailedToFetchUser = (state) => state.users.failedToFetchUser;
export const selectError = (state) => state.users.error;

export default usersSlice.reducer;
