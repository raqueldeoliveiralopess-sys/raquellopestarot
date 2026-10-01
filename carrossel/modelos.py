"""Estruturas de dados compartilhadas pelo pipeline."""

from dataclasses import dataclass, field


@dataclass
class PostSalvo:
    """Um post salvo no Instagram, vindo de qualquer fonte de ingestão."""

    url: str = ""
    autor: str = ""
    legenda: str = ""
    colecao: str = ""
    data_salvo: str = ""
    midia: list[str] = field(default_factory=list)

    @property
    def tem_legenda(self) -> bool:
        return bool(self.legenda.strip())

    def identificador(self) -> str:
        """Nome curto e estável para arquivos de saída."""
        if self.url:
            codigo = self.url.rstrip("/").rsplit("/", 1)[-1]
            if codigo and codigo not in ("p", "reel", "www.instagram.com"):
                return codigo
        base = (self.autor or "post").replace("@", "").replace("/", "-")
        sufixo = str(abs(hash(self.legenda or self.data_salvo)) % 100000)
        return f"{base}-{sufixo}"


@dataclass
class AnalisePost:
    """Resultado da análise heurística de um post salvo."""

    post: PostSalvo
    tema: str = "geral"
    subtemas: list[str] = field(default_factory=list)
    tipo_gancho: str = "não identificado"
    gancho: str = ""
    formato_provavel: str = "não identificado"
    hashtags: list[str] = field(default_factory=list)
    pontos_centrais: list[str] = field(default_factory=list)
    cta_detectado: str = ""
