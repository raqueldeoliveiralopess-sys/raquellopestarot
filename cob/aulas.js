// COB — aulas do curso
//
// Clube do Livro: as aulas são cadastradas pela admin no próprio app (aba Aulas), e ficam no Supabase
// (tabelas cob_clube_livros e cob_clube_aulas, seção 8 do supabase/cob.sql). Não é preciso mexer neste arquivo
// para publicar uma aula nova.
//
// "clube" abaixo é só a reserva da Aula 01, para a turma já assistir enquanto o SQL da seção 8 não foi rodado.
// Depois do SQL, o app usa só o que está no Supabase (que começa com estes mesmos dados).
//
// "modulos" é o formato antigo, de aulas fixas: um módulo só aparece na aba Aulas se tiver aula com vídeo.
window.AULAS={
  curso:'Curso Online de Bruxaria',
  clube:{
    livros:[
      {id:1,titulo:'História da Bruxaria',autores:'Jeffrey B. Russell e Brooks Alexander',descricao:null,livro_id:null,capa:null,ordem:1}
    ],
    aulas:[
      {id:1,livro:1,numero:1,titulo:'Mentiram sobre as bruxas? | Quem construiu a imagem da bruxa?',
        descricao:'Nesta primeira aula do Clube do Livro, investigamos como a imagem da bruxa foi construída ao longo dos séculos.\n\nEstudamos as origens da feitiçaria, as práticas mágicas das civilizações antigas, a influência do paganismo e do folclore europeu, as interpretações de Margaret Murray e os primeiros vínculos entre feitiçaria, heresia e demonologia.\n\nA proposta é compreender a diferença entre aquilo que as pessoas praticavam, aquilo em que acreditavam e aquilo de que eram acusadas.',
        youtube:'QXVc1ZMeJYU',publicar_em:'2026-10-31T15:00:00Z',paginas:'Até a página 79 do PDF',pagina_ini:null,livro_id:null,
        atividade:'Como você definia a palavra bruxa antes desta aula?\nQual é a diferença entre feitiçaria e bruxaria histórica?\nPor que determinadas tensões sociais aumentavam as acusações de bruxaria?\nQual é a principal crítica histórica à teoria de Margaret Murray?\nPor que uma acusação histórica não comprova que o acontecimento descrito realmente ocorreu?',
        proxima:'Continuação do Capítulo 3, a partir da página 80 do PDF.',capa:null,status:'publicada'}
    ]
  },
  modulos:[
    {id:'m1',titulo:'Módulo 1 · Raízes',descricao:'De onde vem a bruxaria, o que é história e o que é lenda.',aulas:[
      {id:'a1',titulo:'Mitos e Verdades da História da Bruxaria',duracao:'',video:'',materiais:[],
        resumo:'O que realmente aconteceu nas caças às bruxas, quem eram as pessoas acusadas e como nasceu a bruxaria moderna. Uma aula para separar a história das lendas que se repetem até hoje.'}
    ]}
  ]
};
