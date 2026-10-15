export const site = {
  name: 'Vizune Reviews',
  logoText: 'VIZUNE',
  logoSub: 'Reviews',
  tagline: ['Play', 'Discover', 'Review'],
  description: 'Beautiful worlds, cult favourites and unforgettable stories waiting to be discovered.',
};

export const network = {
  name: 'Vizune Network',
  url: 'https://vizune.net',
};

export interface NavItem {
  label: string;
  href: string;
  /** Opens in a new tab */
  external?: boolean;
}

export const nav: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Reviews', href: '/reviews' },
  { label: 'Network', href: network.url, external: true },
];

export const hero = {
  eyebrow: 'Unearth hidden gems',
  titleLine1: 'Vizune',
  titleLine2: 'Reviews',
  copy: 'Beautiful worlds, cult favourites and unforgettable stories waiting to be discovered.',
  primaryCta: { label: 'Explore reviews', href: '/reviews' },
  secondaryCta: { label: 'About me', href: '/about' },
  railTop: ['Every world', 'has a story'],
  railBottom: ['Games', 'Stories', 'Worlds', 'Worth', 'discovering'],
};

export const about = {
  label: 'About',
  heading: [
    [{ text: 'A ' }, { text: 'love letter', accent: true }, { text: ' to' }],
    [{ text: 'games worth ' }, { text: 'remembering', accent: true }],
  ],
  copy: "This is a space for hidden gems, cult favourites, indie experiments, nostalgic RPGs, underrated worlds and the wonderfully obscure. I favour rich aesthetics, memorable characters, unusual ideas and stories that leave an impression — and I'm slowly building an archive of the games I've fallen in love with along the way.",
  cta: { label: 'Learn more', href: '/about' },
  caption: ['Every world', 'leaves an impression.'],
  /** Contentful asset ID (not URL) of the image card: "vizune-reviews-about" */
  imageAssetId: 'yjcxL0YeMOrvvBLqVLUQ8',
  features: [
    { icon: 'gem', title: 'Hidden gems', text: 'Underrated worlds worth finding' },
    { icon: 'heart', title: 'Cult favourites', text: 'Games with devoted fans' },
    { icon: 'planet', title: 'Indie experiments', text: 'Unusual ideas and bold swings' },
    { icon: 'gamepad', title: 'Nostalgic RPGs', text: 'Stories that stay with you' },
  ],
} as const;
