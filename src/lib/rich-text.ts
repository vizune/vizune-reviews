import { documentToHtmlString, type Options } from '@contentful/rich-text-html-renderer';
import { BLOCKS, type Document } from '@contentful/rich-text-types';
import { contentfulImage, contentfulSrcset } from './images';

const escapeAttr = (value: string) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;');

/** Alt text: the asset's Description, else its title made readable ("top-20-games" → "top 20 games"). */
function altText(fields: { description?: unknown; title?: unknown }): string {
  const text = String(fields.description || fields.title || '');
  return fields.description ? text : text.replace(/[-_]+/g, ' ');
}

/** How wide embedded images display on a normal page (the text column) */
const DEFAULT_IMAGE_SIZES = '(min-width: 800px) 736px, 100vw';

/** Review pages: images span the full 1000px column, like the banner */
export const REVIEW_IMAGE_SIZES = '(min-width: 1100px) 1000px, 100vw';

function options(imageSizes: string): Options {
  return {
    renderNode: {
      [BLOCKS.EMBEDDED_ASSET]: (node) => {
        const fields = node.data.target?.fields;
        const file = fields?.file;
        if (!file?.url) return '';

        const url = `https:${file.url}`;
        const image = file.details?.image;

        // Non-image files (e.g. a PDF) become a download link
        if (!image) {
          return `<p><a href="${escapeAttr(url)}">${escapeAttr(String(fields.title || file.fileName || 'Download'))}</a></p>`;
        }

        // Never ask Contentful for a version bigger than the original
        const widths = [480, 720, 960, 1440].filter((w) => w < image.width).concat(image.width);
        const src = contentfulImage(url, Math.min(image.width, 960));

        return `<img src="${escapeAttr(src)}" srcset="${escapeAttr(contentfulSrcset(url, widths))}" sizes="${imageSizes}" width="${image.width}" height="${image.height}" alt="${escapeAttr(altText(fields))}" loading="lazy" decoding="async" />`;
      },
    },
  };
}

/**
 * @param imageSizes the `sizes` attribute for embedded images, so the browser
 *   downloads the right resolution for how wide images show on that page
 */
export function renderRichText(doc: Document | undefined, imageSizes = DEFAULT_IMAGE_SIZES): string {
  return doc ? documentToHtmlString(doc, options(imageSizes)) : '';
}
