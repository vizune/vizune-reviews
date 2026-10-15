import type { Document } from '@contentful/rich-text-types';

export interface Review {
  id: string;
  index: number;
  /** Review headline (Contentful "Heading", formerly "Name"; the entry title) */
  headline: string;
  /** The game / work being reviewed (Contentful "Title") */
  subject: string;
  slug: string;
  publishDate: string;
  excerpt: string;
  /** Asset URLs from Contentful, kept for when real images are switched on */
  bannerUrl?: string;
  thumbnailUrl?: string;
  content?: Document;
}
