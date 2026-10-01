"""Monta o prompt de roteiro de carrossel para o ChatGPT.

O prompt junta três camadas: o DNA da marca (config/marca_raquel.json),
a análise do post salvo (inspiração, nunca cópia) e a tarefa com a
estrutura de carrossel slide a slide, incluindo direção de arte dentro
da identidade visual.
"""

from __future__ import annotations

import json
from pathlib import Path

from .modelos import AnalisePost

CONFIG_PADRAO = Path(__file__).resolve().parent.parent / "config" / "marca_raquel.json"


def carregar_marca(caminho: str | Path = CONFIG_PADRAO) -> dict:
    return json.loads(Path(caminho).read_text(encoding="utf-8"))


def _lista(itens: list[str], marcador: str = "- ") -> str:
    return "\n".join(f"{marcador}{i}" for i in itens)


def _bloco_referencia(analise: AnalisePost) -> str:
    post = analise.post
    partes = []
    if post.url:
        partes.append(f"Link: {post.url}")
    if post.autor:
        partes.append(f"Autor original: {post.autor}")
    if post.colecao:
        partes.append(f"Pasta de salvos: {post.colecao}")
    partes.append(f"Tema identificado: {analise.tema}")
    if analise.subtemas:
        partes.append(f"Subtemas: {', '.join(analise.subtemas)}")
    if analise.gancho:
        partes.append(f"Gancho original: \"{analise.gancho}\" (tipo: {analise.tipo_gancho})")
    partes.append(f"Formato original provável: {analise.formato_provavel}")
    if analise.pontos_centrais:
        partes.append("Pontos centrais do post:\n" + _lista(analise.pontos_centrais, "  • "))
    if analise.cta_detectado:
        partes.append(f"CTA usado no original: \"{analise.cta_detectado}\"")
    if analise.hashtags:
        partes.append(f"Hashtags do original: {' '.join('#' + h for h in analise.hashtags[:10])}")
    if post.tem_legenda:
        partes.append(f"Legenda completa do post de referência:\n\"\"\"\n{post.legenda.strip()}\n\"\"\"")
    else:
        partes.append(
            "O post de referência não tem legenda disponível — abra o link, "
            "entenda o tema central e siga a tarefa a partir dele."
        )
    return "\n".join(partes)


def gerar_prompt(analise: AnalisePost, marca: dict, slides: int = 8) -> str:
    tom = marca["tom"]
    visual = marca["visual"]
    return f"""# PROMPT PARA CHATGPT — ROTEIRO DE CARROSSEL ({marca["handle"]})

Você é roteirista de carrosséis do Instagram de {marca["nome"]} ({marca["handle"]}).

## QUEM É A MARCA
- Identidade: {marca["identidade"]}
- Nicho: {marca["nicho"]}
- Ângulo: {marca["angulo"]}
- Arquétipo de voz: {marca["arquetipo"]}

## TOM DE VOZ
- Vocabulário que ela usa naturalmente: {", ".join(tom["vocabulario_usa"])}.
- Vocabulário PROIBIDO (nunca escreva): {"; ".join(tom["vocabulario_banido"])}.
- Ritmo: {tom["ritmo"]}
- Humor: {tom["humor"]}
- Defende: {" | ".join(marca["defende"])}
- Ataca (com sarcasmo, nunca em cima da cliente): {" | ".join(marca["ataca"])}

## IDENTIDADE VISUAL (para a direção de arte de cada slide)
- Cores de cena/fundo: {", ".join(visual["cores_cena"])}.
- Cores de marca ({", ".join(visual["cores_marca_texto_acento"])}): {visual["regra_cores"]}
- Iluminação: {visual["iluminacao"]}
- Ambientes possíveis: {_lista(visual["ambientes"], "  • ")}
- Guarda-roupa/estética: {visual["guarda_roupa"]}

## REGRAS NÃO NEGOCIÁVEIS
{_lista(marca["regras_nao_negociaveis"])}

## POST DE REFERÊNCIA (inspiração, NUNCA cópia)
{_bloco_referencia(analise)}

## TAREFA
Crie o roteiro de UM carrossel de {slides} slides para o Instagram de {marca["handle"]},
inspirado no TEMA do post de referência, mas reescrito de ponta a ponta na voz
e no ângulo da marca. Se o original fala do outro (ex, parceiro, "ele"), vire a
pergunta para ela: o padrão dela, o movimento dela.

Estrutura obrigatória:
- Slide 1 (capa): gancho de até 12 palavras que para o scroll, na dor ou desejo
  da mulher de 35 a 55 que dá conta de tudo. Teste 2 opções de gancho.
- Slides 2 a {slides - 2}: desenvolvimento — abre curta, aprofunda o padrão,
  traz o símbolo/arquétipo só se couber em cena da vida real, e mostra o
  movimento que quebra o ciclo. Um pensamento por slide, frases curtas.
- Slide {slides - 1}: a virada seca — a frase que ela printa.
- Slide {slides} (CTA): convite leve e específico (comentar uma palavra, salvar,
  ou chamar no direct), sem promessa de resultado e sem prazo.

Para CADA slide, entregue neste formato:
1. **Texto do slide** (o que vai escrito na arte)
2. **Direção de arte** (fundo, cor, ambiente e elemento visual, usando SOMENTE
   a identidade visual acima — rosa pastel e amarelo manteiga apenas em
   tipografia/acento sobre fundo escuro)
3. **Nota de voz** (como a frase soa: acolhe, cutuca ou fecha seca)

Depois dos slides, entregue também:
- **Legenda** do post (3 a 6 linhas, abre curta e fecha com o CTA)
- **10 hashtags** do nicho de tarot arquetípico/autoconhecimento em português

Antes de finalizar, revise tudo contra o vocabulário proibido e as regras não
negociáveis. Se qualquer frase ler o outro, prometer resultado ou usar clichê
místico, reescreva.
"""


def gerar_arquivo_indice(resultados: list[tuple[str, AnalisePost]]) -> str:
    """Markdown com o resumo de todos os prompts gerados."""
    linhas = [
        "# Índice dos prompts gerados",
        "",
        "| Arquivo | Tema | Gancho original | Fonte |",
        "|---|---|---|---|",
    ]
    for nome_arquivo, analise in resultados:
        gancho = (analise.gancho or "—").replace("|", "/")[:60]
        fonte = analise.post.url or analise.post.autor or "manual"
        linhas.append(f"| {nome_arquivo} | {analise.tema} | {gancho} | {fonte} |")
    linhas.append("")
    return "\n".join(linhas)
