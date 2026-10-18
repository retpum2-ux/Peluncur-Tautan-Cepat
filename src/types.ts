export interface LinkItem {
  id: string;
  title: string;
  url: string;
  description?: string;
  createdAt: number;
}

export interface GroupItem {
  id: string;
  title: string;
  colorKey: string;
  links: LinkItem[];
}

export type BaseThemeId = 'cerah-putih' | 'cerah-langit' | 'cerah-mint' | 'cerah-krem' | 'cerah-lavender' | 'cerah-peachy';

export interface AppSettings {
  baseTheme: BaseThemeId;
  openInNewTab: boolean;
  showFavicons: boolean;
  boxScrollHeight: 'sedang' | 'tinggi' | 'bebas';
}

export interface GroupColorTheme {
  id: string;
  name: string;
  cardBg: string;
  cardBorder: string;
  headerBg: string;
  headerText: string;
  itemBg: string;
  itemBorder: string;
  itemHover: string;
  itemText: string;
  itemUrlText: string;
  buttonBg: string;
  buttonHover: string;
  buttonText: string;
  badgeBg: string;
  badgeText: string;
  accentRing: string;
}
