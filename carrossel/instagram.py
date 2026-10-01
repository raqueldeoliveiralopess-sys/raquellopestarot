"""Conexão com o Instagram via Instaloader para baixar os posts salvos.

O Instagram NÃO oferece API oficial para posts salvos, então este módulo usa
o Instaloader logado NA SUA PRÓPRIA CONTA — o mesmo acesso que você tem no
app. Limitações honestas:

* Baixa TODOS os salvos; a separação por pasta/coleção só existe no export
  oficial ("Baixar suas informações"), que o módulo ``ingestao`` também lê.
* Uso automatizado fora do app é área cinzenta nos termos do Instagram.
  Baixe com calma (o Instaloader já espera entre requisições) e evite rodar
  várias vezes ao dia.
"""

from __future__ import annotations

from pathlib import Path


def baixar_salvos(usuario: str, destino: str, maximo: int = 0) -> Path:
    """Loga como ``usuario`` e baixa os posts salvos para ``destino``.

    Pede a senha no terminal na primeira vez e reaproveita a sessão salva
    nas seguintes (arquivo de sessão do próprio Instaloader). Se a conta
    tiver 2FA, o Instaloader pergunta o código.

    Retorna a pasta com os downloads, pronta para ``ingestao.carregar``.
    """
    try:
        import instaloader
    except ImportError as exc:
        raise SystemExit(
            "O Instaloader não está instalado. Rode: pip install instaloader\n"
            "Ou use o export oficial do Instagram (sem instalar nada): "
            "veja o README, seção 'Caminho 1'."
        ) from exc

    pasta = Path(destino)
    pasta.mkdir(parents=True, exist_ok=True)

    loader = instaloader.Instaloader(
        dirname_pattern=str(pasta),
        download_videos=False,
        download_video_thumbnails=True,
        download_comments=False,
        save_metadata=True,
        compress_json=False,
        post_metadata_txt_pattern="{caption}",
    )

    try:
        loader.load_session_from_file(usuario)
        print(f"Sessão salva de @{usuario} reaproveitada.")
    except FileNotFoundError:
        print(f"Primeiro login como @{usuario} — a senha fica só na sua máquina.")
        loader.interactive_login(usuario)
        loader.save_session_to_file()

    perfil = instaloader.Profile.from_username(loader.context, usuario)
    print("Baixando posts salvos (o Instaloader espera entre requisições)...")
    baixados = 0
    for post in perfil.get_saved_posts():
        loader.download_post(post, target=pasta.name)
        baixados += 1
        if maximo and baixados >= maximo:
            break
    print(f"{baixados} posts salvos baixados em {pasta}/")
    return pasta
