// COB — Biblioteca de bruxa(o)
// Correspondências tradicionais: variam entre tradições e autores. Nada aqui é orientação médica.
window.BIBLIOTECA={

ervas:[
 {id:'alecrim',nome:'Alecrim',cientifico:'Salvia rosmarinus',elemento:'Fogo',planeta:'Sol',temas:['proteção','purificação','memória e estudos'],usos:'Banho de limpeza, defumação, sachê de proteção, chá.',cuidado:'Evite o chá em excesso na gravidez e se tiver pressão alta.'},
 {id:'arruda',nome:'Arruda',cientifico:'Ruta graveolens',elemento:'Fogo',planeta:'Marte',temas:['proteção','afastar mau-olhado','limpeza'],usos:'Vaso na entrada da casa, ramo atrás da orelha, banho do pescoço para baixo.',cuidado:'Tóxica. Não ingerir. Abortiva: evite contato na gravidez. A seiva pode manchar e queimar a pele exposta ao sol.'},
 {id:'lavanda',nome:'Lavanda',cientifico:'Lavandula angustifolia',elemento:'Ar',planeta:'Mercúrio',temas:['calma','sono','harmonia'],usos:'Sachê no travesseiro, banho relaxante, óleo no difusor.',cuidado:'O óleo essencial puro pode irritar a pele: dilua sempre.'},
 {id:'manjericao',nome:'Manjericão',cientifico:'Ocimum basilicum',elemento:'Fogo',planeta:'Marte',temas:['prosperidade','proteção do lar','amor'],usos:'Vaso na cozinha, banho de prosperidade, folhas na carteira.',cuidado:'Seguro como tempero. Use o óleo essencial com moderação.'},
 {id:'louro',nome:'Louro',cientifico:'Laurus nobilis',elemento:'Fogo',planeta:'Sol',temas:['vitória','desejos','prosperidade'],usos:'Escrever um desejo na folha e queimar, folha na carteira, defumação.',cuidado:'Seguro como tempero. Queime em local ventilado.'},
 {id:'canela',nome:'Canela',cientifico:'Cinnamomum verum',elemento:'Fogo',planeta:'Sol',temas:['prosperidade','aquecimento','sucesso'],usos:'Soprar canela em pó na porta no início do mês, incenso, banho doce.',cuidado:'Irrita a pele e os olhos. Em banho, use pouca e em infusão coada.'},
 {id:'camomila',nome:'Camomila',cientifico:'Matricaria chamomilla',elemento:'Água',planeta:'Sol',temas:['calma','sorte','sono tranquilo'],usos:'Chá, banho para acalmar, sachê.',cuidado:'Pode causar alergia em quem tem alergia a margaridas e ambrósia.'},
 {id:'salvia',nome:'Sálvia',cientifico:'Salvia officinalis',elemento:'Ar',planeta:'Júpiter',temas:['purificação','sabedoria','limpeza de ambientes'],usos:'Defumação de ambientes, banho de limpeza.',cuidado:'Não use o chá em grande quantidade, nem na gravidez ou amamentação. A sálvia-branca norte-americana é sagrada para povos indígenas e muitas vezes colhida de forma predatória: prefira a sálvia comum.'},
 {id:'hortela',nome:'Hortelã',cientifico:'Mentha spp.',elemento:'Ar',planeta:'Mercúrio',temas:['prosperidade','comunicação','frescor e renovação'],usos:'Chá, banho revigorante, folhas na carteira.',cuidado:'O óleo essencial não deve ser usado em bebês e crianças pequenas.'},
 {id:'rosa',nome:'Rosa',cientifico:'Rosa spp.',elemento:'Água',planeta:'Vênus',temas:['amor','autoestima','beleza'],usos:'Banho de pétalas, água de rosas, altar de amor-próprio.',cuidado:'Use rosas sem agrotóxico se for para banho ou chá.'},
 {id:'guine',nome:'Guiné',cientifico:'Petiveria alliacea',elemento:'Fogo',planeta:'Marte',temas:['proteção forte','corte de energias pesadas'],usos:'Vaso na entrada, banho de descarrego do pescoço para baixo.',cuidado:'Tóxica. Não ingerir. Evite na gravidez. Mantenha longe de crianças e animais.'},
 {id:'espada',nome:'Espada-de-são-jorge',cientifico:'Dracaena trifasciata',elemento:'Fogo',planeta:'Marte',temas:['proteção','firmeza','guarda da casa'],usos:'Vaso na entrada da casa ou do quarto.',cuidado:'Tóxica para cães e gatos se mastigada.'},
 {id:'artemisia',nome:'Artemísia',cientifico:'Artemisia vulgaris',elemento:'Terra',planeta:'Vênus',temas:['intuição','sonhos','ciclos femininos'],usos:'Sachê no travesseiro para sonhos, defumação.',cuidado:'Contraindicada na gravidez (estimula o útero). Pode causar alergia.'},
 {id:'cravo',nome:'Cravo-da-índia',cientifico:'Syzygium aromaticum',elemento:'Fogo',planeta:'Júpiter',temas:['prosperidade','proteção','afastar fofoca'],usos:'Incenso, saquinho de proteção, laranja cravejada no altar.',cuidado:'O óleo é forte e queima a pele: dilua sempre.'},
 {id:'anis',nome:'Anis-estrelado',cientifico:'Illicium verum',elemento:'Ar',planeta:'Júpiter',temas:['intuição','sorte','consagração'],usos:'Altar, sachê, banho de sorte.',cuidado:'Não confunda com o anis-estrelado-japonês, que é tóxico. Não dê chá para bebês.'},
 {id:'melissa',nome:'Melissa',cientifico:'Melissa officinalis',elemento:'Água',planeta:'Lua',temas:['calma','alegria','cura emocional'],usos:'Chá, banho calmante, sachê.',cuidado:'Pode interferir em remédios para a tireoide.'},
 {id:'gengibre',nome:'Gengibre',cientifico:'Zingiber officinale',elemento:'Fogo',planeta:'Marte',temas:['energia','ação','acelerar intenções'],usos:'Chá, adicionar a outros feitiços para dar força.',cuidado:'Cuidado em quem usa anticoagulantes.'},
 {id:'calendula',nome:'Calêndula',cientifico:'Calendula officinalis',elemento:'Fogo',planeta:'Sol',temas:['alegria','luz','proteção'],usos:'Banho de pétalas, altar solar.',cuidado:'Pode causar alergia em quem tem alergia a margaridas.'},
 {id:'jasmim',nome:'Jasmim',cientifico:'Jasminum spp.',elemento:'Água',planeta:'Lua',temas:['amor','sonhos','sensualidade'],usos:'Óleo, banho de flores, altar lunar.',cuidado:'Nem toda planta chamada "jasmim" é do gênero Jasminum; algumas (como o jasmim-amarelo) são tóxicas.'},
 {id:'eucalipto',nome:'Eucalipto',cientifico:'Eucalyptus globulus',elemento:'Água',planeta:'Lua',temas:['limpeza','renovação','respiração'],usos:'Ramo no chuveiro, defumação, banho de limpeza.',cuidado:'O óleo não deve ser ingerido nem usado no rosto de crianças pequenas.'},
 {id:'mirra',nome:'Mirra',cientifico:'Commiphora myrrha',elemento:'Água',planeta:'Lua',temas:['consagração','espiritualidade','luto e cura'],usos:'Resina queimada no carvão, consagrar objetos.',cuidado:'Queime em local ventilado.'},
 {id:'olibano',nome:'Olíbano',cientifico:'Boswellia sacra',elemento:'Fogo',planeta:'Sol',temas:['consagração','elevação','meditação'],usos:'Resina queimada no carvão, início de rituais.',cuidado:'Queime em local ventilado.'}
],

cristais:[
 {id:'quartzo',nome:'Quartzo transparente',cor:'Incolor',elemento:'Todos',temas:['amplificar intenções','clareza','limpeza'],cuidado:'Pode ir à água e ao sol.',curiosidade:'É o cristal mais comum da crosta terrestre.'},
 {id:'quartzo-rosa',nome:'Quartzo rosa',cor:'Rosa',elemento:'Água',temas:['amor-próprio','acolhimento','reconciliação'],cuidado:'Desbota no sol forte.',curiosidade:'O rosa vem de traços de minerais, como titânio e ferro.'},
 {id:'ametista',nome:'Ametista',cor:'Roxa',elemento:'Água',temas:['intuição','calma','espiritualidade'],cuidado:'Desbota no sol. Prefira a luz da lua.',curiosidade:'O nome vem do grego "amethystos", "não embriagado": era usada contra a embriaguez.'},
 {id:'citrino',nome:'Citrino',cor:'Amarela',elemento:'Fogo',temas:['prosperidade','alegria','autoconfiança'],cuidado:'O natural desbota no sol.',curiosidade:'Muito do "citrino" vendido é ametista aquecida, de laranja intenso. O natural é amarelo-claro.'},
 {id:'turmalina',nome:'Turmalina negra',cor:'Preta',elemento:'Terra',temas:['proteção','aterramento','absorver energias pesadas'],cuidado:'Pode ir à água rapidamente.',curiosidade:'Gera carga elétrica quando aquecida ou pressionada (efeito piezoelétrico).'},
 {id:'obsidiana',nome:'Obsidiana',cor:'Preta',elemento:'Fogo',temas:['proteção','autoconhecimento','encarar a sombra'],cuidado:'Lascas são cortantes.',curiosidade:'É vidro vulcânico, e não um cristal. Era usada para fazer espelhos e lâminas.'},
 {id:'selenita',nome:'Selenita',cor:'Branca',elemento:'Ar',temas:['limpeza','paz','limpar outros cristais'],cuidado:'Não molhe: ela se dissolve e perde o brilho.',curiosidade:'É uma forma de gipsita. O nome vem de Selene, a deusa grega da Lua.'},
 {id:'pedra-da-lua',nome:'Pedra-da-lua',cor:'Branca com brilho azulado',elemento:'Água',temas:['ciclos','intuição','feminino sagrado'],cuidado:'É macia: guarde separada para não riscar.',curiosidade:'O brilho que "flutua" na pedra se chama adularescência.'},
 {id:'cornalina',nome:'Cornalina',cor:'Laranja',elemento:'Fogo',temas:['coragem','criatividade','vitalidade'],cuidado:'Pode ir à água e ao sol.',curiosidade:'Era usada em anéis-sinete na Roma antiga porque a cera não gruda nela.'},
 {id:'olho-de-tigre',nome:'Olho-de-tigre',cor:'Dourada e marrom',elemento:'Fogo',temas:['foco','proteção','decisão'],cuidado:'Evite produtos químicos.',curiosidade:'O brilho em faixa se chama chatoyance, do francês "olho de gato".'},
 {id:'hematita',nome:'Hematita',cor:'Cinza metálica',elemento:'Terra',temas:['aterramento','firmeza','proteção'],cuidado:'Não molhe: ela oxida.',curiosidade:'É minério de ferro. Moída, solta um pó vermelho, cor de sangue, daí o nome (do grego "haima", sangue).'},
 {id:'lapis',nome:'Lápis-lazúli',cor:'Azul com pontos dourados',elemento:'Ar',temas:['sabedoria','verdade','comunicação'],cuidado:'Evite água e sol.',curiosidade:'Moído, virava o pigmento azul-ultramar, mais caro que ouro na pintura renascentista.'},
 {id:'jaspe',nome:'Jaspe vermelho',cor:'Vermelha',elemento:'Fogo',temas:['força','resistência','aterramento'],cuidado:'Pode ir à água.',curiosidade:'A cor vem do ferro.'},
 {id:'fume',nome:'Quartzo fumê',cor:'Marrom acinzentada',elemento:'Terra',temas:['aterramento','limpeza','soltar o que pesa'],cuidado:'Desbota no sol forte.',curiosidade:'A cor vem da radiação natural sobre o quartzo com traços de alumínio.'},
 {id:'labradorita',nome:'Labradorita',cor:'Cinza com reflexos coloridos',elemento:'Água',temas:['magia','intuição','proteção da aura'],cuidado:'Evite água por muito tempo.',curiosidade:'O jogo de cores se chama labradorescência. Foi descrita no Labrador, no Canadá.'},
 {id:'pirita',nome:'Pirita',cor:'Dourada metálica',elemento:'Fogo',temas:['prosperidade','ação','confiança'],cuidado:'Não molhe: ela oxida.',curiosidade:'Conhecida como "ouro de tolo". O nome vem do grego "pyr", fogo, porque solta faíscas ao ser batida.'},
 {id:'sodalita',nome:'Sodalita',cor:'Azul com veios brancos',elemento:'Ar',temas:['raciocínio','calma','expressão'],cuidado:'Evite água por muito tempo.',curiosidade:'Costuma ser confundida com o lápis-lazúli, mas não tem os pontos dourados.'},
 {id:'agua-marinha',nome:'Água-marinha',cor:'Azul-clara',elemento:'Água',temas:['tranquilidade','coragem para falar','fluidez'],cuidado:'Desbota no sol forte.',curiosidade:'O Brasil é um dos maiores produtores do mundo, sobretudo Minas Gerais.'}
],

// Sentido mágico das oito fases (o nome técnico fica no app; aqui os temas de trabalho)
lua:{
 'nova':{nome:'Lua Nova',temas:['inícios','plantar intenções','silêncio e recolhimento'],texto:'A Lua não aparece no céu. Tempo de olhar para dentro, escolher o que você quer começar e escrever suas intenções.'},
 'crescente':{nome:'Lua Crescente',temas:['atrair','dar os primeiros passos','coragem'],texto:'Um fio de luz aparece. Bom para feitiços de atração e para colocar em prática o que foi plantado na Lua Nova.'},
 'quarto-crescente':{nome:'Quarto Crescente',temas:['ação','persistência','superar obstáculos'],texto:'Metade da Lua iluminada. Momento de agir com firmeza e ajustar o caminho.'},
 'crescente-gibosa':{nome:'Crescente Gibosa',temas:['refinar','paciência','preparar'],texto:'Quase cheia. Hora de revisar, aperfeiçoar e preparar o que será celebrado na Lua Cheia.'},
 'cheia':{nome:'Lua Cheia',temas:['plenitude','celebração','gratidão','carregar objetos'],texto:'A Lua inteira iluminada. Tempo de potência, rituais de gratidão, esbás e de deixar cristais e água sob a luz da Lua.'},
 'minguante-gibosa':{nome:'Minguante Gibosa',temas:['partilhar','agradecer','compreender'],texto:'A luz começa a diminuir. Bom para refletir sobre o que se colheu e partilhar o que aprendeu.'},
 'quarto-minguante':{nome:'Quarto Minguante',temas:['soltar','limpar','encerrar ciclos'],texto:'Metade da Lua iluminada, agora diminuindo. Tempo de limpeza, banimento e de cortar o que não serve mais.'},
 'minguante':{nome:'Lua Minguante',temas:['descanso','cura','preparar o recomeço'],texto:'Também chamada de Lua Balsâmica. Um fio de luz antes da escuridão: descanse, cuide de você e prepare o próximo ciclo.'}
},

dias:[
 {dia:0,nome:'Domingo',planeta:'Sol',cores:['dourado','amarelo'],temas:['sucesso','vitalidade','autoestima']},
 {dia:1,nome:'Segunda-feira',planeta:'Lua',cores:['branco','prata'],temas:['intuição','sonhos','família e lar']},
 {dia:2,nome:'Terça-feira',planeta:'Marte',cores:['vermelho'],temas:['coragem','proteção','força de vontade']},
 {dia:3,nome:'Quarta-feira',planeta:'Mercúrio',cores:['laranja','amarelo'],temas:['comunicação','estudos','viagens e negócios']},
 {dia:4,nome:'Quinta-feira',planeta:'Júpiter',cores:['azul','roxo'],temas:['prosperidade','expansão','justiça']},
 {dia:5,nome:'Sexta-feira',planeta:'Vênus',cores:['rosa','verde'],temas:['amor','beleza','amizade e prazer']},
 {dia:6,nome:'Sábado',planeta:'Saturno',cores:['preto','roxo-escuro'],temas:['limites','banimento','disciplina e proteção']}
],

elementos:[
 {id:'terra',nome:'Terra',direcao:'Norte',temas:['corpo','prosperidade','estabilidade'],instrumentos:'Sal, pedras, pentáculo, terra.',signos:'Touro, Virgem, Capricórnio'},
 {id:'ar',nome:'Ar',direcao:'Leste',temas:['mente','comunicação','estudo'],instrumentos:'Incenso, penas, sino.',signos:'Gêmeos, Libra, Aquário'},
 {id:'fogo',nome:'Fogo',direcao:'Sul',temas:['vontade','transformação','paixão'],instrumentos:'Vela, carvão, athame.',signos:'Áries, Leão, Sagitário'},
 {id:'agua',nome:'Água',direcao:'Oeste',temas:['emoções','intuição','cura'],instrumentos:'Cálice, conchas, água.',signos:'Câncer, Escorpião, Peixes'}
],
notaElementos:'As direções seguem a tradição europeia. No hemisfério sul, muitas bruxas(os) trocam Fogo e Terra de lugar (Fogo ao Norte, de onde vem o sol do meio-dia), já que aqui o calor vem do norte.',

cores:[
 {nome:'Branco',hex:'#F7F3EC',temas:['pureza','paz','substitui qualquer cor']},
 {nome:'Preto',hex:'#1E1A1C',temas:['proteção','absorver','banimento']},
 {nome:'Vermelho',hex:'#A3262A',temas:['paixão','coragem','vitalidade']},
 {nome:'Rosa',hex:'#E9A3BD',temas:['amor-próprio','afeto','amizade']},
 {nome:'Laranja',hex:'#D9762B',temas:['criatividade','sucesso','alegria']},
 {nome:'Amarelo',hex:'#E8C547',temas:['mente','comunicação','estudos']},
 {nome:'Verde',hex:'#4E7D4F',temas:['prosperidade','cura','natureza']},
 {nome:'Azul',hex:'#3D6A9E',temas:['tranquilidade','verdade','proteção emocional']},
 {nome:'Roxo',hex:'#5E3A78',temas:['espiritualidade','intuição','sabedoria']},
 {nome:'Marrom',hex:'#6E4A33',temas:['aterramento','lar','animais']},
 {nome:'Prata',hex:'#BFC3C7',temas:['Lua','intuição','feminino']},
 {nome:'Dourado',hex:'#C9A23E',temas:['Sol','riqueza','conquista']}
],

sabas:{
 samhain:{nome:'Samhain',subtitulo:'Ano-novo das bruxas(os)',temas:['ancestrais','fim de ciclo','o véu entre os mundos'],texto:'Fim da colheita e início do ano mágico. Tempo de honrar quem veio antes de você, olhar para a morte como parte do ciclo e soltar o que terminou.'},
 yule:{nome:'Yule',subtitulo:'Solstício de inverno',temas:['renascimento da luz','esperança','recolhimento'],texto:'A noite mais longa do ano. A partir daqui, os dias voltam a crescer: celebra-se o retorno do sol com velas, sempre-vivas e esperança.'},
 imbolc:{nome:'Imbolc',subtitulo:'Despertar da terra',temas:['purificação','inspiração','novos projetos'],texto:'O inverno começa a ceder. Festa ligada à deusa Brigid: velas, limpeza da casa e intenções para o que vai brotar.'},
 ostara:{nome:'Ostara',subtitulo:'Equinócio de primavera',temas:['equilíbrio','fertilidade','renovação'],texto:'Dia e noite do mesmo tamanho. A vida desperta: sementes, ovos, flores e o equilíbrio entre luz e sombra.'},
 beltane:{nome:'Beltane',subtitulo:'Festa do fogo e das flores',temas:['união','prazer','vitalidade'],texto:'O auge da primavera. Celebra a fertilidade, o amor e a alegria de estar vivo(a), com fogueiras, flores e danças.'},
 litha:{nome:'Litha',subtitulo:'Solstício de verão',temas:['plenitude','força','abundância'],texto:'O dia mais longo do ano, o sol no seu auge. Tempo de celebrar a força, colher ervas e agradecer o que floresceu.'},
 lammas:{nome:'Lammas',subtitulo:'Lughnasadh, a primeira colheita',temas:['gratidão','colheita','partilha'],texto:'Festa dos grãos e do pão. Agradecer pelo que já foi colhido e partilhar a abundância.'},
 mabon:{nome:'Mabon',subtitulo:'Equinócio de outono',temas:['equilíbrio','gratidão','preparar o recolhimento'],texto:'De novo, dia e noite iguais. Segunda colheita: tempo de agradecer, fazer balanço e se preparar para os dias mais curtos.'}
}
};
