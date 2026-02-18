import { api, getUploadsUrl } from './client';

export interface ProductApi {
  id: string;
  title: string;
  description: string | null;
  price: number;
  image: string | null;
  categoryId: string | null;
  isFeatured: boolean;
  createdAt: string;
  category?: { id: string; name: string } | null;
}

export interface CreateProductBody {
  title: string;
  description?: string;
  price: number;
  categoryId?: string | null;
  isFeatured?: boolean;
}

export interface UpdateProductBody {
  title?: string;
  description?: string;
  price?: number;
  categoryId?: string | null;
  isFeatured?: boolean;
}

/** Devuelve la URL completa para mostrar la imagen de un producto */
export function productImageUrl(p: ProductApi): string | null {
  return getUploadsUrl(p.image);
}

export const productsApi = {
  getAll: (params?: { categoryId?: string; featured?: boolean }) => {
    const search = new URLSearchParams();
    if (params?.categoryId) search.set('categoryId', params.categoryId);
    if (params?.featured === true) search.set('featured', 'true');
    const q = search.toString();
    return api.get<ProductApi[]>(`/products${q ? `?${q}` : ''}`);
  },
  getOne: (id: string) => api.get<ProductApi>(`/products/${id}`),
  create: (body: CreateProductBody) => api.post<ProductApi>('/products', body),
  createWithImage: (formData: FormData) => api.postForm<ProductApi>('/products', formData),
  update: (id: string, body: UpdateProductBody) =>
    api.patch<ProductApi>(`/products/${id}`, body),
  updateWithImage: (id: string, formData: FormData) =>
    api.patchForm<ProductApi>(`/products/${id}`, formData),
  delete: (id: string) => api.delete(`/products/${id}`),
};
