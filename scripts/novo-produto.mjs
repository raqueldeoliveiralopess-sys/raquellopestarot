#!/usr/bin/env node
/**
 * Abre um carrossel novo em produtos/<slug>.json com a estrutura padrão:
 * capa → um slide por produto → cta.
 *
 *   node scripts/novo-produto.mjs <slug> "Nome do produto 1" "Nome do produto 2" ...
 */
import { writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const [slug, ...nomes] = process.argv.slice(2);
if (!slug) {
  console.error('Uso: node scripts/novo-produto.mjs <slug> "Nome 1" "Nome 2" ...');
  process.exit(1);
}
const dest = resolve(ROOT, 'produtos', `${slug}.json`);
if (existsSync(dest)) {
  console.error(`Já existe: ${dest}`);
  process.exit(1);
}

function duasLinhas(nome) {
  // primeira linha = tipo (bold branca), segunda = o que destaca (script rosa)
  const partes = nome.trim().split(/\s+/);
  if (partes.length <= 2) return [partes[0] ?? '', partes.slice(1).join(' ')];
  const corte = Math.ceil(partes.length / 2);
  return [partes.slice(0, corte).join(' '), partes.slice(corte).join(' ')];
}

const produtos = (nomes.length ? nomes : ['Produto']).map((nome, i) => {
  const [l1, l2] = duasLinhas(nome);
  return {
    nome,
    preco: '',
    link: '',
    foto_shopee: '',
    imagem: `output/${slug}/img/produto-${i + 1}.png`,
    nome_linha1: l1,
    nome_linha2: l2,
  };
});

const spec = {
  titulo: slug,
  produtos,
  slides: [
    {
      tipo: 'capa',
      imagem: `output/${slug}/img/capa.png`,
      serie: 'Da série:',
      linha1: 'coisas de',
      destaque1: 'bruxa',
      destaque2: '',
      rodape1: 'que achei na',
      rodape_destaque: 'SHOPEE',
      rodape2: 'e estou 0% arrependida',
    },
    ...produtos.map((p) => ({ tipo: 'produto', imagem: p.imagem, nome_linha1: p.nome_linha1, nome_linha2: p.nome_linha2 })),
    {
      tipo: 'cta',
      imagem: `output/${slug}/img/cta.png`,
      cta_linha1: 'comente',
      cta_destaque: 'QUERO',
      cta_linha2: 'para receber os links',
      share_linha1: 'compartilhe',
      share_destaque: 'com as amigas bruxas',
      share_linha2: 'que vão amar esses',
      share_final: 'Achadinhos',
    },
  ],
  legenda: '',
  whatsapp: '',
};

mkdirSync(resolve(ROOT, 'output', slug, 'img'), { recursive: true });
writeFileSync(dest, JSON.stringify(spec, null, 2) + '\n');
console.log(`Criado produtos/${slug}.json com ${produtos.length} produto(s). Imagens vão em output/${slug}/img/`);
