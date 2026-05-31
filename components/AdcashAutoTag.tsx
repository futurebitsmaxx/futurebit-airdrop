'use client';

import { useEffect } from 'react';

const ZONE_ID    = 'gsmkd1asq';
const SCRIPT_ID  = 'aclib-autotag-js';
const SCRIPT_SRC = 'https://static.ackcdn.com/js/aclib.js';

export default function AdcashAutoTag() {
  useEffect(() => {
    // Prevent double-loading across navigations
    if (document.getElementById(SCRIPT_ID)) {
      // Library already present — just run the tag
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).aclib?.runAutoTag({ zoneId: ZONE_ID });
      } catch { /* ignore */ }
      return;
    }

    // Create <script type="text/javascript" src="...aclib.js"></script>
    // and append to <body> exactly as Adcash instructs
    const script = document.createElement('script');
    script.id   = SCRIPT_ID;
    script.type = 'text/javascript';
    script.src  = SCRIPT_SRC;
    script.async = true;

    script.onload = () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).aclib.runAutoTag({ zoneId: ZONE_ID });
      } catch { /* ignore */ }
    };

    script.onerror = () => {
      // Remove failed script so it can retry on next mount
      document.getElementById(SCRIPT_ID)?.remove();
    };

    document.body.appendChild(script);
  }, []);

  return null;
}
