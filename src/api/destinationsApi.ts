import { axiosClient, adminAxiosClient } from './axiosClient';

const HOST = 'https://travelapi.runasp.net';

export interface DestinationDto {
  id: number;
  name: string;
  imageUrl: string | null;
  isFeatured: boolean;
  tripsCount: number;
}

export interface DestinationsApiResponse {
  success: boolean;
  message: string | null;
  data: DestinationDto[];
}

export interface DestinationResponse {
  success: boolean;
  message: string | null;
  data: DestinationDto;
}

export interface DestinationListParams {
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
  lang?: string;
}

export function getDestinationImageUrl(relativeUrl: string | null | undefined): string {
  if (!relativeUrl) return '';
  if (relativeUrl.startsWith('http')) return relativeUrl;
  return `${HOST}/${relativeUrl.replace(/^\//, '')}`;
}

export async function getDestinations(
  pageNumber = 1,
  pageSize = 50,
  searchTerm?: string,
  lang?: string
): Promise<DestinationsApiResponse> {
  const headers: Record<string, string> = {};
  if (lang) {
    headers['Accept-Language'] = lang;
  }

  const response = await axiosClient.get<DestinationsApiResponse>('/Destinations', {
    params: { PageNumber: pageNumber, PageSize: pageSize, searchTerm },
    headers,
  });

  return response.data;
}

export async function getDestinationById(id: number, lang?: string): Promise<DestinationResponse> {
  const headers: Record<string, string> = {};
  if (lang) {
    headers['Accept-Language'] = lang;
  }

  const response = await axiosClient.get<DestinationResponse>(`/Destinations/${id}`, { headers });
  return response.data;
}

export async function createDestination(payload: FormData): Promise<DestinationResponse> {
  const response = await adminAxiosClient.post<DestinationResponse>('/Destinations', payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}

export async function updateDestination(payload: FormData): Promise<DestinationResponse> {
  const response = await adminAxiosClient.put<DestinationResponse>('/Destinations', payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}

export async function deleteDestination(id: number): Promise<void> {
  await adminAxiosClient.delete(`/Destinations/${id}`);
}
