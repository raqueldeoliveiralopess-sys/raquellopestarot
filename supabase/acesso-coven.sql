-- COB e Grimório só para quem participa do Coven (mensalidade). Cole tudo no SQL Editor e clique em Run.
-- Pode rodar mais de uma vez. Na PRIMEIRA vez, todos os cadastros que já existiam ficam pausados (menos as admins);
-- os dados continuam guardados. A admin libera ou pausa cada pessoa no app do COB, em Membros.
-- (Este bloco é o mesmo que está nas seções 1 e 10 do cob.sql e no lembretes.sql.)

create or replace function public.e_membro() returns boolean
language plpgsql stable security definer set search_path = public as $$
begin
  -- membro com acesso liberado (coluna acesso, seção 10 do cob.sql; sem a coluna, vale o cadastro)
  return exists (select 1 from public.cob_membros m
                 where m.user_id = auth.uid() and coalesce((to_jsonb(m) ->> 'acesso')::boolean, true));
exception when undefined_table then return false;
end $$;
revoke all on function public.e_membro() from public, anon;
grant execute on function public.e_membro() to authenticated;

-- 10) Acesso pela mensalidade do Coven: cada cadastro tem o acesso liberado ou pausado.
--     A admin libera e pausa no app (Membros). Pausado não abre o COB nem o Grimório (a função e_membro só conta quem está liberado).
--     Na primeira vez que esta seção roda, todos os cadastros que já existiam ficam PAUSADOS (menos as admins).
--     Cadastros feitos depois entram liberados (o link do app é entregue a quem pagou a mensalidade).
alter table public.cob_membros add column if not exists acesso boolean;
alter table public.cob_membros add column if not exists acesso_em timestamptz;
do $$
begin
  if (select column_default from information_schema.columns
      where table_schema = 'public' and table_name = 'cob_membros' and column_name = 'acesso') is null then
    update public.cob_membros m
       set acesso = exists (select 1 from public.admins a where lower(a.email) = lower(m.email)),
           acesso_em = now();
    alter table public.cob_membros alter column acesso set default true;
  end if;
end $$;
update public.cob_membros set acesso = true where acesso is null;
alter table public.cob_membros alter column acesso set not null;

-- cadastro novo sempre entra liberado (ninguém escolhe o próprio acesso); a data de cada mudança fica guardada
create or replace function public.cob_membros_acesso() returns trigger
language plpgsql as $$
begin
  if tg_op = 'INSERT' then new.acesso := true; new.acesso_em := now();
  elsif new.acesso is distinct from old.acesso then new.acesso_em := now();
  end if;
  return new;
end $$;
drop trigger if exists cob_membros_acesso on public.cob_membros;
create trigger cob_membros_acesso before insert or update on public.cob_membros
  for each row execute function public.cob_membros_acesso();

-- quem está pausado não apaga o próprio cadastro (senão bastaria se cadastrar de novo para voltar liberado)
drop policy if exists "membros: apaga o proprio ou admin" on public.cob_membros;
create policy "membros: apaga o proprio ou admin" on public.cob_membros for delete to authenticated
  using ((user_id = auth.uid() and acesso) or public.e_admin());

-- lembrete diário do Grimório: só para quem está liberado (ou assina)
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
      and (exists (select 1 from public.cob_membros m where m.user_id = p.id and coalesce((to_jsonb(m) ->> 'acesso')::boolean, true))
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
