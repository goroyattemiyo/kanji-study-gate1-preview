// Scope is limited to this Gate 1 app. Never manage the PoC v0.1.1 cache.
const CACHE = 'kanji-gate1-stage1-v2-design';
const FILES = [
  './', './index.html', './manifest.webmanifest', './assets/app.css',
  './assets/icon-192.png', './assets/icon-512.png',
  './src/main.js', './src/core/clock.js', './src/core/data.js', './src/core/ui.js',
  './src/core/db.js', './src/core/reading.js', './src/core/srs.js', './src/core/stats.js',
  './src/views/home.js', './src/views/learn.js', './src/views/quiz.js',
  './src/views/backup.js', './data/catalog.v1.json', './data/kanjivg-paths.json'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('kanji-gate1-') && k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method!=='GET') return;
  const url=new URL(e.request.url);
  if(url.origin!==self.location.origin || !url.pathname.startsWith(new URL('./',self.registration.scope).pathname))return;
  e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request)));
});
