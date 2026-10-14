/**
 * Gera os rabiscos (estrelas, corações, lua, raios) de um slide.
 * Cada template tem zonas onde os rabiscos podem cair, para não cobrir
 * o produto nem o texto. O seed deixa o resultado reproduzível.
 */
const FORMAS = ['star', 'sparkle', 'heart', 'moon', 'rays', 'star', 'sparkle', 'rays'];
const CORES = ['white', 'pink', 'orange', 'light', 'white', 'pink'];

// zonas: [x, y, largura, altura] em px na tela 1080x1350
const ZONAS = {
  capa: [
    [720, 40, 320, 300],   // topo direita
    [40, 640, 300, 420],   // esquerda meio
    [680, 520, 360, 240],  // direita meio
    [40, 1120, 420, 180],  // rodapé esquerda
  ],
  produto: [
    [40, 16, 380, 70],     // faixa acima do título, esquerda
    [660, 16, 380, 70],    // faixa acima do título, direita
    [30, 360, 200, 600],   // faixa esquerda
    [850, 360, 200, 600],  // faixa direita
    [60, 1100, 960, 200],  // rodapé
  ],
  cta: [
    [700, 40, 340, 300],   // topo direita
    [40, 560, 280, 320],   // esquerda meio
    [720, 560, 320, 240],  // direita meio
    [40, 1120, 380, 190],  // rodapé esquerda
  ],
};

function rng(seed) {
  let s = (seed * 9301 + 49297) % 233280;
  return () => (s = (s * 9301 + 49297) % 233280) / 233280;
}

export function gerarDoodles(tipo, seed = 1, quantidade = 9) {
  const zonas = ZONAS[tipo] ?? ZONAS.produto;
  const rand = rng(seed + 7);
  const out = [];
  for (let i = 0; i < quantidade; i++) {
    const z = zonas[i % zonas.length];
    const forma = FORMAS[Math.floor(rand() * FORMAS.length)];
    const cor = CORES[Math.floor(rand() * CORES.length)];
    const tam = forma === 'moon' ? 120 + rand() * 60 : forma === 'rays' ? 90 + rand() * 50 : 44 + rand() * 60;
    const x = z[0] + rand() * Math.max(0, z[2] - tam);
    const y = z[1] + rand() * Math.max(0, z[3] - tam);
    const rot = Math.round(rand() * 60 - 30);
    out.push(
      `<svg class="doodle ${cor}" style="left:${Math.round(x)}px; top:${Math.round(y)}px; width:${Math.round(tam)}px; height:${Math.round(tam)}px; transform:rotate(${rot}deg);"><use href="#d-${forma}"/></svg>`
    );
  }
  return out.join('\n');
}
