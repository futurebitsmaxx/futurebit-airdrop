'use client';

import { useEffect } from 'react';

const ZONE_ID = 'gsmkd1asq';
const SCRIPT_SRC = 'https://static.ackcdn.com/js/aclib.js';
const SCRIPT_ID  = 'aclib-global-js';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    aclib?: any;
  }
}

export default function AdcashAutoTag() {
  useEffect(() => {
    // If aclib already ready, just fire the tag
    if (window.aclib) {
      try { window.aclib.runAutoTag({ zoneId: ZONE_ID }); } catch { /* ignore */ }
      return;
    }

    // Inject aclib.js once
    if (!document.getElementById(SCRIPT_ID)) {
      const s = document.createElement('script');
      s.id   = SCRIPT_ID;
      s.src  = SCRIPT_SRC;
      s.type = 'text/javascript';
      document.body.appendChild(s);
    }

    // Poll every 100 ms until aclib appears (max 10 s)
    let attempts = 0;
    const timer = setInterval(() => {
      attempts++;
      if (window.aclib) {
        clearInterval(timer);
        try { window.aclib.runAutoTag({ zoneId: ZONE_ID }); } catch { /* ignore */ }
      } else if (attempts >= 100) {
        clearInterval(timer);
      }
    }, 100);

    return () => clearInterval(timer);
  }, []);

  return null;
}
