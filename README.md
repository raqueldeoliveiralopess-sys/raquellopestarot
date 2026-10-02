# Grimório Arcano

App de estudo das 78 cartas do tarot (fichas, flashcards com repetição espaçada, quiz e tiragens para leitura de padrão).

Os flashcards seguem o modelo do Anki (SM-2 simplificado): cada carta tem uma data de revisão; a aluna responde Errei, Difícil, Bom ou Fácil e o intervalo cresce ou volta ao começo. Limite de cartas novas por dia (5, 10 ou 20). Cada sessão fica registrada em "Meu histórico" na aba Flashcards, com as respostas carta a carta, as cartas mais erradas e os dias seguidos de estudo. Agendamento (`S.srs`) e histórico (`S.flashHistory`) entram no backup e na nuvem. PWA: pode ser adicionado à tela inicial do celular e funciona offline.

## Como atualizar

1. Edite os arquivos (`index.html`, `cards.js` com as fichas, `tiragens.js` com as tiragens, imagens em `img/`).
2. Faça o deploy na Netlify (arraste a pasta ou conecte este repositório ao site da Netlify para o deploy ser automático a cada `git push`).
3. Pronto. No celular, basta abrir o app: ele busca a versão nova sozinho e recarrega. Não precisa remover e adicionar à tela de novo.

Não é necessário trocar o número `CACHE` em `sw.js` a cada atualização. Troque só se quiser forçar a limpeza completa do cache antigo.

## Como funciona

- `sw.js`: `index.html`, `cards.js`, `tiragens.js` e o manifest são buscados sempre da rede (cache só como reserva offline). Imagens e ícones ficam em cache permanente.
- `index.html`: quando um service worker novo assume, a página recarrega uma vez; ao voltar para o app, ele verifica se há atualização.
- `_headers`: impede a Netlify e o navegador de guardarem em cache os arquivos que mudam.

## Login, perfil e acesso só para assinantes

O app tem login por código enviado ao e-mail, perfil com foto e progresso salvo na nuvem. O acesso pode ser liberado só para quem tem assinatura ativa na Kiwify.

**Situação atual:** ligado em `modo: 'assinantes'` (`config.js`), com Supabase em São Paulo, e-mail pelo Brevo (`nao-responda@raquellopestarot.com.br`) e webhook da Kiwify ativo. Para voltar ao app sem login, mude `modo` para `'desligado'`. Com `'assinantes'` ligado, os links de teste `?modo=` não afrouxam a conferência de assinatura.

### Arquivos

- `config.js`: modo de acesso, endereço e chave pública do Supabase, link de compra da Kiwify.
- `auth.js`: login, conferência da assinatura, sincronização do progresso e perfil.
- `vendor/supabase-2.117.2.js`: biblioteca oficial do Supabase, servida pelo próprio site para o app abrir sem internet.
- `supabase/schema.sql`: tabelas, regras de segurança e pasta de fotos.
- `netlify/functions/kiwify-webhook.mjs`: recebe os avisos da Kiwify e atualiza quem é assinante.

### 1. Supabase

1. Crie uma conta em supabase.com e um projeto novo (região São Paulo).
2. Em **SQL Editor**, cole todo o conteúdo de `supabase/schema.sql` e clique em **Run**.
3. Em **Authentication → Sign In / Providers → Email**, deixe o e-mail ligado e o **Email OTP Length** em 6.
4. Em **Authentication → Emails → Templates**, edite os modelos **Magic Link** e **Confirm signup** para mostrar o código. Exemplo de corpo:

   ```html
   <h2>Seu código do Grimório Arcano</h2>
   <p>Digite este código no app:</p>
   <p style="font-size:28px;letter-spacing:6px"><b>{{ .Token }}</b></p>
   <p>Ele vale por alguns minutos. Se não foi você, ignore este e-mail.</p>
   ```

5. **Obrigatório para as alunas receberem o código:** em **Authentication → Emails → SMTP Settings**, configure um serviço de envio próprio (Brevo e Resend têm plano gratuito). O envio padrão do Supabase só entrega para os membros da sua equipe no Supabase e com limite baixo por hora, serve apenas para o seu teste.
6. Em **Project Settings → API**, copie o **Project URL** e a chave **anon public**. Elas vão no `config.js` (são públicas por natureza). A chave **service_role** é secreta e vai só na Netlify.
7. Para se liberar, rode no SQL Editor (com o seu e-mail):

   ```sql
   insert into public.assinantes (email, status, nome) values ('seu-email@exemplo.com', 'ativa', 'Raquel')
     on conflict (email) do update set status = 'ativa';
   ```

