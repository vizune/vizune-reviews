/** Placeholder image URL at the given dimensions. */
export function placehold(width: number, height: number): string {
  return `https://placehold.co/${width}x${height}/EEE/31343C`;
}

/** Image slot sizes, taken from the mockup proportions. */
export const IMAGE_SIZES = {
  about: [720, 420],
  reviewCard: [480, 220],
  reviewBanner: [1600, 600],
  reviewFeature: [1200, 500],
} as const satisfies Record<string, readonly [number, number]>;

export type ImageSlot = keyof typeof IMAGE_SIZES;

export function placeholdFor(slot: ImageSlot): string {
  const [w, h] = IMAGE_SIZES[slot];
  return placehold(w, h);
}
