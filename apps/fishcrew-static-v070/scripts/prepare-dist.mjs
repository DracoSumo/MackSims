#!/usr/bin/env node
import { cpSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

const files = [
  'index.html',
  'manifest.webmanifest',
  'styles.css',
  'app.js',
  'config.js',
  'service-worker.js',
  'privacy.html',
  'terms.html',
  'support.html',
  'favicon.svg',
  'favicon-16.png',
  'favicon-32.png',
  'apple-touch-icon.png',
  'icon-192.png',
  'icon-512.png'
];

for (const file of files) {
  const src = join(root, file);
  if (!existsSync(src)) {
    console.warn(`skip missing ${file}`);
    continue;
  }
  cpSync(src, join(dist, file));
}

console.log(`FishCrew dist prepared at ${dist}`);
