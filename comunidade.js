// Grimório Arcano — Comunidade: leitura e escrita de posts, comentários, curtidas e fotos.
// Usa o mesmo cliente do Supabase do login (GA_AUTH.cliente()). As permissões ficam no banco (supabase/comunidade.sql).
(function(){
  const POR_PAGINA = 20;
  const TEMAS = [
    { id: 'estudo',    label: 'Estudo de carta' },
    { id: 'tiragem',   label: 'Tiragem' },
    { id: 'duvida',    label: 'Dúvida' },
    { id: 'reflexao',  label: 'Reflexão' },
    { id: 'achadinho', label: 'Achadinho' }
  ];

  const A = () => window.GA_AUTH;
  function cliente(){
    const sb = A() && A().cliente && A().cliente();
    if (!sb || !A().uid()) throw amigavel('Sem internet. A comunidade precisa de conexão.');
    return sb;
  }
  const amigavel = (msg, extra) => Object.assign(new Error(msg), { amigavel: true }, extra || {});
  // Mensagens em português para os erros mais comuns
  function traduz(e){
    if (e && e.amigavel) return e;
    const msg = String(e && (e.message || e.error_description || e.error) || e || '');
    const code = e && e.code;
    console.error('Comunidade:', e);
    if (!navigator.onLine || /Failed to fetch|NetworkError|Load failed/i.test(msg)) return amigavel('Sem internet. Tente de novo quando conectar.');
    if (code === 'PGRST205' || code === '42P01' || /Could not find the table|does not exist|relation .* does not exist/i.test(msg)) return amigavel('A comunidade ainda está sendo preparada. Volte daqui a pouco.', { preparando: true });
    if (code === '42501' || /row-level security|permission denied|violates/i.test(msg)) return amigavel('Você não tem permissão para fazer isso. Se acha que é um engano, fale com a Raquel.');
    if (/check constraint|too long|value too long/i.test(msg)) return amigavel('O texto passou do tamanho permitido.');
    return amigavel('Algo deu errado. Tente de novo.');
  }
  const conta = v => Array.isArray(v) && v[0] && typeof v[0].count === 'number' ? v[0].count : 0;

  async function listar({ tema, offset }){
    try {
      const sb = cliente();
      let q = sb.from('posts')
        .select('id,tema,texto,foto_url,fixado,criado_em,autor,perfil:perfis(nome,foto_url),comentarios(count),curtidas(count)')
        .order('fixado', { ascending: false })
        .order('criado_em', { ascending: false })
        .range(offset || 0, (offset || 0) + POR_PAGINA - 1);
      if (tema && tema !== 'todos') q = q.eq('tema', tema);
      const { data, error } = await q;
      if (error) throw error;
      const posts = (data || []).map(p => ({
        id: p.id, tema: p.tema, texto: p.texto, foto_url: p.foto_url, fixado: !!p.fixado, criado_em: p.criado_em, autor: p.autor,
        perfil: p.perfil || {}, nComentarios: conta(p.comentarios), nCurtidas: conta(p.curtidas), curti: false
      }));
      if (posts.length) {
        const { data: minhas, error: e2 } = await sb.from('curtidas').select('post_id').eq('user_id', A().uid()).in('post_id', posts.map(p => p.id));
        if (!e2 && minhas) { const set = new Set(minhas.map(m => m.post_id)); posts.forEach(p => { p.curti = set.has(p.id); }); }
      }
      return { posts, fim: posts.length < POR_PAGINA };
    } catch(e) { throw traduz(e); }
  }

  async function publicar({ tema, texto, foto }){
    try {
      const sb = cliente(), uid = A().uid();
      let foto_url = null;
      if (foto) {
        const blob = await A().reduzirFoto(foto, { lado: 1280, quadrado: false, qualidade: 0.82 });
        const caminho = uid + '/' + Date.now() + '-' + Math.random().toString(36).slice(2, 8) + '.jpg';
        const { error } = await sb.storage.from('comunidade').upload(caminho, blob, { contentType: 'image/jpeg' });
        if (error) throw error;
        foto_url = sb.storage.from('comunidade').getPublicUrl(caminho).data.publicUrl;
      }
      const { error } = await sb.from('posts').insert({ autor: uid, tema, texto: String(texto).trim().slice(0, 2000), foto_url });
      if (error) throw error;
      return true;
    } catch(e) { throw traduz(e); }
  }

  async function comentarios(postId){
    try {
      const { data, error } = await cliente().from('comentarios')
        .select('id,texto,criado_em,autor,perfil:perfis(nome,foto_url)')
        .eq('post_id', postId).order('criado_em', { ascending: true }).limit(200);
      if (error) throw error;
      return (data || []).map(c => ({ ...c, perfil: c.perfil || {} }));
    } catch(e) { throw traduz(e); }
  }

  async function comentar(postId, texto){
    try {
      const { error } = await cliente().from('comentarios').insert({ post_id: postId, autor: A().uid(), texto: String(texto).trim().slice(0, 1000) });
      if (error) throw error;
      return true;
    } catch(e) { throw traduz(e); }
  }

  async function curtir(postId, ligar){
    try {
      const sb = cliente(), uid = A().uid();
      const { error } = ligar
        ? await sb.from('curtidas').insert({ post_id: postId, user_id: uid })
        : await sb.from('curtidas').delete().eq('post_id', postId).eq('user_id', uid);
      if (error && !(ligar && error.code === '23505')) throw error; // curtida repetida não é erro
      return true;
    } catch(e) { throw traduz(e); }
  }

  function caminhoDaFoto(url){
    const m = /\/object\/public\/comunidade\/(.+)$/.exec(url || '');
    return m ? decodeURIComponent(m[1].split('?')[0]) : null;
  }
  async function apagarPost(post){
    try {
      const sb = cliente();
      const { error } = await sb.from('posts').delete().eq('id', post.id);
      if (error) throw error;
      const cam = caminhoDaFoto(post.foto_url);
      if (cam) { try { await sb.storage.from('comunidade').remove([cam]); } catch(e) {} }
      return true;
    } catch(e) { throw traduz(e); }
  }
  async function apagarComentario(id){
    try { const { error } = await cliente().from('comentarios').delete().eq('id', id); if (error) throw error; return true; }
    catch(e) { throw traduz(e); }
  }
  async function fixar(postId, ligar){
    try { const { error } = await cliente().from('posts').update({ fixado: !!ligar }).eq('id', postId); if (error) throw error; return true; }
    catch(e) { throw traduz(e); }
  }
  async function bloquear(userId){
    try {
      const { error } = await cliente().from('bloqueadas').insert({ user_id: userId });
      if (error && error.code !== '23505') throw error;
      return true;
    } catch(e) { throw traduz(e); }
  }

  window.GA_COM = { TEMAS, POR_PAGINA, listar, publicar, comentarios, comentar, curtir, apagarPost, apagarComentario, fixar, bloquear };
})();
