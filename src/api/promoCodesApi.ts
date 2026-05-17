import { adminAxiosClient } from './axiosClient';

// ── DTOs ─────────────────────────────────────────────────────────────────────

/** Full read DTO returned by GET /PromoCodes and GET /PromoCodes/{id} */
export interface DtoPromoCodeRead {
  id: number;
  code: string | null;
  discountEuro: number | null;
  discountpercent: number | null;
  limited: number;
  tripId: number | null;
  tripName: string | null;
}

/** Minimal read DTO for non-trip-related codes (GET /PromoCodes/nonrelatedtrip) */
export interface DtoPromoCodeNonDetails {
  id: number;
  code: string | null;
  discountEuro: number | null;
  discountpercent: number | null;
  limited: number;
}

/** Create payload (POST /PromoCodes) */
export interface DtoPromoCodeCreate {
  /** Fixed euro discount amount; set to null when using percentage */
  discountEuro: number | null;
  /** Percentage discount; set to null when using fixed amount */
  discountpercent: number | null;
  /** Required — maximum number of uses */
  limited: number;
  /** null = global (applies to all trips); number = specific trip ID */
  tripId: number | null;
}

// ── Response shapes ───────────────────────────────────────────────────────────

export interface PromoCodesListResponse {
  success: boolean;
  message: string | null;
  data: DtoPromoCodeRead[];
}

export interface PromoCodeNonDetailsListResponse {
  success: boolean;
  message: string | null;
  data: DtoPromoCodeNonDetails[];
}

export interface SinglePromoCodeResponse {
  success: boolean;
  message: string | null;
  data: DtoPromoCodeRead;
}

export interface PromoCodeCreateResponse {
  success: boolean;
  message: string | null;
  data: DtoPromoCodeRead;
}

// ── API Functions ─────────────────────────────────────────────────────────────

/** Admin: list all promo codes */
export async function getPromoCodes(
  pageNumber = 1,
  pageSize = 100
): Promise<PromoCodesListResponse> {
  const response = await adminAxiosClient.get<PromoCodesListResponse>('/PromoCodes', {
    params: { PageNumber: pageNumber, PageSize: pageSize },
  });
  return response.data;
}

/** Admin: list global (non-trip-related) promo codes */
export async function getGlobalPromoCodes(
  pageNumber = 1,
  pageSize = 100
): Promise<PromoCodeNonDetailsListResponse> {
  const response = await adminAxiosClient.get<PromoCodeNonDetailsListResponse>(
    '/PromoCodes/nonrelatedtrip',
    { params: { PageNumber: pageNumber, PageSize: pageSize } }
  );
  return response.data;
}

/** Admin: list trip-specific promo codes */
export async function getTripPromoCodes(
  pageNumber = 1,
  pageSize = 100
): Promise<PromoCodesListResponse> {
  const response = await adminAxiosClient.get<PromoCodesListResponse>(
    '/PromoCodes/relatedtrip',
    { params: { PageNumber: pageNumber, PageSize: pageSize } }
  );
  return response.data;
}

/** Admin: get single promo code by numeric ID */
export async function getPromoCodeById(id: number): Promise<SinglePromoCodeResponse> {
  const response = await adminAxiosClient.get<SinglePromoCodeResponse>(`/PromoCodes/${id}`);
  return response.data;
}

/** Admin: get single promo code by its string/numeric code value */
export async function getPromoCodeByCode(code: string | number): Promise<SinglePromoCodeResponse> {
  const response = await adminAxiosClient.get<SinglePromoCodeResponse>(
    `/PromoCodes/code/${code}`
  );
  return response.data;
}

/** Admin: create a new promo code */
export async function createPromoCode(
  payload: DtoPromoCodeCreate
): Promise<PromoCodeCreateResponse> {
  const response = await adminAxiosClient.post<PromoCodeCreateResponse>('/PromoCodes', payload);
  return response.data;
}
