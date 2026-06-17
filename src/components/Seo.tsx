import { useEffect } from 'react';

export const SITE_NAME = 'Logisparts';
export const SITE_URL = 'https://www.logisparts.com.py';
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;
const DEFAULT_DESCRIPTION =
  'Distribuidor de repuestos automotrices originales y alternativos en Paraguay. Calidad, confianza y los mejores precios del mercado.';

type SeoProps = {
  title: string;
  description?: string;
  /** Ruta absoluta del sitio, ej: "/productos". Usa la URL actual si se omite. */
  path?: string;
  image?: string;
  /** "website" | "product" | "article" */
  type?: string;
  /** Evita que la página sea indexada (ej. panel admin). */
  noindex?: boolean;
};

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export default function Seo({
  title,
  description = DEFAULT_DESCRIPTION,
  path,
  image = DEFAULT_IMAGE,
  type = 'website',
  noindex = false,
}: SeoProps) {
  useEffect(() => {
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
    const url = `${SITE_URL}${path ?? window.location.pathname}`;

    document.title = fullTitle;

    setMeta('name', 'title', fullTitle);
    setMeta('name', 'description', description);
    setMeta(
      'name',
      'robots',
      noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'
    );
    setLink('canonical', url);

    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:type', type);
    setMeta('property', 'og:image', image);

    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', image);
  }, [title, description, path, image, type, noindex]);

  return null;
}
