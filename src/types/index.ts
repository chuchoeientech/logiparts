export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  codLinea: number | null;
  createdAt: string;
}

export interface Vehicle {
  id: string;
  anio: number;
  nombreMarca: string;
  nombreModelo: string;
}

export interface Product {
  id: string;
  name: string;        // alias para descripcion
  descripcion: string | null;
  price: number;       // alias para costoFinal
  costoFinal: number;
  cantDisponible: number;
  codigoBarra: string | null;
  image: string | null;
  image_url: string | null; // alias para image
  isFeatured: boolean;
  categoryId: string | null;
  category_id: string | null; // alias para categoryId
  category?: Category | null;
  vehicles?: Vehicle[];
  createdAt: string;
  created_at: string; // alias para createdAt
}
