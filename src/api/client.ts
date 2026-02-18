// En Netlify: Site configuration → Environment variables → añadir:
//   Key: VITE_API_URL   Value: https://TU-BACKEND.up.railway.app  (la URL de Railway, NO la de Netlify)
// Vite solo expone variables con prefijo VITE_. Después de guardar, hacer "Trigger deploy" para que el build use la variable.
const API_BASE =
  (typeof window !== 'undefined' && (window as Window & { __VITE_API_URL__?: string }).__VITE_API_URL__) ||
  import.meta.env.VITE_API_URL ||
  'http://localhost:3000';

/** URL pública para mostrar imágenes almacenadas en el servidor */
export function getUploadsUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  const base = API_BASE.replace(/\/$/, '');
  return `${base}/uploads/${path.replace(/^\//, '')}`;
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;
  const headers: Record<string, string> = { ...(options.headers as Record<string, string> | undefined) };
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  const res = await fetch(url, { ...options, headers });
  const text = await res.text();

  const contentType = res.headers.get('Content-Type') ?? '';
  if (contentType.includes('text/html')) {
    throw new Error(
      `La API devolvió HTML en lugar de JSON. Revisa que VITE_API_URL en Netlify apunte a tu backend en Railway (ej: https://tu-app.up.railway.app), no a la URL de Netlify. Request: ${url}`
    );
  }

  if (!res.ok) {
    throw new Error(text || `Error ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(`Respuesta no es JSON válido: ${text.slice(0, 100)}...`);
  }
}

export const api = {
  get: <T>(path: string) => request<T>(path, { method: 'GET' }),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  postForm: <T>(path: string, body: FormData) =>
    request<T>(path, { method: 'POST', body }),
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  patchForm: <T>(path: string, body: FormData) =>
    request<T>(path, { method: 'PATCH', body }),
  delete: (path: string) => request<void>(path, { method: 'DELETE' }),
};

export default api;
