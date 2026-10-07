-- Grimório Arcano — Mentora de estudos: uso por aluna e por dia.
-- Rode uma vez no SQL Editor do Supabase. Só a chave de serviço (função da Netlify) escreve aqui;
-- o app nunca lê nem grava nesta tabela.

-- 1) Tabela de uso (uma linha por aluna por dia, em horário de Brasília)
create table if not exists public.mentora_uso (
  user_id uuid not null references auth.users(id) on delete cascade,
  dia date not null default (now() at time zone 'America/Sao_Paulo')::date,
  mensagens int not null default 0,
  tokens_in bigint not null default 0,
  tokens_out bigint not null default 0,
  atualizado_em timestamptz not null default now(),
  primary key (user_id, dia)
);
alter table public.mentora_uso enable row level security;
-- Sem políticas: com RLS ligado e nenhuma política, anon e authenticated não enxergam nada.
revoke all on table public.mentora_uso from public, anon, authenticated;

-- 2) Soma mensagens e tokens do dia e devolve quantas mensagens a aluna já mandou hoje
create or replace function public.mentora_registrar(uid uuid, msgs int default 1, tin bigint default 0, tout bigint default 0)
returns int language plpgsql security definer set search_path = public as $$
declare
  total int;
  hoje date := (now() at time zone 'America/Sao_Paulo')::date;
begin
  insert into public.mentora_uso (user_id, dia, mensagens, tokens_in, tokens_out)
  values (uid, hoje, greatest(msgs, 0), greatest(tin, 0), greatest(tout, 0))
  on conflict (user_id, dia) do update
    set mensagens = mentora_uso.mensagens + excluded.mensagens,
        tokens_in = mentora_uso.tokens_in + excluded.tokens_in,
        tokens_out = mentora_uso.tokens_out + excluded.tokens_out,
        atualizado_em = now()
  returning mensagens into total;
  return total;
end $$;
revoke all on function public.mentora_registrar(uuid, int, bigint, bigint) from public, anon, authenticated;
grant execute on function public.mentora_registrar(uuid, int, bigint, bigint) to service_role;

-- 3) Para acompanhar o gasto (rode quando quiser; preços do Opus 5.5 em dólar por milhão de tokens)
-- select dia, sum(mensagens) as mensagens, sum(tokens_in) as tokens_in, sum(tokens_out) as tokens_out,
--        round((sum(tokens_in) * 4 + sum(tokens_out) * 20) / 1e6, 2) as custo_maximo_usd
-- from public.mentora_uso group by dia order by dia desc;
