// Grimório Arcano — carta do dia e pergunta de reflexão.
// Compartilhado entre o app (index.html) e a função de lembrete por e-mail (netlify/functions/lembrete-diario.mjs),
// para os dois sortearem sempre a mesma carta e a mesma pergunta no mesmo dia.
(function(root){
  const PERGUNTAS_DIA=[
    'Em que cena da sua semana esta carta já aconteceu de verdade?',
    'Que parte sua esta carta descreve e você não gosta de admitir?',
    'Que força sua esta carta nomeia?',
    'Se você levasse esta carta a sério por um dia, o que faria diferente hoje?',
    'Qual é a esperança desta carta? E qual é o medo? São a mesma cena?',
    'Em que cena antiga você reconhece esta carta?',
    'O que esta carta pede que você olhe de frente, sem precisar resolver?',
    'Onde o lado de sombra desta carta aparece disfarçado de virtude na sua vida?',
    'Que pessoa da sua história encarna esta carta? O que isso diz de você, não dela?',
    'Se esta carta fosse uma frase que você repete para si, qual seria?',
    'O que você faria hoje se acreditasse no lado de luz desta carta?',
    'Em que momento do dia esta carta aparece sem você perceber?',
    'Esta carta é você dentro do tema ou é o tema em si?',
    'Que hábito seu esta carta explica melhor do que você mesma explicaria?'
  ];
  // FNV-1a de 32 bits: estável em qualquer máquina
  function hashDia(str){ let h=2166136261; for(let i=0;i<str.length;i++){ h^=str.charCodeAt(i); h=Math.imul(h,16777619)>>>0; } return h; }
  // dia no formato AAAA-MM-DD; totalCartas = 78
  const indiceCarta = (dia,totalCartas) => hashDia('carta:'+dia)%totalCartas;
  const perguntaDoDia = dia => PERGUNTAS_DIA[hashDia('pergunta:'+dia)%PERGUNTAS_DIA.length];
  root.GA_DIARIO={PERGUNTAS_DIA,hashDia,indiceCarta,perguntaDoDia};
})(typeof window!=='undefined'?window:globalThis);
