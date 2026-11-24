-- Benefícios do Coven (conteúdo exclusivo e fidelidade). Cole tudo no SQL Editor do Supabase e clique em Run. Pode rodar mais de uma vez.
-- (É a seção 11 do cob.sql. Precisa das seções anteriores já rodadas, inclusive a 10, do acesso por mensalidade.)

-- 11) Benefícios do Coven: conteúdo exclusivo e fidelidade
--     Tempo de casa: conta do dia em que a admin libera a pessoa (assinante_desde); a admin pode corrigir a data em Membros.
--     Indicação: cada membro tem um código; quem se cadastra com o código de alguém fica registrado como indicação.
--     Materiais: a admin publica pelo app; os de fidelidade só abrem a partir de N meses de casa (meses_minimos).
alter table public.cob_membros add column if not exists assinante_desde date;
alter table public.cob_membros add column if not exists codigo_indicacao text;
alter table public.cob_membros add column if not exists indicado_por_codigo text;
create unique index if not exists cob_membros_codigo on public.cob_membros (codigo_indicacao);

-- código curto e fácil de ditar: primeiro nome sem acento (até 8 letras) + 4 caracteres sem 0/O/1/I
create or replace function public.cob_novo_codigo(nome text) returns text
language plpgsql volatile security definer set search_path = public as $$
declare
  base text := upper(left(regexp_replace(translate(lower(split_part(btrim(coalesce(nome, '')), ' ', 1)),
                 'áàâãäéèêëíìîïóòôõöúùûüç', 'aaaaaeeeeiiiiooooouuuuc'), '[^a-z]', '', 'g'), 8));
  abc text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  cod text;
begin
  if base = '' then base := 'COVEN'; end if;
  loop
    cod := base || '-' || (select string_agg(substr(abc, 1 + floor(random() * length(abc))::int, 1), '') from generate_series(1, 4));
    exit when not exists (select 1 from public.cob_membros where codigo_indicacao = cod);
  end loop;
  return cod;
end $$;

-- quem já está liberado começa a contar do dia em que foi liberado; todo mundo ganha um código
update public.cob_membros
   set assinante_desde = (coalesce(acesso_em, now()) at time zone 'America/Sao_Paulo')::date
 where acesso and assinante_desde is null;
update public.cob_membros set codigo_indicacao = public.cob_novo_codigo(nome) where codigo_indicacao is null;

-- ao liberar pela primeira vez, marca a data; cadastro novo ganha código; ninguém escolhe o próprio código
create or replace function public.cob_membros_fidelidade() returns trigger
language plpgsql as $$
begin
  if tg_op = 'INSERT' then
    new.codigo_indicacao := public.cob_novo_codigo(new.nome);
    new.indicado_por_codigo := nullif(upper(btrim(coalesce(new.indicado_por_codigo, ''))), '');
    new.assinante_desde := null;   -- no cadastro ninguém escolhe a própria data: vale o dia em que entra liberado
  else
    new.codigo_indicacao := old.codigo_indicacao;
    new.indicado_por_codigo := old.indicado_por_codigo;
  end if;
  if new.acesso and new.assinante_desde is null then
    new.assinante_desde := (now() at time zone 'America/Sao_Paulo')::date;
  end if;
  return new;
end $$;
drop trigger if exists cob_membros_fidelidade on public.cob_membros;
create trigger cob_membros_fidelidade before insert or update on public.cob_membros
  for each row execute function public.cob_membros_fidelidade();

-- indicações (quem indicou quem); a admin marca quando entregou o presente
create table if not exists public.cob_indicacoes (
  id                 bigint generated always as identity primary key,
  indicador          uuid not null references public.cob_membros(user_id) on delete cascade,
  indicado           uuid not null unique references public.cob_membros(user_id) on delete cascade,
  presente_entregue  boolean not null default false,
  criado_em          timestamptz not null default now(),
  check (indicador <> indicado)
);
alter table public.cob_indicacoes enable row level security;
drop policy if exists "indicacoes: quem indicou ou admin le" on public.cob_indicacoes;
drop policy if exists "indicacoes: admin edita"              on public.cob_indicacoes;
drop policy if exists "indicacoes: admin remove"             on public.cob_indicacoes;
create policy "indicacoes: quem indicou ou admin le" on public.cob_indicacoes for select to authenticated using (indicador = auth.uid() or public.e_admin());
create policy "indicacoes: admin edita"  on public.cob_indicacoes for update to authenticated using (public.e_admin()) with check (public.e_admin());
create policy "indicacoes: admin remove" on public.cob_indicacoes for delete to authenticated using (public.e_admin());
revoke all on public.cob_indicacoes from anon;
grant select, update, delete on public.cob_indicacoes to authenticated;

-- o cadastro com código registra a indicação (código desconhecido é ignorado)
create or replace function public.cob_membros_indicacao() returns trigger
language plpgsql security definer set search_path = public as $$
declare quem uuid;
begin
  if new.indicado_por_codigo is not null then
    select user_id into quem from public.cob_membros where codigo_indicacao = new.indicado_por_codigo and user_id <> new.user_id;
    if quem is not null then
      insert into public.cob_indicacoes (indicador, indicado) values (quem, new.user_id) on conflict (indicado) do nothing;
    end if;
  end if;
  return null;
