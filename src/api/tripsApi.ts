import { axiosClient, adminAxiosClient, BASE_URL } from './axiosClient';

// ── Enums ────────────────────────────────────────────────────────────────────
export const DurationType = {
  Hours: 0,
  Days: 1,
} as const;
export type DurationType = typeof DurationType[keyof typeof DurationType];

// ── DTOs ─────────────────────────────────────────────────────────────────────
export interface TranslationInputDto {
  en: string;
  fr: string;
  ru: string;
  ro: string;
}

export interface DtoTripImageRead {
  id: number;
  imageUrl: string | null;
  isPrimary: boolean;
}

export interface DtoTripRead {
  id: number;
  markerID: string | null;
  destination: string | null;
  name: string | null;
  description: string | null;
  timeFrom: string | null;
  durationValue: number;
  durationTypeName: string | null;
  adultPrice: number;
  childPrice: number;
  currencyName: string | null;
  isActive: boolean;
  tripTypeName: string | null;
  createdBy: string | null;
  createdAt: string | null;
  highlights: string[] | null;
  includes: string[] | null;
  excludes: string[] | null;
  whatToBring: string[] | null;
  availableDays: string[] | null;
  images: DtoTripImageRead[] | null;
}

export interface DtoTripCreate {
  destination: TranslationInputDto;
  name: TranslationInputDto;
  description: TranslationInputDto;
  timeFrom?: string;
  durationValue: number;
  durationType: DurationType;
  adultPrice: number;
  childPrice: number;
  tripTypeId: number;
  highlights?: TranslationInputDto[];
  includes?: TranslationInputDto[];
  excludes?: TranslationInputDto[];
  whatToBring?: TranslationInputDto[];
  availabilityDayNo?: number[];
}

export interface DtoTripUpdate extends DtoTripCreate {
  id: number;
}

// ── Response shapes ───────────────────────────────────────────────────────────
export interface TripsListResponse {
  success: boolean;
  message: string | null;
  data: DtoTripRead[];
}

export interface SingleTripResponse {
  success: boolean;
  message: string | null;
  data: DtoTripRead;
}

export interface TripImagesResponse {
  success: boolean;
  message: string | null;
  data: DtoTripImageRead[];
}

// ── Filters for list ──────────────────────────────────────────────────────────
export interface TripsListParams {
  PageNumber?: number;
  PageSize?: number;
  MinPrice?: number;
  MaxPrice?: number;
  TypeId?: number;
  Destination?: string;
  SearchItem?: string;
  includeInactive?: boolean;
}

// ── Build absolute URL (same pattern as gallery) ─────────────────────────────
const HOST = 'https://travelapi.runasp.net';
export function getTripImageUrl(relativeUrl: string | null): string {
  if (!relativeUrl) return '';
  if (relativeUrl.startsWith('http')) return relativeUrl;
  return `${HOST}/${relativeUrl.replace(/^\//, '')}`;
}

// ── API Functions ─────────────────────────────────────────────────────────────

/** Public: list trips with optional filters */
export async function getTrips(params?: TripsListParams): Promise<TripsListResponse> {
  const response = await axiosClient.get<TripsListResponse>('/Trips', { params });
  return response.data;
}

/** Public: get single trip by ID */
export async function getTripById(id: number, lang?: string): Promise<SingleTripResponse> {
  const config = lang ? { headers: { 'Accept-Language': lang } } : {};
  const response = await axiosClient.get<SingleTripResponse>(`/Trips/${id}`, config);
  return response.data;
}

/** Admin: create a new trip */
export async function createTrip(payload: DtoTripCreate): Promise<SingleTripResponse> {
  const response = await adminAxiosClient.post<SingleTripResponse>('/Trips', payload);
  return response.data;
}

/** Admin: update an existing trip */
export async function updateTrip(payload: DtoTripUpdate): Promise<SingleTripResponse> {
  const response = await adminAxiosClient.put<SingleTripResponse>('/Trips', payload);
  return response.data;
}

/** Admin: deactivate (soft-delete) a trip */
export async function deactivateTrip(id: number): Promise<void> {
  await adminAxiosClient.delete(`/Trips/${id}/deactivate`);
}

/** Admin: reactivate a trip */
export async function reactivateTrip(id: number): Promise<void> {
  await adminAxiosClient.put(`/Trips/${id}/reactivate`);
}

/** Admin: upload images for a trip */
export async function uploadTripImages(id: number, files: File[]): Promise<TripImagesResponse> {
  const formData = new FormData();
  files.forEach(file => formData.append('Images', file));
  const response = await adminAxiosClient.post<TripImagesResponse>(
    `/Trips/${id}/image`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return response.data;
}

/** Admin: delete a specific trip image */
export async function deleteTripImage(tripId: number, imageId: number): Promise<void> {
  await adminAxiosClient.delete(`/Trips/${tripId}/image/${imageId}`);
}

/** Admin: set an image as the primary/cover image */
export async function setPrimaryTripImage(tripId: number, imageId: number): Promise<void> {
  await adminAxiosClient.put(`/Trips/${tripId}/image/${imageId}/set-primary`);
}
