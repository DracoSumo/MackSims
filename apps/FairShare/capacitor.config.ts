import type { CapacitorConfig } from '@capacitor/cli';

/**
 * Hybrid shell: loads production Netlify URL in the native WebView.
 * Store bundle/package: com.chrissims.fairshare (CurbCue).
 */
const config: CapacitorConfig = {
  appId: process.env.CAPACITOR_APP_ID || 'com.chrissims.fairshare',
  appName: 'CurbCue',
  webDir: 'capacitor-web',
  server: {
    url: process.env.CAPACITOR_SERVER_URL || 'https://fairshare-v03-20260624.netlify.app',
    cleartext: false,
    allowNavigation: [
      'fairshare-v03-20260624.netlify.app',
      'fairshare.macksims.com',
      '*.netlify.app',
      '*.macksims.com',
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
