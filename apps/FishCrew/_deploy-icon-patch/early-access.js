(function () {
  const CONFIG = window.FISHCREW_CONFIG || {};
  const LIVE_URL = 'https://fishcrew.macksims.com';
  const LIMITS = {
    name: 80,
    email: 120,
    phone: 32,
    home_port: 80,
    vessel_name: 80,
    trip_types: 200,
    website_url: 200,
    instagram: 80
  };
  const COOLDOWN_MS = 60 * 1000;
  const CLOSE_BTN = '×';

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  function safe(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function uid() {
    return `wait_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  }

  function toast(message, kind) {
    if (typeof window.FishCrewCaptainWaitlistToast === 'function') {
      return window.FishCrewCaptainWaitlistToast(message, kind);
    }
    const el = $('#toast');
    if (el) {
      el.textContent = message;
      el.classList.toggle('danger', kind === 'danger');
      el.classList.remove('hidden');
      clearTimeout(toast._t);
      toast._t = setTimeout(() => el.classList.add('hidden'), 4200);
      return;
    }
    if (kind === 'danger') console.warn(message);
  }

  function currentUser() {
    try { return window.FishCrew?.state?.session ? (window.FishCrew.state.users || []).find((u) => u.id === window.FishCrew.state.session.userId) || null : null; }
    catch (_) { return null; }
  }

  function isAdmin() {
    const user = currentUser();
    return user?.role === 'Admin';
  }

  function isOperator() {
    const role = currentUser()?.role;
    return role === 'Admin' || role === 'Business' || role === 'Captain';
  }

  function client() {
    if (!CONFIG.USE_SUPABASE || !CONFIG.SUPABASE_URL || !CONFIG.SUPABASE_ANON_KEY || !window.supabase?.createClient) return null;
    if (!window.__fishcrewWaitlistClient) {
      window.__fishcrewWaitlistClient = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false }
      });
    }
    return window.__fishcrewWaitlistClient;
  }

  function clip(value, max) {
    return String(value || '').trim().slice(0, max);
  }

  function readForm(root) {
    const get = (id) => clip($(id, root)?.value, 400);
    const website = clip($('#eaWebsite', root)?.value, LIMITS.website_url);
    const honeypot = clip($('#eaCompany', root)?.value, 80);
    return {
      name: clip($('#eaName', root)?.value || currentUser()?.name, LIMITS.name),
      email: clip($('#eaEmail', root)?.value || currentUser()?.email, LIMITS.email),
      phone: clip($('#eaPhone', root)?.value, LIMITS.phone),
      home_port: clip($('#eaPort', root)?.value || currentUser()?.area, LIMITS.home_port),
      vessel_name: clip($('#eaVessel', root)?.value, LIMITS.vessel_name),
      trip_types: clip($('#eaTrips', root)?.value, LIMITS.trip_types),
      website_url: website,
      instagram: clip($('#eaInstagram', root)?.value, LIMITS.instagram).replace(/^@+/, ''),
      consent: Boolean($('#eaConsent', root)?.checked),
      honeypot
    };
  }

  function validate(row) {
    if (row.honeypot) return 'ok-honeypot';
    if (!row.name) return 'Add your name.';
    if (!row.email && !row.phone) return 'Add an email or a phone so we can reach you.';
    if (!row.home_port) return 'Add a home port or city.';
    if (!row.consent) return 'Consent is required to join the waitlist.';
    if (row.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) return 'That email does not look usable.';
    return '';
  }

  function lastSubmitAt() {
    try { return Number(localStorage.getItem('fc_waitlist_at') || 0); } catch (_) { return 0; }
  }

  function markSubmitted() {
    try { localStorage.setItem('fc_waitlist_at', String(Date.now())); } catch (_) {}
  }

  function formHtml(user, opts = {}) {
    const standalone = Boolean(opts.standalone);
    return `
      <div class="ea-form" data-ea-form>
        ${standalone ? '' : `<div class="modal-head"><div><span class="eyebrow">Early access</span><h2>List your charter first.</h2></div><button class="x-btn" type="button" data-action="close-modal" aria-label="Close">${CLOSE_BTN}</button></div>`}
        <p class="muted">FishCrew is centralizing charter discovery in one app. Early buy-in means you can be listed first and help shape the product. We are not claiming booked trips or a full marketplace yet.</p>
        <div class="forms">
          <label class="label ea-honey" aria-hidden="true">Company<input id="eaCompany" name="company" class="field" tabindex="-1" autocomplete="off" /></label>
          <label class="label">Your name<input id="eaName" name="name" class="field" autocomplete="name" maxlength="80" value="${safe(user?.name || '')}" required /></label>
          <div class="form-grid">
            <label class="label">Email<input id="eaEmail" name="email" class="field" type="email" autocomplete="email" maxlength="120" value="${safe(user?.email || '')}" /></label>
            <label class="label">Phone<input id="eaPhone" name="tel" class="field" type="tel" autocomplete="tel" maxlength="32" placeholder="Dock or mobile" /></label>
          </div>
          <label class="label">Home port / city<input id="eaPort" name="address-level2" class="field" autocomplete="address-level2" maxlength="80" value="${safe(user?.area || 'Tampa Bay')}" required /></label>
          <label class="label">Vessel / charter name<input id="eaVessel" name="organization" class="field" autocomplete="organization" maxlength="80" placeholder="e.g. Morning Tide Charters" /></label>
          <label class="label">Trip types / species<textarea id="eaTrips" name="trip-types" class="field" maxlength="200" placeholder="Inshore snook, family half-day, offshore snapper"></textarea></label>
          <div class="form-grid">
            <label class="label">Website <span class="tiny">(optional)</span><input id="eaWebsite" name="url" class="field" type="url" autocomplete="url" maxlength="200" placeholder="https://" /></label>
            <label class="label">Instagram <span class="tiny">(optional)</span><input id="eaInstagram" name="instagram" class="field" autocomplete="off" maxlength="80" placeholder="@yourcharter" /></label>
          </div>
          <label class="ea-consent"><input id="eaConsent" type="checkbox" /> <span>I agree FishCrew may contact me about an early listing. I understand this is a waitlist, not a live booking desk, and no seats are reserved.</span></label>
          <button class="btn primary full" type="button" data-action="save-captain-early-access">${standalone ? 'Request early listing' : 'Join the captain waitlist'}</button>
          <p class="tiny">Questions: <a href="mailto:${safe(CONFIG.SUPPORT_EMAIL || 'support@fishcrew.app')}">${safe(CONFIG.SUPPORT_EMAIL || 'support@fishcrew.app')}</a> · ${safe(LIVE_URL)}</p>
        </div>
      </div>`;
  }

  function openWaitlist(ctx = {}) {
    const user = ctx.currentUser || currentUser();
    if (ctx.modal) {
      ctx.modal(formHtml(user));
      return;
    }
    const host = $('#eaStandalone');
    if (host) host.innerHTML = formHtml(user, { standalone: true });
  }

  async function saveWaitlist(root) {
    const formRoot = root || $('[data-ea-form]') || document;
    if (Date.now() - lastSubmitAt() < COOLDOWN_MS) {
      toast('Already received. Give us a minute before sending another.', 'danger');
      return;
    }
    const row = readForm(formRoot);
    const problem = validate(row);
    if (problem === 'ok-honeypot') {
      markSubmitted();
      toast('Request received. We will reach out if we can list you.');
      return;
    }
    if (problem) return toast(problem, 'danger');

    const user = currentUser();
    const payload = {
      id: uid(),
      user_id: user?.id || null,
      name: row.name,
      email: row.email,
      phone: row.phone,
      area: row.home_port,
      home_port: row.home_port,
      vessel_name: row.vessel_name,
      trip_types: row.trip_types,
      note: row.trip_types,
      website_url: row.website_url,
      instagram: row.instagram,
      consent: true,
      source: 'early-access',
      status: 'waitlist'
    };

    // captain_waitlist has shipped in two shapes: a minimal table (id, user_id,
    // name, email, area, note, status) and a wider one with dedicated captain
    // columns. Try the rich row, then retry against the minimal shape with the
    // extra detail folded into note, so a real captain's signup is never lost
    // to a schema mismatch. If the row still cannot land, keep it on the device
    // and say so instead of silently dropping it.
    const minimalPayload = {
      id: payload.id,
      user_id: payload.user_id,
      name: row.name,
      email: row.email,
      area: row.home_port,
      note: [
        row.home_port && `Home port: ${row.home_port}`,
        row.vessel_name && `Vessel: ${row.vessel_name}`,
        row.trip_types && `Trips/species: ${row.trip_types}`,
        row.phone && `Phone: ${row.phone}`,
        row.website_url && `Site: ${row.website_url}`,
        row.instagram && `Instagram: ${row.instagram}`,
        'Consent: yes',
        'Source: early-access'
      ].filter(Boolean).join(' | '),
      status: 'waitlist'
    };

    const isSchemaMismatch = (error) => {
      const blob = `${error?.code || ''} ${error?.message || ''}`;
      return /PGRST204/i.test(blob) || /could not find the .* column/i.test(blob);
    };

    let saved = false;
    let saveError = null;
    const sb = client();
    if (sb) {
      let { error } = await sb.from('captain_waitlist').insert(payload);
      if (error && isSchemaMismatch(error)) {
        ({ error } = await sb.from('captain_waitlist').insert(minimalPayload));
      }
      if (error) saveError = error;
      else saved = true;
    }

    if (!saved) {
      try {
        const local = JSON.parse(localStorage.getItem('fc_waitlist_local') || '[]');
        local.unshift(minimalPayload);
        localStorage.setItem('fc_waitlist_local', JSON.stringify(local.slice(0, 20)));
      } catch (_) {}
      if (sb && saveError) console.warn('captain_waitlist insert failed', saveError);
    }

    markSubmitted();
    if (window.FishCrew?.state) {
      window.FishCrew.state.captainWaitlist = window.FishCrew.state.captainWaitlist || [];
      window.FishCrew.state.captainWaitlist.unshift({
        id: payload.id,
        userId: payload.user_id,
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        area: payload.home_port,
        vesselName: payload.vessel_name,
        tripTypes: payload.trip_types,
        websiteUrl: payload.website_url,
        instagram: payload.instagram,
        status: 'waitlist',
        createdAt: new Date().toISOString()
      });
    }
    if (saved) {
      toast('You are on the early-access list. An operator will invite you if we can list the boat.');
      const close = window.__fishcrewCloseModal;
      if (typeof close === 'function') close();
      else $('[data-action="close-modal"]')?.click();
      return;
    }

    // Shared waitlist rejected the row. Do not pretend it landed: keep the
    // captain in the flow with a route that actually reaches a human.
    toast('Saved on this device only — the shared waitlist did not accept it.', 'danger');
    const support = window.FISHCREW_CONFIG?.SUPPORT_EMAIL || 'support@fishcrew.app';
    const subject = encodeURIComponent(`FishCrew early listing: ${row.vessel_name || row.name}`);
    const body = encodeURIComponent(minimalPayload.note.split(' | ').concat([`Name: ${row.name}`, `Email: ${row.email}`]).join('\n'));
    const fallbackHost = formRoot && formRoot.nodeType === 1 ? formRoot : $('[data-ea-form]');
    if (!fallbackHost) return;
    fallbackHost.innerHTML = `
      <div class="panel">
        <span class="eyebrow">Not on the shared list yet</span>
        <h3>We could not save your request to the server.</h3>
        <p class="muted">Your details are held on this device only, so nobody on our side can see them yet. Send them straight to us and we will add you by hand — you keep your place in line.</p>
        <div class="row mt">
          <a class="btn primary" href="mailto:${safe(support)}?subject=${subject}&body=${body}">Email my details</a>
        </div>
      </div>`;
  }

  function statusBadge(status) {
    const value = String(status || 'waitlist').toLowerCase();
    const kind = value === 'listed' ? 'green' : value === 'invited' ? 'orange' : '';
    return `<span class="badge ${kind}">${safe(value)}</span>`;
  }

  function queueCard(row) {
    const status = String(row.status || 'waitlist').toLowerCase();
    return `
      <article class="panel ea-queue-card" data-waitlist-id="${safe(row.id)}">
        ${statusBadge(status)}
        <h3>${safe(row.vessel_name || row.vesselName || row.name || 'Captain')}</h3>
        <p class="muted">${safe(row.name || '')} · ${safe(row.home_port || row.area || '')}</p>
        <p class="tiny">${safe(row.trip_types || row.note || 'Trip types not listed yet.')}</p>
        <div class="meta">
          ${row.email ? `<span class="chip">${safe(row.email)}</span>` : ''}
          ${row.phone ? `<span class="chip">${safe(row.phone)}</span>` : ''}
          ${row.instagram ? `<span class="chip">@${safe(row.instagram)}</span>` : ''}
        </div>
        <div class="row">
          ${status === 'waitlist' ? `<button class="btn primary small" type="button" data-action="invite-captain-waitlist" data-waitlist-id="${safe(row.id)}">Invite to listing</button>` : ''}
          ${status === 'invited' ? `<button class="btn success small" type="button" data-action="list-captain-waitlist" data-waitlist-id="${safe(row.id)}">Mark listed</button>` : ''}
          ${row.website_url || row.websiteUrl ? `<a class="btn dark small" href="${safe(row.website_url || row.websiteUrl)}" target="_blank" rel="noopener">Site</a>` : ''}
        </div>
      </article>`;
  }

  async function loadQueue() {
    const sb = client();
    if (sb && isAdmin()) {
      const { data, error } = await sb.from('captain_waitlist').select('*').order('created_at', { ascending: false }).limit(80);
      if (!error && Array.isArray(data)) return data;
    }
    const local = [];
    try { local.push(...JSON.parse(localStorage.getItem('fc_waitlist_local') || '[]')); } catch (_) {}
    const stateRows = (window.FishCrew?.state?.captainWaitlist || []).map((r) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      phone: r.phone,
      home_port: r.area,
      vessel_name: r.vesselName,
      trip_types: r.tripTypes,
      website_url: r.websiteUrl,
      instagram: r.instagram,
      status: r.status,
      created_at: r.createdAt
    }));
    return [...local, ...stateRows];
  }

  async function openQueue(ctx = {}) {
    if (!isAdmin()) {
      toast('Operator admin only. Sign in with an operator account to invite captains.', 'danger');
      return;
    }
    const rows = await loadQueue();
    const waiting = rows.filter((r) => String(r.status || 'waitlist').toLowerCase() === 'waitlist').length;
    const html = `
      <div class="modal-head"><div><span class="eyebrow">Operator queue</span><h2>Invite captains onto listings.</h2></div><button class="x-btn" type="button" data-action="close-modal" aria-label="Close">${CLOSE_BTN}</button></div>
      <p class="muted">${waiting} waiting. Invite is a status change plus copy you can send yourself. FishCrew does not email captains from the server.</p>
      <div class="stack ea-queue">${rows.map(queueCard).join('') || '<div class="empty">No captain requests yet. Share the early-access page with docks and marinas.</div>'}</div>`;
    if (ctx.modal) ctx.modal(html);
    else if (window.FishCrew?.actions?.['open-captain-waitlist']) {
      const root = $('#modalRoot');
      if (root) {
        root.innerHTML = `<div class="modal" role="dialog" aria-modal="true">${html}</div>`;
        root.classList.remove('hidden');
        root.setAttribute('aria-hidden', 'false');
      }
    }
  }

  async function setStatus(id, status) {
    if (!isAdmin()) return toast('Only operators can update waitlist status.', 'danger');
    if (!['waitlist', 'invited', 'listed'].includes(status)) return;
    const sb = client();
    if (sb) {
      const { error } = await sb.from('captain_waitlist').update({ status }).eq('id', id);
      if (error) return toast(error.message || 'Could not update status.', 'danger');
    }
    const rows = window.FishCrew?.state?.captainWaitlist || [];
    const hit = rows.find((r) => r.id === id);
    if (hit) hit.status = status;
    if (status === 'invited') {
      const row = (await loadQueue()).find((r) => r.id === id) || hit || {};
      const note = [
        `Hi ${row.name || 'captain'},`,
        '',
        'FishCrew is listing Tampa Bay charters in one app: https://fishcrew.macksims.com',
        'You asked for early access. If you want on the first board, reply with vessel name, home port, trip types, and a public site or Instagram.',
        'This is not a booking desk yet — early buy-in means you can be listed first and help shape the product.',
        '',
        '— FishCrew'
      ].join('\n');
      try { await navigator.clipboard.writeText(note); toast('Marked invited. Invite copy is on your clipboard — send it yourself.'); }
      catch (_) { toast('Marked invited. Send the captain the fishcrew.macksims.com link yourself.'); }
    } else {
      toast(status === 'listed' ? 'Marked listed. Confirm the charter actually appears on Explore before you tell anglers.' : 'Waitlist status updated.');
    }
    openQueue({ modal: window.__fishcrewModal });
  }

  function homeCta() {
    return `
      <section class="section ea-cta-card" data-ea-home>
        <div class="panel launch-card">
          <div>
            <span class="eyebrow">Captains + charter desks</span>
            <h2>Request an early listing.</h2>
            <p class="muted">FishCrew is centralizing charter discovery in one app. Get in early: first listings, and you help shape the product. We will not invent booked trips.</p>
          </div>
          <button class="btn primary" type="button" data-action="open-captain-waitlist">Request early listing</button>
        </div>
      </section>`;
  }

  function comingEmpty() {
    return `
      <div class="empty ea-empty" data-ea-empty>
        <h3>Charters are coming.</h3>
        <p>The board stays empty until a real captain lists. We will not invent boats, prices, or booked seats.</p>
        <div class="row mt">
          <button class="btn primary" type="button" data-action="open-captain-waitlist">Captains: request early listing</button>
          <button class="btn dark" type="button" data-action="clear-charter-search">Clear filters</button>
        </div>
      </div>`;
  }

  function injectHome() {
    const home = $('#screen-home');
    if (!home || home.querySelector('[data-ea-home]')) return;
    const hero = home.querySelector('.home-hero, .hero');
    if (hero) hero.insertAdjacentHTML('afterend', homeCta());
    const featured = home.querySelector('[aria-label="Tampa Bay charters"] .grid, [aria-label="Tampa Bay charters"]');
    if (!featured) {
      const commands = home.querySelector('.home-command-grid, .captain-desk');
      if (commands && !home.querySelector('[data-ea-empty]')) {
        commands.insertAdjacentHTML('afterend', `<section class="section app-section-tight" data-ea-empty-wrap><div class="section-head compact-head"><div><span class="eyebrow">Charters</span><h2>Boats are still coming in.</h2></div></div>${comingEmpty()}</section>`);
      }
    }
  }

  function injectExplore() {
    const explore = $('#screen-explore');
    if (!explore) return;
    const empty = explore.querySelector('.empty');
    if (empty && !empty.dataset.eaEmpty) {
      empty.dataset.eaEmpty = '1';
      empty.insertAdjacentHTML('beforeend', `
        <p class="muted mt">If the board is thin, that is honest: charters are coming. Captains and charter desks can request an early listing.</p>
        <div class="row mt"><button class="btn soft" type="button" data-action="open-captain-waitlist">Request early listing</button></div>`);
    }
    if (!explore.querySelector('[data-ea-explore]')) {
      const section = explore.querySelector('#explore-captains') || explore.querySelector('.section');
      section?.insertAdjacentHTML('beforeend', `
        <div class="panel ea-cta-card mt" data-ea-explore>
          <span class="eyebrow">Run a boat?</span>
          <h3>Captains can request an early listing.</h3>
          <p class="muted">Early buy-in is a waitlist, not a paid boost and not a fake book-now button. You get in line to be listed first and to tell us what the dock actually needs.</p>
          <button class="btn dark" type="button" data-action="open-captain-waitlist">Join captain waitlist</button>
        </div>`);
    }
  }

  function injectAdmin() {
    const profile = $('#screen-profile');
    if (!profile || !isOperator() || profile.querySelector('[data-ea-admin]')) return;
    const consoleHead = profile.querySelector('.section-head');
    const host = profile.querySelector('.grid.three') || consoleHead?.parentElement;
    if (!host) return;
    const card = `
      <div class="admin-card" data-ea-admin>
        <span class="badge orange">Early access</span>
        <h3>Captain waitlist</h3>
        <p class="muted">Invite captains onto listings. Status is waitlist, invited, or listed. No mass email from the server.</p>
        <div class="row">
          <button class="btn dark small" type="button" data-action="open-captain-invite-queue">Invite queue</button>
          <button class="btn soft small" type="button" data-action="open-captain-waitlist">Preview form</button>
        </div>
      </div>`;
    if (host.classList.contains('grid')) host.insertAdjacentHTML('beforeend', card);
    else host.insertAdjacentHTML('afterbegin', card);
  }

  function injectSurfaces() {
    injectHome();
    injectExplore();
    injectAdmin();
    if (document.getElementById('eaStandalone') && !$('#eaStandalone [data-ea-form]')) {
      openWaitlist();
    }
  }

  function maybeOpenFromUrl() {
    try {
      const path = String(location.pathname || '').replace(/\/+$/, '').toLowerCase();
      const params = new URLSearchParams(location.search);
      if (path === '/early-access' || path === '/captains' || params.get('early') === '1' || params.get('waitlist') === '1') {
        setTimeout(() => openWaitlist({ modal: window.__fishcrewModal }), 240);
      }
    } catch (_) {}
  }

  function onClick(event) {
    const btn = event.target.closest?.('[data-action]');
    if (!btn) return;
    const action = btn.dataset.action;
    if (action === 'save-captain-early-access' || action === 'save-captain-waitlist') {
      event.preventDefault();
      event.stopPropagation();
      saveWaitlist(btn.closest('[data-ea-form]') || document);
      return;
    }
    if (action === 'open-captain-invite-queue') {
      event.preventDefault();
      event.stopPropagation();
      openQueue({ modal: window.__fishcrewModal });
      return;
    }
    if (action === 'invite-captain-waitlist') {
      event.preventDefault();
      event.stopPropagation();
      setStatus(btn.dataset.waitlistId, 'invited');
      return;
    }
    if (action === 'list-captain-waitlist') {
      event.preventDefault();
      event.stopPropagation();
      setStatus(btn.dataset.waitlistId, 'listed');
    }
  }

  window.FishCrewCaptainWaitlist = function (ctx = {}) {
    window.__fishcrewModal = ctx.modal || window.__fishcrewModal;
    window.__fishcrewCloseModal = ctx.closeModal || window.__fishcrewCloseModal;
    if (ctx.toast) window.FishCrewCaptainWaitlistToast = ctx.toast;
    openWaitlist(ctx);
  };
  window.FishCrewCaptainInviteQueue = openQueue;

  document.addEventListener('click', onClick, true);
  const observer = new MutationObserver(() => injectSurfaces());
  if (document.body) observer.observe(document.body, { childList: true, subtree: true });
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      injectSurfaces();
      maybeOpenFromUrl();
    });
  } else {
    injectSurfaces();
    maybeOpenFromUrl();
  }
})();
