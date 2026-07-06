import type { CapacitorConfig } from '@capacitor/cli';

/**
 * Hybrid shell: loads production Netlify URL in the native WebView.
 * Set CAPACITOR_APP_ID before store signing (bundle ID is TBD — see docs/store-launch/apps/throttlelink/).
 * Dev placeholder below is NOT a store bundle ID.
 */
const config: CapacitorConfig = {
  appId: process.env.CAPACITOR_APP_ID || 'com.macksims.motocrew',
  appName: 'MotoCrew',
  webDir: 'capacitor-web',
  server: {
    url: process.env.CAPACITOR_SERVER_URL || 'https://motocrewz.netlify.app',
    cleartext: false,
  },
  android: {
    allowMixedContent: false,
  },
};

export default config;
