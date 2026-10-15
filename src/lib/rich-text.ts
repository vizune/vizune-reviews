import { documentToHtmlString, type Options } from '@contentful/rich-text-html-renderer';
import { BLOCKS, type Document } from '@contentful/rich-text-types';
import { placehold } from './placeholder';

const options: Options = {
  renderNode: {
    // Embedded images render as placeholders at the asset's real size for now.
    [BLOCKS.EMBEDDED_ASSET]: (node) => {
      const fields = node.data.target?.fields;
      const image = fields?.file?.details?.image;
      const width = image?.width ?? 1200;
      const height = image?.height ?? 675;
      const alt = String(fields?.description || fields?.title || '').replace(/"/g, '&quot;');
      return `<img src="${placehold(width, height)}" width="${width}" height="${height}" alt="${alt}" loading="lazy" />`;
    },
  },
};

export function renderRichText(doc: Document | undefined): string {
  return doc ? documentToHtmlString(doc, options) : '';
}
