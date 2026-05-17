import { adminAxiosClient } from './axiosClient';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface AdminDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phone: string;
  nationality: string;
  notes: string;
  createdAt: string;
}

export interface CreateAdminDto {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nationality: string;
  password: string;
  notes: string;
}

export interface UpdateAdminDto {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
}

// ── Admins CRUD API ───────────────────────────────────────────────────────────

/**
 * GET /api/Admins?PageNumber=&PageSize=
 */
export async function getAdmins(
  pageNumber = 1,
  pageSize = 10
): Promise<PaginatedResponse<AdminDto>> {
  const { data } = await adminAxiosClient.get('/Admins', {
    params: { PageNumber: pageNumber, PageSize: pageSize },
  });
  return data;
}

/**
 * GET /api/Admins/{id}
 */
export async function getAdminById(id: number): Promise<AdminDto> {
  const { data } = await adminAxiosClient.get(`/Admins/${id}`);
  return data.data;
}

/**
 * POST /api/Admins
 */
export async function createAdmin(dto: CreateAdminDto): Promise<void> {
  await adminAxiosClient.post('/Admins', dto);
}

/**
 * PUT /api/Admins
 */
export async function updateAdmin(dto: UpdateAdminDto): Promise<AdminDto> {
  const { data } = await adminAxiosClient.put('/Admins', dto);
  return data.data;
}

/**
 * DELETE /api/Admins/{id}
 */
export async function deleteAdmin(id: number): Promise<void> {
  await adminAxiosClient.delete(`/Admins/${id}`);
}
