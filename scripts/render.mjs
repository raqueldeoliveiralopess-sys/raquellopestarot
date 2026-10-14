#!/usr/bin/env node
/**
 * Renderiza os slides de um carrossel a partir de produtos/<slug>.json.
 *
 *   node scripts/render.mjs <slug> [--html-only]
 *
 * Saída: output/<slug>/slides/NN-<tipo>.png (1080x1350) + legenda.md
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname, extname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { gerarDoodles } from './doodles.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const slug = args.find((a) => !a.startsWith('--'));
const htmlOnly = args.includes('--html-only');

if (!slug) {
  console.error('Uso: node scripts/render.mjs <slug> [--html-only]');
  process.exit(1);
}

const specPath = resolve(ROOT, 'produtos', `${slug}.json`);
if (!existsSync(specPath)) {
  console.error(`Não achei ${specPath}`);
  process.exit(1);
}
const spec = JSON.parse(readFileSync(specPath, 'utf8'));
const outDir = resolve(ROOT, 'output', slug);
const slidesDir = join(outDir, 'slides');
mkdirSync(slidesDir, { recursive: true });

// ---------- fontes (embutidas em base64, sem depender de rede) ----------
function fontFaces() {
  const manifest = resolve(ROOT, 'fonts', 'fonts.json');
  if (!existsSync(manifest)) return '';
  const fontes = JSON.parse(readFileSync(manifest, 'utf8'));
  let css = '';
  for (const f of fontes) {
    const p = resolve(ROOT, 'fonts', f.file);
    if (!existsSync(p)) {
      console.warn(`  aviso: fonte não encontrada: fonts/${f.file}`);
      continue;
    }
    const ext = extname(p).toLowerCase();
    const mime = { '.otf': 'font/otf', '.ttf': 'font/ttf', '.woff': 'font/woff', '.woff2': 'font/woff2' }[ext] ?? 'font/woff2';
    const data = readFileSync(p).toString('base64');
    css += `@font-face{font-family:"${f.family}";src:url(data:${mime};base64,${data});font-weight:${f.weight ?? 400};font-style:${f.style ?? 'normal'};}\n`;
  }
  return css;
}

// ---------- imagens ----------
function imageToDataUri(ref) {
  if (!ref) return '';
  if (/^https?:\/\//.test(ref) || ref.startsWith('data:')) return ref;
  const p = resolve(ROOT, ref);
  if (!existsSync(p)) {
    console.warn(`  aviso: imagem não encontrada: ${ref} (usando fundo neutro)`);
    return '';
  }
  const ext = extname(p).toLowerCase().replace('.', '');
  const mime = ext === 'jpg' ? 'image/jpeg' : `image/${ext}`;
  return `data:${mime};base64,${readFileSync(p).toString('base64')}`;
}

// ---------- mini template engine ----------
const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function render(tpl, ctx) {
  tpl = tpl.replace(/{{#(\w+)}}([\s\S]*?){{\/\1}}/g, (_, key, inner) => {
    const v = ctx[key];
    if (Array.isArray(v)) return v.map((item) => render(inner, { ...ctx, '.': item, ...(typeof item === 'object' ? item : {}) })).join('');
    return v ? render(inner, ctx) : '';
  });
  tpl = tpl.replace(/{{\^(\w+)}}([\s\S]*?){{\/\1}}/g, (_, key, inner) => {
    const v = ctx[key];
    const empty = v === undefined || v === null || v === '' || v === false || (Array.isArray(v) && v.length === 0);
    return empty ? render(inner, ctx) : '';
  });
  tpl = tpl.replace(/{{{(\w+|\.)}}}/g, (_, key) => String(ctx[key] ?? ''));
  tpl = tpl.replace(/{{(\w+|\.)}}/g, (_, key) => esc(ctx[key]));
  return tpl;
}

const templatesDir = resolve(ROOT, 'templates');
const baseCss = fontFaces() + readFileSync(join(templatesDir, 'base.css'), 'utf8');
const shell = readFileSync(join(templatesDir, '_shell.html'), 'utf8');
const templatesBase = pathToFileURL(templatesDir + '/').href;

const produto = spec.produto ?? {};
const total = spec.slides.length;
const pages = [];

spec.slides.forEach((slide, i) => {
  const tplPath = join(templatesDir, `${slide.tipo}.html`);
  if (!existsSync(tplPath)) throw new Error(`Template não existe: templates/${slide.tipo}.html`);
  const tpl = readFileSync(tplPath, 'utf8');
  const ctx = {
    tam1: 'xl', tam2: 'xxl', // tamanhos padrão do nome do produto; use 'lg'/'xl' em nomes longos
    ...produto,
    ...slide,
    imagem: imageToDataUri(slide.imagem),
    doodles: slide.sem_doodles ? '' : gerarDoodles(slide.tipo, slide.seed ?? i + 1, slide.qtd_doodles ?? 9),
    indice: i + 1,
    total,
  };
  const body = render(tpl, ctx);
  const html = render(shell, { ...ctx, body, baseCss, templatesBase });
  const name = `${String(i + 1).padStart(2, '0')}-${slide.tipo}`;
  const htmlPath = join(slidesDir, `${name}.html`);
  writeFileSync(htmlPath, html);
  pages.push({ name, htmlPath, pngPath: join(slidesDir, `${name}.png`) });
});

// ---------- legenda + mensagem do grupo ----------
if (spec.legenda || spec.whatsapp) {
  const md = [
    `# ${produto.nome ?? spec.titulo ?? slug}`,
    '',
    '## Legenda do Instagram',
    '',
    spec.legenda ?? '',
    '',
    '## Mensagem do grupo (Mercado Holístico)',
    '',
    spec.whatsapp ?? '',
    '',
  ].join('\n');
  writeFileSync(join(outDir, 'legenda.md'), md);
}

if (htmlOnly) {
  console.log(`HTML gerado em ${slidesDir}`);
  process.exit(0);
}

// ---------- screenshots ----------
const { chromium } = await import('playwright');
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
for (const p of pages) {
  await page.goto(pathToFileURL(p.htmlPath).href, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: p.pngPath, type: 'png' });
  console.log(`  ✓ ${p.pngPath.replace(ROOT + '/', '')}`);
}
await browser.close();
console.log(`Carrossel pronto: ${total} slides em output/${slug}/slides/`);
