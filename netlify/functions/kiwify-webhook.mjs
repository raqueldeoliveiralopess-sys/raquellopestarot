// Grimório Arcano — recebe os avisos (webhooks) da Kiwify e atualiza a tabela de assinantes no Supabase.
//
// Variáveis de ambiente (Netlify → Site configuration → Environment variables):
//   SUPABASE_URL               endereço do projeto Supabase
//   SUPABASE_SERVICE_ROLE_KEY  chave de serviço (secreta; só aqui, nunca no app)
//   KIWIFY_TOKEN               token mostrado pela Kiwify ao criar o webhook
//   KIWIFY_PRODUCT_ID          (opcional) id do produto Grimório; avisos de outros produtos são ignorados
//   BREVO_API_KEY              (opcional) chave de API do Brevo; com ela, a assinante nova recebe o e-mail de boas-vindas
//   APP_URL                    (opcional) endereço do app; padrão https://ogrimorioarcano.netlify.app
//   EMAIL_REMETENTE            (opcional) padrão nao-responda@raquellopestarot.com.br
//   EMAIL_RESPOSTA             (opcional) e-mail que recebe as respostas das alunas
//
// A Kiwify assina cada aviso com HMAC-SHA1 do corpo, usando o token, e envia no parâmetro ?signature=.
import crypto from 'node:crypto';

const json = (status, body) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

function hmac(token, text) { return crypto.createHmac('sha1', token).update(text, 'utf8').digest('hex'); }
function safeEqual(a, b) {
  const x = Buffer.from(String(a || ''), 'utf8'), y = Buffer.from(String(b || ''), 'utf8');
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}
export function verifySignature(raw, signature, token) {
  if (!token || !signature) return false;
  if (safeEqual(hmac(token, raw), signature)) return true;
  // algumas integrações calculam sobre o JSON recompactado
  try { return safeEqual(hmac(token, JSON.stringify(JSON.parse(raw))), signature); } catch { return false; }
}

const pick = (o, ...paths) => { for (const p of paths) { const v = p.split('.').reduce((a, k) => (a == null ? a : a[k]), o); if (v != null && v !== '') return v; } return null; };

// Traduz o aviso da Kiwify para o status da assinatura no app.
export function classify(body) {
  const ev = String(pick(body, 'webhook_event_type', 'trigger', 'event', 'type') || '').toLowerCase();
  const order = String(pick(body, 'order_status', 'status') || '').toLowerCase();
  const sub = String(pick(body, 'Subscription.status', 'subscription.status') || '').toLowerCase();
  const email = pick(body, 'Customer.email', 'customer.email', 'Customer.Email', 'email');
  const nome = pick(body, 'Customer.full_name', 'customer.full_name', 'Customer.first_name', 'customer.name');
  const pedido = pick(body, 'order_id', 'order_ref', 'id');
  const produto = pick(body, 'Product.product_id', 'product.id', 'Product.id', 'product_id');
  let status = null;
  if (/refund|reembols/.test(ev) || order === 'refunded') status = 'reembolsada';
  else if (/chargeback/.test(ev) || order === 'chargedback') status = 'chargeback';
  else if (/cancel/.test(ev) || sub === 'canceled' || sub === 'cancelled') status = 'cancelada';
  else if (/late|atras/.test(ev) || sub === 'late' || sub === 'past_due') status = 'atrasada';
  else if (/approved|aprovad|renew|renovad/.test(ev) || order === 'paid' || order === 'approved' || sub === 'active') status = 'ativa';
  return { evento: ev || order || sub || 'desconhecido', status, email: email ? String(email).trim().toLowerCase() : null, nome, pedido: pedido ? String(pedido) : null, produto: produto ? String(produto) : null };
}

