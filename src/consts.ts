export const SITE = {
  name: 'Measured Interiors',
  tagline: 'Interiors drawn from their dimensions',
  description:
    'Interior design published as drawings rather than mood boards. Every room is set out from measured dimensions in millimetres, so a piece of furniture that does not fit is visibly not fitting.',
  locale: 'en',
  author: 'The owner',
} as const;

export const NAV_LINKS = [
  { label: 'Projects', href: '/' },
  { label: 'Catalogue', href: '/catalogue' },
  { label: 'Styles', href: '/styles' },
  { label: 'Audit', href: '/audit' },
  { label: 'Method', href: '/method' },
] as const;

/** Prefixes an internal path with the configured deployment base path. */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  const suffix = path.startsWith('/') ? path : `/${path}`;
  return `${base}${suffix}` || '/';
}
