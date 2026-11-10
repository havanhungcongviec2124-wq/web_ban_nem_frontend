import { createSlice } from '@reduxjs/toolkit';
import { loginUser, registerUser, getMe, fetchUsers } from './AuthApi';

// Khôi phục user từ localStorage
const savedUser = (() => {
  try {
    const s = localStorage.getItem('nep_current_user');
    return s ? JSON.parse(s) : null;
  } catch {
    return null;
  }
})();

const savedToken = localStorage.getItem('nep_token') || null;

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: savedUser,
    token: savedToken,
    isAuthenticated: !!savedUser,
    isAdmin: savedUser?.role === 'admin',
    isLoading: false,
    error: null,
    users: [], // danh sách users cho Admin
    usersLoading: false,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isAdmin = false;
      state.error = null;
      localStorage.removeItem('nep_current_user');
      localStorage.removeItem('nep_token');
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.isAdmin = action.payload.user?.role === 'admin';
        state.error = null;
        localStorage.setItem('nep_current_user', JSON.stringify(action.payload.user));
        localStorage.setItem('nep_token', action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Đăng nhập thất bại';
      });

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.isAdmin = action.payload.user?.role === 'admin';
        state.error = null;
        localStorage.setItem('nep_current_user', JSON.stringify(action.payload.user));
        localStorage.setItem('nep_token', action.payload.token);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Đăng ký thất bại';
      });

    // GetMe
    builder
      .addCase(getMe.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.isAdmin = action.payload.user?.role === 'admin';
        localStorage.setItem('nep_current_user', JSON.stringify(action.payload.user));
      })
      .addCase(getMe.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isAdmin = false;
        localStorage.removeItem('nep_current_user');
        localStorage.removeItem('nep_token');
      });

    // Fetch Users (Admin)
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.usersLoading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.usersLoading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state) => {
        state.usersLoading = false;
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;

