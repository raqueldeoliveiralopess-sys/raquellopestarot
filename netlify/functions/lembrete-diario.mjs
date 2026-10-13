// Grimório Arcano — lembrete diário por e-mail (função agendada da Netlify)
// Roda todo dia às 11:00 UTC (8h em Brasília). Para cada assinante com o lembrete ligado no perfil,
// envia pela Brevo um e-mail curto com a carta do dia, a pergunta de reflexão e quantas cartas esperam revisão.
//
// Variáveis de ambiente (Site configuration > Environment variables):
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, BREVO_API_KEY   obrigatórias (as mesmas do webhook da Kiwify)
//   APP_URL            (opcional) padrão https://ogrimorioarcano.netlify.app
//   EMAIL_REMETENTE    (opcional) padrão nao-responda@raquellopestarot.com.br
//   EMAIL_RESPOSTA     (opcional) e-mail para a aluna responder
//   LEMBRETE_SECRET    (opcional) segredo do link de descadastro; sem ele, usa a chave de serviço
// Banco: supabase/lembretes.sql (coluna perfis.lembrete e função lembretes_pendentes).
import crypto from 'node:crypto';
import fs from 'node:fs';

export const config = { schedule: '0 11 * * *' };

const APP = () => (process.env.APP_URL || 'https://ogrimorioarcano.netlify.app').replace(/\/$/, '');
const escHtml = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// Carrega cards.js e diario.js do próprio app (netlify.toml inclui os dois arquivos no pacote da função)
function carregarApp() {
  const g = {};
  for (const f of ['cards.js', 'diario.js']) {
    let code = null;
    for (const cand of [new URL('../../' + f, import.meta.url), new URL('./' + f, import.meta.url)]) {
      try { code = fs.readFileSync(cand, 'utf8'); break; } catch {}
    }
    if (!code) throw new Error('não achei ' + f);
    new Function('window', 'globalThis', code)(g, g);
  }
  return { CARDS: g.TAROT_CARDS || [], DIARIO: g.GA_DIARIO };
}

// Dia de hoje em Brasília, no formato AAAA-MM-DD (o mesmo que o app usa no aparelho)
export const hojeSP = (d = new Date()) => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
const diaSP = ts => hojeSP(new Date(ts));

export const tokenSaida = uid => crypto.createHmac('sha256', process.env.LEMBRETE_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || '').update(String(uid)).digest('hex').slice(0, 32);

// Resumo do progresso guardado na nuvem (mesmas regras do app)
export function resumo(dados, agora = Date.now()) {
  const srs = dados && dados.srs && typeof dados.srs === 'object' ? dados.srs : {};
  let revisar = 0; for (const k in srs) { const r = srs[k]; if (r && typeof r === 'object' && (r.due || 0) <= agora) revisar++; }
  const dias = new Set(Object.keys((dados && dados.diasEstudo) || {}));
  for (const h of (dados && dados.flashHistory) || []) if (h && h.at) dias.add(diaSP(h.at));
  for (const h of (dados && dados.quizHistory) || []) if (h && h.at) dias.add(diaSP(h.at));
  // sequência contada até ontem (o e-mail sai de manhã)
  let seq = 0; const d = new Date(agora); d.setUTCDate(d.getUTCDate() - 1);
  while (dias.has(hojeSP(d))) { seq++; d.setUTCDate(d.getUTCDate() - 1); }
  const estudadas = Object.keys((dados && dados.studied) || {}).filter(k => dados.studied[k]).length;
  return { revisar, seq, estudadas };
}

