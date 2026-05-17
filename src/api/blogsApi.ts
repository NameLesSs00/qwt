import { axiosClient, adminAxiosClient } from './axiosClient';

// ── Image URL helper (same pattern as trips) ──────────────────────────────────
const HOST = 'https://travelapi.runasp.net';
export function getBlogImageUrl(relativeUrl: string | null | undefined): string {
  if (!relativeUrl) return '';
  if (relativeUrl.startsWith('http')) return relativeUrl;
  return `${HOST}/${relativeUrl.replace(/^\//, '')}`;
}

// ── DTOs ──────────────────────────────────────────────────────────────────────

export interface DtoBlogSection {
  id: number;
  title: string | null;
  content: string | null;
  imageUrl: string | null;
}

export interface DtoBlogRead {
  id: number;
  title: string | null;
  description: string | null;
  imageUrl: string | null;
  createdAt: string | null;
  sections: DtoBlogSection[];
}

export interface DtoBlogSectionCreate {
  title: string;
  content: string;
}

export interface DtoBlogCreate {
  id: number;
  title: string;
  description: string;
  sections: DtoBlogSectionCreate[];
}

export interface DtoBlogSectionUpdate {
  id?: number;
  title: string;
  content: string;
}

export interface DtoBlogUpdate {
  id: number;
  title: string;
  description: string;
  sections: DtoBlogSectionUpdate[];
}

// ── Response wrappers ─────────────────────────────────────────────────────────

export interface BlogsListResponse {
  success: boolean;
  message: string | null;
  data: DtoBlogRead[];
}

export interface SingleBlogResponse {
  success: boolean;
  message: string | null;
  data: DtoBlogRead;
}

export interface StringResponse {
  success: boolean;
  message: string | null;
  data: string | null;
}

// ── API Functions ─────────────────────────────────────────────────────────────

/** Public: list all blogs */
export async function getBlogs(
  pageNumber = 1,
  pageSize = 100
): Promise<BlogsListResponse> {
  const response = await axiosClient.get<BlogsListResponse>('/Blogs', {
    params: { PageNumber: pageNumber, PageSize: pageSize },
  });
  return response.data;
}

/** Public: get single blog by ID */
export async function getBlogById(id: number): Promise<SingleBlogResponse> {
  const response = await axiosClient.get<SingleBlogResponse>(`/Blogs/${id}`);
  return response.data;
}

/** Admin: create a new blog */
export async function createBlog(payload: DtoBlogCreate): Promise<SingleBlogResponse> {
  const response = await adminAxiosClient.post<SingleBlogResponse>('/Blogs', payload);
  return response.data;
}

/** Admin: update an existing blog */
export async function updateBlog(
  id: number,
  payload: DtoBlogUpdate
): Promise<SingleBlogResponse> {
  const response = await adminAxiosClient.put<SingleBlogResponse>(`/Blogs/${id}`, payload);
  return response.data;
}

/** Admin: delete a blog */
export async function deleteBlog(id: number): Promise<StringResponse> {
  const response = await adminAxiosClient.delete<StringResponse>(`/Blogs/${id}`);
  return response.data;
}

/** Admin: upload blog cover image */
export async function uploadBlogCoverImage(
  blogId: number,
  file: File
): Promise<StringResponse> {
  const formData = new FormData();
  formData.append('file', file);
  const response = await adminAxiosClient.post<StringResponse>(
    `/Blogs/image`,
    formData,
    {
      params: { blogid: blogId },
      headers: { 'Content-Type': 'multipart/form-data' },
    }
  );
  return response.data;
}

/** Admin: upload a section image */
export async function uploadBlogSectionImage(
  blogId: number,
  sectionId: number,
  file: File
): Promise<StringResponse> {
  const formData = new FormData();
  formData.append('file', file);
  const response = await adminAxiosClient.post<StringResponse>(
    `/Blogs/section/image`,
    formData,
    {
      params: { blogid: blogId, sectionid: sectionId },
      headers: { 'Content-Type': 'multipart/form-data' },
    }
  );
  return response.data;
}

/** Admin: delete blog cover image */
export async function deleteBlogCoverImage(blogId: number): Promise<StringResponse> {
  const response = await adminAxiosClient.delete<StringResponse>(`/Blogs/${blogId}/image`);
  return response.data;
}

/** Admin: delete a section image */
export async function deleteBlogSectionImage(sectionId: number): Promise<StringResponse> {
  const response = await adminAxiosClient.delete<StringResponse>(
    `/Blogs/section/${sectionId}/image`
  );
  return response.data;
}
