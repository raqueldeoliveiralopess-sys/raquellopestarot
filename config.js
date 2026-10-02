// Grimório Arcano — configuração de acesso
//
// modo:
//   'desligado'  → o app funciona como antes, sem login (padrão até tudo estar configurado)
//   'login'      → pede login por e-mail, mas não confere assinatura (para testar)
//   'assinantes' → só entra quem tem assinatura ativa na Kiwify
//
// Para testar sem afetar as alunas: abra o app com ?modo=login (ou ?modo=assinantes) no fim do endereço.
// Vale só naquele aparelho. Para desfazer, abra com ?modo=desligado.
//
// supabaseUrl e supabaseAnonKey vêm do painel do Supabase (Project Settings → API).
// A chave "anon" é pública por natureza: pode ficar aqui. NUNCA coloque a "service_role" neste arquivo.
window.GA_CONFIG = {
  modo: 'assinantes',
  supabaseUrl: 'https://garcewmgyljmscygqrab.supabase.co',
  supabaseAnonKey: 'sb_publishable_PQ7lWZMrCMPS7KXX16gjpg_u8NZ6n9P',
  // link da página de compra da assinatura na Kiwify, mostrado para quem ainda não assina
  linkAssinatura: 'https://pay.kiwify.com.br/mGgkkRc',
  // dias que o app continua liberado sem internet depois da última confirmação de assinatura
  diasOffline: 7
};
