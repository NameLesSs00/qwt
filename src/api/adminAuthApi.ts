import { adminAxiosClient } from './axiosClient';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  role: string;
}

// ── Auth API functions ────────────────────────────────────────────────────────

/**
 * POST /api/Auth/login
 * Returns accessToken, refreshToken, and role.
 */
export async function loginAdmin(
  email: string,
  password: string
): Promise<LoginResponse> {
  const { data } = await adminAxiosClient.post('/Auth/login', { email, password });
  // Response shape: { success, message, data: { accessToken, refreshToken, role } }
  return data.data as LoginResponse;
}

/**
 * POST /api/Auth/logout
 * Server invalidates the refresh token.
 */
export async function logoutAdmin(refreshToken: string): Promise<void> {
  await adminAxiosClient.post('/Auth/logout', { refreshToken });
}

/**
 * POST /api/Auth/refresh
 * Returns a new access token (refresh token unchanged).
 */
export async function refreshAccessToken(refreshToken: string): Promise<string> {
  const { data } = await adminAxiosClient.post('/Auth/refresh', { refreshToken });
  // Response shape: { success, data: { accesstoken } }  ← note lowercase 't' in spec
  return data?.data?.accesstoken ?? data?.data?.accessToken;
}

/**
 * POST /api/Auth/forgot-password
 * Triggers a password-reset email.
 */
export async function forgotPassword(email: string): Promise<void> {
  await adminAxiosClient.post('/Auth/forgot-password', { email });
}

/**
 * POST /api/Auth/reset-password
 * Resets the password using the emailed token.
 */
export async function resetPassword(
  token: string,
  newPassword: string
): Promise<void> {
  await adminAxiosClient.post('/Auth/reset-password', { token, newPassword });
}

/**
 * PUT /api/Auth/updatepassword/{adminid}
 * Changes password for a logged-in admin.
 */
export async function changePassword(
  adminId: number,
  oldPassword: string,
  newPassword: string
): Promise<void> {
  await adminAxiosClient.put(`/Auth/updatepassword/${adminId}`, {
    oldPassword,
    newPassword,
  });
}
