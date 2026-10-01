// Grimório Arcano — recebe os avisos (webhooks) da Kiwify e atualiza a tabela de assinantes no Supabase.
//
// Variáveis de ambiente (Netlify → Site configuration → Environment variables):
//   SUPABASE_URL               endereço do projeto Supabase
//   SUPABASE_SERVICE_ROLE_KEY  chave de serviço (secreta; só aqui, nunca no app)
//   KIWIFY_TOKEN               token mostrado pela Kiwify ao criar o webhook
//   KIWIFY_PRODUCT_ID          (opcional) id do produto Grimório; avisos de outros produtos são ignorados
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
  const res = await fetch(url, { ...init, headers: { apikey: key, Authorization: 'Bearer ' + key, 'content-type': 'application/json', ...(init && init.headers) } });
  if (!res.ok) throw new Error('Supabase ' + res.status + ': ' + (await res.text()).slice(0, 200));
  return res;
}
async function logEvento(c, resultado, body) {
  try { await sb('/rest/v1/kiwify_eventos', { method: 'POST', body: JSON.stringify({ evento: c.evento, email: c.email, resultado, corpo: body }), headers: { Prefer: 'return=minimal' } }); } catch (e) { console.error('log falhou', e.message); }
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

  await sb('/rest/v1/assinantes?on_conflict=email', {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify({ email: c.email, status: c.status, nome: c.nome, pedido_kiwify: c.pedido, produto: c.produto, atualizado_em: new Date().toISOString() })
  });
  await logEvento(c, 'assinatura: ' + c.status, body);
  return json(200, { ok: true, status: c.status });
};
