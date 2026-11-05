-- Grimório Arcano gratuito para quem tem cadastro no COB
-- Cole tudo no SQL Editor do Supabase e clique em Run. Pode rodar mais de uma vez.
--
-- "Ter acesso ao Grimório" passa a ser: cadastro completo no COB (tabela cob_membros)
-- OU assinatura ativa na Kiwify (quem já assina continua entrando).
-- A mesma regra vale para a comunidade do Grimório (perfis, posts, comentários, curtidas) e para o lembrete diário.

-- membro do COB (a mesma função do cob.sql; aqui só garante que existe)
create or replace function public.e_membro() returns boolean
language plpgsql stable security definer set search_path = public as $$
begin
  return exists (select 1 from public.cob_membros where user_id = auth.uid());
exception when undefined_table then return false;
end $$;
revoke all on function public.e_membro() from public, anon;
grant execute on function public.e_membro() to authenticated;

-- quem tem acesso ao Grimório (o nome ficou "e_assinante" porque as regras da comunidade já usam essa função)
create or replace function public.e_assinante() returns boolean
language sql stable security definer set search_path = public as $$
  select public.e_membro() or exists (
    select 1 from public.assinantes
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      and status in ('ativa', 'atrasada')
  );
$$;
revoke all on function public.e_assinante() from public, anon;
grant execute on function public.e_assinante() to authenticated;

-- lembrete diário: membros do COB ou assinantes, com o lembrete ligado (só a chave de serviço chama)
create or replace function public.lembretes_pendentes()
returns table (user_id uuid, email text, nome text, dados jsonb)
language plpgsql stable security definer set search_path = public as $$
begin
  return query
    select u.id, u.email::text, p.nome, coalesce(g.dados, '{}'::jsonb)
    from public.perfis p
    join auth.users u on u.id = p.id
    left join public.progresso g on g.user_id = p.id
    where p.lembrete = true
      and (exists (select 1 from public.cob_membros m where m.user_id = p.id)
           or exists (select 1 from public.assinantes a where lower(a.email) = lower(u.email) and a.status in ('ativa', 'atrasada')));
exception when undefined_table then
  return query
    select u.id, u.email::text, p.nome, coalesce(g.dados, '{}'::jsonb)
    from public.perfis p
    join auth.users u on u.id = p.id
    join public.assinantes a on lower(a.email) = lower(u.email) and a.status in ('ativa', 'atrasada')
    left join public.progresso g on g.user_id = p.id
    where p.lembrete = true;
end $$;
revoke all on function public.lembretes_pendentes() from public, anon, authenticated;
grant execute on function public.lembretes_pendentes() to service_role;
