import type { CapacitorConfig } from '@capacitor/cli';

/**
 * Hybrid shell: loads production Netlify URL in the native WebView.
 * Set CAPACITOR_APP_ID before store signing (bundle ID is TBD — see docs/store-launch/apps/fairshare/).
 * Dev placeholder below is NOT a store bundle ID — owner must set CAPACITOR_APP_ID / CURBCUE_BUNDLE_ID.
 */
const config: CapacitorConfig = {
  appId: process.env.CAPACITOR_APP_ID || 'com.macksims.curbcue',
  appName: 'CurbCue',
  webDir: 'capacitor-web',
  server: {
    url: process.env.CAPACITOR_SERVER_URL || 'https://fairshare-v03-20260624.netlify.app',
    cleartext: false,
  },
  android: {
    allowMixedContent: false,
  },
};

export default config;
