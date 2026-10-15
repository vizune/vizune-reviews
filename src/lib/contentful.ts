import * as contentful from 'contentful';
import type { Asset, Entry, EntrySkeletonType } from 'contentful';
import type { Document } from '@contentful/rich-text-types';
import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer';
import type { Review } from './types';
import { slugify } from './slug';
import { mockReviews } from '../data/mock-reviews';

const SPACE = import.meta.env.PUBLIC_cSPACE;
const ACCESS_TOKEN = import.meta.env.PUBLIC_cACCESS_TOKEN;
const ENVIRONMENT = import.meta.env.CONTENTFUL_ENVIRONMENT || 'master';
const REVIEW_TYPE = import.meta.env.CONTENTFUL_REVIEW_TYPE || 'reviews';

/** Field IDs of the "Reviews" content model. */
interface ReviewSkeleton extends EntrySkeletonType {
  contentTypeId: string;
  fields: {
    index?: contentful.EntryFieldTypes.Integer;
    /** Review headline. Field ID may be `heading` or the original `name`. */
    heading?: contentful.EntryFieldTypes.Symbol;
    name?: contentful.EntryFieldTypes.Symbol;
    publishDate?: contentful.EntryFieldTypes.Date;
    title?: contentful.EntryFieldTypes.Symbol;
    banner?: contentful.EntryFieldTypes.AssetLink;
    thumbnail?: contentful.EntryFieldTypes.AssetLink;
    content?: contentful.EntryFieldTypes.RichText;
  };
}

const client =
  SPACE && ACCESS_TOKEN
    ? contentful.createClient({ space: SPACE, accessToken: ACCESS_TOKEN, environment: ENVIRONMENT })
    : null;

function assetUrl(asset: unknown): string | undefined {
  const url = (asset as Asset | undefined)?.fields?.file?.url;
  return typeof url === 'string' ? `https:${url}` : undefined;
}

export function excerptFrom(doc: Document | undefined, max = 90): string {
  if (!doc) return '';
  const firstParagraph = doc.content.find((node) => node.nodeType === 'paragraph');
  const text = firstParagraph ? documentToPlainTextString(firstParagraph).trim() : '';
  if (text.length <= max) return text;
  return text.slice(0, max).replace(/\s+\S*$/, '') + '…';
}

function toReview(entry: Entry<ReviewSkeleton, 'WITHOUT_UNRESOLVABLE_LINKS'>): Review {
  const f = entry.fields;
  const heading = f.heading ?? f.name;
  const subject = f.title ?? heading ?? 'Untitled';
  const content = f.content as Document | undefined;
  return {
    id: entry.sys.id,
    index: f.index ?? 0,
    headline: heading ?? subject,
    subject,
    slug: slugify(subject) || entry.sys.id,
    publishDate: f.publishDate ?? entry.sys.createdAt,
    excerpt: excerptFrom(content),
    bannerUrl: assetUrl(f.banner),
    thumbnailUrl: assetUrl(f.thumbnail),
    content,
  };
}

let cache: Promise<Review[]> | undefined;

async function fetchReviews(): Promise<Review[]> {
  if (!client) {
    console.warn('[contentful] PUBLIC_cSPACE / PUBLIC_cACCESS_TOKEN not set, using mock reviews.');
    return mockReviews;
  }
  const res = await client.withoutUnresolvableLinks.getEntries<ReviewSkeleton>({
    content_type: REVIEW_TYPE,
    order: ['fields.index'],
    limit: 1000,
  });
  if (res.items.length === 0) {
    console.warn(`[contentful] No published "${REVIEW_TYPE}" entries yet, using mock reviews.`);
    return mockReviews;
  }
  const reviews = res.items.map(toReview);
  // Two reviews of the same game would share a slug, so suffix repeats.
  const seen = new Map<string, number>();
  for (const r of reviews) {
    const n = (seen.get(r.slug) ?? 0) + 1;
    seen.set(r.slug, n);
    if (n > 1) r.slug = `${r.slug}-${n}`;
  }
  return reviews;
}

/** All reviews, ordered by Index. Fetched once per build. */
export function getReviews(): Promise<Review[]> {
  cache ??= fetchReviews();
  return cache;
}

export async function getLatestReviews(limit = 4): Promise<Review[]> {
  const reviews = await getReviews();
  return [...reviews]
    .sort((a, b) => Date.parse(b.publishDate) - Date.parse(a.publishDate))
    .slice(0, limit);
}

export interface ContentfulAsset {
  url: string;
  alt: string;
  width?: number;
  height?: number;
}

/**
 * Look up an asset by ID so its *current* file URL is used. Replacing the file
 * in Contentful keeps the ID but changes the URL, so never hard-code the URL.
 */
export async function getAsset(id: string): Promise<ContentfulAsset | undefined> {
  if (!client) return undefined;
  try {
    const asset = await client.getAsset(id);
    const url = assetUrl(asset);
    if (!url) return undefined;
    const image = asset.fields.file?.details?.image;
    return {
      url,
      alt: String(asset.fields.description || ''),
      width: image?.width,
      height: image?.height,
    };
  } catch (err) {
    console.warn(`[contentful] Couldn't load asset ${id}, using a placeholder.`, err);
    return undefined;
  }
}

export async function getReviewBySlug(slug: string): Promise<Review | undefined> {
  return (await getReviews()).find((r) => r.slug === slug);
}