end $$;
drop trigger if exists cob_membros_indicacao on public.cob_membros;
create trigger cob_membros_indicacao after insert on public.cob_membros
  for each row execute function public.cob_membros_indicacao();

-- o formulário de cadastro confere se o código existe (só responde sim ou não)
create or replace function public.cob_codigo_existe(codigo text) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.cob_membros where codigo_indicacao = upper(btrim(codigo)));
$$;
revoke all on function public.cob_codigo_existe(text) from public, anon;
grant execute on function public.cob_codigo_existe(text) to authenticated;

-- meses completos de casa de quem está usando o app (0 sem data)
create or replace function public.cob_meses_de_casa() returns int
language sql stable security definer set search_path = public as $$
  select coalesce((select (extract(year from a) * 12 + extract(month from a))::int
                     from public.cob_membros m,
                          lateral age((now() at time zone 'America/Sao_Paulo')::date, m.assinante_desde) a
                    where m.user_id = auth.uid() and m.assinante_desde is not null), 0);
$$;
revoke all on function public.cob_meses_de_casa() from public, anon;
grant execute on function public.cob_meses_de_casa() to authenticated;

-- materiais exclusivos: kit de boas-vindas, material do mês, para imprimir, acesso antecipado e presentes de fidelidade
create table if not exists public.cob_beneficios (
  id             bigint generated always as identity primary key,
  tipo           text not null check (tipo in ('boas-vindas', 'mes', 'imprimir', 'antecipado', 'fidelidade')),
  titulo         text not null,
  descricao      text,
  arquivo        text,                -- caminho no bucket cob-beneficios
  nome_arquivo   text,
  tamanho        bigint,
  link           text,                -- ou um link (ex.: página de um curso em pré-venda)
  mes            date,                -- material do mês: o primeiro dia do mês a que pertence
  meses_minimos  int not null default 0 check (meses_minimos >= 0),
  publicado      boolean not null default false,
  ordem          int not null default 0,
  criado_em      timestamptz not null default now(),
  check (arquivo is not null or link is not null)
);
alter table public.cob_beneficios enable row level security;
drop policy if exists "beneficios: membros leem os liberados" on public.cob_beneficios;
drop policy if exists "beneficios: admin inclui"              on public.cob_beneficios;
drop policy if exists "beneficios: admin edita"               on public.cob_beneficios;
drop policy if exists "beneficios: admin remove"              on public.cob_beneficios;
create policy "beneficios: membros leem os liberados" on public.cob_beneficios for select to authenticated using (
  public.e_admin() or (public.e_membro() and publicado and meses_minimos <= public.cob_meses_de_casa()));
create policy "beneficios: admin inclui" on public.cob_beneficios for insert to authenticated with check (public.e_admin());
create policy "beneficios: admin edita"  on public.cob_beneficios for update to authenticated using (public.e_admin()) with check (public.e_admin());
create policy "beneficios: admin remove" on public.cob_beneficios for delete to authenticated using (public.e_admin());
revoke all on public.cob_beneficios from anon;
grant select, insert, update, delete on public.cob_beneficios to authenticated;

-- presentes que ainda não abriram: só o título e quando abre (sem o arquivo), para o membro ver o que vem pela frente
create or replace function public.cob_beneficios_a_caminho()
returns table (titulo text, descricao text, meses_minimos int)
language sql stable security definer set search_path = public as $$
  select b.titulo, b.descricao, b.meses_minimos from public.cob_beneficios b
   where public.e_membro() and b.publicado and b.meses_minimos > public.cob_meses_de_casa()
   order by b.meses_minimos, b.ordem, b.id;
$$;
revoke all on function public.cob_beneficios_a_caminho() from public, anon;
grant execute on function public.cob_beneficios_a_caminho() to authenticated;

-- arquivos dos benefícios: bucket privado; cada arquivo só abre para quem pode ver o material dele
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('cob-beneficios', 'cob-beneficios', false, 524288000, array['application/pdf', 'image/png', 'image/jpeg', 'image/webp', 'application/zip'])
on conflict (id) do update
  set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;
drop policy if exists "cob-beneficios: quem pode ver le" on storage.objects;
drop policy if exists "cob-beneficios: admin envia"      on storage.objects;
drop policy if exists "cob-beneficios: admin troca"      on storage.objects;
drop policy if exists "cob-beneficios: admin apaga"      on storage.objects;
create policy "cob-beneficios: quem pode ver le" on storage.objects for select to authenticated using (
  bucket_id = 'cob-beneficios' and (public.e_admin() or exists (select 1 from public.cob_beneficios b where b.arquivo = name)));
create policy "cob-beneficios: admin envia" on storage.objects for insert to authenticated with check (bucket_id = 'cob-beneficios' and public.e_admin());
create policy "cob-beneficios: admin troca" on storage.objects for update to authenticated using (bucket_id = 'cob-beneficios' and public.e_admin());
create policy "cob-beneficios: admin apaga" on storage.objects for delete to authenticated using (bucket_id = 'cob-beneficios' and public.e_admin());
