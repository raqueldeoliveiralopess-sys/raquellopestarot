"""Ingestão de posts salvos a partir de três fontes:

1. Export oficial do Instagram ("Baixar suas informações"), ZIP ou pasta
   extraída — única fonte que preserva o nome da coleção (a "pasta" de salvos).
2. Pasta baixada pelo Instaloader (``instaloader :saved``) — traz legenda
   e mídia completas.
3. Arquivo de texto manual com URLs e legendas coladas.
"""

from __future__ import annotations

import json
import re
import zipfile
from pathlib import Path

from .modelos import PostSalvo

URL_POST_RE = re.compile(r"https?://(?:www\.)?instagram\.com/(?:p|reel|tv)/[\w-]+/?")


def _consertar_mojibake(texto: str) -> str:
    """O export do Instagram grava UTF-8 escapado como latin-1 (ex.: 'coraÃ§Ã£o').

    Reverte quando possível; se não der, devolve o original.
    """
    try:
        consertado = texto.encode("latin-1").decode("utf-8")
    except (UnicodeEncodeError, UnicodeDecodeError):
        return texto
    return consertado


def carregar(entrada: str, colecao: str = "") -> list[PostSalvo]:
    """Detecta o tipo da entrada e carrega os posts salvos.

    ``colecao``: quando a fonte é o export oficial, filtra pela pasta de
    salvos com esse nome (sem diferenciar maiúsculas/acentos exatos).
    """
    caminho = Path(entrada)
    if not caminho.exists():
        raise FileNotFoundError(f"Entrada não encontrada: {entrada}")

    if caminho.is_file() and caminho.suffix.lower() == ".zip":
        posts = _carregar_export_zip(caminho)
    elif caminho.is_file() and caminho.suffix.lower() == ".json":
        posts = _parse_json_export(json.loads(caminho.read_text(encoding="utf-8")))
    elif caminho.is_file():
        posts = _carregar_lista_manual(caminho)
    elif _parece_pasta_instaloader(caminho):
        posts = _carregar_pasta_instaloader(caminho)
    else:
        posts = _carregar_export_pasta(caminho)

    if colecao:
        alvo = colecao.casefold().strip()
        filtrados = [p for p in posts if p.colecao.casefold().strip() == alvo]
        if filtrados:
            return filtrados
        disponiveis = sorted({p.colecao for p in posts if p.colecao})
        raise ValueError(
            f"Nenhum post na coleção '{colecao}'. "
            f"Coleções encontradas: {', '.join(disponiveis) or 'nenhuma'}"
        )
    return posts


# ---------------------------------------------------------------- export oficial

def _carregar_export_zip(caminho: Path) -> list[PostSalvo]:
    posts: list[PostSalvo] = []
    with zipfile.ZipFile(caminho) as zf:
        for nome in zf.namelist():
            base = nome.rsplit("/", 1)[-1]
            if base in ("saved_posts.json", "saved_collections.json"):
                with zf.open(nome) as f:
                    posts.extend(_parse_json_export(json.load(f)))
    return _deduplicar(posts)


def _carregar_export_pasta(caminho: Path) -> list[PostSalvo]:
    posts: list[PostSalvo] = []
    arquivos = list(caminho.rglob("saved_posts.json")) + list(
        caminho.rglob("saved_collections.json")
    )
    if not arquivos:
        raise ValueError(
            f"Não achei saved_posts.json nem saved_collections.json em {caminho}. "
            "Confira se a pasta é o export do Instagram extraído, ou use uma "
            "pasta do Instaloader / um arquivo .txt manual."
        )
    for arq in arquivos:
        posts.extend(_parse_json_export(json.loads(arq.read_text(encoding="utf-8"))))
    return _deduplicar(posts)


def _parse_json_export(dados: dict) -> list[PostSalvo]:
    """Interpreta saved_posts.json e saved_collections.json.

    As chaves internas de string_map_data são localizadas ("Saved on",
    "Added to collection", "Nome"...), então a leitura é por forma, não por
    nome: valor com href de post = post salvo; valor sem href = nome de
    coleção corrente (apenas no arquivo de coleções).
    """
    posts: list[PostSalvo] = []
    itens = dados.get("saved_saved_media") or dados.get("saved_saved_collections") or []
    eh_arquivo_colecoes = "saved_saved_collections" in dados
    colecao_atual = ""

    for item in itens:
        if not isinstance(item, dict):
            continue
        titulo = _consertar_mojibake(item.get("title", "") or "")
        mapa = item.get("string_map_data") or {}
        url = ""
        timestamp = ""
        valor_sem_href = ""
        for campo in mapa.values():
            if not isinstance(campo, dict):
                continue
            href = campo.get("href") or ""
            if URL_POST_RE.search(href):
                url = URL_POST_RE.search(href).group(0)
                ts = campo.get("timestamp")
                if ts:
                    timestamp = str(ts)
            elif campo.get("value"):
                valor_sem_href = _consertar_mojibake(str(campo["value"]))

        if url:
            posts.append(
                PostSalvo(
                    url=url,
                    autor=titulo,
                    colecao=colecao_atual if eh_arquivo_colecoes else "",
                    data_salvo=timestamp,
                )
            )
        elif eh_arquivo_colecoes and valor_sem_href:
            colecao_atual = valor_sem_href
        elif eh_arquivo_colecoes and titulo and not mapa:
            colecao_atual = titulo
    return posts


