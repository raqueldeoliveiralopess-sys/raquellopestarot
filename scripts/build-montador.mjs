#!/usr/bin/env node
/**
 * Monta montador/index.html: a versão no navegador do renderizador.
 * Embute fontes, base.css, os três templates e o gerador de rabiscos,
 * para que o resultado seja idêntico ao de scripts/render.mjs.
 *
 *   node scripts/build-montador.mjs
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const r = (p) => readFileSync(resolve(ROOT, p), 'utf8');

// fontes usadas pelos slides (as demais ficam de fora para a página não pesar)
const USADAS = new Set(['Garet', 'Barryone', 'Kaushan Script', 'Boston Angel']);
let fontCss = '';
for (const f of JSON.parse(r('fonts/fonts.json'))) {
  if (!USADAS.has(f.family)) continue;
  const p = resolve(ROOT, 'fonts', f.file);
  if (!existsSync(p)) continue;
  const ext = extname(p).toLowerCase();
  const mime = { '.otf': 'font/otf', '.ttf': 'font/ttf', '.woff': 'font/woff', '.woff2': 'font/woff2' }[ext] ?? 'font/woff2';
  fontCss += `@font-face{font-family:"${f.family}";src:url(data:${mime};base64,${readFileSync(p).toString('base64')});font-weight:${f.weight ?? 400};font-style:${f.style ?? 'normal'};}\n`;
}

// base.css sem a regra de página inteira (o slide vive dentro da interface)
const baseCss = r('templates/base.css')
  .replace(/html, body \{[^}]*\}\n?/, '')
  .replace(/\* \{ box-sizing: border-box; margin: 0; padding: 0; \}\n?/, '.slide, .slide * { box-sizing: border-box; margin: 0; padding: 0; }\n');

const sprite = r('templates/_shell.html').match(/<svg width="0"[\s\S]*?<\/svg>/)[0];
const templates = {
  capa: r('templates/capa.html'),
  produto: r('templates/produto.html'),
  cta: r('templates/cta.html'),
};
const doodles = r('scripts/doodles.mjs').replace('export function gerarDoodles', 'function gerarDoodles');

const html = r('montador/src.html')
  .replace('/*__FONTS__*/', () => fontCss)
  .replace('/*__BASECSS__*/', () => baseCss)
  .replace('<!--__SPRITE__-->', () => sprite)
  .replace('/*__TEMPLATES__*/', () => `const TEMPLATES = ${JSON.stringify(templates)};`)
  .replace('/*__DOODLES__*/', () => doodles)
  .replace('/*__AJUSTE__*/', () => r('templates/ajuste.js'));

writeFileSync(resolve(ROOT, 'montador/index.html'), html);
console.log(`montador/index.html: ${(html.length / 1024).toFixed(0)} KB`);
