import { axiosClient, adminAxiosClient } from './axiosClient';

export interface DtoQuestionRead {
  id: number;
  text: string | null;
  answer: string | null;
}

export interface TranslationInputDto {
  en: string;
  fr: string;
  ru: string;
  ro: string;
}

export interface DtoQuestionCreate {
  text: TranslationInputDto;
  answer: TranslationInputDto;
}

export interface DtoQuestionUpdate {
  id: number;
  text: TranslationInputDto;
  answer: TranslationInputDto;
}

export interface QuestionsListResponse {
  success: boolean;
  message: string | null;
  data: DtoQuestionRead[];
}

export interface SingleQuestionResponse {
  success: boolean;
  message: string | null;
  data: DtoQuestionRead;
}

/** Public: Get paginated list of questions (localized via Accept-Language header) */
export async function getQuestions(pageNumber = 1, pageSize = 50): Promise<QuestionsListResponse> {
  const response = await axiosClient.get<QuestionsListResponse>('/Questions', {
    params: { PageNumber: pageNumber, PageSize: pageSize }
  });
  return response.data;
}

/** Public: Get single question by ID with optional explicit language */
export async function getQuestionById(id: number, lang?: string): Promise<SingleQuestionResponse> {
  const config = lang ? { headers: { 'Accept-Language': lang } } : {};
  const response = await axiosClient.get<SingleQuestionResponse>(`/Questions/${id}`, config);
  return response.data;
}

/** Admin: Create a new question with 4-language translations */
export async function createQuestion(payload: DtoQuestionCreate): Promise<SingleQuestionResponse> {
  const response = await adminAxiosClient.post<SingleQuestionResponse>('/Questions', payload);
  return response.data;
}

/** Admin: Update an existing question with 4-language translations */
export async function updateQuestion(payload: DtoQuestionUpdate): Promise<SingleQuestionResponse> {
  const response = await adminAxiosClient.put<SingleQuestionResponse>('/Questions', payload);
  return response.data;
}

/** Admin: Delete a question by ID */
export async function deleteQuestion(id: number): Promise<void> {
  await adminAxiosClient.delete(`/Questions/${id}`);
}
