import { axiosClient, adminAxiosClient } from './axiosClient';

export interface DtoReviewCreate {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  tripId: number;
  comment: string;
  rate: number;
}

export interface DtoReviewRead {
  id: number;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  comment: string | null;
  rate: number | null;
  createdAt: string | null;
  tripName: string | null;
  description: string | null;
  markerID: string | null;
  destination: string | null;
  tripTypeName: string | null;
  adultPrice: number;
  childPrice: number;
  currencyName: string | null;
}

export interface DtoAverageReview {
  averageRate: number;
  totalReviews: number;
}

export interface ReviewListResponse {
  success: boolean;
  message: string | null;
  data: DtoReviewRead[];
}

export interface ReviewSingleResponse {
  success: boolean;
  message: string | null;
  data: DtoReviewRead;
}

export interface AverageReviewResponse {
  success: boolean;
  message: string | null;
  data: DtoAverageReview;
}

export interface StringResponse {
  success: boolean;
  message: string | null;
  data: string | null;
}

// Get reviews with pagination and filtering by TripId
export async function getReviews(
  pageNumber?: number,
  pageSize?: number,
  tripId?: number
): Promise<ReviewListResponse> {
  const res = await axiosClient.get<ReviewListResponse>('/Reviews', {
    params: {
      PageNumber: pageNumber,
      PageSize: pageSize,
      TripId: tripId,
    },
  });
  return res.data;
}

// Create a review
export async function createReview(data: DtoReviewCreate): Promise<ReviewSingleResponse> {
  const res = await axiosClient.post<ReviewSingleResponse>('/Reviews', data);
  return res.data;
}

// Get average reviews for a trip
export async function getTripAverageRating(tripId: number): Promise<AverageReviewResponse> {
  const res = await axiosClient.get<AverageReviewResponse>(`/Reviews/trip/${tripId}/average`);
  return res.data;
}

// Delete a review (Admin action)
export async function deleteReview(id: number): Promise<StringResponse> {
  const res = await adminAxiosClient.delete<StringResponse>(`/Reviews/${id}`);
  return res.data;
}