async function sb(path, init) {
  const url = process.env.SUPABASE_URL.replace(/\/$/, '') + path;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  // chaves novas (sb_secret_...) vão só no apikey; as antigas (service_role, JWT) também no Authorization
  const auth = key.startsWith('sb_') ? {} : { Authorization: 'Bearer ' + key };
  const res = await fetch(url, { ...init, headers: { apikey: key, ...auth, 'content-type': 'application/json', ...(init && init.headers) } });
  if (!res.ok) throw new Error('Supabase ' + res.status + ': ' + (await res.text()).slice(0, 200));
  return res;
}
async function logEvento(c, resultado, body) {
  try { await sb('/rest/v1/kiwify_eventos', { method: 'POST', body: JSON.stringify({ evento: c.evento, email: c.email, resultado, corpo: body }), headers: { Prefer: 'return=minimal' } }); } catch (e) { console.error('log falhou', e.message); }
}

const ATIVOS = ['ativa', 'atrasada'];
const escHtml = t => String(t == null ? '' : t).replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));

async function statusAnterior(email) {
  try {
    const res = await sb('/rest/v1/assinantes?select=status&email=eq.' + encodeURIComponent(email), { method: 'GET' });
    const rows = await res.json();
    return rows && rows[0] ? rows[0].status : null;
  } catch (e) { console.error('não deu para ler o status anterior', e.message); return null; }
}

export function emailBoasVindas(nome, email, appUrl) {
  const primeiro = String(nome || '').trim().split(/\s+/)[0];
  const ola = primeiro ? 'Oi, ' + escHtml(primeiro) + '!' : 'Oi!';
  const html = `<!doctype html><html lang="pt-BR"><body style="margin:0;padding:0;background:#F4ECE1;font-family:Arial,Helvetica,sans-serif;color:#402327">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#F4ECE1"><tr><td align="center" style="padding:28px 16px">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px;background:#FFFDF9;border:1px solid #E2D3C2;border-radius:16px">
<tr><td style="background:#402327;border-radius:16px 16px 0 0;padding:22px 24px;text-align:center">
<div style="font-family:Georgia,serif;font-size:13px;letter-spacing:3px;color:#F4B1C8;text-transform:uppercase">Grimório Arcano</div>
<div style="font-family:Georgia,serif;font-size:26px;color:#ECDF90;margin-top:6px">Seu grimório está liberado</div></td></tr>
<tr><td style="padding:24px;font-size:15px;line-height:1.55">
<p style="margin:0 0 14px">${ola}</p>
<p style="margin:0 0 14px">Sua assinatura foi confirmada e o app já está aberto pra você. Aqui é estudo de verdade: a linguagem simbólica das cartas, sem decoreba.</p>
<p style="margin:0 0 8px"><b>Pra entrar:</b></p>
<ol style="margin:0 0 18px;padding-left:20px">
<li style="margin-bottom:6px">Toque no botão abaixo.</li>
<li style="margin-bottom:6px">Digite este e-mail: <b>${escHtml(email)}</b></li>
<li style="margin-bottom:6px">Você recebe um código de 6 números. Digite no app e pronto, sem senha.</li></ol>
<p style="text-align:center;margin:0 0 22px"><a href="${escHtml(appUrl)}" style="display:inline-block;background:#593122;color:#F4ECE1;text-decoration:none;font-weight:bold;padding:14px 26px;border-radius:12px">Abrir o Grimório Arcano</a></p>
<p style="margin:0 0 8px"><b>Deixe na tela inicial do celular</b>, pra abrir como app:</p>
<ul style="margin:0 0 18px;padding-left:20px">
<li style="margin-bottom:6px"><b>Android:</b> abra o link no Chrome, toque nos três pontinhos e em "Adicionar à tela inicial".</li>
<li style="margin-bottom:6px"><b>iPhone:</b> abra o link no Safari, toque em Compartilhar e em "Adicionar à Tela de Início".</li></ul>
<p style="margin:0 0 14px">O app se atualiza sozinho, e seu progresso fica salvo na sua conta, em qualquer aparelho.</p>
<p style="margin:0">Bons estudos, meu anjo.<br>Raquel Lopes</p></td></tr>
<tr><td style="padding:14px 24px;border-top:1px solid #E2D3C2;font-size:12px;color:#7A5A4E;text-align:center">Se o botão não abrir, copie este endereço: ${escHtml(appUrl)}</td></tr>
</table></td></tr></table></body></html>`;
  const text = `${primeiro ? 'Oi, ' + primeiro + '!' : 'Oi!'}\n\nSua assinatura do Grimório Arcano foi confirmada.\n\nPra entrar:\n1. Abra ${appUrl}\n2. Digite este e-mail: ${email}\n3. Digite o código de 6 números que chegar no seu e-mail.\n\nDeixe na tela inicial: no Android, Chrome > três pontinhos > Adicionar à tela inicial. No iPhone, Safari > Compartilhar > Adicionar à Tela de Início.\n\nBons estudos, meu anjo.\nRaquel Lopes`;
  return { subject: 'Seu Grimório Arcano está liberado', html, text };
}

