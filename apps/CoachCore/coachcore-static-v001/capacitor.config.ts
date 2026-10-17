import type { CapacitorConfig } from '@capacitor/cli';

/**
 * Hybrid shell: loads production Netlify URL in the native WebView.
 * Bundle/package must match store docs: com.macksims.coachcore
 * (override with CAPACITOR_APP_ID only for local experiments).
 */
const config: CapacitorConfig = {
  appId: process.env.CAPACITOR_APP_ID || 'com.macksims.coachcore',
  appName: 'CoachCore',
  webDir: 'capacitor-web',
  server: {
    // Trailing slash avoids a 301 (/app → /app/) that can stall some WebViews.
    url: process.env.CAPACITOR_SERVER_URL || 'https://coachcore7.netlify.app/app/',
    cleartext: false,
    allowNavigation: [
      'coachcore7.netlify.app',
      'coachcore.macksims.com',
      '*.macksims.com',
      '*.netlify.app',
      '*.supabase.co',
    ],
  },
  android: {
    allowMixedContent: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      launchAutoHide: true,
      showSpinner: false,
    },
  },
};

export default config;
