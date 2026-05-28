import { axiosClient, adminAxiosClient } from './axiosClient';

export interface GalleryImageDto {
  id: number;
  imageUrl: string;
  isFeatured: boolean;
}

export interface GalleryApiResponse {
  success: boolean;
  message: string;
  data: GalleryImageDto[];
}

export interface SingleGalleryApiResponse {
  success: boolean;
  message: string;
  data: GalleryImageDto;
}

// Ensure images have absolute URLs when needed
export const getAbsoluteImageUrl = (relativePath: string) => {
  if (!relativePath) return '';
  if (relativePath.startsWith('http')) return relativePath;
  const cleanPath = relativePath.replace(/^\//, '');
  return `https://api.hurghadafuntime.com/${cleanPath}`;
};

/**
 * Get all gallery images. (Public)
 */
export async function getGalleryImages(): Promise<GalleryImageDto[]> {
  const response = await axiosClient.get<GalleryApiResponse>('/Gallery/GetAllImages');
  return response.data.data || [];
}

/**
 * Add a new image to the gallery. (Admin)
 */
export async function addGalleryImage(file: File, isFeatured: boolean): Promise<GalleryImageDto> {
  const formData = new FormData();
  formData.append('ImageFile', file);
  formData.append('IsFeatured', isFeatured.toString());

  const response = await adminAxiosClient.post<SingleGalleryApiResponse>('/Gallery/AddImage', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.data;
}

/**
 * Delete a gallery image by ID. (Admin)
 */
export async function deleteGalleryImage(id: number): Promise<void> {
  await adminAxiosClient.delete(`/Gallery/DeleteImage/${id}`);
}
