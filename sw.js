/* Cube Fight — cache offline da versão 8.0 */
const CACHE_NAME='cube-fight-v8-20261112';
const FILES=[
  './', './index.html', './manifest.webmanifest',
  './assets/favicon.svg','./assets/icon-180.png','./assets/icon-192.png',
  './assets/cube-fight-fullscreen.webp','./assets/cube-fight-portrait.webp',
  './assets/Cube_Fight_Armas_Sprites.png','./assets/Cube_Fight_Projeteis_Sprites.png'
];
self.addEventListener('install',event=>{
 event.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
 event.waitUntil(Promise.all([
   caches.keys().then(names=>Promise.all(names.filter(n=>n.startsWith('cube-fight-')&&n!==CACHE_NAME).map(n=>caches.delete(n)))),
   self.clients.claim()
 ]));
});
self.addEventListener('fetch',event=>{
 const req=event.request;
 if(req.method!=='GET'||new URL(req.url).origin!==self.location.origin)return;
 if(req.mode==='navigate'){
  event.respondWith(fetch(req).then(res=>{
   if(res.ok){const copy=res.clone();caches.open(CACHE_NAME).then(c=>c.put('./index.html',copy));}
   return res;
  }).catch(()=>caches.match('./index.html')));
  return;
 }
 event.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(res=>{
  if(res.ok){const copy=res.clone();caches.open(CACHE_NAME).then(c=>c.put(req,copy));}
  return res;
 })));
});
