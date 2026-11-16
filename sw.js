const CACHE='kanji-gate1-stage2-v1';
// Replaced by the Vite build plugin. Only the small shell is precached.
const FILES=["./NOTICE.md","./assets/adapter-BlxpzSt2.js","./assets/backup-7RV70Kbq.js","./assets/home-BuPamwb7.js","./assets/icon-192-BVJnTmLg.png","./assets/icon-192.png","./assets/icon-512.png","./assets/index-DaIjBLaZ.css","./assets/index-b3xnrE0s.js","./assets/learn-CKZajVtY.js","./assets/manifest-61ARrsPA.webmanifest","./assets/paper-rF-fNoXU.js","./assets/quiz-B0yUkGt4.js","./assets/weak-Cyy8YJ5Y.js","./assets/write-wTTHcWX2.js","./data/catalog.v1.json","./data/kanjivg-extra-r20250816.json","./data/kanjivg-paths.json","./index.html","./manifest.webmanifest","./third-party/LICENSE-THIRD-PARTY.txt","./"];
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
