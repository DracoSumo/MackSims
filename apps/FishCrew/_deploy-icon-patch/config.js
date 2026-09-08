window.FISHCREW_CONFIG = {
  VERSION: '0.8.0',
  // Demo/sample content (fake users, trips, feed posts) only loads when this
  // is explicitly true. Production/beta builds must keep it false.
  DEMO_MODE: false,
  USE_SUPABASE: true,
  SUPABASE_URL: 'https://kkyuychvitrmtehvzqfd.supabase.co',
  SUPABASE_ANON_KEY: 'sb_publishable_79cbXXS2mDw81U-4NrremA_kbsPMx2h',
  STORAGE_BUCKET: 'fishcrew-media',
  MEDIA_BUCKET: 'fishcrew-media',
  APP_NAME: 'FishCrew',
  BUILD_TARGET: 'native-shell', // pwa, web, native-shell
  WEB_CANONICAL_URL: 'https://fishcrew.macksims.com/',
  ENABLE_PWA_INSTALL: true,
  ENABLE_NATIVE_APP_HANDOFF: false,
  DATA_ADAPTER_MODE: 'dual-mode',
  ENABLE_BACKEND_TEST_HARNESS: true,
  ENABLE_RELEASE_GATE: true,
  ENABLE_MEDIA_MODERATION: true,
  ENABLE_SUPABASE_LIVE_CORE: true,
  ENABLE_REALTIME_SYNC: true,
  LIVE_CORE_VERSION: '0.8.0',
  SUPPORT_EMAIL: 'support@fishcrew.app',
  MAX_LOCAL_UPLOAD_MB: 6,
  MAX_IMAGE_UPLOAD_MB: 10,
  MAX_VIDEO_UPLOAD_MB: 50,
  ENABLE_PLUGIN_MANIFEST: true,
  ENABLE_SOCIAL_SHARE_PORTS: true,
  // Production: email/password is primary. OAuth providers stay off until keys
  // are real and Supabase Auth providers are enabled.
  ENABLE_OAUTH_COMPLETION: false,
  ENABLE_GOOGLE_AUTH: false,
  ENABLE_FACEBOOK_AUTH: false,
  // Meta Instagram Graph connect (NOT a login lane). Set META_APP_ID and flip
  // ENABLE_INSTAGRAM_OAUTH once the Meta app + Valid OAuth Redirect URI match.
  // Static SPA uses client-side response_type=token; production with a secret
  // should prefer a server callback that exchanges code → long-lived token.
  META_APP_ID: '956207094120610',
  ENABLE_INSTAGRAM_OAUTH: true,
  META_INSTAGRAM_REDIRECT_URI: 'https://fishcrew.macksims.com/',
  META_GRAPH_VERSION: 'v21.0',
  SHOW_BETA_BANNER: false,
  ENABLE_WEATHER_PLUGIN: true,
  ENABLE_MAP_PLUGIN: true,
  ENABLE_NEWS_PLUGIN: true,
  ENABLE_GUIDE_DATA_PLUGIN: true,
  ENABLE_LOCATION_MEDIA_PLUGIN: true,
  OAUTH_REDIRECT_PATH: '/',
  PLUGIN_STATUS: {
    supabase: 'live',
    googleAuth: 'coming-soon',
    facebookAuth: 'coming-soon',
    instagramConnect: 'config-gated-oauth',
    instagramShare: 'caption-handoff-ready',
    facebookShare: 'web-share-ready',
    xShare: 'web-share-ready',
    nativeShare: 'navigator-share-ready',
    tripInviteShare: 'live',
    maps: 'google-maps-search-live',
    weather: 'open-meteo-live',
    waterNews: 'static-cards',
    guideDirectory: 'static-library',
    locationMedia: 'area-photo-map-ready',
    fishId: 'assistive-stub',
    measureTool: 'assistive-stub'
  }
};
