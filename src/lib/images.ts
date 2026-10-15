/**
 * Contentful Images API: resize + convert on Contentful's CDN.
 * https://www.contentful.com/developers/docs/references/images-api/
 */
export function contentfulImage(url: string, width: number, quality = 80): string {
  const u = new URL(url);
  u.searchParams.set('w', String(width));
  u.searchParams.set('fm', 'webp');
  u.searchParams.set('q', String(quality));
  return u.toString();
}

export function contentfulSrcset(url: string, widths: number[]): string {
  return widths.map((w) => `${contentfulImage(url, w)} ${w}w`).join(', ');
}
