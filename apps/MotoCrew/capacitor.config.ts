import type { CapacitorConfig } from '@capacitor/cli';

/**
 * Hybrid shell: loads production Netlify URL in the native WebView.
 * Trailing slash avoids redirect edge cases; errorPath covers cold-start network failures.
 */
const PRODUCTION_APP_URL = 'https://motocrewz.netlify.app/';

const config: CapacitorConfig = {
  appId: process.env.CAPACITOR_APP_ID || 'com.chrissims.throttlelink',
  appName: 'MotoCrew',
  webDir: 'capacitor-web',
  server: {
    url: process.env.CAPACITOR_SERVER_URL || PRODUCTION_APP_URL,
    cleartext: false,
    errorPath: 'error.html',
    allowNavigation: [
      'motocrewz.netlify.app',
      '*.netlify.app',
      '*.macksims.com',
      '*.supabase.co',
    ],
  },
  android: {
    allowMixedContent: false,
  },
  ios: {
    contentInset: 'automatic',
  },
};

export default config;
