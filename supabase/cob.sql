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

-- membro = quem tem cadastro no COB (tabela cob_membros, seção 4). plpgsql para poder existir antes da tabela.
create or replace function public.e_membro() returns boolean
language plpgsql stable security definer set search_path = public as $$
begin
  return exists (select 1 from public.cob_membros where user_id = auth.uid());
exception when undefined_table then return false;
end $$;
revoke all on function public.e_membro() from public, anon;
grant execute on function public.e_membro() to authenticated;

-- 2) Os livros: quem vê (membros cadastrados e admin) e quem mexe (só admin)
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
drop policy if exists "estante: membros leem" on public.cob_livros;
create policy "estante: membros leem" on public.cob_livros for select to authenticated using (public.e_membro() or public.e_admin());
create policy "estante: admin inclui" on public.cob_livros for insert to authenticated with check (public.e_admin());
create policy "estante: admin edita"  on public.cob_livros for update to authenticated using (public.e_admin()) with check (public.e_admin());
create policy "estante: admin remove" on public.cob_livros for delete to authenticated using (public.e_admin());

revoke all on public.cob_livros from anon;
grant select on public.cob_livros to authenticated;
grant insert, update, delete on public.cob_livros to authenticated;

-- 3) Os arquivos: bucket PRIVADO. Só membros cadastrados (e a admin) leem e baixam; escrita só de admin.
--    O app usa links assinados para capas e downloads, e a sessão de quem está logado para o leitor.
--    Limite de 500 MB por arquivo (plano Pro). O limite geral em Storage → Settings → "Upload file size limit" precisa ser igual ou maior.
--    Arquivos acima de 6 MB são enviados em partes (upload retomável), então quedas de conexão não perdem o envio.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('cob-livros', 'cob-livros', false, 524288000, array['application/pdf', 'image/webp', 'image/jpeg', 'image/png'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "cob-livros: todos leem"   on storage.objects;
drop policy if exists "cob-livros: admin envia"  on storage.objects;
drop policy if exists "cob-livros: admin troca"  on storage.objects;
drop policy if exists "cob-livros: admin apaga"  on storage.objects;
drop policy if exists "cob-livros: membros leem" on storage.objects;
create policy "cob-livros: membros leem" on storage.objects for select to authenticated using (bucket_id = 'cob-livros' and (public.e_membro() or public.e_admin()));
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

-- 6) Quem leu ou baixou cada livro da Estante (para rastrear vazamentos). Guardado por 6 meses, como os acessos.
create table if not exists public.cob_leituras (
  id        bigint generated always as identity primary key,
  user_id   uuid not null default auth.uid() references auth.users(id) on delete cascade,
  livro_id  bigint references public.cob_livros(id) on delete set null,
  titulo    text,              -- cópia do título na hora (continua legível se o livro for removido)
  arquivo   text,
  tipo      text not null check (tipo in ('ler', 'baixar')),
  em        timestamptz not null default now(),
  ip        text,
  ua        text
);
create index if not exists cob_leituras_em on public.cob_leituras (em desc);
create index if not exists cob_leituras_user on public.cob_leituras (user_id, em desc);
create index if not exists cob_leituras_livro on public.cob_leituras (livro_id, em desc);
alter table public.cob_leituras enable row level security;

create or replace function public.cob_leituras_antes() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  new.user_id := auth.uid();
  new.em := now();
  new.ip := nullif(btrim(split_part(coalesce(public.cob_cabecalho('x-forwarded-for'), ''), ',', 1)), '');
  new.ua := left(public.cob_cabecalho('user-agent'), 300);
  select l.titulo, l.arquivo into new.titulo, new.arquivo from public.cob_livros l where l.id = new.livro_id;
  if new.titulo is null then raise exception 'livro_inexistente'; end if;
  if random() < 0.02 then delete from public.cob_leituras where em < now() - interval '7 months'; end if;
  return new;
end $$;
drop trigger if exists cob_leituras_antes on public.cob_leituras;
create trigger cob_leituras_antes before insert on public.cob_leituras
  for each row execute function public.cob_leituras_antes();

drop policy if exists "leituras: membro grava a propria" on public.cob_leituras;
drop policy if exists "leituras: admin le"               on public.cob_leituras;
create policy "leituras: membro grava a propria" on public.cob_leituras for insert to authenticated with check (user_id = auth.uid() and (public.e_membro() or public.e_admin()));
create policy "leituras: admin le"               on public.cob_leituras for select to authenticated using (public.e_admin());
revoke all on public.cob_leituras from anon;
grant select, insert on public.cob_leituras to authenticated;

-- 7) Vídeo e apostilas de cada aula (a admin envia pelo app, dentro da aula). Só membros e admin assistem e baixam.
create table if not exists public.cob_aula_midia (
  id            bigint generated always as identity primary key,
  aula_id       text not null,                 -- id da aula em cob/aulas.js (ex.: a1)
  tipo          text not null check (tipo in ('video', 'apostila')),
  titulo        text not null,
  arquivo       text,                          -- caminho no bucket cob-aulas (vídeo ou apostila enviada)
  link          text,                          -- ou um link externo (YouTube não listado, Vimeo, Panda)
  nome_arquivo  text,
  tamanho       bigint,
  ordem         int not null default 0,
  criado_em     timestamptz not null default now(),
  check (arquivo is not null or link is not null)
);
create index if not exists cob_aula_midia_aula on public.cob_aula_midia (aula_id, ordem);
alter table public.cob_aula_midia enable row level security;

