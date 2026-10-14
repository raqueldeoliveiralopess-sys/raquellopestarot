---
name: carrossel-shopee
description: Modo automático de criação de carrosséis de achadinhos (Shopee, Shein, Mercado Livre) da Raquel Lopes. Use quando a Raquel mandar um ou mais produtos (link, nome, preço, foto) e pedir carrossel, achadinho, post de oferta ou "faz o carrossel desses produtos". Gera as fotos no Magnific, monta os slides no estilo das referências, escreve legenda e mensagem do grupo.
---

# Carrossel de achadinhos (modo automático)

Você vai transformar produtos em um carrossel pronto para postar: capa com a
creator, um slide por produto, slide final de "comente QUERO", legenda e
mensagem do grupo do Mercado Holístico. Tudo sem perguntar nada que dê para
decidir sozinho.

## Identidade visual (manda mais que o DNA escrito)

Os carrosséis seguem os cinco posts em `referencias/`, não a paleta escura do
DNA V2. Resumo do que está lá:

- **Foto:** luz dourada de fim de tarde, parede clara, sombras suaves de folhas.
  Produto em cena de casa aconchegante: cômoda ou mesa de madeira clara, plantas
  (jiboia), vela acesa em copo de vidro, ametista e quartzo rosa, mosquitinho em
  vaso, livro antigo aberto, detalhes dourados (espelho sol, bandeja).
- **Capa e final:** a creator gerada por IA, cabelo cacheado longo castanho,
  lenço de renda, óculos pequenos, vestido de renda off-white, bota marrom,
  colar de coração. Golden hour, rua arborizada ou porta de carro. Mesmo rosto
  em todos os carrosséis: use `referencias/05-capa-bruxa-herdeira.jpg` como
  referência de imagem.
- **Texto:** nome do produto em duas linhas no topo: linha 1 em bold
  arredondada branca sobre pincelada rosa, linha 2 em script rosa com contorno
  rosa-claro. Rabiscos de estrela, coração, lua e raios em branco, rosa e laranja.
- **Capa:** "Da série: coisas de bruxa [adjetivo] que achei na SHOPEE e estou
  0% arrependida". O adjetivo muda a cada carrossel (herdeira, ocupada,
  preguiçosa, poderosa, caseira).
- **Final:** "comente QUERO para receber os links" + "compartilhe com as amigas
  bruxas que vão amar esses Achadinhos". Esse slide não muda.

## Fluxo

### 1. Entrada

Aceite qualquer combinação: link da Shopee, nome, preço, foto (URL ou arquivo),
categoria. A Shopee não abre por scraping neste ambiente, então não tente
baixar a página: use o que a Raquel mandou e, se faltar nome ou foto, peça só
isso em uma linha. Preço e link não aparecem nos slides, vão na legenda e na
mensagem do grupo; se faltarem, deixe o campo em branco e avise no final.

Crie o arquivo com `node scripts/novo-produto.mjs <slug> "Nome 1" "Nome 2"`.
O slug é curto, minúsculo, com hífen (ex.: `achadinhos-altar-outubro`).

### 2. Nome em duas linhas

Linha 1 (bold branca) = o tipo do objeto. Linha 2 (script rosa) = o que o
diferencia. Exemplos das referências: "Caneca de Cerâmica / Livro Gato Preto",
"Estátua / Afrodite", "Decoração de / Parede Sol". Nome longo: use `tam1: "lg"`
e `tam2: "xl"` no slide. Nunca deixe uma linha passar de 22 caracteres.

### 3. Fotos no Magnific

Antes de gastar crédito, rode `simulate_cost` para um `images_generate` em
modo `auto`, 4:5, count 1, e siga em frente se a conta tiver saldo. Se um
pedido de geração for negado, pare e pergunte, não insista.

**Produto** (um por slide):
1. Se houver foto da Shopee, importe com `creations_upload_image` (URL) ou
   `creations_request_upload` + `creations_finalize_upload` (arquivo).
