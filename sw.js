// Grimório Arcano — service worker
// Estratégia:
//  - index.html, config.js e manifest: REDE PRIMEIRO com revalidação (cache:'no-cache' → a Netlify responde 304 sem corpo quando nada mudou)
//  - cards.js, tiragens.js, diario.js, auth.js, comunidade.js: CACHE PRIMEIRO; o index.html pede cada um com ?v=N, então uma versão nova é um arquivo novo
//  - imagens, ícones e vendor: CACHE PRIMEIRO, guardados na primeira vez que são vistos (nada de baixar as 78 cartas na instalação)
// Quando mudar um dos arquivos versionados, suba o ?v= no index.html e o CACHE aqui (mesmo número).
const CACHE='tarot-estudo-v34';
const SHELL=["./","index.html","config.js","manifest.webmanifest"];
const STATIC=["vendor/supabase-2.117.2.js","icon-192.png","icon-512.png"];

self.addEventListener('install',e=>{
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(async c=>{
    // o shell é revalidado na rede (304 quando não mudou) para nunca instalar uma cópia velha
    await Promise.all(SHELL.map(u=>fetch(u,{cache:'no-cache'}).then(r=>{if(r.ok)return c.put(u,r);}).catch(()=>{})));
    await c.addAll(STATIC).catch(()=>{});
  }));
});

self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});

function isShell(req){
  if(req.mode==='navigate')return true;
  const p=new URL(req.url).pathname;
  return /(\/|\.html|config\.js|manifest\.webmanifest)$/.test(p);
}

self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.method!=='GET'||new URL(req.url).origin!==location.origin||new URL(req.url).pathname.startsWith('/.netlify/'))return;
  if(isShell(req)){
    // rede primeiro
    e.respondWith(fetch(req,{cache:'no-cache'}).then(res=>{
      if(res.ok){const cp=res.clone();caches.open(CACHE).then(c=>c.put(req,cp));}
      return res;
    }).catch(()=>caches.match(req,{ignoreSearch:true}).then(r=>r||caches.match('./'))));
    return;
  }
  // cache primeiro (scripts versionados, imagens, ícones, vendor); a query faz parte da chave
  e.respondWith(caches.match(req).then(r=>r||fetch(req).then(res=>{
    if(res.ok){const cp=res.clone();caches.open(CACHE).then(c=>c.put(req,cp));}
    return res;
  })));
});
