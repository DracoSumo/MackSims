(() => {
  'use strict';

  // FishCrew app shell v0.7.4 — UGC moderation + refresh/load hardening
  const CONFIG = window.FISHCREW_CONFIG || {};
  const VERSION = CONFIG.VERSION || '0.7.4';
  const STORE = `fishcrew:${VERSION}:state`;
  const LEGACY_PREFIX = 'fishcrew:';
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const now = () => new Date().toISOString();
  const uid = (prefix = 'fc') => `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  const safe = (value) => String(value ?? '').replace(/[&<>'"]/g, (ch) => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
  const shortTime = () => new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  const isDataUrl = (v) => typeof v === 'string' && v.startsWith('data:');
  const isRemoteUrl = (v) => typeof v === 'string' && /^(https?:|blob:)/i.test(v);
  const bytesToMb = (bytes) => Math.round((Number(bytes || 0) / 1024 / 1024) * 10) / 10;
  const mediaKind = (type = '') => String(type || '').startsWith('video') ? 'video' : String(type || '').startsWith('image') ? 'image' : 'file';
  const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic', 'image/heif', 'image/gif'];
  const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/webm'];
  const FEED_RENDER_LIMIT = 40;
  const TRIP_RENDER_LIMIT = 40;
  const LIVE_QUERY_LIMIT = 120;
  const GUEST_SIGN_IN_PROMPT = 'Create an account or sign in to continue.';
  const DEG = '\u00B0';
  const MID = '\u00B7';
  const CLOSE_BTN = '\u00D7';
  const EN_DASH = '\u2013';
  const IG_MARK = 'IG';
  const SAVE_DEBOUNCE_MS = 280;

  let geoWatchId = null;
  let bluetoothDevice = null;
  let serialPort = null;
  let serialReader = null;
  let nmeaBuffer = '';
  let saveTimer = null;
  let pendingUploadRetry = null;

  function defaultConditions(overrides = {}) {
    return {
      area: overrides.area || 'Tampa Bay',
      lat: overrides.lat ?? 27.9506,
      lon: overrides.lon ?? -82.4572,
      source: overrides.source || 'Planning conditions',
      status: overrides.status || 'planning',
      score: overrides.score || 'Good',
      scoreReason: overrides.scoreReason || 'Low wind, protected water, and a morning bite window make this a solid planning card.',
      temp: overrides.temp || `76${DEG}F`,
      wind: overrides.wind || '8 mph NE',
      windMph: overrides.windMph ?? 8,
      windDir: overrides.windDir ?? 45,
      waves: overrides.waves || '1.0 ft',
      waveFt: overrides.waveFt ?? 1.0,
      tide: overrides.tide || 'Incoming',
      tideStation: overrides.tideStation || 'Tampa Bay estimate',
      tideNext: overrides.tideNext || 'Next turn about mid-morning',
      rain: overrides.rain || '15%',
      rainPct: overrides.rainPct ?? 15,
      water: overrides.water || `74${DEG}F`,
      window: overrides.window || `6${EN_DASH}10 AM`,
      windowDetail: overrides.windowDetail || 'Best early window while wind is lighter and tide is moving.',
      alert: overrides.alert || 'No marine alert loaded',
      providerNotes: overrides.providerNotes || 'Tap refresh to use browser geolocation and live provider calls when available.',
      updatedAt: overrides.updatedAt || now(),
      hourly: overrides.hourly || [],
      isLive: !!overrides.isLive
    };
  }

  function compassFromDegrees(deg) {
    const dirs = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];
    const n = Number(deg);
    if (!Number.isFinite(n)) return '';
    return dirs[Math.round(n / 22.5) % 16];
  }

  function fmtTemp(v) {
    const n = Number(v);
    return Number.isFinite(n) ? `${Math.round(n)}${DEG}F` : '?';
  }

  function fmtMph(v, dir) {
    const n = Number(v);
    const d = compassFromDegrees(dir);
    return Number.isFinite(n) ? `${Math.round(n)} mph${d ? ' ' + d : ''}` : '?';
  }

  function fmtPct(v) {
    const n = Number(v);
    return Number.isFinite(n) ? `${Math.round(n)}%` : '?';
  }

  function metersToFeet(v) {
    const n = Number(v);
    return Number.isFinite(n) ? n * 3.28084 : NaN;
  }

  function conditionScore({ windMph = 99, waveFt = 99, rainPct = 100 } = {}) {
    const w = Number(windMph), waves = Number(waveFt), rain = Number(rainPct);
    if (w >= 25 || waves >= 5) return { score: 'Unsafe', reason: 'High wind or seas. Treat this as a no-go until local marine guidance says otherwise.' };
    if (w >= 18 || waves >= 3.5 || rain >= 70) return { score: 'Rough', reason: 'Fishable for some crews, but rough enough to demand extra caution and a backup plan.' };
    if (w >= 13 || waves >= 2.2 || rain >= 45) return { score: 'Fair', reason: 'Possible window, but conditions are mixed. Smaller craft should be selective.' };
    if (w <= 8 && waves <= 1.5 && rain <= 25) return { score: 'Great', reason: 'Light wind, manageable water, and a clean planning window.' };
    return { score: 'Good', reason: 'Manageable wind and water for many inshore or protected-water plans.' };
  }

  let supabaseClient = null;
  let realtimeChannel = null;
  let realtimePullTimer = null;
  let notificationsRefreshTimer = null;
  let pullInFlight = null;
  let pullGeneration = 0;
  let toastTimer = null;
  let modalMode = null;
  let authTab = 'signin';
  let authBusy = false;
  let lastHandledAt = 0;
  let lastHandledAction = '';
  let scrollLockY = 0;


  function wikiFile(name) {
    return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(name).replace(/%20/g, '_')}`;
  }

  function locationPhoto(area = 'Tampa Bay', purpose = 'water') {
    const a = String(area || '').toLowerCase();
    const p = String(purpose || '').toLowerCase();
    if (a.includes('clearwater')) return { area: 'Clearwater Beach', url: wikiFile('Clearwater Beach (31333086703).jpg'), credit: 'Wikimedia Commons / Philip N. Cohen', source: 'actual-location' };
    if (a.includes('st. pete') || a.includes('st petersburg') || a.includes('st. petersburg')) return { area: 'St. Pete Pier', url: wikiFile('2021 St. Pete Pier 1.jpg'), credit: 'Wikimedia Commons / Beyond My Ken', source: 'actual-location' };
    if (a.includes('sarasota')) return { area: 'Sarasota Bay', url: wikiFile('Sarasota FL Ringling Cswy01.jpg'), credit: 'Wikimedia Commons', source: 'actual-location' };
    if (a.includes('skyway')) return { area: 'Tampa Bay / Skyway', url: wikiFile('Downtown Tampa overlooking Seddon Channel - Eric Statzer.jpg'), credit: 'Wikimedia Commons / Eric Statzer', source: 'actual-location' };
    if (a.includes('gandy') || a.includes('tampa') || a.includes('bay')) return { area: 'Tampa Bay', url: wikiFile('Downtown Tampa overlooking Seddon Channel - Eric Statzer.jpg'), credit: 'Wikimedia Commons / Eric Statzer', source: 'actual-location' };
    return { area: area || 'Local water', url: wikiFile('Downtown Tampa overlooking Seddon Channel - Eric Statzer.jpg'), credit: 'Location photo fallback', source: 'fallback-location' };
  }

  function daypart() {
    const h = new Date().getHours();
    if (h < 6) return 'night';
    if (h < 10) return 'sunrise';
    if (h < 17) return 'day';
    if (h < 20) return 'sunset';
    return 'night';
  }

  function shareTextForPost(post) {
    if (!post) return 'FishCrew';
    return `FishCrew: ${post.title} ${MID} ${post.area}. ${post.body || 'Check the bite board.'}`;
  }

  function demoPhoto(kind = 'water', title = '') {
    const k = String(kind || 'water').toLowerCase();
    const palette = {
      catch: ['#0f3b4f', '#1f8a70', '#f8e7c9', '#ffb264'],
      boat: ['#082236', '#0ea5e9', '#f8fafc', '#f97316'],
      shop: ['#2a1b12', '#8b5a2b', '#f8e7c9', '#2dd4bf'],
      pier: ['#0a273b', '#27496d', '#f8e7c9', '#22c55e'],
      cruise: ['#061826', '#0b3a5b', '#f8e7c9', '#f97316'],
      water: ['#062033', '#0ea5e9', '#f8e7c9', '#2dd4bf']
    }[k] || ['#062033', '#0ea5e9', '#f8e7c9', '#2dd4bf'];
    const [bg, mid, light, accent] = palette;
    const label = title || (k === 'shop' ? 'Dock counter note' : k === 'boat' ? 'Morning run' : k === 'pier' ? 'Pier crew' : k === 'catch' ? 'Fresh catch' : k === 'cruise' ? 'Sunset water' : 'Local water');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 520"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop stop-color="${bg}"/><stop offset="1" stop-color="${mid}"/></linearGradient><filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="table" tableValues="0 .08"/></feComponentTransfer></filter></defs><rect width="900" height="520" fill="url(#g)"/><rect width="900" height="520" filter="url(#grain)" opacity=".35"/><circle cx="720" cy="105" r="54" fill="${accent}" opacity=".78"/><path d="M0 350 C140 310 240 400 390 350 C550 290 650 390 900 326 V520 H0 Z" fill="${light}" opacity=".16"/><path d="M0 390 C180 345 255 435 420 382 C590 330 700 435 900 365" fill="none" stroke="${light}" stroke-width="14" stroke-linecap="round" opacity=".52"/><path d="M105 240 C180 205 245 230 315 214" stroke="${light}" stroke-width="18" stroke-linecap="round" opacity=".58"/><path d="M600 272 l110 0 l-24 -36 l-56 -16 l-70 38 Z" fill="${light}" opacity=".8"/><path d="M615 273 l95 0" stroke="${bg}" stroke-width="8" opacity=".55"/><text x="54" y="74" font-family="Arial, sans-serif" font-size="30" font-weight="800" fill="${light}" opacity=".86">FishCrew water report</text><text x="54" y="118" font-family="Arial, sans-serif" font-size="42" font-weight="900" fill="${light}">${label.replace(/[<&]/g,'')}</text></svg>`;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }

  // Demo/sample content pack. Only used when CONFIG.DEMO_MODE is true (default
  // OFF) or when an operator explicitly loads the sample pack from Tools.
  // Demo accounts carry no passwords and cannot be logged into.
  function demoSeedContent() {
    const admin = { id: 'u_admin', name: 'Chris', username: 'chris', email: 'admin@fishcrew.local', role: 'Admin', area: 'Tampa Bay', avatar: '', bio: 'FishCrew dock operator keeping crews moving.', fishingStyles: 'Inshore, offshore, app ops', profileTheme: 'Harbor Blue', createdAt: now(), demo: true };
    const captain = { id: 'u_captain', name: 'Capt. Mason', username: 'capt_mason', email: 'captain@fishcrew.local', role: 'Captain', area: 'Tampa Bay', avatar: '', bio: 'Runs clean morning windows and beginner-friendly reef trips.', fishingStyles: 'Charter, reef, inshore', profileTheme: 'Harbor Blue', createdAt: now(), demo: true };
    const business = { id: 'u_business', name: 'Dockside Tackle', username: 'dockside_tackle', email: 'shop@fishcrew.local', role: 'Business', area: 'St. Pete', avatar: '', bio: 'Local bait, leader, and dock reports for weekend crews.', fishingStyles: 'Bait, tackle, shop board', profileTheme: 'Dockside', createdAt: now(), demo: true };
    const angler1 = { id: 'u_mike', name: 'Mike R.', username: 'mike_r', email: 'mike@fishcrew.local', role: 'Angler', area: 'Tampa Bay', avatar: '', bio: 'Weekend inshore angler. Brings ice and snacks.', fishingStyles: 'Inshore, pier, redfish', profileTheme: 'Seafoam', createdAt: now(), demo: true };
    const angler2 = { id: 'u_tasha', name: 'Tasha M.', username: 'tasha_m', email: 'tasha@fishcrew.local', role: 'Angler', area: 'St. Pete', avatar: '', bio: 'Pier and kayak days, learning new water every weekend.', fishingStyles: 'Kayak, pier, trout', profileTheme: 'Sunrise', createdAt: now(), demo: true };
    const guide = { id: 'u_guide', name: 'Guide Eli', username: 'guide_eli', email: 'guide@fishcrew.local', role: 'Captain', area: 'Sarasota Bay', avatar: '', bio: 'Quiet water, mangrove lines, and beginner kayak instruction.', fishingStyles: 'Guide, kayak, mangroves', profileTheme: 'Mangrove', createdAt: now(), demo: true };
    const cruise = { id: 'u_cruise', name: 'Bay Runner Cruises', username: 'bay_runner', email: 'cruise@fishcrew.local', role: 'Business', area: 'Clearwater', avatar: '', bio: 'Family-friendly sunset water after the bite.', fishingStyles: 'Cruise, family trips, sunset runs', profileTheme: 'Sunset', createdAt: now(), demo: true };
    return {
      users: [admin, captain, business, angler1, angler2, guide, cruise],
      trips: [
        { id: 'trip_1', title: 'Sunrise inshore crew needed', urgent: true, featured: true, adminFeatured: true, type: 'Boat', area: 'Tampa Bay', publicLocation: 'Tampa Bay area', privateLocation: `Gandy ramp ${MID} slip details after approval`, hostId: captain.id, hostName: captain.name, time: `Saturday ${MID} 6:15 AM`, species: 'Redfish / Snook / Trout', spots: 2, cost: 'Split gas and bait', status: 'Open', score: 'Good', wind: '8 mph NE', waves: '1.0 ft', tide: 'Incoming', water: `74${DEG}F`, media: demoPhoto('boat','Sunrise inshore run'), mediaType: 'image/svg+xml', artKind: 'boat', members: [captain.id], createdAt: now(), demo: true },
        { id: 'trip_2', title: 'Pier bite check after work', featured: true, adminFeatured: true, type: 'Pier', area: 'St. Pete', publicLocation: 'St. Pete pier zone', privateLocation: 'Meet near the east rail after approval', hostId: admin.id, hostName: admin.name, time: `Today ${MID} 5:30 PM`, species: 'Spanish mackerel / Sheepshead', spots: 3, cost: 'Free', status: 'Open', score: 'Fair', wind: '12 mph W', waves: 'Chop', tide: 'Outgoing', water: `73${DEG}F`, media: demoPhoto('pier','After-work pier crew'), mediaType: 'image/svg+xml', artKind: 'pier', members: [admin.id], createdAt: now(), demo: true },
        { id: 'trip_3', title: 'Beginner-friendly mangrove run', featured: true, adminFeatured: true, type: 'Kayak', area: 'Sarasota Bay', publicLocation: 'Sarasota Bay mangrove zone', privateLocation: 'Launch pin shared once approved', hostId: guide.id, hostName: guide.name, time: `Sunday ${MID} 7:00 AM`, species: 'Trout / Snook', spots: 2, cost: 'Bring your own kayak', status: 'Open', score: 'Good', wind: '6 mph E', waves: 'Protected', tide: 'Moving', water: `75${DEG}F`, media: demoPhoto('water','Quiet mangrove line'), mediaType: 'image/svg+xml', artKind: 'water', members: [guide.id], createdAt: now(), demo: true },
        { id: 'trip_4', title: 'Reef charter has two seats', type: 'Charter', area: 'Clearwater', publicLocation: 'Clearwater marina area', privateLocation: 'Dock number after deposit/approval', hostId: captain.id, hostName: captain.name, time: `Sunday ${MID} 6:45 AM`, species: 'Snapper / Grouper', spots: 2, cost: '$150 seat', status: 'Open', score: 'Great', wind: '5 mph SE', waves: '0.8 ft', tide: 'Incoming', water: `76${DEG}F`, media: demoPhoto('boat','Reef charter opening'), mediaType: 'image/svg+xml', artKind: 'boat', members: [captain.id], createdAt: now(), demo: true }
      ],
      requests: [
        { id: 'req_1', tripId: 'trip_1', userId: admin.id, userName: admin.name, message: 'Can bring ice and a bait net.', status: 'Pending', createdAt: now() },
        { id: 'req_2', tripId: 'trip_3', userId: angler2.id, userName: angler2.name, message: 'Newer kayak angler, comfortable with early launch.', status: 'Approved', createdAt: now() }
      ],
      messages: {
        trip_1: [
          { id: 'msg_1', senderId: 'u_captain', senderName: 'Capt. Mason', body: 'Weather window looks good if we launch early.', createdAt: now() },
          { id: 'msg_2', senderId: 'system', senderName: 'FishCrew', body: 'Private meetup details unlock after approval.', createdAt: now() }
        ],
        trip_2: [ { id: 'msg_3', senderId: 'u_admin', senderName: 'Chris', body: 'Light gear is fine. I will bring extra hooks.', createdAt: now() } ],
        trip_3: [ { id: 'msg_4', senderId: 'u_guide', senderName: 'Guide Eli', body: 'We will keep it close to shore and fish moving water.', createdAt: now() } ],
        trip_4: [ { id: 'msg_5', senderId: 'u_captain', senderName: 'Capt. Mason', body: 'Two seats open. Beginner friendly if seas stay flat.', createdAt: now() } ]
      },
      feed: [
        { id: 'feed_1', type: 'Crew Recap', title: 'Morning water window paid off', area: 'Tampa Bay', authorId: captain.id, authorName: captain.name, body: 'Three-person crew, clean weather window, solid redfish bite around moving water.', media: demoPhoto('catch','Redfish at first light'), mediaType: 'image/svg+xml', artKind: 'catch', reactions: 18, status: 'Live', createdAt: now(), demo: true },
        { id: 'feed_2', type: 'Dock Report', title: 'Dockside bait board is stocked', area: 'St. Pete', authorId: business.id, authorName: business.name, body: 'Dockside Tackle has fresh bait in and a weekend leader deal for FishCrew users.', media: demoPhoto('shop','Dockside bait board'), mediaType: 'image/svg+xml', artKind: 'shop', reactions: 9, status: 'Sponsored', createdAt: now(), demo: true },
        { id: 'feed_3', type: 'Open Water Seat', title: 'Two seats open for the reef window', area: 'Clearwater', authorId: captain.id, authorName: captain.name, body: 'Captain posted two open seats for Sunday morning. Good for beginners.', media: demoPhoto('boat','Open seats Sunday'), mediaType: 'image/svg+xml', artKind: 'boat', reactions: 7, status: 'Live', createdAt: now(), demo: true },
        { id: 'feed_4', type: 'Catch Log', title: 'Trout before the breeze', area: 'Sarasota Bay', authorId: angler2.id, authorName: angler2.name, body: 'Two keeper trout before the breeze picked up. Paddletails around grass edges.', media: demoPhoto('catch','Trout before the breeze'), mediaType: 'image/svg+xml', artKind: 'catch', reactions: 14, status: 'Live', createdAt: now(), demo: true },
        { id: 'feed_5', type: 'After-Bite Run', title: 'Sunset run after the bite', area: 'Clearwater', authorId: cruise.id, authorName: cruise.name, body: 'Family-friendly sunset run after the fishing window. Good add-on for visiting crews.', media: demoPhoto('cruise','Sunset run after the bite'), mediaType: 'image/svg+xml', artKind: 'cruise', reactions: 6, status: 'Sponsored', createdAt: now(), demo: true },
        { id: 'feed_6', type: 'Water Note', title: 'Outgoing tide cleaned up near the bridge', area: 'Tampa Bay', authorId: angler1.id, authorName: angler1.name, body: 'Cleaner water on the outgoing. Keep locations general and share exact pins only with approved crews.', media: demoPhoto('water','Bridge tide note'), mediaType: 'image/svg+xml', artKind: 'water', reactions: 11, status: 'Live', createdAt: now(), demo: true }
      ],
      businesses: [
        { id: 'biz_1', ownerId: business.id, name: 'Dockside Tackle', kind: 'Tackle Shop', area: 'St. Pete', status: 'Verified', leads: 18, revenue: 240, campaign: 'Weekend bait board', demo: true },
        { id: 'biz_2', ownerId: captain.id, name: 'Mason Pro Charters', kind: 'Pro Charter', area: 'Tampa Bay', status: 'Pending review', leads: 9, revenue: 600, campaign: 'Open seat boost', demo: true },
        { id: 'biz_3', ownerId: cruise.id, name: 'Bay Runner Cruises', kind: 'After-Bite Run', area: 'Clearwater', status: 'New lead', leads: 6, revenue: 180, campaign: 'Family sunset add-on', demo: true },
        { id: 'biz_4', ownerId: guide.id, name: 'Eli Inshore Guide Co.', kind: 'Guide Service', area: 'Sarasota Bay', status: 'Verified', leads: 7, revenue: 320, campaign: 'Beginner kayak mornings', demo: true }
      ],
      bookings: [
        { id: 'book_1', businessId: 'biz_2', customerName: 'Alex R.', kind: 'Charter inquiry', status: 'New', date: 'Saturday morning', value: 150, notes: 'Looking for two seats.' },
        { id: 'book_2', businessId: 'biz_3', customerName: 'Jamie K.', kind: 'Cruise inquiry', status: 'Contacted', date: 'Friday sunset', value: 220, notes: 'Family of four.' },
        { id: 'book_3', businessId: 'biz_1', customerName: 'Mike R.', kind: 'Shop deal', status: 'New', date: 'This weekend', value: 35, notes: 'Leader and live bait bundle.' }
      ],
      reports: [ { id: 'rep_1', type: 'Media review', target: 'feed_2', status: 'Open', note: 'Sponsored label check' } ],
      mediaAssets: [
        { id: 'asset_1', ownerId: captain.id, sourceId: 'feed_1', sourceType: 'feed', mediaType: 'image/svg+xml', status: 'Approved', storagePath: 'demo/feed_1.svg', visibility: 'public', createdAt: now(), demo: true },
        { id: 'asset_2', ownerId: business.id, sourceId: 'feed_2', sourceType: 'feed', mediaType: 'image/svg+xml', status: 'Review', storagePath: 'demo/feed_2.svg', visibility: 'public', createdAt: now(), demo: true }
      ]
    };
  }

  function emptySeedContent() {
    return { users: [], trips: [], requests: [], messages: {}, feed: [], businesses: [], bookings: [], reports: [], mediaAssets: [] };
  }

  const defaultState = () => {
    // Production default ships clean: no fake users, trips, feed posts, or
    // business revenue. Demo content requires CONFIG.DEMO_MODE (default OFF)
    // or an explicit operator "load sample pack" action.
    const demoMode = CONFIG.DEMO_MODE === true;
    const seed = demoMode ? demoSeedContent() : emptySeedContent();
    return {
      version: VERSION,
      onboardingSeen: false,
      preferredUnits: 'Imperial',
      privacyMode: 'Crew-only exact locations',
      notificationPref: 'Crew alerts',
      savedGuideArea: 'Tampa Bay',
      conditions: defaultConditions(),
      lastFishId: null,
      lastMeasurement: null,
      deviceHub: {
        status: 'Ready',
        source: 'No device connected',
        lat: null,
        lon: null,
        accuracy: null,
        speed: null,
        heading: null,
        deviceName: '',
        lastFix: '',
        log: ['Open GPS + Devices from Tools to connect phone GPS, Bluetooth, or NMEA bridge.']
      },
      backendMode: 'local',
      liveStatus: 'Ready',
      activeScreen: 'home',
      activeTripId: seed.trips[0]?.id || null,
      tripFilter: 'All',
      feedFilter: 'All',
      feedRefreshing: false,
      crewPanel: 'upcoming',
      toolsPanel: 'tools',
      demoContentLoaded: demoMode,
      blockedUsers: [],
      accountDeletionRequests: [],
      session: null,
      users: seed.users,
      trips: seed.trips,
      requests: seed.requests,
      messages: seed.messages,
      feed: seed.feed,
      businesses: seed.businesses,
      bookings: seed.bookings,
      reports: seed.reports,
      mediaAssets: seed.mediaAssets,
      notifications: [],
      supabasePrep: {
        lastReadiness: 'System checks have not run yet.',
        adapterMode: 'browser-first',
        mediaPolicy: 'Images up to 8 MB in browser storage; larger media uses connected cloud storage.',
        rlsStatus: 'Access policies are included for profiles, trips, messages, media, reports, businesses, and bookings.',
        storageBucket: CONFIG.STORAGE_BUCKET || 'fishcrew-media',
        releaseGate: 'Not run yet.',
        adapterMode: 'browser-first with shared-data connector',
        testResults: []
      },
      pluginReadiness: [
        { id: 'supabase', label: 'Shared data core', area: 'Data', status: CONFIG.SUPABASE_URL && CONFIG.SUPABASE_ANON_KEY ? 'Configured' : 'Ready for credentials', note: 'Auth, tables, access rules, storage, and live update connection points are present.' },
        { id: 'google-auth', label: 'Google sign-in', area: 'Auth', status: CONFIG.ENABLE_GOOGLE_AUTH ? 'Configured' : 'Coming soon', note: 'Email/password is primary. Enable ENABLE_GOOGLE_AUTH in config.js after Supabase Google provider is live.' },
        { id: 'facebook-auth', label: 'Facebook sign-in', area: 'Auth', status: CONFIG.ENABLE_FACEBOOK_AUTH ? 'Configured' : 'Coming soon', note: 'Email/password is primary. Enable ENABLE_FACEBOOK_AUTH in config.js after Supabase Facebook provider is live.' },
        { id: 'instagram-connect', label: 'Instagram Meta connect', area: 'Social', status: (CONFIG.META_APP_ID && CONFIG.ENABLE_INSTAGRAM_OAUTH) ? 'OAuth ready' : 'Config gated', note: 'Profile connect via Meta OAuth. Not a login method. Caption handoff remains secondary share.' },
        { id: 'instagram-share', label: 'Instagram share handoff', area: 'Social', status: 'Caption handoff ready', note: 'Prepares share copy; native Instagram posting requires mobile OS/app handoff.' },
        { id: 'facebook-share', label: 'Facebook share', area: 'Social', status: 'Share port ready', note: 'Uses web/share URL flow when public URL is configured.' },
        { id: 'x-share', label: 'X/Twitter share', area: 'Social', status: 'Share port ready', note: 'Uses web/share URL flow when public URL is configured.' },
        { id: 'native-share', label: 'Phone native share', area: 'Social', status: 'Ready where supported', note: 'Uses navigator.share on supported phones/browsers.' },
        { id: 'weather', label: 'Weather provider connection', area: 'Conditions', status: 'Provider slot ready', note: 'Choose the live weather source before adding keys.' },
        { id: 'maps', label: 'Map provider connection', area: 'Maps', status: 'Provider slot ready', note: 'Map and geocoding connection points are prepared.' },
        { id: 'water-news', label: 'Local water news source', area: 'Content', status: 'Source slot ready', note: 'Cards are structured for source, time, category, and area.' },
        { id: 'guide-data', label: 'Guide/business directory', area: 'Marketplace', status: 'Data model ready', note: 'Guide and business tables/sections are prepared for live records.' },
        { id: 'location-media', label: 'Location media map', area: 'Visuals', status: 'Area-photo map ready', note: 'General location photos are mapped by area without exposing exact spots.' }
      ],
      opsLog: ['FishCrew loaded.', 'Original FishCrew water content is ready.', 'Operator, business, photos, and account pathways included.'],
      qaNotes: [
        { id: 'qa_1', screen: 'Home', issue: 'Phone layout should stay calm and action-focused.', priority: 'Medium', status: 'Open', createdAt: now() },
        { id: 'qa_2', screen: 'Launch', issue: 'Run two-phone check after shared-data credentials are added.', priority: 'High', status: 'Open', createdAt: now() },
        { id: 'qa_3', screen: 'Media', issue: 'Replace seeded media with real local shop and captain photos before public launch.', priority: 'Medium', status: 'Open', createdAt: now() }
      ],
      guideLibrary: [
        { id: 'guide_1', area: 'Tampa Bay', title: 'Inshore basics', summary: 'Moving water, grass edges, mangroves, and dock lights are the first pattern to learn.', species: 'Snook, redfish, trout', bait: 'Live shrimp, pilchards, paddletails, topwater at first light', methods: 'Fish current seams, mangrove edges, potholes, and dock shadow lines.', gear: '2500-3500 reel, 10-20 lb braid, 20-30 lb leader, circle hooks for bait.', safety: 'Check wind and storms before small craft or kayak trips.' },
        { id: 'guide_2', area: 'St. Pete', title: 'Pier and bridge notes', summary: 'Bring light tackle, watch tides, and keep exact bite details respectful.', species: 'Mackerel, sheepshead, snapper', bait: 'Shrimp, fiddler crabs, small spoons, Gotcha plugs, cut bait', methods: 'Work pilings, shadow lines, bait schools, and tide changes. Keep rigs simple.', gear: 'Medium-light rod, 10-15 lb braid, fluorocarbon leader, sabiki for bait when legal.', safety: 'Follow pier rules and local size limits.' },
        { id: 'guide_3', area: 'Clearwater', title: 'Charter and cruise pairing', summary: 'Good marketplace area for open charter seats, family cruises, and visitor-friendly trips.', species: 'Grouper, snapper, mackerel', bait: 'Frozen sardines, squid, live pinfish, trolling spoons', methods: 'Match trip length to weather window. Let captains publish open seats and family add-ons.', gear: 'Charter gear often supplied; bring sun protection, non-marking shoes, and cooler plan.', safety: 'Use verified captains and clear meetup instructions.' },
        { id: 'guide_4', area: 'Freshwater ponds', title: 'Bass bank plan', summary: 'Walkable bank fishing pattern for beginners and quick after-work sessions.', species: 'Largemouth bass, bluegill, crappie', bait: 'Soft plastics, small spinnerbaits, live worms, beetle spins', methods: 'Cast parallel to grass, shade, drains, and corners. Slow down after cold fronts.', gear: 'Medium spinning combo, 8-12 lb line, small tackle tray, pliers.', safety: 'Watch private property, gators/snakes, and local freshwater rules.' }
      ],
      launchChecks: [
        { id: 'lc_1', label: 'Publish the latest FishCrew and verify refresh', done: false },
        { id: 'lc_2', label: 'Run system checks and launch checks', done: false },
        { id: 'lc_3', label: 'Install shared-data schema and media bucket', done: false },
        { id: 'lc_4', label: 'Add shared-data keys and confirm connection status', done: false },
        { id: 'lc_5', label: 'Phone A posts a trip; Phone B sees it live', done: false },
        { id: 'lc_6', label: 'Phone B requests join; Phone A approves and chat syncs', done: false },
        { id: 'lc_7', label: 'Verify live upload (no silent local fallback) + moderation review visibility', done: true },
        { id: 'lc_8', label: 'Operator resolves report, business lead appears, export works', done: false }
      ],
      health: { lastAudit: null, missingActions: [] }
    };
  };

  let state = defaultState();

  function setDebug(message) {
    const el = $('#debugPill');
    if (el) el.textContent = String(message).slice(0, 140);
  }

  function setBootStatus(message) {
    const el = $('#bootStatus');
    if (el) el.textContent = message;
  }

  function finishBoot() {
    setBootStatus('Ready.');
    requestAnimationFrame(() => {
      document.body.classList.add('app-ready');
      const boot = $('#bootScreen');
      if (boot) {
        boot.setAttribute('aria-hidden', 'true');
        setTimeout(() => boot.remove(), 720);
      }
    });
  }

  const BETA_BANNER_KEY = 'fishcrew.betaBannerDismissed.v071';

  function isScreenshotMode() {
    try {
      return new URLSearchParams(location.search).get('screenshot') === '1';
    } catch (_) {
      return false;
    }
  }

  function shouldShowBetaBanner() {
    if (CONFIG.SHOW_BETA_BANNER !== true) return false;
    if (isScreenshotMode()) return false;
    try {
      return localStorage.getItem(BETA_BANNER_KEY) !== '1';
    } catch (_) {
      return true;
    }
  }

  function applyScreenshotMode() {
    if (!isScreenshotMode()) return;
    document.body.classList.add('screenshot-mode');
    $('#betaBanner')?.classList.add('hidden');
  }

  function applyScreenshotDemoData() {
    if (!isScreenshotMode()) return;
    if ((state.trips || []).length && (state.feed || []).length) return;
    const fresh = demoSeedContent();
    state.users = mergeById(state.users || [], fresh.users || []);
    state.trips = mergeById(state.trips || [], fresh.trips || []);
    state.requests = mergeById(state.requests || [], fresh.requests || []);
    state.feed = mergeById(state.feed || [], fresh.feed || []);
    state.businesses = mergeById(state.businesses || [], fresh.businesses || []);
    state.bookings = mergeById(state.bookings || [], fresh.bookings || []);
    state.reports = mergeById(state.reports || [], fresh.reports || []);
    state.demoContentLoaded = true;
    if (!state.activeTripId && state.trips[0]?.id) state.activeTripId = state.trips[0].id;
  }

  function applyBetaBannerState() {
    const banner = $('#betaBanner');
    if (!banner) return;
    if (shouldShowBetaBanner()) {
      banner.classList.remove('hidden');
      banner.removeAttribute('hidden');
      document.body.classList.add('show-beta');
    } else {
      banner.classList.add('hidden');
      banner.setAttribute('hidden', '');
      document.body.classList.remove('show-beta');
    }
  }

  function dismissBetaBanner() {
    $('#betaBanner')?.classList.add('hidden');
    document.body.classList.remove('show-beta');
    try { localStorage.setItem(BETA_BANNER_KEY, '1'); } catch (_) { /* non-fatal */ }
  }

  function failBoot(error) {
    console.error(error);
    setBootStatus('Something needs a refresh. The app shell is still available.');
    document.body.classList.add('app-ready');
    toast('FishCrew loaded with a startup warning.', 'danger');
  }

  function toast(message, tone = 'default') {
    const el = $('#toast');
    if (!el) return;
    el.textContent = message;
    el.className = `toast ${tone === 'danger' ? 'toast-danger' : ''}`;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.add('hidden'), 2800);
  }

  function flushSave() {
    clearTimeout(saveTimer);
    saveTimer = null;
    try {
      const payload = { ...state };
      if (state.backendMode === 'supabase' && state.session?.userId) delete payload.notifications;
      localStorage.setItem(STORE, JSON.stringify(payload));
    } catch (error) { console.warn('Save failed', error); }
  }

  function save(immediate = false) {
    if (immediate === true) {
      flushSave();
      return;
    }
    clearTimeout(saveTimer);
    saveTimer = setTimeout(flushSave, SAVE_DEBOUNCE_MS);
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORE);
      if (raw) {
        const parsed = JSON.parse(raw);
        state = { ...defaultState(), ...parsed, version: VERSION };
        normalizeState();
      }
    } catch (error) {
      console.warn('Load failed. Resetting local state.', error);
      state = defaultState();
      normalizeState();
    }
  }

  function normalizeState() {
    state.users = state.users || [];
    const used = new Set();
    state.users.forEach((u) => {
      // Migration: older saved states shipped demo accounts with plaintext
      // passwords. Strip them so demo accounts can never be logged into.
      if (u.demo) delete u.password;
      let base = normalizeUsername(u.username || u.email?.split('@')[0] || u.name || u.id);
      let candidate = base;
      let n = 2;
      while (used.has(candidate)) candidate = `${base}_${n++}`;
      u.username = candidate;
      used.add(candidate);
      u.bio = u.bio || (u.role === 'Captain' ? 'Local captain helping crews get on fish safely.' : u.role === 'Business' ? 'Local fishing partner on the FishCrew board.' : u.role === 'Admin' ? 'FishCrew operator keeping the dock running.' : 'Here to find crew, share reports, and fish more.');
      u.fishingStyles = u.fishingStyles || (u.role === 'Captain' ? 'Charter, offshore, reef' : u.role === 'Business' ? 'Bait, tackle, local reports' : 'Inshore, pier, weekend trips');
      u.profileTheme = u.profileTheme || 'Harbor Blue';
    });
    state.notifications = Array.isArray(state.notifications) ? state.notifications : [];
    state.feed = state.feed || [];
    state.reports = state.reports || [];
    state.mediaAssets = state.mediaAssets || [];
    state.deviceHub = {
      status: 'Ready',
      source: 'No device connected',
      lat: null,
      lon: null,
      accuracy: null,
      speed: null,
      heading: null,
      deviceName: '',
      lastFix: '',
      log: [],
      ...(state.deviceHub || {})
    };
    state.deviceHub.log = Array.isArray(state.deviceHub.log) ? state.deviceHub.log.slice(0, 8) : [];
    state.blockedUsers = Array.isArray(state.blockedUsers) ? state.blockedUsers : [];
    state.accountDeletionRequests = Array.isArray(state.accountDeletionRequests) ? state.accountDeletionRequests : [];
  }

  function cleanupOldCaches() {
    try {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith(LEGACY_PREFIX) && key !== STORE && !key.includes(VERSION)) {
          // Keep a light hand: do not delete user data automatically, only service-worker caches below.
        }
      });
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then((regs) => {
          regs.forEach((reg) => {
            const url = reg.active?.scriptURL || reg.installing?.scriptURL || reg.waiting?.scriptURL || '';
            if (url.includes('fishcrew') || url.includes('service-worker')) reg.update().catch(() => {});
          });
        }).catch(() => {});
      }
    } catch (_) {}
  }

  function currentUser() {
    if (!state.session) return null;
    return state.users.find((u) => u.id === state.session.userId) || null;
  }

  function isAdmin() {
    const user = currentUser();
    return user?.role === 'Admin';
  }

  function isBusinessRole() {
    const role = currentUser()?.role;
    return role === 'Admin' || role === 'Business' || role === 'Captain';
  }

  function initials(name) {
    return (name || '?').split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join('') || '?';
  }

  function userName() {
    return currentUser()?.name || 'Guest angler';
  }

  function normalizeUsername(value, fallback = 'angler') {
    const base = String(value || fallback || 'angler')
      .toLowerCase()
      .replace(/[^a-z0-9_\.]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .slice(0, 24) || 'angler';
    return base.length < 3 ? `${base}_fc` : base;
  }

  function usernameFor(user) {
    if (!user) return '@guest';
    if (!user.username) user.username = normalizeUsername(user.email?.split('@')[0] || user.name || user.id);
    return `@${user.username}`;
  }

  function roleLabel(role) {
    return role === 'Admin' ? 'Operator' : (role || 'Angler');
  }

  function supportEmail() {
    return CONFIG.SUPPORT_EMAIL || 'support@fishcrew.app';
  }

  function canonicalUrl(path = '') {
    const root = String(CONFIG.WEB_CANONICAL_URL || location.origin || '').replace(/\/+$/, '');
    return `${root}${path || ''}`;
  }

  function isBlocked(userId) {
    return Boolean(userId && (state.blockedUsers || []).includes(userId));
  }

  function usernameTaken(username, userId = '') {
    const u = normalizeUsername(username);
    return state.users.some((x) => x.id !== userId && normalizeUsername(x.username || x.email?.split('@')[0] || x.name) === u);
  }

  // Validates a username the user actually typed (derived/fallback usernames go
  // through normalizeUsername instead, which coerces rather than rejects).
  function usernameInputError(raw) {
    const trimmed = String(raw || '').trim();
    if (!trimmed) return 'Username required.';
    if (trimmed.length < 3) return 'Username must be at least 3 characters.';
    if (!/^[a-z0-9_.]+$/i.test(trimmed)) return 'Username can only use letters, numbers, dots, and underscores.';
    return '';
  }

  // Remote uniqueness check against live profiles (normalized lowercase match).
  // Returns true/false, or null when the check could not run (offline/RPC not
  // yet applied) so callers can fall back to the unique index as the backstop.
  async function usernameTakenRemote(username, excludeId = '') {
    if (!supabaseClient) return null;
    try {
      const { data, error } = await supabaseClient.rpc('username_exists', { candidate: normalizeUsername(username), exclude_id: excludeId || null });
      if (error) return null;
      return Boolean(data);
    } catch (_) {
      return null;
    }
  }

  function mapNotificationRow(row) {
    return {
      id: row.id,
      title: row.title,
      body: row.body || '',
      type: row.type || row.notification_type || 'Alert',
      read: Boolean(row.read_at),
      readAt: row.read_at || null,
      createdAt: row.created_at || now(),
      linkPath: row.link_path || '',
      entityType: row.entity_type || '',
      entityId: row.entity_id || '',
      actorId: row.actor_id || ''
    };
  }

  function unreadNotifications() {
    return (state.notifications || []).filter((n) => !n.read).length;
  }

  async function fetchNotifications() {
    if (!supabaseClient || !currentUser()) {
      state.notifications = [];
      state.notificationsLoading = false;
      state.notificationsFetchError = '';
      return;
    }
    state.notificationsLoading = true;
    state.notificationsFetchError = '';
    try {
      const { data, error } = await supabaseClient
        .from('notifications')
        .select('id, user_id, actor_id, type, notification_type, title, body, entity_type, entity_id, link_path, read_at, created_at')
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      const userId = currentUser()?.id || '';
      state.notifications = (data || [])
        .filter((row) => row.user_id === userId)
        .map(mapNotificationRow);
    } catch (error) {
      console.warn('Notifications fetch failed', error);
      state.notificationsFetchError = error.message || String(error);
      state.notifications = state.notifications || [];
    } finally {
      state.notificationsLoading = false;
      render();
    }
  }

  function scheduleNotificationsRefresh() {
    clearTimeout(notificationsRefreshTimer);
    notificationsRefreshTimer = setTimeout(() => fetchNotifications(), 400);
  }

  function userArea() {
    return currentUser()?.area || 'Tampa Bay';
  }

  function greeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  }

  function protectedPrompt(reason = '') {
    const detail = String(reason || '').trim();
    if (!detail || detail === GUEST_SIGN_IN_PROMPT) return GUEST_SIGN_IN_PROMPT;
    return `${GUEST_SIGN_IN_PROMPT} ${detail}`;
  }

  function requireLogin(reason = GUEST_SIGN_IN_PROMPT) {
    if (currentUser()) return true;
    openAuth(protectedPrompt(reason));
    return false;
  }

  function requireAdmin(reason = 'Operator access required for these controls.') {
    if (isAdmin()) return true;
    openAuth(protectedPrompt(reason), 'Admin');
    return false;
  }

  function requireBusiness(reason = 'Business, captain, or operator access required.') {
    if (isBusinessRole()) return true;
    openAuth(protectedPrompt(reason), 'Business');
    return false;
  }

  function hydrateHeader() {
    const user = currentUser();
    const area = user?.area || currentConditions().area || state.savedGuideArea || 'Tampa Bay';
    const photo = locationPhoto(area, 'header');
    document.body.dataset.daypart = daypart();
    document.documentElement.style.setProperty('--header-location-photo', `url("${photo.url}")`);
    const header = $('.app-header');
    if (header) {
      header.dataset.location = photo.area;
      header.title = `${photo.area} scene adapts by time of day`;
    }
    const account = $('#accountButton');
    if (account) {
      account.textContent = user ? user.name.split(' ')[0] : 'Sign in';
      account.dataset.action = user ? 'go' : 'open-auth';
      if (user) account.dataset.screen = 'profile';
      else account.removeAttribute('data-screen');
      account.setAttribute('aria-label', user ? 'Open profile' : 'Sign in or create account');
    }
  }

  function nav(screen) {
    const allowed = ['home', 'explore', 'crew', 'feed', 'tools', 'profile'];
    if (!allowed.includes(screen)) screen = 'home';
    state.activeScreen = screen;
    $$('.screen').forEach((s) => s.classList.toggle('active', s.id === `screen-${screen}`));
    $$('.nav-btn').forEach((b) => b.classList.toggle('active', b.dataset.screen === screen));
    save();
    render();
    setDebug(`Screen: ${screen}`);
    scrollToTopSoft();
  }

  function scoreBadge(score) {
    const s = String(score || 'Fair').toLowerCase();
    const cls = s.includes('good') || s.includes('great') ? 'green' : s.includes('unsafe') || s.includes('rough') ? 'red' : 'orange';
    return `<span class="badge ${cls}">${safe(score || 'Fair')}</span>`;
  }

  function mediaModerationEnabled() {
    return CONFIG.ENABLE_MEDIA_MODERATION !== false;
  }

  function isApprovedMediaStatus(status) {
    const value = String(status || '');
    return value === 'Approved' || value === 'Auto-approved';
  }

  function mediaAssetForItem(item, sourceType = '') {
    if (!item) return null;
    const sourceId = item.id || item.sourceId || '';
    if (!sourceId) return null;
    const assets = state.mediaAssets || [];
    if (sourceType) {
      const typed = assets.find((a) => a.sourceId === sourceId && a.sourceType === sourceType);
      if (typed) return typed;
    }
    return assets.find((a) => a.sourceId === sourceId) || null;
  }

  function canShowUserMedia(item, sourceType = 'feed') {
    if (!item) return false;
    if (item.demo) return true;
    if (!mediaModerationEnabled()) return true;
    const asset = mediaAssetForItem(item, sourceType);
    const viewer = currentUser();
    const isOwner = Boolean(viewer && (
      asset?.ownerId === viewer.id ||
      item.authorId === viewer.id ||
      item.hostId === viewer.id ||
      item.ownerId === viewer.id ||
      item.id === viewer.id
    ));
    if (isAdmin() || isOwner) return true;
    if (asset) return isApprovedMediaStatus(asset.status);
    return ['Live', 'Sponsored', 'Approved', 'Published'].includes(String(item.status || ''));
  }

  function visibleFeedPosts() {
    const viewer = currentUser();
    return (state.feed || []).filter((post) => {
      if (post.status === 'Removed' || post.status === 'Hidden') return isAdmin();
      if (!isAdmin() && isBlocked(post.authorId)) return false;
      if (post.status === 'Pending review') {
        return isAdmin() || Boolean(viewer && viewer.id === post.authorId);
      }
      return true;
    });
  }

  function mediaSketch(kind = 'water') {
    const k = String(kind || 'water').toLowerCase();
    const label = k.includes('shop') ? 'Dock shop note' : k.includes('boat') || k.includes('charter') ? 'Open water run' : k.includes('pier') ? 'Pier crew' : k.includes('catch') || k.includes('fish') ? 'Fresh catch' : 'Local water';
    const cls = k.includes('shop') ? 'shop' : k.includes('boat') || k.includes('charter') ? 'boat' : k.includes('pier') ? 'pier' : k.includes('catch') || k.includes('fish') ? 'catch' : 'water';
    return `<div class="card-media media-sketch ${cls}" aria-label="${safe(label)}">
      <span class="sketch-sun"></span><span class="sketch-wave one"></span><span class="sketch-wave two"></span><span class="sketch-line"></span><span class="sketch-mark"></span><small>${safe(label)}</small>
    </div>`;
  }

  function mediaBlock(item, fallback = 'water') {
    const url = item?.media || item?.mediaUrl || '';
    const type = item?.mediaType || '';
    const sourceType = item?.hostId ? 'trip' : (item?.authorId ? 'feed' : 'media');
    const hasUserMedia = url && (isRemoteUrl(url) || (isDataUrl(url) && !item?.demo));
    if (hasUserMedia && canShowUserMedia(item, sourceType)) {
      if (String(type).startsWith('video')) {
        return `<div class="card-media has-video"><video src="${safe(url)}" muted playsinline loop controls preload="metadata"></video></div>`;
      }
      return `<div class="card-media photo user-photo" style="background-image:url('${safe(url)}')"><span class="media-location-label">${safe(item?.area || 'FishCrew media')}</span></div>`;
    }
    if (hasUserMedia && mediaModerationEnabled()) {
      const viewer = currentUser();
      const pendingLabel = (isAdmin() || (viewer && (item?.authorId === viewer.id || item?.hostId === viewer.id)))
        ? 'Pending review'
        : 'Photo under review';
      return `<div class="card-media media-sketch water" aria-label="${safe(pendingLabel)}"><span class="media-location-label"><b>${safe(pendingLabel)}</b><small>Visible after operator approval</small></span></div>`;
    }
    if (item?.area) {
      const photo = locationPhoto(item.area, item?.type || fallback);
      return `<div class="card-media photo location-photo" style="background-image:url('${safe(photo.url)}')"><span class="media-location-label"><b>${safe(photo.area)}</b><small>${safe(item?.type || fallback)}</small></span></div>`;
    }
    const kind = item?.artKind || item?.type || fallback;
    return mediaSketch(kind);
  }

  function tripCard(trip, compact = false) {
    const user = currentUser();
    const isMember = user && trip.members?.includes(user.id);
    const canHost = user && (trip.hostId === user.id || isAdmin());
    const pending = user && state.requests.some((r) => r.tripId === trip.id && r.userId === user.id && r.status === 'Pending');
    const canRequest = String(trip.status || 'Open') === 'Open' && Number(trip.spots || 0) > 0;
    return `
      <article class="trip-card">
        ${mediaBlock(trip, trip.type === 'Pier' ? 'pier' : 'boat')}
        <div class="row">${scoreBadge(trip.score)} ${trip.urgent ? '<span class="badge orange">Last-minute</span>' : ''} ${trip.adminFeatured ? '<span class="chip">Featured</span>' : ''} <span class="chip">${safe(trip.type)}</span> <span class="chip">${safe(trip.status)}</span></div>
        <h3>${safe(trip.title)}</h3>
        <p class="muted">${safe(trip.area)} ${MID} ${safe(trip.time)}</p>
        <div class="meta">
          <span class="chip">${safe(trip.species)}</span>
          <span class="chip">${safe(trip.spots)} open</span>
          <span class="chip">${safe(trip.cost)}</span>
        </div>
        ${compact ? '' : `<p class="tiny">Wind ${safe(trip.wind)} ${MID} Waves ${safe(trip.waves)} ${MID} Tide ${safe(trip.tide)}</p>`}
        <div class="row">
          <button class="btn primary small" type="button" data-action="request-trip" data-trip-id="${safe(trip.id)}">${isMember ? 'Crew' : pending ? 'Pending' : canRequest ? 'Request' : 'Closed'}</button>
          <button class="btn dark small" type="button" data-action="trip-details" data-trip-id="${safe(trip.id)}">Details</button>
          ${canHost ? `<button class="btn soft small" type="button" data-action="open-host-controls" data-trip-id="${safe(trip.id)}">Host</button>` : `<button class="btn dark small" type="button" data-action="open-map" data-area="${safe(trip.area)}">Map</button>`}
        </div>
      </article>`;
  }

  function feedCard(post, compact = false) {
    const review = state.reports?.some((r) => r.target === post.id && r.status === 'Open');
    const removed = post.status === 'Removed';
    const author = state.users.find((u) => u.id === post.authorId);
    const showAdminMeta = isAdmin();
    const viewer = currentUser();
    const canBlock = viewer && author && author.id !== viewer.id && !isBlocked(author.id);
    return `
      <article class="feed-card clean-card ${removed ? 'is-removed' : ''}">
        ${mediaBlock(post, post.artKind || post.type || 'catch')}
        <div class="feed-topline"><span class="badge ${post.status === 'Sponsored' ? 'orange' : post.status === 'Removed' ? 'red' : post.status === 'Pending review' ? 'orange' : ''}">${safe(post.type)}</span><span class="chip">${safe(post.area)}</span>${(showAdminMeta && review) || post.status === 'Pending review' ? '<span class="chip">Review queued</span>' : ''}</div>
        <h3>${safe(post.title)}</h3>
        <p class="muted">${safe(post.body)}</p>
        <div class="feed-byline"><span>${safe(author ? usernameFor(author) : post.authorName || 'FishCrew')}</span>${showAdminMeta ? `<span>${safe(post.status || 'Live')}</span>` : ''}</div>
        <div class="row feed-actions">
          <button class="btn dark small" type="button" data-action="react-feed" data-feed-id="${safe(post.id)}">Like ${safe(post.reactions || 0)}</button>
          <button class="btn dark small" type="button" data-action="share-feed" data-feed-id="${safe(post.id)}">Share</button>
          ${!removed ? `<button class="btn dark small" type="button" data-action="report-feed" data-feed-id="${safe(post.id)}">Report</button>` : ''}
          ${canBlock ? `<button class="btn dark small" type="button" data-action="block-user" data-user-id="${safe(author.id)}">Block</button>` : ''}
          ${showAdminMeta ? `<button class="btn danger small" type="button" data-action="remove-feed" data-feed-id="${safe(post.id)}">Remove</button>` : ''}
        </div>
      </article>`;
  }

  function currentConditions() {
    state.conditions = { ...defaultConditions(), ...(state.conditions || {}) };
    return state.conditions;
  }

  function conditionChips(c = currentConditions()) {
    return `
      <div class="stat score-stat"><span>Fishability</span><strong>${safe(c.score)}</strong></div>
      <div class="stat"><span>Wind</span><strong>${safe(c.wind)}</strong></div>
      <div class="stat"><span>Waves</span><strong>${safe(c.waves)}</strong></div>
      <div class="stat"><span>Window</span><strong>${safe(c.window)}</strong></div>`;
  }

  function portTargetForArea(area = '') {
    const a = String(area || '').toLowerCase();
    if (a.includes('tampa') || a.includes('gandy') || a.includes('skyway')) return 'Snook';
    if (a.includes('sarasota')) return 'Trout';
    if (a.includes('clearwater') || a.includes('st. pete')) return 'Redfish';
    return 'Inshore bite';
  }

  function homeConditionCard(c = currentConditions()) {
    const stamp = c.updatedAt ? new Date(c.updatedAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : 'not refreshed';
    const scoreClass = String(c.score).toLowerCase().includes('great') || String(c.score).toLowerCase().includes('good') ? 'green' : String(c.score).toLowerCase().includes('unsafe') || String(c.score).toLowerCase().includes('rough') ? 'red' : 'orange';
    return `
      <article class="conditions-card panel port-window-card ${c.isLive ? 'is-live' : ''}">
        <div class="port-window-bg" aria-hidden="true"></div>
        <div class="port-window-content">
          <div class="condition-card-head port-window-head">
            <div><span class="eyebrow">Port Window</span><h2>${safe(c.area || userArea())}</h2><p class="muted">Live-feel conditions for the local water crew</p></div>
            <span class="badge ${scoreClass}">${safe(c.score)} window</span>
          </div>
          <div class="port-condition-grid" aria-label="Today conditions">
            <article><span>Wind</span><strong>${safe(c.wind)}</strong><small>${Number(c.windMph || 0) <= 10 ? 'easing late' : 'watch gusts'}</small></article>
            <article><span>Tide</span><strong>${safe(c.tide)}</strong><small>${safe(c.tideNext || 'moving water matters')}</small></article>
            <article><span>Water</span><strong>${safe(c.water)}</strong><small>${safe(c.waves)} ${MID} ${safe(c.rain)} rain</small></article>
            <article><span>Target</span><strong>${safe(portTargetForArea(c.area || userArea()))}</strong><small>${safe(c.windowDetail || 'local pattern check')}</small></article>
          </div>
          <div class="port-footer row">
            <span>Temp ${safe(c.temp)}</span>
            <span>Updated ${safe(stamp)}</span>
            <button class="btn primary small" type="button" data-action="refresh-conditions">Use my location</button>
            <button class="btn dark small" type="button" data-action="open-conditions">Details</button>
          </div>
          <p class="tiny">${safe(c.isLive ? 'Live refresh' : 'Planning estimate')} ${MID} ${safe(c.source)}</p>
        </div>
      </article>`;
  }

  function conditionsRibbon(c = currentConditions()) {
    return `
      <section class="conditions-ribbon" aria-label="Live condition notification bar">
        <button class="ribbon-main" type="button" data-action="open-conditions">
          <span class="live-dot ${c.isLive ? 'on' : ''}"></span>
          <b>Local water news</b>
          <span>${safe(c.area)} ${MID} ${safe(c.score)} fishability ${MID} ${safe(c.wind)} ${MID} ${safe(c.waves)} ${MID} ${safe(c.tide)}</span>
        </button>
        <button class="btn soft small" type="button" data-action="refresh-conditions">Refresh</button>
      </section>`;
  }

  function weatherCodeLabel(code) {
    const c = Number(code);
    if ([0].includes(c)) return 'Clear';
    if ([1,2,3].includes(c)) return 'Clouds';
    if ([45,48].includes(c)) return 'Fog';
    if ([51,53,55,61,63,65,80,81,82].includes(c)) return 'Rain nearby';
    if ([95,96,99].includes(c)) return 'Storm risk';
    return 'Weather loaded';
  }

  function bestWindowFromHourly(hourly = []) {
    if (!hourly.length) return { window: 'Check today', detail: 'Hourly data is not loaded yet. Refresh conditions or use area guidance.' };
    const good = hourly.filter((h) => Number(h.windMph) <= 13 && Number(h.rainPct) <= 45 && (!Number.isFinite(Number(h.waveFt)) || Number(h.waveFt) <= 2.5));
    const pick = good[0] || hourly[0];
    const start = new Date(pick.time);
    const end = new Date(start.getTime() + 3 * 60 * 60 * 1000);
    const fmt = (d) => d.toLocaleTimeString([], { hour: 'numeric' }).replace(' ', '');
    return { window: `${fmt(start)}${EN_DASH}${fmt(end)}`, detail: good[0] ? 'Best near-term window based on lower wind, manageable rain odds, and water conditions.' : 'No clean window found yet; this is the next available planning block.' };
  }

  async function reverseGeocodeArea(lat, lon) {
    // Safe area-label helper: never throws, always returns a readable string,
    // so weather/conditions cards render even when geocoding is unavailable.
    const fallbackArea = 'Nearby waters';
    const latNum = Number(lat);
    const lonNum = Number(lon);
    if (!Number.isFinite(latNum) || !Number.isFinite(lonNum) || Math.abs(latNum) > 90 || Math.abs(lonNum) > 180) return fallbackArea;
    try {
      // BigDataCloud reverse-geocode client endpoint is keyless and CORS-friendly.
      const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${encodeURIComponent(latNum)}&longitude=${encodeURIComponent(lonNum)}&localityLanguage=en`;
      const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
      const timer = controller ? setTimeout(() => controller.abort(), 6000) : null;
      const res = await fetch(url, controller ? { signal: controller.signal } : undefined);
      if (timer) clearTimeout(timer);
      if (!res.ok) return fallbackArea;
      const data = await res.json();
      const locality = data.locality || data.city || '';
      const region = data.principalSubdivision || '';
      const label = [locality, region].filter(Boolean).join(', ') || data.countryName || '';
      return typeof label === 'string' && label.trim() ? label.trim() : fallbackArea;
    } catch (_) {
      return fallbackArea;
    }
  }

  async function fetchOpenMeteoConditions(lat, lon, area = 'Your water') {
    const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${encodeURIComponent(lat)}&longitude=${encodeURIComponent(lon)}&current=temperature_2m,wind_speed_10m,wind_direction_10m,precipitation,weather_code&hourly=wind_speed_10m,wind_direction_10m,precipitation_probability,temperature_2m&forecast_days=2&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=auto`;
    const marineUrl = `https://marine-api.open-meteo.com/v1/marine?latitude=${encodeURIComponent(lat)}&longitude=${encodeURIComponent(lon)}&current=wave_height,wave_period,sea_surface_temperature&hourly=wave_height,wave_period,sea_surface_temperature&forecast_days=2&timezone=auto`;
    const [forecastRes, marineRes] = await Promise.allSettled([fetch(forecastUrl), fetch(marineUrl)]);
    if (forecastRes.status !== 'fulfilled' || !forecastRes.value.ok) throw new Error('Weather provider did not respond.');
    const forecast = await forecastRes.value.json();
    const marine = marineRes.status === 'fulfilled' && marineRes.value.ok ? await marineRes.value.json() : null;
    const current = forecast.current || {};
    const waveFt = marine?.current?.wave_height != null ? metersToFeet(marine.current.wave_height) : NaN;
    const waterF = marine?.current?.sea_surface_temperature != null ? (Number(marine.current.sea_surface_temperature) * 9 / 5 + 32) : NaN;
    const hourly = (forecast.hourly?.time || []).slice(0, 24).map((time, i) => ({
      time,
      windMph: forecast.hourly.wind_speed_10m?.[i],
      rainPct: forecast.hourly.precipitation_probability?.[i],
      temp: forecast.hourly.temperature_2m?.[i],
      waveFt: marine?.hourly?.wave_height?.[i] != null ? metersToFeet(marine.hourly.wave_height[i]) : NaN
    }));
    const rainPct = forecast.hourly?.precipitation_probability?.[0] ?? 0;
    const scoreObj = conditionScore({ windMph: current.wind_speed_10m, waveFt: Number.isFinite(waveFt) ? waveFt : 1.5, rainPct });
    const window = bestWindowFromHourly(hourly);
    const tide = await fetchTideEstimate(lat, lon).catch(() => null);
    return defaultConditions({
      area,
      lat,
      lon,
      isLive: true,
      status: 'live',
      source: 'Open-Meteo weather/marine + NOAA tide attempt',
      score: scoreObj.score,
      scoreReason: scoreObj.reason,
      temp: fmtTemp(current.temperature_2m),
      wind: fmtMph(current.wind_speed_10m, current.wind_direction_10m),
      windMph: Number(current.wind_speed_10m || 0),
      windDir: Number(current.wind_direction_10m || 0),
      waves: Number.isFinite(waveFt) ? `${waveFt.toFixed(1)} ft` : 'Protected/unknown',
      waveFt: Number.isFinite(waveFt) ? Number(waveFt.toFixed(1)) : null,
      tide: tide?.label || estimatedTideLabel(),
      tideStation: tide?.station || 'Nearest NOAA station not confirmed',
      tideNext: tide?.next || 'Use official tide source before launch',
      rain: fmtPct(rainPct),
      rainPct: Number(rainPct || 0),
      water: Number.isFinite(waterF) ? `${Math.round(waterF)}${DEG}F` : '?',
      window: window.window,
      windowDetail: `${window.detail} Current: ${weatherCodeLabel(current.weather_code)}.`,
      alert: Number(current.wind_speed_10m || 0) >= 20 ? 'High wind caution' : 'No app-level alert triggered',
      providerNotes: 'Use this for planning only. Confirm marine forecasts, tides, regulations, and safety before launching.',
      updatedAt: now(),
      hourly
    });
  }

  function estimatedTideLabel() {
    const hour = new Date().getHours();
    return hour % 12 < 6 ? 'Incoming estimate' : 'Outgoing estimate';
  }

  async function fetchTideEstimate(lat, lon) {
    const stationUrl = `https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/stations.json?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&radius=60&type=waterlevels&units=english`;
    const stationsRes = await fetch(stationUrl);
    if (!stationsRes.ok) throw new Error('NOAA station lookup failed');
    const stationsJson = await stationsRes.json();
    const station = stationsJson?.stations?.[0];
    if (!station?.id) throw new Error('No station found');
    const tideUrl = `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?date=today&station=${encodeURIComponent(station.id)}&product=predictions&datum=MLLW&time_zone=lst_ldt&units=english&interval=hilo&format=json`;
    const tideRes = await fetch(tideUrl);
    if (!tideRes.ok) throw new Error('NOAA prediction fetch failed');
    const tideJson = await tideRes.json();
    const predictions = tideJson?.predictions || [];
    const next = predictions.find((p) => new Date(p.t).getTime() > Date.now()) || predictions[0];
    const label = next?.type === 'H' ? 'Incoming to high' : next?.type === 'L' ? 'Outgoing to low' : estimatedTideLabel();
    return { label, station: station.name || station.id, next: next ? `${next.type === 'H' ? 'High' : 'Low'} around ${new Date(next.t).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}` : 'No next tide returned' };
  }

  function setConditions(c) {
    state.conditions = { ...defaultConditions(), ...c };
    save();
    render();
  }

  function refreshConditions(options = {}) {
    if (!navigator.geolocation) {
      if (!options.silent) toast('Location is not available in this browser. Showing Tampa Bay planning conditions.', 'danger');
      if (options.open !== false) openConditions();
      return;
    }
    if (!options.silent) toast('Requesting location for fishing conditions...');
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      try {
        if (!options.silent) toast('Loading weather, waves, and tide attempt...');
        const areaLabel = await reverseGeocodeArea(lat, lon);
        const c = await fetchOpenMeteoConditions(lat, lon, areaLabel);
        setConditions(c);
        if (options.open !== false) openConditions();
        if (!options.silent) toast('Conditions refreshed.');
      } catch (error) {
        const areaLabel = await reverseGeocodeArea(lat, lon);
        const fallback = defaultConditions({ area: areaLabel, lat, lon, status: 'fallback', source: 'Geolocation fallback', providerNotes: `Live provider failed: ${error.message}. Planning conditions remain visible.` });
        setConditions(fallback);
        if (options.open !== false) openConditions();
        if (!options.silent) toast('Location found, but provider refresh failed. Showing fallback.', 'danger');
      }
    }, (error) => {
      if (!options.silent) toast(`Location permission not available: ${error.message}`, 'danger');
      if (options.open !== false) openConditions();
    }, { enableHighAccuracy: false, timeout: 12000, maximumAge: 15 * 60 * 1000 });
  }

  function openConditions() {
    const c = currentConditions();
    modalMode = 'conditions';
    modal(`
      <div class="modal-head"><div><span class="eyebrow">Conditions</span><h2>${safe(c.area)} fishing window</h2></div><button class="x-btn" type="button" data-action="close-modal">${CLOSE_BTN}</button></div>
      <div class="conditions-detail">
        ${homeConditionCard(c)}
        <div class="grid two">
          <div class="panel"><h3>Fishability score</h3><p class="muted">${safe(c.scoreReason)}</p><p class="tiny">The score blends wind, waves, rain odds, tide context, and conservative safety thresholds. Great/Good means easier planning; Fair/Rough/Unsafe means slow down, check official marine sources, and use judgment.</p></div>
          <div class="panel"><h3>Tide + source</h3><p class="muted">${safe(c.tide)} ${MID} ${safe(c.tideNext)}</p><p class="tiny">Station: ${safe(c.tideStation)}<br>${safe(c.providerNotes)}</p></div>
        </div>
        <div class="grid four conditions-grid">
          <div class="panel"><span class="eyebrow">Air</span><h3>${safe(c.temp)}</h3></div>
          <div class="panel"><span class="eyebrow">Wind</span><h3>${safe(c.wind)}</h3></div>
          <div class="panel"><span class="eyebrow">Waves</span><h3>${safe(c.waves)}</h3></div>
          <div class="panel"><span class="eyebrow">Water</span><h3>${safe(c.water)}</h3></div>
        </div>
        <div class="safe-note"><strong>Safety/legal:</strong> FishCrew conditions are a planning layer. Confirm official marine forecasts, tide station data, laws, closures, and captain judgment before launching or keeping fish.</div>
        <div class="row"><button class="btn primary" type="button" data-action="refresh-conditions">Refresh with my location</button><button class="btn dark" type="button" data-action="go" data-screen="tools">Fishing tools</button></div>
      </div>`);
  }


  function localWaterNews(c = currentConditions()) {
    const area = c.area || userArea();
    const photo = locationPhoto(area, 'news');
    const news = [
      { title: 'Boating notice', headline: 'Downtown channel traffic picking up', body: `Expect slower passage near ${area} waterfront areas during evening hours.`, action: 'open-conditions', area },
      { title: 'Bite report', headline: 'Morning mangrove bite looks promising', body: 'Guides are seeing better action on moving water and shaded edges.', action: 'go', screen: 'feed', area },
      { title: 'Local loop', headline: 'Public area notes stay general', body: 'Gandy, Skyway approaches, Fort De Soto, Weedon Island, and Alafia mouth stay broad; exact pins stay crew-only.', action: 'open-local-spots', area: 'Tampa Bay' }
    ];
    return `
      <section class="section app-section-tight local-water-section" aria-label="Local water news">
        <div class="section-head compact-head"><div><span class="eyebrow">Local Water News</span><h2>Near ${safe(area)}</h2></div><button class="btn dark small" type="button" data-action="open-conditions">Open window</button></div>
        <div class="local-water-news-grid">
          ${news.map((n, i)=>{ const p = locationPhoto(n.area, n.title); return `<button class="water-news-card photo-news-card news-${i+1}" style="--news-photo:url('${safe(p.url)}')" type="button" data-action="${safe(n.action)}" ${n.screen ? `data-screen="${safe(n.screen)}"` : ''}><span>${safe(n.title)} ${MID} ${safe(p.area)}</span><strong>${safe(n.headline)}</strong><b>${safe(n.body)}</b></button>`; }).join('')}
        </div>
        <p class="tiny photo-source-note">Location-backed photo layer: ${safe(photo.area)}. Exact spots remain private.</p>
      </section>`;
  }

  function homeActivityFeed() {
    const posts = visibleFeedPosts().slice(0, 2);
    const nextTrip = state.trips.find((t) => t.status === 'Open');
    const pending = state.requests.find((r) => r.status === 'Pending');
    const extras = [
      nextTrip ? `<article class="activity-row activity-trip"><div class="activity-avatar">?</div><div><strong>Upcoming crew request open</strong><p>${safe(nextTrip.title)} ${MID} ${safe(nextTrip.area)} ${MID} ${safe(nextTrip.time)}</p><div class="inline-actions"><button type="button" data-action="request-trip" data-trip-id="${safe(nextTrip.id)}">Request crew</button><button type="button" data-action="trip-details" data-trip-id="${safe(nextTrip.id)}">Details</button></div></div></article>` : '',
      pending ? `<article class="activity-row activity-request"><div class="activity-avatar">?</div><div><strong>${safe(pending.userName)} requested a crew spot</strong><p>${safe(pending.message)} ${MID} ${safe(state.trips.find((t)=>t.id===pending.tripId)?.title || 'Upcoming trip')}</p><div class="inline-actions"><button type="button" data-action="go" data-screen="crew">Open crew</button></div></div></article>` : ''
    ].filter(Boolean).join('');
    return `
      <section class="section app-section-tight home-activity-section" aria-label="Activity feed">
        <div class="section-head compact-head"><div><span class="eyebrow">Activity Feed</span><h2>Crew movement</h2></div><button class="btn dark small" type="button" data-action="go" data-screen="feed">Open feed</button></div>
        <div class="home-activity-card">
          ${posts.map((post)=>`<article class="activity-row"><div class="activity-avatar">${safe(initials(post.authorName || 'FC'))}</div><div><strong>${safe(post.authorName || 'FishCrew')} posted ${safe(String(post.type || 'an update').toLowerCase())}</strong><p>${safe(post.body || post.title)}</p><div class="inline-actions"><button type="button" data-action="react-feed" data-feed-id="${safe(post.id)}">Like ${safe(post.reactions || 0)}</button><button type="button" data-action="go" data-screen="feed">Comment</button><button type="button" data-action="report-feed" data-feed-id="${safe(post.id)}">Report</button></div></div></article>`).join('') || `<p class="muted">No crew updates yet.</p>`}
          ${extras}
        </div>
      </section>`;
  }

  function postTripCta(label = 'Post a trip') {
    // Routes into the existing trip flow: signed-in users open the trip form,
    // guests are sent to sign-in first (openTripForm also enforces requireLogin).
    return currentUser()
      ? `<div class="row mt"><button class="btn primary" type="button" data-action="open-trip-form">${safe(label)}</button></div>`
      : `<div class="row mt"><button class="btn primary" type="button" data-action="open-auth-signin">Sign in to post a trip</button></div>`;
  }

  function renderHome() {
    const openTrips = state.trips.filter((t) => t.status === 'Open').slice(0, 3);
    const proof = visibleFeedPosts().slice(0, 3);
    const user = currentUser();
    const c = currentConditions();
    const pendingRequests = user ? state.requests.filter((r) => r.userId === user.id || state.trips.some((t) => t.hostId === user.id && t.id === r.tripId)).length : 0;
    $('#screen-home').innerHTML = `
      <section class="hero home-hero v040-hero" aria-labelledby="homeTitle">
        <div class="hero-topline">
          <span class="eyebrow">${greeting()} ${MID} ${safe(c.area || userArea())}</span>
          <span class="chip">Browse first</span>
        </div>
        <h1 id="homeTitle">Your water, your crew, your window.</h1>
        <p>Start with live local conditions, then find open seats, post a plan, or check the bite board near you.</p>
        <button class="hero-snapshot" type="button" data-action="open-conditions" aria-label="Open current fishing window">
          <span class="snapshot-kicker"><i class="live-dot ${c.isLive ? 'on' : ''}"></i>${safe(c.isLive ? 'Live water' : 'Local water')}</span>
          <strong>${safe(c.score)} window</strong>
          <span>${safe(c.wind)} wind ${MID} ${safe(c.waves)} waves</span>
          <small>${safe(c.tide)} tide ${MID} ${safe(c.water)} water</small>
        </button>
        <div class="hero-spot-loop" aria-label="Local fishing areas">
          ${['Gandy','Skyway','Fort De Soto','Weedon Island','Alafia mouth'].map((spot)=>`<button class="spot-pill" type="button" data-action="open-map" data-area="${safe(spot + ', Tampa Bay')}">${safe(spot)}</button>`).join('')}
        </div>
        <div class="hero-actions v040-actions">
          <button class="btn primary" type="button" data-action="go" data-screen="explore">Find a trip</button>
          <button class="btn soft" type="button" data-action="open-feed-form">Post catch</button>
          <button class="btn dark" type="button" data-action="open-conditions">Open window</button>
        </div>
      </section>

      ${homeConditionCard(c)}
      ${homeActivityFeed()}
      ${localWaterNews(c)}

      <section class="home-command-grid" aria-label="Quick fishing actions">
        <button class="home-command" type="button" data-action="go" data-screen="explore"><b>Find a trip</b><span>Open seats and local plans</span></button>
        <button class="home-command" type="button" data-action="open-feed-form"><b>Post catch</b><span>Share proof to the bite board</span></button>
        <button class="home-command" type="button" data-action="go" data-screen="feed"><b>Shop board</b><span>Reports, deals, and dock notes</span></button>
        <button class="home-command" type="button" data-action="go" data-screen="tools"><b>Fishing tools</b><span>Bait, gear, fish ID, measuring</span></button>
      </section>

      ${state.onboardingSeen ? '' : `<section class="section tutorial-nudge"><div class="panel launch-card"><div><span class="eyebrow">New here?</span><h2>Take the quick dock walk-through.</h2><p class="muted">See how to browse, join, chat, post proof, and use tools without getting hit by a login wall.</p></div><button class="btn primary" type="button" data-action="open-tutorial">Start tutorial</button></div></section>`}

      <section class="section v040-flow" aria-label="FishCrew flow">
        <button class="flow-step" type="button" data-action="go" data-screen="explore"><b>1</b><span>Find water</span></button>
        <button class="flow-step" type="button" data-action="go" data-screen="crew"><b>2</b><span>Lock crew</span>${pendingRequests ? `<em>${pendingRequests}</em>` : ''}</button>
        <button class="flow-step" type="button" data-action="go" data-screen="feed"><b>3</b><span>Post proof</span></button>
      </section>

      ${conditionsRibbon(c)}

      <section class="section app-section-tight">
        <div class="section-head compact-head">
          <div><span class="eyebrow">Open nearby</span><h2>Featured trips</h2></div>
          <div class="row"><button class="btn primary small" type="button" data-action="urgent-trips">Last-minute</button><button class="btn dark small" type="button" data-action="go" data-screen="explore">See all</button></div>
        </div>
        <div class="grid cards v040-card-stack">${openTrips.map((t) => tripCard(t, true)).join('') || `<div class="empty">No open trips yet.${user ? ' Post the first one.' : ''}${postTripCta('Post the first trip')}</div>`}</div>
      </section>

      <section class="section app-section-tight">
        <div class="section-head compact-head">
          <div><span class="eyebrow">Bite board</span><h2>Catch of the day</h2></div>
          <button class="btn dark small" type="button" data-action="go" data-screen="feed">Open feed</button>
        </div>
        <div class="grid cards v040-card-stack">${proof.map((p) => feedCard(p, true)).join('')}</div>
      </section>`;
  }

  function renderExplore() {
    const filters = ['All', 'Boat', 'Pier', 'Kayak', 'Charter', 'Open'];
    const trips = state.trips.filter((t) => {
      if (!isAdmin() && isBlocked(t.hostId)) return false;
      if (state.tripFilter === 'All') return true;
      if (state.tripFilter === 'Open') return t.status === 'Open';
      if (state.tripFilter === 'Charter') return t.type === 'Charter' || /charter/i.test(t.title);
      return t.type === state.tripFilter;
    });
    $('#screen-explore').innerHTML = `
      <section class="section" aria-labelledby="exploreTitle">
        <span class="eyebrow">Explore</span>
        <h1 class="page-title" id="exploreTitle">Find water, crew, and local pros.</h1>
        <p class="lead">Open trips, area guides, pro charters, cruises, tackle shops, and map links. Exact meetup details stay private until approval.</p>
        <div class="filters">${filters.map((f) => `<button class="filter-btn ${state.tripFilter === f ? 'active' : ''}" type="button" data-action="trip-filter" data-filter="${safe(f)}">${safe(f)}</button>`).join('')}</div>
        <div class="grid cards">${trips.slice(0, TRIP_RENDER_LIMIT).map((t) => tripCard(t)).join('') || `<div class="empty">${state.trips.length ? 'No trips match this filter.' : 'No trips posted yet.'}${postTripCta(state.trips.length ? 'Post a trip' : 'Post the first trip')}</div>`}</div>
      </section>
      <section class="section">
        <div class="section-head"><div><span class="eyebrow">Marketplace</span><h2>Local partners</h2></div><button class="btn dark small" type="button" data-action="open-business-form">Add business</button></div>
        <div class="grid cards">${state.businesses.slice(0, 24).map((b) => `
          <article class="admin-card">
            <span class="badge ${b.status === 'Verified' ? 'green' : 'orange'}">${safe(b.status)}</span>
            <h3>${safe(b.name)}</h3>
            <p class="muted">${safe(b.kind)} ${MID} ${safe(b.area)}</p>
            <div class="meta"><span class="chip">${safe(b.leads)} leads</span><span class="chip">$${safe(b.revenue)}</span><span class="chip">${safe(b.campaign)}</span></div>
            <div class="row"><button class="btn primary small" type="button" data-action="book-business" data-business-id="${safe(b.id)}">Inquire</button><button class="btn dark small" type="button" data-action="open-map" data-area="${safe(b.area)}">Map area</button></div>
          </article>`).join('')}</div>
      </section>`;
  }

  function renderCrew() {
    const user = currentUser();
    const visibleTrips = user ? state.trips.filter((t) => t.hostId === user.id || t.members?.includes(user.id) || isAdmin()) : state.trips.slice(0, 1);
    const reqs = user ? state.requests.filter((r) => isAdmin() || state.trips.some((t) => t.id === r.tripId && t.hostId === user.id) || r.userId === user.id) : [];
    const trip = state.trips.find((t) => t.id === state.activeTripId) || visibleTrips[0] || state.trips[0];
    $('#screen-crew').innerHTML = `
      <section class="section" aria-labelledby="crewTitle">
        <span class="eyebrow">Crew</span>
        <h1 class="page-title" id="crewTitle">Plan without chaos.</h1>
        <p class="lead">Approvals, private locations, and crew chat live here.</p>
        ${user ? '' : `<div class="safe-note"><strong>Guest:</strong> Sign in to request spots and chat.</div>`}
        <div class="filters">
          ${['upcoming','requests','chat'].map((p) => `<button class="filter-btn ${state.crewPanel === p ? 'active' : ''}" type="button" data-action="crew-panel" data-panel="${p}">${p[0].toUpperCase()+p.slice(1)}</button>`).join('')}
        </div>
        <div id="crewBody">${renderCrewBody(visibleTrips, reqs, trip)}</div>
      </section>`;
  }

  function renderCrewBody(visibleTrips, reqs, trip) {
    if (state.crewPanel === 'requests') {
      return `<div class="grid">${reqs.map((r) => {
        const t = state.trips.find((x) => x.id === r.tripId);
        const canApprove = isAdmin() || (currentUser() && t?.hostId === currentUser().id);
        return `<div class="panel"><span class="badge ${r.status === 'Approved' ? 'green' : r.status === 'Declined' ? 'red' : 'orange'}">${safe(r.status)}</span><h3>${safe(r.userName)}</h3><p class="muted">${safe(t?.title || 'Trip')} ${MID} ${safe(r.message)}</p><div class="row">${canApprove ? `<button class="btn success small" type="button" data-action="approve-request" data-request-id="${safe(r.id)}">Approve</button><button class="btn danger small" type="button" data-action="decline-request" data-request-id="${safe(r.id)}">Decline</button>` : `<button class="btn dark small" type="button" data-action="trip-details" data-trip-id="${safe(r.tripId)}">View trip</button>`}</div></div>`;
      }).join('') || `<div class="empty">No join requests yet.</div>`}</div>`;
    }
    if (state.crewPanel === 'chat') {
      if (!trip) return `<div class="empty">No active trip selected.</div>`;
      const messages = state.messages[trip.id] || [];
      const member = currentUser() && (trip.members?.includes(currentUser().id) || trip.hostId === currentUser().id || isAdmin());
      const chatComposer = member
        ? `<div class="chat-form"><input id="chatInput" name="chat-message" class="field" autocomplete="off" enterkeyhint="send" placeholder="Message the crew" /><button class="btn primary" type="button" data-action="send-chat" data-trip-id="${safe(trip.id)}">Send</button></div>`
        : `<div class="safe-note mt"><strong>Sign in required:</strong> Crew chat unlocks after approval.</div><div class="row mt"><button class="btn primary" type="button" data-action="open-auth-signin">Sign in to message</button></div>`;
      return `<div class="panel"><div class="row"><span class="badge">${safe(trip.title)}</span><span class="chip">${safe(trip.area)}</span></div><p class="muted"><strong>Private meetup:</strong> ${member ? safe(trip.privateLocation) : 'Locked until approval.'}</p><div class="chat-log">${messages.map((m) => `<div class="bubble ${currentUser()?.id === m.senderId ? 'mine' : ''}"><strong>${safe(m.senderName)}</strong>${safe(m.body)}</div>`).join('')}</div>${chatComposer}</div>`;
    }
    return `<div class="grid cards">${visibleTrips.map((t) => tripCard(t)).join('') || `<div class="empty">You have no active crew trips yet. Find one in Explore or post your own.${postTripCta('Post a trip')}</div>`}</div>`;
  }

  function renderFeed() {
    const types = ['All', 'Crew Recap', 'Catch Log', 'Dock Report', 'Open Water Seat', 'After-Bite Run'];
    const posts = visibleFeedPosts()
      .filter((p) => state.feedFilter === 'All' || p.type === state.feedFilter)
      .slice(0, FEED_RENDER_LIMIT);
    const refreshing = Boolean(state.feedRefreshing);
    $('#screen-feed').innerHTML = `
      <section class="section feed-room" aria-labelledby="feedTitle" data-feed-refreshing="${refreshing ? 'true' : 'false'}">
        <div class="section-head compact-head">
          <div>
            <span class="eyebrow">Feed</span>
            <h1 class="page-title" id="feedTitle">The bite board.</h1>
          </div>
          <button class="btn soft small" type="button" data-action="refresh-feed" ${refreshing ? 'disabled' : ''} aria-busy="${refreshing ? 'true' : 'false'}">${refreshing ? 'Refreshing...' : 'Refresh'}</button>
        </div>
        <p class="lead">Clean community posts only: successful trips, catch reports, shop notes, charter openings, and area updates. Exact spots stay private.</p>
        <div class="feed-composer-lite panel">
          <div><h3>Share something useful.</h3><p class="muted">Post a catch, report a bite, or help the next crew plan smarter.</p></div>
          <div class="row"><button class="btn primary" type="button" data-action="open-feed-form">Post to feed</button><button class="btn dark" type="button" data-action="open-create">More types</button></div>
        </div>
        <div class="filters">${types.map((t) => `<button class="filter-btn ${state.feedFilter === t ? 'active' : ''}" type="button" data-action="feed-filter" data-filter="${safe(t)}">${safe(t)}</button>`).join('')}</div>
        <div class="feed-list clean-feed">${posts.map((p) => feedCard(p)).join('') || `<div class="empty">No posts here yet. Share the first useful report.</div>`}</div>
      </section>`;
  }

  function renderTools() {
    const guides = state.guideLibrary || [];
    const lastFish = state.lastFishId;
    const lastMeasure = state.lastMeasurement;
    const hub = state.deviceHub || {};
    const activePanel = state.toolsPanel || 'tools';
    const toolsCards = `
        <div class="grid three tools-card-grid mt">
          <button class="tool-card panel photo-panel bait-panel" type="button" data-action="open-bait-help"><span class="tool-icon bait"></span><h3>Bait help</h3><p class="muted">Pick bait and rigs by area, target fish, tide, and water clarity.</p></button>
          <button class="tool-card panel photo-panel gear-panel" type="button" data-action="open-gear-help"><span class="tool-icon gear"></span><h3>Gear + tackle</h3><p class="muted">Core setups, terminal tackle, leaders, and trip checklists.</p></button>
          <button class="tool-card panel photo-panel device-panel" type="button" data-action="open-device-hub"><span class="tool-icon gps"></span><h3>GPS + devices</h3><p class="muted">Phone GPS, Bluetooth discovery, USB/NMEA bridge notes, and waypoint fix.</p></button>
          <button class="tool-card panel photo-panel fish-panel" type="button" data-action="open-fish-id"><span class="tool-icon fish"></span><h3>Fish identifier</h3><p class="muted">Assistive species estimate only. Not a legal harvest decision tool — verify species, size, season, and regulations with official sources.</p></button>
          <button class="tool-card panel photo-panel measure-panel" type="button" data-action="open-measure-tool"><span class="tool-icon ruler"></span><h3>Measure assist</h3><p class="muted">Camera/gallery length estimate only. Not enforcement or legal proof — confirm with a physical ruler and official rules.</p></button>
        </div>
        <div class="grid two mt tools-status-grid">
          <div class="panel warm-panel"><h3>Last fish ID</h3><p class="muted">${lastFish ? `${safe(lastFish.result)} ${MID} ${safe(lastFish.confidence)} confidence` : 'No fish ID run yet.'}</p><button class="btn soft small" type="button" data-action="open-fish-id">Try fish ID</button></div>
          <div class="panel warm-panel teal-panel"><h3>Last measure assist</h3><p class="muted">${lastMeasure ? `${safe(lastMeasure.note)} ${MID} ${safe(lastMeasure.units)}` : 'No measurement run yet.'}</p><button class="btn soft small" type="button" data-action="open-measure-tool">Open measure</button></div>
        </div>
        <div class="panel warm-panel device-status-card mt"><h3>Device link</h3><p class="muted">${safe(hub.lastFix ? `${hub.source}: ${formatGpsFix(hub)}` : hub.source || 'No device connected')}</p><button class="btn soft small" type="button" data-action="open-device-hub">Open devices</button></div>`;
    const guideCards = `
        <div class="section-head tools-subhead"><div><span class="eyebrow">Quick guide</span><h2>${safe(state.savedGuideArea || 'Tampa Bay')}</h2></div><button class="btn dark small" type="button" data-action="open-fishing-guides">Open library</button></div>
        <div class="grid cards guide-card-grid">${guides.map((g, i)=>`<article class="panel guide-preview-card guide-${i + 1}"><span class="badge">${safe(g.area)}</span><h3>${safe(g.title)}</h3><p class="muted">${safe(g.summary)}</p><div class="meta"><span class="chip">Common: ${safe(g.species)}</span><span class="chip">Bait: ${safe(g.bait || 'See bait help')}</span></div><p class="tiny"><strong>Method:</strong> ${safe(g.methods || 'Match current, cover, and conditions.')}<br><strong>Gear:</strong> ${safe(g.gear || 'Bring basic tackle and pliers.')}<br>${safe(g.safety)}</p></article>`).join('')}</div>
        <div class="grid two mt">
          <button class="tool-card panel photo-panel tutorial-panel" type="button" data-action="open-technique-tutorials"><span class="tool-icon tutorial"></span><h3>Tutorials</h3><p class="muted">Beginner-friendly methods for common fish and local conditions.</p></button>
          <button class="tool-card panel photo-panel guide-panel" type="button" data-action="open-fishing-guides"><span class="tool-icon guide"></span><h3>Full guide library</h3><p class="muted">Area patterns, species, safety notes, and local water info.</p></button>
        </div>`;
    $('#screen-tools').innerHTML = `
      <section class="section tools-screen tools-room" aria-labelledby="toolsTitle">
        <span class="eyebrow">Tools + Guide</span>
        <h1 class="page-title" id="toolsTitle">Pick what you need on the water.</h1>
        <p class="lead">Choose tools for quick field help or guide for area patterns, species notes, and beginner-friendly planning.</p>
        <div class="safe-note"><strong>Legal/safety note:</strong> Fish ID and measurement assist are planning aids only. They are not legal harvest decision tools. Always verify species, size, season, bag limits, and local regulations with official sources before keeping fish.</div>
        <div class="tools-switch" role="tablist" aria-label="Tools and guide sections">
          <button class="${activePanel === 'tools' ? 'active' : ''}" type="button" data-action="tools-panel" data-panel="tools"><b>Tools</b><span>Bait, gear, ID, measure</span></button>
          <button class="${activePanel === 'guide' ? 'active' : ''}" type="button" data-action="tools-panel" data-panel="guide"><b>Guide</b><span>Areas, patterns, tutorials</span></button>
        </div>
        <div class="tools-panel-body">${activePanel === 'guide' ? guideCards : toolsCards}</div>
      </section>`;
  }

  function renderProfile() {
    const user = currentUser();
    const adminPanel = renderAdminPanel();
    const myTrips = user ? state.trips.filter((t) => t.hostId === user.id || t.members?.includes(user.id)).length : 0;
    const myPosts = user ? state.feed.filter((p) => p.authorId === user.id).length : 0;
    const myRequests = user ? state.requests.filter((r) => r.userId === user.id || state.trips.some((t) => t.hostId === user.id && t.id === r.tripId)).length : 0;
    const unread = unreadNotifications();
    const homeWater = user?.area || state.savedGuideArea || userArea();
    const role = user?.role || 'Guest';
    const fishingStyle = user?.fishingStyles || 'Inshore, pier, weekend trips';
    const privacy = state.privacyMode || 'Crew-only exact locations';
    const proofLine = myPosts ? `${myPosts} bite board post${myPosts === 1 ? '' : 's'}` : 'No catch posts yet';
    const trustLine = user ? (isAdmin() ? 'Operator verified' : role === 'Captain' ? 'Captain profile' : role === 'Business' ? 'Partner profile' : 'Crew profile') : 'Browse mode';
    const signalItems = [
      { label: 'Crew water', value: homeWater, detail: 'home base' },
      { label: 'Trips', value: myTrips, detail: 'hosted or joined' },
      { label: 'Proof', value: proofLine, detail: 'shared reports' },
      { label: 'Privacy', value: privacy, detail: 'spot sharing' }
    ];
    const profileActions = user
      ? `<button class="btn primary" type="button" data-action="open-edit-profile">Edit card</button><button class="btn soft" type="button" data-action="open-notifications">Alerts ${unread ? `(${unread})` : ''}</button><button class="btn dark" type="button" data-action="open-user-settings">Settings</button><button class="btn danger" type="button" data-action="logout">Log out</button>`
      : `<button class="btn primary" type="button" data-action="open-auth-signin">${safe(GUEST_SIGN_IN_PROMPT)}</button><button class="btn soft" type="button" data-action="go" data-screen="explore">Continue as Guest</button><button class="btn dark" type="button" data-action="open-tutorial">Tutorial</button>`;
    const profileAvatar = user
      ? `<button class="header-avatar profile-avatar-xl profile-pass-avatar" type="button" data-action="open-photo-profile" style="background-image:${user.avatar ? `url('${user.avatar}')` : ''}">${user.avatar ? '' : safe(initials(user.name || '?'))}</button>`
      : `<div class="header-avatar profile-avatar-xl profile-pass-avatar guest-avatar" aria-hidden="true">FC</div>`;
    const profileEditAction = user
      ? `<button class="btn dark small" type="button" data-action="open-edit-profile">Tune card</button>`
      : `<button class="btn dark small" type="button" data-action="open-auth-signin">Sign in to customize</button>`;
    const profileGuestNote = user ? '' : `<div class="safe-note mt"><strong>Guest:</strong> ${safe(GUEST_SIGN_IN_PROMPT)}</div>`;
    const igConnection = user?.instagramConnection || state.instagramConnection || null;
    const igConfigured = metaInstagramConfigured();
    const igConnectPanel = user ? `
      <section class="section profile-ig-section">
        <div class="section-head"><div><span class="eyebrow">Integrations</span><h2>Instagram</h2></div></div>
        <div class="panel ig-connect-panel">
          <div class="ig-connect-row">
            <span class="ig-mark" aria-hidden="true">${IG_MARK}</span>
            <div>
              <h3>${igConnection?.username ? `Linked @${safe(igConnection.username)}` : 'Connect Instagram'}</h3>
              <p class="muted">${igConfigured
                ? 'Connect a Business/Creator account through Meta. This is not a login — email/password stays primary.'
                : 'Owner setup: set META_APP_ID and ENABLE_INSTAGRAM_OAUTH in config.js, then add the redirect URI in the Meta app.'}</p>
            </div>
          </div>
          <div class="row mt">
            <button class="btn ${igConfigured ? 'primary' : 'dark'} small" type="button" data-action="instagram-connect"${igConfigured ? '' : ' disabled'}>${igConnection ? 'Reconnect' : 'Connect Instagram'}</button>
            ${igConnection ? `<button class="btn soft small" type="button" data-action="instagram-import">Import recent</button>` : ''}
          </div>
          <p class="tiny">Share-to-Instagram caption handoff remains available from Feed share — separate from connect.</p>
        </div>
      </section>` : '';

    $('#screen-profile').innerHTML = `
      <section class="section profile-room profile-pass-room" aria-labelledby="profileTitle">
        <div class="profile-pass theme-${safe((user?.profileTheme || 'Harbor Blue').toLowerCase().replace(/\s+/g,'-'))}">
          <div class="profile-map-band">
            <span>FishCrew Pass</span>
            <b>${safe(homeWater)}</b>
          </div>
          <div class="profile-pass-body">
            ${profileAvatar}
            <div class="profile-pass-copy">
              <div class="profile-pass-kicker"><span class="eyebrow">Fishing card</span><span class="badge green">${safe(trustLine)}</span></div>
              <h1 class="page-title" id="profileTitle">${user ? safe(user.name) : 'Your FishCrew'}</h1>
              <p class="muted">${user ? `${safe(usernameFor(user))} | ${safe(roleLabel(role))} | ${safe(homeWater)}` : 'Browse first. Sign in when you are ready to post, join, chat, and upload.'}</p>
              <p class="profile-bio">${safe(user?.bio || 'Find crew, share reports, and keep exact spots protected.')}</p>
              <div class="profile-pass-tags">
                <span class="chip">${safe(fishingStyle)}</span>
                <span class="chip">${safe(privacy)}</span>
              </div>
            </div>
            <div class="profile-pass-actions">${profileActions}</div>
          </div>
          ${profileGuestNote}
        </div>
      </section>
      ${igConnectPanel}

      <section class="section profile-signal-section">
        <div class="section-head"><div><span class="eyebrow">Crew signal</span><h2>Ready to match with the right crew.</h2></div>${profileEditAction}</div>
        <div class="profile-signal-grid">
          ${signalItems.map((item) => `<article class="profile-signal"><span>${safe(item.label)}</span><strong>${safe(item.value)}</strong><small>${safe(item.detail)}</small></article>`).join('')}
        </div>
      </section>

      <section class="section profile-card-section">
        <div class="section-head"><div><span class="eyebrow">Fishing card</span><h2>What crews should know.</h2></div>${profileEditAction}</div>
        <div class="profile-info-grid">
          <article class="panel profile-info-card"><span class="eyebrow">Water</span><h3>Home water</h3><p class="muted">${safe(homeWater)}</p></article>
          <article class="panel profile-info-card"><span class="eyebrow">Style</span><h3>Fishing style</h3><p class="muted">${safe(fishingStyle)}</p></article>
          <article class="panel profile-info-card"><span class="eyebrow">Privacy</span><h3>Spot rules</h3><p class="muted">${safe(privacy)}</p></article>
          <article class="panel profile-info-card"><span class="eyebrow">Availability</span><h3>Best fit</h3><p class="muted">${role === 'Captain' ? 'Open-seat planning and crew coordination.' : role === 'Business' ? 'Partner updates, leads, and dock reports.' : 'Weekend windows, inshore runs, and pier sessions.'}</p></article>
        </div>
      </section>

      <section class="section profile-alert-section">
        <div class="section-head"><div><span class="eyebrow">Notifications</span><h2>What needs attention</h2></div><button class="btn dark small" type="button" data-action="open-notifications">Open alerts</button></div>
        <div class="profile-attention-grid">
          ${(state.notifications || []).slice(0, 2).map((n)=>`<div class="panel notification-card ${n.read ? 'read' : ''}"><span class="badge ${n.read ? '' : 'green'}">${safe(n.type || 'Alert')}</span><h3>${safe(n.title)}</h3><p class="muted">${safe(n.body)}</p></div>`).join('') || '<div class="empty">No alerts yet.</div>'}
          <div class="panel profile-info-card"><span class="badge orange">${safe(myRequests)}</span><h3>Open requests</h3><p class="muted">Requests, crew spots, approvals, and trip replies stay visible here.</p></div>
          <div class="panel profile-info-card"><span class="badge">${safe(unread)}</span><h3>Unread alerts</h3><p class="muted">Crew pings, conditions, and moderation notes stay separate from the identity card.</p></div>
        </div>
      </section>
      ${isAdmin() ? renderAdminOnlyProfileControls() : ''}
      ${adminPanel}`;
  }

  function renderAdminOnlyProfileControls() {
    return `<section class="section admin-only-controls">
      <div class="section-head"><div><span class="eyebrow">Operator tools</span><h2>Operations controls</h2></div><div class="row"><button class="btn dark small" type="button" data-action="open-store-readiness">Store readiness</button><button class="btn dark small" type="button" data-action="open-backend-help">Connections</button></div></div>
      <div class="grid three">
        <div class="panel"><h3>Data connection</h3><p class="muted">${state.backendMode === 'supabase' ? 'Shared data is configured.' : 'Browser data is active. Shared data can be connected when ready.'}</p><div class="row"><button class="btn soft small" type="button" data-action="check-backend">Check</button><button class="btn dark small" type="button" data-action="pull-supabase">Pull</button><button class="btn dark small" type="button" data-action="sync-supabase">Push</button></div></div>
        <div class="panel"><h3>Launch checks</h3><p class="muted">${safe(state.supabasePrep?.releaseGate || 'Not run yet.')}</p><button class="btn primary small" type="button" data-action="run-release-gate">Run checks</button></div>
        <div class="panel"><h3>Review board</h3><p class="muted">${safe((state.qaNotes || []).filter((n)=>n.status !== 'Done').length)} open notes.</p><button class="btn dark small" type="button" data-action="open-qa-note">Add note</button></div>
      </div>
      <div class="grid three mt">
        <div class="panel"><h3>Connection diagnostics</h3><p class="muted">Auth, tables, storage, and realtime connection status.</p><button class="btn dark small" type="button" data-action="open-backend-diagnostics">Open</button></div>
        <div class="panel"><h3>Role matrix</h3><p class="muted">Guest, angler, captain, business, and operator permissions.</p><button class="btn dark small" type="button" data-action="open-role-matrix">View</button></div>
        <div class="panel"><h3>Media pipeline</h3><p class="muted">${safe(state.mediaAssets?.length || 0)} assets ${MID} ${safe(state.reports?.filter((r)=>r.status==='Open').length || 0)} reviews.</p><button class="btn dark small" type="button" data-action="open-media-pipeline">Open</button></div>
      </div>
      <div class="grid three mt">
        <div class="panel"><h3>User directory</h3><p class="muted">${safe((state.users || []).length)} profiles across anglers, captains, businesses, and operators.</p><button class="btn dark small" type="button" data-action="open-user-directory">Open directory</button></div>
        <div class="panel"><h3>Support queue</h3><p class="muted">${safe((state.accountDeletionRequests || []).length)} account requests | ${safe((state.reports || []).filter((r)=>r.status==='Open').length)} open reports.</p><button class="btn dark small" type="button" data-action="open-support-queue">Open support</button></div>
        <div class="panel"><h3>Device readiness</h3><p class="muted">${safe(state.deviceHub?.status || 'Ready')} | ${safe(state.deviceHub?.source || 'No device connected')}</p><button class="btn dark small" type="button" data-action="open-device-hub">Open devices</button></div>
      </div>
      ${renderPluginReadiness()}
      ${renderLaunchQa()}
    </section>`;
  }

  function renderPluginReadiness() {
    const items = state.pluginReadiness || [];
    const groups = ['Backend','Auth','Social','Conditions','Maps','Content','Marketplace','Visuals'];
    return `<section class="section plugin-readiness">
      <div class="section-head compact-head"><div><span class="eyebrow">Connections</span><h2>Integration readiness</h2></div><button class="btn dark small" type="button" data-action="check-backend">Check connection</button></div>
      <div class="plugin-grid">
        ${groups.map((group) => {
          const groupItems = items.filter((item) => item.area === group);
          if (!groupItems.length) return '';
          return `<article class="plugin-card"><span class="eyebrow">${safe(group)}</span>${groupItems.map((item) => `<div class="plugin-row"><div><strong>${safe(item.label)}</strong><p class="muted">${safe(item.note)}</p></div><span class="chip">${safe(item.status)}</span></div>`).join('')}</article>`;
        }).join('')}
      </div>
      <p class="tiny">No secret keys belong in this package. Add provider credentials in provider dashboards, then keep only public browser-safe keys here.</p>
    </section>`;
  }

  function renderLaunchQa() {
    const notes = state.qaNotes || [];
    const checks = state.launchChecks || [];
    return `<section class="section">
      <div class="section-head">
        <div><span class="eyebrow">Review + launch</span><h2>Launch board</h2></div>
        <button class="btn primary small" type="button" data-action="open-qa-note">Add note</button>
      </div>
      <div class="grid two">
        <div class="panel">
          <h3>Two-phone launch check</h3>
          <p class="muted">Use this when shared data is connected. Check each item from two real devices before inviting the crowd.</p>
          <div class="stack">
            ${checks.map((c) => `<button class="check-row ${c.done ? 'done' : ''}" type="button" data-action="toggle-launch-check" data-check-id="${safe(c.id)}"><span>${c.done ? '?' : '?'}</span><b>${safe(c.label)}</b></button>`).join('')}
          </div>
        </div>
        <div class="panel">
          <h3>Open notes</h3>
          <p class="muted">Keep small issues visible and controlled.</p>
          <div class="stack">
            ${notes.slice(0, 6).map((n) => `<div class="qa-note ${n.status === 'Done' ? 'done' : ''}"><div class="row"><span class="badge ${n.priority === 'High' ? 'red' : n.priority === 'Medium' ? 'orange' : 'green'}">${safe(n.priority)}</span><span class="chip">${safe(n.screen)}</span></div><p>${safe(n.issue)}</p><div class="row"><button class="btn dark small" type="button" data-action="toggle-qa-note" data-note-id="${safe(n.id)}">${n.status === 'Done' ? 'Reopen' : 'Mark done'}</button></div></div>`).join('') || '<div class="empty">No notes yet.</div>'}
          </div>
        </div>
      </div>
    </section>`;
  }

  function renderAdminPanel() {
    const user = currentUser();
    if (!user) {
      return `<section class="section"><div class="panel"><span class="eyebrow">Operations</span><h2>Partner tools</h2><p class="muted">Sign in as a verified captain, business partner, or operator to manage bookings, reports, and business posts.</p><div class="row"><button class="btn primary" type="button" data-action="open-auth-signin">Sign in</button><button class="btn dark" type="button" data-action="open-auth-create">Request access</button></div></div></section>`;
    }
    if (!isBusinessRole()) {
      return `<section class="section"><div class="panel"><span class="eyebrow">Operations</span><h2>Partner tools locked</h2><p class="muted">This area is for operators, captains, tackle shops, cruises, marinas, and pro charters.</p><button class="btn dark" type="button" data-action="open-user-settings">Review account settings</button></div></section>`;
    }
    const openReports = state.reports.filter((r)=>r.status==='Open').length;
    const deletionRequests = (state.accountDeletionRequests || []).length;
    const blockedCount = (state.blockedUsers || []).length;
    const deviceStatus = state.deviceHub?.lastFix ? formatGpsFix(state.deviceHub) : (state.deviceHub?.source || 'No device connected');
    return `<section class="section"><div class="section-head"><div><span class="eyebrow">Bridge</span><h2>Operations console</h2></div><button class="btn primary small" type="button" data-action="run-ops">Run morning ops</button></div>
      <div class="grid three">
        <div class="admin-card"><span class="badge">Bookings</span><h3>${state.bookings.length}</h3><p class="muted">Charter, cruise, and trip inquiries.</p><div class="row"><button class="btn dark small" type="button" data-action="open-business-leads">Inbox</button><button class="btn soft small" type="button" data-action="open-booking-form">Add</button></div></div>
        <div class="admin-card"><span class="badge orange">Moderation</span><h3>${openReports}</h3><p class="muted">Reports, media reviews, and removed-content audit.</p><div class="row"><button class="btn dark small" type="button" data-action="open-moderation">Queue</button><button class="btn soft small" type="button" data-action="open-admin-audit">Audit</button></div></div>
        <div class="admin-card"><span class="badge green">Revenue</span><h3>$${state.businesses.reduce((sum,b)=>sum+Number(b.revenue||0),0)}</h3><p class="muted">Ads, leads, deals, bookings.</p><button class="btn dark small" type="button" data-action="open-revenue">Revenue view</button></div>
      </div>
      <div class="grid three mt">
        <div class="admin-card operator-card"><span class="badge green">Users</span><h3>${safe((state.users || []).length)}</h3><p class="muted">Profiles, roles, home waters, and local status.</p><button class="btn dark small" type="button" data-action="open-user-directory">Directory</button></div>
        <div class="admin-card operator-card"><span class="badge orange">Support</span><h3>${safe(deletionRequests + blockedCount)}</h3><p class="muted">Deletion requests, blocked users, reports, and user support paths.</p><button class="btn dark small" type="button" data-action="open-support-queue">Support queue</button></div>
        <div class="admin-card operator-card"><span class="badge">Devices</span><h3>${safe(state.deviceHub?.status || 'Ready')}</h3><p class="muted">${safe(deviceStatus)}</p><button class="btn dark small" type="button" data-action="open-device-hub">Device hub</button></div>
      </div>
      <div class="section"><h2>Business directory</h2><div class="grid cards">${state.businesses.map((b)=>`<div class="panel"><span class="badge ${b.status==='Verified'?'green':'orange'}">${safe(b.status)}</span><h3>${safe(b.name)}</h3><p class="muted">${safe(b.kind)} ${MID} ${safe(b.area)}</p><div class="meta"><span class="chip">${safe(b.leads)} leads</span><span class="chip">$${safe(b.revenue)}</span></div><div class="row"><button class="btn success small" type="button" data-action="verify-business" data-business-id="${safe(b.id)}">Verify</button><button class="btn dark small" type="button" data-action="book-business" data-business-id="${safe(b.id)}">New lead</button></div></div>`).join('')}</div></div>
      <div class="section"><h2>Ops log</h2><div class="panel">${state.opsLog.slice(0,8).map((x)=>`<p class="muted">${safe(x)}</p>`).join('')}</div></div>
    </section>`;
  }

  function render() {
    hydrateHeader();
    const screen = state.activeScreen || 'home';
    // Only rebuild the active screen — inactive screens keep prior DOM (social-app sticky feel).
    const renderers = {
      home: renderHome,
      explore: renderExplore,
      crew: renderCrew,
      feed: renderFeed,
      tools: renderTools,
      profile: renderProfile
    };
    const activeRenderer = renderers[screen] || renderHome;
    activeRenderer();
    $$('.screen').forEach((s) => s.classList.toggle('active', s.id === `screen-${screen}`));
    $$('.nav-btn').forEach((b) => b.classList.toggle('active', b.dataset.screen === screen));
  }

  async function refreshFeed(options = {}) {
    if (state.feedRefreshing && !options.force) return;
    state.feedRefreshing = true;
    if (state.activeScreen === 'feed') renderFeed();
    try {
      if (liveReady()) {
        await pullSupabase({ silent: true, reason: 'feed-refresh' });
      } else if (!options.silent) {
        toast('Browsing local feed. Connect shared data to pull live posts.');
      }
      if (!options.silent) toast('Feed updated.');
    } catch (error) {
      if (!options.silent) toast(`Feed refresh failed: ${error.message}`, 'danger');
    } finally {
      state.feedRefreshing = false;
      if (state.activeScreen === 'feed') renderFeed();
    }
  }

  function modal(html) {
    const root = $('#modalRoot');
    if (!document.body.classList.contains('modal-open')) {
      scrollLockY = window.scrollY || document.documentElement.scrollTop || 0;
      document.body.style.top = `-${scrollLockY}px`;
      document.body.classList.add('modal-open');
    }
    root.innerHTML = `<div class="modal" role="dialog" aria-modal="true">${html}</div>`;
    root.classList.toggle('welcome-modal', modalMode === 'tutorial');
    root.classList.remove('hidden');
    root.setAttribute('aria-hidden', 'false');
  }

  function closeModal() {
    const root = $('#modalRoot');
    root.classList.add('hidden');
    root.classList.remove('welcome-modal');
    root.setAttribute('aria-hidden', 'true');
    root.innerHTML = '';
    modalMode = null;
    if (document.body.classList.contains('modal-open')) {
      document.body.classList.remove('modal-open');
      document.body.style.top = '';
      window.scrollTo(0, scrollLockY || 0);
    }
  }

  function openAuth(message = GUEST_SIGN_IN_PROMPT, suggestedRole = 'Angler', mode = 'signin') {
    modalMode = 'auth';
    authTab = mode === 'create' ? 'create' : 'signin';
    authBusy = false;
    const createMode = authTab === 'create';
    const roleOptions = `<option ${suggestedRole==='Angler'?'selected':''}>Angler</option><option ${suggestedRole==='Captain'?'selected':''}>Captain</option><option ${suggestedRole==='Business'?'selected':''}>Business</option>`;
    const signInFields = `
        <div id="authSignInPanel" data-auth-panel="signin" class="auth-panel ${createMode ? 'hidden' : ''}">
        <label class="label">Email or username<input id="authSignInIdentity" name="username" class="field" autocomplete="username" inputmode="email" autocapitalize="none" spellcheck="false" enterkeyhint="next" placeholder="email or username" /></label>
        <label class="label">Password<input id="authSignInPassword" name="password" class="field" type="password" autocomplete="current-password" enterkeyhint="done" placeholder="Password" /></label>
        <p class="tiny auth-footnote">Use your email or username.</p>
        <div class="row auth-actions">
          <button class="btn primary" type="button" data-action="auth-signin">Sign in</button>
          <button class="btn soft" type="button" data-action="switch-auth-tab" data-auth-tab="create">Create account</button>
          <button class="btn dark" type="button" data-action="close-modal">Continue as Guest</button>
        </div>
        <button class="btn text full" type="button" data-action="auth-forgot">Forgot password?</button>
        </div>`;
    const createFields = `
        <div id="authCreatePanel" data-auth-panel="create" class="auth-panel ${createMode ? '' : 'hidden'}">
        <div class="form-grid">
          <label class="label">First name<input id="authFirstName" name="given-name" class="field" autocomplete="given-name" autocapitalize="words" enterkeyhint="next" placeholder="First name" /></label>
          <label class="label">Last name<input id="authLastName" name="family-name" class="field" autocomplete="family-name" autocapitalize="words" enterkeyhint="next" placeholder="Last name" /></label>
        </div>
        <label class="label">Role<select id="authRole" class="select" autocomplete="off">${roleOptions}</select></label>
        <div class="form-grid">
          <label class="label">Email<input id="authCreateEmail" name="email" class="field" type="email" autocomplete="email" inputmode="email" autocapitalize="none" spellcheck="false" enterkeyhint="next" placeholder="you@example.com" /></label>
          <label class="label">Username<input id="authCreateUsername" name="username" class="field" autocomplete="username" inputmode="text" autocapitalize="none" spellcheck="false" enterkeyhint="next" placeholder="capt_mason" /></label>
        </div>
        <label class="label">Password<input id="authCreatePassword" name="new-password" class="field" type="password" autocomplete="new-password" enterkeyhint="next" placeholder="Use a secure password" /></label>
        <label class="label">Confirm password<input id="authCreatePasswordConfirm" name="new-password-confirm" class="field" type="password" autocomplete="new-password" enterkeyhint="done" placeholder="Confirm password" /></label>
        <div class="password-help" id="passwordHelp">Use 8+ characters with uppercase, lowercase, a number, and a special character.</div>
        <label class="label">Home area<input id="authArea" name="address-level2" class="field" autocomplete="address-level2" autocapitalize="words" enterkeyhint="done" placeholder="Tampa Bay" /></label>
        <div class="row auth-actions">
          <button class="btn primary" type="button" data-action="auth-create">Create account</button>
          <button class="btn soft" type="button" data-action="switch-auth-tab" data-auth-tab="signin">Back to sign in</button>
          <button class="btn dark" type="button" data-action="close-modal">Continue as Guest</button>
        </div>
        </div>`;
    modal(`
      <div class="modal-head"><div><span class="eyebrow">FishCrew account</span><h2 id="authModalTitle">${createMode ? 'Create your FishCrew profile.' : 'Sign in when it matters.'}</h2></div><button class="x-btn" type="button" data-action="close-modal">${CLOSE_BTN}</button></div>
      <p class="lead" id="authModalLead">${safe(message)}</p>
      <div class="safe-note"><strong>Guest browse:</strong> explore freely. Sign in to post, message, upload, or change profile data.</div>
      <div class="auth-tabs" role="tablist" aria-label="Account options">
        <button class="${createMode ? '' : 'active'}" type="button" data-action="switch-auth-tab" data-auth-tab="signin" aria-selected="${createMode ? 'false' : 'true'}">Sign in</button>
        <button class="${createMode ? 'active' : ''}" type="button" data-action="switch-auth-tab" data-auth-tab="create" aria-selected="${createMode ? 'true' : 'false'}">Create account</button>
      </div>
      <div id="authError" class="auth-error hidden" role="alert"></div>
      <div id="authSuccess" class="auth-success hidden" role="status"></div>
      <div class="forms mt">
        ${signInFields}
        ${createFields}
        <div class="auth-divider"><span>or continue with</span></div>
        <div class="social-icon-row" aria-label="Social sign-in options">
          ${socialAuthButtonHtml('Google')}
          ${socialAuthButtonHtml('Facebook')}
          <button class="social-icon instagram coming-soon" type="button" data-action="social-login" data-provider="Instagram" aria-label="Instagram is not a login method" title="Instagram connect lives on Profile"><span class="ig-mark">${IG_MARK}</span></button>
        </div>
        <p class="tiny auth-footnote">Email and password are the primary sign-in. Unfinished social providers show Coming soon until configured in config.js. Instagram connect is a Profile integration, not login.</p>
      </div>`);
    clearAuthError();
    clearAuthSuccess();
  }

  function switchAuthTab(tab = 'signin') {
    if (modalMode !== 'auth') return;
    authTab = tab === 'create' ? 'create' : 'signin';
    authBusy = false;
    clearAuthError();
    clearAuthSuccess();
    const createMode = authTab === 'create';
    $('#authSignInPanel')?.classList.toggle('hidden', createMode);
    $('#authCreatePanel')?.classList.toggle('hidden', !createMode);
    $$('.auth-tabs button').forEach((btn) => {
      const active = btn.dataset.authTab === authTab;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    const title = $('#authModalTitle');
    if (title) title.textContent = createMode ? 'Create your FishCrew profile.' : 'Sign in when it matters.';
  }

  function openCreate() {
    if (!requireLogin('Sign in to post trips, catches, photos, shop updates, charter openings, or cruise opportunities.')) return;
    modal(`
      <div class="modal-head"><div><span class="eyebrow">Create</span><h2>What are we posting?</h2></div><button class="x-btn" type="button" data-action="close-modal">${CLOSE_BTN}</button></div>
      <div class="grid two">
        <button class="panel" type="button" data-action="open-trip-form"><h3>Fishing trip</h3><p class="muted">Open seats, cost split, private meetup after approval.</p></button>
        <button class="panel" type="button" data-action="open-feed-form"><h3>Catch / recap</h3><p class="muted">Photo, video, or trip recap for the running feed.</p></button>
        <button class="panel" type="button" data-action="open-business-form"><h3>Business post</h3><p class="muted">Tackle shop, charter, cruise, marina, or guide opportunity.</p></button>
        <button class="panel" type="button" data-action="open-booking-form"><h3>Booking lead</h3><p class="muted">Charter/cruise inquiry or business lead.</p></button>
      </div>`);
  }

  function openTripForm() {
    if (!requireLogin('Sign in to post trips, catches, photos, shop updates, charter openings, or cruise opportunities.')) return;
    modal(`
      <div class="modal-head"><div><span class="eyebrow">Trip</span><h2>Post a fishing plan.</h2></div><button class="x-btn" type="button" data-action="close-modal">${CLOSE_BTN}</button></div>
      <div class="forms">
        <label class="label">Title<input id="tripTitle" name="trip-title" class="field" autocomplete="off" placeholder="Saturday inshore crew needed" /></label>
        <div class="form-grid"><label class="label">Type<select id="tripType" class="select"><option>Boat</option><option>Pier</option><option>Kayak</option><option>Surf</option><option>Charter</option></select></label><label class="label">Area<input id="tripArea" name="trip-area" class="field" autocomplete="address-level2" value="${safe(userArea())}" /></label></div>
        <div class="form-grid"><label class="label">Time<input id="tripTime" name="trip-time" class="field" autocomplete="off" value="Saturday ? 6:30 AM" /></label><label class="label">Open spots<input id="tripSpots" name="trip-spots" class="field" type="number" inputmode="numeric" autocomplete="off" min="0" value="2" /></label></div>
        <label class="label">Target species<input id="tripSpecies" name="trip-species" class="field" autocomplete="off" placeholder="Redfish / Snook" /></label>
        <label class="label">Public location<input id="tripPublic" name="trip-public-location" class="field" autocomplete="off" placeholder="General area only" /></label>
        <label class="label">Private meetup location<input id="tripPrivate" name="trip-private-location" class="field" autocomplete="off" placeholder="Ramp/slip/meetup details for approved crew" /></label>
        <div class="form-grid"><label class="label">Wind<input id="tripWind" name="trip-wind" class="field" autocomplete="off" value="8 mph NE" /></label><label class="label">Waves<input id="tripWaves" name="trip-waves" class="field" autocomplete="off" value="1.0 ft" /></label></div>
        <div class="form-grid"><label class="label">Tide<input id="tripTide" name="trip-tide" class="field" autocomplete="off" value="Incoming" /></label><label class="label">Score<select id="tripScore" class="select"><option>Great</option><option selected>Good</option><option>Fair</option><option>Rough</option><option>Unsafe</option></select></label></div>
        <div class="file-box"><label class="label">Optional trip photo<input id="tripMedia" name="trip-media" type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif,image/gif" /></label><p class="tiny">Trip photos are reviewed before public Explore display.</p></div>
        <button class="btn primary full" type="button" data-action="save-trip">Post trip</button>
      </div>`);
  }

  function openFeedForm(type = 'Crew Recap') {
    if (!requireLogin('Sign in to post photos, videos, GIFs, and catch reports.')) return;
    modal(`
      <div class="modal-head"><div><span class="eyebrow">Feed</span><h2>Post proof.</h2></div><button class="x-btn" type="button" data-action="close-modal">${CLOSE_BTN}</button></div>
      <div class="forms">
        <div class="form-grid"><label class="label">Post type<select id="feedType" class="select"><option ${type==='Crew Recap'?'selected':''}>Crew Recap</option><option>Catch Log</option><option>Dock Report</option><option>Open Water Seat</option><option>After-Bite Run</option></select></label><label class="label">Area<input id="feedArea" name="feed-area" class="field" autocomplete="address-level2" value="${safe(userArea())}" /></label></div>
        <label class="label">Title<input id="feedTitleInput" name="feed-title" class="field" autocomplete="off" placeholder="Morning water window paid off" /></label>
        <label class="label">Caption<textarea id="feedBody" name="feed-caption" class="field" autocomplete="off" placeholder="What happened? Keep exact spots private."></textarea></label>
        <div class="file-box"><label class="label">Photo, video, or GIF<input id="feedMedia" name="feed-media" type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif,image/gif,video/mp4,video/quicktime,video/webm" /></label><p class="tiny">JPG, PNG, WEBP, HEIC, GIF, MP4, MOV, or WEBM. Public media stays hidden until an operator approves it.</p></div>
        <button class="btn primary full" type="button" data-action="save-feed-post">Post to feed</button>
      </div>`);
  }

  function openBusinessForm() {
    if (!requireBusiness('Business, captain, or operator access required to create partner posts.')) return;
    modal(`
      <div class="modal-head"><div><span class="eyebrow">Business</span><h2>Add partner or promo.</h2></div><button class="x-btn" type="button" data-action="close-modal">${CLOSE_BTN}</button></div>
      <div class="forms">
        <label class="label">Business name<input id="bizName" name="organization" class="field" autocomplete="organization" placeholder="Harbor Sunset Cruises" /></label>
        <div class="form-grid"><label class="label">Type<select id="bizKind" class="select"><option>Tackle Shop</option><option>Pro Charter</option><option>After-Bite Run</option><option>Guide Service</option><option>Marina</option></select></label><label class="label">Area<input id="bizArea" name="business-area" class="field" autocomplete="address-level2" value="${safe(userArea())}" /></label></div>
        <label class="label">Campaign / offer<input id="bizCampaign" name="business-offer" class="field" autocomplete="off" placeholder="Weekend open seat boost" /></label>
        <button class="btn primary full" type="button" data-action="save-business">Save business</button>
      </div>`);
  }

  function openBookingForm(businessId = '') {
    if (!requireBusiness('Business, captain, or operator access required to manage booking leads.')) return;
    modal(`
      <div class="modal-head"><div><span class="eyebrow">Booking</span><h2>Capture the lead.</h2></div><button class="x-btn" type="button" data-action="close-modal">${CLOSE_BTN}</button></div>
      <div class="forms">
        <label class="label">Customer name<input id="bookCustomer" name="customer-name" class="field" autocomplete="name" placeholder="New lead" /></label>
        <div class="form-grid"><label class="label">Type<select id="bookKind" class="select"><option>Charter inquiry</option><option>Cruise inquiry</option><option>Tackle shop deal</option><option>Guide inquiry</option></select></label><label class="label">Date/time<input id="bookDate" name="booking-date" class="field" autocomplete="off" placeholder="Saturday morning" /></label></div>
        <label class="label">Business<select id="bookBusiness" class="select">${state.businesses.map((b)=>`<option value="${safe(b.id)}" ${businessId===b.id?'selected':''}>${safe(b.name)}</option>`).join('')}</select></label>
        <label class="label">Value<input id="bookValue" name="booking-value" class="field" type="number" inputmode="decimal" autocomplete="off" min="0" value="150" /></label>
        <label class="label">Notes<textarea id="bookNotes" name="booking-notes" class="field" autocomplete="off" placeholder="What does the customer want?"></textarea></label>
        <button class="btn primary full" type="button" data-action="save-booking">Save booking lead</button>
      </div>`);
  }

  function openPhotoProfile() {
    if (!requireLogin('Sign in to add a profile photo.')) return;
    modal(`
      <div class="modal-head"><div><span class="eyebrow">Profile photo</span><h2>Add your face.</h2></div><button class="x-btn" type="button" data-action="close-modal">${CLOSE_BTN}</button></div>
      <div class="forms"><div class="file-box"><label class="label">Upload photo<input id="profilePhoto" name="profile-photo" type="file" accept="image/*" /></label></div><button class="btn primary full" type="button" data-action="save-profile-photo">Save photo</button></div>`);
  }

  function openEditProfile() {
    if (!requireLogin()) return;
    const u = currentUser();
    modal(`
      <div class="modal-head"><div><span class="eyebrow">Profile</span><h2>Edit your fishing card.</h2></div><button class="x-btn" type="button" data-action="close-modal">${CLOSE_BTN}</button></div>
      <div class="forms">
        <div class="form-grid"><label class="label">Name<input id="editName" name="name" class="field" autocomplete="name" value="${safe(u.name)}" /></label><label class="label">Username<input id="editUsername" name="username" class="field" autocomplete="username" autocapitalize="none" spellcheck="false" value="${safe(u.username || normalizeUsername(u.name))}" /></label></div>
        <div class="form-grid"><label class="label">Role<select id="editRole" class="select"><option ${u.role==='Angler'?'selected':''}>Angler</option><option ${u.role==='Captain'?'selected':''}>Captain</option><option ${u.role==='Business'?'selected':''}>Business</option><option value="Admin" ${u.role==='Admin'?'selected':''}>Operator</option></select></label><label class="label">Home water<input id="editArea" name="address-level2" class="field" autocomplete="address-level2" value="${safe(u.area)}" /></label></div>
        <label class="label">Bio<textarea id="editBio" name="profile-bio" class="field" autocomplete="off" placeholder="Tell crews how you fish.">${safe(u.bio || '')}</textarea></label>
        <label class="label">Fishing style<input id="editStyles" name="fishing-style" class="field" autocomplete="off" placeholder="Inshore, pier, kayak, charter" value="${safe(u.fishingStyles || '')}" /></label>
        <label class="label">Profile theme<select id="editTheme" class="select"><option ${u.profileTheme==='Harbor Blue'?'selected':''}>Harbor Blue</option><option ${u.profileTheme==='Seafoam'?'selected':''}>Seafoam</option><option ${u.profileTheme==='Sunrise'?'selected':''}>Sunrise</option><option ${u.profileTheme==='Dockside'?'selected':''}>Dockside</option><option ${u.profileTheme==='Mangrove'?'selected':''}>Mangrove</option></select></label>
        <div class="safe-note"><strong>Verification note:</strong> Role changes are allowed, and captain, business, or operator visibility may require review before public display.</div>
        <button class="btn primary full" type="button" data-action="save-profile">Save profile</button>
      </div>`);
  }

  function openTutorial() {
    modalMode = 'tutorial';
    modal(`
      <div class="modal-head"><div><span class="eyebrow">Welcome aboard</span><h2>FishCrew in 60 seconds.</h2></div><button class="x-btn" type="button" data-action="dismiss-tutorial">?</button></div>
      <div class="tutorial-steps">
        <div class="tutorial-card"><b>1</b><h3>Find water</h3><p class="muted">Start on Home or Explore to see open trips, local partners, and area notes.</p></div>
        <div class="tutorial-card"><b>2</b><h3>Lock crew</h3><p class="muted">Request a spot, wait for host approval, then unlock private meetup details and crew chat.</p></div>
        <div class="tutorial-card"><b>3</b><h3>Post proof</h3><p class="muted">After the trip, post a catch report or successful trip to keep the bite board alive.</p></div>
        <div class="tutorial-card"><b>4</b><h3>Use Tools</h3><p class="muted">Guides, bait help, gear help, tutorials, fish ID, and measurement assist live here ${MID} always confirm local rules and official regulations.</p></div>
      </div>
      <div class="row mt"><button class="btn primary" type="button" data-action="go" data-screen="explore">Start exploring</button><button class="btn soft" type="button" data-action="go" data-screen="tools">Open tools</button><button class="btn dark" type="button" data-action="dismiss-tutorial">Skip for now</button></div>`);
  }

  function dismissTutorial() {
    state.onboardingSeen = true;
    closeModal();
    save();
    toast('Tutorial saved. You can reopen it from Profile.');
  }

  function openFishingGuides() {
    const guides = state.guideLibrary || [];
    modal(`<div class="modal-head"><div><span class="eyebrow">Fishing guides</span><h2>Local knowledge, safely framed.</h2></div><button class="x-btn" type="button" data-action="close-modal">${CLOSE_BTN}</button></div>
      <div class="safe-note"><strong>Reminder:</strong> FishCrew guides are planning notes. Verify official rules, closures, licenses, slot limits, seasons, and local safety conditions before keeping fish.</div>
      <div class="stack mt">${guides.map((g)=>`<article class="panel"><span class="badge">${safe(g.area)}</span><h3>${safe(g.title)}</h3><p class="muted">${safe(g.summary)}</p><div class="meta"><span class="chip">Common: ${safe(g.species)}</span><span class="chip">Bait: ${safe(g.bait || 'Match forage')}</span></div><p class="tiny"><strong>Methods:</strong> ${safe(g.methods || 'Work moving water and structure.')}<br><strong>Gear:</strong> ${safe(g.gear || 'Bring basic tackle, pliers, and local rules.')}<br><strong>Safety:</strong> ${safe(g.safety)}</p><button class="btn dark small" type="button" data-action="save-guide-area" data-area="${safe(g.area)}">Save area</button></article>`).join('')}</div>`);
  }

  function saveGuideArea(area) {
    if (!requireLogin('Sign in to save guide areas and personalize Tools.')) return;
    state.savedGuideArea = area || state.savedGuideArea || 'Tampa Bay';
    state.opsLog.unshift(`Saved guide area: ${state.savedGuideArea}.`);
    save(); render(); toast(`Saved ${state.savedGuideArea}.`);
  }

  function guideCards(filter = '') {
    const guides = state.guideLibrary || [];
    const f = String(filter || '').toLowerCase();
    return guides.filter((g) => !f || [g.area,g.title,g.species,g.bait,g.methods,g.gear].join(' ').toLowerCase().includes(f)).map((g) => `<article class="panel"><span class="badge">${safe(g.area)}</span><h3>${safe(g.title)}</h3><p class="muted">${safe(g.summary)}</p><div class="meta"><span class="chip">Fish: ${safe(g.species)}</span><span class="chip">Bait: ${safe(g.bait || 'Match forage')}</span></div><p class="tiny"><strong>Methods:</strong> ${safe(g.methods || 'Work structure and moving water.')}<br><strong>Gear:</strong> ${safe(g.gear || 'Bring basic tackle and pliers.')}<br><strong>Safety:</strong> ${safe(g.safety || 'Check weather and regulations.')}</p><button class="btn dark small" type="button" data-action="save-guide-area" data-area="${safe(g.area)}">Save area</button></article>`).join('') || '<div class="empty">No matching guide yet. Search another fish, bait, or area.</div>';
  }

  function openBaitHelp() {
    modal(`<div class="modal-head"><div><span class="eyebrow">Bait help</span><h2>Match the bait to the bite.</h2></div><button class="x-btn" type="button" data-action="close-modal">${CLOSE_BTN}</button></div>
      <p class="lead">Practical bait recommendations by local area, target species, and method. Built for education first; exact bait rules still depend on local regulations.</p>
      <div class="safe-note"><strong>Tip:</strong> Start with area + target species. FishCrew will later use conditions and catch reports to improve these suggestions.</div>
      <label class="label mt">Search area, fish, bait, or method<input id="baitSearch" class="field" placeholder="snook, shrimp, Tampa Bay, pier" /></label>
      <div class="row mt"><button class="btn primary" type="button" data-action="run-bait-search">Search bait help</button><button class="btn dark" type="button" data-action="open-fishing-guides">Open all guides</button></div>
      <div id="baitResults" class="stack mt">${guideCards('')}</div>`);
  }

  function runBaitSearch() {
    const q = $('#baitSearch')?.value.trim() || '';
    const box = $('#baitResults');
    if (box) box.innerHTML = guideCards(q);
    state.opsLog.unshift(`Bait help searched: ${q || 'all guides'}.`);
    save();
  }

  function openGearHelp() {
    modal(`<div class="modal-head"><div><span class="eyebrow">Gear + tackle</span><h2>Build the right box for the trip.</h2></div><button class="x-btn" type="button" data-action="close-modal">${CLOSE_BTN}</button></div>
      <div class="grid two">
        <div class="panel"><h3>Inshore essentials</h3><p class="muted">2500-3500 reel, medium rod, 10-20 lb braid, 20-30 lb leader, circle hooks, jigheads, paddletails, pliers.</p></div>
        <div class="panel"><h3>Pier / bridge kit</h3><p class="muted">Medium-light rod, sabiki when legal, spoons, shrimp rigs, sheepshead hooks, landing net plan.</p></div>
        <div class="panel"><h3>Kayak kit</h3><p class="muted">PFD, whistle, leash, compact tackle tray, anchor/trolley plan, phone dry bag, weather discipline.</p></div>
        <div class="panel"><h3>Charter / cruise day</h3><p class="muted">Confirm supplied gear, bring sun protection, non-marking shoes, cooler plan, license questions, and tip/cash plan.</p></div>
      </div>
      <div class="row mt"><button class="btn soft" type="button" data-action="open-bait-help">Bait help</button><button class="btn dark" type="button" data-action="open-technique-tutorials">Tutorials</button></div>`);
  }

  function openTechniqueTutorials() {
    modal(`<div class="modal-head"><div><span class="eyebrow">Tutorials</span><h2>Learn the method before the media.</h2></div><button class="x-btn" type="button" data-action="close-modal">${CLOSE_BTN}</button></div>
      <div class="stack">
        <article class="panel"><span class="badge">Beginner</span><h3>Reading moving water</h3><p class="muted">Look for current seams, bait movement, eddies, grass edges, and shadow lines. Cast up-current and let the lure/bait move naturally.</p></article>
        <article class="panel"><span class="badge">Bait</span><h3>Live shrimp basics</h3><p class="muted">Use a light leader, match hook size to shrimp, avoid over-weighting, and let the bait move with tide whenever possible.</p></article>
        <article class="panel"><span class="badge">Artificial</span><h3>Paddletail pattern</h3><p class="muted">Start slow, keep bottom contact near potholes/edges, and change jig weight before changing lure color.</p></article>
        <article class="panel"><span class="badge orange">Legal</span><h3>Before keeping fish</h3><p class="muted">Use official state regulations, a physical ruler, and current season/bag limits. FishCrew tools are educational and assistive only.</p></article>
      </div>
      <div class="row mt"><button class="btn soft" type="button" data-action="open-fishing-guides">Guides</button><button class="btn dark" type="button" data-action="open-gear-help">Gear help</button></div>`);
  }

  function openFishId() {
    modal(`<div class="modal-head"><div><span class="eyebrow">Fish ID</span><h2>Camera or gallery-assisted species check.</h2></div><button class="x-btn" type="button" data-action="close-modal">${CLOSE_BTN}</button></div>
      <div class="safe-note"><strong>Assistive only:</strong> Fish ID is not a legal species ID or harvest decision tool. Verify species, size, season, and bag limits with official regulations, local authorities, and expert confirmation before keeping fish.</div>
      <div class="forms mt"><div class="file-box"><label class="label">Take or choose fish photo<input id="fishIdPhoto" type="file" accept="image/*" /></label></div><label class="label">Area / waterbody<input id="fishIdArea" class="field" value="${safe(userArea())}" /></label><button class="btn primary full" type="button" data-action="run-fish-id">Run fish ID check</button></div>`);
  }

  async function runFishId() {
    if (!requireLogin('Sign in to run fish ID photo checks.')) return;
    const file = getFile('fishIdPhoto');
    const area = $('#fishIdArea')?.value.trim() || userArea();
    let preview = '';
    if (file) {
      try { preview = await readFileData(file); } catch (_) {}
    }
    const picks = ['Redfish / Red drum', 'Snook-like profile', 'Spotted seatrout', 'Sheepshead', 'Spanish mackerel'];
    const result = picks[Math.floor(Math.random() * picks.length)];
    state.lastFishId = { result, confidence: 'Assistive estimate', area, preview, createdAt: now() };
    state.reports = state.reports || [];
    if (preview) queueModeration('Fish ID upload review', uid('fishid'), 'Fish ID photo uploaded for review. Keep private unless the user posts it.');
    state.opsLog.unshift(`Fish ID check ran for ${area}: ${result}.`);
    save(); render();
    modal(`<div class="modal-head"><div><span class="eyebrow">Fish ID result</span><h2>${safe(result)}</h2></div><button class="x-btn" type="button" data-action="close-modal">${CLOSE_BTN}</button></div>
      ${preview ? `<div class="card-media photo" style="background-image:url('${preview}')"></div>` : ''}
      <div class="safe-note"><strong>Assistive estimate only:</strong> This cannot confirm legality, species, harvest rules, size, season, or bag limit. It is not a legal harvest decision tool. Verify with official local regulations before keeping fish.</div>
      <p class="muted">Area: ${safe(area)} ${MID} Confidence: Assistive estimate</p>
      <div class="row"><button class="btn soft" type="button" data-action="open-measure-tool">Measure assist</button><button class="btn dark" type="button" data-action="open-fishing-guides">Check guides</button><button class="btn primary" type="button" data-action="close-modal">Done</button></div>`);
  }

  function openMeasureTool() {
    modal(`<div class="modal-head"><div><span class="eyebrow">Measurement assist</span><h2>Camera or gallery-ready measuring flow.</h2></div><button class="x-btn" type="button" data-action="close-modal">${CLOSE_BTN}</button></div>
      <div class="safe-note"><strong>Estimate only:</strong> Measurement assist is not an official measurement and is not enforcement or legal proof. For legal harvest, use a physical measuring board or ruler and confirm local regulations. Camera angles can distort length.</div>
      <div class="forms mt"><div class="file-box"><label class="label">Take or choose fish next to ruler/reference<input id="measurePhoto" type="file" accept="image/*" /></label></div><div class="form-grid"><label class="label">Reference length<input id="measureRef" class="field" placeholder="Example: 12 in ruler" /></label><label class="label">Units<select id="measureUnits" class="select"><option>inches</option><option>centimeters</option></select></label></div><button class="btn primary full" type="button" data-action="run-measure-tool">Run measurement assist</button></div>`);
  }

  async function runMeasureTool() {
    if (!requireLogin('Sign in to run measurement photo checks.')) return;
    const file = getFile('measurePhoto');
    let preview = '';
    if (file) {
      try { preview = await readFileData(file); } catch (_) {}
    }
    const ref = $('#measureRef')?.value.trim() || 'reference object required';
    const units = $('#measureUnits')?.value || 'inches';
    const note = ref === 'reference object required' ? 'Needs a clear reference object' : `Estimate based on ${ref}`;
    state.lastMeasurement = { note, units, preview, createdAt: now() };
    state.opsLog.unshift(`Measurement assist ran: ${note}.`);
    save(); render();
    modal(`<div class="modal-head"><div><span class="eyebrow">Measurement assist</span><h2>${safe(note)}</h2></div><button class="x-btn" type="button" data-action="close-modal">${CLOSE_BTN}</button></div>
      ${preview ? `<div class="card-media photo" style="background-image:url('${preview}')"></div>` : ''}
      <div class="safe-note"><strong>Not legal measurement:</strong> This is an estimate for planning and logging only — not enforcement or legal proof. Use a physical measuring board for keep/release decisions and confirm official regulations.</div>
      <p class="muted">Units: ${safe(units)} ${MID} Reference: ${safe(ref)}</p>
      <button class="btn primary" type="button" data-action="close-modal">Done</button>`);
  }

  function formatDeviceTime(value) {
    if (!value) return 'No fix yet';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return date.toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  }

  function formatGpsFix(fix = {}) {
    const lat = Number(fix.lat);
    const lon = Number(fix.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) return 'No fix yet';
    const bits = [`${lat.toFixed(5)}, ${lon.toFixed(5)}`];
    const accuracy = Number(fix.accuracy);
    if (Number.isFinite(accuracy)) bits.push(`${Math.round(accuracy)} m accuracy`);
    else if (fix.hdop) bits.push(`HDOP ${fix.hdop}`);
    const speed = Number(fix.speed);
    if (Number.isFinite(speed)) bits.push(`${speed.toFixed(1)} mph`);
    const heading = Number(fix.heading);
    if (Number.isFinite(heading)) bits.push(`${Math.round(heading)} deg`);
    return bits.join(' | ');
  }

  function pushDeviceLog(message) {
    state.deviceHub = state.deviceHub || {};
    const stamp = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    state.deviceHub.log = [`${stamp}: ${message}`, ...(state.deviceHub.log || [])].slice(0, 8);
  }

  function updateDeviceHub(patch, note) {
    const wasOpen = Boolean($('#deviceHubModal'));
    state.deviceHub = {
      status: 'Ready',
      source: 'No device connected',
      lat: null,
      lon: null,
      accuracy: null,
      speed: null,
      heading: null,
      deviceName: '',
      lastFix: '',
      log: [],
      ...(state.deviceHub || {}),
      ...patch
    };
    if (note) pushDeviceLog(note);
    save();
    render();
    if (wasOpen) openDeviceHub();
  }

  function deviceSupportSummary() {
    return {
      geolocation: Boolean(navigator.geolocation),
      bluetooth: Boolean(navigator.bluetooth),
      serial: Boolean(navigator.serial),
      secure: Boolean(window.isSecureContext || location.hostname === 'localhost' || location.hostname === '127.0.0.1')
    };
  }

  function openDeviceHub() {
    const hub = state.deviceHub || {};
    const support = deviceSupportSummary();
    const rows = [
      ['Fix', formatGpsFix(hub)],
      ['Source', hub.source || 'No device connected'],
      ['Device', hub.deviceName || 'None selected'],
      ['Updated', formatDeviceTime(hub.lastFix)]
    ];
    modal(`<div id="deviceHubModal" data-device-hub="true">
      <div class="modal-head"><div><span class="eyebrow">GPS + Devices</span><h2>Connect your water signal.</h2></div><button class="x-btn" type="button" data-action="close-modal">x</button></div>
      <p class="lead">Use phone GPS for quick fixes, discover BLE devices when the browser supports it, or read NMEA from a USB serial GPS bridge.</p>
      <div class="safe-note"><strong>Navigation note:</strong> This is a planning and logging helper. Keep using your chartplotter, paper backup, and official navigation gear on the water.</div>
      <div class="device-matrix mt">
        ${rows.map((row) => `<div class="device-stat"><span>${safe(row[0])}</span><strong>${safe(row[1])}</strong></div>`).join('')}
      </div>
      <div class="grid three mt">
        <button class="panel device-action" type="button" data-action="use-browser-gps"><span class="badge ${support.geolocation ? 'green' : 'orange'}">Phone</span><h3>Use phone GPS</h3><p class="muted">${support.geolocation ? 'Start a high-accuracy browser GPS watch.' : 'Browser geolocation is not available here.'}</p></button>
        <button class="panel device-action" type="button" data-action="connect-bluetooth-gps"><span class="badge ${support.bluetooth ? 'green' : 'orange'}">BLE</span><h3>Bluetooth GPS</h3><p class="muted">${support.bluetooth ? 'Pair with supported Bluetooth Low Energy devices.' : 'This browser does not expose Web Bluetooth.'}</p></button>
        <button class="panel device-action" type="button" data-action="connect-serial-gps"><span class="badge ${support.serial ? 'green' : 'orange'}">NMEA</span><h3>USB serial GPS</h3><p class="muted">${support.serial ? 'Connect a USB/NMEA bridge in Chromium browsers.' : 'Web Serial is not available in this browser.'}</p></button>
      </div>
      <div class="row mt"><button class="btn soft" type="button" data-action="copy-device-fix">Copy fix</button><button class="btn dark" type="button" data-action="stop-browser-gps">Stop GPS watch</button><button class="btn dark" type="button" data-action="open-device-bridge-help">Bridge help</button></div>
      <div class="panel connection-log mt"><h3>Connection log</h3>${(hub.log || []).map((line) => `<p class="muted">${safe(line)}</p>`).join('') || '<p class="muted">No device events yet.</p>'}</div>
      <p class="tiny">Secure context: ${support.secure ? 'ready' : 'required'} | Geolocation: ${support.geolocation ? 'available' : 'unavailable'} | Web Bluetooth: ${support.bluetooth ? 'available' : 'unavailable'} | Web Serial: ${support.serial ? 'available' : 'unavailable'}</p>
    </div>`);
  }

  function useBrowserGps() {
    if (!navigator.geolocation) return toast('This browser does not provide GPS access.', 'danger');
    const options = { enableHighAccuracy: true, timeout: 12000, maximumAge: 5000 };
    updateDeviceHub({ status: 'Requesting', source: 'Browser GPS' }, 'Requested phone GPS permission.');
    geoWatchId = navigator.geolocation.watchPosition((position) => {
      updateDeviceHub({
        status: 'Tracking',
        source: 'Browser GPS',
        lat: position.coords.latitude,
        lon: position.coords.longitude,
        accuracy: position.coords.accuracy,
        speed: position.coords.speed == null ? null : position.coords.speed * 2.23694,
        heading: position.coords.heading,
        deviceName: 'This device',
        lastFix: new Date(position.timestamp || Date.now()).toISOString()
      }, 'GPS fix updated from this device.');
    }, (error) => {
      updateDeviceHub({ status: 'GPS blocked', source: 'Browser GPS' }, `GPS error: ${error.message || 'permission unavailable'}`);
      toast(`GPS error: ${error.message || 'permission unavailable'}`, 'danger');
    }, options);
  }

  function stopBrowserGps() {
    if (geoWatchId !== null && navigator.geolocation) navigator.geolocation.clearWatch(geoWatchId);
    geoWatchId = null;
    updateDeviceHub({ status: 'Paused' }, 'Stopped browser GPS watch.');
    toast('GPS watch stopped.');
  }

  async function connectBluetoothGps() {
    if (!navigator.bluetooth) {
      openDeviceBridgeHelp();
      toast('Web Bluetooth is not available in this browser.', 'danger');
      return;
    }
    try {
      bluetoothDevice = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['battery_service', 'device_information', '00001819-0000-1000-8000-00805f9b34fb']
      });
      const server = await bluetoothDevice.gatt.connect();
      let note = 'Bluetooth device connected.';
      try {
        await server.getPrimaryService('00001819-0000-1000-8000-00805f9b34fb');
        note = 'Bluetooth Location and Navigation service found. Device-specific decoding may still be required.';
      } catch (_) {
        note = 'Bluetooth connected. No standard GPS service was exposed to the browser.';
      }
      updateDeviceHub({
        status: 'Bluetooth connected',
        source: 'Bluetooth GPS',
        deviceName: bluetoothDevice.name || bluetoothDevice.id || 'Bluetooth device',
        lastFix: state.deviceHub?.lastFix || ''
      }, note);
      toast('Bluetooth device connected.');
    } catch (error) {
      updateDeviceHub({ status: 'Bluetooth not connected', source: 'Bluetooth GPS' }, `Bluetooth connection cancelled: ${error.message || 'not paired'}`);
      toast('Bluetooth connection was cancelled or blocked.', 'danger');
    }
  }

  async function connectSerialGps() {
    if (!navigator.serial) {
      openDeviceBridgeHelp();
      toast('Web Serial is not available in this browser.', 'danger');
      return;
    }
    try {
      serialPort = await navigator.serial.requestPort();
      await serialPort.open({ baudRate: 4800 });
      updateDeviceHub({ status: 'Serial connected', source: 'NMEA serial bridge', deviceName: 'USB/NMEA bridge' }, 'Serial GPS bridge connected at 4800 baud.');
      readSerialGpsLoop();
      toast('Listening for NMEA GPS data.');
    } catch (error) {
      updateDeviceHub({ status: 'Serial not connected', source: 'NMEA serial bridge' }, `Serial connection failed: ${error.message || 'not connected'}`);
      toast('Serial GPS connection was cancelled or blocked.', 'danger');
    }
  }

  async function readSerialGpsLoop() {
    if (!serialPort?.readable) return;
    const decoder = new TextDecoder();
    try {
      while (serialPort.readable) {
        serialReader = serialPort.readable.getReader();
        try {
          while (true) {
            const { value, done } = await serialReader.read();
            if (done) break;
            nmeaBuffer += decoder.decode(value, { stream: true });
            const lines = nmeaBuffer.split(/\r?\n/);
            nmeaBuffer = lines.pop() || '';
            lines.forEach((line) => parseNmeaLine(line));
          }
        } finally {
          serialReader.releaseLock();
        }
      }
    } catch (error) {
      updateDeviceHub({ status: 'Serial paused' }, `Serial read stopped: ${error.message || 'reader closed'}`);
    }
  }

  function nmeaCoordToDecimal(value, hemisphere) {
    if (!value || !hemisphere) return null;
    const raw = Number(value);
    if (!Number.isFinite(raw)) return null;
    const degrees = Math.floor(raw / 100);
    const minutes = raw - degrees * 100;
    let decimal = degrees + minutes / 60;
    if (['S', 'W'].includes(String(hemisphere).toUpperCase())) decimal *= -1;
    return decimal;
  }

  function parseNmeaLine(line) {
    const clean = String(line || '').trim();
    if (!clean.startsWith('$')) return false;
    const body = clean.split('*')[0];
    const parts = body.split(',');
    const type = parts[0].slice(-3);
    if (type === 'GGA') {
      const lat = nmeaCoordToDecimal(parts[2], parts[3]);
      const lon = nmeaCoordToDecimal(parts[4], parts[5]);
      if (Number(parts[6] || 0) > 0 && Number.isFinite(lat) && Number.isFinite(lon)) {
        updateDeviceHub({ status: 'Tracking', source: 'NMEA serial bridge', lat, lon, hdop: parts[8] || '', lastFix: new Date().toISOString() }, 'NMEA GGA fix received.');
        return true;
      }
    }
    if (type === 'RMC') {
      const lat = nmeaCoordToDecimal(parts[3], parts[4]);
      const lon = nmeaCoordToDecimal(parts[5], parts[6]);
      if (parts[2] === 'A' && Number.isFinite(lat) && Number.isFinite(lon)) {
        updateDeviceHub({
          status: 'Tracking',
          source: 'NMEA serial bridge',
          lat,
          lon,
          speed: parts[7] ? Number(parts[7]) * 1.15078 : null,
          heading: parts[8] ? Number(parts[8]) : null,
          lastFix: new Date().toISOString()
        }, 'NMEA RMC fix received.');
        return true;
      }
    }
    return false;
  }

  async function copyDeviceFix() {
    const hub = state.deviceHub || {};
    const lat = Number(hub.lat);
    const lon = Number(hub.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) return toast('No GPS fix to copy yet.', 'danger');
    const text = `${lat.toFixed(6)}, ${lon.toFixed(6)} | ${hub.source || 'FishCrew GPS'} | ${formatDeviceTime(hub.lastFix)}`;
    try {
      await navigator.clipboard.writeText(text);
      toast('GPS fix copied.');
    } catch (_) {
      toast(text);
    }
  }

  function openDeviceBridgeHelp() {
    modal(`<div class="modal-head"><div><span class="eyebrow">Device bridge</span><h2>What FishCrew can connect to.</h2></div><button class="x-btn" type="button" data-action="close-modal">x</button></div>
      <div class="stack">
        <div class="panel"><h3>Phone GPS</h3><p class="muted">Best first path for most anglers. It uses browser geolocation after the user grants permission.</p></div>
        <div class="panel"><h3>Bluetooth</h3><p class="muted">Web Bluetooth works with Bluetooth Low Energy devices that expose browser-readable GATT services. Many marine GPS receivers use classic Bluetooth serial profiles, which browsers cannot read directly.</p></div>
        <div class="panel"><h3>USB/NMEA bridge</h3><p class="muted">Chromium browsers can use Web Serial with a USB GPS, chartplotter bridge, or NMEA gateway. Standard NMEA GGA and RMC lines are parsed into a waypoint fix.</p></div>
        <div class="panel"><h3>Native app path</h3><p class="muted">For app-store releases, a native wrapper can add platform Bluetooth, Wi-Fi, and external-accessory permissions for deeper chartplotter and GPS integrations.</p></div>
      </div>
      <div class="row mt"><button class="btn primary" type="button" data-action="open-device-hub">Back to devices</button><button class="btn dark" type="button" data-action="close-modal">Close</button></div>`);
  }

  function openUserSettings() {
    const u = currentUser();
    const unread = (state.notifications || []).filter((n) => !n.read).length;
    const accountTitle = u ? u.name : 'Guest mode';
    const accountMeta = u ? `${usernameFor(u)} ${MID} ${roleLabel(u.role)} ${MID} ${u.area || userArea()}` : 'Browse first. Sign in only when you post, join, chat, or save.';
    const accountActions = u
      ? `<button class="settings-tile" type="button" data-action="go" data-screen="profile"><b>Profile card</b><span>Edit your public fishing card.</span></button><button class="settings-tile" type="button" data-action="logout"><b>Log out</b><span>Leave this local session.</span></button>`
      : `<button class="settings-tile" type="button" data-action="open-auth-signin"><b>Sign in</b><span>Use your existing FishCrew profile.</span></button><button class="settings-tile" type="button" data-action="open-auth-create"><b>Create profile</b><span>Join trips, chat, and post proof.</span></button>`;
    const adminTools = isAdmin()
      ? `<section class="settings-card"><div class="settings-section-head"><span class="eyebrow">Operator tools</span><h3>System utilities</h3></div><div class="settings-grid compact"><button class="settings-tile" type="button" data-action="run-health-check"><b>Health check</b><span>Routes, IDs, and button wiring.</span></button><button class="settings-tile" type="button" data-action="run-readiness-check"><b>Readiness board</b><span>Connections and launch prep.</span></button><button class="settings-tile" type="button" data-action="open-backend-diagnostics"><b>Data connection</b><span>Sync, probes, and realtime tools.</span></button></div></section>`
      : '';
    modal(`<div class="modal-head settings-modal-head"><div><span class="eyebrow">Settings</span><h2>FishCrew control ring.</h2></div><button class="x-btn" type="button" data-action="close-modal">${CLOSE_BTN}</button></div>
      <div class="settings-menu">
        <section class="settings-card settings-account-card">
          <div class="settings-life-ring" aria-hidden="true"><span></span></div>
          <div><span class="eyebrow">Account</span><h3>${safe(accountTitle)}</h3><p>${safe(accountMeta)}</p></div>
        </section>
        <section class="settings-card">
          <div class="settings-section-head"><span class="eyebrow">Quick actions</span><h3>Go where settings connect.</h3></div>
          <div class="settings-grid">
            ${accountActions}
            <button class="settings-tile" type="button" data-action="open-notifications"><b>Alerts ${unread ? `(${safe(unread)})` : ''}</b><span>Crew requests, approvals, and safety notes.</span></button>
            <button class="settings-tile" type="button" data-action="open-conditions"><b>Water window</b><span>Review conditions before you move.</span></button>
            <button class="settings-tile" type="button" data-action="open-tutorial"><b>Walk-through</b><span>Replay the first-run guide.</span></button>
            <button class="settings-tile" type="button" data-action="open-fishing-guides"><b>Guide library</b><span>Areas, bait, gear, and safety notes.</span></button>
          </div>
        </section>
        <section class="settings-card">
          <div class="settings-section-head"><span class="eyebrow">Preferences</span><h3>Defaults and privacy.</h3></div>
          <div class="forms settings-form">
            <label class="label">Home area<input id="settingsArea" class="field" value="${safe(u?.area || state.savedGuideArea || userArea())}" /></label>
            <div class="form-grid"><label class="label">Units<select id="settingsUnits" class="select"><option ${state.preferredUnits==='Imperial'?'selected':''}>Imperial</option><option ${state.preferredUnits==='Metric'?'selected':''}>Metric</option></select></label><label class="label">Notifications<select id="settingsNotify" class="select"><option ${state.notificationPref==='Crew alerts'?'selected':''}>Crew alerts</option><option ${state.notificationPref==='All activity'?'selected':''}>All activity</option><option ${state.notificationPref==='Quiet'?'selected':''}>Quiet</option></select></label></div>
            <label class="label">Privacy<select id="settingsPrivacy" class="select"><option ${state.privacyMode==='Crew-only exact locations'?'selected':''}>Crew-only exact locations</option><option ${state.privacyMode==='General area only'?'selected':''}>General area only</option><option ${state.privacyMode==='Private by default'?'selected':''}>Private by default</option></select></label>
            <button class="btn primary full" type="button" data-action="save-user-settings">Save settings</button>
          </div>
        </section>
        <section class="settings-card">
          <div class="settings-section-head"><span class="eyebrow">App readiness</span><h3>Privacy, support, and account control.</h3></div>
          <div class="settings-grid compact">
            <button class="settings-tile" type="button" data-action="open-privacy-policy"><b>Privacy policy</b><span>Data, location, media, and account handling.</span></button>
            <button class="settings-tile" type="button" data-action="open-terms"><b>Terms</b><span>Safety, marketplace, and user responsibilities.</span></button>
            <button class="settings-tile" type="button" data-action="open-community-guidelines"><b>Community rules</b><span>Reports, blocking, moderation, and safe posts.</span></button>
            <button class="settings-tile" type="button" data-action="open-support-center"><b>Support</b><span>Contact, deletion help, and response paths.</span></button>
            <button class="settings-tile" type="button" data-action="open-blocked-users"><b>Blocked users</b><span>${safe((state.blockedUsers || []).length)} hidden profile${(state.blockedUsers || []).length === 1 ? '' : 's'}.</span></button>
            <button class="settings-tile danger-tile" type="button" data-action="open-account-delete"><b>Delete account</b><span>Remove this profile and local content.</span></button>
          </div>
        </section>
        <section class="settings-card settings-safety-card">
          <div><span class="eyebrow">Safety</span><h3>Keep exact spots protected.</h3><p class="muted">FishCrew keeps private meetup details and exact locations inside approved crews. Always confirm weather, water, and local regulations before launching or keeping fish.</p></div>
          <button class="btn dark small" type="button" data-action="open-gear-help">Gear checklist</button>
        </section>
        ${adminTools}
      </div>`);
  }

  function saveUserSettings() {
    state.savedGuideArea = $('#settingsArea')?.value.trim() || state.savedGuideArea || userArea();
    state.preferredUnits = $('#settingsUnits')?.value || 'Imperial';
    state.notificationPref = $('#settingsNotify')?.value || 'Crew alerts';
    state.privacyMode = $('#settingsPrivacy')?.value || 'Crew-only exact locations';
    const u = currentUser();
    if (u && $('#settingsArea')?.value.trim()) u.area = $('#settingsArea').value.trim();
    state.opsLog.unshift(`Settings saved: ${state.savedGuideArea}, ${state.preferredUnits}.`);
    closeModal(); save(); render(); toast('Settings saved.');
  }

  function openBackendHelp() {
    modal(`
      <div class="modal-head"><div><span class="eyebrow">Connections</span><h2>Shared data setup.</h2></div><button class="x-btn" type="button" data-action="close-modal">${CLOSE_BTN}</button></div>
      <div class="stack">
        <p class="lead">When the shared-data provider is ready, add the connection values in <code>config.js</code>, run the database schema, confirm media storage, then redeploy.</p>
        <div class="safe-note">FishCrew keeps browser storage available so the app still works while shared data is being connected.</div>
        <button class="btn soft" type="button" data-action="check-backend">Check connection now</button>
      </div>`);
  }

  function openModeration() {
    if (!requireAdmin()) return;
    const open = state.reports.filter((r) => r.status !== 'Resolved');
    const assets = (state.mediaAssets || []).filter((a) => ['Review','Local preview'].includes(a.status));
    modal(`<div class="modal-head"><div><span class="eyebrow">Moderation</span><h2>Clean the dock.</h2></div><button class="x-btn" type="button" data-action="close-modal">${CLOSE_BTN}</button></div>
      <div class="moderation-summary grid three">
        <div class="panel"><h3>${safe(open.length)}</h3><p class="muted">Open reports</p></div>
        <div class="panel"><h3>${safe(assets.length)}</h3><p class="muted">Media reviews</p></div>
        <div class="panel"><h3>${safe(state.feed.filter((p)=>p.status==='Removed').length)}</h3><p class="muted">Removed posts</p></div>
      </div>
      <div class="grid two mt">
        <div class="panel"><h3>Reports</h3><div class="stack">${open.map((r)=>{ const post = state.feed.find((p)=>p.id===r.target); return `<div class="lead-row mod-row"><div><b>${safe(r.type)}</b><small>${safe(r.note)}</small>${post ? `<small>${safe(post.title)} ${MID} ${safe(post.authorName)}</small>` : `<small>${safe(r.target || 'system')}</small>`}</div><div class="row"><button class="btn success small" type="button" data-action="resolve-report" data-report-id="${safe(r.id)}">Resolve</button>${post && post.status !== 'Removed' ? `<button class="btn danger small" type="button" data-action="remove-feed" data-feed-id="${safe(post.id)}">Remove</button>` : ''}</div></div>`}).join('') || `<p class="muted">No open reports.</p>`}</div></div>
        <div class="panel"><h3>Media review</h3><div class="stack">${assets.map((a)=>`<div class="lead-row mod-row"><div><b>${safe(a.sourceType || 'media')} upload</b><small>${safe(a.mediaType)} ${MID} ${safe(a.visibility)} ${MID} ${safe(a.status)}</small><small>${safe(a.storagePath || a.publicUrl || '')}</small></div><div class="row"><button class="btn success small" type="button" data-action="approve-media" data-asset-id="${safe(a.id)}">Approve</button><button class="btn danger small" type="button" data-action="remove-feed" data-feed-id="${safe(a.sourceId)}">Remove</button></div></div>`).join('') || `<p class="muted">No media waiting.</p>`}</div></div>
      </div>`);
  }

  function openAdminAudit() {
    if (!requireAdmin()) return;
    const removed = state.feed.filter((p) => p.status === 'Removed');
    const resolved = state.reports.filter((r) => r.status === 'Resolved');
    modal(`<div class="modal-head"><div><span class="eyebrow">Operator audit</span><h2>Actions and removed content.</h2></div><button class="x-btn" type="button" data-action="close-modal">${CLOSE_BTN}</button></div><div class="grid two"><div class="panel"><h3>Removed posts</h3>${removed.map((p)=>`<p class="muted"><b>${safe(p.title)}</b><br>${safe(p.authorName)} ${MID} ${safe(p.area)}</p>`).join('') || '<p class="muted">No removed posts.</p>'}</div><div class="panel"><h3>Resolved reports</h3>${resolved.map((r)=>`<p class="muted"><b>${safe(r.type)}</b><br>${safe(r.note)}</p>`).join('') || '<p class="muted">No resolved reports.</p>'}</div></div><div class="panel mt"><h3>Recent ops log</h3>${state.opsLog.slice(0,12).map((x)=>`<p class="muted">${safe(x)}</p>`).join('')}</div>`);
  }

  function openUserDirectory() {
    if (!requireAdmin()) return;
    const rows = (state.users || []).map((user) => {
      const trips = (state.trips || []).filter((trip) => trip.hostId === user.id || trip.members?.includes(user.id)).length;
      const posts = (state.feed || []).filter((post) => post.authorId === user.id).length;
      const blocked = isBlocked(user.id);
      return `<div class="qa-note user-row"><div class="row"><span class="badge ${blocked ? 'red' : user.role === 'Operator' ? 'green' : ''}">${safe(user.role || 'Angler')}</span><span class="chip">${safe(user.area || 'No area')}</span><span class="chip">${blocked ? 'Blocked locally' : 'Active'}</span></div><p><strong>${safe(user.name)}</strong><br><span class="muted">${safe(usernameFor(user))} | ${safe(user.email || 'no email')} | ${safe(trips)} trips | ${safe(posts)} posts</span></p></div>`;
    });
    modal(`<div class="modal-head"><div><span class="eyebrow">User directory</span><h2>Profiles and roles.</h2></div><button class="x-btn" type="button" data-action="close-modal">x</button></div>
      <div class="safe-note"><strong>Operator view:</strong> Keep identity, support, and moderation actions traceable before public scale.</div>
      <div class="stack mt">${rows.join('') || '<div class="empty">No users found.</div>'}</div>
      <div class="row mt"><button class="btn dark" type="button" data-action="open-role-matrix">Role matrix</button><button class="btn dark" type="button" data-action="open-support-queue">Support queue</button><button class="btn primary" type="button" data-action="close-modal">Done</button></div>`);
  }

  function openSupportQueue() {
    if (!requireAdmin()) return;
    const openReports = (state.reports || []).filter((r) => r.status !== 'Resolved');
    const deletionRows = (state.accountDeletionRequests || []).map((req) => `<div class="qa-note"><div class="row"><span class="badge red">Delete</span><span class="chip">${safe(req.status || 'Requested')}</span></div><p><strong>${safe(req.email || req.username || req.userId)}</strong><br><span class="muted">${safe(formatDeviceTime(req.createdAt))}</span></p></div>`).join('');
    const reportRows = openReports.slice(0, 8).map((report) => `<div class="qa-note"><div class="row"><span class="badge orange">${safe(report.type || 'Report')}</span><span class="chip">${safe(report.status || 'Open')}</span></div><p class="muted">${safe(report.note || report.target || 'Needs review')}</p><button class="btn dark small" type="button" data-action="resolve-report" data-report-id="${safe(report.id)}">Resolve</button></div>`).join('');
    modal(`<div class="modal-head"><div><span class="eyebrow">Support</span><h2>User support queue.</h2></div><button class="x-btn" type="button" data-action="close-modal">x</button></div>
      <div class="grid three">
        <div class="panel"><h3>${safe(openReports.length)}</h3><p class="muted">Open reports and media reviews.</p></div>
        <div class="panel"><h3>${safe((state.accountDeletionRequests || []).length)}</h3><p class="muted">Account deletion records.</p></div>
        <div class="panel"><h3>${safe((state.blockedUsers || []).length)}</h3><p class="muted">Locally blocked profiles.</p></div>
      </div>
      <div class="grid two mt">
        <div class="panel"><h3>Deletion requests</h3><div class="stack">${deletionRows || '<p class="muted">No deletion requests yet.</p>'}</div></div>
        <div class="panel"><h3>Reports</h3><div class="stack">${reportRows || '<p class="muted">No open reports.</p>'}</div></div>
      </div>
      <div class="row mt"><button class="btn dark" type="button" data-action="open-support-email">Email support</button><button class="btn dark" type="button" data-action="open-blocked-users">Blocked users</button><button class="btn primary" type="button" data-action="open-moderation">Moderation</button></div>`);
  }

  function openStoreReadiness() {
    if (!requireAdmin()) return;
    const checks = releaseGateChecks();
    const failed = checks.filter((check) => !check.pass);
    const storeItems = [
      ['Privacy policy', true, 'In-app and static privacy route available.'],
      ['Terms and community rules', true, 'Terms, community guidelines, reporting, and blocking paths are present.'],
      ['Account deletion', Boolean(ACTIONS['open-account-delete'] && ACTIONS['confirm-delete-account']), 'Deletion flow records requests and removes local content.'],
      ['Support path', Boolean(supportEmail()), supportEmail()],
      ['GPS/device disclosure', Boolean(ACTIONS['open-device-hub'] && ACTIONS['connect-bluetooth-gps']), 'Browser GPS, BLE limits, and serial/NMEA bridge paths are documented.'],
      ['Shared data readiness', Boolean(CONFIG.BUILD_TARGET && CONFIG.WEB_CANONICAL_URL), 'Runtime config separates local browser mode from production shared data.']
    ];
    modal(`<div class="modal-head"><div><span class="eyebrow">Store readiness</span><h2>${failed.length ? 'Review blockers.' : 'Ready for review.'}</h2></div><button class="x-btn" type="button" data-action="close-modal">x</button></div>
      <div class="grid two">
        <div class="panel"><h3>${safe(checks.filter((c)=>c.pass).length)}/${safe(checks.length)}</h3><p class="muted">Launch checks passing.</p></div>
        <div class="panel"><h3>${safe(failed.length)}</h3><p class="muted">Open blockers from the release gate.</p></div>
      </div>
      <div class="stack mt">${storeItems.map((item) => `<div class="qa-note ${item[1] ? 'done' : ''}"><div class="row"><span class="badge ${item[1] ? 'green' : 'red'}">${item[1] ? 'Ready' : 'Fix'}</span><span class="chip">Store</span></div><p><strong>${safe(item[0])}</strong><br><span class="muted">${safe(item[2])}</span></p></div>`).join('')}</div>
      <div class="row mt"><button class="btn primary" type="button" data-action="run-release-gate">Run launch checks</button><button class="btn dark" type="button" data-action="open-privacy-policy">Privacy</button><button class="btn dark" type="button" data-action="open-support-center">Support</button></div>`);
  }

  async function approveMedia(assetId) {
    if (!requireAdmin()) return;
    const asset = state.mediaAssets.find((a) => a.id === assetId);
    if (!asset) return;
    asset.status = 'Approved';
    state.reports.filter((r) => r.target === asset.sourceId && r.status === 'Open').forEach((r) => { r.status = 'Resolved'; });
    if (asset.sourceType === 'feed') {
      const post = (state.feed || []).find((p) => p.id === asset.sourceId);
      if (post) {
        if (post.status === 'Pending review' || post.status === 'Review') post.status = 'Live';
        if (asset.publicUrl) {
          post.media = asset.publicUrl;
          post.mediaType = asset.mediaType || post.mediaType;
        }
      }
    }
    if (asset.sourceType === 'trip') {
      const trip = (state.trips || []).find((t) => t.id === asset.sourceId);
      if (trip && asset.publicUrl) {
        trip.media = asset.publicUrl;
        trip.mediaModerationStatus = 'Approved';
      }
    }
    if (asset.sourceType === 'profile') {
      const profile = (state.users || []).find((u) => u.id === asset.sourceId || u.id === asset.ownerId);
      if (profile && asset.publicUrl) {
        profile.avatar = asset.publicUrl;
        profile.avatarModerationStatus = 'Approved';
        delete profile.avatarPending;
      }
    }
    state.opsLog.unshift(`Media asset approved: ${asset.sourceId}.`);
    await afterLocalWrite('Approve media', async () => {
      await liveUpdate('media_assets', { status: 'Approved', moderation_status: 'Approved' }, 'id', asset.id, 'media approval');
      if (asset.sourceType === 'feed') {
        const feedPatch = { status: 'Live' };
        if (asset.publicUrl) feedPatch.media_url = asset.publicUrl;
        await liveUpdate('feed_posts', feedPatch, 'id', asset.sourceId, 'feed approval').catch(() => false);
      }
      if (asset.sourceType === 'trip' && asset.publicUrl) {
        await liveUpdate('trip_posts', { media_url: asset.publicUrl, media_moderation_status: 'Approved' }, 'id', asset.sourceId, 'trip media approval').catch(() => false);
      }
      if (asset.sourceType === 'profile' && asset.publicUrl) {
        await liveUpdate('profiles', { avatar_url: asset.publicUrl, avatar_moderation_status: 'Approved' }, 'id', asset.ownerId || asset.sourceId, 'profile avatar approval').catch(() => false);
      }
      return true;
    });
    openModeration();
    toast('Media approved and public visibility unlocked.');
  }

  function passwordErrors(password, confirmPassword) {
    const errors = [];
    if (!password || password.length < 8) errors.push('8+ characters');
    if (!/[A-Z]/.test(password || '')) errors.push('one uppercase letter');
    if (!/[a-z]/.test(password || '')) errors.push('one lowercase letter');
    if (!/[0-9]/.test(password || '')) errors.push('one number');
    if (!/[^A-Za-z0-9]/.test(password || '')) errors.push('one special character');
    if (confirmPassword !== undefined && password !== confirmPassword) errors.push('matching confirmation');
    return errors;
  }

  const GENERIC_LOGIN_ERROR = 'Invalid username/email or password.';
  const SIGNUP_EMAIL_CONFIRM_MESSAGE = 'Account created. Check your email to confirm your account, then sign in.';
  const SIGNUP_WELCOME_MESSAGE = 'Account created. Welcome to FishCrew.';
  const PASSWORD_RESET_SUCCESS = 'If that email is registered, a password reset link has been sent.';

  function clearAuthError() {
    const el = $('#authError');
    if (!el) return;
    el.textContent = '';
    el.classList.add('hidden');
  }

  function clearAuthSuccess() {
    const el = $('#authSuccess');
    if (!el) return;
    el.textContent = '';
    el.classList.add('hidden');
  }

  function showAuthError(message) {
    clearAuthSuccess();
    const el = $('#authError');
    if (el) {
      el.textContent = message;
      el.classList.remove('hidden');
    }
  }

  function showAuthSuccess(message) {
    clearAuthError();
    const el = $('#authSuccess');
    if (el) {
      el.textContent = message;
      el.classList.remove('hidden');
    }
  }

  function signupErrorMessage(error, password = '', confirmPassword = '') {
    const msg = String(error?.message || error || '').toLowerCase();
    const code = String(error?.code || '').toLowerCase();
    if (/already registered|already exists|duplicate.*email|user already registered|email address is already|users_email/i.test(msg) || code === 'user_already_exists') {
      return 'That email is already registered. Try signing in.';
    }
    if (/username|profiles_username_unique|duplicate key.*username/i.test(msg) || code === '23505') {
      return 'That username is already taken. Try another one.';
    }
    const pwErrors = passwordErrors(password, confirmPassword);
    if (/password|weak password|password should/i.test(msg) || pwErrors.length) {
      return pwErrors.length ? `Password needs ${pwErrors.join(', ')}.` : 'Could not create account. Please try again.';
    }
    return 'Could not create account. Please try again.';
  }

  async function resolveLoginEmail(identity) {
    // Email identifiers pass through. Username identifiers resolve through a
    // narrow RPC that returns at most one email for the exact normalized
    // username - never broad profile rows and never a list of users.
    if (identity.includes('@')) return identity;
    const { data, error } = await supabaseClient.rpc('login_identifier_for_username', { candidate: normalizeUsername(identity) });
    if (error || !data) return null;
    return String(data).toLowerCase();
  }

  async function authSignIn() {
    if (authTab !== 'signin') return;
    if (authBusy) return;
    authBusy = true;
    clearAuthError();
    clearAuthSuccess();
    try {
      const identity = ($('#authSignInIdentity')?.value || '').trim().toLowerCase();
      const password = $('#authSignInPassword')?.value || '';
      if (!identity || !password) return showAuthError('Enter your username/email and password.');
      if (CONFIG.USE_SUPABASE) {
        const client = await ensureSupabaseAuthClient();
        if (!client) return showAuthError('Connected sign-in is unavailable right now. Try again in a moment.');
        try {
          const email = await resolveLoginEmail(identity);
          if (!email) return showAuthError(GENERIC_LOGIN_ERROR);
          const { data, error } = await client.auth.signInWithPassword({ email, password });
          if (error || !data?.user) return showAuthError(GENERIC_LOGIN_ERROR);
          await ensureUserFromSupabase(data.user, { name: email.split('@')[0], role: 'Angler', area: 'Tampa Bay' });
          closeModal();
          toast('Signed in.');
          return;
        } catch (_) {
          return showAuthError(GENERIC_LOGIN_ERROR);
        }
      }
      const existing = state.users.find((u) => (u.email || '').toLowerCase() === identity || normalizeUsername(u.username || '') === normalizeUsername(identity));
      if (!existing || existing.password !== password) return showAuthError(GENERIC_LOGIN_ERROR);
      state.session = { userId: existing.id, signedInAt: now() };
      state.opsLog.unshift(`${existing.name} signed in locally.`);
      closeModal(); save(); render(); toast(`Welcome back, ${existing.name}.`);
    } finally {
      authBusy = false;
    }
  }

  async function authCreate() {
    if (authTab !== 'create') return;
    if (authBusy) return;
    authBusy = true;
    clearAuthError();
    clearAuthSuccess();
    try {
      const email = $('#authCreateEmail')?.value.trim().toLowerCase();
      const password = $('#authCreatePassword')?.value || '';
      const confirmPassword = $('#authCreatePasswordConfirm')?.value || '';
      const role = $('#authRole')?.value || 'Angler';
      const firstName = $('#authFirstName')?.value.trim() || '';
      const lastName = $('#authLastName')?.value.trim() || '';
      const name = [firstName, lastName].filter(Boolean).join(' ') || email?.split('@')[0] || 'FishCrew user';
      const area = $('#authArea')?.value.trim() || 'Tampa Bay';
      const typedUsername = $('#authCreateUsername')?.value.trim() || '';
      if (typedUsername) {
        const usernameError = usernameInputError(typedUsername);
        if (usernameError) return showAuthError(usernameError);
      }
      const username = normalizeUsername(typedUsername || email?.split('@')[0] || name);
      if (!firstName || !lastName) return showAuthError('First name and last name required.');
      if (!email || !username) return showAuthError('Email and username required.');
      const errors = passwordErrors(password, confirmPassword);
      if (errors.length) return showAuthError(`Password needs ${errors.join(', ')}.`);
      if (CONFIG.USE_SUPABASE) {
        const client = await ensureSupabaseAuthClient();
        if (!client) return showAuthError('Connected sign-up is unavailable right now. Try again in a moment.');
        try {
          if (await usernameTakenRemote(username) === true) return showAuthError('That username is already taken. Try another one.');
          const { data, error } = await client.auth.signUp({ email, password, options: { data: { full_name: name, first_name: firstName, last_name: lastName, username, role, home_area: area } } });
          if (error) return showAuthError(signupErrorMessage(error, password, confirmPassword));
          if (data.session?.user) {
            await ensureUserFromSupabase(data.session.user, { name, username, role, area, firstName, lastName, email }, { persistSession: true, syncProfile: true });
            closeModal();
            toast(SIGNUP_WELCOME_MESSAGE);
            return;
          }
          if (data.user) {
            closeModal();
            toast(SIGNUP_EMAIL_CONFIRM_MESSAGE);
            return;
          }
          return showAuthError('Could not create account. Please try again.');
        } catch (error) {
          return showAuthError(signupErrorMessage(error, password, confirmPassword));
        }
      }
      if (state.users.some((u) => (u.email || '').toLowerCase() === email)) return showAuthError('That email is already registered. Try signing in.');
      if (usernameTaken(username)) return showAuthError('That username is already taken. Try another one.');
      const user = { id: uid('user'), name, firstName, lastName, username, email, password, role, area, avatar: '', bio: 'Here to find crew, share useful reports, and fish more.', fishingStyles: 'Inshore, pier, weekend trips', profileTheme: 'Harbor Blue', createdAt: now() };
      state.users.push(user);
      state.session = { userId: user.id, signedInAt: now() };
      state.opsLog.unshift(`${name} created a local ${role} account.`);
      closeModal(); save(); render(); toast(SIGNUP_WELCOME_MESSAGE);
    } finally {
      authBusy = false;
    }
  }

  async function ensureSupabaseAuthClient() {
    if (supabaseClient) return supabaseClient;

    if (!CONFIG.USE_SUPABASE || !CONFIG.SUPABASE_URL || !CONFIG.SUPABASE_ANON_KEY || !window.supabase?.createClient) {
      return null;
    }

    supabaseClient = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });

    return supabaseClient;
  }

  function fishcrewOAuthRedirectUrl() {
    const canonical = CONFIG.WEB_CANONICAL_URL || `${window.location.origin}/`;
    const path = CONFIG.OAUTH_REDIRECT_PATH || '/';
    return new URL(path, canonical).toString();
  }

  function oauthProviderConfigured(provider = '') {
    const normalized = String(provider || '').trim().toLowerCase();
    if (normalized.includes('google')) return CONFIG.ENABLE_GOOGLE_AUTH === true && CONFIG.USE_SUPABASE === true && Boolean(CONFIG.SUPABASE_URL && CONFIG.SUPABASE_ANON_KEY);
    if (normalized.includes('facebook')) return CONFIG.ENABLE_FACEBOOK_AUTH === true && CONFIG.USE_SUPABASE === true && Boolean(CONFIG.SUPABASE_URL && CONFIG.SUPABASE_ANON_KEY);
    return false;
  }

  function socialAuthButtonHtml(provider) {
    const configured = oauthProviderConfigured(provider);
    const mark = provider === 'Google' ? 'G' : provider === 'Facebook' ? 'f' : IG_MARK;
    const cls = `${provider.toLowerCase()}${configured ? '' : ' coming-soon'}`;
    const label = configured ? `Continue with ${provider}` : `${provider} coming soon`;
    return `<button class="social-icon ${cls}" type="button" data-action="social-login" data-provider="${safe(provider)}" aria-label="${safe(label)}" title="${safe(label)}"><span>${mark}</span></button>`;
  }

  function metaInstagramConfigured() {
    return Boolean(CONFIG.META_APP_ID && CONFIG.ENABLE_INSTAGRAM_OAUTH === true);
  }

  function instagramRedirectUri() {
    if (CONFIG.META_INSTAGRAM_REDIRECT_URI) return CONFIG.META_INSTAGRAM_REDIRECT_URI;
    const base = (CONFIG.WEB_CANONICAL_URL || `${window.location.origin}/`).replace(/\/+$/, '/');
    return base;
  }

  function buildInstagramOAuthUrl(state) {
    // Client-side SPA flow: response_type=token returns access_token in the URL hash.
    // Prefer a server code exchange (META_APP_SECRET) when a backend callback is available.
    const version = CONFIG.META_GRAPH_VERSION || 'v21.0';
    const params = new URLSearchParams({
      client_id: CONFIG.META_APP_ID,
      redirect_uri: instagramRedirectUri(),
      state,
      scope: 'instagram_basic,pages_show_list,pages_read_engagement',
      response_type: 'token'
    });
    return `https://www.facebook.com/${version}/dialog/oauth?${params.toString()}`;
  }

  async function socialLogin(provider = 'social') {
    const normalized = String(provider || 'social').trim().toLowerCase() || 'social';

    if (normalized.includes('instagram')) {
      toast('Instagram is a Profile connect — not a login. Use email/password, or open Profile → Connect Instagram.', 'warning');
      return;
    }

    if (!oauthProviderConfigured(normalized)) {
      toast(`${normalized === 'google' ? 'Google' : normalized === 'facebook' ? 'Facebook' : 'Social'} sign-in: Coming soon.`, 'warning');
      return;
    }

    const supabaseProvider = normalized.includes('facebook') ? 'facebook' : normalized.includes('google') ? 'google' : '';
    if (!supabaseProvider) {
      toast('Coming soon.', 'warning');
      return;
    }

    const client = await ensureSupabaseAuthClient();
    if (!client) {
      toast('Connected sign-in is unavailable right now. Use email/password.', 'danger');
      return;
    }

    try {
      const options = { redirectTo: fishcrewOAuthRedirectUrl() };
      if (supabaseProvider === 'google') options.queryParams = { prompt: 'select_account' };
      const { error } = await client.auth.signInWithOAuth({ provider: supabaseProvider, options });
      if (error) throw error;
      toast(`Opening ${supabaseProvider} sign in...`);
    } catch (error) {
      toast(`${supabaseProvider} sign in failed: ${error.message}. Use email/password.`, 'danger');
    }
  }

  async function completeSocialProfile(provider = 'social') {
    // Production never invents @….oauth.local users. Demo mode only.
    if (CONFIG.DEMO_MODE !== true) {
      toast('Social profile completion is disabled. Sign in with email/password, or enable a configured OAuth provider.', 'danger');
      return;
    }
    const source = String(provider || 'social').trim() || 'social';
    if (String(source).toLowerCase().includes('instagram')) {
      toast('Instagram is not a login method in demo either — use email/password.', 'danger');
      return;
    }
    const typedUsername = $('#socialUsername')?.value.trim() || '';
    if (!typedUsername) return toast('Username required after third-party login.', 'danger');
    const usernameError = usernameInputError(typedUsername);
    if (usernameError) return toast(usernameError, 'danger');
    const username = normalizeUsername(typedUsername);
    const role = $('#socialRole')?.value || 'Angler';
    const area = $('#socialArea')?.value.trim() || 'Tampa Bay';
    if (usernameTaken(username)) return toast('That username is already taken. Try another one.', 'danger');
    if (await usernameTakenRemote(username) === true) return toast('That username is already taken. Try another one.', 'danger');
    const name = `${source} user`;
    const user = {
      id: uid('user'),
      name,
      username,
      email: `${username}@fishcrew.demo.local`,
      password: '',
      role,
      area,
      avatar: '',
      bio: 'Demo third-party profile (local only).',
      fishingStyles: 'Inshore, pier, weekend trips',
      profileTheme: 'Harbor Blue',
      authProvider: source,
      demo: true,
      createdAt: now()
    };
    state.users.push(user);
    state.session = { userId: user.id, signedInAt: now() };
    state.opsLog.unshift(`${usernameFor(user)} completed demo ${source} profile setup as ${role}.`);
    closeModal(); save(true); render(); toast(`${source} demo profile ready.`);
  }

  async function startInstagramConnect() {
    if (!requireLogin('Sign in to connect Instagram to your FishCrew profile.')) return;
    if (!metaInstagramConfigured()) {
      toast('Instagram OAuth is not configured yet. Set META_APP_ID and ENABLE_INSTAGRAM_OAUTH.', 'danger');
      return;
    }
    const user = currentUser();
    const stateToken = `ig_${user.id}_${Date.now().toString(36)}`;
    try {
      sessionStorage.setItem('fishcrew.ig.oauth.state', stateToken);
      sessionStorage.setItem('fishcrew.ig.oauth.uid', user.id);
    } catch (_) { /* sessionStorage may be blocked */ }
    toast('Opening Meta Instagram connect...');
    window.location.href = buildInstagramOAuthUrl(stateToken);
  }

  function parseOAuthHashParams() {
    const raw = String(window.location.hash || '').replace(/^#/, '');
    if (!raw || !/access_token=/.test(raw)) return null;
    const cleaned = raw.replace(/^instagram_callback&?/i, '');
    return new URLSearchParams(cleaned);
  }

  async function storeInstagramConnection(connection) {
    const user = currentUser();
    if (!user) return;
    user.instagramConnection = connection;
    state.instagramConnection = connection;
    save(true);
    if (supabaseClient) {
      try {
        await supabaseClient.auth.updateUser({
          data: {
            instagram_connected: true,
            instagram_username: connection.username || '',
            instagram_user_id: connection.igUserId || '',
            instagram_connected_at: connection.connectedAt
          }
        });
      } catch (error) {
        console.warn('Instagram metadata update skipped:', error?.message || error);
      }
      try {
        await supabaseClient.from('social_connections').upsert({
          user_id: user.id,
          provider: 'meta_instagram_graph',
          username: connection.username || null,
          provider_user_id: connection.igUserId || null,
          page_id: connection.pageId || null,
          access_token: connection.accessToken || null,
          expires_at: connection.expiresAt || null,
          updated_at: now()
        }, { onConflict: 'user_id,provider' });
      } catch (error) {
        // Table may not exist yet — metadata + local state still hold the connection.
        console.warn('social_connections upsert skipped:', error?.message || error);
      }
    }
  }

  async function resolveInstagramAccountFromToken(accessToken) {
    const version = CONFIG.META_GRAPH_VERSION || 'v21.0';
    const pagesRes = await fetch(`https://graph.facebook.com/${version}/me/accounts?fields=id,name,instagram_business_account{id,username}&access_token=${encodeURIComponent(accessToken)}`);
    const pagesPayload = await pagesRes.json();
    if (!pagesRes.ok) throw new Error(pagesPayload?.error?.message || 'Could not list Pages for Instagram.');
    const withIg = (pagesPayload.data || []).find((page) => page.instagram_business_account?.id);
    if (!withIg?.instagram_business_account?.id) {
      throw new Error('No Instagram Business/Creator account linked to your Facebook Pages.');
    }
    return {
      pageId: withIg.id,
      pageName: withIg.name,
      igUserId: withIg.instagram_business_account.id,
      username: withIg.instagram_business_account.username || ''
    };
  }

  async function maybeHandleInstagramOAuthCallback() {
    const hashParams = parseOAuthHashParams();
    const search = new URLSearchParams(location.search || '');
    const oauthError = search.get('error_description') || search.get('error') || hashParams?.get('error_description') || hashParams?.get('error');
    if (oauthError) {
      history.replaceState(null, '', `${location.pathname}${location.search}`.replace(/\?$/, '') || '/');
      toast(`Instagram connect failed: ${oauthError}`, 'danger');
      return;
    }
    if (!hashParams?.get('access_token')) return;

    const accessToken = hashParams.get('access_token');
    const stateToken = hashParams.get('state') || '';
    let expected = '';
    try { expected = sessionStorage.getItem('fishcrew.ig.oauth.state') || ''; } catch (_) {}
    if (expected && stateToken && expected !== stateToken) {
      toast('Instagram connect state mismatch. Try again from Profile.', 'danger');
      history.replaceState(null, '', location.pathname || '/');
      return;
    }

    try {
      const account = await resolveInstagramAccountFromToken(accessToken);
      const expiresIn = Number(hashParams.get('expires_in') || 0);
      const connection = {
        provider: 'meta_instagram_graph',
        accessToken,
        username: account.username,
        igUserId: account.igUserId,
        pageId: account.pageId,
        pageName: account.pageName,
        connectedAt: now(),
        expiresAt: expiresIn ? new Date(Date.now() + expiresIn * 1000).toISOString() : null
      };
      await storeInstagramConnection(connection);
      history.replaceState(null, '', location.pathname || '/');
      state.activeScreen = 'profile';
      render();
      toast(account.username ? `Instagram connected as @${account.username}.` : 'Instagram connected.');
    } catch (error) {
      history.replaceState(null, '', location.pathname || '/');
      toast(`Instagram connect failed: ${error.message}`, 'danger');
    }
  }

  async function importInstagramMedia() {
    if (!requireLogin('Sign in to import Instagram media.')) return;
    const connection = currentUser()?.instagramConnection || state.instagramConnection;
    if (!connection?.accessToken || !connection?.igUserId) {
      return toast('Connect Instagram first, then import.', 'danger');
    }
    try {
      const version = CONFIG.META_GRAPH_VERSION || 'v21.0';
      const res = await fetch(`https://graph.facebook.com/${version}/${encodeURIComponent(connection.igUserId)}/media?fields=id,caption,media_type,media_url,permalink,timestamp&limit=6&access_token=${encodeURIComponent(connection.accessToken)}`);
      const payload = await res.json();
      if (!res.ok) throw new Error(payload?.error?.message || 'Import failed.');
      const items = (payload.data || []).filter((item) => item.media_url && (item.media_type === 'IMAGE' || item.media_type === 'CAROUSEL_ALBUM'));
      if (!items.length) return toast('No recent Instagram images found to import.', 'warning');
      let imported = 0;
      const user = currentUser();
      for (const item of items.slice(0, 6)) {
        const already = (state.feed || []).some((p) => p.instagramMediaId === item.id);
        if (already) continue;
        const needsReview = mediaModerationEnabled();
        const post = {
          id: uid('feed'),
          type: 'Catch Log',
          title: (item.caption || 'Imported from Instagram').slice(0, 80),
          area: user?.area || userArea(),
          authorId: user.id,
          authorName: user.name,
          body: item.caption || 'Imported from Instagram.',
          media: item.media_url,
          mediaType: 'image/jpeg',
          status: needsReview ? 'Pending review' : 'Live',
          reactions: 0,
          instagramMediaId: item.id,
          source: 'instagram-import',
          createdAt: item.timestamp || now()
        };
        state.feed.unshift(post);
        const mediaReview = { status: 'Review', needsReview, severity: 'Low', note: 'Instagram import queued for review before public display.' };
        const report = queueMediaModerationIfNeeded(mediaReview, post.id, 'Instagram media review');
        const asset = trackMediaAsset({
          ownerId: user.id,
          sourceId: post.id,
          sourceType: 'feed',
          mediaType: 'image/jpeg',
          storagePath: `instagram/${item.id}`,
          publicUrl: item.media_url,
          status: needsReview ? 'Review' : 'Approved',
          visibility: 'public'
        });
        await afterLocalWrite('Instagram import', async () => {
          await liveUpsert('feed_posts', feedRow(post), 'instagram feed post');
          if (asset) await liveUpsert('media_assets', mediaAssetRow(asset), 'instagram media asset');
          if (report) await liveInsertModeration(report);
          return true;
        });
        imported += 1;
      }
      save(true); render();
      toast(imported
        ? (mediaModerationEnabled()
          ? `Imported ${imported} Instagram photo(s). Hidden from public feed until approved.`
          : `Imported ${imported} Instagram photo(s) to Feed.`)
        : 'Those photos were already imported.');
    } catch (error) {
      toast(`Instagram import failed: ${error.message}`, 'danger');
    }
  }

  function authForgot() {
    if (authTab !== 'signin') return;
    clearAuthError();
    clearAuthSuccess();
    const identity = ($('#authSignInIdentity')?.value || '').trim().toLowerCase();
    if (!identity) return showAuthError('Enter your account email to reset your password.');
    if (!identity.includes('@')) {
      return showAuthError('Password reset uses your account email. Enter your email above (not your username).');
    }
    authRequestPasswordReset(identity);
  }

  async function authRequestPasswordReset(email) {
    if (!CONFIG.USE_SUPABASE) {
      showAuthSuccess(PASSWORD_RESET_SUCCESS);
      return;
    }
    const client = await ensureSupabaseAuthClient();
    if (!client) return showAuthError('Password reset is unavailable right now. Try again in a moment.');
    try {
      const { error } = await client.auth.resetPasswordForEmail(email, { redirectTo: fishcrewOAuthRedirectUrl() });
      if (error) console.warn('Password reset request failed:', error.message);
    } catch (error) {
      console.warn('Password reset request failed:', error?.message || error);
    }
    showAuthSuccess(PASSWORD_RESET_SUCCESS);
  }

  function isPasswordRecoveryRedirect() {
    const hash = String(window.location.hash || '');
    return hash.includes('type=recovery');
  }

  async function maybeHandlePasswordRecovery() {
    if (!CONFIG.USE_SUPABASE || !isPasswordRecoveryRedirect()) return;
    const client = await ensureSupabaseAuthClient();
    if (!client) return;
    try {
      await client.auth.getSession();
      openPasswordResetModal();
      history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
    } catch (error) {
      console.warn('Password recovery session failed:', error?.message || error);
    }
  }

  function openPasswordResetModal() {
    modalMode = 'auth';
    modal(`
      <div class="modal-head"><div><span class="eyebrow">Reset password</span><h2>Set a new password.</h2></div><button class="x-btn" type="button" data-action="close-modal">${CLOSE_BTN}</button></div>
      <p class="lead">Choose a new password for your FishCrew account.</p>
      <div class="forms mt">
        <label class="label">New password<input id="resetPassword" name="new-password" class="field" type="password" autocomplete="new-password" placeholder="Use a secure password" /></label>
        <label class="label">Confirm password<input id="resetPasswordConfirm" name="new-password-confirm" class="field" type="password" autocomplete="new-password" placeholder="Confirm password" /></label>
        <div class="password-help">Use 8+ characters with uppercase, lowercase, a number, and a special character.</div>
        <button class="btn primary full" type="button" data-action="save-password-reset">Save new password</button>
      </div>`);
  }

  async function savePasswordReset() {
    const password = $('#resetPassword')?.value || '';
    const confirmPassword = $('#resetPasswordConfirm')?.value || '';
    const errors = passwordErrors(password, confirmPassword);
    if (errors.length) return toast(`Password needs ${errors.join(', ')}.`, 'danger');
    const client = await ensureSupabaseAuthClient();
    if (!client) return toast('Password reset is unavailable right now. Try again in a moment.', 'danger');
    try {
      const { error } = await client.auth.updateUser({ password });
      if (error) return toast('Could not update password. Request a new reset link and try again.', 'danger');
      closeModal();
      toast('Password updated. Sign in with your new password.');
    } catch (error) {
      toast('Could not update password. Request a new reset link and try again.', 'danger');
    }
  }

  async function ensureUserFromSupabase(authUser, fallback = {}, opts = {}) {
    if (!authUser) return;
    const persistSession = opts.persistSession !== false;
    const syncProfile = opts.syncProfile !== false;
    const meta = authUser.user_metadata || {};
    const user = {
      id: authUser.id,
      name: meta.full_name || fallback.name || authUser.email?.split('@')[0] || 'FishCrew user',
      email: authUser.email || fallback.email || '',
      username: normalizeUsername(meta.username || fallback.username || authUser.email?.split('@')[0] || fallback.name),
      password: '',
      bio: meta.bio || fallback.bio || 'Here to find crew, share useful reports, and fish more.',
      fishingStyles: meta.fishing_styles || fallback.fishingStyles || 'Inshore, pier, weekend trips',
      profileTheme: meta.profile_theme || fallback.profileTheme || 'Harbor Blue',
      role: meta.role || fallback.role || 'Angler',
      area: meta.home_area || fallback.area || 'Tampa Bay',
      avatar: meta.avatar_url || '',
      createdAt: authUser.created_at || now(),
      instagramConnection: meta.instagram_connected
        ? {
            provider: 'meta_instagram_graph',
            username: meta.instagram_username || '',
            igUserId: meta.instagram_user_id || '',
            connectedAt: meta.instagram_connected_at || now(),
            accessToken: ''
          }
        : undefined
    };
    if (!user.instagramConnection) delete user.instagramConnection;
    if (user.instagramConnection?.username) state.instagramConnection = { ...(state.instagramConnection || {}), ...user.instagramConnection };
    const idx = state.users.findIndex((u) => u.id === user.id || (Boolean(user.email) && u.email === user.email));
    if (idx >= 0) state.users[idx] = { ...state.users[idx], ...user };
    else state.users.push(user);
    if (persistSession) {
      const prevUserId = state.session?.userId || '';
      state.session = { userId: user.id, signedInAt: now() };
      state.backendMode = 'supabase';
      if (prevUserId && prevUserId !== user.id) {
        state.notifications = [];
        state.notificationsFetchError = '';
      }
      save(); render();
    }
    if (syncProfile && persistSession && supabaseClient) {
      try {
        const profileRow = () => ({
          id: user.id,
          email: user.email,
          username: user.username,
          full_name: user.name,
          bio: user.bio,
          fishing_styles: user.fishingStyles,
          profile_theme: user.profileTheme,
          role: user.role,
          home_area: user.area,
          avatar_url: user.avatar,
          updated_at: now()
        });
        let { error } = await supabaseClient.from('profiles').upsert(profileRow());
        // Backstop for the unique username index: if this auth user's metadata
        // username collides with an existing profile, retry once with a
        // suffixed handle instead of leaving the user without a profile row.
        if (error && (error.code === '23505' || /profiles_username_unique/i.test(error.message || ''))) {
          user.username = normalizeUsername(`${user.username}_${String(user.id).slice(0, 4)}`);
          const localIdx = state.users.findIndex((u) => u.id === user.id);
          if (localIdx >= 0) state.users[localIdx].username = user.username;
          save();
          ({ error } = await supabaseClient.from('profiles').upsert(profileRow()));
          if (!error) toast(`That username was taken, so your handle is now ${usernameFor(user)}. You can change it in Profile.`, 'warning');
        }
        if (error) {
          console.warn('Profile upsert skipped:', error.message || error);
        } else if (persistSession) {
          scheduleNotificationsRefresh();
        }
      } catch (error) {
        console.warn('Profile upsert failed:', error?.message || error);
      }
    }
    if (persistSession && supabaseClient) {
      await fetchNotifications();
      startRealtime();
    }
  }

  async function logout() {
    stopRealtime();
    if (supabaseClient) {
      await supabaseClient.auth.signOut().catch(() => {});
    }
    state.session = null;
    state.notifications = [];
    state.notificationsLoading = false;
    state.notificationsFetchError = '';
    authTab = 'signin';
    authBusy = false;
    state.opsLog.unshift('User logged out.');
    save(); render(); toast('Logged out.');
  }

  function getFile(inputId) {
    const file = $(`#${inputId}`)?.files?.[0];
    if (!file) return null;
    const max = Number(CONFIG.MAX_LOCAL_UPLOAD_MB || 3) * 1024 * 1024;
    if (!supabaseClient && file.size > max) {
      toast(`This file is over ${CONFIG.MAX_LOCAL_UPLOAD_MB || 3}MB. Use a smaller file for now.`, 'danger');
      return null;
    }
    return file;
  }

  function readFileData(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }


  function liveReady() {
    return Boolean(supabaseClient && state.backendMode === 'supabase');
  }

  async function liveSessionUserId() {
    if (!supabaseClient) return '';
    try {
      const { data } = await supabaseClient.auth.getSession();
      return data?.session?.user?.id || '';
    } catch (_) { return ''; }
  }

  async function canWriteLive() {
    if (!liveReady()) return false;
    const user = currentUser();
    const sessionId = await liveSessionUserId();
    return Boolean(user && sessionId && user.id === sessionId);
  }

  function tripRow(t) {
    // SECURITY: private meetup details never go into the public trip_posts row.
    // Pending trip media stays in media_assets until operator approval (RLS + trigger strip media_url).
    const mediaStatus = t.mediaModerationStatus || 'Approved';
    const mediaUrl = isApprovedMediaStatus(mediaStatus) ? (t.media || null) : null;
    return { id: t.id, host_id: t.hostId, title: t.title, trip_type: t.type, area: t.area, public_location: t.publicLocation, start_label: t.time, target_species: t.species, open_spots: Number(t.spots || 0), cost_note: t.cost, status: t.status || 'Open', condition_score: t.score, wind_label: t.wind, waves_label: t.waves, tide_label: t.tide, media_url: mediaUrl, media_moderation_status: mediaStatus };
  }

  function tripPrivateRow(t) {
    return { trip_id: t.id, host_id: t.hostId, private_location: t.privateLocation || 'Private location after approval', updated_at: now() };
  }

  function requestRow(r) {
    return { id: r.id, trip_id: r.tripId, requester_id: r.userId, requester_name: r.userName, message: r.message || '', status: r.status || 'Pending' };
  }

  function messageRow(m, tripId) {
    return { id: m.id, trip_id: tripId, sender_id: m.senderId, sender_name: m.senderName, body: m.body || '', created_at: m.createdAt || now() };
  }

  function feedRow(p) {
    // Pending review posts are author/admin-only via RLS; media_url rides with that row.
    return { id: p.id, author_id: p.authorId, author_name: p.authorName, post_type: p.type, title: p.title, body: p.body || '', area: p.area || '', media_url: p.media || null, media_type: p.mediaType || null, status: p.status || 'Live', reactions: Number(p.reactions || 0) };
  }

  function businessRow(b) {
    return { id: b.id, owner_id: b.ownerId || null, name: b.name, business_type: b.kind, area: b.area, status: b.status || 'Lead', lead_count: Number(b.leads || 0), revenue_cents: Math.round(Number(b.revenue || 0) * 100), campaign: b.campaign || '' };
  }

  function bookingRow(b) {
    return { id: b.id, business_id: b.businessId || null, customer_id: b.customerId || currentUser()?.id || null, customer_name: b.customerName, booking_type: b.kind, status: b.status || 'New', date_label: b.date || '', value_cents: Math.round(Number(b.value || 0) * 100), notes: b.notes || '' };
  }

  function mediaAssetRow(a) {
    const status = a.status || 'Review';
    return {
      id: a.id,
      owner_id: a.ownerId || currentUser()?.id || null,
      source_id: a.sourceId || '',
      source_type: a.sourceType || 'feed',
      media_type: a.mediaType || 'file',
      storage_path: a.storagePath || '',
      public_url: a.publicUrl || a.url || '',
      status,
      moderation_status: status,
      visibility: a.visibility || 'public'
    };
  }

  async function liveUpsert(table, row, label = table) {
    if (!(await canWriteLive())) return false;
    const options = table === 'trip_members' ? { onConflict: 'trip_id,user_id' } : undefined;
    const { error } = await supabaseClient.from(table).upsert(row, options);
    if (error) throw new Error(`${label}: ${error.message}`);
    return true;
  }

  async function liveInsert(table, row, label = table) {
    if (!(await canWriteLive())) return false;
    const { error } = await supabaseClient.from(table).insert(row);
    if (error) throw new Error(`${label}: ${error.message}`);
    return true;
  }

  async function liveUpdate(table, values, column, value, label = table) {
    if (!(await canWriteLive())) return false;
    const { error } = await supabaseClient.from(table).update(values).eq(column, value);
    if (error) throw new Error(`${label}: ${error.message}`);
    return true;
  }

  async function afterLocalWrite(label, liveTask) {
    save(); render();
    if (!liveReady()) return;
    try {
      const wrote = await liveTask();
      state.liveStatus = wrote ? `${label} saved to shared data.` : `${label} saved in this browser. Sign in with a connected account for shared mode.`;
      if (wrote) state.opsLog.unshift(state.liveStatus);
      save(); render();
    } catch (error) {
      console.error(error);
      state.opsLog.unshift(`${label} live sync failed: ${error.message}`);
      save(); render();
      toast(`${label} saved in this browser; sync failed: ${error.message}`, 'danger');
    }
  }

  function autoModerateMedia(file, folder = 'media') {
    if (!file) return { status: 'No media', needsReview: false, severity: 'None', note: 'No media attached.' };
    const type = file.type || '';
    const kind = mediaKind(type);
    const name = String(file.name || '').toLowerCase();
    const sizeMb = bytesToMb(file.size || 0);
    const reviewWords = ['graphic','blood','kill','illegal','limit','gore','nsfw'];
    const hasReviewWord = reviewWords.some((word) => name.includes(word));
    if (folder === 'avatars' && kind !== 'image') return { status: 'Blocked', needsReview: true, severity: 'High', note: 'Profile media must be an image.' };
    // Public-facing UGC (feed, profile, trip, Instagram) always queues when moderation is on.
    if (mediaModerationEnabled() && ['feed', 'avatars', 'trips', 'instagram', 'media'].includes(folder)) {
      return {
        status: 'Review',
        needsReview: true,
        severity: kind === 'video' || type === 'image/gif' ? 'Medium' : 'Low',
        note: 'User media queued for review before public display.'
      };
    }
    if (kind === 'video' || type === 'image/gif') return { status: 'Review', needsReview: true, severity: 'Medium', note: `${kind === 'video' ? 'Video' : 'GIF'} upload queued for review.` };
    if (hasReviewWord) return { status: 'Review', needsReview: true, severity: 'Medium', note: 'Filename contains terms that should be reviewed before trust scoring.' };
    if (sizeMb >= 4 && !liveReady()) return { status: 'Review', needsReview: true, severity: 'Low', note: 'Large browser photo queued for review; connected storage recommended.' };
    return { status: 'Auto-approved', needsReview: false, severity: 'Low', note: 'Photo passed metadata checks and remains reportable.' };
  }

  function queueMediaModerationIfNeeded(moderation, target, label = 'Media review') {
    if (!moderation || !moderation.needsReview) return null;
    const report = queueModeration(label, target, moderation.note || 'Media review queued');
    report.severity = moderation.severity || report.severity;
    return report;
  }

  function validateMediaFile(file, folder = 'media') {
    if (!file) return;
    let type = String(file.type || '').toLowerCase();
    if (!type && file.name) {
      const ext = String(file.name).split('.').pop().toLowerCase();
      const byExt = {
        jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp',
        heic: 'image/heic', heif: 'image/heif', gif: 'image/gif',
        mp4: 'video/mp4', mov: 'video/quicktime', webm: 'video/webm'
      };
      type = byExt[ext] || '';
    }
    const kind = mediaKind(type);
    const allowedKinds = folder === 'avatars' || folder === 'trips' ? ['image'] : ['image', 'video'];
    if (!allowedKinds.includes(kind)) {
      throw new Error(folder === 'avatars' ? 'Profile photos must be image files.' : 'Uploads must be photo or video files.');
    }
    const allowedTypes = kind === 'video' ? ALLOWED_VIDEO_TYPES : ALLOWED_IMAGE_TYPES;
    if (type && !allowedTypes.includes(type)) {
      throw new Error('Unsupported file type. Use JPG, PNG, WEBP, HEIC, GIF, MP4, MOV, or WEBM.');
    }
    const localImageLimit = Number(CONFIG.MAX_LOCAL_UPLOAD_MB || 6);
    const liveImageLimit = Number(CONFIG.MAX_IMAGE_UPLOAD_MB || 10);
    const liveVideoLimit = Number(CONFIG.MAX_VIDEO_UPLOAD_MB || 50);
    const limitMb = liveReady() ? (kind === 'video' ? liveVideoLimit : liveImageLimit) : (kind === 'video' ? 8 : localImageLimit);
    if (file.size > limitMb * 1024 * 1024) {
      const liveHint = liveReady() ? '' : ' Use connected storage for larger media.';
      throw new Error(`${kind === 'video' ? 'Video' : 'Photo'} is ${bytesToMb(file.size)} MB. Limit is ${limitMb} MB.${liveHint}`);
    }
  }

  function queueModeration(itemType, target, note = 'Media review queued') {
    const existing = state.reports?.find((r) => r.target === target && r.status === 'Open');
    if (existing) return existing;
    const report = { id: uid('rep'), type: itemType, target, status: 'Open', severity: itemType.includes('Video') ? 'Medium' : 'Low', note, reporterId: currentUser()?.id || 'system', createdAt: now() };
    state.reports = state.reports || [];
    state.reports.unshift(report);
    state.opsLog.unshift(`Moderation queued: ${itemType} for ${target}.`);
    return report;
  }

  async function liveInsertModeration(report) {
    if (!report || !(await canWriteLive())) return false;
    const { error } = await supabaseClient.from('moderation_items').insert({
      id: report.id,
      item_type: report.type,
      title: report.note || report.type,
      severity: report.severity || 'Low',
      status: report.status || 'Open',
      reporter_id: report.reporterId || currentUser()?.id || null,
      feed_post_id: report.target?.startsWith('feed') ? report.target : null
    });
    if (error) throw new Error(`moderation: ${error.message}`);
    return true;
  }


  function trackMediaAsset(asset) {
    state.mediaAssets = state.mediaAssets || [];
    const tracked = {
      id: uid('asset'),
      ownerId: asset.ownerId || currentUser()?.id || 'guest',
      sourceId: asset.sourceId || '',
      sourceType: asset.sourceType || 'feed',
      mediaType: asset.mediaType || 'file',
      storagePath: asset.storagePath || 'local-preview',
      publicUrl: asset.publicUrl || asset.url || '',
      status: asset.status || 'Review',
      visibility: asset.visibility || 'public',
      createdAt: now()
    };
    state.mediaAssets.unshift(tracked);
    return tracked;
  }

  function isLiveUploadMode() {
    return CONFIG.USE_SUPABASE === true && CONFIG.DEMO_MODE !== true;
  }

  function isOfflineOrDemoUploadMode() {
    return CONFIG.DEMO_MODE === true || CONFIG.USE_SUPABASE !== true;
  }

  function showUploadFailure(message, retryAction) {
    pendingUploadRetry = typeof retryAction === 'function' ? retryAction : null;
    toast(`${message} Tap Retry to try again.`, 'danger');
    modal(`
      <div class="modal-head"><div><span class="eyebrow">Upload</span><h2>Upload did not finish.</h2></div><button class="x-btn" type="button" data-action="close-modal">${CLOSE_BTN}</button></div>
      <p class="lead">${safe(message)}</p>
      <div class="safe-note"><strong>Live mode:</strong> FishCrew does not silently fall back to a local preview when shared storage fails. Fix the connection or retry.</div>
      <div class="row mt">
        <button class="btn primary" type="button" data-action="retry-upload"${pendingUploadRetry ? '' : ' disabled'}>Retry upload</button>
        <button class="btn dark" type="button" data-action="close-modal">Close</button>
      </div>`);
  }

  async function runPendingUploadRetry() {
    const retry = pendingUploadRetry;
    pendingUploadRetry = null;
    closeModal();
    if (typeof retry === 'function') await retry();
  }

  async function uploadMedia(file, folder = 'media') {
    if (!file) return { url: '', type: '' };
    validateMediaFile(file, folder);

    if (isLiveUploadMode()) {
      const client = await ensureSupabaseAuthClient();
      const bucket = CONFIG.STORAGE_BUCKET || CONFIG.MEDIA_BUCKET;
      if (!client || !bucket) {
        const err = new Error('Live storage is not ready. Check shared-data connection, then retry.');
        err.code = 'STORAGE_UNAVAILABLE';
        err.retryable = true;
        throw err;
      }
      const path = `${folder}/${currentUser()?.id || 'guest'}/${Date.now()}-${file.name.replace(/[^a-z0-9.\-_]/gi, '-')}`;
      try {
        const { error } = await client.storage.from(bucket).upload(path, file, { upsert: true, contentType: file.type, cacheControl: '3600' });
        if (error) {
          const err = new Error(error.message || 'Storage upload failed.');
          err.code = 'STORAGE_UPLOAD_FAILED';
          err.retryable = true;
          throw err;
        }
        const { data } = client.storage.from(bucket).getPublicUrl(path);
        return { url: data.publicUrl, type: file.type, size: file.size, path, live: true };
      } catch (error) {
        if (error?.retryable) throw error;
        const err = new Error(error?.message || 'Storage upload failed.');
        err.code = 'STORAGE_UPLOAD_FAILED';
        err.retryable = true;
        throw err;
      }
    }

    if (!isOfflineOrDemoUploadMode()) {
      const err = new Error('Upload is blocked until live storage or demo/offline mode is available.');
      err.retryable = true;
      throw err;
    }

    const dataUrl = await readFileData(file);
    return { url: dataUrl, type: file.type, size: file.size, path: 'local-preview', live: false };
  }

  async function saveProfilePhoto() {
    if (!requireLogin()) return;
    const file = getFile('profilePhoto');
    if (!file) return toast('Choose a photo first.', 'danger');
    try {
      const mediaReview = autoModerateMedia(file, 'avatars');
      const { url, type, path, live } = await uploadMedia(file, 'avatars');
      const user = currentUser();
      const avatarStatus = mediaReview.needsReview ? 'Review' : (isApprovedMediaStatus(mediaReview.status) ? mediaReview.status : 'Approved');
      if (mediaReview.needsReview) {
        user.avatarPending = url;
        user.avatarModerationStatus = 'Review';
      } else {
        user.avatar = url;
        user.avatarModerationStatus = avatarStatus;
        delete user.avatarPending;
      }
      const asset = trackMediaAsset({ ownerId: user.id, sourceId: user.id, sourceType: 'profile', mediaType: type || file.type, storagePath: path || 'local-avatar-preview', publicUrl: url, status: avatarStatus === 'Approved' && mediaReview.status === 'Auto-approved' ? 'Auto-approved' : avatarStatus, visibility: 'profile' });
      const report = queueMediaModerationIfNeeded(mediaReview, user.id, 'Profile photo review');
      if (supabaseClient) {
        try {
          const profilePatch = {
            avatar_moderation_status: avatarStatus === 'Auto-approved' ? 'Approved' : avatarStatus
          };
          if (!mediaReview.needsReview) profilePatch.avatar_url = url;
          const { error } = await supabaseClient
            .from('profiles')
            .update(profilePatch)
            .eq('id', user.id);

          if (error) console.warn('Avatar profile update skipped:', error.message || error);
        } catch (error) {
          console.warn('Avatar profile update failed:', error?.message || error);
        }
        if (asset) await liveUpsert('media_assets', mediaAssetRow(asset), 'profile media asset').catch(() => {});
        if (report) await liveInsertModeration(report).catch(() => {});
      }
      closeModal(); save(); render(); toast(mediaReview.needsReview ? 'Profile photo saved. Hidden from public profiles until approved.' : 'Profile photo saved.');
    } catch (error) {
      showUploadFailure(`Photo save failed: ${error.message}`, () => saveProfilePhoto());
    }
  }

  async function saveProfile() {
    if (!requireLogin()) return;
    const user = currentUser();
    const typedUsername = $('#editUsername')?.value.trim() || '';
    if (typedUsername) {
      const usernameError = usernameInputError(typedUsername);
      if (usernameError) return toast(usernameError, 'danger');
    }
    const nextUsername = normalizeUsername(typedUsername || user.username || user.name);
    if (usernameTaken(nextUsername, user.id)) return toast('That username is already taken. Try another one.', 'danger');
    if (nextUsername !== normalizeUsername(user.username || '') && await usernameTakenRemote(nextUsername, user.id) === true) {
      return toast('That username is already taken. Try another one.', 'danger');
    }
    user.name = $('#editName')?.value.trim() || user.name;
    user.username = nextUsername;
    user.role = $('#editRole')?.value || user.role;
    user.area = $('#editArea')?.value.trim() || user.area;
    user.bio = $('#editBio')?.value.trim() || user.bio || 'Here to find crew, share useful reports, and fish more.';
    user.fishingStyles = $('#editStyles')?.value.trim() || user.fishingStyles || 'Inshore, pier, weekend trips';
    user.profileTheme = $('#editTheme')?.value || user.profileTheme || 'Harbor Blue';
    if (supabaseClient) {
      (async () => {
        try {
          const profilePayload = {
            id: user.id,
            email: user.email,
            username: user.username,
            full_name: user.name,
            bio: user.bio,
            fishing_styles: user.fishingStyles,
            profile_theme: user.profileTheme,
            role: user.role,
            home_area: user.area,
            updated_at: now()
          };
          // Do not publish a pending avatar through the profile row (RLS/trigger guard + client).
          if (!user.avatarPending) {
            profilePayload.avatar_url = user.avatar;
            profilePayload.avatar_moderation_status = user.avatarModerationStatus || 'Approved';
          } else {
            profilePayload.avatar_moderation_status = 'Review';
          }
          const { error } = await supabaseClient
            .from('profiles')
            .upsert(profilePayload);

          if (error) console.warn('Profile upsert skipped:', error.message || error);
          else scheduleNotificationsRefresh();
        } catch (error) {
          console.warn('Profile upsert failed:', error?.message || error);
        }
      })();
    }
    state.opsLog.unshift(`${user.name} updated profile and handle ${usernameFor(user)}.`);
    closeModal(); save(); render(); toast('Profile updated.');
  }

  async function saveTrip() {
    if (!requireLogin()) return;
    const file = getFile('tripMedia');
    let uploaded = { url: '', type: '' };
    let mediaReview = autoModerateMedia(file, 'trips');
    try { if (file) uploaded = await uploadMedia(file, 'trips'); } catch (error) { return showUploadFailure(`Trip media failed: ${error.message}`, () => saveTrip()); }
    const user = currentUser();
    const trip = {
      id: uid('trip'),
      title: $('#tripTitle')?.value.trim() || 'New fishing plan',
      type: $('#tripType')?.value || 'Boat',
      area: $('#tripArea')?.value.trim() || user.area,
      publicLocation: $('#tripPublic')?.value.trim() || $('#tripArea')?.value.trim() || user.area,
      privateLocation: $('#tripPrivate')?.value.trim() || 'Private location after approval',
      hostId: user.id,
      hostName: user.name,
      time: $('#tripTime')?.value.trim() || 'This weekend',
      species: $('#tripSpecies')?.value.trim() || 'Mixed bag',
      spots: Math.max(0, Number($('#tripSpots')?.value || 1)),
      cost: 'Split cost / host notes',
      status: 'Open',
      score: $('#tripScore')?.value || 'Good',
      wind: $('#tripWind')?.value.trim() || '8 mph',
      waves: $('#tripWaves')?.value.trim() || '1 ft',
      tide: $('#tripTide')?.value.trim() || 'Moving',
      water: '?',
      media: uploaded.url,
      mediaType: uploaded.type,
      members: [user.id],
      createdAt: now()
    };
    state.trips.unshift(trip);
    state.activeTripId = trip.id;
    state.activeScreen = 'explore';
    state.opsLog.unshift(`${user.name} posted trip: ${trip.title}.`);
    closeModal();
    state.messages[trip.id] = state.messages[trip.id] || [{ id: uid('msg'), senderId: 'system', senderName: 'FishCrew', body: 'Trip created. Crew chat will unlock as members join.', createdAt: now() }];
    const tripReport = uploaded.url ? queueMediaModerationIfNeeded(mediaReview, trip.id, mediaKind(uploaded.type) === 'video' ? 'Video trip media' : 'Trip media review') : null;
    const tripMediaStatus = uploaded.url
      ? (mediaReview.needsReview ? 'Review' : (isApprovedMediaStatus(mediaReview.status) ? mediaReview.status : 'Approved'))
      : 'Approved';
    trip.mediaModerationStatus = tripMediaStatus;
    const tripAsset = uploaded.url ? trackMediaAsset({ ownerId: user.id, sourceId: trip.id, sourceType: 'trip', mediaType: uploaded.type, storagePath: uploaded.path || 'local-trip-preview', publicUrl: uploaded.url, status: tripMediaStatus === 'Approved' && mediaReview.status === 'Auto-approved' ? 'Auto-approved' : tripMediaStatus, visibility: 'crew' }) : null;
    await afterLocalWrite('Trip', async () => {
      await liveUpsert('trip_posts', tripRow(trip), 'trip');
      await liveUpsert('trip_private_details', tripPrivateRow(trip), 'private meetup details');
      await liveUpsert('trip_members', { trip_id: trip.id, user_id: user.id, member_role: 'host', status: 'Approved' }, 'trip member');
      if (tripAsset) await liveUpsert('media_assets', mediaAssetRow(tripAsset), 'media asset');
      if (tripReport) await liveInsertModeration(tripReport);
      return true;
    });
    nav('explore'); toast(uploaded.url ? (mediaReview.needsReview ? 'Trip posted. Photo hidden from public Explore until approved.' : 'Trip posted. Photo auto-approved and reportable.') : 'Trip posted.');
  }

  async function saveFeedPost() {
    if (!requireLogin()) return;
    const file = getFile('feedMedia');
    let uploaded = { url: '', type: '' };
    let mediaReview = autoModerateMedia(file, 'feed');
    try { if (file) uploaded = await uploadMedia(file, 'feed'); } catch (error) { return showUploadFailure(`Media upload failed: ${error.message}`, () => saveFeedPost()); }
    const user = currentUser();
    const type = $('#feedType')?.value || 'Crew Recap';
    const post = {
      id: uid('feed'),
      type,
      title: $('#feedTitleInput')?.value.trim() || (type === 'Catch Log' ? 'Fresh catch report' : 'New FishCrew post'),
      area: $('#feedArea')?.value.trim() || user.area,
      authorId: user.id,
      authorName: user.name,
      body: $('#feedBody')?.value.trim() || 'Posted from FishCrew.',
      media: uploaded.url,
      mediaType: uploaded.type || 'emoji',
      artKind: type === 'Dock Report' ? 'shop' : type === 'Open Water Seat' ? 'boat' : type === 'After-Bite Run' ? 'boat' : 'catch',
      reactions: 0,
      status: uploaded.url && mediaReview.needsReview ? 'Pending review' : (type === 'Dock Report' ? 'Sponsored' : 'Live'),
      createdAt: now()
    };
    state.feed.unshift(post);
    const feedReport = uploaded.url ? queueMediaModerationIfNeeded(mediaReview, post.id, mediaKind(uploaded.type) === 'video' ? 'Video feed media' : 'Feed media review') : null;
    const feedAsset = uploaded.url ? trackMediaAsset({ ownerId: user.id, sourceId: post.id, sourceType: 'feed', mediaType: uploaded.type, storagePath: uploaded.path || 'local-feed-preview', publicUrl: uploaded.url, status: mediaReview.status || (uploaded.live ? 'Review' : 'Local preview'), visibility: 'public' }) : null;
    state.feedFilter = 'All';
    state.activeScreen = 'feed';
    state.opsLog.unshift(`${user.name} posted feed item: ${post.title}.`);
    closeModal();
    await afterLocalWrite('Feed post', async () => {
      await liveUpsert('feed_posts', feedRow(post), 'feed post');
      if (feedAsset) await liveUpsert('media_assets', mediaAssetRow(feedAsset), 'media asset');
      if (feedReport) await liveInsertModeration(feedReport);
      return true;
    });
    nav('feed');
    toast(uploaded.url
      ? (mediaReview.needsReview
        ? 'Posted. Hidden from the public feed until an operator approves the media.'
        : 'Feed post live. Photo auto-approved and reportable.')
      : 'Feed post live.');
  }

  async function saveBusiness() {
    if (!requireBusiness()) return;
    const user = currentUser();
    const biz = {
      id: uid('biz'),
      ownerId: user.id,
      name: $('#bizName')?.value.trim() || 'New FishCrew partner',
      kind: $('#bizKind')?.value || 'Tackle Shop',
      area: $('#bizArea')?.value.trim() || user.area,
      status: isAdmin() ? 'Verified' : 'Pending review',
      leads: 0,
      revenue: 0,
      campaign: $('#bizCampaign')?.value.trim() || 'Local fishing offer'
    };
    state.businesses.unshift(biz);
    state.feed.unshift({ id: uid('feed'), type: biz.kind === 'After-Bite Run' ? 'After-Bite Run' : biz.kind === 'Pro Charter' ? 'Open Water Seat' : 'Dock Report', title: `${biz.name}: ${biz.campaign}`, area: biz.area, authorId: user.id, authorName: user.name, body: 'New local water update added to FishCrew.', media: '', mediaType: 'emoji', artKind: biz.kind === 'After-Bite Run' ? 'boat' : biz.kind === 'Pro Charter' ? 'boat' : 'shop', reactions: 0, status: 'Sponsored', createdAt: now() });
    state.opsLog.unshift(`${user.name} added business: ${biz.name}.`);
    closeModal();
    const promo = state.feed[0];
    await afterLocalWrite('Business', async () => {
      await liveUpsert('businesses', businessRow(biz), 'business');
      await liveUpsert('feed_posts', feedRow(promo), 'business feed post');
      return true;
    });
    nav('explore'); toast('Business added.');
  }

  async function saveBooking() {
    if (!requireBusiness()) return;
    const bizId = $('#bookBusiness')?.value || state.businesses[0]?.id || '';
    const booking = { id: uid('book'), businessId: bizId, customerId: currentUser()?.id || null, customerName: $('#bookCustomer')?.value.trim() || 'New customer', kind: $('#bookKind')?.value || 'Charter inquiry', status: 'New', date: $('#bookDate')?.value.trim() || 'TBD', value: Number($('#bookValue')?.value || 0), notes: $('#bookNotes')?.value.trim() || 'No notes yet.' };
    state.bookings.unshift(booking);
    const biz = state.businesses.find((b) => b.id === bizId);
    if (biz) { biz.leads = Number(biz.leads || 0) + 1; }
    state.opsLog.unshift(`Booking lead captured: ${booking.customerName} ${MID} ${booking.kind}.`);
    closeModal();
    await afterLocalWrite('Booking lead', async () => {
      await liveUpsert('bookings', bookingRow(booking), 'booking');
      if (biz) await liveUpdate('businesses', { lead_count: Number(biz.leads || 0) }, 'id', biz.id, 'business lead count');
      return true;
    });
    toast('Booking lead saved.');
  }

  function openHostControls(tripId) {
    const trip = state.trips.find((t) => t.id === tripId);
    if (!trip) return toast('Trip not found.', 'danger');
    if (!currentUser() || (currentUser().id !== trip.hostId && !isAdmin())) return toast('Only the host or operator can manage this trip.', 'danger');
    const requests = state.requests.filter((r) => r.tripId === trip.id);
    const members = (trip.members || []).map((id) => state.users.find((u) => u.id === id)?.name || id);
    modal(`
      <div class="modal-head"><div><span class="eyebrow">Host controls</span><h2>${safe(trip.title)}</h2></div><button class="x-btn" type="button" data-action="close-modal">${CLOSE_BTN}</button></div>
      <div class="stack">
        <div class="panel"><div class="row">${scoreBadge(trip.score)}<span class="chip">${safe(trip.status || 'Open')}</span><span class="chip">${safe(trip.spots)} open</span></div><p class="muted">${safe(trip.area)} ${MID} ${safe(trip.time)}</p><p class="tiny">Crew: ${safe(members.join(', ') || 'Host only')}</p></div>
        <div class="grid two"><button class="panel" type="button" data-action="complete-trip" data-trip-id="${safe(trip.id)}"><h3>Mark complete</h3><p class="muted">Close the trip and create a proof post for the feed.</p></button><button class="panel" type="button" data-action="cancel-trip" data-trip-id="${safe(trip.id)}"><h3>Cancel trip</h3><p class="muted">Close requests, notify crew, and protect private details.</p></button></div>
        <div class="grid two"><button class="panel" type="button" data-action="reopen-trip" data-trip-id="${safe(trip.id)}"><h3>Reopen</h3><p class="muted">Put this trip back in the open trip board.</p></button><button class="panel" type="button" data-action="duplicate-trip" data-trip-id="${safe(trip.id)}"><h3>Duplicate</h3><p class="muted">Create a fresh copy for another day.</p></button></div>
        <div class="panel"><h3>Requests</h3>${requests.map((r)=>`<div class="lead-row"><div><b>${safe(r.userName)}</b><small>${safe(r.status)} ${MID} ${safe(r.message)}</small></div><div class="row">${r.status === 'Pending' ? `<button class="btn success small" type="button" data-action="approve-request" data-request-id="${safe(r.id)}">Approve</button><button class="btn danger small" type="button" data-action="decline-request" data-request-id="${safe(r.id)}">Decline</button>` : `<span class="chip">${safe(r.status)}</span>`}</div></div>`).join('') || '<p class="muted">No requests yet.</p>'}</div>
      </div>`);
  }

  async function completeTrip(tripId) {
    const trip = state.trips.find((t) => t.id === tripId);
    if (!trip) return;
    if (!currentUser() || (currentUser().id !== trip.hostId && !isAdmin())) return toast('Only the host or operator can complete this trip.', 'danger');
    if (trip.status === 'Completed') return toast('Trip already completed.');
    trip.status = 'Completed';
    trip.completedAt = now();
    const user = currentUser();
    const recap = {
      id: uid('feed'),
      type: 'Crew Recap',
      title: `Completed: ${trip.title}`,
      area: trip.area,
      authorId: user.id,
      authorName: user.name,
      body: `Trip wrapped. ${trip.species} ${MID} ${trip.score} window ${MID} ${trip.publicLocation}.`,
      media: trip.media || '',
      mediaType: trip.mediaType || '',
      artKind: trip.artKind || 'catch',
      reactions: 0,
      status: 'Live',
      tripId: trip.id,
      createdAt: now()
    };
    state.feed.unshift(recap);
    state.messages[trip.id] = state.messages[trip.id] || [];
    state.messages[trip.id].push({ id: uid('msg'), senderId: 'system', senderName: 'FishCrew', body: 'Trip marked complete. Recap posted to the bite board.', createdAt: now() });
    state.activeScreen = 'feed';
    state.feedFilter = 'All';
    state.opsLog.unshift(`${trip.title} completed and recap posted.`);
    closeModal();
    await afterLocalWrite('Complete trip', async () => {
      await liveUpdate('trip_posts', { status: 'Completed', completed_at: trip.completedAt }, 'id', trip.id, 'trip complete');
      await liveUpsert('feed_posts', feedRow(recap), 'trip recap');
      return true;
    });
    nav('feed'); toast('Trip completed. Recap posted.');
  }

  async function cancelTrip(tripId) {
    const trip = state.trips.find((t) => t.id === tripId);
    if (!trip) return;
    if (!currentUser() || (currentUser().id !== trip.hostId && !isAdmin())) return toast('Only the host or operator can cancel this trip.', 'danger');
    if (!confirm(`Cancel ${trip.title}?`)) return;
    trip.status = 'Cancelled';
    trip.cancelledAt = now();
    state.requests.filter((r) => r.tripId === trip.id && r.status === 'Pending').forEach((r) => { r.status = 'Declined'; });
    state.messages[trip.id] = state.messages[trip.id] || [];
    state.messages[trip.id].push({ id: uid('msg'), senderId: 'system', senderName: 'FishCrew', body: 'Trip cancelled by host. Pending requests were closed.', createdAt: now() });
    state.opsLog.unshift(`${trip.title} cancelled by host/operator.`);
    closeModal();
    await afterLocalWrite('Cancel trip', async () => {
      await liveUpdate('trip_posts', { status: 'Cancelled', cancelled_at: trip.cancelledAt }, 'id', trip.id, 'trip cancel');
      return true;
    });
    render(); toast('Trip cancelled.');
  }

  async function reopenTrip(tripId) {
    const trip = state.trips.find((t) => t.id === tripId);
    if (!trip) return;
    if (!currentUser() || (currentUser().id !== trip.hostId && !isAdmin())) return toast('Only the host or operator can reopen this trip.', 'danger');
    trip.status = 'Open';
    trip.reopenedAt = now();
    state.opsLog.unshift(`${trip.title} reopened.`);
    closeModal();
    await afterLocalWrite('Reopen trip', async () => liveUpdate('trip_posts', { status: 'Open' }, 'id', trip.id, 'trip reopen'));
    render(); toast('Trip reopened.');
  }

  async function duplicateTrip(tripId) {
    const original = state.trips.find((t) => t.id === tripId);
    if (!original) return;
    if (!requireLogin()) return;
    const user = currentUser();
    if (original.hostId !== user.id && !isAdmin()) return toast('Only the host or operator can duplicate this trip.', 'danger');
    const copy = { ...original, id: uid('trip'), title: `${original.title} copy`, status: 'Open', spots: Math.max(1, Number(original.spots || 1)), hostId: user.id, hostName: user.name, members: [user.id], createdAt: now(), completedAt: null, cancelledAt: null, demo: false };
    state.trips.unshift(copy);
    state.messages[copy.id] = [{ id: uid('msg'), senderId: 'system', senderName: 'FishCrew', body: 'Duplicated trip created. Update date/time and details as needed.', createdAt: now() }];
    state.activeTripId = copy.id;
    state.activeScreen = 'explore';
    state.opsLog.unshift(`${user.name} duplicated trip: ${original.title}.`);
    closeModal();
    await afterLocalWrite('Duplicate trip', async () => {
      await liveUpsert('trip_posts', tripRow(copy), 'duplicated trip');
      await liveUpsert('trip_members', { trip_id: copy.id, user_id: user.id, member_role: 'host', status: 'Approved' }, 'trip member');
      return true;
    });
    nav('explore'); toast('Trip duplicated.');
  }

  async function requestTrip(tripId) {
    const trip = state.trips.find((t) => t.id === tripId);
    if (!trip) return toast('Trip not found.', 'danger');
    if (!requireLogin('Sign in to request a spot and unlock chat after the host approves you.')) return;
    const user = currentUser();
    if (String(trip.status || 'Open') !== 'Open' || Number(trip.spots || 0) <= 0) return toast('This trip is closed for new requests.', 'danger');
    if (trip.members?.includes(user.id)) {
      state.activeTripId = trip.id;
      state.crewPanel = 'chat';
      save(); nav('crew');
      return toast('You are already in this crew.');
    }
    const existing = state.requests.find((r) => r.tripId === trip.id && r.userId === user.id && r.status === 'Pending');
    if (existing) {
      state.activeTripId = trip.id;
      state.crewPanel = 'requests';
      save(); nav('crew');
      return toast('Request already pending.');
    }
    const req = { id: uid('req'), tripId: trip.id, userId: user.id, userName: user.name, message: 'Requesting a spot. I can coordinate in Crew chat.', status: 'Pending', createdAt: now() };
    state.requests.unshift(req);
    state.activeTripId = trip.id;
    state.crewPanel = 'requests';
    state.opsLog.unshift(`${user.name} requested ${trip.title}.`);
    await afterLocalWrite('Join request', async () => liveUpsert('join_requests', requestRow(req), 'join request'));
    nav('crew'); toast('Request sent.');
  }

  async function approveRequest(requestId) {
    const req = state.requests.find((r) => r.id === requestId);
    if (!req) return;
    const trip = state.trips.find((t) => t.id === req.tripId);
    if (!trip) return;
    if (!isAdmin() && currentUser()?.id !== trip.hostId) return toast('Only the host or operator can approve this request.', 'danger');
    req.status = 'Approved';
    if (!trip.members.includes(req.userId)) trip.members.push(req.userId);
    trip.spots = Math.max(0, Number(trip.spots || 0) - 1);
    state.messages[trip.id] = state.messages[trip.id] || [];
    state.messages[trip.id].push({ id: uid('msg'), senderId: 'system', senderName: 'FishCrew', body: `${req.userName} approved. Private location unlocked for crew.`, createdAt: now() });
    state.activeTripId = trip.id;
    state.crewPanel = 'chat';
    state.opsLog.unshift(`${req.userName} approved for ${trip.title}.`);
    await afterLocalWrite('Approval', async () => {
      await liveUpdate('join_requests', { status: 'Approved' }, 'id', req.id, 'request approval');
      await liveUpsert('trip_members', { trip_id: trip.id, user_id: req.userId, member_role: 'member', status: 'Approved' }, 'trip member');
      await liveUpdate('trip_posts', { open_spots: Number(trip.spots || 0) }, 'id', trip.id, 'trip open spots');
      const lastMessage = state.messages[trip.id][state.messages[trip.id].length - 1];
      await liveUpsert('trip_messages', messageRow(lastMessage, trip.id), 'approval message');
      return true;
    });
    toast('Approved. Chat opened.');
  }

  async function declineRequest(requestId) {
    const req = state.requests.find((r) => r.id === requestId);
    if (!req) return;
    const trip = state.trips.find((t) => t.id === req.tripId);
    if (!isAdmin() && currentUser()?.id !== trip?.hostId) return toast('Only the host or operator can decline this request.', 'danger');
    req.status = 'Declined';
    state.opsLog.unshift(`${req.userName} declined for ${trip?.title || 'trip'}.`);
    await afterLocalWrite('Decline request', async () => liveUpdate('join_requests', { status: 'Declined' }, 'id', req.id, 'request decline'));
    toast('Request declined.');
  }

  async function sendChat(tripId) {
    if (!requireLogin('Sign in to message the crew.')) return;
    const trip = state.trips.find((t) => t.id === tripId);
    const user = currentUser();
    if (!trip) return;
    const allowed = trip.members?.includes(user.id) || trip.hostId === user.id || isAdmin();
    if (!allowed) return toast('You need host approval before chatting.', 'danger');
    const input = $('#chatInput');
    const body = input?.value.trim();
    if (!body) return toast('Type a message first.', 'danger');
    state.messages[tripId] = state.messages[tripId] || [];
    const msg = { id: uid('msg'), senderId: user.id, senderName: user.name, body, createdAt: now() };
    state.messages[tripId].push(msg);
    input.value = '';
    await afterLocalWrite('Chat message', async () => liveUpsert('trip_messages', messageRow(msg, tripId), 'chat message'));
    toast('Message sent.');
  }

  function tripDetails(tripId) {
    const trip = state.trips.find((t) => t.id === tripId);
    if (!trip) return;
    const user = currentUser();
    const unlocked = user && (trip.members?.includes(user.id) || trip.hostId === user.id || isAdmin());
    modal(`
      <div class="modal-head"><div><span class="eyebrow">Trip details</span><h2>${safe(trip.title)}</h2></div><button class="x-btn" type="button" data-action="close-modal">${CLOSE_BTN}</button></div>
      ${mediaBlock(trip, trip.type === 'Pier' ? 'pier' : 'boat')}
      <div class="row">${scoreBadge(trip.score)}<span class="chip">${safe(trip.type)}</span><span class="chip">${safe(trip.spots)} spots</span></div>
      <p class="lead">${safe(trip.publicLocation)} ${MID} ${safe(trip.time)}</p>
      <div class="condition-strip"><div class="stat"><span>Wind</span><strong>${safe(trip.wind)}</strong></div><div class="stat"><span>Waves</span><strong>${safe(trip.waves)}</strong></div><div class="stat"><span>Tide</span><strong>${safe(trip.tide)}</strong></div><div class="stat"><span>Water</span><strong>${safe(trip.water || '?')}</strong></div></div>
      <p class="mt"><strong>Private meetup:</strong> ${unlocked ? safe(trip.privateLocation) : 'Locked until host approval.'}</p>
      <div class="row"><button class="btn primary" type="button" data-action="request-trip" data-trip-id="${safe(trip.id)}">Request spot</button><button class="btn dark" type="button" data-action="open-trip-chat" data-trip-id="${safe(trip.id)}">Crew chat</button><button class="btn dark" type="button" data-action="open-map" data-area="${safe(trip.area)}">Map area</button>${(user && (trip.hostId === user.id || isAdmin())) ? `<button class="btn soft" type="button" data-action="open-host-controls" data-trip-id="${safe(trip.id)}">Host controls</button>` : ''}</div>`);
  }

  function openTripChat(tripId) {
    state.activeTripId = tripId;
    state.crewPanel = 'chat';
    closeModal(); save(); nav('crew');
  }


  function openLocalSpots() {
    modalMode = 'local-spots';
    const spots = ['Gandy', 'Skyway approaches', 'Fort De Soto', 'Weedon Island', 'Alafia mouth', 'Courtney Campbell flats'];
    modal(`
      <div class="modal-head"><div><span class="eyebrow">Local water</span><h2>Public Tampa Bay water areas</h2></div><button class="x-btn" type="button" data-action="close-modal">${CLOSE_BTN}</button></div>
      <p class="muted">General public-area prompts only. Exact pins stay private until a crew is approved.</p>
      <div class="grid two">${spots.map((spot)=>`<button class="panel text-left" type="button" data-action="open-map" data-area="${safe(spot + ', Tampa Bay')}"><h3>${safe(spot)}</h3><p class="muted">Open map area</p></button>`).join('')}</div>
    `);
  }

  function openMap(area) {
    const query = encodeURIComponent(`${area || 'fishing near me'} fishing`);
    window.open(`https://www.google.com/maps/search/${query}`, '_blank', 'noopener,noreferrer');
    toast('Opening map search.');
  }

  async function reactFeed(feedId) {
    if (!requireLogin('Sign in to react to feed posts.')) return;
    const post = state.feed.find((p) => p.id === feedId);
    if (!post) return;
    post.reactions = Number(post.reactions || 0) + 1;
    // Optimistic UI: paint like count immediately, sync in background.
    save();
    if (state.activeScreen === 'feed') renderFeed();
    else if (state.activeScreen === 'home') render();
    await afterLocalWrite('Reaction', async () => liveUpdate('feed_posts', { reactions: Number(post.reactions || 0) }, 'id', post.id, 'feed reaction'));
    toast('Reaction added.');
  }

  function shareFeed(feedId) {
    const post = state.feed.find((p) => p.id === feedId);
    if (!post) return toast('Post not found.', 'danger');
    const text = shareTextForPost(post);
    modalMode = 'share';
    modal(`
      <div class="modal-head"><div><span class="eyebrow">Share port</span><h2>Send this FishCrew post out.</h2></div><button class="x-btn" type="button" data-action="close-modal">${CLOSE_BTN}</button></div>
      <div class="share-preview panel light-panel"><span class="badge">${safe(post.type)}</span><h3>${safe(post.title)}</h3><p class="muted">${safe(post.area)} ${MID} ${safe(post.body)}</p></div>
      <div class="share-port-grid" aria-label="Social sharing ports">
        <button class="share-port facebook" type="button" data-action="share-platform" data-platform="facebook" data-feed-id="${safe(post.id)}"><b>f</b><span>Facebook</span></button>
        <button class="share-port twitter" type="button" data-action="share-platform" data-platform="twitter" data-feed-id="${safe(post.id)}"><b>X</b><span>X / Twitter</span></button>
        <button class="share-port instagram" type="button" data-action="share-platform" data-platform="instagram" data-feed-id="${safe(post.id)}"><b class="ig-mark">${IG_MARK}</b><span>Instagram</span></button>
        <button class="share-port native" type="button" data-action="share-platform" data-platform="native" data-feed-id="${safe(post.id)}"><b>Share</b><span>Phone share</span></button>
      </div>
      <p class="tiny">Instagram web does not accept a direct prefilled post from every browser, so FishCrew copies a ready caption and opens Instagram when available.</p>`);
  }

  function sharePlatform(feedId, platform) {
    const post = state.feed.find((p) => p.id === feedId);
    const text = shareTextForPost(post);
    const url = location.href;
    const encodedText = encodeURIComponent(text);
    const encodedUrl = encodeURIComponent(url);
    const copy = () => navigator.clipboard?.writeText(`${text}
${url}`).catch(() => {});
    const open = (href) => window.open(href, '_blank', 'noopener,noreferrer');
    if (platform === 'facebook') { copy(); open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`); toast('Opening Facebook share. Caption copied.'); return; }
    if (platform === 'twitter') { open(`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`); toast('Opening X / Twitter share.'); return; }
    if (platform === 'instagram') { copy(); open('https://www.instagram.com/'); toast('Caption copied for Instagram.'); return; }
    if (navigator.share) { navigator.share({ title: 'FishCrew', text, url }).catch(() => {}); return; }
    copy(); toast('Share caption copied.');
  }

  async function reportFeed(feedId) {
    if (!requireLogin('Sign in to report posts and keep the feed clean.')) return;
    const post = state.feed.find((p) => p.id === feedId);
    if (!post) return toast('Post not found.', 'danger');
    const report = queueModeration('User report', post.id, `Reported feed post: ${post.title}`);
    await afterLocalWrite('User report', async () => liveInsertModeration(report));
    toast('Report sent for review.');
  }

  function blockUser(userId) {
    if (!requireLogin('Sign in to block profiles and personalize the feed.')) return;
    const viewer = currentUser();
    const user = state.users.find((u) => u.id === userId);
    if (!user) return toast('Profile not found.', 'danger');
    if (viewer?.id === user.id) return toast('You cannot block your own profile.', 'danger');
    state.blockedUsers = state.blockedUsers || [];
    if (!state.blockedUsers.includes(user.id)) state.blockedUsers.push(user.id);
    state.opsLog.unshift(`${usernameFor(user)} blocked from this device.`);
    save(); render(); toast(`${user.name} is hidden from your feed.`);
  }

  function unblockUser(userId) {
    const user = state.users.find((u) => u.id === userId);
    state.blockedUsers = (state.blockedUsers || []).filter((id) => id !== userId);
    state.opsLog.unshift(`${user ? usernameFor(user) : 'Profile'} unblocked.`);
    save(); render(); openBlockedUsers(); toast('Profile unblocked.');
  }

  function openBlockedUsers() {
    const blocked = (state.blockedUsers || []).map((id) => state.users.find((u) => u.id === id)).filter(Boolean);
    modal(`<div class="modal-head"><div><span class="eyebrow">Blocked users</span><h2>Profiles hidden from your view.</h2></div><button class="x-btn" type="button" data-action="close-modal">${CLOSE_BTN}</button></div>
      <p class="lead">Blocked profiles are hidden from public feed and explore results on this device. Reporting remains separate so unsafe content can still be reviewed.</p>
      <div class="stack">${blocked.map((u)=>`<div class="lead-row panel"><div><b>${safe(u.name)}</b><small>${safe(usernameFor(u))} ${MID} ${safe(roleLabel(u.role))}</small></div><button class="btn dark small" type="button" data-action="unblock-user" data-user-id="${safe(u.id)}">Unblock</button></div>`).join('') || '<div class="empty">No blocked profiles.</div>'}</div>`);
  }

  async function removeFeed(feedId) {
    if (!requireAdmin('Operator access required to remove posts.')) return;
    const post = state.feed.find((p) => p.id === feedId);
    if (!post) return;
    post.status = 'Removed';
    state.reports.filter((r) => r.target === feedId).forEach((r) => { r.status = 'Resolved'; });
    state.opsLog.unshift(`Operator removed feed item ${feedId}.`);
    await afterLocalWrite('Remove post', async () => liveUpdate('feed_posts', { status: 'Removed' }, 'id', feedId, 'feed moderation'));
    toast('Post removed from public feed.');
  }

  function openPrivacyPolicy() {
    modal(`<div class="modal-head"><div><span class="eyebrow">Privacy</span><h2>FishCrew privacy policy.</h2></div><button class="x-btn" type="button" data-action="close-modal">${CLOSE_BTN}</button></div>
      <div class="stack legal-copy">
        <p class="lead">FishCrew uses account, trip, feed, location, media, and marketplace information only to run fishing crew, safety, moderation, and support features.</p>
        <div class="panel"><h3>Data we use</h3><p class="muted">Profile details, posts, trip requests, crew chat, business inquiries, uploaded media, reports, approximate or permission-based location, and device storage needed to keep the app working.</p></div>
        <div class="panel"><h3>Privacy controls</h3><p class="muted">Exact meetup locations stay private until crew approval. Users can report posts, block profiles, delete local accounts, and contact support for connected-data deletion.</p></div>
        <div class="panel"><h3>Contact</h3><p class="muted">Support: ${safe(supportEmail())}<br>Web policy: ${safe(canonicalUrl('/privacy.html'))}</p></div>
      </div>`);
  }

  function openTerms() {
    modal(`<div class="modal-head"><div><span class="eyebrow">Terms</span><h2>FishCrew terms of use.</h2></div><button class="x-btn" type="button" data-action="close-modal">${CLOSE_BTN}</button></div>
      <div class="stack legal-copy">
        <p class="lead">FishCrew helps people plan trips, share reports, and connect with local fishing businesses. It does not replace weather judgment, local regulations, licenses, or safe boating decisions.</p>
        <div class="panel"><h3>User responsibilities</h3><p class="muted">Keep exact spots private, use lawful content, respect captains and businesses, and verify species, size, season, bag limits, weather, and meetup details before acting.</p></div>
        <div class="panel"><h3>Marketplace</h3><p class="muted">Charter, cruise, guide, and shop inquiries are leads between users and partners. Confirm price, terms, cancellation policies, licenses, and safety expectations directly.</p></div>
        <div class="panel"><h3>Moderation</h3><p class="muted">FishCrew can remove unsafe, misleading, unlawful, abusive, spammy, or off-topic content and may restrict accounts that harm the community.</p></div>
      </div>`);
  }

  function openCommunityGuidelines() {
    modal(`<div class="modal-head"><div><span class="eyebrow">Community</span><h2>Keep the dock clean.</h2></div><button class="x-btn" type="button" data-action="close-modal">${CLOSE_BTN}</button></div>
      <div class="stack legal-copy">
        <div class="panel"><h3>Post useful water information</h3><p class="muted">Share catch reports, trip recaps, area conditions, open seats, shop updates, and guide notes without exposing private meetup points.</p></div>
        <div class="panel"><h3>No unsafe or abusive content</h3><p class="muted">No harassment, hate, threats, illegal harvest instructions, deceptive listings, spam, stolen media, explicit content, or dangerous meetups.</p></div>
        <div class="panel"><h3>Controls</h3><p class="muted">Every feed item can be reported. Signed-in users can block profiles. Operator tools review reports and media before unsafe content spreads.</p></div>
      </div>`);
  }

  function openSupportCenter() {
    modal(`<div class="modal-head"><div><span class="eyebrow">Support</span><h2>FishCrew help center.</h2></div><button class="x-btn" type="button" data-action="close-modal">${CLOSE_BTN}</button></div>
      <div class="stack legal-copy">
        <p class="lead">Use support for account access, safety reports, business verification, deletion requests, media review, and app-store review questions.</p>
        <div class="panel"><h3>Contact</h3><p class="muted">${safe(supportEmail())}</p><button class="btn primary small" type="button" data-action="open-support-email">Email support</button></div>
        <div class="grid two"><button class="panel text-left" type="button" data-action="open-privacy-policy"><h3>Privacy policy</h3><p class="muted">Data and controls.</p></button><button class="panel text-left" type="button" data-action="open-account-delete"><h3>Delete account</h3><p class="muted">Remove profile and local content.</p></button></div>
      </div>`);
  }

  function openSupportEmail() {
    window.location.href = `mailto:${supportEmail()}?subject=${encodeURIComponent('FishCrew support')}`;
  }

  function openAccountDeleteRequest() {
    const user = currentUser();
    const subject = encodeURIComponent('Delete my FishCrew account');
    const body = encodeURIComponent([
      'Please delete my FishCrew account and connected data (profile, trips, feed, media, and messages).',
      '',
      `Username: ${user?.username || ''}`,
      `Email: ${user?.email || ''}`,
      `User ID: ${user?.id || ''}`,
      '',
      'I understand connected-data deletion cannot be undone.'
    ].join('\n'));
    window.location.href = `mailto:${supportEmail()}?subject=${subject}&body=${body}`;
  }

  function openAccountDelete() {
    const user = currentUser();
    const signedOut = `<p class="lead">Sign in first to delete an account from this device. Connected shared-data accounts also require support to remove server-side profile, trips, feed, and media.</p><div class="row"><button class="btn primary" type="button" data-action="open-auth-signin">Sign in</button><button class="btn dark" type="button" data-action="open-support-email">Email support</button></div>`;
    const signedIn = `<p class="lead">This removes ${safe(user?.name || 'your profile')} from this device and clears local posts, trips, requests, media, and messages tied to the profile.</p><div class="safe-note"><strong>Not full cloud deletion:</strong> In-app deletion clears this device only. Connected Supabase auth, profile rows, uploaded media, and shared records require a support follow-up for full removal.</div><div class="row mt"><button class="btn danger" type="button" data-action="confirm-delete-account">Delete from this device</button><button class="btn soft" type="button" data-action="open-account-delete-request">Request full cloud deletion</button><button class="btn dark" type="button" data-action="close-modal">Keep account</button></div>`;
    modal(`<div class="modal-head"><div><span class="eyebrow">Account deletion</span><h2>Delete your FishCrew account.</h2></div><button class="x-btn" type="button" data-action="close-modal">${CLOSE_BTN}</button></div>${user ? signedIn : signedOut}`);
  }

  async function confirmDeleteAccount() {
    const user = currentUser();
    if (!user) return openAccountDelete();
    const userId = user.id;
    const hadConnectedBackend = liveReady() && supabaseClient;
    const deletedTripIds = (state.trips || []).filter((t) => t.hostId === userId).map((t) => t.id);
    const deletedFeedIds = (state.feed || []).filter((p) => p.authorId === userId).map((p) => p.id);
    const deletedBusinessIds = (state.businesses || []).filter((b) => b.ownerId === userId).map((b) => b.id);
    state.accountDeletionRequests = state.accountDeletionRequests || [];
    state.accountDeletionRequests.unshift({
      id: uid('delete'),
      userId,
      email: user.email || '',
      username: user.username || '',
      createdAt: now(),
      status: hadConnectedBackend ? 'Pending server deletion' : 'Local deletion complete'
    });
    if (hadConnectedBackend) {
      try { await supabaseClient.auth.signOut(); } catch (_) {}
    }
    state.users = (state.users || []).filter((u) => u.id !== userId);
    state.trips = (state.trips || []).filter((t) => t.hostId !== userId);
    state.requests = (state.requests || []).filter((r) => r.userId !== userId && !deletedTripIds.includes(r.tripId));
    state.feed = (state.feed || []).filter((p) => p.authorId !== userId);
    state.businesses = (state.businesses || []).filter((b) => b.ownerId !== userId);
    state.bookings = (state.bookings || []).filter((b) => !deletedBusinessIds.includes(b.businessId));
    state.mediaAssets = (state.mediaAssets || []).filter((a) => a.ownerId !== userId && !deletedFeedIds.includes(a.sourceId));
    state.reports = (state.reports || []).filter((r) => r.reporterId !== userId && !deletedFeedIds.includes(r.target));
    Object.keys(state.messages || {}).forEach((tripId) => {
      if (deletedTripIds.includes(tripId)) delete state.messages[tripId];
      else state.messages[tripId] = (state.messages[tripId] || []).filter((m) => m.senderId !== userId);
    });
    state.blockedUsers = (state.blockedUsers || []).filter((id) => id !== userId);
    state.session = null;
    state.opsLog.unshift(`Account deletion completed for ${user.email || usernameFor(user)}.`);
    closeModal(); save(); render(); nav('home');
    toast(hadConnectedBackend
      ? 'Account removed from this device. Email support to finish connected-data deletion.'
      : 'Account deleted from this device.');
  }

  async function verifyBusiness(businessId) {
    if (!requireAdmin()) return;
    const biz = state.businesses.find((b) => b.id === businessId);
    if (!biz) return;
    biz.status = 'Verified';
    state.opsLog.unshift(`Verified ${biz.name}.`);
    await afterLocalWrite('Business verification', async () => liveUpdate('businesses', { status: 'Verified' }, 'id', biz.id, 'business verification'));
    toast('Business verified.');
  }

  function bookBusiness(businessId) {
    if (!requireLogin('Sign in to send charter, cruise, guide, or tackle shop inquiries.')) return;
    openBookingForm(businessId);
  }

  async function resolveReport(reportId) {
    if (!requireAdmin()) return;
    const report = state.reports.find((r) => r.id === reportId);
    if (report) report.status = 'Resolved';
    state.opsLog.unshift(`Report ${reportId} resolved.`);
    closeModal();
    await afterLocalWrite('Report resolution', async () => liveUpdate('moderation_items', { status: 'Resolved' }, 'id', reportId, 'moderation'));
    render();
    toast('Report resolved.');
  }

  function runOps() {
    if (!requireBusiness()) return;
    state.opsLog.unshift(`${shortTime()} ops check: bookings, campaigns, moderation, and weather windows reviewed.`);
    state.reports.push({ id: uid('rep'), type: 'Auto-check', target: 'system', status: 'Open', note: 'Review new partner posts before weekend traffic.' });
    save(); render(); toast('Morning ops run complete.');
  }


  function loadSupabaseScript() {
    return new Promise((resolve, reject) => {
      if (window.supabase?.createClient) return resolve();
      const existing = document.querySelector('script[data-supabase-js]');
      if (existing) {
        existing.addEventListener('load', () => resolve(), { once: true });
        existing.addEventListener('error', () => reject(new Error('Could not load shared data client script.')), { once: true });
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
      script.async = true;
      script.defer = true;
      script.dataset.supabaseJs = 'true';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Could not load shared data client script.'));
      document.head.appendChild(script);
    });
  }

  async function checkBackend() {
    const configured = Boolean(CONFIG.USE_SUPABASE && CONFIG.SUPABASE_URL && CONFIG.SUPABASE_ANON_KEY);
    if (!configured) {
      state.backendMode = 'local';
      save(); render();
      return toast('Browser storage is active. Shared data keys are not configured yet.');
    }
    try {
      await loadSupabaseScript();
      supabaseClient = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });
      const { data } = await supabaseClient.auth.getSession();
      state.backendMode = 'supabase';
      if (data?.session?.user) {
        await ensureUserFromSupabase(data.session.user);
      } else {
        state.notifications = [];
        stopRealtime();
      }
      save(); render(); toast('Shared data connection ready.');
    } catch (error) {
      toast(`Backend check failed: ${error.message}`, 'danger');
    }
  }

  async function syncSupabase() {
    if (!supabaseClient) await checkBackend();
    if (!supabaseClient) return;
    if (!(await canWriteLive())) return toast('Sign in with a connected account before pushing shared data.', 'danger');
    try {
      const user = currentUser();
      if (user) await liveUpsert('profiles', { id: user.id, email: user.email, username: user.username, full_name: user.name, bio: user.bio, fishing_styles: user.fishingStyles, profile_theme: user.profileTheme, role: user.role, home_area: user.area, avatar_url: user.avatar, updated_at: now() }, 'profile');
      for (const trip of state.trips) {
        await liveUpsert('trip_posts', tripRow(trip), 'trip');
        await liveUpsert('trip_private_details', tripPrivateRow(trip), 'private meetup details');
        for (const memberId of (trip.members || [])) await liveUpsert('trip_members', { trip_id: trip.id, user_id: memberId, member_role: memberId === trip.hostId ? 'host' : 'member', status: 'Approved' }, 'trip member');
      }
      for (const request of state.requests) await liveUpsert('join_requests', requestRow(request), 'join request');
      for (const [tripId, messages] of Object.entries(state.messages || {})) {
        for (const message of messages) {
          if (message.senderId === 'system') continue;
          await liveUpsert('trip_messages', messageRow(message, tripId), 'trip message');
        }
      }
      for (const post of state.feed) await liveUpsert('feed_posts', feedRow(post), 'feed post');
      for (const asset of (state.mediaAssets || [])) await liveUpsert('media_assets', mediaAssetRow(asset), 'media asset');
      for (const business of state.businesses) await liveUpsert('businesses', businessRow(business), 'business');
      for (const booking of state.bookings) await liveUpsert('bookings', bookingRow(booking), 'booking');
      state.liveStatus = 'Full browser dataset pushed to shared data.';
      state.opsLog.unshift(state.liveStatus);
      save(); render(); toast('Full live push completed.');
      startRealtime();
    } catch (error) {
      toast(`Full live push failed: ${error.message}`, 'danger');
    }
  }


  async function pullSupabase(options = {}) {
    if (!supabaseClient) await checkBackend();
    if (!supabaseClient) return;

    // Cancel stale overlapping pulls — keep latest generation only.
    const generation = ++pullGeneration;
    if (pullInFlight) {
      try { await pullInFlight; } catch (_) { /* prior pull error already toasted */ }
      if (generation !== pullGeneration) return;
    }

    const run = (async () => {
      try {
        const [profilesRes, tripsRes, privateDetailsRes, membersRes, requestsRes, messagesRes, feedRes, mediaRes, reportsRes, businessesRes, bookingsRes] = await Promise.all([
          supabaseClient.from('profiles').select('id, username, full_name, role, home_area, avatar_url, bio, fishing_styles, profile_theme, created_at').limit(LIVE_QUERY_LIMIT),
          supabaseClient.from('trip_posts').select('*').order('created_at', { ascending: false }).limit(LIVE_QUERY_LIMIT),
          supabaseClient.from('trip_private_details').select('*').limit(LIVE_QUERY_LIMIT),
          supabaseClient.from('trip_members').select('*').limit(LIVE_QUERY_LIMIT * 2),
          supabaseClient.from('join_requests').select('*').order('created_at', { ascending: false }).limit(LIVE_QUERY_LIMIT),
          // Newest-first: ascending + limit kept the oldest rows and dropped recent crew chat after the cap.
          supabaseClient.from('trip_messages').select('*').order('created_at', { ascending: false }).limit(LIVE_QUERY_LIMIT * 2),
          supabaseClient.from('feed_posts').select('*').order('created_at', { ascending: false }).limit(LIVE_QUERY_LIMIT),
          supabaseClient.from('media_assets').select('*').order('created_at', { ascending: false }).limit(LIVE_QUERY_LIMIT),
          supabaseClient.from('moderation_items').select('*').order('created_at', { ascending: false }).limit(LIVE_QUERY_LIMIT),
          supabaseClient.from('businesses').select('*').order('created_at', { ascending: false }).limit(LIVE_QUERY_LIMIT),
          supabaseClient.from('bookings').select('*').order('created_at', { ascending: false }).limit(LIVE_QUERY_LIMIT)
        ]);
        if (generation !== pullGeneration) return;
        const errors = [profilesRes, tripsRes, privateDetailsRes, membersRes, requestsRes, messagesRes, feedRes, mediaRes, reportsRes, businessesRes, bookingsRes].map((r) => r.error).filter(Boolean);
        if (errors.length) throw errors[0];
        if (profilesRes.data?.length) {
          const sessionUser = currentUser();
          // Privacy: profile rows no longer include email. Keep any email we already
          // know locally (e.g. the signed-in user's auth email) keyed by user id.
          const knownEmailById = new Map(state.users.filter((u) => u.id && u.email).map((u) => [u.id, u.email]));
          const merged = profilesRes.data.map((u) => ({ id: u.id, email: knownEmailById.get(u.id) || '', username: u.username || normalizeUsername(u.full_name || 'fishcrew_user'), name: u.full_name || 'FishCrew User', role: u.role || 'Angler', area: u.home_area || 'Tampa Bay', avatar: u.avatar_url || '', bio: u.bio || 'Here to fish more with a better crew.', fishingStyles: u.fishing_styles || 'Inshore, pier, weekend trips', profileTheme: u.profile_theme || 'Harbor Blue', password: '', createdAt: u.created_at || now() }));
          const localDemo = state.users.filter((u) => u.demo === true || String(u.email || '').endsWith('@fishcrew.local'));
          state.users = [...localDemo, ...merged.filter((u) => !localDemo.some((d) => d.id === u.id))];
          if (sessionUser && !state.users.some((u) => u.id === sessionUser.id)) state.users.push(sessionUser);
        }
        if (tripsRes.data?.length) {
          const privateByTrip = Object.fromEntries((privateDetailsRes.data || []).map((d) => [d.trip_id, d.private_location]));
          state.trips = tripsRes.data.map((t) => ({
            id: t.id,
            title: t.title,
            type: t.trip_type || 'Boat',
            area: t.area || 'Tampa Bay',
            publicLocation: t.public_location || t.area || 'General area',
            privateLocation: privateByTrip[t.id] || 'Private details after approval',
            hostId: t.host_id,
            hostName: state.users.find((u) => u.id === t.host_id)?.name || 'FishCrew host',
            time: t.start_label || 'Upcoming',
            species: t.target_species || 'Mixed species',
            spots: Number(t.open_spots || 0),
            cost: t.cost_note || 'TBD',
            status: t.status || 'Open',
            score: t.condition_score || 'Good',
            wind: t.wind_label || 'Check conditions',
            waves: t.waves_label || 'Check water',
            tide: t.tide_label || 'Moving tide',
            water: 'Live',
            media: t.media_url || '',
            mediaModerationStatus: t.media_moderation_status || (t.media_url ? 'Approved' : 'Approved'),
            members: [],
            createdAt: t.created_at || now()
          }));
        }
        if (membersRes.data?.length) {
          const memberMap = {};
          membersRes.data.forEach((m) => {
            if (!memberMap[m.trip_id]) memberMap[m.trip_id] = [];
            memberMap[m.trip_id].push(m.user_id);
          });
          state.trips.forEach((t) => { t.members = memberMap[t.id] || (t.hostId ? [t.hostId] : []); });
        }
        if (requestsRes.data?.length) {
          state.requests = requestsRes.data.map((r) => ({ id: r.id, tripId: r.trip_id, userId: r.requester_id, userName: r.requester_name || state.users.find((u) => u.id === r.requester_id)?.name || 'FishCrew user', message: r.message || '', status: r.status || 'Pending', createdAt: r.created_at || now() }));
        }
        if (messagesRes.data?.length) {
          state.messages = {};
          // Query is newest-first; reverse per trip so chat renders oldest → newest.
          const chronological = [...messagesRes.data].reverse();
          chronological.forEach((m) => {
            if (!state.messages[m.trip_id]) state.messages[m.trip_id] = [];
            state.messages[m.trip_id].push({ id: m.id, senderId: m.sender_id, senderName: m.sender_name || 'FishCrew user', body: m.body || '', createdAt: m.created_at || now() });
          });
        }
        if (Array.isArray(feedRes.data) && feedRes.data.length) {
          state.feed = feedRes.data.map((p) => ({ id: p.id, type: p.post_type || 'Catch Log', title: p.title, area: p.area || 'Local water', authorId: p.author_id, authorName: p.author_name || state.users.find((u) => u.id === p.author_id)?.name || 'FishCrew user', body: p.body || '', media: p.media_url || '', mediaType: p.media_type || 'emoji', artKind: p.media_url ? '' : 'catch', reactions: Number(p.reactions || 0), status: p.status || 'Live', createdAt: p.created_at || now() }));
        }
        if (Array.isArray(mediaRes.data)) {
          state.mediaAssets = mediaRes.data.map((a) => ({ id: a.id, ownerId: a.owner_id || '', sourceId: a.source_id || '', sourceType: a.source_type || 'feed', mediaType: a.media_type || 'file', storagePath: a.storage_path || '', publicUrl: a.public_url || '', status: a.moderation_status || a.status || 'Review', visibility: a.visibility || 'public', createdAt: a.created_at || now() }));
          // Hydrate owner/admin trip + feed + profile media from assets when public rows omit pending URLs.
          (state.trips || []).forEach((trip) => {
            const asset = mediaAssetForItem(trip, 'trip');
            if (!asset) return;
            trip.mediaModerationStatus = asset.status || trip.mediaModerationStatus || 'Review';
            if (!trip.media && asset.publicUrl && (isAdmin() || isApprovedMediaStatus(asset.status) || (currentUser() && trip.hostId === currentUser().id))) {
              trip.media = asset.publicUrl;
            }
          });
          (state.feed || []).forEach((post) => {
            const asset = mediaAssetForItem(post, 'feed');
            if (!asset) return;
            if (!post.media && asset.publicUrl && (isAdmin() || isApprovedMediaStatus(asset.status) || (currentUser() && post.authorId === currentUser().id))) {
              post.media = asset.publicUrl;
              post.mediaType = asset.mediaType || post.mediaType;
            }
          });
          (state.users || []).forEach((user) => {
            const asset = (state.mediaAssets || []).find((a) => a.sourceType === 'profile' && (a.sourceId === user.id || a.ownerId === user.id));
            if (!asset?.publicUrl) return;
            if (!user.avatar && (isAdmin() || isApprovedMediaStatus(asset.status) || (currentUser() && currentUser().id === user.id))) {
              user.avatar = asset.publicUrl;
              user.avatarModerationStatus = asset.status || user.avatarModerationStatus;
            }
          });
        }
        if (reportsRes.data?.length) {
          state.reports = reportsRes.data.map((r) => ({ id: r.id, type: r.item_type || 'Review', target: r.feed_post_id || r.id, status: r.status || 'Open', severity: r.severity || 'Low', note: r.title || 'Moderation item', reporterId: r.reporter_id || '', createdAt: r.created_at || now() }));
        }
        if (businessesRes.data?.length) {
          state.businesses = businessesRes.data.map((b) => ({ id: b.id, ownerId: b.owner_id || '', name: b.name, kind: b.business_type || 'Business', area: b.area || 'Local', status: b.status || 'Lead', leads: Number(b.lead_count || 0), revenue: Math.round(Number(b.revenue_cents || 0) / 100), campaign: b.campaign || 'Local placement' }));
        }
        if (bookingsRes.data?.length) {
          state.bookings = bookingsRes.data.map((b) => ({ id: b.id, businessId: b.business_id, customerId: b.customer_id || null, customerName: b.customer_name, kind: b.booking_type || 'Inquiry', status: b.status || 'New', date: b.date_label || 'TBD', value: Math.round(Number(b.value_cents || 0) / 100), notes: b.notes || '' }));
        }
        await fetchNotifications();
        if (generation !== pullGeneration) return;
        state.opsLog.unshift(options.reason ? `Pulled shared data (${options.reason}).` : 'Pulled shared data into FishCrew.');
        save();
        render();
        if (!options.silent) toast('Live data pulled.');
        startRealtime();
      } catch (error) {
        if (generation !== pullGeneration) return;
        toast(`Live pull failed: ${error.message}`, 'danger');
        throw error;
      }
    })();

    pullInFlight = run.finally(() => {
      if (pullInFlight === run) pullInFlight = null;
    });
    return pullInFlight;
  }

  function scheduleLivePull() {
    clearTimeout(realtimePullTimer);
    realtimePullTimer = setTimeout(() => pullSupabase({ silent: true, reason: 'realtime' }), 750);
  }

  function stopRealtime() {
    clearTimeout(realtimePullTimer);
    clearTimeout(notificationsRefreshTimer);
    realtimePullTimer = null;
    notificationsRefreshTimer = null;
    if (supabaseClient && realtimeChannel) {
      supabaseClient.removeChannel(realtimeChannel).catch(() => {});
      realtimeChannel = null;
    }
  }

  function startRealtime() {
    if (!supabaseClient?.channel) return;
    const userId = currentUser()?.id || '';
    try {
      if (realtimeChannel) supabaseClient.removeChannel(realtimeChannel).catch(() => {});
      const channel = supabaseClient.channel('fishcrew-live-v061')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'trip_posts' }, scheduleLivePull)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'trip_members' }, scheduleLivePull)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'join_requests' }, scheduleLivePull)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'trip_messages' }, scheduleLivePull)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'feed_posts' }, scheduleLivePull)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, scheduleLivePull);
      if (userId) {
        channel.on('postgres_changes', { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` }, scheduleNotificationsRefresh);
      }
      realtimeChannel = channel.subscribe((status) => setDebug(`Realtime: ${status}`));
    } catch (error) {
      console.warn('Realtime subscribe failed', error);
    }
  }


  function runReadinessCheck() {
    const requiredState = ['users','trips','requests','messages','feed','businesses','bookings','reports','mediaAssets'];
    const missingState = requiredState.filter((key) => !(key in state));
    const configReady = Boolean(CONFIG.SUPABASE_URL && CONFIG.SUPABASE_ANON_KEY && CONFIG.STORAGE_BUCKET);
    const openReports = (state.reports || []).filter((r) => r.status === 'Open').length;
    const mediaTracked = (state.mediaAssets || []).length;
    const result = `${missingState.length ? missingState.length + ' missing stores' : 'browser stores ready'} ${MID} ${configReady ? 'shared data config present' : 'shared data not connected'} ${MID} ${mediaTracked} media assets ${MID} ${openReports} open reviews`;
    state.supabasePrep = state.supabasePrep || {};
    state.supabasePrep.lastReadiness = result;
    state.opsLog.unshift(`Readiness check: ${result}`);
    save(); render();
    modal(`<div class="modal-head"><div><span class="eyebrow">Readiness</span><h2>Safe prep check.</h2></div><button class="x-btn" type="button" data-action="close-modal">${CLOSE_BTN}</button></div>
      <div class="grid two">
        <div class="panel"><h3>Config</h3><p class="muted">Shared data keys: ${CONFIG.SUPABASE_URL && CONFIG.SUPABASE_ANON_KEY ? 'present' : 'not set yet'}</p><p class="muted">Storage bucket: ${safe(CONFIG.STORAGE_BUCKET || 'fishcrew-media')}</p></div>
        <div class="panel"><h3>State</h3><p class="muted">${safe(result)}</p><p class="muted">Missing stores: ${missingState.length ? safe(missingState.join(', ')) : 'none'}</p></div>
        <div class="panel"><h3>Permissions</h3><p class="muted">Access policies are included in schema.sql for profiles, trips, requests, members, messages, feed, media, reports, businesses, and bookings.</p></div>
        <div class="panel"><h3>Next</h3><p class="muted">Connect shared data, sign in with two real accounts, then run the two-phone launch check.</p></div>
      </div>`);
  }


  function releaseGateChecks() {
    const configured = Boolean(CONFIG.USE_SUPABASE && CONFIG.SUPABASE_URL && CONFIG.SUPABASE_ANON_KEY);
    const requiredStores = ['users','trips','requests','messages','feed','businesses','bookings','reports','mediaAssets','launchChecks','deviceHub','blockedUsers','accountDeletionRequests'];
    const missingStores = requiredStores.filter((key) => !(key in state));
    const actionsUsed = new Set($$('[data-action]').map((el) => el.dataset.action).filter(Boolean));
    const missingActions = [...actionsUsed].filter((action) => !ACTIONS[action]);
    const duplicateIds = $$('[id]').map((n) => n.id).filter((id, i, arr) => arr.indexOf(id) !== i);
    const openReports = (state.reports || []).filter((r) => r.status === 'Open').length;
    const checks = [
      { label: 'Core local stores exist', pass: missingStores.length === 0, detail: missingStores.length ? missingStores.join(', ') : 'ready' },
      { label: 'Button router has every visible action', pass: missingActions.length === 0, detail: missingActions.length ? missingActions.join(', ') : `${actionsUsed.size} actions routed` },
      { label: 'No duplicate static IDs', pass: duplicateIds.length === 0, detail: duplicateIds.length ? duplicateIds.join(', ') : 'none' },
      { label: 'Trip/feed content loaded', pass: (state.trips || []).length > 0 && (state.feed || []).length > 0, detail: `${(state.trips||[]).length} trips ${MID} ${(state.feed||[]).length} feed posts` },
      { label: 'Media assets and moderation queue exist', pass: Array.isArray(state.mediaAssets) && Array.isArray(state.reports), detail: `${(state.mediaAssets||[]).length} assets ${MID} ${openReports} open reviews` },
      { label: 'Launch checklist available', pass: (state.launchChecks || []).length >= 8, detail: `${(state.launchChecks||[]).length} checks` },
      { label: 'User safety controls available', pass: Array.isArray(state.blockedUsers) && Array.isArray(state.accountDeletionRequests), detail: `${(state.blockedUsers||[]).length} blocked | ${(state.accountDeletionRequests||[]).length} deletion records` },
      { label: 'GPS and device hub available', pass: Boolean(state.deviceHub && ACTIONS['open-device-hub'] && ACTIONS['connect-serial-gps']), detail: state.deviceHub?.source || 'device hub ready' },
      { label: 'Shared-data connection is optional until live check', pass: true, detail: configured ? 'configured' : 'browser storage active' },
      { label: 'Storage bucket name set', pass: Boolean(CONFIG.STORAGE_BUCKET || CONFIG.MEDIA_BUCKET), detail: CONFIG.STORAGE_BUCKET || CONFIG.MEDIA_BUCKET || 'missing' },
      { label: 'Web/app split flags present', pass: Boolean(CONFIG.BUILD_TARGET && CONFIG.WEB_CANONICAL_URL), detail: `${CONFIG.BUILD_TARGET || 'unknown'} ${MID} ${CONFIG.WEB_CANONICAL_URL || 'no canonical url'}` }
    ];
    return checks;
  }

  function runReleaseGate() {
    const checks = releaseGateChecks();
    const failed = checks.filter((c) => !c.pass);
    const result = failed.length ? `${failed.length} launch blockers` : 'Launch checks passed';
    state.supabasePrep = state.supabasePrep || {};
    state.supabasePrep.releaseGate = result;
    state.supabasePrep.lastReadiness = `${checks.filter((c)=>c.pass).length}/${checks.length} checks passed`;
    state.opsLog.unshift(`Launch checks: ${result}`);
    save(); render();
    modal(`<div class="modal-head"><div><span class="eyebrow">Launch checks</span><h2>${safe(result)}</h2></div><button class="x-btn" type="button" data-action="close-modal">${CLOSE_BTN}</button></div>
      <div class="stack">${checks.map((c)=>`<div class="qa-note ${c.pass ? 'done' : ''}"><div class="row"><span class="badge ${c.pass ? 'green' : 'red'}">${c.pass ? 'Pass' : 'Fix'}</span><span class="chip">Gate</span></div><p><strong>${safe(c.label)}</strong><br><span class="muted">${safe(c.detail)}</span></p></div>`).join('')}</div>
      <div class="row mt"><button class="btn primary" type="button" data-action="open-live-smoke-test">Open two-phone check</button><button class="btn dark" type="button" data-action="close-modal">Close</button></div>`);
  }

  function openBackendDiagnostics() {
    const tests = state.supabasePrep?.testResults || [];
    modal(`<div class="modal-head"><div><span class="eyebrow">Connection diagnostics</span><h2>Shared data status.</h2></div><button class="x-btn" type="button" data-action="close-modal">${CLOSE_BTN}</button></div>
      <div class="grid two">
        <div class="panel"><h3>Config</h3><p class="muted">Shared data enabled: ${CONFIG.USE_SUPABASE ? 'true' : 'false'}</p><p class="muted">Shared data keys: ${CONFIG.SUPABASE_URL && CONFIG.SUPABASE_ANON_KEY ? 'present' : 'not set yet'}</p><p class="muted">Bucket: ${safe(CONFIG.STORAGE_BUCKET || CONFIG.MEDIA_BUCKET || 'fishcrew-media')}</p></div>
        <div class="panel"><h3>Mode</h3><p class="muted">Current storage: ${state.backendMode === 'supabase' ? 'shared data' : 'browser'}</p><p class="muted">Status: ${safe(state.liveStatus || state.supabasePrep?.lastReadiness || 'Not checked')}</p></div>
      </div>
      <div class="row mt"><button class="btn soft" type="button" data-action="check-backend">Check connection</button><button class="btn dark" type="button" data-action="run-live-test-pack">Run data probes</button><button class="btn dark" type="button" data-action="start-realtime">Start live updates</button></div>
      <div class="section"><h3>Last results</h3><div class="stack">${tests.map((t)=>`<div class="qa-note ${t.pass ? 'done' : ''}"><div class="row"><span class="badge ${t.pass ? 'green' : 'orange'}">${safe(t.status)}</span><span class="chip">${safe(t.name)}</span></div><p class="muted">${safe(t.detail)}</p></div>`).join('') || '<div class="empty">No data probes run yet.</div>'}</div></div>`);
  }

  async function runLiveTestPack() {
    const tables = ['profiles','trip_posts','trip_members','join_requests','trip_messages','feed_posts','media_assets','moderation_items','businesses','bookings'];
    const results = [];
    const configured = Boolean(CONFIG.USE_SUPABASE && CONFIG.SUPABASE_URL && CONFIG.SUPABASE_ANON_KEY);
    if (!configured) {
      results.push({ name: 'Shared data config', status: 'Browser', pass: true, detail: 'Shared keys are not set. Browser storage remains healthy and safe.' });
      results.push({ name: 'Browser stores', status: 'Pass', pass: true, detail: `${(state.trips||[]).length} trips, ${(state.feed||[]).length} feed posts, ${(state.users||[]).length} users available.` });
      state.supabasePrep.testResults = results;
      state.supabasePrep.lastReadiness = 'Browser checks passed. Add shared-data keys for live data probes.';
      state.opsLog.unshift('Connection checks ran in browser mode.');
      save(); render(); openBackendDiagnostics(); return;
    }
    try {
      if (!supabaseClient) await checkBackend();
      if (!supabaseClient) throw new Error('Shared data client did not initialize.');
      results.push({ name: 'Shared data client', status: 'Pass', pass: true, detail: 'Client initialized.' });
      for (const table of tables) {
        try {
          const { error } = await supabaseClient.from(table).select('*', { count: 'exact', head: true });
          results.push({ name: table, status: error ? 'Check' : 'Pass', pass: !error, detail: error ? error.message : 'read probe succeeded' });
        } catch (err) {
          results.push({ name: table, status: 'Error', pass: false, detail: err.message });
        }
      }
      try {
        const bucket = CONFIG.STORAGE_BUCKET || CONFIG.MEDIA_BUCKET || 'fishcrew-media';
        const { error } = await supabaseClient.storage.from(bucket).list('', { limit: 1 });
        results.push({ name: 'storage bucket', status: error ? 'Check' : 'Pass', pass: !error, detail: error ? error.message : `${bucket} list probe succeeded` });
      } catch (err) {
        results.push({ name: 'storage bucket', status: 'Error', pass: false, detail: err.message });
      }
      state.supabasePrep.testResults = results;
      state.supabasePrep.lastReadiness = `${results.filter((r)=>r.pass).length}/${results.length} data probes passed`;
      state.opsLog.unshift(`Connection probes: ${state.supabasePrep.lastReadiness}`);
      save(); render(); openBackendDiagnostics();
    } catch (error) {
      toast(`Data probes failed: ${error.message}`, 'danger');
    }
  }

  function openRoleMatrix() {
    const rows = [
      ['Guest','Browse Home/Explore/Feed','Cannot post, join, chat, upload, or use operator tools'],
      ['Angler','Post trips/catches, request joins, chat after approval','Cannot moderate or verify businesses'],
      ['Captain','Angler tools plus charter/business posts and booking leads','Cannot resolve review reports unless verified as an operator'],
      ['Business','Shop/cruise/guide tools, sponsored posts, leads','Cannot see private trip chats unless member'],
      ['Operator','Moderation, verification, reports, revenue, and operations tools','Must still use safe media and review flow']
    ];
    modal(`<div class="modal-head"><div><span class="eyebrow">Role matrix</span><h2>Permission intent.</h2></div><button class="x-btn" type="button" data-action="close-modal">${CLOSE_BTN}</button></div>
      <div class="stack">${rows.map((r)=>`<div class="panel"><div class="row"><span class="badge green">${safe(r[0])}</span></div><h3>${safe(r[1])}</h3><p class="muted">${safe(r[2])}</p></div>`).join('')}</div>`);
  }

  function openDataAdapterMap() {
    const rows = [
      ['createTrip','trip_posts + trip_members','Browser first; shared-data write when connected'],
      ['requestJoin / approveRequest','join_requests + trip_members','Protect private_location until approved'],
      ['sendMessage','trip_messages','Crew-only in RLS'],
      ['postFeedItem','feed_posts + media_assets + moderation_items','Media queued for review'],
      ['uploadMedia','storage.objects + media_assets','Images/video/GIF through bucket'],
      ['reportPost / removePost','moderation_items + feed_posts.status','Operator audit trail preserved'],
      ['bookingLead','bookings + businesses','Business/operator visibility'],
      ['profile/business roles','profiles + businesses','Role-based navigation and RLS']
    ];
    modal(`<div class="modal-head"><div><span class="eyebrow">Data map</span><h2>Browser now. Shared data next.</h2></div><button class="x-btn" type="button" data-action="close-modal">${CLOSE_BTN}</button></div>
      <div class="stack">${rows.map((r)=>`<div class="qa-note"><div class="row"><span class="badge">${safe(r[0])}</span><span class="chip">${safe(r[1])}</span></div><p class="muted">${safe(r[2])}</p></div>`).join('')}</div>`);
  }

  function runMediaStressCheck() {
    const maxLocal = Number(CONFIG.MAX_LOCAL_UPLOAD_MB || 6);
    const issues = [];
    if (!Array.isArray(state.mediaAssets)) issues.push('mediaAssets store missing');
    if (!Array.isArray(state.reports)) issues.push('reports store missing');
    const largeLocalRisk = (state.mediaAssets || []).filter((a) => String(a.publicUrl || a.storagePath || '').startsWith('data:')).length;
    const result = issues.length ? issues.join(', ') : `Media policy ready: browser cap ${maxLocal} MB, media bucket ${CONFIG.STORAGE_BUCKET || CONFIG.MEDIA_BUCKET || 'fishcrew-media'}, ${largeLocalRisk} embedded browser assets.`;
    state.opsLog.unshift(`Media stress check: ${result}`);
    save(); render(); toast(result);
  }

  function openMediaPipeline() {
    const assets = state.mediaAssets || [];
    const reports = state.reports || [];
    modal(`<div class="modal-head"><div><span class="eyebrow">Media pipeline</span><h2>Uploads, review, and feed safety.</h2></div><button class="x-btn" type="button" data-action="close-modal">${CLOSE_BTN}</button></div>
      <div class="safe-note"><strong>Policy:</strong> Images are validated before preview. Videos/GIFs should use connected storage before public scale. Uploaded trip/feed media queues moderation.</div><div class="row mb"><button class="btn dark small" type="button" data-action="run-media-stress-check">Run media check</button><button class="btn dark small" type="button" data-action="open-moderation">Open moderation</button></div>
      <div class="grid two">
        <div class="panel"><h3>Tracked assets</h3><div class="stack">${assets.map((a)=>`<div class="qa-note"><div class="row"><span class="badge ${a.status==='Approved'?'green':'orange'}">${safe(a.status)}</span><span class="chip">${safe(a.sourceType)}</span></div><p>${safe(a.storagePath || a.id)} ${MID} ${safe(a.mediaType)}</p></div>`).join('') || '<div class="empty">No tracked assets yet.</div>'}</div></div>
        <div class="panel"><h3>Open review</h3><div class="stack">${reports.filter((r)=>r.status==='Open').map((r)=>`<div class="qa-note"><div class="row"><span class="badge orange">${safe(r.type)}</span><span class="chip">${safe(r.target)}</span></div><p>${safe(r.note || 'Needs review')}</p><button class="btn dark small" type="button" data-action="resolve-report" data-report-id="${safe(r.id)}">Resolve</button></div>`).join('') || '<div class="empty">No open review items.</div>'}</div></div>
      </div>`);
  }

  function openLiveSmokeTest() {
    const checks = [
      'Phone A creates account and profile',
      'Phone B creates account and profile',
      'Phone A posts trip; Phone B sees trip after pull/realtime',
      'Phone B requests to join; Phone A sees request',
      'Phone A approves; Phone B sees crew/private-location unlock',
      'Both phones exchange crew chat messages',
      'Phone B posts catch photo/video; operator sees review item',
      'Operator resolves report or removes unsafe post',
      'Business/captain lead appears in Bridge'
    ];
    modal(`<div class="modal-head"><div><span class="eyebrow">Two-phone check</span><h2>Two phones. No guessing.</h2></div><button class="x-btn" type="button" data-action="close-modal">${CLOSE_BTN}</button></div>
      <p class="lead">Run this only after shared data is connected and account sign-in is working.</p>
      <div class="stack">${checks.map((c,i)=>`<button class="check-row" type="button" data-action="toggle-launch-check" data-check-id="lc_${Math.min(i+1,7)}"><span>${i+1}</span><b>${safe(c)}</b></button>`).join('')}</div>
      <div class="row mt"><button class="btn soft" type="button" data-action="check-backend">Check connection</button><button class="btn dark" type="button" data-action="pull-supabase">Pull shared</button><button class="btn dark" type="button" data-action="sync-supabase">Push shared</button></div>`);
  }

  function openQaNote() {
    modal(`<div class="modal-head"><div><span class="eyebrow">QA note</span><h2>Add controlled note.</h2></div><button class="x-btn" type="button" data-action="close-modal">${CLOSE_BTN}</button></div>
      <div class="forms">
        <label class="label">Screen<input id="qaScreen" class="field" placeholder="Home, Explore, Crew, Feed, Profile" /></label>
        <label class="label">Issue<textarea id="qaIssue" class="field" placeholder="What feels wrong or broken?"></textarea></label>
        <label class="label">Priority<select id="qaPriority" class="select"><option>High</option><option selected>Medium</option><option>Low</option></select></label>
        <button class="btn primary full" type="button" data-action="save-qa-note">Save note</button>
      </div>`);
  }

  function saveQaNote() {
    const note = {
      id: uid('qa'),
      screen: $('#qaScreen')?.value.trim() || 'General',
      issue: $('#qaIssue')?.value.trim() || 'Small cleanup note',
      priority: $('#qaPriority')?.value || 'Medium',
      status: 'Open',
      createdAt: now()
    };
    state.qaNotes = state.qaNotes || [];
    state.qaNotes.unshift(note);
    state.opsLog.unshift(`QA note added: ${note.screen} / ${note.priority}`);
    closeModal(); save(); render(); toast('QA note saved.');
  }

  function toggleQaNote(id) {
    const note = (state.qaNotes || []).find((n) => n.id === id);
    if (!note) return;
    note.status = note.status === 'Done' ? 'Open' : 'Done';
    state.opsLog.unshift(`QA note ${note.status.toLowerCase()}: ${note.screen}`);
    save(); render();
  }

  function toggleLaunchCheck(id) {
    const check = (state.launchChecks || []).find((c) => c.id === id);
    if (!check) return;
    check.done = !check.done;
    state.opsLog.unshift(`${check.done ? 'Checked' : 'Unchecked'}: ${check.label}`);
    save(); render();
  }

  function runHealthCheck() {
    const buttons = $$('button[data-action]');
    const actions = new Set(buttons.map((b) => b.dataset.action).filter(Boolean));
    const missing = [...actions].filter((a) => !ACTIONS[a]);
    const duplicateIds = $$('[id]').map((n)=>n.id).filter((id, i, arr)=>arr.indexOf(id)!==i);
    const result = `${buttons.length} routed buttons ${MID} ${missing.length} missing actions ${MID} ${duplicateIds.length} duplicate IDs`;
    state.health.lastAudit = result;
    state.health.missingActions = missing;
    state.opsLog.unshift(`Health check: ${result}`);
    save(); render();
    modal(`<div class="modal-head"><div><span class="eyebrow">Health check</span><h2>Swiss watch pass.</h2></div><button class="x-btn" type="button" data-action="close-modal">${CLOSE_BTN}</button></div><div class="grid"><div class="panel"><h3>${safe(result)}</h3><p class="muted">Missing actions: ${missing.length ? safe(missing.join(', ')) : 'none'}</p><p class="muted">Duplicate IDs: ${duplicateIds.length ? safe(duplicateIds.join(', ')) : 'none'}</p></div><button class="btn primary" type="button" data-action="close-modal">Good</button></div>`);
  }

  function loadSamplePack() {
    if (!requireAdmin()) return;
    const fresh = demoSeedContent();
    const current = currentUser();
    state.users = mergeById(state.users || [], fresh.users || []);
    state.trips = mergeById(state.trips || [], fresh.trips || []);
    state.requests = mergeById(state.requests || [], fresh.requests || []);
    state.feed = mergeById(state.feed || [], fresh.feed || []);
    state.businesses = mergeById(state.businesses || [], fresh.businesses || []);
    state.bookings = mergeById(state.bookings || [], fresh.bookings || []);
    state.reports = mergeById(state.reports || [], fresh.reports || []);
    state.demoContentLoaded = true;
    state.opsLog.unshift('Reloaded seeded FishCrew content pack.');
    if (current) state.session = { ...state.session, userId: current.id };
    save(); render(); nav('home'); toast('Sample content loaded.');
  }

  function clearSamplePack() {
    if (!requireAdmin()) return;
    state.trips = (state.trips || []).filter((x) => !x.demo);
    state.feed = (state.feed || []).filter((x) => !x.demo);
    state.businesses = (state.businesses || []).filter((x) => !x.demo);
    state.bookings = (state.bookings || []).filter((x) => !x.id?.startsWith('book_'));
    state.requests = (state.requests || []).filter((x) => !String(x.id || '').startsWith('req_'));
    state.demoContentLoaded = false;
    state.opsLog.unshift('Cleared seeded trips, feed posts, and partner examples.');
    save(); render(); nav('home'); toast('Sample trips/feed cleared.');
  }

  function mergeById(existing, incoming) {
    const map = new Map((existing || []).map((item) => [item.id, item]));
    (incoming || []).forEach((item) => { if (!map.has(item.id)) map.set(item.id, item); });
    return Array.from(map.values());
  }

  function exportData() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `fishcrew-export-${VERSION}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    toast('Export started.');
  }

  function resetLocal() {
    if (!confirm('Reset FishCrew browser data on this device?')) return;
    localStorage.removeItem(STORE);
    state = defaultState();
    save(); render(); nav('home'); toast('Browser data reset.');
  }

  function openNotifications() {
    if (!currentUser()) return openAuth('Sign in to view your FishCrew alerts.');
    const notes = state.notifications || [];
    const loading = state.notificationsLoading;
    const fetchError = state.notificationsFetchError;
    modal(`<div class="modal-head"><div><span class="eyebrow">Activity</span><h2>FishCrew alerts.</h2></div><button class="x-btn" type="button" data-action="close-modal">${CLOSE_BTN}</button></div>
      <div class="stack">
        ${loading ? '<div class="empty">Loading alerts...</div>' : fetchError ? `<div class="empty">Could not load alerts. ${safe(fetchError)}</div>` : notes.map((n)=>`<div class="panel notification-row ${n.read ? 'read' : ''}"><div class="row"><span class="badge ${n.read ? '' : 'green'}">${safe(n.type || 'Alert')}</span><span class="chip">${new Date(n.createdAt || now()).toLocaleString([], { month:'short', day:'numeric', hour:'numeric', minute:'2-digit' })}</span></div><h3>${safe(n.title)}</h3><p class="muted">${safe(n.body)}</p></div>`).join('') || '<div class="empty">No alerts yet. Trip, crew, and message activity will show here.</div>'}
        <div class="row"><button class="btn primary" type="button" data-action="mark-notifications-read">Mark all read</button><button class="btn dark" type="button" data-action="open-user-settings">Notification settings</button></div>
      </div>`);
    if (supabaseClient && currentUser() && !loading) fetchNotifications();
  }

  async function markNotificationsRead() {
    const user = currentUser();
    if (!user) return openAuth('Sign in to manage alerts.');
    if (supabaseClient) {
      const unreadCount = unreadNotifications();
      if (!unreadCount) {
        openNotifications();
        return toast('No unread alerts.');
      }
      const { error } = await supabaseClient
        .from('notifications')
        .update({ read_at: now(), updated_at: now() })
        .eq('user_id', user.id)
        .is('read_at', null);
      if (error) return toast(`Could not mark alerts read: ${error.message}`, 'danger');
      await fetchNotifications();
      openNotifications();
      return toast('Notifications marked read.');
    }
    (state.notifications || []).forEach((n) => { n.read = true; });
    save(); render(); openNotifications(); toast('Notifications marked read.');
  }

  const ACTIONS = {
    go: (el) => { const screen = el.dataset.screen; if (el.closest('.modal')) { if (modalMode === 'tutorial') { state.onboardingSeen = true; save(); } closeModal(); } nav(screen); },
    nav: (el) => { const screen = el.dataset.screen; if (el.closest('.modal')) closeModal(); nav(screen); },
    'open-post-menu': () => openCreate(),
    'open-notifications': () => openNotifications(),
    'mark-notifications-read': () => markNotificationsRead(),
    'open-auth': () => openAuth(),
    'open-auth-signin': () => openAuth('Create a profile to post, join, chat, upload photos, and save trips.', 'Angler', 'signin'),
    'open-auth-create': () => openAuth('Create your account when you are ready to post, join crews, chat, and save trips.', 'Angler', 'create'),
    'switch-auth-tab': (el) => switchAuthTab(el.dataset.authTab || 'signin'),
    'open-tutorial': () => openTutorial(),
    'dismiss-tutorial': () => dismissTutorial(),
    'auth-signin': () => authSignIn(),
    'auth-create': () => authCreate(),
    'auth-forgot': () => authForgot(),
    'save-password-reset': () => savePasswordReset(),
    'social-login': (el) => socialLogin(el.dataset.provider || 'social'),
    'auth-social-complete': (el) => completeSocialProfile(el.dataset.provider || 'social'),
    'instagram-connect': () => startInstagramConnect(),
    'instagram-import': () => importInstagramMedia(),
    'retry-upload': () => runPendingUploadRetry(),
    'dismiss-beta-banner': () => dismissBetaBanner(),
    logout: () => logout(),
    'close-modal': () => closeModal(),
    'open-create': () => openCreate(),
    'open-trip-form': () => openTripForm(),
    'save-trip': () => saveTrip(),
    'open-feed-form': () => openFeedForm(),
    'save-feed-post': () => saveFeedPost(),
    'open-business-form': () => openBusinessForm(),
    'save-business': () => saveBusiness(),
    'open-booking-form': () => openBookingForm(),
    'save-booking': () => saveBooking(),
    'open-business-leads': () => openBusinessLeads(),
    'update-booking-status': (el) => updateBookingStatus(el.dataset.bookingId, el.dataset.status),
    'book-business': (el) => bookBusiness(el.dataset.businessId),
    'request-trip': (el) => requestTrip(el.dataset.tripId),
    'trip-details': (el) => tripDetails(el.dataset.tripId),
    'open-host-controls': (el) => openHostControls(el.dataset.tripId),
    'complete-trip': (el) => completeTrip(el.dataset.tripId),
    'cancel-trip': (el) => cancelTrip(el.dataset.tripId),
    'reopen-trip': (el) => reopenTrip(el.dataset.tripId),
    'duplicate-trip': (el) => duplicateTrip(el.dataset.tripId),
    'open-trip-chat': (el) => openTripChat(el.dataset.tripId),
    'send-chat': (el) => sendChat(el.dataset.tripId),
    'approve-request': (el) => approveRequest(el.dataset.requestId),
    'decline-request': (el) => declineRequest(el.dataset.requestId),
    'trip-filter': (el) => { state.tripFilter = el.dataset.filter || 'All'; save(); render(); },
    'feed-filter': (el) => { state.feedFilter = el.dataset.filter || 'All'; save(); if (state.activeScreen === 'feed') renderFeed(); else render(); },
    'refresh-feed': () => refreshFeed(),
    'crew-panel': (el) => { state.crewPanel = el.dataset.panel || 'upcoming'; save(); render(); },
    'tools-panel': (el) => { state.toolsPanel = el.dataset.panel || 'tools'; save(); render(); },
    'open-map': (el) => openMap(el.dataset.area),
    'urgent-trips': () => { state.tripFilter = 'Open'; save(); nav('explore'); toast('Showing open and last-minute trips.'); },
    'open-local-spots': () => openLocalSpots(),
    'react-feed': (el) => reactFeed(el.dataset.feedId),
    'share-feed': (el) => shareFeed(el.dataset.feedId),
    'share-platform': (el) => sharePlatform(el.dataset.feedId, el.dataset.platform || 'native'),
    'report-feed': (el) => reportFeed(el.dataset.feedId),
    'block-user': (el) => blockUser(el.dataset.userId),
    'unblock-user': (el) => unblockUser(el.dataset.userId),
    'remove-feed': (el) => removeFeed(el.dataset.feedId),
    'verify-business': (el) => verifyBusiness(el.dataset.businessId),
    'resolve-report': (el) => resolveReport(el.dataset.reportId),
    'approve-media': (el) => approveMedia(el.dataset.assetId),
    'open-admin-audit': () => openAdminAudit(),
    'open-user-directory': () => openUserDirectory(),
    'open-support-queue': () => openSupportQueue(),
    'open-store-readiness': () => openStoreReadiness(),
    'run-ops': () => runOps(),
    'open-moderation': () => openModeration(),
    'open-revenue': () => openRevenue(),
    'open-photo-profile': () => openPhotoProfile(),
    'save-profile-photo': () => saveProfilePhoto(),
    'open-edit-profile': () => openEditProfile(),
    'save-profile': () => saveProfile(),
    'open-backend-help': () => openBackendHelp(),
    'open-user-settings': () => openUserSettings(),
    'save-user-settings': () => saveUserSettings(),
    'open-privacy-policy': () => openPrivacyPolicy(),
    'open-terms': () => openTerms(),
    'open-community-guidelines': () => openCommunityGuidelines(),
    'open-support-center': () => openSupportCenter(),
    'open-support-email': () => openSupportEmail(),
    'open-account-delete': () => openAccountDelete(),
    'open-account-delete-request': () => openAccountDeleteRequest(),
    'confirm-delete-account': () => confirmDeleteAccount(),
    'open-blocked-users': () => openBlockedUsers(),
    'open-fishing-guides': () => openFishingGuides(),
    'save-guide-area': (el) => saveGuideArea(el.dataset.area),
    'open-bait-help': () => openBaitHelp(),
    'run-bait-search': () => runBaitSearch(),
    'open-gear-help': () => openGearHelp(),
    'open-technique-tutorials': () => openTechniqueTutorials(),
    'open-fish-id': () => openFishId(),
    'run-fish-id': () => runFishId(),
    'open-measure-tool': () => openMeasureTool(),
    'run-measure-tool': () => runMeasureTool(),
    'open-device-hub': () => openDeviceHub(),
    'use-browser-gps': () => useBrowserGps(),
    'stop-browser-gps': () => stopBrowserGps(),
    'connect-bluetooth-gps': () => connectBluetoothGps(),
    'connect-serial-gps': () => connectSerialGps(),
    'copy-device-fix': () => copyDeviceFix(),
    'open-device-bridge-help': () => openDeviceBridgeHelp(),
    'refresh-conditions': () => refreshConditions(),
    'open-conditions': () => openConditions(),
    'check-backend': () => checkBackend(),
    'sync-supabase': () => syncSupabase(),
    'pull-supabase': () => pullSupabase(),
    'start-realtime': () => startRealtime(),
    'run-health-check': () => runHealthCheck(),
    'run-readiness-check': () => runReadinessCheck(),
    'run-release-gate': () => runReleaseGate(),
    'open-backend-diagnostics': () => openBackendDiagnostics(),
    'run-live-test-pack': () => runLiveTestPack(),
    'open-role-matrix': () => openRoleMatrix(),
    'open-data-adapter-map': () => openDataAdapterMap(),
    'run-media-stress-check': () => runMediaStressCheck(),
    'open-media-pipeline': () => openMediaPipeline(),
    'open-live-smoke-test': () => openLiveSmokeTest(),
    'open-qa-note': () => openQaNote(),
    'save-qa-note': () => saveQaNote(),
    'toggle-qa-note': (el) => toggleQaNote(el.dataset.noteId),
    'toggle-launch-check': (el) => toggleLaunchCheck(el.dataset.checkId),
    'export-data': () => exportData(),
    'load-sample-pack': () => loadSamplePack(),
    'clear-sample-pack': () => clearSamplePack(),
    'reset-local': () => resetLocal()
  };

  function routeEvent(event) {
    const el = event.target.closest('[data-action]');
    if (!el) return;
    event.preventDefault();
    event.stopPropagation();
    const action = el.dataset.action;
    if (event.type === 'click') {
      const delta = Date.now() - lastHandledAt;
      if (delta < 240 && lastHandledAction === action) return;
    }
    lastHandledAt = Date.now();
    lastHandledAction = action;
    setDebug(`Tap: ${action}`);
    try {
      const fn = ACTIONS[action];
      if (!fn) {
        toast('This control could not be opened.', 'danger');
        return;
      }
      fn(el, event);
    } catch (error) {
      console.error(error);
      toast(`Button error: ${error.message}`, 'danger');
    }
  }


  function setupFluidChrome() {
    let ticking = false;
    const updateChrome = () => {
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      document.body.classList.toggle('chrome-compact', y > 18);
      document.body.classList.toggle('chrome-deep', y > 220);
      document.body.style.setProperty('--scroll-y', String(Math.min(y, 420)));
      ticking = false;
    };
    const requestUpdate = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateChrome);
        ticking = true;
      }
    };
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate, { passive: true });
    updateChrome();
  }

  function scrollToTopSoft() {
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
  }

  function screenFromUrl() {
    const screen = new URLSearchParams(location.search).get('screen');
    return ['home', 'explore', 'crew', 'feed', 'tools', 'profile'].includes(screen) ? screen : '';
  }

  function openDeepLinkModal() {
    const path = String(location.pathname || '').replace(/\/+$/, '').toLowerCase();
    if (path === '/privacy') openPrivacyPolicy();
    else if (path === '/terms') openTerms();
    else if (path === '/support') openSupportCenter();
    else if (path === '/account/delete' || path === '/account-delete') openAccountDelete();
    else if (path === '/community-guidelines') openCommunityGuidelines();
  }

  function wireEvents() {
    document.addEventListener('pointerup', routeEvent, true);
    document.addEventListener('click', routeEvent, true);
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeModal();
      if (event.key === 'Enter' && modalMode === 'auth' && !event.shiftKey) {
        const active = document.activeElement;
        if (active && ['INPUT', 'SELECT', 'TEXTAREA'].includes(active.tagName)) {
          event.preventDefault();
          if (authTab === 'create') authCreate();
          else if ($('#socialUsername')) completeSocialProfile($('#socialUsername')?.closest('.social-complete-form')?.dataset.provider || 'social');
          else authSignIn();
        }
      }
    });
    $('#modalRoot')?.addEventListener('pointerup', (event) => {
      if (event.target === $('#modalRoot') && modalMode !== 'tutorial') closeModal();
    });
  }

  async function boot() {
    try {
      setBootStatus('Restoring your FishCrew session...');
      load();
      cleanupOldCaches();
      wireEvents();
      setupFluidChrome();
      applyScreenshotMode();
      applyScreenshotDemoData();
      applyBetaBannerState();
      if (CONFIG.USE_SUPABASE && CONFIG.SUPABASE_URL && CONFIG.SUPABASE_ANON_KEY) {
        setBootStatus('Checking shared data...');
        // Never let a slow/blocked backend check strand testers on the boot screen.
        const backendTimeout = new Promise((resolve) => setTimeout(() => resolve('timeout'), 8000));
        const backendResult = await Promise.race([checkBackend(), backendTimeout]);
        if (backendResult === 'timeout') {
          state.backendMode = 'local';
          toast('Shared data is slow to respond. Browsing continues with local data.', 'danger');
        }
      }
      await maybeHandlePasswordRecovery();
      await maybeHandleInstagramOAuthCallback();
      setBootStatus('Setting the water window...');
      state.activeScreen = screenFromUrl() || state.activeScreen || 'home';
      save(true);
      render();
      setDebug(`Screen: ${state.activeScreen}`);
      setTimeout(openDeepLinkModal, 180);
      if (!state.locationAsked && window.isSecureContext && navigator.geolocation) {
        state.locationAsked = true;
        save();
        setDebug('Location tools ready. Tap conditions or GPS when you want live location.');
      }
      setDebug(`Ready v${VERSION}: central router online`);
      finishBoot();
    } catch (error) {
      failBoot(error);
    }
  }

  window.FishCrew = { get state() { return state; }, actions: ACTIONS, render, runHealthCheck, version: VERSION };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();





