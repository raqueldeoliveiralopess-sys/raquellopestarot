-- Grimório Arcano — Lembrete diário por e-mail
-- Rode DEPOIS do schema.sql. Cole tudo no SQL Editor do Supabase e clique em Run. Pode rodar mais de uma vez.

-- 1) Quem quer receber (a aluna liga e desliga no Editar perfil do app)
alter table public.perfis add column if not exists lembrete boolean not null default false;

-- 2) Lista para a função agendada: só assinantes ativas/atrasadas com o lembrete ligado.
--    Lê auth.users para pegar o e-mail; por isso só a chave de serviço (service_role) pode chamar.
create or replace function public.lembretes_pendentes()
returns table (user_id uuid, email text, nome text, dados jsonb)
language sql stable security definer set search_path = public as $$
  select u.id, u.email::text, p.nome, coalesce(g.dados, '{}'::jsonb)
  from public.perfis p
  join auth.users u on u.id = p.id
  join public.assinantes a on lower(a.email) = lower(u.email) and a.status in ('ativa', 'atrasada')
  left join public.progresso g on g.user_id = p.id
  where p.lembrete = true;
$$;
revoke all on function public.lembretes_pendentes() from public, anon, authenticated;
grant execute on function public.lembretes_pendentes() to service_role;
