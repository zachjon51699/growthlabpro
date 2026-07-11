import type { AppPage } from '../types/app-page';

const PATH_TO_PAGE: Record<string, AppPage> = {
  '/pricing': 'pricing',
  '/terms': 'terms',
  '/privacy': 'privacy',
  '/success': 'success',
  '/trades-we-serve': 'trades-we-serve',
  '/contact': 'contact',
};

const HASH_TO_PAGE: Record<string, AppPage> = {
  pricing: 'pricing',
  terms: 'terms',
  privacy: 'privacy',
  success: 'success',
};

/** Netlify and many hosts use `/page/`; our map uses no trailing slash. */
export function normalizePathname(pathname: string): string {
  let p = pathname;
  if (p.length > 1 && p.endsWith('/')) {
    p = p.slice(0, -1);
  }
  return p.toLowerCase();
}

export function readPageFromUrl(): AppPage {
  if (typeof window === 'undefined') {
    return 'home';
  }

  const path = normalizePathname(window.location.pathname);

  // Non-root path routes win first (avoids /foo#pricing sending users to Pricing)
  if (path !== '/' && PATH_TO_PAGE[path]) {
    return PATH_TO_PAGE[path];
  }

  const hash = window.location.hash.replace(/^#/, '');
  if (hash && HASH_TO_PAGE[hash]) {
    return HASH_TO_PAGE[hash];
  }

  if (PATH_TO_PAGE[path]) {
    return PATH_TO_PAGE[path];
  }

  return 'home';
}

export function appPageToPath(page: AppPage): string {
  return page === 'home' ? '/' : `/${page}`;
}

/** Resolves a pathname to an app page, or null if it is not a client-routed view. */
export function getAppPageForPathname(pathname: string): AppPage | null {
  const path = normalizePathname(pathname);
  if (path === '/') {
    return 'home';
  }
  return PATH_TO_PAGE[path] ?? null;
}
