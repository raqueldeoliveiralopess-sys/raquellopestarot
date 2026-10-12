-- COB — Estante de livros (PDFs com capa)
-- Cole tudo no SQL Editor do Supabase e clique em Run. Pode rodar mais de uma vez.
--
-- Quem pode enviar e remover livros: os e-mails da tabela public.admins (a mesma da Comunidade do Grimório).
-- Para cadastrar a administradora:
--   insert into public.admins (email) values ('email-da-raquel@exemplo.com') on conflict do nothing;

-- 1) Administradoras (já existe se a Comunidade foi instalada; aqui só garante)
create table if not exists public.admins (
  email text primary key
);
alter table public.admins enable row level security;

create or replace function public.e_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.admins
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;
revoke all on function public.e_admin() from public, anon;
grant execute on function public.e_admin() to authenticated;

-- 2) Os livros: quem vê (todo mundo) e quem mexe (só admin)
create table if not exists public.cob_livros (
  id         bigint generated always as identity primary key,
  titulo     text not null,
  autor      text,
  descricao  text,
  capa       text,                 -- caminho da imagem no bucket (pode ser nulo)
  arquivo    text not null,        -- caminho do PDF no bucket
  tamanho    bigint,               -- bytes do PDF
  criado_em  timestamptz not null default now()
);
alter table public.cob_livros enable row level security;
-- link de compra do livro físico (código de influencer, loja da editora); pode ficar vazio
alter table public.cob_livros add column if not exists link_compra text;
-- categoria do livro (tarot, ervas, hoodoo…); vazia = o app deduz pelo título
alter table public.cob_livros add column if not exists categoria text;

drop policy if exists "estante: todos leem"    on public.cob_livros;
drop policy if exists "estante: admin inclui"  on public.cob_livros;
drop policy if exists "estante: admin edita"   on public.cob_livros;
drop policy if exists "estante: admin remove"  on public.cob_livros;
create policy "estante: todos leem"   on public.cob_livros for select to anon, authenticated using (true);
create policy "estante: admin inclui" on public.cob_livros for insert to authenticated with check (public.e_admin());
create policy "estante: admin edita"  on public.cob_livros for update to authenticated using (public.e_admin()) with check (public.e_admin());
create policy "estante: admin remove" on public.cob_livros for delete to authenticated using (public.e_admin());

grant select on public.cob_livros to anon, authenticated;
grant insert, update, delete on public.cob_livros to authenticated;

