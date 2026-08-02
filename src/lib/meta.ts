import { useEffect } from 'react';
import { editorialImages } from '@/lib/shop/editorial';

// La SPA serviva lo stesso <title> su tutte le route. Questo hook aggiorna
// title, description, canonical e OG per pagina.
// Nota: è meta lato client. Google esegue JS e le vede, ma per Facebook e
// WhatsApp serve il prerender in produzione (vedi README).

const SITE_NAME = 'Colorado Store';
// Nessun asset OG dedicato: usiamo uno scatto reale del catalogo ritagliato
// nel formato che si aspettano i social.
const DEFAULT_OG = `${editorialImages.streetwear.url.split('?')[0]}?width=1200&height=630&crop=center`;

function setMeta(selector: string, attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export function usePageMeta({
  title,
  description,
  image,
  noindex,
}: {
  title: string;
  description: string;
  image?: string;
  noindex?: boolean;
}) {
  useEffect(() => {
    document.title = title;

    setMeta('meta[name="description"]', 'name', 'description', description);
    setMeta('meta[property="og:title"]', 'property', 'og:title', title);
    setMeta('meta[property="og:description"]', 'property', 'og:description', description);
    setMeta('meta[property="og:site_name"]', 'property', 'og:site_name', SITE_NAME);
    setMeta('meta[property="og:url"]', 'property', 'og:url', window.location.href);
    setMeta('meta[property="og:image"]', 'property', 'og:image', image || DEFAULT_OG);
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', image || DEFAULT_OG);
    setMeta('meta[name="robots"]', 'name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = window.location.origin + window.location.pathname;
  }, [title, description, image, noindex]);
}

// Inserisce un blocco JSON-LD nel <head> e lo rimuove allo smontaggio.
// In JSX React renderizza <script> come nodo inerte: va messo qui.
export function useJsonLd(data: object | null, id: string) {
  useEffect(() => {
    if (!data) return;
    const el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = id;
    el.textContent = JSON.stringify(data);
    document.head.appendChild(el);
    return () => {
      el.remove();
    };
  }, [data, id]);
}
