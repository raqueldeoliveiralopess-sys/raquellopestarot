// Grimório Arcano — link "Parar de receber" do lembrete diário.
// Desliga perfis.lembrete da aluna. O link traz o id da usuária e um código assinado (HMAC) para ninguém desligar o lembrete de outra pessoa.
import { tokenSaida } from './lembrete-diario.mjs';

const pagina = (titulo, texto) => new Response(`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${titulo}</title></head>
<body style="margin:0;background:#F4ECE1;font-family:Georgia,serif;color:#402327"><div style="max-width:480px;margin:48px auto;padding:28px;background:#FFFDF9;border:1px solid #E2D3C2;border-radius:16px">
<div style="font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:#7A5A4E;margin-bottom:12px">Grimório Arcano</div><h1 style="font-size:28px;margin:0 0 12px">${titulo}</h1><p style="font-size:16px;line-height:1.5;margin:0">${texto}</p></div></body></html>`, { headers: { 'content-type': 'text/html; charset=utf-8' } });

export default async (req) => {
  const u = new URL(req.url), uid = u.searchParams.get('u') || '', t = u.searchParams.get('t') || '';
  if (!/^[0-9a-f-]{36}$/i.test(uid) || t.length !== 32 || t !== tokenSaida(uid)) return pagina('Link inválido', 'Este link de descadastro não é válido. Você pode desligar o lembrete em Editar perfil, dentro do app.');
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return pagina('Algo deu errado', 'O servidor não está configurado. Desligue o lembrete em Editar perfil, dentro do app.');
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY, headers = { apikey: key, 'content-type': 'application/json', Prefer: 'return=minimal' };
  if (!/^sb_secret_/.test(key)) headers.Authorization = 'Bearer ' + key;
  const res = await fetch(process.env.SUPABASE_URL.replace(/\/$/, '') + '/rest/v1/perfis?id=eq.' + encodeURIComponent(uid), { method: 'PATCH', headers, body: JSON.stringify({ lembrete: false }) });
  if (!res.ok) return pagina('Algo deu errado', 'Não foi possível desligar agora. Tente de novo mais tarde ou desligue em Editar perfil, dentro do app.');
  return pagina('Pronto', 'Você não vai mais receber o lembrete diário. Se mudar de ideia, é só ligar de novo em Editar perfil, dentro do app.');
};
