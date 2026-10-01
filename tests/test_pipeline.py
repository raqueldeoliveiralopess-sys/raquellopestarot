"""Testes do pipeline: ingestão, análise e geração de prompt.

Rodar na raiz do repositório: python3 -m unittest discover tests -v
"""

import json
import sys
import tempfile
import unittest
import zipfile
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(RAIZ))

from carrossel import analise, ingestao, prompts  # noqa: E402
from carrossel.modelos import PostSalvo  # noqa: E402

EXPORT_EXEMPLO = RAIZ / "exemplos" / "export_instagram"
MANUAL_EXEMPLO = RAIZ / "exemplos" / "posts_manuais.txt"


class TestIngestao(unittest.TestCase):
    def test_export_pasta_com_colecoes(self):
        posts = ingestao.carregar(str(EXPORT_EXEMPLO))
        self.assertEqual(len(posts), 3)
        por_url = {p.url: p for p in posts}
        self.assertEqual(
            por_url["https://www.instagram.com/p/ABC123xyz/"].colecao, "Ideias Carrossel"
        )
        self.assertEqual(
            por_url["https://www.instagram.com/p/GHI789rst/"].colecao, "Referências Visuais"
        )

    def test_filtro_por_colecao(self):
        posts = ingestao.carregar(str(EXPORT_EXEMPLO), colecao="ideias carrossel")
        self.assertEqual(len(posts), 2)

    def test_colecao_inexistente_lista_disponiveis(self):
        with self.assertRaises(ValueError) as ctx:
            ingestao.carregar(str(EXPORT_EXEMPLO), colecao="Não Existe")
        self.assertIn("Ideias Carrossel", str(ctx.exception))

    def test_export_zip(self):
        with tempfile.TemporaryDirectory() as tmp:
            caminho_zip = Path(tmp) / "export.zip"
            with zipfile.ZipFile(caminho_zip, "w") as zf:
                for nome in ("saved_posts.json", "saved_collections.json"):
                    zf.write(EXPORT_EXEMPLO / nome, f"your_instagram_activity/saved/{nome}")
            posts = ingestao.carregar(str(caminho_zip))
            self.assertEqual(len(posts), 3)
            self.assertTrue(all(p.colecao for p in posts))

    def test_lista_manual(self):
        posts = ingestao.carregar(str(MANUAL_EXEMPLO))
        self.assertEqual(len(posts), 3)
        self.assertIn("mesmo tipo de homem", posts[0].legenda)
        self.assertEqual(posts[0].autor, "tarologa_exemplo")
        self.assertFalse(posts[2].tem_legenda)

    def test_pasta_instaloader(self):
        with tempfile.TemporaryDirectory() as tmp:
            pasta = Path(tmp)
            prefixo = "2024-05-01_10-00-00_UTC"
            (pasta / f"{prefixo}.txt").write_text("Legenda de teste", encoding="utf-8")
            (pasta / f"{prefixo}.jpg").touch()
            (pasta / f"{prefixo}.json").write_text(
                json.dumps({"node": {"shortcode": "XYZ999", "owner": {"username": "autora"}}}),
                encoding="utf-8",
            )
            posts = ingestao.carregar(str(pasta))
            self.assertEqual(len(posts), 1)
            self.assertEqual(posts[0].url, "https://www.instagram.com/p/XYZ999/")
            self.assertEqual(posts[0].autor, "autora")
            self.assertEqual(posts[0].legenda, "Legenda de teste")

    def test_mojibake(self):
        self.assertEqual(ingestao._consertar_mojibake("coraÃ§Ã£o"), "coração")
        self.assertEqual(ingestao._consertar_mojibake("texto normal"), "texto normal")


class TestAnalise(unittest.TestCase):
    def test_tema_e_gancho(self):
        posts = ingestao.carregar(str(MANUAL_EXEMPLO))
        a = analise.analisar(posts[0])
        self.assertEqual(a.tema, "amor e relacionamento")
        self.assertEqual(a.tipo_gancho, "pergunta direta")
        self.assertIn("tarot", a.hashtags)
        self.assertTrue(a.pontos_centrais)

    def test_lista_numerada_e_dinheiro(self):
        posts = ingestao.carregar(str(MANUAL_EXEMPLO))
        a = analise.analisar(posts[1])
        self.assertEqual(a.tema, "dinheiro e valor próprio")
        self.assertEqual(a.tipo_gancho, "lista numerada")
        self.assertEqual(a.formato_provavel, "reels (vídeo)")
        self.assertEqual(a.cta_detectado, "comenta")

    def test_post_sem_legenda(self):
        a = analise.analisar(PostSalvo(url="https://www.instagram.com/p/X1/"))
        self.assertEqual(a.tema, "a definir pelo link")


class TestPrompt(unittest.TestCase):
    def test_prompt_contem_marca_e_referencia(self):
        marca = prompts.carregar_marca()
        posts = ingestao.carregar(str(MANUAL_EXEMPLO))
        texto = prompts.gerar_prompt(analise.analisar(posts[0]), marca, slides=10)
        self.assertIn("@raquellopestarot", texto)
        self.assertIn("roxo profundo", texto)
        self.assertIn("Nunca ler o outro", texto)
        self.assertIn("mesmo tipo de homem", texto)
        self.assertIn("10 slides", texto)
        self.assertIn("Slide 9", texto)  # virada seca em slides - 1

    def test_prompt_tipo_oferta(self):
        marca = prompts.carregar_marca()
        posts = ingestao.carregar(str(MANUAL_EXEMPLO))
        texto = prompts.gerar_prompt(analise.analisar(posts[0]), marca, tipo="oferta")
        self.assertIn("achadinho de bruxa", texto)
        self.assertIn("Mercado Holístico", texto)
        self.assertIn("NENHUM\nobjeto promete efeito", texto)
        self.assertNotIn("Grimório Arcano (app de estudos", texto)

    def test_prompt_usa_persona_do_config(self):
        marca = prompts.carregar_marca()
        posts = ingestao.carregar(str(MANUAL_EXEMPLO))
        texto = prompts.gerar_prompt(analise.analisar(posts[0]), marca, tipo="estudo")
        self.assertIn("Bruxa ou terapeuta holística de 18 a 35 anos", texto)
        self.assertNotIn("35 a 55", texto.split("## TAREFA")[1])

    def test_prompt_sem_legenda_instrui_pelo_link(self):
        marca = prompts.carregar_marca()
        a = analise.analisar(PostSalvo(url="https://www.instagram.com/p/X1/"))
        texto = prompts.gerar_prompt(a, marca)
        self.assertIn("não tem legenda disponível", texto)


if __name__ == "__main__":
    unittest.main()
