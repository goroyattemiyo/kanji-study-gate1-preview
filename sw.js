const CACHE='kanji-gate1-v090';
// Replaced by the Vite build plugin. Only the small shell is precached.
const FILES=["./NOTICE.md","./assets/adapter-yTr_9PMg.js","./assets/advice-D8q0ZnVW.js","./assets/algorithm-Dy08ZbSb.js","./assets/audio-BKw3yuUX.js","./assets/backup-DTv86igV.js","./assets/card-practice-BelJFwXo.js","./assets/card-practice-judge-TGCiKe15.js","./assets/collection-ZsCvYJk5.js","./assets/downloads-2SdAZpPd.js","./assets/expanded-writing-judge-DcKBUiD-.js","./assets/fonts/OFL.txt","./assets/fonts/subset-manifest.json","./assets/home-e4FgXpIf.js","./assets/icon-192-B5pu2p-A.png","./assets/icon-192.png","./assets/icon-512.png","./assets/icon-home-CiqIkRy3.png","./assets/index-BBBL7kon.css","./assets/index-DN6Yx6nR.js","./assets/kanjivg-BrmYDoDU.js","./assets/learn-BoGHhkSR.js","./assets/library-37eFgLZp.js","./assets/manifest-wS6QvbmK.webmanifest","./assets/mock-exam-6F4NuRRD.js","./assets/mock-exam-BorRlj2B.js","./assets/paper-Dda88dPa.js","./assets/quiz-C_NjWg_R.js","./assets/reading-CdRyeeeb.js","./assets/settings-Bbj54wmU.js","./assets/shop-CjR1RaTf.js","./assets/v040/badge-bronze.png","./assets/v040/badge-gold.png","./assets/v040/badge-silver.png","./assets/v040/coin.png","./assets/v040/icon-cards.png","./assets/v040/icon-home.png","./assets/v040/icon-paper.png","./assets/v040/icon-progress.png","./assets/v040/icon-reading.png","./assets/v040/icon-review.png","./assets/v040/icon-settings.png","./assets/v040/icon-weak.png","./assets/v040/icon-writing.png","./assets/v050/icon-library.png","./assets/v050/icon-shop.png","./assets/v050/pack2/icon-cards.png","./assets/v050/pack2/icon-home.png","./assets/v050/pack2/icon-paper.png","./assets/v050/pack2/icon-progress.png","./assets/v050/pack2/icon-reading.png","./assets/v050/pack2/icon-review.png","./assets/v050/pack2/icon-settings.png","./assets/v050/pack2/icon-weak.png","./assets/v050/pack2/icon-writing.png","./assets/v070/avatars/star.png","./assets/v070/avatars/study.png","./assets/v070/badge-platinum.png","./assets/v070/badge-rainbow.png","./assets/v070/ornaments/crown.png","./assets/v070/ornaments/hat.png","./assets/v070/ornaments/ribbon.png","./assets/v070/pack3/icon-cards.png","./assets/v070/pack3/icon-home.png","./assets/v070/pack3/icon-paper.png","./assets/v070/pack3/icon-progress.png","./assets/v070/pack3/icon-reading.png","./assets/v070/pack3/icon-review.png","./assets/v070/pack3/icon-settings.png","./assets/v070/pack3/icon-weak.png","./assets/v070/pack3/icon-writing.png","./assets/v070/previews/forest.png","./assets/v070/previews/night.png","./assets/v070/previews/sakura.png","./assets/v070/previews/sunset.png","./assets/weak-DLORn_jU.js","./assets/weakness-BKT_0OL2.js","./assets/welcome-CyVeXG9p.js","./assets/write-BX8XSOr9.js","./assets/writing-drafts-DNVhyIry.js","./assets/zen-kaku-700-subset-Zqzy-V2e.woff2","./assets/zen-kaku-900-subset-BTDxc2kT.woff2","./data/catalog.v1.json","./data/kanjivg-extra-r20250816.json","./data/kanjivg-paths.json","./data/study-cards/manifest.json","./data/study-cards/小1.json","./data/study-cards/小2.json","./data/study-cards/小3.json","./data/study-cards/小4.json","./data/study-cards/小5.json","./data/study-cards/小6.json","./index.html","./manifest.webmanifest","./third-party/LICENSE-THIRD-PARTY.txt","./"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('kanji-gate1-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET')return;const url=new URL(e.request.url);
 if(url.origin!==self.location.origin||!url.pathname.startsWith(new URL('./',self.registration.scope).pathname))return;
 // Review flags must be activated by replacing DATA only, without a new JS/SW.
 // Network-first for these files; offline uses only an already visited copy.
 if(url.pathname.includes('/data/reading-drafts/')||url.pathname.includes('/data/writing-drafts/')){
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
