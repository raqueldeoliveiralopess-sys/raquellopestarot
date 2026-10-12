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
--    Limite de 150 MB por arquivo. O limite geral em Storage → Settings → "Upload file size limit" precisa ser igual ou maior.
--    Arquivos acima de 6 MB são enviados em partes (upload retomável), então quedas de conexão não perdem o envio.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('cob-livros', 'cob-livros', true, 157286400, array['application/pdf', 'image/webp', 'image/jpeg', 'image/png'])
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
