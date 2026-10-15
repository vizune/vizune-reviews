# Vizune Reviews

Astro site for Vizune Reviews, with content from Contentful. Pages are built as static HTML, so it can be hosted on Nekoweb or any static host.

## Getting started

```bash
npm install
cp .env.example .env   # add your Contentful space ID + delivery token
npm run dev
```

If `.env` is empty, or Contentful has no published reviews, the site uses the mock reviews in `src/data/mock-reviews.ts`.

| Script | Does |
|---|---|
| `npm run dev` | Dev server at http://localhost:4321 |
| `npm run build` | Static build to `dist/` |
| `npm run preview` | Serve the build locally |
| `npm run check` | Type-check `.astro` and `.ts` files |

## Contentful

Content type **Reviews** (`reviews`):

| Field | ID | Used for |
|---|---|---|
| Index | `index` | Order of the `/reviews` page |
| Heading (was Name) | `heading` or `name` | Review headline |
| Title | `title` | The game/work. Also used for the URL slug (`/reviews/crystar`) |
| Publish Date | `publishDate` | Homepage Latest reviews (newest 4), HUD "last signal", displayed date |
| Banner | `banner` | `/reviews` page cards (resized by Contentful) |
| Thumbnail | `thumbnail` | Fetched, but placeholders are shown for now |
| Content | `content` | Review body (rich text). The first paragraph becomes the excerpt |

Since the site is static, publishing in Contentful needs a rebuild to show up. A Contentful webhook can trigger one on your host.

## Structure

- `src/lib/contentful.ts`: client, field mapping, fetchers
- `src/data/site.ts`: hero / about / nav / footer copy
- `src/lib/placeholder.ts`: placeholder image sizes per slot
- `src/components/`: page sections and cards
- `splash/`: the old coming-soon page
