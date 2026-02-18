import { api, getUploadsUrl } from './client';

export interface CategoryApi {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  createdAt: string;
}

export interface CreateCategoryBody {
  name: string;
  slug: string;
  description?: string;
}

export interface UpdateCategoryBody {
  name?: string;
  slug?: string;
  description?: string;
}

/** Devuelve la URL completa para mostrar la imagen de una categoría */
export function categoryImageUrl(c: CategoryApi): string | null {
  return getUploadsUrl(c.imageUrl);
}

export const categoriesApi = {
  getAll: () => api.get<CategoryApi[]>('/categories'),
  getOne: (id: string) => api.get<CategoryApi>(`/categories/${id}`),
  getBySlug: (slug: string) => api.get<CategoryApi>(`/categories/slug/${slug}`),
  create: (body: CreateCategoryBody) => api.post<CategoryApi>('/categories', body),
  createWithImage: (formData: FormData) => api.postForm<CategoryApi>('/categories', formData),
  update: (id: string, body: UpdateCategoryBody) =>
    api.patch<CategoryApi>(`/categories/${id}`, body),
  updateWithImage: (id: string, formData: FormData) =>
    api.patchForm<CategoryApi>(`/categories/${id}`, formData),
  delete: (id: string) => api.delete(`/categories/${id}`),
};
