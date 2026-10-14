#!/usr/bin/env node
/**
 * Importa um dia do Estúdio do Mercado Holístico para o pipeline de carrosséis.
 *
 *   node scripts/importar-estudio.mjs http://127.0.0.1:8000/estudio/2026-10-14/carrossel.json
 *   node scripts/importar-estudio.mjs caminho/para/carrossel.json
 *
 * Grava produtos/<slug>.json, baixa as fotos dos anúncios em output/<slug>/img/shopee-N.jpg
 * e as fotos de referência da modelo em output/<slug>/img/modelo-N.jpg.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const fonte = process.argv[2];
if (!fonte) {
  console.error('Uso: node scripts/importar-estudio.mjs <url-ou-arquivo do carrossel.json>');
  process.exit(1);
}

async function lerJson(src) {
  if (/^https?:\/\//.test(src)) {
    const r = await fetch(src);
    if (!r.ok) throw new Error(`${src} respondeu ${r.status}`);
    return r.json();
  }
  return JSON.parse(readFileSync(resolve(src), 'utf8'));
}

async function baixar(url, destino) {
  try {
    const r = await fetch(url);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    writeFileSync(destino, Buffer.from(await r.arrayBuffer()));
    return true;
  } catch (e) {
    console.warn(`  aviso: não baixei ${url} (${e.message})`);
    return false;
  }
}

function duasLinhas(nome) {
  const partes = nome.trim().split(/\s+/);
  if (partes.length <= 2) return [partes[0] ?? '', partes.slice(1).join(' ')];
  const corte = Math.ceil(partes.length / 2);
  return [partes.slice(0, corte).join(' '), partes.slice(corte).join(' ')];
}

const dia = await lerJson(fonte);
const slug = dia.slug || `estudio-${dia.dia || 'dia'}`;
const imgDir = resolve(ROOT, 'output', slug, 'img');
mkdirSync(imgDir, { recursive: true });

const produtos = [];
for (const [i, p] of (dia.produtos ?? []).entries()) {
  const n = i + 1;
  const [l1, l2] = duasLinhas(p.nome ?? '');
  const prod = {
    nome: p.nome ?? '',
    preco: p.preco ?? '',
    desconto: p.desconto ?? 0,
    link: p.link ?? '',
    marketplace: p.marketplace ?? '',
    tipo: p.tipo ?? '',
    foto_shopee: '',
    imagem: `output/${slug}/img/produto-${n}.png`,
    nome_linha1: p.nome_linha1 || l1,
    nome_linha2: p.nome_linha2 || l2,
  };
  const fotoUrl = p.foto_shopee || p.imagem_url;
  if (fotoUrl) {
    const destino = join(imgDir, `shopee-${n}.jpg`);
    if (await baixar(fotoUrl, destino)) prod.foto_shopee = `output/${slug}/img/shopee-${n}.jpg`;
  }
  produtos.push(prod);
}

const modeloRefs = [];
for (const [i, url] of (dia.modelo?.referencias ?? []).entries()) {
  const destino = join(imgDir, `modelo-${i + 1}.jpg`);
  if (await baixar(url, destino)) modeloRefs.push(`output/${slug}/img/modelo-${i + 1}.jpg`);
}

const slides = (dia.slides ?? []).map((s) => {
  if (s.tipo !== 'produto') return s;
  const idx = (dia.slides.filter((x) => x.tipo === 'produto').indexOf(s));
  const p = produtos[idx];
  return { ...s, imagem: p?.imagem ?? s.imagem, nome_linha1: s.nome_linha1 || p?.nome_linha1 || '', nome_linha2: s.nome_linha2 || p?.nome_linha2 || '' };
});

const spec = {
  titulo: dia.titulo ?? '',
  temas: dia.temas ?? [],
  dia: dia.dia ?? '',
  modelo: { ...(dia.modelo ?? {}), referencias: modeloRefs },
  saida: dia.saida ?? '',
  produtos,
  slides: slides.length ? slides : undefined,
  legenda: dia.legenda ?? '',
  whatsapp: dia.whatsapp ?? '',
};

const dest = resolve(ROOT, 'produtos', `${slug}.json`);
if (existsSync(dest)) console.warn(`  aviso: sobrescrevendo ${dest}`);
writeFileSync(dest, JSON.stringify(spec, null, 2) + '\n');
console.log(`produtos/${slug}.json: ${produtos.length} produto(s), ${produtos.filter((p) => p.foto_shopee).length} foto(s) do anúncio, ${modeloRefs.length} referência(s) da modelo.`);
if (spec.saida) console.log(`Saída sugerida pelo app: ${spec.saida}  (use --saida no render)`);
