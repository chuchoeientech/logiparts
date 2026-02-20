import { api, getUploadsUrl } from './client';
import { Product } from '../types';

export type ProductApi = Product;

export interface CreateProductBody {
  descripcion?: string;
  description?: string;
  costoFinal: number;
  costoEstimado?: number;
  costoReparacion?: number;
  cantDisponible?: number;
  cantMaxima?: number;
  cantMinima?: number;
  cantPend?: number;
  codDeposito?: number;
  nombreDeposito?: string;
  codigoBarra?: string;
  codigoImportacion?: string;
  codMarca?: number;
  codOrigen?: number;
  estadoRepuesto?: number;
  categoryId?: string | null;
  vehicleIds?: string[];
  isFeatured?: boolean;
}

export interface UpdateProductBody extends Partial<CreateProductBody> { }

/** Devuelve la URL completa para mostrar la imagen de un producto */
export function productImageUrl(p: ProductApi): string | null {
  return getUploadsUrl(p.image);
}

export const productsApi = {
  getAll: (params?: { categoryId?: string; featured?: boolean; vehicleId?: string }) => {
    const search = new URLSearchParams();
    if (params?.categoryId) search.set('categoryId', params.categoryId);
    if (params?.featured === true) search.set('featured', 'true');
    if (params?.vehicleId) search.set('vehicleId', params.vehicleId);
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
