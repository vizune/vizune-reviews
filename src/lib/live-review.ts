/**
 * Browser-side: fetch the latest version of one review straight from
 * Contentful's Delivery API, so edits show on the live site without a rebuild.
 */
import type { Document } from '@contentful/rich-text-types';

interface Link {
  sys: { type: 'Link'; linkType: string; id: string };
}

interface RawAsset {
  sys: { id: string };
  fields: { title?: string; description?: string; file?: { url?: string; fileName?: string; details?: { image?: { width: number; height: number } } } };
}

interface EntriesResponse {
  items: Array<{
    fields: {
      heading?: string;
      name?: string;
      publishDate?: string;
      banner?: Link;
      content?: Document;
    };
  }>;
  includes?: { Asset?: RawAsset[] };
}

export interface LiveReview {
  headline?: string;
  publishDate?: string;
  bannerUrl?: string;
  content?: Document;
}

/** Swap embedded-asset links in rich text for the asset objects the renderer expects. */
function resolveAssets<T>(node: T, assets: Map<string, RawAsset>): T {
  if (Array.isArray(node)) return node.map((n) => resolveAssets(n, assets)) as T;
  if (!node || typeof node !== 'object') return node;
  const obj = node as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) out[key] = resolveAssets(value, assets);
  const target = (out.data as { target?: Link } | undefined)?.target;
  if (target?.sys?.linkType === 'Asset') {
    const asset = assets.get(target.sys.id);
    if (asset) out.data = { ...(out.data as object), target: asset };
  }
  return out as T;
}

export async function fetchLiveReview(opts: {
  space: string;
  token: string;
  environment: string;
  entryId: string;
}): Promise<LiveReview | undefined> {
  const params = new URLSearchParams({ 'sys.id': opts.entryId, include: '2', limit: '1' });
  const res = await fetch(
    `https://cdn.contentful.com/spaces/${opts.space}/environments/${opts.environment}/entries?${params}`,
    { headers: { Authorization: `Bearer ${opts.token}` } },
  );
  if (!res.ok) throw new Error(`Contentful ${res.status}`);
  const data: EntriesResponse = await res.json();
  const f = data.items[0]?.fields;
  if (!f) return undefined;

  const assets = new Map((data.includes?.Asset ?? []).map((a) => [a.sys.id, a]));
  const bannerFile = f.banner && assets.get(f.banner.sys.id)?.fields.file?.url;

  return {
    headline: f.heading ?? f.name,
    publishDate: f.publishDate,
    bannerUrl: bannerFile ? `https:${bannerFile}` : undefined,
    content: f.content ? resolveAssets(f.content, assets) : undefined,
  };
}
