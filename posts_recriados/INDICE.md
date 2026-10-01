# Posts recriados — pastas Shopee e Shein (DNA V2)

Carrosséis de oferta prontos no formato da linha editorial V2: voz de amiga
que achou e avisou (o que é, pra que serve, quanto custa), nenhum objeto
promete efeito, CTA para o grupo do Mercado Holístico no WhatsApp.

Cada arquivo traz: 6 slides (texto + direção de arte com a paleta hex +
nota de voz), legenda e 10 hashtags. O campo **[PREÇO]** fica em aberto para
preencher com o valor real do link de afiliado no dia do post.

## Pasta Shopee

| Post | Achadinho | Gancho principal |
|---|---|---|
| `shopee/01_baralho_tarot_caixa_rigida.md` | Baralho clássico 78 cartas, caixa rígida | "O baralho que eu indicaria pra começar" |
| `shopee/02_kit_altar_castical_incensario.md` | Kit de altar: toalha, castiçal, incensário | "Altar bonito sem gastar um aluguel" |
| `shopee/03_caderno_grimorio_papelaria_magica.md` | Caderno grimório capa dura | "Decorar carta é furada. Anotar o que ela te mostrou, não." |

## Pasta Shein

| Post | Achadinho | Gancho principal |
|---|---|---|
| `shein/01_vestido_longo_whimsigoth.md` | Vestido longo fluido manga ampla | "Parece brechó de outro século" |
| `shein/02_cardiga_textura_colete_vintage.md` | Cardigã de textura + colete vintage | "A camada que separa roupa de presença" |
| `shein/03_colar_pingente_aneis_simbolicos.md` | Anéis grandes + colar de pingente | "Anel grande não é exagero. É pontuação." |

## Para recriar a partir dos SEUS posts salvos reais

Quando o export oficial do Instagram chegar (Configurações → Central de
Contas → Baixar suas informações → Salvos, em JSON):

```bash
python3 -m carrossel listar-colecoes --entrada instagram-export.zip
python3 -m carrossel gerar --entrada instagram-export.zip --colecao "Shopee" --tipo oferta
python3 -m carrossel gerar --entrada instagram-export.zip --colecao "Shein" --tipo oferta
```

O `--tipo oferta` usa o novo template de carrossel de oferta (achadinho de
bruxa, CTA Mercado Holístico); o padrão `--tipo estudo` gera post de estudo
com CTA para o Grimório Arcano.
