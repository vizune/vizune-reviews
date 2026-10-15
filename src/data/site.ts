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
  copy: "This is a space for hidden gems, cult favourites, indie experiments, nostalgic RPGs and the wonderfully obscure. I favour rich aesthetics, memorable characters, unusual ideas and stories that leave an impression and I'm slowly building an archive of the games I've fallen in love with along the way.",
  cta: { label: 'Learn more', href: '/about' },
  caption: ['Every world', 'leaves an impression.'],
  /** Slug of the Contentful "Page" entry shown on /about */
  pageSlug: 'about-vizune-reviews',
  /** Contentful asset ID (not URL) of the image card: "vizune-reviews-about" */
  imageAssetId: 'yjcxL0YeMOrvvBLqVLUQ8',
  features: [
    { icon: 'gem', title: 'Hidden gems', text: 'Underrated worlds worth finding' },
    { icon: 'heart', title: 'Cult favourites', text: 'Games with devoted fans' },
    { icon: 'planet', title: 'Indie experiments', text: 'Unusual ideas and bold swings' },
    { icon: 'gamepad', title: 'Nostalgic RPGs', text: 'Stories that stay with you' },
  ],
} as const;

/**
 * Gaming setup panel at the end of /about. Shown in this order, two per row
 * on desktop: core PC parts first, then OS, then display and peripherals.
 */
export const specs = {
  title: 'System specs',
  code: 'RIG-01',
  pc: [
    { label: 'Processor', value: 'AMD Ryzen 5 7600X' },
    { label: 'Graphics card', value: 'NVIDIA GeForce RTX 4070 SUPER Founders Edition' },
    { label: 'Motherboard', value: 'MSI B650 Gaming Plus WiFi' },
    { label: 'RAM', value: 'Corsair Vengeance RGB DDR5 32GB' },
    { label: 'CPU cooler', value: 'DeepCool Infinity Series LS520' },
    { label: 'Power supply', value: 'Corsair CX750 80+ Bronze' },
    { label: 'OS', value: 'Windows 11' },
    { label: 'Monitor', value: 'LG 34UM68-P' },
    { label: 'Headset', value: 'Sennheiser Momentum 4' },
    { label: 'Controller', value: 'Steam Controller' },
  ],
  /** Shown as tags under the PC specs: modern first, then retro handhelds and consoles */
  platforms: ['Steam Deck', 'Nintendo Switch', 'Nintendo 3DS', 'Nintendo DSi', 'PS3', 'PSP'],
};
