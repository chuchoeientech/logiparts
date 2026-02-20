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
  nombreTipo: string;
  nombreMarca: string;
  nombreModelo: string;
  codTipo: number | null;
  codModelo: number | null;
  codOrigen: number | null;
}

export interface Product {
  id: string;
  name: string; // alias para descripcion
  descripcion: string | null;
  description: string | null;
  price: number; // alias para costoFinal
  costoFinal: number;
  costoEstimado: number;
  costoReparacion: number;
  cantDisponible: number;
  cantMaxima: number;
  cantMinima: number;
  cantPend: number;
  codDeposito: number | null;
  nombreDeposito: string | null;
  codigoBarra: string | null;
  codigoImportacion: string | null;
  codMarca: number | null;
  codOrigen: number | null;
  estadoRepuesto: number | null;
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
