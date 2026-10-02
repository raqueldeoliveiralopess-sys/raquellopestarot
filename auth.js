// Grimório Arcano — login por código, assinatura, sincronização do progresso e perfil.
// Fica inativo quando GA_CONFIG.modo é 'desligado' (salvo o modo de teste ligado por link neste aparelho).
(function(){
  const CFG = window.GA_CONFIG || {};
  const VALIDOS = ['login', 'assinantes'];
  // Modo de teste por link: ?modo=login ou ?modo=assinantes liga só neste aparelho; ?modo=desligado desfaz.
  try {
    const url = new URL(location.href), pedido = url.searchParams.get('modo');
    if (pedido) {
      if (VALIDOS.includes(pedido)) localStorage.setItem('ga-modo-teste', pedido);
      else if (pedido === 'desligado') localStorage.removeItem('ga-modo-teste');
      url.searchParams.delete('modo');
      history.replaceState(null, '', url.pathname + url.search + url.hash);
    }
  } catch(e) {}
  let teste = null; try { teste = localStorage.getItem('ga-modo-teste'); } catch(e) {}
  const modo = VALIDOS.includes(teste) ? teste : VALIDOS.includes(CFG.modo) ? CFG.modo : 'desligado';
  const ATIVOS = ['ativa', 'atrasada'];
  const CACHE_KEY = 'ga-acesso';
  const LIB = 'vendor/supabase-2.117.2.js';

  const A = {
    modo,
    enabled: modo !== 'desligado' && !!CFG.supabaseUrl && !!CFG.supabaseAnonKey,
    estado: 'carregando',       // carregando | email | codigo | sem-acesso | ok | erro
    email: '', user: null, perfil: null, erro: '', ocupado: false, sync: 'ok', // sync: ok | enviando | pendente
    linkAssinatura: CFG.linkAssinatura || '',
    onChange: () => {}, getData: () => ({}), applyData: () => {}, limparLocal: () => {},
  };
  let sb = null, pushTimer = null;

  const lerCache = () => { try { return JSON.parse(localStorage.getItem(CACHE_KEY) || 'null'); } catch(e) { return null; } };
  const gravarCache = v => { try { v ? localStorage.setItem(CACHE_KEY, JSON.stringify(v)) : localStorage.removeItem(CACHE_KEY); } catch(e) {} };
  const muda = patch => { Object.assign(A, patch); A.onChange(); };
  const offline = e => !navigator.onLine || /fetch|network|Failed to fetch|NetworkError|Load failed/i.test(String(e && (e.message || e)));

  function carregarLib(){
    if (window.supabase && window.supabase.createClient) return Promise.resolve();
    return new Promise((ok, falha) => { const s = document.createElement('script'); s.src = LIB; s.onload = ok; s.onerror = () => falha(new Error('Failed to fetch biblioteca')); document.head.appendChild(s); });
  }

  // ---------- assinatura ----------
  async function conferirAcesso(user){
    if (A.modo === 'login') return true;
    const { data, error } = await sb.from('assinantes').select('status').eq('email', (user.email || '').toLowerCase()).maybeSingle();
    if (error) throw error;
    return !!data && ATIVOS.includes(data.status);
  }

  async function entrar(user){
    A.user = user; A.email = user.email || A.email;
    let liberado;
    try {
      liberado = await conferirAcesso(user);
      gravarCache({ uid: user.id, email: A.email, ok: liberado, em: Date.now() });
    } catch(e) {
      const c = lerCache(), limite = (CFG.diasOffline || 7) * 864e5;
      if (offline(e) && c && c.uid === user.id && c.ok && Date.now() - c.em < limite) liberado = true;
      else if (offline(e)) return muda({ estado: 'erro', erro: 'Sem internet. Conecte-se uma vez para confirmar sua assinatura.' });
      else return muda({ estado: 'erro', erro: 'Não foi possível conferir sua assinatura agora. Tente de novo em instantes.' });
    }
    if (!liberado) return muda({ estado: 'sem-acesso' });
    muda({ estado: 'ok' });
    carregarPerfil();
    puxar();
  }

  // ---------- sincronização ----------
  async function puxar(){
    if (!sb) return;
    try {
      const { data, error } = await sb.from('progresso').select('dados').eq('user_id', A.user.id).maybeSingle();
      if (error) throw error;
      A.applyData(data && data.dados || null, A.user.id);
      await empurrar();
    } catch(e) { muda({ sync: 'pendente' }); }
  }
  async function empurrar(){
    if (!sb || !A.user || A.estado !== 'ok') return;
    muda({ sync: 'enviando' });
    try {
      const { error } = await sb.from('progresso').upsert({ user_id: A.user.id, dados: A.getData(), atualizado_em: new Date().toISOString() });
      if (error) throw error;
      muda({ sync: 'ok' });
    } catch(e) { muda({ sync: 'pendente' }); }
  }
  A.agendarEnvio = () => {
    if (!A.enabled || A.estado !== 'ok') return;
    clearTimeout(pushTimer); pushTimer = setTimeout(empurrar, 2000);
  };
  window.addEventListener('online', () => {
    if (!sb) { if (A.enabled) A.iniciar({}); return; }
    if (A.estado === 'ok') puxar(); else if (A.estado === 'erro' && A.user) entrar(A.user);
  });

  // ---------- perfil ----------
  async function carregarPerfil(){
    try {
      const { data } = await sb.from('perfis').select('nome,bio,foto_url').eq('id', A.user.id).maybeSingle();
      muda({ perfil: data || { nome: '', bio: '', foto_url: '' } });
    } catch(e) { if (!A.perfil) muda({ perfil: { nome: '', bio: '', foto_url: '' } }); }
  }
  function reduzirFoto(file){
    return new Promise((ok, falha) => {
      const img = new Image(), url = URL.createObjectURL(file);
      img.onload = () => {
        const L = 256, c = document.createElement('canvas'); c.width = c.height = L;
        const s = Math.min(img.width, img.height), x = (img.width - s) / 2, y = (img.height - s) / 2;
        c.getContext('2d').drawImage(img, x, y, s, s, 0, 0, L, L); URL.revokeObjectURL(url);
        c.toBlob(b => b ? ok(b) : falha(new Error('foto')), 'image/jpeg', 0.85);
      };
      img.onerror = () => { URL.revokeObjectURL(url); falha(new Error('Não deu para ler essa foto.')); };
      img.src = url;
    });
  }
  A.salvarPerfil = async ({ nome, bio, foto }) => {
    muda({ ocupado: true, erro: '' });
    try {
      let foto_url = A.perfil && A.perfil.foto_url || '';
      if (foto) {
        const blob = await reduzirFoto(foto), caminho = A.user.id + '/avatar.jpg';
        const { error } = await sb.storage.from('avatares').upload(caminho, blob, { upsert: true, contentType: 'image/jpeg' });
        if (error) throw error;
        foto_url = sb.storage.from('avatares').getPublicUrl(caminho).data.publicUrl + '?v=' + Date.now();
      }
      const perfil = { id: A.user.id, nome: (nome || '').trim().slice(0, 60), bio: (bio || '').trim().slice(0, 160), foto_url, atualizado_em: new Date().toISOString() };
      const { error } = await sb.from('perfis').upsert(perfil);
      if (error) throw error;
      muda({ perfil, ocupado: false });
      return true;
    } catch(e) {
      muda({ ocupado: false, erro: offline(e) ? 'Sem internet. Tente de novo quando conectar.' : (e.message || 'Não foi possível salvar.') });
      return false;
    }
  };

  // ---------- login ----------
  A.enviarCodigo = async email => {
    email = String(email || '').trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return muda({ erro: 'Confira o e-mail.' });
    muda({ ocupado: true, erro: '', email });
    const { error } = await sb.auth.signInWithOtp({ email, options: { shouldCreateUser: true } });
    if (error) return muda({ ocupado: false, erro: offline(error) ? 'Sem internet.' : /rate|limit|seconds/i.test(error.message) ? 'Muitas tentativas. Espere um minuto e peça outro código.' : 'Não foi possível enviar o código. Tente de novo.' });
    muda({ ocupado: false, estado: 'codigo' });
  };
  A.validarCodigo = async codigo => {
    codigo = String(codigo || '').replace(/\D/g, '');
    if (codigo.length < 6) return muda({ erro: 'O código tem pelo menos 6 números.' });
    muda({ ocupado: true, erro: '' });
    const { data, error } = await sb.auth.verifyOtp({ email: A.email, token: codigo, type: 'email' });
    if (error || !data || !data.user) return muda({ ocupado: false, erro: offline(error) ? 'Sem internet.' : 'Código inválido ou vencido. Confira ou peça outro.' });
    muda({ ocupado: false, estado: 'carregando' });
    await entrar(data.user);
  };
  A.trocarEmail = () => muda({ estado: 'email', erro: '' });
  A.tentarDeNovo = () => { if (A.user) { muda({ estado: 'carregando', erro: '' }); entrar(A.user); } else muda({ estado: 'email', erro: '' }); };
  A.sair = async () => {
    clearTimeout(pushTimer);
    if (A.estado === 'ok') await empurrar();
    try { await sb.auth.signOut(); } catch(e) {}
    gravarCache(null);
    A.limparLocal();
    muda({ estado: 'email', user: null, perfil: null, erro: '' });
  };

  A.iniciar = async (hooks) => {
    Object.assign(A, hooks);
    if (!A.enabled) return;
    try {
      await carregarLib();
      sb = window.supabase.createClient(CFG.supabaseUrl, CFG.supabaseAnonKey, { auth: { persistSession: true, autoRefreshToken: true, storageKey: 'ga-sessao' } });
      const { data } = await sb.auth.getSession();
      const user = data && data.session && data.session.user;
      if (user) await entrar(user); else muda({ estado: 'email' });
    } catch(e) {
      const c = lerCache(), limite = (CFG.diasOffline || 7) * 864e5;
      if (c && c.ok && Date.now() - c.em < limite) { A.user = { id: c.uid, email: c.email }; A.email = c.email; muda({ estado: 'ok', sync: 'pendente' }); return; }
      muda({ estado: 'erro', erro: offline(e) ? 'Sem internet. Conecte-se para entrar pela primeira vez.' : 'Não foi possível iniciar o login.' });
    }
  };

  window.GA_AUTH = A;
})();