-- 3) Os arquivos: bucket público para leitura (as alunas baixam sem login), escrita só de admin.
--    Limite de 500 MB por arquivo (plano Pro). O limite geral em Storage → Settings → "Upload file size limit" precisa ser igual ou maior.
--    Arquivos acima de 6 MB são enviados em partes (upload retomável), então quedas de conexão não perdem o envio.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('cob-livros', 'cob-livros', true, 524288000, array['application/pdf', 'image/webp', 'image/jpeg', 'image/png'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "cob-livros: todos leem"   on storage.objects;
drop policy if exists "cob-livros: admin envia"  on storage.objects;
drop policy if exists "cob-livros: admin troca"  on storage.objects;
drop policy if exists "cob-livros: admin apaga"  on storage.objects;
create policy "cob-livros: todos leem"  on storage.objects for select to anon, authenticated using (bucket_id = 'cob-livros');
create policy "cob-livros: admin envia" on storage.objects for insert to authenticated with check (bucket_id = 'cob-livros' and public.e_admin());
create policy "cob-livros: admin troca" on storage.objects for update to authenticated using (bucket_id = 'cob-livros' and public.e_admin());
create policy "cob-livros: admin apaga" on storage.objects for delete to authenticated using (bucket_id = 'cob-livros' and public.e_admin());

-- 4) Cadastro de membros do COB (login por link mágico; o app só abre depois do cadastro)
--    Quem vê: cada membro só o próprio cadastro; a admin vê todos. Ninguém altera CPF ou nascimento depois.
create table if not exists public.cob_membros (
  user_id          uuid primary key references auth.users(id) on delete cascade,
  nome             text not null,
  cpf              text not null unique,
  email            text not null,
  whatsapp         text not null,
  nascimento       date not null,
  -- responsável (só para 16 e 17 anos)
  resp_nome        text,
  resp_cpf         text,
  resp_telefone    text,
  resp_email       text,
  resp_parentesco  text,
  resp_imagem      boolean,
  resp_declara     boolean,
  -- aceite dos termos (data, hora, IP e navegador gravados pelo banco, não pelo aparelho)
  aceite           boolean not null default false,
  aceite_versao    text,
  aceite_em        timestamptz,
  aceite_ip        text,
  aceite_ua        text,
  criado_em        timestamptz not null default now(),
  ultimo_acesso    timestamptz
);
alter table public.cob_membros enable row level security;

create or replace function public.cpf_valido(c text) returns boolean
language plpgsql immutable as $$
declare d int[]; s int; r int; i int;
begin
  if c is null or c !~ '^\d{11}$' or c ~ '^(\d)\1{10}$' then return false; end if;
  select array_agg(substr(c, n, 1)::int order by n) into d from generate_series(1, 11) n;
  s := 0; for i in 1..9 loop s := s + d[i] * (11 - i); end loop;
  r := (s * 10) % 11; if r = 10 then r := 0; end if;
  if r <> d[10] then return false; end if;
  s := 0; for i in 1..10 loop s := s + d[i] * (12 - i); end loop;
  r := (s * 10) % 11; if r = 10 then r := 0; end if;
  return r = d[11];
end $$;

create or replace function public.cob_cabecalho(nome text) returns text
language plpgsql stable as $$
declare h json;
begin
  begin h := current_setting('request.headers', true)::json; exception when others then return null; end;
  return h ->> nome;
end $$;

create or replace function public.cob_membros_antes() returns trigger
language plpgsql security definer set search_path = public as $$
declare idade int;
begin
  if auth.uid() is null then raise exception 'sem_sessao'; end if;
  new.user_id   := auth.uid();
  new.email     := lower(coalesce(auth.jwt() ->> 'email', new.email));
  new.nome      := btrim(regexp_replace(new.nome, '\s+', ' ', 'g'));
  new.cpf       := regexp_replace(coalesce(new.cpf, ''), '\D', '', 'g');
  new.whatsapp  := regexp_replace(coalesce(new.whatsapp, ''), '\D', '', 'g');
  if new.nome !~ '\S+\s+\S+' then raise exception 'nome_incompleto'; end if;
  if not public.cpf_valido(new.cpf) then raise exception 'cpf_invalido'; end if;
  if length(new.whatsapp) not between 10 and 13 then raise exception 'whatsapp_invalido'; end if;
  idade := extract(year from age(current_date, new.nascimento));
  if new.nascimento > current_date or idade > 110 then raise exception 'nascimento_invalido'; end if;
  if idade < 16 then raise exception 'idade_minima'; end if;
  if idade < 18 then
    new.resp_cpf := regexp_replace(coalesce(new.resp_cpf, ''), '\D', '', 'g');
    new.resp_telefone := regexp_replace(coalesce(new.resp_telefone, ''), '\D', '', 'g');
    if coalesce(btrim(new.resp_nome), '') !~ '\S+\s+\S+' or not public.cpf_valido(new.resp_cpf) or new.resp_cpf = new.cpf
       or length(new.resp_telefone) < 10 or coalesce(new.resp_email, '') !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'
       or coalesce(new.resp_parentesco, '') = '' or new.resp_imagem is null or new.resp_declara is not true then
      raise exception 'responsavel_incompleto';
    end if;
  else
    new.resp_nome := null; new.resp_cpf := null; new.resp_telefone := null; new.resp_email := null;
    new.resp_parentesco := null; new.resp_imagem := null; new.resp_declara := null;
  end if;
  if new.aceite is not true then raise exception 'sem_aceite'; end if;
  new.aceite_em := now();
  new.aceite_ip := nullif(btrim(split_part(coalesce(public.cob_cabecalho('x-forwarded-for'), ''), ',', 1)), '');
  new.aceite_ua := left(public.cob_cabecalho('user-agent'), 300);
  new.criado_em := now();
  new.ultimo_acesso := now();
  return new;
end $$;
drop trigger if exists cob_membros_antes on public.cob_membros;
create trigger cob_membros_antes before insert on public.cob_membros
  for each row execute function public.cob_membros_antes();

drop policy if exists "membros: ve o proprio ou admin" on public.cob_membros;
drop policy if exists "membros: cadastra o proprio"    on public.cob_membros;
drop policy if exists "membros: admin edita"           on public.cob_membros;
drop policy if exists "membros: apaga o proprio ou admin" on public.cob_membros;
create policy "membros: ve o proprio ou admin" on public.cob_membros for select to authenticated using (user_id = auth.uid() or public.e_admin());
create policy "membros: cadastra o proprio"    on public.cob_membros for insert to authenticated with check (user_id = auth.uid());
create policy "membros: admin edita"           on public.cob_membros for update to authenticated using (public.e_admin()) with check (public.e_admin());
create policy "membros: apaga o proprio ou admin" on public.cob_membros for delete to authenticated using (user_id = auth.uid() or public.e_admin());
revoke all on public.cob_membros from anon;
grant select, insert, update, delete on public.cob_membros to authenticated;

-- 5) Registro de acessos (Marco Civil, art. 15: guardar por 6 meses). O app grava ao abrir, no máximo a cada 30 min.
create table if not exists public.cob_acessos (
  id       bigint generated always as identity primary key,
  user_id  uuid not null default auth.uid() references auth.users(id) on delete cascade,
  em       timestamptz not null default now(),
  ip       text,
  ua       text
);
create index if not exists cob_acessos_user_em on public.cob_acessos (user_id, em desc);
create index if not exists cob_acessos_em on public.cob_acessos (em);
alter table public.cob_acessos enable row level security;

create or replace function public.cob_acessos_antes() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  new.user_id := auth.uid();
  new.em := now();
  new.ip := nullif(btrim(split_part(coalesce(public.cob_cabecalho('x-forwarded-for'), ''), ',', 1)), '');
  new.ua := left(public.cob_cabecalho('user-agent'), 300);
  update public.cob_membros set ultimo_acesso = now() where user_id = new.user_id;
  -- passa dos 6 meses e um pouco: apaga (de vez em quando, para não pesar)
  if random() < 0.02 then delete from public.cob_acessos where em < now() - interval '7 months'; end if;
  return new;
end $$;
drop trigger if exists cob_acessos_antes on public.cob_acessos;
create trigger cob_acessos_antes before insert on public.cob_acessos
  for each row execute function public.cob_acessos_antes();

drop policy if exists "acessos: grava o proprio" on public.cob_acessos;
drop policy if exists "acessos: admin le"        on public.cob_acessos;
create policy "acessos: grava o proprio" on public.cob_acessos for insert to authenticated with check (user_id = auth.uid());
create policy "acessos: admin le"        on public.cob_acessos for select to authenticated using (public.e_admin());
revoke all on public.cob_acessos from anon;
grant select, insert on public.cob_acessos to authenticated;
