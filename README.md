# Raquel Lopes Tarot — carrosséis de achadinhos (Shopee)

Modo automático de criação de carrosséis de oferta do Mercado Holístico.
A identidade visual segue as referências em `referencias/`: foto em luz dourada,
nome do produto em bold arredondada + script rosa com pincelada, rabiscos de
estrela, coração e lua, capa com a creator e slide final de "comente QUERO".

## Como funciona

1. Você passa o produto (nome, preço, link, foto da Shopee) ou só o link.
2. O Magnific gera as fotos: a creator na capa e no final, e o produto em cena
   ensolarada com plantas, velas e cristais.
3. `scripts/render.mjs` monta os slides (1080x1350) a partir de
   `produtos/<slug>.json` e exporta PNG em `output/<slug>/slides/`.
4. A legenda e a mensagem do grupo saem em `output/<slug>/legenda.md`.

```bash
npm install
node scripts/render.mjs <slug>          # renderiza os PNG
node scripts/render.mjs <slug> --html-only
```

## Estrutura

- `templates/` — `capa.html`, `produto.html`, `cta.html`, `base.css`
- `scripts/render.mjs` — renderizador (Playwright + Chromium)
- `scripts/doodles.mjs` — rabiscos por zona, reproduzíveis por seed
- `fonts/` — fontes embutidas no render (`fonts.json` diz família e peso)
- `produtos/` — um JSON por carrossel
- `referencias/` — os cinco posts de referência da identidade visual
- `.claude/skills/carrossel-shopee/` — o fluxo automático que o Claude segue
