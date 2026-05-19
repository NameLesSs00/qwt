import { axiosClient, adminAxiosClient } from './axiosClient';

export interface TripTypeDto {
  id: number;
  name: string;
}

export interface TripTypeLocalizedPayload {
  en: string;
  fr: string;
  ru: string;
  ro: string;
}

export interface CreateTripTypePayload {
  name: TripTypeLocalizedPayload;
}

export interface UpdateTripTypePayload {
  id: number;
  name: TripTypeLocalizedPayload;
}

export interface TripTypesApiResponse {
  success: boolean;
  message: string;
  data: TripTypeDto[];
}

export interface SingleTripTypeApiResponse {
  success: boolean;
  message: string;
  data: TripTypeDto;
}

/**
 * Public/Admin: Get all trip types
 */
export async function getTripTypes(pageNumber = 1, pageSize = 50): Promise<TripTypesApiResponse> {
  const response = await axiosClient.get<TripTypesApiResponse>('/TripTypes', {
    params: { PageNumber: pageNumber, PageSize: pageSize }
  });
  return response.data;
}

/**
 * Public/Admin: Get single trip type by ID
 */
export async function getTripTypeById(id: number, lang?: string): Promise<SingleTripTypeApiResponse> {
  const headers: Record<string, string> = {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
  };
  if (lang) {
    headers['Accept-Language'] = lang;
  }
  const response = await axiosClient.get<SingleTripTypeApiResponse>(`/TripTypes/${id}`, { headers });
  return response.data;
}

/**
 * Admin: Create new trip type
 */
export async function createTripType(payload: CreateTripTypePayload): Promise<SingleTripTypeApiResponse> {
  const response = await adminAxiosClient.post<SingleTripTypeApiResponse>('/TripTypes', payload);
  return response.data;
}

/**
 * Admin: Update trip type
 */
export async function updateTripType(payload: UpdateTripTypePayload): Promise<SingleTripTypeApiResponse> {
  const response = await adminAxiosClient.put<SingleTripTypeApiResponse>('/TripTypes', payload);
  return response.data;
}

/**
 * Admin: Delete trip type
 */
export async function deleteTripType(id: number): Promise<void> {
  await adminAxiosClient.delete(`/TripTypes/${id}`);
}
