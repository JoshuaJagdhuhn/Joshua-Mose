export type MenuSectionId =
  | 'whats-in-my-bag'
  | 'neue-nase'
  | 'imposter'
  | 'apple-music'
  | 'spotify'
  | 'instagram'
  | 'youtube'
  | 'wo-ist-meine-hose'
  | 'mose-generator';

export type SectionId =
  | 'home'
  | MenuSectionId
  | 'impressum'
  | 'datenschutz';

export interface MenuItem {
  id: MenuSectionId;
  label: string;
  href?: string;
}
