import type { CapacitorConfig } from '@capacitor/cli';

/**
 * Hybrid shell: loads production Netlify URL in the native WebView.
 * Store bundle/package: com.chrissims.sermonstudio.
 */
const config: CapacitorConfig = {
  appId: process.env.CAPACITOR_APP_ID || 'com.chrissims.sermonstudio',
  appName: 'Sermon Studio',
  webDir: 'capacitor-web',
  server: {
    url: process.env.CAPACITOR_SERVER_URL || 'https://sermon-studio-beta.netlify.app',
    cleartext: false,
    allowNavigation: [
      'sermon-studio-beta.netlify.app',
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