### 2. Netlify

Em **Site configuration → Environment variables**, crie:

| Variável | Valor |
| --- | --- |
| `SUPABASE_URL` | o Project URL do Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | a chave service_role do Supabase |
| `KIWIFY_TOKEN` | o token mostrado pela Kiwify ao criar o webhook |
| `KIWIFY_PRODUCT_ID` | opcional: id do produto Grimório, para ignorar vendas de outros produtos |
| `BREVO_API_KEY` | opcional: chave de API do Brevo (SMTP & API → Chaves de API). Com ela, quem compra recebe o e-mail de boas-vindas com o link do app |
| `EMAIL_RESPOSTA` | opcional: e-mail que recebe as respostas das alunas ao e-mail de boas-vindas |

Depois de criar as variáveis, faça um novo deploy (Deploys → Trigger deploy).

### 3. Kiwify

1. Em **Apps → Webhooks**, crie um webhook para o produto Grimório Arcano.
2. URL: `https://SEU-SITE.netlify.app/.netlify/functions/kiwify-webhook`
3. Eventos: compra aprovada, compra reembolsada, chargeback, assinatura cancelada, assinatura atrasada, assinatura renovada.
4. Copie o token gerado para a variável `KIWIFY_TOKEN` da Netlify.

Cada aviso recebido fica registrado na tabela `kiwify_eventos` do Supabase, com o resultado. É ali que se confere se a Kiwify está chegando.

### 4. Assinantes que já existem

A Kiwify só avisa vendas novas. Para liberar quem já assina: exporte da Kiwify a lista de assinaturas ativas em CSV, monte uma planilha com as colunas `email` e `status` (valor `ativa`), salve como CSV e importe em **Table Editor → assinantes → Insert → Import data from CSV**.

### 5. Ligar

Para testar sem afetar as alunas, abra o app com `?modo=login` no fim do endereço (por exemplo `https://SEU-SITE.netlify.app/?modo=login`). O modo de teste vale só naquele aparelho e continua ligado até você abrir o app com `?modo=desligado`. Também existe `?modo=assinantes`, para testar o bloqueio de quem não assina.


1. No `config.js`, preencha `supabaseUrl`, `supabaseAnonKey` e `linkAssinatura`, e mude `modo` para `'login'`. Teste com o seu e-mail: entrar, editar o perfil, estudar uma carta, abrir em outro aparelho.
2. Quando tudo estiver certo, mude `modo` para `'assinantes'`.

Status que liberam o acesso: `ativa` e `atrasada` (atraso de pagamento ainda não bloqueia). `cancelada`, `reembolsada` e `chargeback` bloqueiam. Sem internet, o app continua liberado por `diasOffline` dias depois da última conferência.

Ao sair da conta, o progresso continua na nuvem e é apagado do aparelho. Se outra pessoa entrar no mesmo aparelho, os dados não se misturam.

## Comunidade

Mural único com temas (Estudo de carta, Tiragem, Dúvida, Reflexão) para as assinantes, com comentários, curtidas e fotos. A aba **Comunidade** só aparece para quem está logada.

### Ligar

1. No Supabase, em **SQL Editor**, cole e rode `supabase/comunidade.sql` (depois do `schema.sql`). Até rodar, a aba mostra "A comunidade ainda está sendo preparada".
2. Torne-se administradora, trocando pelo seu e-mail:

   ```sql
   insert into public.admins (email) values ('seu-email@exemplo.com') on conflict do nothing;
   ```

3. Saia e entre de novo no app para o poder de administradora valer.

### Moderação

- Administradora vê o menu de três pontos em todo post: **Fixar no topo** (vira "Aviso"), **Apagar post** e **Bloquear esta aluna de postar**. Em comentários de qualquer pessoa aparece **Apagar**.
- Cada aluna apaga só os próprios posts e comentários.
- Aluna bloqueada continua lendo, mas não posta nem comenta. Para desbloquear, apague a linha dela em **Table Editor → bloqueadas**.
- As regras exibidas em "Combinados da roda" ficam em `index.html` (função `comunidadeView`).

Arquivos: `comunidade.js` (leitura e escrita), telas em `index.html`, banco em `supabase/comunidade.sql` (tabelas `posts`, `comentarios`, `curtidas`, `admins`, `bloqueadas`, bucket `comunidade`).
