import type { CapacitorConfig } from '@capacitor/cli';

/**
 * Hybrid shell: loads production Netlify URL in the native WebView.
 * Store bundle/package: com.chrissims.throttlelink (MotoCrew / ThrottleLink).
 */
const config: CapacitorConfig = {
  appId: process.env.CAPACITOR_APP_ID || 'com.chrissims.throttlelink',
  appName: 'MotoCrew',
  webDir: 'capacitor-web',
  server: {
    url: process.env.CAPACITOR_SERVER_URL || 'https://motocrewz.netlify.app',
    cleartext: false,
    allowNavigation: [
      'motocrewz.netlify.app',
      'motocrew.macksims.com',
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
