// Grimório Arcano — service worker
// Estratégia:
//  - index.html, cards.js e manifest: REDE PRIMEIRO (sempre busca a versão nova; usa o cache só se estiver offline)
//  - imagens e ícones: CACHE PRIMEIRO (não mudam, então carregam instantâneo e funcionam offline)
// Não é mais necessário trocar o número da versão a cada deploy. Troque só se quiser forçar a limpeza do cache.
const CACHE='tarot-estudo-v11';
const SHELL=["./","index.html","cards.js","tiragens.js","config.js","auth.js","manifest.webmanifest"];
const STATIC=["vendor/supabase-2.117.2.js","icon-192.png","icon-512.png","img/p100.jpg","img/p102.jpg","img/p104.jpg","img/p106.jpg","img/p108.jpg","img/p11.jpg","img/p110.jpg","img/p112.jpg","img/p114.jpg","img/p116.jpg","img/p118.jpg","img/p120.jpg","img/p122.jpg","img/p124.jpg","img/p126.jpg","img/p128.jpg","img/p13.jpg","img/p130.jpg","img/p132.jpg","img/p134.jpg","img/p136.jpg","img/p138.jpg","img/p140.jpg","img/p142.jpg","img/p144.jpg","img/p146.jpg","img/p148.jpg","img/p15.jpg","img/p150.jpg","img/p152.jpg","img/p154.jpg","img/p156.jpg","img/p158.jpg","img/p17.jpg","img/p19.jpg","img/p21.jpg","img/p23.jpg","img/p25.jpg","img/p27.jpg","img/p29.jpg","img/p3.jpg","img/p31.jpg","img/p33.jpg","img/p35.jpg","img/p37.jpg","img/p39.jpg","img/p41.jpg","img/p43.jpg","img/p45.jpg","img/p48.jpg","img/p5.jpg","img/p50.jpg","img/p52.jpg","img/p54.jpg","img/p56.jpg","img/p58.jpg","img/p60.jpg","img/p62.jpg","img/p64.jpg","img/p66.jpg","img/p68.jpg","img/p7.jpg","img/p70.jpg","img/p72.jpg","img/p74.jpg","img/p76.jpg","img/p78.jpg","img/p80.jpg","img/p82.jpg","img/p84.jpg","img/p86.jpg","img/p88.jpg","img/p9.jpg","img/p90.jpg","img/p92.jpg","img/p94.jpg","img/p96.jpg","img/p98.jpg"];

self.addEventListener('install',e=>{
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(async c=>{
    // o shell é buscado direto da rede (ignorando cache HTTP) para nunca instalar uma cópia velha
    await Promise.all(SHELL.map(u=>fetch(u,{cache:'no-store'}).then(r=>{if(r.ok)return c.put(u,r);}).catch(()=>{})));
    await c.addAll(STATIC).catch(()=>{});
  }));
});

self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});

function isShell(req){
  if(req.mode==='navigate')return true;
  const p=new URL(req.url).pathname;
  return /(\/|\.html|cards\.js|tiragens\.js|config\.js|auth\.js|manifest\.webmanifest)$/.test(p);
}

self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.method!=='GET'||new URL(req.url).origin!==location.origin||new URL(req.url).pathname.startsWith('/.netlify/'))return;
  if(isShell(req)){
    // rede primeiro
    e.respondWith(fetch(req,{cache:'no-store'}).then(res=>{
      if(res.ok){const cp=res.clone();caches.open(CACHE).then(c=>c.put(req,cp));}
      return res;
    }).catch(()=>caches.match(req,{ignoreSearch:true}).then(r=>r||caches.match('./'))));
    return;
  }
  // cache primeiro (imagens, ícones)
  e.respondWith(caches.match(req,{ignoreSearch:true}).then(r=>r||fetch(req).then(res=>{
    if(res.ok){const cp=res.clone();caches.open(CACHE).then(c=>c.put(req,cp));}
    return res;
  })));
});