export function montarEmail({ nome, uid, carta, pergunta, r }) {
  const primeiro = (nome || '').trim().split(/\s+/)[0] || '';
  const app = APP(), sair = app + '/.netlify/functions/lembrete-sair?u=' + encodeURIComponent(uid) + '&t=' + tokenSaida(uid);
  const linhaRev = r.revisar ? `${r.revisar} carta${r.revisar === 1 ? ' espera' : 's esperam'} revisão nos flashcards.` : 'Nenhuma revisão pendente nos flashcards. Dia bom para uma carta nova ou um quiz.';
  const linhaSeq = r.seq >= 2 ? `Você está há ${r.seq} dias seguidos estudando. Hoje é o ${r.seq + 1}º?` : r.seq === 1 ? 'Você estudou ontem. Hoje fecha dois dias seguidos.' : '';
  const subject = `Carta do dia: ${carta.name}`;
  const html = `<!doctype html><html lang="pt-BR"><body style="margin:0;background:#F4ECE1;font-family:Georgia,serif;color:#402327">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F4ECE1;padding:24px 12px"><tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#FFFDF9;border:1px solid #E2D3C2;border-radius:16px;overflow:hidden">
<tr><td style="background:#402327;color:#F4ECE1;padding:18px 24px;font-size:12px;letter-spacing:.16em;text-transform:uppercase">Grimório Arcano · carta do dia</td></tr>
<tr><td style="padding:24px 24px 8px;font-size:16px;line-height:1.5">${primeiro ? 'Bom dia, ' + escHtml(primeiro) + '.' : 'Bom dia.'}</td></tr>
<tr><td style="padding:0 24px"><table cellpadding="0" cellspacing="0"><tr>
<td style="vertical-align:top;padding-right:16px"><img src="${app}/${escHtml(String(carta.img).replace(/\.webp$/, '.jpg'))}" width="84" height="138" alt="${escHtml(carta.name)}" style="display:block;border-radius:8px;background:#EDE1D2"></td>
<td style="vertical-align:top"><div style="font-size:28px;line-height:1.05;margin-bottom:6px">${escHtml(carta.name)}</div><div style="font-size:14px;color:#5E4038;margin-bottom:10px">${escHtml(carta.palavras)}</div><div style="font-size:15px;line-height:1.45"><b style="color:#8A6A1E">Para refletir.</b> ${escHtml(pergunta)}</div></td></tr></table></td></tr>
<tr><td style="padding:18px 24px 0;font-size:15px;line-height:1.5">${escHtml(linhaRev)}${linhaSeq ? '<br>' + escHtml(linhaSeq) : ''}</td></tr>
<tr><td style="padding:20px 24px 6px"><a href="${app}" style="display:inline-block;background:#593122;color:#F4ECE1;text-decoration:none;padding:14px 24px;border-radius:12px;font-size:16px;font-weight:bold">Abrir o Grimório</a></td></tr>
<tr><td style="padding:10px 24px 24px;font-size:13px;color:#5E4038;line-height:1.5">A carta é a mesma para todas as alunas hoje. Vale conversar sobre ela na Comunidade.</td></tr>
<tr><td style="padding:14px 24px;border-top:1px solid #E2D3C2;font-size:12px;color:#7A5A4E;text-align:center">Você recebe este e-mail porque ligou o lembrete no seu perfil. <a href="${sair}" style="color:#7A5A4E">Parar de receber</a>.</td></tr>
</table></td></tr></table></body></html>`;
  const text = `${primeiro ? 'Bom dia, ' + primeiro + '.' : 'Bom dia.'}\n\nCarta do dia: ${carta.name}\n${carta.palavras}\n\nPara refletir: ${pergunta}\n\n${linhaRev}${linhaSeq ? '\n' + linhaSeq : ''}\n\nAbrir o Grimório: ${app}\n\nPara parar de receber: ${sair}`;
  return { subject, html, text };
}

async function sb(path, init = {}) {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const headers = Object.assign({ apikey: key, 'content-type': 'application/json' }, init.headers || {});
  if (!/^sb_secret_/.test(key)) headers.Authorization = 'Bearer ' + key;
  return fetch(process.env.SUPABASE_URL.replace(/\/$/, '') + path, Object.assign({}, init, { headers }));
}

async function enviar(para, nome, m) {
  const payload = {
    sender: { name: 'Grimório Arcano', email: process.env.EMAIL_REMETENTE || 'nao-responda@raquellopestarot.com.br' },
    to: [{ email: para, name: nome || undefined }], subject: m.subject, htmlContent: m.html, textContent: m.text, tags: ['lembrete-diario']
  };
  if (process.env.EMAIL_RESPOSTA) payload.replyTo = { email: process.env.EMAIL_RESPOSTA, name: 'Raquel Lopes' };
  const res = await fetch('https://api.brevo.com/v3/smtp/email', { method: 'POST', headers: { 'api-key': process.env.BREVO_API_KEY, 'content-type': 'application/json', accept: 'application/json' }, body: JSON.stringify(payload) });
  if (!res.ok) throw new Error('Brevo ' + res.status + ': ' + (await res.text()).slice(0, 120));
}

export async function rodar(agora = Date.now()) {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.BREVO_API_KEY) return { erro: 'variáveis de ambiente não configuradas' };
  const { CARDS, DIARIO } = carregarApp();
  const dia = hojeSP(new Date(agora)), carta = CARDS[DIARIO.indiceCarta(dia, CARDS.length)], pergunta = DIARIO.perguntaDoDia(dia);
  const res = await sb('/rest/v1/rpc/lembretes_pendentes', { method: 'POST', body: '{}' });
  if (!res.ok) return { erro: 'lista: ' + res.status + ' ' + (await res.text()).slice(0, 160) };
  const lista = await res.json();
  let enviados = 0; const falhas = [];
  for (const a of lista) {
    if (!a || !a.email) continue;
    try { await enviar(a.email, a.nome, montarEmail({ nome: a.nome, uid: a.user_id, carta, pergunta, r: resumo(a.dados, agora) })); enviados++; }
    catch (e) { falhas.push(a.email + ': ' + e.message); }
  }
  const out = { dia, carta: carta.name, assinantes: lista.length, enviados, falhas };
  console.log('lembrete-diario', JSON.stringify(out));
  return out;
}

export default async () => {
  const r = await rodar();
  return new Response(JSON.stringify(r), { status: r.erro ? 500 : 200, headers: { 'content-type': 'application/json' } });
};
