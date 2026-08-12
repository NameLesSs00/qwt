import { axiosClient, adminAxiosClient } from './axiosClient';

// ── Enums ────────────────────────────────────────────────────────────────────
export const BookingStatus = {
  Pending: 0,
  Confirmed: 1,
  Finished: 2,
  Cancelled: 3
} as const;
export type BookingStatus = typeof BookingStatus[keyof typeof BookingStatus];

// Type for the string returned in API GET responses
export type BookingStatusString = 'Pending' | 'Confirmed' | 'Finished' | 'Cancelled';

// ── DTOs ─────────────────────────────────────────────────────────────────────
export interface DtoTripBookingCreate {
  tripId: number;
  noAdult: number;
  noChild: number;
  leaveDate: string; // Format: YYYY-MM-DD
}

export interface DtoBookCreate {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  code: number;
  nationality: string;
  hotelName: string;
  roomNo: string;
  tripsBookings: DtoTripBookingCreate[];
}

export interface DtoTripBookingRead {
  id: number;
  tripId: number;
  title?: string;
  priceForChild: number;
  priceForAdult: number;
  noAdult: number;
  noChild: number;
  leaveDate: string;
  subTotal: number;
}

export interface DtoBookRead {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  code?: number;
  nationality: string;
  bookingDate: string;
  hotelName: string;
  roomNo: string;
  totalPrice: number;
  status: BookingStatusString;
  createdAt: string;
  tripsBookings: DtoTripBookingRead[];
}

export interface DtoBookReadResponseAPI {
  success: boolean;
  message: string | null;
  data: DtoBookRead;
}

export interface DtoBookReadIEnumerableResponseAPI {
  success: boolean;
  message: string | null;
  data: DtoBookRead[];
}

// ── Filters for Admin List ────────────────────────────────────────────────────
export interface BookingsListParams {
  PageNumber?: number;
  PageSize?: number;
  Nationality?: string;
  SearchItem?: string;
  Phone?: string;
  Date?: string;
  Status?: BookingStatus;
  TripId?: number;
}

// ── Client Endpoints ──────────────────────────────────────────────────────────

/** Create a new booking */
export async function createBooking(data: DtoBookCreate): Promise<DtoBookReadResponseAPI> {
  const res = await axiosClient.post<DtoBookReadResponseAPI>('/Bookings', data);
  return res.data;
}

// ── Admin Endpoints ───────────────────────────────────────────────────────────

/** Get list of all bookings (with optional filters) */
export async function getBookings(params?: BookingsListParams): Promise<DtoBookReadIEnumerableResponseAPI> {
  const res = await adminAxiosClient.get<DtoBookReadIEnumerableResponseAPI>('/Bookings', { params });
  return res.data;
}

/** Get booking by ID */
export async function getBookingById(id: number): Promise<DtoBookReadResponseAPI> {
  const res = await adminAxiosClient.get<DtoBookReadResponseAPI>(`/Bookings/${id}`);
  return res.data;
}

/** Delete a booking */
export async function deleteBooking(id: number): Promise<{ success: boolean; message: string | null; data: string }> {
  const res = await adminAxiosClient.delete(`/Bookings/${id}`);
  return res.data;
}

/** Confirm a booking */
export async function confirmBooking(id: number): Promise<DtoBookReadResponseAPI> {
  const res = await adminAxiosClient.put<DtoBookReadResponseAPI>(`/Bookings/confirm`, null, { params: { id } });
  return res.data;
}

/** Finish a booking */
export async function finishBooking(id: number): Promise<DtoBookReadResponseAPI> {
  const res = await adminAxiosClient.put<DtoBookReadResponseAPI>(`/Bookings/finish`, null, { params: { id } });
  return res.data;
}
