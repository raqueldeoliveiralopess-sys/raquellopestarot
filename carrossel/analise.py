"""Análise heurística de um post salvo: tema, gancho, formato e pontos centrais.

Funciona offline, sem API. O resultado alimenta o prompt final — quanto mais
legenda o post tiver, mais rica a análise; um post só com URL ainda gera
prompt, mas pede que o ChatGPT trabalhe a partir do link/tema.
"""

from __future__ import annotations

import re

from .modelos import AnalisePost, PostSalvo

TEMAS = {
    "amor e relacionamento": [
        "amor", "relacionament", "ex", "casal", "parceiro", "namor", "solteir",
        "migalha", "apego", "términ", "termin", "carência", "carencia", "afeto",
    ],
    "dinheiro e valor próprio": [
        "dinheiro", "renda", "precific", "cobrar", "salário", "salario",
        "prosperidade", "escassez", "financeir", "valor", "merec",
    ],
    "padrões e autossabotagem": [
        "padrão", "padrao", "ciclo", "repet", "sabotagem", "crença", "crenca",
        "inconsciente", "sombra", "ferida", "trauma", "bloqueio", "herdad",
    ],
    "tarot e arquétipos": [
        "tarot", "carta", "arcano", "arquétip", "arquetip", "baralho", "oráculo",
        "oraculo", "leitura", "tiragem", "jung",
    ],
    "autoestima e limites": [
        "autoestima", "limite", "não dizer", "dizer não", "sobrecarga",
        "dar conta", "priorizar", "autocuidado", "culpa", "exaust",
    ],
    "marketing e conteúdo": [
        "engajamento", "seguidor", "algoritmo", "conteúdo", "conteudo", "reels",
        "carrossel", "gancho", "viral", "audiência", "audiencia", "nicho", "copy",
    ],
}

CTAS = [
    "comenta", "comente", "salva esse post", "salve esse post", "compartilha",
    "compartilhe", "me chama", "link na bio", "arrasta", "manda no direct",
    "marca uma amiga", "segue ", "me segue", "garanta", "inscreva",
]


def analisar(post: PostSalvo) -> AnalisePost:
    analise = AnalisePost(post=post)
    texto = post.legenda.strip()
    if not texto:
        analise.tema = "a definir pelo link"
        return analise

    texto_baixo = texto.casefold()
    analise.hashtags = re.findall(r"#(\w+)", texto)

    pontuacao = {
        tema: sum(texto_baixo.count(ch) for ch in chaves)
        for tema, chaves in TEMAS.items()
    }
    ranqueados = [t for t, pts in sorted(pontuacao.items(), key=lambda x: -x[1]) if pts > 0]
    if ranqueados:
        analise.tema = ranqueados[0]
        analise.subtemas = ranqueados[1:3]

    linhas = [l.strip() for l in texto.splitlines() if l.strip() and not l.strip().startswith("#")]
    if linhas:
        analise.gancho = linhas[0][:200]
        analise.tipo_gancho = _classificar_gancho(linhas[0])
        analise.pontos_centrais = _pontos_centrais(linhas)

    analise.formato_provavel = _formato(texto_baixo, post)
    analise.cta_detectado = next((c.strip() for c in CTAS if c in texto_baixo), "")
    return analise


def _classificar_gancho(linha: str) -> str:
    baixa = linha.casefold()
    if "?" in linha:
        return "pergunta direta"
    if re.match(r"^\d+\s", linha) or re.search(r"\b\d+\s+(sinais|passos|erros|formas|coisas|motivos)\b", baixa):
        return "lista numerada"
    if any(p in baixa for p in ("ninguém te conta", "ninguem te conta", "a verdade", "pare de", "para de", "você não", "voce nao", "mentira")):
        return "afirmação polêmica / quebra de crença"
    if any(p in baixa for p in ("se você", "se voce", "quando você", "quando voce")):
        return "identificação (espelho da leitora)"
    if any(p in baixa for p in ("eu ", "comigo", "minha ")):
        return "história pessoal"
    return "afirmação direta"


def _pontos_centrais(linhas: list[str], maximo: int = 5) -> list[str]:
    """Seleciona as frases mais 'cheias' do corpo do post como pontos-chave."""
    corpo = linhas[1:] if len(linhas) > 1 else linhas
    candidatas = [l for l in corpo if len(l) > 25]
    candidatas.sort(key=len, reverse=True)
    escolhidas = candidatas[:maximo]
    # devolve na ordem original do texto
    return [l for l in corpo if l in escolhidas][:maximo]


def _formato(texto_baixo: str, post: PostSalvo) -> str:
    if "/reel/" in post.url:
        return "reels (vídeo)"
    if len(post.midia) > 1:
        return "carrossel"
    if any(p in texto_baixo for p in ("arrasta pro lado", "deslize", "swipe", "último slide", "ultimo slide", "próximo slide", "proximo slide")):
        return "carrossel"
    if len(texto_baixo) > 800:
        return "legenda longa (conteúdo denso)"
    return "post único / imagem"
