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

// ── Response wrappers & Raw Backend Schemas ───────────────────────────────────

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

// Raw Swagger-matching backend schemas
interface RawBlogSectionRead {
  id: number;
  sectionNumber: number;
  title: string | null;
  content: string | null;
  imageUrl: string | null;
  blogId: number;
}

interface RawBlogRead {
  id: number;
  title: string | null;
  content: string | null;
  imageUrl: string | null;
  blogSections: RawBlogSectionRead[];
}

interface RawBlogsListResponse {
  success: boolean;
  message: string | null;
  data: RawBlogRead[];
}

interface RawSingleBlogResponse {
  success: boolean;
  message: string | null;
  data: RawBlogRead;
}

// Mapping function: Raw backend model to frontend DTO
function mapRawToDtoBlogRead(raw: RawBlogRead): DtoBlogRead {
  if (!raw) return {} as DtoBlogRead;
  return {
    id: raw.id,
    title: raw.title || '',
    description: raw.content || '',
    imageUrl: raw.imageUrl || null,
    createdAt: null,
    sections: (raw.blogSections || []).map(s => ({
      id: s.id,
      title: s.title || '',
      content: s.content || '',
      imageUrl: s.imageUrl || null
    }))
  };
}

// ── API Functions ─────────────────────────────────────────────────────────────

/** Public: list all blogs */
export async function getBlogs(
  pageNumber = 1,
  pageSize = 100
): Promise<BlogsListResponse> {
  const response = await axiosClient.get<RawBlogsListResponse>('/Blogs', {
    params: { PageNumber: pageNumber, PageSize: pageSize },
  });
  return {
    success: response.data.success,
    message: response.data.message,
    data: (response.data.data || []).map(mapRawToDtoBlogRead)
  };
}

/** Public: get single blog by ID */
export async function getBlogById(id: number): Promise<SingleBlogResponse> {
  const response = await axiosClient.get<RawSingleBlogResponse>(`/Blogs/${id}`);
  return {
    success: response.data.success,
    message: response.data.message,
    data: mapRawToDtoBlogRead(response.data.data)
  };
}

/** Admin: create a new blog */
export async function createBlog(payload: DtoBlogCreate): Promise<SingleBlogResponse> {
  const backendPayload = {
    title: payload.title,
    content: payload.description,
    blogSections: (payload.sections || []).map((s, index) => ({
      sectionNumber: index + 1,
      title: s.title,
      content: s.content
    }))
  };
  const response = await adminAxiosClient.post<RawSingleBlogResponse>('/Blogs', backendPayload);
  return {
    success: response.data.success,
    message: response.data.message,
    data: mapRawToDtoBlogRead(response.data.data)
  };
}

/** Admin: update an existing blog */
export async function updateBlog(
  id: number,
  payload: DtoBlogUpdate
): Promise<SingleBlogResponse> {
  const backendPayload = {
    id: payload.id,
    title: payload.title,
    content: payload.description,
    blogSections: (payload.sections || []).map((s, index) => ({
      id: s.id || 0,
      sectionNumber: index + 1,
      title: s.title,
      content: s.content
    }))
  };
  const response = await adminAxiosClient.put<RawSingleBlogResponse>(`/Blogs/${id}`, backendPayload);
  return {
    success: response.data.success,
    message: response.data.message,
    data: mapRawToDtoBlogRead(response.data.data)
  };
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
