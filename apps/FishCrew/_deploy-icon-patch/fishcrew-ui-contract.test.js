const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');

const navMarkup = html.match(/<nav class="bottom-nav"[\s\S]*?<\/nav>/)?.[0] || '';
const navDestinations = [...navMarkup.matchAll(/data-screen="([^"]+)"/g)].map((match) => match[1]);

assert.deepEqual(navDestinations, ['home', 'explore', 'crew', 'feed', 'more']);
assert.match(html, /id="screen-more"/);
assert.doesNotMatch(navMarkup, /data-screen="(?:tools|profile)"/);
assert.match(app, /function renderMore\(\)/);
assert.match(app, /data-screen="tools"/);
assert.match(app, /data-screen="profile"/);
assert.match(app, /\['tools', 'profile'\]\.includes\(screen\) \? 'more' : screen/);
assert.match(css, /\.bottom-nav\{grid-template-columns:repeat\(5,minmax\(0,1fr\)\)\}/);
assert.match(css, /env\(safe-area-inset-bottom,0px\)/);
assert.match(css, /--muted:#bad1dc/);
assert.match(css, /\.nav-btn b\{font-size:12px/);
assert.match(css, /--radius-control:10px/);
assert.match(css, /--radius-card:12px/);
assert.match(css, /--radius-feature:14px/);
assert.match(css, /--elevation-flat:none/);
assert.match(css, /--elevation-card:0 8px 22px rgba\(0,0,0,.20\)/);
assert.match(css, /--elevation-feature:0 14px 34px rgba\(0,0,0,.28\)/);
assert.match(css, /--button-primary:linear-gradient\(135deg,var\(--teal\),var\(--ocean\)\)/);
assert.match(css, /\.panel,\s*\.trip-card,\s*\.feed-card,[\s\S]*?border-radius:var\(--radius-card\)!important/);
assert.match(css, /\.btn\{[\s\S]*?min-height:44px;[\s\S]*?box-shadow:var\(--elevation-flat\)!important/);

console.log('FishCrew UI contract passed: five destinations, More routing, safe-area dock, readable nav copy, and canonical component tokens.');