2. `images_generate`, `mode: "auto"`, `aspectRatio: "4:5"`, `count: 1`,
   `references: [{type: "image", identifier: <foto>}]` e o prompt:

   > {descrição do produto, igual à foto de referência} placed on a light wooden
   > dresser in a cozy sunlit boho bedroom, warm golden hour light coming through
   > a window, soft leaf shadows on a cream wall, trailing pothos plant, a lit
   > candle in a textured glass holder, amethyst and rose quartz crystals, a
   > small vase of baby's breath, an old open book, gold accents. The product is
   > centered and sharp, with empty space above it for a title. No text, no
   > people. Vertical photo.

   Sem foto de referência, descreva o produto em detalhe no lugar da chave.

**Capa e final** (a creator):
1. Importe `referencias/05-capa-bruxa-herdeira.jpg` uma vez e use como
   `references: [{type: "image", identifier: ...}]`.
2. Prompt da capa:

   > The same woman as the reference, long curly brown hair, white lace
   > headscarf, small oval sunglasses, white lace dress, brown leather boots,
   > heart pendant necklace, posing in golden hour light on a tree-lined street
   > beside an open black car door, holding {um dos produtos}. Warm sunlight,
   > film look. Empty space on the left and bottom right for text. No text.

   Prompt do final: a mesma pessoa, no mesmo cenário, em outra pose (encostada
   no carro, comendo um morango, rindo). Peça espaço livre no topo esquerdo e
   no canto inferior direito.

3. Espere com `creations_wait` e baixe cada `url` com curl para
   `output/<slug>/img/` (`capa.png`, `produto-1.png`, ..., `cta.png`).
4. Olhe cada imagem (Read). Reprove e gere de novo se: o produto mudou de
   forma ou cor, apareceu texto, a luz ficou fria ou de estúdio, a creator
   mudou de rosto ou cabelo. No máximo duas tentativas por imagem; depois disso
   use a melhor e avise.

### 4. Textos

Siga a skill `dna-raquel-lopes` para a voz: Amiga + Rebelde, "cara", "meu
anjo", "achadinho de bruxa", fecha com "né", "sabe". Nenhum objeto promete
efeito: vela, cristal e estátua não trazem amor nem dinheiro. Nada de "o
universo conspira", "luz e amor", "gratidão por tudo", "destino garantido".

- **Legenda do Instagram:** gancho de uma linha, um parágrafo curto por
  produto (o que é, pra que serve na prática, quanto custa), fecho "comenta
  QUERO que eu te mando o link" e "o grupo do Mercado Holístico tá na bio".
  Até 900 caracteres. Sem hashtag em excesso: três, no máximo.
- **Mensagem do grupo (WhatsApp):** uma por produto, com nome, preço, link de
  afiliado e uma frase de amiga que achou. Emojis com moderação.

Preencha `legenda` e `whatsapp` no JSON.

### 5. Render e revisão

```bash
node scripts/render.mjs <slug>
```

Abra cada PNG em `output/<slug>/slides/` e confira:

- título inteiro na tela, sem cortar nem invadir o produto;
- pincelada atrás da linha 1 e contorno claro na linha 2;
- rabiscos fora do produto e do texto (troque `seed` no slide se colidirem);
- capa com os três blocos legíveis sobre a foto.

Ajuste o JSON (tamanhos `tam1`/`tam2`, `seed`, textos) e renderize de novo.

### 6. Entrega

Mande os PNG e o `legenda.md` com SendUserFile, diga em duas linhas o que foi
gerado e o que ficou faltando (preço, link, foto). Commite `produtos/<slug>.json`
e as imagens de `output/<slug>/img/` só se a Raquel pedir para guardar.

## Checagem final de marca

- Fundo claro e dourado, nunca escuro nem neutro de estúdio.
- Rosa e laranja só em texto, pincelada e rabisco.
- Mesma creator, mesmo cabelo cacheado solto.
- Nenhuma promessa de efeito nos textos.
- Slide final idêntico ao padrão.