drop policy if exists "aula midia: membros leem"   on public.cob_aula_midia;
drop policy if exists "aula midia: admin inclui"   on public.cob_aula_midia;
drop policy if exists "aula midia: admin edita"    on public.cob_aula_midia;
drop policy if exists "aula midia: admin remove"   on public.cob_aula_midia;
create policy "aula midia: membros leem" on public.cob_aula_midia for select to authenticated using (public.e_membro() or public.e_admin());
create policy "aula midia: admin inclui" on public.cob_aula_midia for insert to authenticated with check (public.e_admin());
create policy "aula midia: admin edita"  on public.cob_aula_midia for update to authenticated using (public.e_admin()) with check (public.e_admin());
create policy "aula midia: admin remove" on public.cob_aula_midia for delete to authenticated using (public.e_admin());
revoke all on public.cob_aula_midia from anon;
grant select, insert, update, delete on public.cob_aula_midia to authenticated;

-- bucket privado das aulas: até 2 GB por arquivo (o limite geral em Storage → Settings precisa ser igual ou maior)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('cob-aulas', 'cob-aulas', false, 2147483648, array[
  'video/mp4', 'video/quicktime', 'video/webm', 'video/x-m4v',
  'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'image/png', 'image/jpeg', 'image/webp'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "cob-aulas: membros leem" on storage.objects;
drop policy if exists "cob-aulas: admin envia"  on storage.objects;
drop policy if exists "cob-aulas: admin troca"  on storage.objects;
drop policy if exists "cob-aulas: admin apaga"  on storage.objects;
create policy "cob-aulas: membros leem" on storage.objects for select to authenticated using (bucket_id = 'cob-aulas' and (public.e_membro() or public.e_admin()));
create policy "cob-aulas: admin envia"  on storage.objects for insert to authenticated with check (bucket_id = 'cob-aulas' and public.e_admin());
create policy "cob-aulas: admin troca"  on storage.objects for update to authenticated using (bucket_id = 'cob-aulas' and public.e_admin());
create policy "cob-aulas: admin apaga"  on storage.objects for delete to authenticated using (bucket_id = 'cob-aulas' and public.e_admin());

-- 8) Clube do Livro: os livros estudados e as aulas de cada um. A admin cadastra e edita pelo app (aba Aulas);
--    nada disso precisa de mudança no código a cada aula nova.
--    Membros veem só as aulas publicadas (ou programadas cuja data já chegou); rascunhos só a admin vê.
create table if not exists public.cob_clube_livros (
  id         bigint generated always as identity primary key,
  titulo     text not null,
  autores    text,
  descricao  text,
  livro_id   bigint references public.cob_livros(id) on delete set null,  -- o PDF do livro na Estante
  capa       text,                                                         -- imagem própria no bucket cob-aulas (vazia = capa da Estante)
  ordem      int not null default 0,
  criado_em  timestamptz not null default now()
);
alter table public.cob_clube_livros enable row level security;

create table if not exists public.cob_clube_aulas (
  id            bigint generated always as identity primary key,
  livro         bigint not null references public.cob_clube_livros(id) on delete restrict,
  numero        int not null check (numero > 0),
  titulo        text not null,
  descricao     text,
  youtube       text check (youtube is null or youtube ~ '^[A-Za-z0-9_-]{11}$'),  -- só o ID do vídeo
  publicar_em   timestamptz,           -- data da aula; nas programadas, quando ela aparece para a turma
  paginas       text,                  -- ex.: "Até a página 79 do PDF"
  pagina_ini    int check (pagina_ini is null or pagina_ini > 0),  -- página em que o leitor abre o PDF
  livro_id      bigint references public.cob_livros(id) on delete set null,  -- outro PDF só para esta aula (vazio = o do livro)
  atividade     text,                  -- perguntas para o grimório, uma por linha
  proxima       text,                  -- aviso sobre a próxima aula
  capa          text,                  -- imagem própria no bucket cob-aulas (vazia = miniatura do YouTube)
  status        text not null default 'rascunho' check (status in ('rascunho', 'publicada', 'programada')),
  criado_em     timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  unique (livro, numero)
);
create index if not exists cob_clube_aulas_livro on public.cob_clube_aulas (livro, numero);
alter table public.cob_clube_aulas enable row level security;

create or replace function public.cob_clube_aulas_antes() returns trigger
language plpgsql as $$
begin
  new.atualizado_em := now();
  return new;
end $$;
drop trigger if exists cob_clube_aulas_antes on public.cob_clube_aulas;
create trigger cob_clube_aulas_antes before update on public.cob_clube_aulas
  for each row execute function public.cob_clube_aulas_antes();

drop policy if exists "clube livros: membros leem" on public.cob_clube_livros;
drop policy if exists "clube livros: admin inclui" on public.cob_clube_livros;
drop policy if exists "clube livros: admin edita"  on public.cob_clube_livros;
drop policy if exists "clube livros: admin remove" on public.cob_clube_livros;
create policy "clube livros: membros leem" on public.cob_clube_livros for select to authenticated using (public.e_membro() or public.e_admin());
create policy "clube livros: admin inclui" on public.cob_clube_livros for insert to authenticated with check (public.e_admin());
create policy "clube livros: admin edita"  on public.cob_clube_livros for update to authenticated using (public.e_admin()) with check (public.e_admin());
create policy "clube livros: admin remove" on public.cob_clube_livros for delete to authenticated using (public.e_admin());
revoke all on public.cob_clube_livros from anon;
grant select, insert, update, delete on public.cob_clube_livros to authenticated;

drop policy if exists "clube aulas: membros leem as liberadas" on public.cob_clube_aulas;
drop policy if exists "clube aulas: admin inclui"              on public.cob_clube_aulas;
drop policy if exists "clube aulas: admin edita"               on public.cob_clube_aulas;
drop policy if exists "clube aulas: admin remove"              on public.cob_clube_aulas;
create policy "clube aulas: membros leem as liberadas" on public.cob_clube_aulas for select to authenticated using (
  public.e_admin() or (public.e_membro() and (status = 'publicada' or (status = 'programada' and publicar_em <= now()))));
create policy "clube aulas: admin inclui" on public.cob_clube_aulas for insert to authenticated with check (public.e_admin());
create policy "clube aulas: admin edita"  on public.cob_clube_aulas for update to authenticated using (public.e_admin()) with check (public.e_admin());
create policy "clube aulas: admin remove" on public.cob_clube_aulas for delete to authenticated using (public.e_admin());
revoke all on public.cob_clube_aulas from anon;
grant select, insert, update, delete on public.cob_clube_aulas to authenticated;

-- primeiro livro e Aula 01 (só entram se as tabelas estiverem vazias; rodar de novo não duplica nem desfaz edições)
-- o PDF é o "História da Bruxaria" de Russell e Alexander já enviado à Estante; se não for achado, escolha no app em "Editar livro"
insert into public.cob_clube_livros (id, titulo, autores, livro_id, ordem)
overriding system value
select 1, 'História da Bruxaria', 'Jeffrey B. Russell e Brooks Alexander',
  (select l.id from public.cob_livros l
    where translate(lower(l.titulo || ' ' || coalesce(l.autor, '')), 'áàâãéêíóôõúç', 'aaaaeeiooouc') like '%historia da bruxaria%'
      and (lower(l.titulo || ' ' || coalesce(l.autor, '')) like '%russell%' or l.tamanho > 10485760)
    order by (lower(l.titulo || ' ' || coalesce(l.autor, '')) like '%russell%') desc, l.tamanho desc nulls last
    limit 1),
  1
where not exists (select 1 from public.cob_clube_livros);

insert into public.cob_clube_aulas (id, livro, numero, titulo, descricao, youtube, publicar_em, paginas, atividade, proxima, status)
overriding system value
select 1, 1, 1, 'Mentiram sobre as bruxas? | Quem construiu a imagem da bruxa?',
  E'Nesta primeira aula do Clube do Livro, investigamos como a imagem da bruxa foi construída ao longo dos séculos.\n\nEstudamos as origens da feitiçaria, as práticas mágicas das civilizações antigas, a influência do paganismo e do folclore europeu, as interpretações de Margaret Murray e os primeiros vínculos entre feitiçaria, heresia e demonologia.\n\nA proposta é compreender a diferença entre aquilo que as pessoas praticavam, aquilo em que acreditavam e aquilo de que eram acusadas.',
  'QXVc1ZMeJYU', '2026-10-31 12:00:00-03', 'Até a página 79 do PDF',
  E'Como você definia a palavra bruxa antes desta aula?\nQual é a diferença entre feitiçaria e bruxaria histórica?\nPor que determinadas tensões sociais aumentavam as acusações de bruxaria?\nQual é a principal crítica histórica à teoria de Margaret Murray?\nPor que uma acusação histórica não comprova que o acontecimento descrito realmente ocorreu?',
  'Continuação do Capítulo 3, a partir da página 80 do PDF.',
  'publicada'
where not exists (select 1 from public.cob_clube_aulas) and exists (select 1 from public.cob_clube_livros where id = 1);

-- os próximos cadastros continuam a numeração depois do 1
select setval(pg_get_serial_sequence('public.cob_clube_livros', 'id'), greatest((select max(id) from public.cob_clube_livros), 1));
select setval(pg_get_serial_sequence('public.cob_clube_aulas', 'id'), greatest((select max(id) from public.cob_clube_aulas), 1));
