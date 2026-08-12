import { axiosClient, adminAxiosClient } from './axiosClient';

export interface DtoProjectReviewCreate {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  comment: string;
  rate: number;
}

export interface DtoProjectReviewRead {
  id: number;
  comment: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  rate: number | null;
  createdAt: string | null;
}

export interface ProjectReviewsListResponse {
  success: boolean;
  message: string | null;
  data: DtoProjectReviewRead[];
}

export interface ProjectReviewSingleResponse {
  success: boolean;
  message: string | null;
  data: DtoProjectReviewRead;
}

export interface ProjectReviewDeleteResponse {
  success: boolean;
  message: string | null;
  data: string | null;
}

export async function getProjectReviews(
  pageNumber = 1,
  pageSize = 20
): Promise<ProjectReviewsListResponse> {
  const response = await axiosClient.get<ProjectReviewsListResponse>('/ReviewsProject', {
    params: { pageNumber, pageSize },
  });
  return response.data;
}

export async function createProjectReview(
  payload: DtoProjectReviewCreate
): Promise<ProjectReviewSingleResponse> {
  const response = await axiosClient.post<ProjectReviewSingleResponse>('/ReviewsProject', payload);
  return response.data;
}

export async function getProjectReviewById(id: number): Promise<ProjectReviewSingleResponse> {
  const response = await axiosClient.get<ProjectReviewSingleResponse>(`/ReviewsProject/${id}`);
  return response.data;
}

export async function deleteProjectReview(id: number): Promise<ProjectReviewDeleteResponse> {
  const response = await adminAxiosClient.delete<ProjectReviewDeleteResponse>(`/ReviewsProject/${id}`);
  return response.data;
}
