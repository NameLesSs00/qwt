import { adminAxiosClient } from './axiosClient';

export interface TripReportEntity {
  tripTitle: string | null;
  bookingCount: number;
}

export interface ReportEntity {
  totalBookings: number;
  totalRevenue: number;
  newCustomers: number;
  topTrips: TripReportEntity[] | null;
}

export interface ReportEntityResponseAPI {
  success: boolean;
  message: string | null;
  data: ReportEntity;
}

/**
 * Fetch Daily Report
 */
export async function getDailyReport(): Promise<ReportEntityResponseAPI> {
  const response = await adminAxiosClient.get<ReportEntityResponseAPI>('/Reports/daily');
  return response.data;
}

/**
 * Fetch Monthly Report
 */
export async function getMonthlyReport(): Promise<ReportEntityResponseAPI> {
  const response = await adminAxiosClient.get<ReportEntityResponseAPI>('/Reports/monthly');
  return response.data;
}

/**
 * Fetch Yearly Report
 */
export async function getYearlyReport(): Promise<ReportEntityResponseAPI> {
  const response = await adminAxiosClient.get<ReportEntityResponseAPI>('/Reports/yearly');
  return response.data;
}
