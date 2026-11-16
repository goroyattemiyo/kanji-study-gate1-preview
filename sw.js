const CACHE='kanji-gate1-v040';
// Replaced by the Vite build plugin. Only the small shell is precached.
const FILES=["./NOTICE.md","./assets/adapter-CVd2-1Ul.js","./assets/backup-byn0pCQ_.js","./assets/fonts/OFL.txt","./assets/fonts/subset-manifest.json","./assets/home-CAWz2SCM.js","./assets/icon-192-B5pu2p-A.png","./assets/icon-192.png","./assets/icon-512.png","./assets/icon-home-CiqIkRy3.png","./assets/index-CrQYpDWI.css","./assets/index-p5MsQwWA.js","./assets/learn-6Jz0l35v.js","./assets/manifest-wS6QvbmK.webmanifest","./assets/paper-xZLHrlZ4.js","./assets/quiz-BVtlZ4EC.js","./assets/settings-DHEiwC1x.js","./assets/v040/badge-bronze.png","./assets/v040/badge-gold.png","./assets/v040/badge-silver.png","./assets/v040/coin.png","./assets/v040/icon-cards.png","./assets/v040/icon-home.png","./assets/v040/icon-paper.png","./assets/v040/icon-progress.png","./assets/v040/icon-reading.png","./assets/v040/icon-review.png","./assets/v040/icon-settings.png","./assets/v040/icon-weak.png","./assets/v040/icon-writing.png","./assets/weak-QrxsNTOC.js","./assets/welcome-D7gdVTUm.js","./assets/write-DWO_w7-O.js","./assets/zen-kaku-700-subset-CKwp3qvt.woff2","./assets/zen-kaku-900-subset-BxQaskkT.woff2","./data/catalog.v1.json","./data/kanjivg-extra-r20250816.json","./data/kanjivg-paths.json","./index.html","./manifest.webmanifest","./third-party/LICENSE-THIRD-PARTY.txt","./"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('kanji-gate1-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET')return;const url=new URL(e.request.url);
 if(url.origin!==self.location.origin||!url.pathname.startsWith(new URL('./',self.registration.scope).pathname))return;
 e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request).then(response=>{
  if(response.ok&&response.type==='basic'){const clone=response.clone();void caches.open(CACHE).then(cache=>cache.put(e.request,clone)).catch(()=>{});}
  return response;
 })));
});
