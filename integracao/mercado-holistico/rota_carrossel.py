# Cole este bloco no fim de app/routes/estudio.py do Mercado Holístico (D:\dev\mercado-holistico).
# Ele usa o que o arquivo já importa: json, Request, Depends, Session, get_db, est, Response, router.
#
# Exporta o dia do Estúdio no formato que o pipeline de carrosséis (repositório raquellopestarot) lê:
#   GET /estudio/{d}/carrossel.json
# Lá, `node scripts/importar-estudio.mjs http://127.0.0.1:8000/estudio/<dia>/carrossel.json` grava
# produtos/estudio-<dia>.json e baixa as fotos do anúncio e as referências da modelo.


def _preco_br(p) -> str:
    if not p:
        return ""
    return "R$ " + f"{float(p):,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")


@router.get("/estudio/{d}/carrossel.json")
def carrossel_json(d: str, request: Request, db: Session = Depends(get_db)):
    """Dia do Estúdio no formato do pipeline de carrosséis (capa → um slide por produto → final)."""
    v, m = est.dia(db, d), est.modelo(db)
    base = str(request.base_url).rstrip("/")
    slug = f"estudio-{d}"
    produtos = []
    for i, it in enumerate(v["itens"], 1):
        produtos.append({
            "nome": it["nome"],
            "preco": _preco_br(it.get("preco")),
            "desconto": it.get("desconto") or 0,
            "link": it["url"],
            "marketplace": it.get("marketplace", ""),
            "tipo": it.get("tipo", ""),
            "foto_shopee": f"{base}/estudio/{d}/foto/{it['id']}" if it.get("imagem_url") else "",
            "imagem_url": it.get("imagem_url") or "",
            "imagem": f"output/{slug}/img/produto-{i}.png",
            "nome_linha1": "",
            "nome_linha2": "",
        })
    slides = [{
        "tipo": "capa", "imagem": f"output/{slug}/img/capa.png",
        "serie": "Da série:", "linha1": "coisas de", "destaque1": "bruxa", "destaque2": "",
        "rodape1": "que achei na", "rodape_destaque": "SHOPEE", "rodape2": "e estou 0% arrependida",
    }]
    slides += [{"tipo": "produto", "imagem": p["imagem"], "nome_linha1": "", "nome_linha2": ""} for p in produtos]
    slides.append({
        "tipo": "cta", "imagem": f"output/{slug}/img/cta.png",
        "cta_linha1": "comente", "cta_destaque": "QUERO", "cta_linha2": "para receber os links",
        "share_linha1": "compartilhe", "share_destaque": "com as amigas bruxas",
        "share_linha2": "que vão amar esses", "share_final": "Achadinhos",
    })
    corpo = {
        "slug": slug,
        "dia": d,
        "titulo": v.get("tema") or "",
        "temas": v.get("temas") or [],
        "modelo": {
            "nome": m.get("nome") or "",
            "perfil": m.get("perfil") or "",
            "estilo": m.get("estilo") or "",
            "referencias": [f"{base}/estudio/modelo/ref/{n}" for n in est.refs_modelo()],
        },
        "produtos": produtos,
        "slides": slides,
        "legenda": "",
        "whatsapp": "",
        "saida": str(est.pasta_do_dia(d) / "carrossel"),
    }
    return Response(json.dumps(corpo, ensure_ascii=False, indent=2), media_type="application/json")
