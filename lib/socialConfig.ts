export interface SocialConfig {
  telegram:  string;
  twitter:   string;
  discord:   string;
  instagram: string;
  youtube:   string;
  facebook:  string;
}

export const SOCIAL_CFG_KEY = 'fbit-admin-social';

export const DEFAULT_SOCIAL_CONFIG: SocialConfig = {
  telegram:  'https://t.me/futurebitstaking',
  twitter:   'https://twitter.com/FutureBitOfficial',
  discord:   'https://discord.gg/futurebit',
  instagram: 'https://instagram.com/futurebitstaking',
  youtube:   '',
  facebook:  '',
};

export function loadSocialConfig(): SocialConfig {
  try {
    const raw = localStorage.getItem(SOCIAL_CFG_KEY);
    return raw ? { ...DEFAULT_SOCIAL_CONFIG, ...JSON.parse(raw) } : { ...DEFAULT_SOCIAL_CONFIG };
  } catch {
    return { ...DEFAULT_SOCIAL_CONFIG };
  }
}

export function saveSocialConfig(cfg: SocialConfig): void {
  try { localStorage.setItem(SOCIAL_CFG_KEY, JSON.stringify(cfg)); } catch { /* ignore */ }
}
