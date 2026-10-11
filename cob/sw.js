// COB — service worker (escopo /cob/, separado do Grimório)
// index.html e manifest: rede primeiro. Scripts com ?v=N, ícones e fontes: cache primeiro.
// Ao mudar lua.js, biblioteca.js ou aulas.js, suba o ?v= no index.html e o CACHE aqui.
const CACHE='cob-v2';
const SHELL=['./','index.html','config.js','manifest.webmanifest'];
const STATIC=['lua.js?v=1','biblioteca.js?v=1','aulas.js?v=1','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(async c=>{
    await Promise.all(SHELL.map(u=>fetch(u,{cache:'no-cache'}).then(r=>{if(r.ok)return c.put(u,r);}).catch(()=>{})));
    await c.addAll(STATIC).catch(()=>{});
  }));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('cob-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  const req=e.request, url=new URL(req.url);
  if(req.method!=='GET')return;
  const local=url.origin===location.origin;
  if(local&&!url.pathname.startsWith('/cob/'))return;
  if(local&&(req.mode==='navigate'||/(\/|\.html|config\.js|manifest\.webmanifest)$/.test(url.pathname))){
    e.respondWith(fetch(req,{cache:'no-cache'}).then(res=>{if(res.ok){const cp=res.clone();caches.open(CACHE).then(c=>c.put(req,cp));}return res;})
      .catch(()=>caches.match(req,{ignoreSearch:true}).then(r=>r||caches.match('./'))));
    return;
  }
  if(!local&&!/fonts\.(googleapis|gstatic)\.com$/.test(url.hostname))return;
  e.respondWith(caches.match(req).then(r=>r||fetch(req).then(res=>{if(res.ok||res.type==='opaque'){const cp=res.clone();caches.open(CACHE).then(c=>c.put(req,cp));}return res;})));
});
