// En Netlify la variable DEBE llamarse exactamente VITE_API_URL (con prefijo VITE_).
// Vite solo expone al cliente las variables que empiezan por VITE_. Tras cambiar la variable, redeploy.
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
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Error ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
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
