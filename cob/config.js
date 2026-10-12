// COB — configuração da Estante de livros
// supabaseUrl e supabaseAnonKey são os mesmos do Grimório (Project Settings → API).
// A chave "anon" é pública por natureza. NUNCA coloque a "service_role" aqui.
window.COB_CONFIG = {
  supabaseUrl: 'https://garcewmgyljmscygqrab.supabase.co',
  supabaseAnonKey: 'sb_publishable_PQ7lWZMrCMPS7KXX16gjpg_u8NZ6n9P',
  bucket: 'cob-livros',
  // tamanho máximo de cada PDF (precisa bater com o file_size_limit do bucket no Supabase)
  limiteMB: 150
};
