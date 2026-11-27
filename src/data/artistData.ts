import { MenuItem } from '../types';

export const WHATS_IN_MY_BAG_IMAGE =
  '/assets/aistudio/800x800-7134493--1FDFE45A-3D80-44F1-8FD3E9E5FF2D9515--0--681867--Zeichenflache3100x_b77cddf3.jpg';

export const NEUE_NASE_IMAGE =
  '/assets/aistudio/800x800-7134493--2313F3DB-36DF-4E02-BE66DCB7EB1E7718--0--16872976--Zeichenflache172x_c567065f.jpg';

export const IMPOSTER_IMAGE =
  '/assets/aistudio/800x800-7134493--7A851511-4CE4-4A83-AA1A6C43D931AED6--0--2823363--IMG7837_26c4c8e2.jpg';

export const BOTTOM_MENU_ITEMS: MenuItem[] = [
  { id: 'whats-in-my-bag', label: 'NEUE SINGLE: What‘s In My Bag' },
  { id: 'neue-nase', label: 'Neue Nase' },
  { id: 'imposter', label: 'Imposter' },
];

export const TOP_RIGHT_MENU_ITEMS: MenuItem[] = [
  { id: 'mose-generator', label: 'Mose Generator' },
  {
    id: 'spotify',
    label: 'Spotify',
    href: 'https://open.spotify.com/intl-de/artist/6SAdf0kYmtfjq56ECCSj1a?si=6XxvKnFaTKGR-puAEdyByA',
  },
  {
    id: 'apple-music',
    label: 'Apple Music',
    href: 'https://music.apple.com/de/artist/joshua-mose/1747546744',
  },
  {
    id: 'instagram',
    label: 'Instagram',
    href: 'https://www.instagram.com/moseohnehose/',
  },
  {
    id: 'youtube',
    label: 'Youtube',
    href: 'https://www.youtube.com/@moseohnehose',
  },
  { id: 'wo-ist-meine-hose', label: 'Wo ist meine Hose?' },
];

export interface WallpaperOption {
  id: string;
  label: string;
  lines: string[];
}

export const WALLPAPER_OPTIONS: WallpaperOption[] = [
  {
    id: 'ein-geiler',
    label: 'ein Geiler',
    lines: ['Joshua Mose', 'ist', 'ein Geiler'],
  },
  {
    id: 'papi-chulo',
    label: 'Papi chulo',
    lines: ['Joshua Mose', 'ist', 'Papi chulo'],
  },
  {
    id: 'der-schoenste',
    label: 'der Schönste',
    lines: ['Joshua Mose', 'ist', 'der Schönste'],
  },
  {
    id: 'mein-favorite-popstar',
    label: 'mein favorite Popstar',
    lines: ['Joshua Mose', 'ist mein', 'favorite', 'Popstar'],
  },
];

export const MENU_ITEMS: MenuItem[] = [
  ...BOTTOM_MENU_ITEMS,
  ...TOP_RIGHT_MENU_ITEMS,
];
