// ─── Ad Network Types ────────────────────────────────────────────────────────

export type AdFormat = 'banner' | 'video' | 'native' | 'push' | 'all';

export interface AdNetworkDef {
  id:            string;
  name:          string;
  icon:          string;
  format:        AdFormat[];
  minPayout:     string;
  payment:       string;
  signupUrl:     string;
  description:   string;
  /** How to generate the embed snippet once publisher has a zone ID */
  embedGuide:    string;
}

// ─── All Supported Ad Networks ────────────────────────────────────────────────

export const AD_NETWORK_DEFS: AdNetworkDef[] = [
  {
    id:          'adsense',
    name:        'Google AdSense',
    icon:        '🔵',
    format:      ['banner', 'native'],
    minPayout:   '$100',
    payment:     'Bank / Wire',
    signupUrl:   'https://adsense.google.com',
    description: 'World\'s largest display ad network. Best for general traffic.',
    embedGuide:  'Enter your Publisher ID (ca-pub-XXXXXXXXXXXXXXXX) and Ad Unit ID.',
  },
  {
    id:          'coinzilla',
    name:        'Coinzilla',
    icon:        '🟡',
    format:      ['banner', 'native', 'video'],
    minPayout:   '€50',
    payment:     'BTC, ETH, Wire',
    signupUrl:   'https://coinzilla.io',
    description: 'Top crypto ad network. High CPM for crypto sites. Excellent fill rates.',
    embedGuide:  'Enter your Zone ID from Coinzilla dashboard.',
  },
  {
    id:          'bitmedia',
    name:        'Bitmedia',
    icon:        '🟠',
    format:      ['banner', 'native'],
    minPayout:   '$20',
    payment:     'BTC, ETH, USDT',
    signupUrl:   'https://bitmedia.io',
    description: 'Crypto-focused display ads. Low payout threshold. Fast approval.',
    embedGuide:  'Enter your Zone ID from Bitmedia publisher portal.',
  },
  {
    id:          'cointraffic',
    name:        'Cointraffic',
    icon:        '🟣',
    format:      ['banner', 'native'],
    minPayout:   '€50',
    payment:     'BTC, Wire',
    signupUrl:   'https://cointraffic.io',
    description: 'Premium crypto ad network. High quality crypto advertisers only.',
    embedGuide:  'Enter your Site ID from Cointraffic publisher dashboard.',
  },
  {
    id:          'aads',
    name:        'A-ADS (Anonymous Ads)',
    icon:        '🔶',
    format:      ['banner'],
    minPayout:   '$0',
    payment:     'BTC (daily)',
    signupUrl:   'https://a-ads.com',
    description: 'Bitcoin-based anonymous ad network. No minimum payout. Daily BTC payments.',
    embedGuide:  'Enter your Ad Unit ID from A-ADS (e.g. 123456).',
  },
  {
    id:          'coinnetwork',
    name:        'Coin.Network',
    icon:        '🟢',
    format:      ['banner', 'native'],
    minPayout:   '$25',
    payment:     'BTC, ETH, PayPal',
    signupUrl:   'https://coin.network',
    description: 'Blockchain & crypto ad network. Good rates for DeFi content.',
    embedGuide:  'Enter your Publisher Zone ID from Coin.Network.',
  },
  {
    id:          'adcash',
    name:        'Adcash',
    icon:        '🔴',
    format:      ['banner', 'native', 'push', 'video'],
    minPayout:   '$25',
    payment:     'BTC, Wire, PayPal, Skrill',
    signupUrl:   'https://adcash.com',
    description: 'Global ad network with crypto support. Multiple ad formats including video.',
    embedGuide:  'Enter your Zone ID from Adcash publisher panel.',
  },
  {
    id:          'monetag',
    name:        'Monetag (PropellerAds)',
    icon:        '🟤',
    format:      ['push', 'native', 'video'],
    minPayout:   '$5',
    payment:     'PayPal, Payoneer, Wire',
    signupUrl:   'https://monetag.com',
    description: 'High fill rate push + video ads. Very low payout threshold. Good for all traffic.',
    embedGuide:  'Enter your Zone/Site ID from Monetag dashboard.',
  },
  {
    id:          'ylliX',
    name:        'ylliX',
    icon:        '⚫',
    format:      ['banner', 'video', 'push'],
    minPayout:   '$1',
    payment:     'PayPal, Payoneer, Wire, BTC',
    signupUrl:   'https://yllix.com',
    description: 'High payout rates. Instant approval. Great for crypto niche content.',
    embedGuide:  'Enter your Publisher ID from ylliX dashboard.',
  },
  {
    id:          'custom',
    name:        'Custom Ad Network',
    icon:        '⚙️',
    format:      ['banner', 'video', 'native'],
    minPayout:   'Varies',
    payment:     'Varies',
    signupUrl:   '',
    description: 'Paste your own custom ad network HTML/JS embed code.',
    embedGuide:  'Paste the full HTML embed code from your ad network.',
  },
];

