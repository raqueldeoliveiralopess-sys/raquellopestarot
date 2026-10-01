# Gerador de Carrosséis — @raquellopestarot

Transforma os seus **posts salvos do Instagram** em **prompts prontos de roteiro
de carrossel para o ChatGPT**, já com a identidade da marca Raquel Lopes
embutida: tom Amiga Rebelde, vocabulário permitido e banido, paleta whimsigoth
(roxo profundo, vinho ameixa, madeira escura, caramelo — com rosa pastel e
amarelo manteiga só em texto), iluminação de janela e as 5 regras não
negociáveis.

Cada post salvo vira um arquivo `.md` com um prompt completo: é só abrir,
copiar tudo e colar no ChatGPT. Ele devolve o carrossel slide a slide, com
texto, direção de arte dentro da paleta e nota de voz.

## Antes de começar: uma verdade sobre o Instagram

O Instagram **não tem API oficial para posts salvos** — nenhum app consegue
"logar e puxar a pasta de salvos" pelo caminho oficial. Por isso o sistema
tem dois caminhos reais:

| | Caminho 1 — Export oficial (recomendado) | Caminho 2 — Instaloader |
|---|---|---|
| Instala algo? | Não | Sim (`pip install instaloader`) |
| Pega a legenda dos posts? | Não (só o link) | Sim (legenda + imagem) |
| Separa pela sua **pasta/coleção** de salvos? | **Sim** | Não (baixa todos os salvos) |
| Risco | Zero (é o recurso oficial do Instagram) | Área cinzenta nos termos do Instagram; use com moderação |

Dica: os dois se completam. O export diz **quais posts estão na sua pasta**;
se quiser a legenda deles na análise, cole-a no arquivo manual (Caminho 3).

## Caminho 1 — Export oficial do Instagram

1. No Instagram: **Configurações → Central de Contas → Suas informações e
   permissões → Baixar suas informações**.
2. Peça **"Parte das suas informações" → Salvos**, formato **JSON**.
3. O Instagram envia um e-mail com o `.zip` (pode levar algumas horas).
4. Rode:

```bash
# ver as pastas de salvos que existem no export
python3 -m carrossel listar-colecoes --entrada instagram-export.zip

# gerar os prompts só da sua pasta
python3 -m carrossel gerar --entrada instagram-export.zip --colecao "Ideias Carrossel"
```

## Caminho 2 — Instaloader (automático, com legenda)

```bash
pip install instaloader
python3 -m carrossel puxar --usuario SEU_USUARIO --maximo 30
python3 -m carrossel gerar --entrada salvos_instagram
```

Na primeira vez ele pede sua senha (fica só na sua máquina, numa sessão do
próprio Instaloader). Com 2FA, ele pergunta o código. Use `--maximo` para não
baixar centenas de posts de uma vez.

## Caminho 3 — Lista manual (cola e pronto)

Crie um `.txt` com os posts separados por `---`: link, `autor:` opcional e a
legenda colada. Veja `exemplos/posts_manuais.txt`. Depois:

```bash
python3 -m carrossel gerar --entrada meus_posts.txt
```

## O que sai

```
prompts/
  INDICE.md                 ← tabela com tema e gancho de cada post
  prompt_ABC123xyz.md       ← um prompt completo por post
  prompt_DEF456uvw.md
```

Opções úteis de `gerar`:

- `--tipo oferta` — carrossel de oferta (achadinho de bruxa, CTA grupo do
  Mercado Holístico); o padrão `--tipo estudo` ensina e aponta pro Grimório
  Arcano. Use `oferta` para pastas de produtos (Shopee, Shein, Mercado Livre).
- `--slides 10` — carrossel com outra quantidade de slides (padrão 8)
- `--saida pasta/` — muda a pasta de saída (padrão `prompts/`)
- `--marca config/marca_raquel.json` — outro arquivo de identidade

## A identidade da marca

Tudo que define a voz e o visual está em **`config/marca_raquel.json`**:
vocabulário, paleta, ambientes, regras não negociáveis. Edite esse arquivo e
todos os próximos prompts já saem atualizados — o código não precisa mudar.

## Como o sistema analisa cada post

Sem depender de nenhuma API paga, ele detecta por heurística:

- **Tema** (amor, dinheiro, padrões, tarot, autoestima, marketing) e subtemas
- **Tipo de gancho** (pergunta, lista numerada, quebra de crença, espelho da
  leitora, história pessoal)
- **Formato provável** (carrossel, reels, post único), **CTA** e **hashtags**

Essa análise entra no prompt como "post de referência — inspiração, nunca
cópia", e a tarefa instrui o ChatGPT a virar qualquer pergunta sobre "ele"
de volta para ela, como manda a regra 2 da marca.

## Requisitos

Python 3.10+. Nada para instalar nos Caminhos 1 e 3; o Caminho 2 pede
`pip install instaloader` (ver `requirements.txt`).
