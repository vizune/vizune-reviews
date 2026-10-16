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
  includes?: { Asset?: RawAsset[]; Entry?: RawEntry[] };
}

/** An embedded entry, e.g. a Spoiler with its own rich-text content */
interface RawEntry {
  sys: { id: string; contentType?: { sys: { id: string } } };
  fields: Record<string, unknown>;
}

interface Includes {
  assets: Map<string, RawAsset>;
  entries: Map<string, RawEntry>;
}

export interface LiveReview {
  headline?: string;
  publishDate?: string;
  bannerUrl?: string;
  content?: Document;
}

/**
 * Swap embedded asset/entry links in rich text for the full objects the
 * renderer expects. Embedded entries (Spoilers) are resolved too, including
 * images inside them. `depth` stops runaway loops if entries reference each other.
 */
function resolveLinks<T>(node: T, inc: Includes, depth = 0): T {
  if (depth > 4) return node;
  if (Array.isArray(node)) return node.map((n) => resolveLinks(n, inc, depth)) as T;
  if (!node || typeof node !== 'object') return node;
  const obj = node as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) out[key] = resolveLinks(value, inc, depth);

  const target = (out.data as { target?: Link } | undefined)?.target;
  if (target?.sys?.type === 'Link') {
    const resolved =
      target.sys.linkType === 'Asset'
        ? inc.assets.get(target.sys.id)
        : target.sys.linkType === 'Entry'
          ? (() => {
              const entry = inc.entries.get(target.sys.id);
              return entry && { ...entry, fields: resolveLinks(entry.fields, inc, depth + 1) };
            })()
          : undefined;
    if (resolved) out.data = { ...(out.data as object), target: resolved };
  }
  return out as T;
}

export async function fetchLiveReview(opts: {
  space: string;
  token: string;
  environment: string;
  entryId: string;
}): Promise<LiveReview | undefined> {
  // include=3: review → embedded Spoiler → images inside the spoiler
  const params = new URLSearchParams({ 'sys.id': opts.entryId, include: '3', limit: '1' });
  const res = await fetch(
    `https://cdn.contentful.com/spaces/${opts.space}/environments/${opts.environment}/entries?${params}`,
    { headers: { Authorization: `Bearer ${opts.token}` } },
  );
  if (!res.ok) throw new Error(`Contentful ${res.status}`);
  const data: EntriesResponse = await res.json();
  const f = data.items[0]?.fields;
  if (!f) return undefined;

  const inc: Includes = {
    assets: new Map((data.includes?.Asset ?? []).map((a) => [a.sys.id, a])),
    entries: new Map((data.includes?.Entry ?? []).map((e) => [e.sys.id, e])),
  };
  const bannerFile = f.banner && inc.assets.get(f.banner.sys.id)?.fields.file?.url;

  return {
    headline: f.heading ?? f.name,
    publishDate: f.publishDate,
    bannerUrl: bannerFile ? `https:${bannerFile}` : undefined,
    content: f.content ? resolveLinks(f.content, inc) : undefined,
  };
}