// ─── Per-Network Config (saved by admin) ──────────────────────────────────────

export interface AdNetworkSetting {
  networkId:     string;
  enabled:       boolean;
  publisherId:   string;   // Publisher / Site ID
  zoneId:        string;   // Zone / Ad Unit ID
  videoZoneId:   string;   // Video-specific zone (if different)
  customCode:    string;   // Custom HTML embed code (for 'custom' network)
  bannerSize:    '728x90' | '300x250' | '320x50' | '160x600' | '300x600';
  placement:     ('home' | 'guide' | 'stake' | 'airdrop' | 'competition' | 'leaderboard' | 'swap')[];
}

export const AD_SETTINGS_KEY = 'fbit-ad-networks-cfg';

export const DEFAULT_AD_SETTING = (networkId: string): AdNetworkSetting => ({
  networkId,
  enabled:     false,
  publisherId: '',
  zoneId:      '',
  videoZoneId: '',
  customCode:  '',
  bannerSize:  '728x90',
  placement:   ['home', 'guide', 'stake', 'airdrop', 'competition', 'leaderboard', 'swap'],
});

// ─── Load / Save ──────────────────────────────────────────────────────────────

export function loadAdSettings(): AdNetworkSetting[] {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(AD_SETTINGS_KEY) : null;
    if (!raw) return AD_NETWORK_DEFS.map(n => DEFAULT_AD_SETTING(n.id));
    const saved = JSON.parse(raw) as AdNetworkSetting[];
    // Merge saved with any new networks added later
    return AD_NETWORK_DEFS.map(n => {
      const found = saved.find(s => s.networkId === n.id);
      return found ?? DEFAULT_AD_SETTING(n.id);
    });
  } catch {
    return AD_NETWORK_DEFS.map(n => DEFAULT_AD_SETTING(n.id));
  }
}

export function saveAdSettings(settings: AdNetworkSetting[]): void {
  try { localStorage.setItem(AD_SETTINGS_KEY, JSON.stringify(settings)); } catch { /* ignore */ }
}

// ─── Generate embed HTML for a network ───────────────────────────────────────

export function getEmbedHtml(def: AdNetworkDef, setting: AdNetworkSetting): string {
  const { zoneId, publisherId, bannerSize, customCode } = setting;
  const [w, h] = bannerSize.split('x');

  switch (def.id) {
    case 'adsense':
      if (!publisherId || !zoneId) return '';
      return `<ins class="adsbygoogle" style="display:inline-block;width:${w}px;height:${h}px" data-ad-client="${publisherId}" data-ad-slot="${zoneId}"></ins><script>(adsbygoogle=window.adsbygoogle||[]).push({});</script>`;

    case 'coinzilla':
      if (!zoneId) return '';
      return `<script async src="//coinzilla.io/media/script/coinzilla.js"></script><div class="czillazone" data-czid="${zoneId}" style="width:${w}px;height:${h}px;"></div>`;

    case 'bitmedia':
      if (!zoneId) return '';
      return `<script async src="https://ad-delivery.net/bitmedia.js" data-zone="${zoneId}"></script><div id="bm_zone_${zoneId}" style="width:${w}px;height:${h}px;"></div>`;

    case 'cointraffic':
      if (!zoneId) return '';
      return `<script async src="https://ct.cointraffic.io/scripts/zone.js" data-ct-id="${zoneId}"></script><div class="ct_zone_${zoneId}" style="width:${w}px;height:${h}px;"></div>`;

    case 'aads':
      if (!zoneId) return '';
      return `<iframe src="//a-ads.com/${zoneId}?size=${bannerSize}" style="width:${w}px;height:${h}px;border:0;padding:0;overflow:hidden;background-color:transparent;" scrolling="no" frameborder="0"></iframe>`;

    case 'coinnetwork':
      if (!zoneId) return '';
      return `<div id="cn_${zoneId}" style="width:${w}px;height:${h}px;"></div><script async src="https://coinnetwork.me/ad/${zoneId}.js"></script>`;

    case 'adcash':
      if (!zoneId) return '';
      return `<script async src="//static.ackcdn.com/js/aclib.js"></script><script>aclib.runBanner({zoneId:'${zoneId}'});</script>`;

    case 'monetag':
      if (!zoneId) return '';
      return `<div id="container-${zoneId}"></div><script async src="https://monetag.com/js/ptag.js?site_id=${zoneId}"></script>`;

    case 'ylliX':
      if (!publisherId) return '';
      return `<script async src="https://yllix.com/publishers/${publisherId}/banner" type="text/javascript"></script>`;

    case 'custom':
      return customCode || '';

    default:
      return '';
  }
}
