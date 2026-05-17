import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string | null;
}

export interface AdminAuthState {
  adminToken: string | null;
  adminRefreshToken: string | null;
  isAdminAuthenticated: boolean;
  adminUser: AdminUser | null;
}

const initialState: AdminAuthState = {
  adminToken: localStorage.getItem('adminToken') || null,
  adminRefreshToken: localStorage.getItem('adminRefreshToken') || null,
  isAdminAuthenticated: !!localStorage.getItem('adminToken'),
  adminUser: null,
};

const adminAuthSlice = createSlice({
  name: 'adminAuth',
  initialState,
  reducers: {
    adminLogin: (
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string; user: AdminUser }>
    ) => {
      const { accessToken, refreshToken, user } = action.payload;
      state.adminToken = accessToken;
      state.adminRefreshToken = refreshToken;
      state.isAdminAuthenticated = true;
      state.adminUser = user;
      localStorage.setItem('adminToken', accessToken);
      localStorage.setItem('adminRefreshToken', refreshToken);
    },
    adminRefreshSuccess: (
      state,
      action: PayloadAction<{ accessToken: string }>
    ) => {
      state.adminToken = action.payload.accessToken;
      localStorage.setItem('adminToken', action.payload.accessToken);
    },
    adminLogout: (state) => {
      state.adminToken = null;
      state.adminRefreshToken = null;
      state.isAdminAuthenticated = false;
      state.adminUser = null;
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminRefreshToken');
    },
    adminUpdateUser: (state, action: PayloadAction<{ name: string }>) => {
      if (state.adminUser) {
        state.adminUser.name = action.payload.name;
      }
    },
  },
});

export const { adminLogin, adminRefreshSuccess, adminLogout, adminUpdateUser } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;