async function enviarBoasVindas(c) {
  const key = process.env.BREVO_API_KEY;
  if (!key) return 'sem BREVO_API_KEY';
  const appUrl = process.env.APP_URL || 'https://ogrimorioarcano.netlify.app';
  const m = emailBoasVindas(c.nome, c.email, appUrl);
  const payload = {
    sender: { name: 'Grimório Arcano', email: process.env.EMAIL_REMETENTE || 'nao-responda@raquellopestarot.com.br' },
    to: [{ email: c.email, name: c.nome || undefined }],
    subject: m.subject, htmlContent: m.html, textContent: m.text, tags: ['boas-vindas']
  };
  if (process.env.EMAIL_RESPOSTA) payload.replyTo = { email: process.env.EMAIL_RESPOSTA, name: 'Raquel Lopes' };
  try {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', { method: 'POST', headers: { 'api-key': key, 'content-type': 'application/json', accept: 'application/json' }, body: JSON.stringify(payload) });
    if (!res.ok) return 'falhou (' + res.status + ': ' + (await res.text()).slice(0, 120) + ')';
    return 'enviado';
  } catch (e) { return 'falhou (' + e.message + ')'; }
}

export default async (req) => {
  if (req.method !== 'POST') return json(405, { erro: 'use POST' });
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.KIWIFY_TOKEN) return json(500, { erro: 'variáveis de ambiente não configuradas' });
  const raw = await req.text();
  const signature = new URL(req.url).searchParams.get('signature') || req.headers.get('x-kiwify-signature');
  if (!verifySignature(raw, signature, process.env.KIWIFY_TOKEN)) return json(401, { erro: 'assinatura inválida' });
  let body; try { body = JSON.parse(raw); } catch { return json(400, { erro: 'JSON inválido' }); }

  const c = classify(body);
  const prod = process.env.KIWIFY_PRODUCT_ID;
  if (prod && c.produto && c.produto !== prod) { await logEvento(c, 'ignorado: outro produto', body); return json(200, { ok: true, ignorado: 'outro produto' }); }
  if (!c.email || !c.status) { await logEvento(c, 'ignorado: sem e-mail ou evento sem efeito', body); return json(200, { ok: true, ignorado: true }); }

  const anterior = await statusAnterior(c.email);
  await sb('/rest/v1/assinantes?on_conflict=email', {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify({ email: c.email, status: c.status, nome: c.nome, pedido_kiwify: c.pedido, produto: c.produto, atualizado_em: new Date().toISOString() })
  });
  // boas-vindas só quando a pessoa passa a ter acesso (primeira compra ou volta depois de cancelar), não a cada renovação
  let boasVindas = null;
  if (c.status === 'ativa' && !ATIVOS.includes(anterior)) boasVindas = await enviarBoasVindas(c);
  await logEvento(c, 'assinatura: ' + c.status + (boasVindas ? ' · boas-vindas: ' + boasVindas : ''), body);
  return json(200, { ok: true, status: c.status, boasVindas });
};
