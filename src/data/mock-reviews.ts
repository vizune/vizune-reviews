import { BLOCKS, type Document } from '@contentful/rich-text-types';
import type { Review } from '../lib/types';
import { slugify } from '../lib/slug';

function doc(...paragraphs: string[]): Document {
  return {
    nodeType: BLOCKS.DOCUMENT,
    data: {},
    content: paragraphs.map((value) => ({
      nodeType: BLOCKS.PARAGRAPH,
      data: {},
      content: [{ nodeType: 'text', value, marks: [], data: {} }],
    })),
  } as Document;
}

const LOREM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Donec ullamcorper nulla non metus auctor fringilla.';

/** Used only when Contentful isn't configured or has no published reviews. */
const seed: Array<Pick<Review, 'subject' | 'headline' | 'publishDate' | 'excerpt'>> = [
  { subject: 'Fragments of Tomorrow', headline: 'A quiet story about memory', publishDate: '2025-02-02', excerpt: 'A luminous story about memory and the futures we leave behind.' },
  { subject: 'Endless Horizons', headline: 'Floating cities worth getting lost in', publishDate: '2025-02-20', excerpt: 'Impossible skylines that beg to be explored.' },
  { subject: 'Neon Thoughts', headline: 'Every sign hums with a secret', publishDate: '2025-03-01', excerpt: 'A rain-soaked city full of small mysteries.' },
  { subject: 'Another Sky', headline: 'A world lived in before you arrived', publishDate: '2025-03-05', excerpt: 'Ruins, clouds and quiet wonder.' },
  { subject: 'Wandering Light', headline: 'Finding inspiration in everyday moments', publishDate: '2025-04-12', excerpt: 'How small details can spark big ideas.' },
  { subject: 'Sky Atlas', headline: 'Worldbuilding: more than just places', publishDate: '2025-03-28', excerpt: 'Creating worlds that feel alive.' },
  { subject: 'Paper Moons', headline: 'The art of letting go', publishDate: '2025-03-10', excerpt: 'On growth, creativity, and change.' },
];

export const mockReviews: Review[] = seed.map((r, i) => ({
  ...r,
  id: `mock-${i + 1}`,
  index: i + 1,
  slug: slugify(r.subject),
  content: doc(r.excerpt, LOREM, LOREM),
}));
