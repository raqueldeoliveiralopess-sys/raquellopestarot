// Encolhe cada linha de texto (nowrap) até caber na largura útil do slide.
// Usado pelo render.mjs (antes do screenshot) e pelo montador no navegador.
function ajustarLinhas(raiz) {
  const MAX = 980;
  (raiz || document).querySelectorAll('.bloco .linha').forEach((el) => {
    if (getComputedStyle(el).whiteSpace !== 'nowrap') return;
    let size = parseFloat(getComputedStyle(el).fontSize);
    let guard = 0;
    while (el.scrollWidth > MAX && size > 36 && guard++ < 40) {
      size *= 0.95;
      el.style.fontSize = size + 'px';
    }
  });
}
