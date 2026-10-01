"""CLI do gerador de prompts de carrossel.

Uso:
    python -m carrossel gerar --entrada <export.zip|pasta|arquivo.txt> [--colecao NOME] [--saida prompts] [--slides 8]
    python -m carrossel puxar --usuario SEU_USUARIO [--destino salvos_instagram] [--maximo 30]
    python -m carrossel listar-colecoes --entrada <export.zip|pasta>
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

from . import analise as mod_analise
from . import ingestao, prompts


def _cmd_gerar(args: argparse.Namespace) -> int:
    posts = ingestao.carregar(args.entrada, colecao=args.colecao)
    if not posts:
        print("Nenhum post encontrado na entrada.", file=sys.stderr)
        return 1

    marca = prompts.carregar_marca(args.marca)
    pasta_saida = Path(args.saida)
    pasta_saida.mkdir(parents=True, exist_ok=True)

    resultados = []
    usados: set[str] = set()
    for post in posts:
        analise = mod_analise.analisar(post)
        texto = prompts.gerar_prompt(analise, marca, slides=args.slides, tipo=args.tipo)
        nome = f"prompt_{analise.post.identificador()}.md"
        if nome in usados:
            nome = f"prompt_{analise.post.identificador()}_{len(usados)}.md"
        usados.add(nome)
        (pasta_saida / nome).write_text(texto, encoding="utf-8")
        resultados.append((nome, analise))
        print(f"  ✓ {nome}  [{analise.tema}]")

    (pasta_saida / "INDICE.md").write_text(
        prompts.gerar_arquivo_indice(resultados), encoding="utf-8"
    )
    print(f"\n{len(resultados)} prompts gerados em {pasta_saida}/ (índice em INDICE.md).")
    print("Abra um arquivo, copie o conteúdo inteiro e cole no ChatGPT.")
    return 0


def _cmd_puxar(args: argparse.Namespace) -> int:
    from . import instagram

    pasta = instagram.baixar_salvos(args.usuario, args.destino, maximo=args.maximo)
    print(f"\nAgora gere os prompts com:\n  python -m carrossel gerar --entrada {pasta}")
    return 0


def _cmd_listar_colecoes(args: argparse.Namespace) -> int:
    posts = ingestao.carregar(args.entrada)
    colecoes: dict[str, int] = {}
    for p in posts:
        if p.colecao:
            colecoes[p.colecao] = colecoes.get(p.colecao, 0) + 1
    if not colecoes:
        print("Nenhuma coleção encontrada (o arquivo saved_collections.json veio no export?).")
        print(f"Posts salvos sem coleção: {len(posts)}")
        return 0
    print("Coleções encontradas:")
    for nome, qtd in sorted(colecoes.items(), key=lambda x: -x[1]):
        print(f"  {nome}  ({qtd} posts)")
    return 0


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        prog="carrossel",
        description="Transforma posts salvos do Instagram em prompts de roteiro "
        "de carrossel para o ChatGPT, na identidade da marca.",
    )
    sub = parser.add_subparsers(dest="comando", required=True)

    p_gerar = sub.add_parser("gerar", help="gera os prompts a partir de uma entrada")
    p_gerar.add_argument("--entrada", required=True, help="export .zip do Instagram, pasta extraída, pasta do Instaloader ou .txt manual")
    p_gerar.add_argument("--colecao", default="", help="filtra pela pasta de salvos com esse nome (só funciona com o export oficial)")
    p_gerar.add_argument("--saida", default="prompts", help="pasta de saída (padrão: prompts/)")
    p_gerar.add_argument("--slides", type=int, default=8, help="quantidade de slides do carrossel (padrão: 8)")
    p_gerar.add_argument("--tipo", choices=["estudo", "oferta"], default="estudo", help="estudo = ensinar (CTA Grimório Arcano); oferta = achadinho de bruxa (CTA grupo do Mercado Holístico)")
    p_gerar.add_argument("--marca", default=str(prompts.CONFIG_PADRAO), help="caminho do JSON de identidade da marca")
    p_gerar.set_defaults(func=_cmd_gerar)

    p_puxar = sub.add_parser("puxar", help="baixa os posts salvos da sua conta via Instaloader")
    p_puxar.add_argument("--usuario", required=True, help="seu usuário do Instagram (login na sua própria conta)")
    p_puxar.add_argument("--destino", default="salvos_instagram", help="pasta de download")
    p_puxar.add_argument("--maximo", type=int, default=0, help="limite de posts (0 = todos)")
    p_puxar.set_defaults(func=_cmd_puxar)

    p_listar = sub.add_parser("listar-colecoes", help="lista as pastas de salvos de um export oficial")
    p_listar.add_argument("--entrada", required=True)
    p_listar.set_defaults(func=_cmd_listar_colecoes)

    args = parser.parse_args(argv)
    try:
        return args.func(args)
    except (FileNotFoundError, ValueError) as exc:
        print(f"Erro: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
