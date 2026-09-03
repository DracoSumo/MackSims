import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Local static-export shell for BlueStacks / device testing.
 * webDir is Next.js `out/` after `npm run build`. No remote server URL —
 * PrimFit is not on a Netlify site yet. App id is the MackSims test id.
 */
const config: CapacitorConfig = {
  appId: process.env.CAPACITOR_APP_ID || "com.macksims.primfit",
  appName: "PrimFit",
  webDir: "out",
  server: {
    androidScheme: "https",
    hostname: "localhost",
  },
  android: {
    allowMixedContent: true,
    webContentsDebuggingEnabled: true,
    // Default WebView UA includes `; wv)` which YouTube often blocks. Chrome UA keeps embeds playable.
    overrideUserAgent:
      "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
    backgroundColor: "#050508",
  },
  plugins: {
    LocalNotifications: {
      smallIcon: "ic_stat_primfit",
      iconColor: "#7c3aed",
    },
  },
};

export default config;
