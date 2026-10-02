-- Grimório Arcano — estrutura do banco no Supabase
-- Cole tudo no SQL Editor do Supabase e clique em Run. Pode rodar mais de uma vez sem problema.

-- 1) Assinantes: preenchida pela function da Kiwify (e por importação manual das assinantes atuais)
create table if not exists public.assinantes (
  email         text primary key,
  status        text not null default 'ativa',  -- ativa | atrasada | cancelada | reembolsada | chargeback
  nome          text,
  pedido_kiwify text,
  produto       text,
  atualizado_em timestamptz not null default now()
);
alter table public.assinantes enable row level security;
drop policy if exists "assinante le a propria linha" on public.assinantes;
create policy "assinante le a propria linha" on public.assinantes
  for select to authenticated
  using (lower(email) = lower(auth.jwt() ->> 'email'));
-- Sem políticas de escrita: só a chave de serviço (function da Kiwify) e o painel gravam aqui.

-- 2) Perfis
create table if not exists public.perfis (
  id            uuid primary key references auth.users(id) on delete cascade,
  nome          text check (char_length(nome) <= 60),
  bio           text check (char_length(bio) <= 160),
  foto_url      text,
  atualizado_em timestamptz not null default now()
);
alter table public.perfis enable row level security;
drop policy if exists "perfil proprio: ler" on public.perfis;
drop policy if exists "perfil proprio: criar" on public.perfis;
drop policy if exists "perfil proprio: editar" on public.perfis;
create policy "perfil proprio: ler"    on public.perfis for select to authenticated using (id = auth.uid());
create policy "perfil proprio: criar"  on public.perfis for insert to authenticated with check (id = auth.uid());
create policy "perfil proprio: editar" on public.perfis for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- 3) Progresso de estudo (o mesmo conteúdo do backup do app)
create table if not exists public.progresso (
  user_id       uuid primary key references auth.users(id) on delete cascade,
  dados         jsonb not null default '{}'::jsonb,
  atualizado_em timestamptz not null default now()
);
alter table public.progresso enable row level security;
drop policy if exists "progresso proprio: ler" on public.progresso;
drop policy if exists "progresso proprio: criar" on public.progresso;
drop policy if exists "progresso proprio: editar" on public.progresso;
create policy "progresso proprio: ler"    on public.progresso for select to authenticated using (user_id = auth.uid());
create policy "progresso proprio: criar"  on public.progresso for insert to authenticated with check (user_id = auth.uid());
create policy "progresso proprio: editar" on public.progresso for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- 4) Registro dos avisos da Kiwify (para conferir o que chegou; só o painel lê)
create table if not exists public.kiwify_eventos (
  id          bigserial primary key,
  recebido_em timestamptz not null default now(),
  evento      text,
  email       text,
  resultado   text,
  corpo       jsonb
);
alter table public.kiwify_eventos enable row level security;

-- 5) Fotos de perfil: pasta pública, cada aluna grava só dentro da própria pasta (nome = id do usuário)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatares', 'avatares', true, 524288, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = true, file_size_limit = 524288, allowed_mime_types = array['image/jpeg','image/png','image/webp'];

drop policy if exists "avatar: ver o proprio" on storage.objects;
drop policy if exists "avatar: enviar o proprio" on storage.objects;
drop policy if exists "avatar: trocar o proprio" on storage.objects;
drop policy if exists "avatar: apagar o proprio" on storage.objects;
-- ver o próprio arquivo é exigido pelo Supabase para trocar (upsert) a foto
create policy "avatar: ver o proprio" on storage.objects for select to authenticated
  using (bucket_id = 'avatares' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "avatar: enviar o proprio" on storage.objects for insert to authenticated
  with check (bucket_id = 'avatares' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "avatar: trocar o proprio" on storage.objects for update to authenticated
  using (bucket_id = 'avatares' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "avatar: apagar o proprio" on storage.objects for delete to authenticated
  using (bucket_id = 'avatares' and (storage.foldername(name))[1] = auth.uid()::text);

-- 6) Liberar você mesma (troque pelo seu e-mail e rode só esta linha, se quiser)
-- insert into public.assinantes (email, status, nome) values ('seu-email@exemplo.com', 'ativa', 'Raquel')
--   on conflict (email) do update set status = 'ativa';
