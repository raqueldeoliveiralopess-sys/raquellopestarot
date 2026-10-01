// Grimório Arcano — Tiragens para leitura de padrão (psicologia analítica)
// Nenhuma posição diz "o que vai acontecer". Cada posição mostra um pedaço do padrão que já está em curso e o que ele pede.
window.TAROT_SPREADS=[
{
  id:'tres', name:'Três cartas', short:'3 cartas', cards:3, area:'geral',
  tagline:'A menor unidade de padrão: de onde venho, onde estou, para onde isso aponta.',
  quando:'Quando a pergunta é simples e você quer enxergar o movimento de um padrão sem abrir uma tiragem grande. Serve para o estudo diário e para destravar quando a cabeça está confusa.',
  intro:'Três cartas não preveem nada. Elas colocam um padrão em linha do tempo: a raiz que ele tem na sua história, a cena em que ele aparece hoje e a direção que ele toma se você continuar respondendo do mesmo jeito. Na psicologia analítica, isso é olhar um complexo em movimento: onde ele foi formado, como ele se manifesta e o que ele está pedindo para ser integrado.',
  grid:{cols:3,rows:1},
  positions:[
    {n:1,label:'Raiz',col:1,row:1,sentido:'De onde esse padrão vem. A experiência, a crença ou a ferida que ensinou você a reagir desse jeito.',jung:'Complexo: núcleo emocional formado na história pessoal',perguntas:['Em que cena antiga eu reconheço essa carta?','O que eu aprendi ali que ainda uso hoje sem perceber?']},
    {n:2,label:'Cena atual',col:2,row:1,sentido:'Como o padrão aparece agora. Não é a situação em si: é o jeito como você está dentro dela.',jung:'Atitude consciente: como o ego está lidando com o conflito',perguntas:['Onde, nesta semana, essa carta aconteceu de verdade?','Estou vendo a situação ou a minha reação a ela?']},
    {n:3,label:'Direção',col:3,row:1,sentido:'Para onde o padrão aponta se nada mudar, e o que ele pede para ser integrado. Tendência, não sentença.',jung:'Função transcendente: o terceiro caminho que nasce quando o conflito é sustentado',perguntas:['Se eu não fizer nada diferente, que cena se repete?','O que esta carta pede que eu olhe de frente, e não que eu resolva?']}
  ],
  metodo:[
    'Formule a pergunta sobre você, nunca sobre outra pessoa. "Por que eu travo quando preciso falar" funciona; "o que ele sente por mim" não.',
    'Embaralhe pensando na cena concreta. Padrão só vale se couber numa cena da vida real.',
    'Vire as três e leia primeiro a imagem: o que os personagens estão fazendo, para onde olham, o que está no chão.',
    'Leia cada posição com luz e sombra. A mesma carta na Raiz pode ser um recurso ou uma ferida.',
    'Leia a linha inteira como uma frase: "Porque (1), hoje eu (2), e isso aponta para (3)".',
    'Nomeie o padrão em uma frase sua. Se não couber numa frase, ainda não está claro.',
    'Registre nas anotações da carta que mais mexeu com você.'
  ],
  relacoes:['Posições 1 e 3: se forem muito parecidas, o padrão está em repetição e a cena atual (2) é só mais uma rodada.','Posições 1 e 2: cartas de naipes opostos (Paus e Copas, Ouros e Espadas) costumam mostrar um conflito entre o que foi aprendido e o que se vive agora.','Arcano Maior na posição 3: o padrão pede uma mudança de atitude, não uma mudança de cenário.'],
  exemplo:'Pergunta: "por que eu adio toda conversa difícil?". Raiz: Cinco de Espadas (aprendi que discutir é perder). Cena atual: Dois de Espadas (fico em cima do muro para não escolher). Direção: A Justiça (o padrão pede responsabilidade pela própria posição, não uma vitória). O padrão em uma frase: "eu confundo conflito com guerra e me calo para não perder".'
},
{
  id:'peladan', name:'Tiragem de Péladan', short:'Péladan', cards:5, area:'geral',
  tagline:'Cinco cartas em cruz: o que ajuda, o que resiste, o conselho, a tendência e a síntese.',
  quando:'Quando existe uma decisão ou um conflito claro e você quer ver as forças que puxam para cada lado. É a tiragem clássica para estudar um dilema sem reduzir a sim ou não.',
  intro:'A tiragem de Péladan (ou tiragem em cruz) organiza um conflito em quatro forças e uma síntese. Para a leitura de padrão, a carta "a favor" mostra os recursos conscientes, a "contra" mostra o que resiste a partir da sombra, o "conselho" é a função transcendente, aquele terceiro caminho que só aparece quando você sustenta os dois lados, e o "resultado" é tendência, nunca sentença. A síntese no centro é o Self dizendo qual é a questão de verdade por trás da pergunta.',
  grid:{cols:3,rows:3},
  positions:[
    {n:1,label:'A favor',col:1,row:2,sentido:'O que já trabalha a seu favor: recursos, atitudes e forças conscientes disponíveis agora.',jung:'Recursos do ego e função psicológica dominante',perguntas:['Que força minha esta carta nomeia?','Estou usando esse recurso ou só sei que ele existe?']},
    {n:2,label:'Contra',col:3,row:2,sentido:'O que resiste. Quase sempre não é o mundo: é um pedaço seu que não quer mudar porque ganha algo com a situação.',jung:'Sombra: o que foi deixado de fora da identidade consciente',perguntas:['O que eu ganho mantendo as coisas como estão?','Que parte minha esta carta descreve e eu não gosto de admitir?']},
    {n:3,label:'Conselho',col:2,row:1,sentido:'A atitude que o padrão pede. Não é ordem, é direção: o que precisa ser olhado, sustentado ou largado.',jung:'Função transcendente: o símbolo que une os opostos',perguntas:['Se eu levasse esta carta a sério por uma semana, o que faria diferente?','Ela pede ação, espera ou escuta?']},
    {n:4,label:'Tendência',col:2,row:3,sentido:'Para onde o padrão inclina com a atitude de hoje. Serve para você escolher se quer confirmar ou mudar o rumo.',jung:'Teleologia da psique: o sentido para onde o processo aponta',perguntas:['Essa tendência me serve ou só me é familiar?','O que da posição 3 muda essa inclinação?']},
    {n:5,label:'Síntese',col:2,row:2,sentido:'A questão real por trás da pergunta. Pode ser sorteada ou calculada: some os números das quatro cartas (se forem Arcanos Maiores) e reduza até 22 ou menos; 22 é O Louco.',jung:'Self: o centro que organiza o conflito inteiro',perguntas:['Qual era a pergunta de verdade?','O que essa carta tem a ver com as outras quatro juntas?']}
  ],
  metodo:[
    'Escreva a pergunta como dilema seu: "aceito a proposta ou fico onde estou", nunca "vão me escolher?".',
    'Tire as cartas 1 a 4 em cruz: esquerda, direita, cima, baixo.',
    'A síntese (5) pode ser a quinta carta sorteada ou a soma das quatro, quando forem Arcanos Maiores. Some os números, reduza até chegar a 22 ou menos (22 vale O Louco). No app, ao praticar, a quinta é sorteada e a soma aparece como curiosidade.',
    'Leia o eixo horizontal (1 e 2) como a briga interna: o que ajuda contra o que resiste.',
    'Leia o eixo vertical (3 e 4) como o caminho: o conselho e a inclinação.',
    'Só então leia a síntese e pergunte: essa carta explica por que eu fiz a pergunta?',
    'Feche com uma frase: "a questão não é X, é Y".'
  ],
  relacoes:['Posições 1 e 2: cartas da mesma família (dois Paus, duas cortesãs) indicam que o recurso e a resistência vêm da mesma função, e o conflito é de dosagem.','Posições 3 e 4: se o conselho é ativo (Cavaleiros, Paus, Mago) e a tendência é passiva (Quatros, Enforcado, Lua), o padrão pede movimento que você está evitando.','Síntese repetindo o naipe dominante: a pergunta é mesmo sobre aquela área; síntese de naipe ausente: você perguntou sobre uma coisa e a questão é outra.'],
  exemplo:'Pergunta: "saio da clínica onde atendo ou abro meu espaço?". A favor: Rainha de Paus (autonomia já madura). Contra: Nove de Espadas (medo noturno de não dar conta). Conselho: A Temperança (transição em doses, não em salto). Tendência: Oito de Paus (movimento rápido quando começar). Síntese: O Eremita (a questão real é fazer o próprio caminho, não o lugar). Padrão: "eu já sou autônoma, só ainda não me autorizei".'
},
{
  id:'celta', name:'Cruz Celta', short:'Cruz Celta', cards:10, area:'geral',
  tagline:'Dez posições para mapear um padrão inteiro: consciente, inconsciente, passado, ambiente e direção.',
  quando:'Quando o tema é grande, repetitivo e você quer o mapa completo: como se vê, como o ambiente devolve, o que vem do inconsciente, o que você espera e teme. Não é tiragem de rotina: é tiragem de estudo profundo.',
  intro:'A Cruz Celta é a tiragem mais conhecida do Ocidente e, lida pela psicologia analítica, vira um mapa do aparelho psíquico diante de um tema. A cruz da esquerda mostra a dinâmica interna: o ego no centro, o complexo que o atravessa, a raiz inconsciente, o passado recente, a atitude consciente e a próxima cena. O bastão da direita mostra a relação com o mundo: como você se vê, como o ambiente devolve suas projeções, o par esperança e medo, e a direção do processo.',
  grid:{cols:4,rows:4},
  positions:[
    {n:1,label:'Situação',col:2,row:2,sentido:'Onde você está dentro do tema. O ego no centro da cena.',jung:'Ego: o centro da consciência',perguntas:['Esta carta sou eu dentro do tema ou é o tema em si?']},
    {n:2,label:'O que atravessa',col:2,row:2,cross:true,sentido:'O que corta a situação: o conflito, o complexo ativado, o que você sente como obstáculo. Lida sempre na posição normal.',jung:'Complexo ativado: a carga emocional que toma o ego',perguntas:['Isso atravessa a situação ou atravessa a mim?','O que acontece com meu corpo quando esse tema aparece?']},
    {n:3,label:'Raiz',col:2,row:3,sentido:'O fundamento inconsciente. O que sustenta o padrão sem que você veja.',jung:'Inconsciente pessoal: o material reprimido ou esquecido',perguntas:['O que eu não quero saber sobre a origem disso?']},
    {n:4,label:'Passado recente',col:1,row:2,sentido:'O que acabou de acontecer e ainda pesa. A cena anterior a esta.',jung:'Causalidade: o que condiciona o momento',perguntas:['O que eu ainda estou carregando daquela cena?']},
    {n:5,label:'Consciente',col:2,row:1,sentido:'O que você pensa sobre o tema, o que diria em voz alta, a versão oficial.',jung:'Persona: a face que a consciência apresenta',perguntas:['Essa versão é inteira ou é a que eu conto?']},
    {n:6,label:'Próxima cena',col:3,row:2,sentido:'A cena que vem a seguir se a atitude continuar. Curto prazo, tendência.',jung:'Finalidade: para onde o processo se move',perguntas:['Eu reconheço essa próxima cena? Ela já aconteceu antes?']},
    {n:7,label:'Como me vejo',col:4,row:4,sentido:'A imagem que você faz de si no tema. Compare com a posição 1.',jung:'Autoimagem do ego e inflação ou deflação',perguntas:['Essa imagem me engrandece, me diminui ou me descreve?']},
    {n:8,label:'O que o ambiente devolve',col:4,row:3,sentido:'Como as pessoas e o contexto respondem a você. Não é o que eles pensam: é o que você projeta e recebe de volta.',jung:'Projeção: o que vejo fora porque não vejo dentro',perguntas:['O que eu digo que os outros fazem comigo e que eu também faço?']},
    {n:9,label:'Esperança e medo',col:4,row:2,sentido:'O que você mais deseja e mais teme, que no fundo é a mesma coisa vista de dois lados.',jung:'Par de opostos: enantiodromia, tudo vira seu contrário',perguntas:['Qual é a esperança desta carta? E qual é o medo? São a mesma cena?']},
    {n:10,label:'Direção',col:4,row:1,sentido:'Síntese do mapa. Para onde o processo inteiro aponta e o que ele pede de integração.',jung:'Individuação: o movimento de tornar-se inteira',perguntas:['O que o mapa inteiro pede que eu integre, e não que eu conserte?']}
  ],
  metodo:[
    'Formule um tema seu, amplo, que se repete: "minha relação com trabalho", "meu jeito de amar".',
    'Tire as cartas 1 a 6 em cruz: centro, a que atravessa (deitada sobre a primeira), base, esquerda, topo, direita.',
    'Tire as cartas 7 a 10 em coluna à direita, de baixo para cima.',
    'Leia o centro primeiro (1 e 2): quem sou eu aqui e o que me atravessa.',
    'Leia o eixo vertical da cruz (3 e 5): o que está embaixo e o que está em cima, inconsciente e consciente. A distância entre eles é a medida da sua cegueira no tema.',
    'Leia o eixo horizontal (4 e 6): de onde venho e para onde a cena anda.',
    'Leia o bastão (7 a 10) como relação com o mundo: autoimagem, projeção, opostos, direção.',
    'Compare 1 com 7 e 5 com 8. Ali está o padrão.',
    'Escreva em uma frase e registre.'
  ],
  relacoes:['Posições 1 e 7: se forem opostas, você se vê diferente do que está vivendo. Esse é o primeiro trabalho.','Posições 3 e 5: Arcano Maior na raiz e carta de corte no consciente indicam um padrão antigo que a versão oficial não dá conta de explicar.','Posições 5 e 8: o que você pensa e o que o ambiente devolve. Quando combinam, o padrão está sendo confirmado por fora; quando chocam, há projeção forte.','Posições 6 e 10: próxima cena e direção. Se divergem, o curto prazo é só mais uma rodada do padrão antes de virar.'],
  exemplo:'Tema: "meu jeito de amar". Centro: Rainha de Copas atravessada por Oito de Espadas (eu cuido, mas me sinto presa). Raiz: Cinco de Copas (luto antigo). Consciente: Dez de Copas (a versão oficial é família feliz). Como me vejo: Força. Ambiente devolve: Sete de Espadas (eu digo que me enganam; eu também me escondo). Esperança e medo: Os Enamorados. Direção: A Estrela. Padrão: "eu cuido para não precisar; o mapa pede que eu peça".'
},
{
  id:'ferradura', name:'Ferradura Financeira', short:'Ferradura', cards:7, area:'financeiro',
  tagline:'Sete cartas em arco para ler o padrão de relação com dinheiro, trabalho e recursos.',
  quando:'Quando o tema é dinheiro, trabalho ou recurso e você quer entender o padrão, não adivinhar o saldo. Tarot não prevê dinheiro certo, cara. Ele mostra como você se relaciona com o que tem, com o que falta e com o que faz para dar conta.',
  intro:'A ferradura é um arco de sete cartas que vai da história à tendência. Adaptada à psicologia analítica, ela lê o complexo financeiro: o que você aprendeu em casa sobre falta e abundância, o que não vê sobre o próprio comportamento com recursos, o obstáculo concreto e a atitude que o padrão pede. A sétima carta é tendência do padrão, não promessa de resultado. Nenhuma carta aqui garante entrada de dinheiro, e quem promete isso não está lendo tarot.',
  grid:{cols:5,rows:3},
  positions:[
    {n:1,label:'Minha história com dinheiro',col:1,row:1,sentido:'O que você aprendeu sobre recurso, falta e merecimento. A cena de origem do padrão financeiro.',jung:'Complexo familiar: a herança psíquica sobre o material',perguntas:['Que frase sobre dinheiro eu ouvi em casa e repito até hoje?','Esta carta é a frase ou é a reação a ela?']},
    {n:2,label:'Como estou hoje',col:1,row:2,sentido:'Sua atitude atual diante do material: como ganha, gasta, guarda, pede, cobra.',jung:'Atitude consciente diante da função sensação (o concreto)',perguntas:['Esta carta descreve minha conta ou meu comportamento com ela?']},
    {n:3,label:'O que não vejo',col:2,row:3,sentido:'A sombra financeira. O comportamento que você não enxerga: sabotagem, culpa, grandiosidade, medo de cobrar, gasto para compensar.',jung:'Sombra: o que você faz com dinheiro e não admite',perguntas:['Em que momento do mês esta carta aparece sem eu perceber?','O que eu compro, dou ou evito para não sentir?']},
    {n:4,label:'Obstáculo concreto',col:3,row:3,sentido:'O que de fato trava hoje: uma dívida, uma habilidade que falta, um preço que você não sustenta, uma conversa não feita.',jung:'Realidade externa: o teste de realidade do ego',perguntas:['Esse obstáculo é do mundo ou é a minha sombra agindo no mundo?']},
    {n:5,label:'Como me posiciono diante dos outros',col:4,row:3,sentido:'Como você se coloca em sócio, cliente, família e chefia quando o assunto é dinheiro. Não é o que eles fazem: é o que você faz na frente deles.',jung:'Persona financeira e projeção nas relações de troca',perguntas:['Eu cobro o que vale ou cobro o que não incomoda?','O que eu digo que os outros fazem com meu dinheiro e também faço?']},
    {n:6,label:'Atitude que o padrão pede',col:5,row:2,sentido:'O conselho. A mudança de atitude, não de sorte: organizar, cobrar, parar, pedir ajuda, aprender.',jung:'Função transcendente aplicada ao concreto',perguntas:['Qual é a ação mais chata e mais real que esta carta pede?']},
    {n:7,label:'Tendência do padrão',col:5,row:1,sentido:'Para onde a relação com o recurso inclina se a atitude continuar. Tendência, não extrato bancário.',jung:'Finalidade do processo: o que o padrão quer ensinar',perguntas:['Essa tendência me serve? O que da posição 6 muda esse rumo?']}
  ],
  metodo:[
    'Pergunte sobre o seu padrão, não sobre o resultado: "como eu me relaciono com cobrar", nunca "vou ganhar mais este mês?".',
    'Disponha as sete cartas em U: duas descendo à esquerda (1 e 2), três na base (3, 4 e 5), duas subindo à direita (6 e 7).',
    'Leia a descida (1 e 2) como a história: de onde vem e como está.',
    'Leia a base (3, 4 e 5) como o fundo do poço: o que não vê, o obstáculo concreto e como se posiciona diante dos outros. Confira se o obstáculo existe de verdade ou se é a sombra disfarçada.',
    'Leia a subida (6 e 7) como a saída: o que o padrão pede e para onde inclina.',
    'Compare 1 com 7: se a tendência repete a história, o padrão ainda não foi tocado.',
    'Escreva uma ação concreta a partir da posição 6 e registre.'
  ],
  relacoes:['Posições 1 e 3: a herança e a sombra. Quase sempre a sombra é a frase da infância virada ao contrário (quem ouviu "dinheiro não dá em árvore" pode gastar por rebeldia).','Posições 3 e 5: o que não vejo e como me posiciono. É aqui que aparece o preço baixo, o calote aceito, o favor que não devia ser de graça.','Posições 4 e 6: obstáculo e atitude. Se a atitude pedida não encosta no obstáculo, releia o obstáculo: ele pode ser desculpa.','Ouros ausentes numa tiragem financeira: o tema não é dinheiro, é valor próprio.'],
  exemplo:'Pergunta: "por que eu não consigo cobrar o que vale meu atendimento?". História: Seis de Ouros (aprendi que receber é dever favor). Hoje: Valete de Ouros (ainda estudando, nunca pronta). Não vejo: Rainha de Copas invertida (dou para ser amada). Obstáculo: Quatro de Ouros (medo de perder quem já paga pouco). Diante dos outros: Oito de Espadas. Atitude: O Imperador (tabela, contrato, limite). Tendência: Dez de Paus se nada mudar. Padrão: "eu troco preço por afeto".'
},
{
  id:'afrodite', name:'Templo de Afrodite', short:'Afrodite', cards:7, area:'amor',
  tagline:'Sete posições em forma de templo para ler o seu padrão amoroso, sem ler o outro.',
  quando:'Quando o tema é vínculo afetivo e você quer entender o seu padrão, não o que o outro sente. Serve para relação atual, término recente ou aquele jeito de amar que se repete com pessoas diferentes.',
  intro:'Afrodite não é a deusa de um namorado específico: é o arquétipo do desejo, da atração e do vínculo. Este templo tem sete posições e todas apontam para você. Mesmo quando a pergunta nasce sobre a outra pessoa, a carta responde sobre a sua parte: o que você projeta, o que busca completar, o que evita em si e o que esse vínculo repete. Na psicologia analítica, amor é o lugar onde anima e animus são projetados com mais força, e por isso é onde dá para ver o padrão com mais clareza. Pergunta sobre o outro volta pra quem perguntou.',
  grid:{cols:3,rows:4},
  positions:[
    {n:7,label:'Síntese: o que esse amor ensina',col:2,row:1,sentido:'O frontão do templo. O que esse vínculo (ou essa repetição) está ensinando sobre o seu padrão de amar.',jung:'Self: o sentido do encontro para a individuação',perguntas:['Se esse amor fosse uma aula, qual seria o tema?']},
    {n:1,label:'Eu no vínculo',col:1,row:2,sentido:'Como você se apresenta quando ama: a face que mostra, o papel que assume.',jung:'Persona afetiva',perguntas:['Que personagem eu viro quando gosto de alguém?','Essa face é inteira ou é a que dá menos medo?']},
    {n:2,label:'O que projeto no outro',col:3,row:2,sentido:'O que você enxerga na pessoa que, na verdade, é um pedaço seu ainda não vivido. Fascínio e irritação são as duas faces da mesma projeção.',jung:'Anima/animus: a imagem interna do outro projetada',perguntas:['O que mais me encanta nessa pessoa? E o que mais me irrita? Onde isso existe em mim?']},
    {n:3,label:'O que me atrai',col:1,row:3,sentido:'O que você busca completar através do vínculo: a qualidade que sente que falta e vai buscar fora.',jung:'Compensação: a psique busca fora o que não desenvolveu dentro',perguntas:['O que eu quero que essa pessoa seja por mim?']},
    {n:4,label:'O que me afasta',col:3,row:3,sentido:'O que você evita, recusa ou sabota no vínculo. Costuma ser a parte sua que você não quer encontrar no espelho.',jung:'Sombra pessoal no vínculo',perguntas:['Do que eu fujo quando a relação aprofunda?','Que defeito do outro eu reconheço em mim e nego?']},
    {n:5,label:'A sombra do vínculo',col:1,row:4,sentido:'O que a dupla repete junto: a dança que os dois conhecem, a briga que volta, o silêncio combinado.',jung:'Padrão relacional: o complexo compartilhado',perguntas:['Qual é a cena que já aconteceu três vezes?','Qual é o meu passo nessa dança?']},
    {n:6,label:'O que o vínculo pede de mim',col:3,row:4,sentido:'A atitude que o padrão pede. Nunca é "mudar o outro": é o que você precisa integrar, dizer, sustentar ou largar.',jung:'Função transcendente: integrar a projeção',perguntas:['O que eu posso retirar de projeção e assumir como meu?']}
  ],
  metodo:[
    'Formule a pergunta sobre o seu padrão: "o que eu repito nas minhas relações", "o que eu estou projetando nele". Se a pergunta começar com "ele" ou "ela", reescreva até começar com "eu".',
    'Monte o templo: a síntese (7) no topo, depois duas colunas de cima para baixo: 1 e 2, 3 e 4, 5 e 6.',
    'Leia a coluna da esquerda (1, 3, 5) como o seu lado consciente do vínculo: como me apresento, o que busco, o que repito.',
    'Leia a coluna da direita (2, 4, 6) como o lado inconsciente: o que projeto, o que evito, o que preciso integrar.',
    'Leia cada linha como um par: 1 e 2 (eu e minha projeção), 3 e 4 (atração e recusa), 5 e 6 (repetição e saída).',
    'Só no fim leia o frontão (7): o que esse amor ensina.',
    'Escreva uma frase que comece com "eu" e registre. Nada de "ele precisa".'
  ],
  relacoes:['Posições 2 e 3: o que projeto e o que me atrai costumam ser a mesma qualidade, vista como dele e como falta minha.','Posições 2 e 4: fascínio e recusa na mesma carta ou na mesma família indicam projeção intensa: o que encanta e o que afasta são a mesma coisa.','Posições 1 e 5: se a persona afetiva e a sombra do vínculo combinam, é o personagem que você faz que mantém a dança.','Cortesãs em 2: a projeção tem rosto de pessoa concreta (pai, mãe, ex). Vale perguntar de quem é esse rosto.'],
  exemplo:'Pergunta: "o que eu repito com homens indisponíveis?". Eu no vínculo: A Imperatriz (nutro). Projeto: Cavaleiro de Paus (vejo neles a liberdade que não me dou). Atrai: O Louco. Afasta: Quatro de Copas (recuso o que está disponível). Sombra do vínculo: Sete de Copas (a dupla vive de promessa). Pede: A Imperatriz invertida, lida como "nutrir a mim". Síntese: A Estrela. Padrão: "eu escolho quem foge para não ter que ficar".'
},
{
  id:'mandala', name:'Mandala Astrológica', short:'Mandala', cards:13, area:'geral', layout:'wheel',
  tagline:'Doze casas em círculo e o Self no centro: um retrato do padrão em cada área da vida num período.',
  quando:'Em virada de ano, de semestre ou de mês, quando você quer um retrato de todas as áreas de uma vez e escolher onde o padrão pede trabalho. Não é previsão de doze meses: é mapa de atenção.',
  intro:'A mandala usa as doze casas da astrologia como doze áreas da vida e coloca uma décima terceira carta no centro. Para Jung, a mandala é a imagem do Self, o centro que organiza a totalidade da psique, e desenhá-la é um ato de ordenação interna. Aqui você não lê "o que vai acontecer em cada mês": lê que padrão está ativo em cada área no período escolhido e qual delas pede trabalho. O centro responde o que organiza tudo isso.',
  grid:{cols:5,rows:5},
  variantes:[
    {id:'anual',label:'Anual',texto:'Horizonte de um ciclo inteiro. Cada casa mostra o padrão de fundo daquela área ao longo do ano: o tema que vai aparecer de formas diferentes, em cenas diferentes. Leia o centro como o eixo do ano. Boa para fazer na virada do ano ou no aniversário, e voltar a cada três meses para conferir onde o padrão apareceu.'},
    {id:'semestral',label:'Semestral',texto:'Horizonte de seis meses. O foco deixa de ser o tema de fundo e passa a ser o movimento: em que áreas o padrão está mudando de fase e em quais está parado. Compare com a mandala anual, se tiver: a casa que mudou de naipe é onde o processo andou.'},
    {id:'mensal',label:'Mensal',texto:'Horizonte curto. As doze casas viram áreas de atenção do mês, não acontecimentos. Escolha as duas ou três casas com Arcanos Maiores ou cartas de corte e trabalhe só nelas: um mês não dá conta de doze frentes. O centro é a atitude do mês.'}
  ],
  positions:[
    {n:1,label:'Casa 1 · Identidade',sentido:'Como você se apresenta e se afirma no período. A persona em uso.',jung:'Persona e ego',perguntas:['Que face eu estou usando para entrar neste período?']},
    {n:2,label:'Casa 2 · Valores e recursos',sentido:'Sua relação com o que tem: dinheiro, talentos, autoestima material.',jung:'Valor próprio e função sensação',perguntas:['O que eu considero meu e cuido como tal?']},
    {n:3,label:'Casa 3 · Mente e comunicação',sentido:'Como você pensa, fala, aprende e troca no cotidiano.',jung:'Função pensamento e trocas próximas',perguntas:['Qual é o padrão da minha conversa interna agora?']},
    {n:4,label:'Casa 4 · Raiz e casa interna',sentido:'Família, origem, o lar de dentro. O que sustenta ou pesa por baixo.',jung:'Complexo materno/paterno e inconsciente pessoal',perguntas:['O que da minha origem está ativo neste período?']},
    {n:5,label:'Casa 5 · Criação e prazer',sentido:'O que você cria, como brinca, como ama de forma leve, o que te dá alegria.',jung:'Criança interior e expressão criativa',perguntas:['Onde eu me permito criar sem ter que render?']},
    {n:6,label:'Casa 6 · Rotina e corpo',sentido:'Hábitos, saúde, trabalho de todo dia, o que você sustenta na repetição.',jung:'Ego no concreto: disciplina e cuidado',perguntas:['Que hábito deste período me descreve melhor que qualquer discurso?']},
    {n:7,label:'Casa 7 · Vínculos',sentido:'Parcerias, relações próximas e o que você projeta nelas.',jung:'Anima/animus e projeção',perguntas:['O que eu estou vendo no outro que é meu?']},
    {n:8,label:'Casa 8 · Crises e transformação',sentido:'O que morre e renasce, o que é partilhado, o que exige profundidade.',jung:'Sombra e processo de morte e renascimento',perguntas:['O que precisa terminar para o período fazer sentido?']},
    {n:9,label:'Casa 9 · Sentido e busca',sentido:'Estudo, filosofia de vida, espiritualidade, o que dá direção.',jung:'Função intuição e busca de sentido',perguntas:['Em que eu acredito neste período, de fato, pelo que faço?']},
    {n:10,label:'Casa 10 · Vocação e imagem pública',sentido:'Carreira, reconhecimento, o lugar que você ocupa no mundo.',jung:'Persona social e vocação',perguntas:['O que eu quero que vejam em mim? E o que mostro de verdade?']},
    {n:11,label:'Casa 11 · Pertencimento',sentido:'Amizades, grupos, comunidade, projetos coletivos.',jung:'Relação com o coletivo e com o futuro',perguntas:['Onde eu pertenço e onde só frequento?']},
    {n:12,label:'Casa 12 · Inconsciente',sentido:'O que está escondido, o que você não controla, o retiro, a sombra coletiva.',jung:'Inconsciente profundo e dissolução do ego',perguntas:['O que eu não quero olhar neste período? É isso que vai aparecer.']},
    {n:13,label:'Centro · Self',center:true,sentido:'O que organiza o período inteiro. A atitude de fundo que dá sentido às doze áreas.',jung:'Self: o centro ordenador da totalidade',perguntas:['Se o período inteiro tivesse um só tema, qual seria?']}
  ],
  metodo:[
    'Escolha o horizonte: anual, semestral ou mensal. O desenho é o mesmo, muda o que você espera de cada casa.',
    'Disponha as doze cartas em círculo, em sentido anti-horário a partir da esquerda (casa 1 às nove horas do relógio), como no mapa astral.',
    'Coloque a décima terceira no centro.',
    'Leia primeiro o centro: ele é o tema. Todas as casas são variações dele.',
    'Depois leia os eixos: 1 e 7 (eu e o outro), 4 e 10 (raiz e vocação), 2 e 8 (o que é meu e o que é partilhado), 3 e 9 (mente próxima e sentido), 5 e 11 (criação e coletivo), 6 e 12 (rotina e inconsciente).',
    'Marque as casas com Arcanos Maiores ou cartas de corte: são as áreas onde o padrão pede trabalho no período.',
    'Não tente dar conta das doze. Escolha de duas a três e registre.',
    'Volte à mandala no meio do período e anote onde cada carta apareceu em cena real.'
  ],
  relacoes:['Eixo 1 e 7: identidade e vínculo. Cartas opostas indicam que você se apresenta de um jeito e se relaciona de outro.','Eixo 4 e 10: raiz e vocação. O que você faz no mundo repete ou compensa a casa de origem.','Eixo 6 e 12: rotina e inconsciente. A rotina costuma ser o lugar onde o que está escondido aparece em sintoma.','Centro repetindo o naipe de uma casa: aquela área é o eixo do período.','Maiores concentrados num eixo: o padrão do período inteiro mora ali.'],
  exemplo:'Mandala mensal com centro em A Lua: o mês pede escuta do que não está claro. Casa 6 com Nove de Espadas e casa 12 com Oito de Copas marcam o eixo: a rotina está adoecendo por algo que você já sabe que precisa deixar. As outras dez casas viram pano de fundo. Trabalho do mês: uma frase, um limite, uma despedida.'
}
];
