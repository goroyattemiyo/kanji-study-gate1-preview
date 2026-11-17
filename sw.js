const CACHE='kanji-gate1-v084';
// Replaced by the Vite build plugin. Only the small shell is precached.
const FILES=["./NOTICE.md","./assets/adapter-DOgm5vqH.js","./assets/advice-CbwM2suI.js","./assets/algorithm-C14iBjMy.js","./assets/audio-BKw3yuUX.js","./assets/backup-D-xmc1Cq.js","./assets/card-practice-BdnjipKf.js","./assets/card-practice-judge-14S7LOr6.js","./assets/collection-GFDmg6eA.js","./assets/downloads-DjMkkmvO.js","./assets/fonts/OFL.txt","./assets/fonts/subset-manifest.json","./assets/home-CnNj2O29.js","./assets/icon-192-B5pu2p-A.png","./assets/icon-192.png","./assets/icon-512.png","./assets/icon-home-CiqIkRy3.png","./assets/index-BNyamq8K.js","./assets/index-DGPpVGUR.css","./assets/kanjivg-BrmYDoDU.js","./assets/learn-DEMAEEGo.js","./assets/library-woepOZ_C.js","./assets/manifest-wS6QvbmK.webmanifest","./assets/paper-Cq6hV6-H.js","./assets/quiz-h25BcES4.js","./assets/settings-DlGQJVwa.js","./assets/shop-DSKfD5fN.js","./assets/v040/badge-bronze.png","./assets/v040/badge-gold.png","./assets/v040/badge-silver.png","./assets/v040/coin.png","./assets/v040/icon-cards.png","./assets/v040/icon-home.png","./assets/v040/icon-paper.png","./assets/v040/icon-progress.png","./assets/v040/icon-reading.png","./assets/v040/icon-review.png","./assets/v040/icon-settings.png","./assets/v040/icon-weak.png","./assets/v040/icon-writing.png","./assets/v050/icon-library.png","./assets/v050/icon-shop.png","./assets/v050/pack2/icon-cards.png","./assets/v050/pack2/icon-home.png","./assets/v050/pack2/icon-paper.png","./assets/v050/pack2/icon-progress.png","./assets/v050/pack2/icon-reading.png","./assets/v050/pack2/icon-review.png","./assets/v050/pack2/icon-settings.png","./assets/v050/pack2/icon-weak.png","./assets/v050/pack2/icon-writing.png","./assets/v070/avatars/star.png","./assets/v070/avatars/study.png","./assets/v070/badge-platinum.png","./assets/v070/badge-rainbow.png","./assets/v070/ornaments/crown.png","./assets/v070/ornaments/hat.png","./assets/v070/ornaments/ribbon.png","./assets/v070/pack3/icon-cards.png","./assets/v070/pack3/icon-home.png","./assets/v070/pack3/icon-paper.png","./assets/v070/pack3/icon-progress.png","./assets/v070/pack3/icon-reading.png","./assets/v070/pack3/icon-review.png","./assets/v070/pack3/icon-settings.png","./assets/v070/pack3/icon-weak.png","./assets/v070/pack3/icon-writing.png","./assets/v070/previews/forest.png","./assets/v070/previews/night.png","./assets/v070/previews/sakura.png","./assets/v070/previews/sunset.png","./assets/weak-DHaIlmyT.js","./assets/welcome-Bl0wQyzX.js","./assets/write-CvN-A0JG.js","./assets/zen-kaku-700-subset-DGEtdlL0.woff2","./assets/zen-kaku-900-subset-C34THo4c.woff2","./data/catalog.v1.json","./data/kanjivg-extra-r20250816.json","./data/kanjivg-paths.json","./data/study-cards/manifest.json","./data/study-cards/小1.json","./data/study-cards/小2.json","./data/study-cards/小3.json","./data/study-cards/小4.json","./data/study-cards/小5.json","./data/study-cards/小6.json","./index.html","./manifest.webmanifest","./third-party/LICENSE-THIRD-PARTY.txt","./"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('kanji-gate1-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET')return;const url=new URL(e.request.url);
 if(url.origin!==self.location.origin||!url.pathname.startsWith(new URL('./',self.registration.scope).pathname))return;
 // Review flags must be activated by replacing DATA only, without a new JS/SW.
 // Network-first for these files; offline uses only an already visited copy.
 if(url.pathname.includes('/data/reading-drafts/')){
  e.respondWith(fetch(e.request).then(response=>{
   if(response.ok&&response.type==='basic'){
    const clone=response.clone();void caches.open(CACHE).then(c=>c.put(e.request,clone)).catch(()=>{});
   }
   return response;
  }).catch(async()=>await caches.match(e.request)||Response.error()));
  return;
 }
 e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request).then(response=>{
  if(response.ok&&response.type==='basic'){const clone=response.clone();void caches.open(CACHE).then(cache=>cache.put(e.request,clone)).catch(()=>{});}
  return response;
 })));
});
