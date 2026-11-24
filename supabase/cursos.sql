-- Cursos em áudio (podcast) na aba Aulas. Cole tudo no SQL Editor do Supabase e clique em Run. Pode rodar mais de uma vez.
-- (É a seção 13 do cob.sql. Precisa das seções 7 e 8 já rodadas.)

-- 13) Cursos em áudio (podcast) na aba Aulas.
--     Um curso usa a mesma estrutura dos livros do Clube: cob_clube_livros com tipo 'curso' e as aulas em cob_clube_aulas.
--     O áudio de cada aula fica no bucket privado cob-aulas (só membros e a admin ouvem); a admin envia pelo app.
alter table public.cob_clube_livros add column if not exists tipo text not null default 'livro';
alter table public.cob_clube_livros drop constraint if exists cob_clube_livros_tipo_check;
alter table public.cob_clube_livros add constraint cob_clube_livros_tipo_check check (tipo in ('livro', 'curso'));
alter table public.cob_clube_aulas add column if not exists audio text;            -- caminho do áudio no bucket cob-aulas
alter table public.cob_clube_aulas add column if not exists audio_nome text;
alter table public.cob_clube_aulas add column if not exists audio_tamanho bigint;
alter table public.cob_clube_aulas add column if not exists audio_duracao int;     -- em segundos
alter table public.cob_clube_aulas drop constraint if exists cob_clube_aulas_audio_duracao_check;
alter table public.cob_clube_aulas add constraint cob_clube_aulas_audio_duracao_check check (audio_duracao is null or audio_duracao > 0);

-- o bucket das aulas passa a aceitar áudio (mantém tudo o que já aceitava)
update storage.buckets
   set allowed_mime_types = (select array_agg(distinct m) from unnest(coalesce(allowed_mime_types, '{}') || array['audio/mpeg', 'audio/mp4', 'audio/x-m4a', 'audio/aac', 'audio/ogg']) m)
 where id = 'cob-aulas';
