import type { CapacitorConfig } from '@capacitor/cli';

/**
 * Hybrid shell: loads production Netlify URL in the native WebView.
 * Use trailing slash on /app/ — Next export uses trailingSlash and a 301 from /app
 * has caused blank WebViews on cold launch.
 */
const PRODUCTION_APP_URL = 'https://coachcore7.netlify.app/app/';

const config: CapacitorConfig = {
  appId: process.env.CAPACITOR_APP_ID || 'com.chrissims.coachcore',
  appName: 'CoachCore',
  webDir: 'capacitor-web',
  server: {
    url: process.env.CAPACITOR_SERVER_URL || PRODUCTION_APP_URL,
    cleartext: false,
    errorPath: 'error.html',
    allowNavigation: [
      'coachcore7.netlify.app',
      '*.netlify.app',
      'coachcore.macksims.com',
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
