# Ligação com o app Mercado Holístico

O app (`D:\dev\mercado-holistico`, FastAPI) já sorteia os produtos do dia no
Estúdio, propõe o tema e guarda a foto do anúncio e as fotos de referência da
modelo. Este repositório faz o resto: gera as fotos no Magnific, monta os
slides e escreve legenda e mensagem do grupo. A ponte é um JSON por dia.

```
Estúdio (app)  ──GET /estudio/<dia>/carrossel.json──▶  importar-estudio.mjs
                                                            │
                                      produtos/estudio-<dia>.json + fotos
                                                            │
                                 skill carrossel-shopee (Claude Code no PC)
                                                            │
                               Magnific → render.mjs --saida <pasta do dia>
                                                            │
                            D:\dev\mercado-holistico\estudio\<dia>\carrossel\
```

## Uma vez só, no PC

1. **Rota no app.** Cole o conteúdo de `rota_carrossel.py` no fim de
   `app/routes/estudio.py` e reinicie o app. Teste em
   `http://127.0.0.1:8000/estudio/<dia>/carrossel.json`.
2. **Este repositório no PC.**
   ```powershell
   cd D:\dev
   git clone https://github.com/raqueldeoliveiralopess-sys/raquellopestarot.git
   cd raquellopestarot
   npm install
   npx playwright install chromium
   ```
3. **Claude Code na pasta do repositório** (`cd D:\dev\raquellopestarot` e
   `claude`). O conector do Magnific que você adicionou em Conectores
   personalizados aparece lá; a skill `carrossel-shopee` vem com o repositório.
   Confirme com `/mcp` que o Magnific está autenticado.

## Todo dia

1. No app: Estúdio → dia → sortear → gerar tema.
2. No Claude Code do repositório, diga:
   > faz o carrossel do estúdio de hoje: http://127.0.0.1:8000/estudio/2026-10-14/carrossel.json
3. Ele importa, gera as fotos no Magnific (foto do anúncio como referência do
   produto; fotos da modelo como referência da capa e do final), monta os
   slides, escreve legenda e mensagem do grupo e copia tudo para
   `estudio\<dia>\carrossel\`.

Sem o Claude no meio, o caminho manual continua valendo: baixe as fotos no
app do Magnific e monte no Montador de Achadinhos.

## O que o JSON carrega

`produtos[]` com nome, preço formatado, link de afiliado, tipo, foto do
anúncio; `modelo.referencias` com as fotos da ficha; `titulo`/`temas` do dia;
`slides` já no formato capa → produto × N → final; `saida` com a pasta do dia.