def _deduplicar(posts: list[PostSalvo]) -> list[PostSalvo]:
    """Mantém um post por URL, preferindo a versão que sabe a coleção."""
    por_url: dict[str, PostSalvo] = {}
    for p in posts:
        chave = p.url or p.identificador()
        existente = por_url.get(chave)
        if existente is None or (p.colecao and not existente.colecao):
            por_url[chave] = p
    return list(por_url.values())


# ------------------------------------------------------------------ instaloader

def _parece_pasta_instaloader(caminho: Path) -> bool:
    return any(caminho.glob("*_UTC*.txt")) or any(caminho.glob("*_UTC*.json*"))


def _carregar_pasta_instaloader(caminho: Path) -> list[PostSalvo]:
    posts: list[PostSalvo] = []
    prefixos: dict[str, dict] = {}
    for arq in sorted(caminho.iterdir()):
        m = re.match(r"(\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}_UTC)", arq.name)
        if not m:
            continue
        info = prefixos.setdefault(m.group(1), {"legenda": "", "midia": [], "url": "", "autor": ""})
        if arq.suffix == ".txt":
            info["legenda"] = arq.read_text(encoding="utf-8", errors="replace").strip()
        elif arq.suffix.lower() in (".jpg", ".jpeg", ".png", ".webp", ".mp4"):
            info["midia"].append(str(arq))
        elif arq.name.endswith(".json"):
            _ler_metadata_instaloader(arq.read_bytes(), info)
        elif arq.name.endswith(".json.xz"):
            import lzma

            _ler_metadata_instaloader(lzma.decompress(arq.read_bytes()), info)

    for prefixo, info in prefixos.items():
        posts.append(
            PostSalvo(
                url=info["url"],
                autor=info["autor"],
                legenda=info["legenda"],
                midia=info["midia"],
                data_salvo=prefixo.replace("_UTC", ""),
            )
        )
    return posts


def _ler_metadata_instaloader(bruto: bytes, info: dict) -> None:
    try:
        meta = json.loads(bruto)
    except json.JSONDecodeError:
        return
    node = meta.get("node", meta)
    shortcode = node.get("shortcode", "")
    if shortcode:
        info["url"] = f"https://www.instagram.com/p/{shortcode}/"
    dono = node.get("owner") or {}
    info["autor"] = dono.get("username", info.get("autor", ""))


# ---------------------------------------------------------------- lista manual

def _carregar_lista_manual(caminho: Path) -> list[PostSalvo]:
    """Arquivo .txt/.md com blocos separados por linha '---'.

    Em cada bloco, a primeira linha que for URL do Instagram vira a URL do
    post, uma linha 'autor: fulana' vira o autor, e o resto vira legenda.
    Um arquivo só com URLs (uma por linha) também funciona.
    """
    texto = caminho.read_text(encoding="utf-8", errors="replace")
    blocos = re.split(r"^\s*---+\s*$", texto, flags=re.MULTILINE)
    posts: list[PostSalvo] = []
    for bloco in blocos:
        bloco = bloco.strip()
        if not bloco:
            continue
        url = ""
        autor = ""
        linhas_legenda: list[str] = []
        for linha in bloco.splitlines():
            m = URL_POST_RE.search(linha)
            if m and not url:
                url = m.group(0)
                resto = linha.replace(m.group(0), "").strip()
                if resto:
                    linhas_legenda.append(resto)
            elif linha.lower().startswith("autor:"):
                autor = linha.split(":", 1)[1].strip()
            else:
                linhas_legenda.append(linha)
        legenda = "\n".join(linhas_legenda).strip()
        if url and not legenda and not autor:
            posts.append(PostSalvo(url=url))
        elif url or legenda:
            posts.append(PostSalvo(url=url, autor=autor, legenda=legenda))
    return posts
