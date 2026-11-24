-- COB — Planner 2027 (anotações do planner digital de cada membro)
-- Cole tudo no SQL Editor do Supabase e clique em Run. Pode rodar mais de uma vez.
-- É a mesma seção 12 do supabase/cob.sql. Precisa das seções 1, 4 e 10 já rodadas (funções e_admin e e_membro).

-- 12) Planner 2027: as anotações de cada membro, sincronizadas entre os aparelhos.
--     Uma linha por campo do planner. Chaves: 'ano-2027' (2027 em uma página), '2027-03' (intenções do mês),
--     '2027-03-nova' | '-crescente' | '-cheia' | '-minguante' (pergunta de cada fase da Lua) e '2027-03-14' (anotação do dia).
--     Cada pessoa lê e escreve só as próprias linhas, e só com o acesso liberado (ou sendo admin). Nem a admin lê as anotações dos outros.
create table if not exists public.cob_planner (
  user_id        uuid not null default auth.uid() references auth.users(id) on delete cascade,
  chave          text not null check (chave ~ '^[a-z0-9-]{1,40}$'),
  texto          text not null default '' check (char_length(texto) <= 5000),
  atualizado_em  timestamptz not null default now(),
  primary key (user_id, chave)
);

-- a data da última alteração é sempre a do servidor; e um teto de linhas por pessoa (o planner de um ano usa menos de 450)
create or replace function public.cob_planner_antes() returns trigger
language plpgsql as $$
begin
  if tg_op = 'INSERT' and (select count(*) from public.cob_planner p where p.user_id = new.user_id) >= 1500 then
    raise exception 'planner_cheio';
  end if;
  new.atualizado_em := now();
  return new;
end $$;
drop trigger if exists cob_planner_antes on public.cob_planner;
create trigger cob_planner_antes before insert or update on public.cob_planner
  for each row execute function public.cob_planner_antes();

alter table public.cob_planner enable row level security;
drop policy if exists "planner: le o proprio"     on public.cob_planner;
drop policy if exists "planner: escreve o proprio" on public.cob_planner;
drop policy if exists "planner: edita o proprio"  on public.cob_planner;
drop policy if exists "planner: apaga o proprio"  on public.cob_planner;
create policy "planner: le o proprio" on public.cob_planner for select to authenticated
  using (user_id = auth.uid() and (public.e_membro() or public.e_admin()));
create policy "planner: escreve o proprio" on public.cob_planner for insert to authenticated
  with check (user_id = auth.uid() and (public.e_membro() or public.e_admin()));
create policy "planner: edita o proprio" on public.cob_planner for update to authenticated
  using (user_id = auth.uid() and (public.e_membro() or public.e_admin()))
  with check (user_id = auth.uid() and (public.e_membro() or public.e_admin()));
create policy "planner: apaga o proprio" on public.cob_planner for delete to authenticated
  using (user_id = auth.uid() and (public.e_membro() or public.e_admin()));
revoke all on public.cob_planner from anon;
grant select, insert, update, delete on public.cob_planner to authenticated;
