'use client';

import { useEffect, useRef, useState } from 'react';
import {
  loadAdSettings,
  getEmbedHtml,
  AD_NETWORK_DEFS,
  type AdNetworkSetting,
} from '@/lib/adNetworksConfig';

type PagePlacement = 'home' | 'guide' | 'stake' | 'airdrop' | 'competition' | 'leaderboard' | 'swap';

interface Props {
  page: PagePlacement;
  className?: string;
}

export default function AdBanner({ page, className = '' }: Props) {
  const [activeNetwork, setActiveNetwork] = useState<{ def: (typeof AD_NETWORK_DEFS)[0]; setting: AdNetworkSetting } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const settings = loadAdSettings();
    for (const setting of settings) {
      if (!setting.enabled) continue;
      if (!setting.placement.includes(page)) continue;
      const def = AD_NETWORK_DEFS.find(d => d.id === setting.networkId);
      if (!def) continue;
      setActiveNetwork({ def, setting });
      break;
    }
  }, [page]);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!activeNetwork || !containerRef.current) return;
    const html = getEmbedHtml(activeNetwork.def, activeNetwork.setting);
    if (!html) return;

    // Safely inject the ad HTML + execute scripts
    const wrapper = containerRef.current;
    wrapper.innerHTML = html;

    // Re-execute any inline scripts injected via innerHTML
    const scripts = wrapper.querySelectorAll('script');
    scripts.forEach(oldScript => {
      const newScript = document.createElement('script');
      Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
      newScript.textContent = oldScript.textContent;
      oldScript.parentNode?.replaceChild(newScript, oldScript);
    });
  }, [activeNetwork]);

  if (!activeNetwork) return null;

  const { setting } = activeNetwork;
  const [w, h] = setting.bannerSize.split('x');

  return (
    <div className={`ad-banner-wrap ${className}`}>
      <span className="ad-banner-label">Advertisement</span>
      <div
        ref={el => {
          containerRef.current = el;
          el?.style.setProperty('--ad-w', `${w}px`);
          el?.style.setProperty('--ad-h', `${h}px`);
        }}
        className="ad-banner-container ad-banner-sized"
      />
    </div>
  );
}
