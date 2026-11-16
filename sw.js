const CACHE='kanji-gate1-stage2-v031';
// Replaced by the Vite build plugin. Only the small shell is precached.
const FILES=["./NOTICE.md","./assets/adapter-BVngppVM.js","./assets/backup-CewaTibA.js","./assets/fonts/OFL.txt","./assets/fonts/subset-manifest.json","./assets/home-CNQr749i.js","./assets/icon-192-B5pu2p-A.png","./assets/icon-192.png","./assets/icon-512.png","./assets/index-BDmF2S7y.js","./assets/index-VK-XPSPs.css","./assets/learn-BVEaydGm.js","./assets/manifest-wS6QvbmK.webmanifest","./assets/paper-C-kpt4cq.js","./assets/quiz-uJw2Xq-Z.js","./assets/weak-DaUQU1xt.js","./assets/write-9wu_sggf.js","./assets/zen-kaku-700-subset-qVnCc8df.woff2","./assets/zen-kaku-900-subset-BZ5LAbQE.woff2","./data/catalog.v1.json","./data/kanjivg-extra-r20250816.json","./data/kanjivg-paths.json","./index.html","./manifest.webmanifest","./third-party/LICENSE-THIRD-PARTY.txt","./"];
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
