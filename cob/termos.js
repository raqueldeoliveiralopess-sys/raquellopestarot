// COB — Termos aceitos no cadastro (rascunhos validados pelo advogado em 10/10/2026)
// 24/11/2026: o Documento 1 passou a ser os Preceitos Oficiais do Coven Strix 2.0 (texto da Raquel, na íntegra) + Regras complementares.
// Os ajustes desta data nos Documentos 1 (regras complementares), 2 e 3 (idade mínima de 18, assinatura, ervas, nome) ainda não passaram pelo advogado.
// Preencha DADOS com as lacunas que estavam entre [colchetes]. Campo vazio aparece como [a preencher].
// Ao mudar qualquer texto, suba VERSAO: o cadastro grava qual versão cada membro aceitou.
(function(){
const VERSAO='2026-11-24-v3';
const DADOS={
  nomeCompleto:'Raquel de Oliveira Lopes',          // nome completo da Raquel
  cpf:'394.706.278-81',                   // CPF da mantenedora
  email:'raquellopesgalante@gmail.com',                 // e-mail de contato, dúvidas, denúncias e privacidade
  encarregada:'Raquel de Oliveira Lopes (raquellopesgalante@gmail.com)',           // nome e e-mail da encarregada de dados (pode ser a própria Raquel)
  comarca:'Campinas (SP)',               // foro eleito
  prazoTermo:'cinco anos',  // guarda do termo do responsável depois da saída
  site:'https://covenstrixcob.netlify.app/cob/',
  provedores:'Supabase (cadastro, login e banco de dados) e Netlify (hospedagem do site)'
};
const v=(k,rot)=>DADOS[k]?`<b>${DADOS[k]}</b>`:`<b class="lacuna">[${rot}]</b>`;
const nome=()=>DADOS.nomeCompleto?`<b>${DADOS.nomeCompleto}</b>`:`Raquel Lopes <b class="lacuna">[nome completo]</b>`;

const regras=()=>`
<p><b>Preceitos Oficiais · Versão 2.0 · 23/11/2026</b><br><b>Regras complementares · Versão 2 · 24/11/2026</b></p>
<p><b>COVEN STRIX 2.0 · REGIMENTO DE CONVIVÊNCIA</b><br>Conhecimento · Respeito · Disciplina · Compromisso</p>
<p>O Coven Strix é uma comunidade independente, fundada e dirigida por Raquel Lopes Strix, dedicada ao estudo da bruxaria, das artes ocultas, dos oráculos e das tradições esotéricas, em suas dimensões históricas, filosóficas e espirituais. Não exige vinculação religiosa nem culto obrigatório. A participação pressupõe respeito, discrição, responsabilidade e observância das regras abaixo.</p>
<p><b>Acesso e assinatura.</b> A comunidade é exclusiva para <b>maiores de 18 anos</b>, com assinatura mensal ativa de R$ 20,00. A entrada na nova comunidade ocorre pelo link disponibilizado na área de membros. A administração poderá adotar procedimentos seguros de verificação de maioridade, com respeito à privacidade.</p>
<h3>I. Do respeito ao sagrado</h3>
<p>Toda religião, tradição espiritual, divindade e entidade deve ser tratada com respeito e dignidade. Intolerância religiosa, ridicularização, discriminação ou alegações de superioridade espiritual são incompatíveis com o Coven.</p>
<p>A liberdade individual de crença permanece assegurada, inclusive a quem siga caminhos que não integram o programa de estudos da comunidade.</p>
<h3>II. Da Fundadora, do Conselho e da hierarquia</h3>
<p>A Fundadora dirige o Coven e define suas diretrizes organizacionais e pedagógicas, com apoio do Conselho. A moderação aplica as regras e cuida dos espaços comunitários.</p>
<p>As funções hierárquicas representam deveres de coordenação e confiança; não autorizam constrangimento, abuso, desrespeito ou pretensão de superioridade espiritual.</p>
<h3>III. Do compromisso com o conhecimento</h3>
<p>O estudo deve ser conduzido com seriedade, discernimento e responsabilidade. Valorize fontes históricas, referências verificáveis e pensamento crítico; diferencie fatos documentados, crenças e experiências pessoais.</p>
<p>Por decisão pedagógica do Coven, Magia do Caos e Thelema não integram as aulas, os grupos ou as práticas. É vedado compartilhar, recomendar, solicitar ou ensinar materiais e instruções dessas vertentes nos espaços da comunidade. Essa delimitação não representa hostilidade às pessoas que as praticam.</p>
<h3>IV. Do sigilo e da privacidade</h3>
<p>Preserve a privacidade dos integrantes e das conversas. Não divulgue prints, áudios, imagens, dados pessoais, relatos individuais ou materiais internos sem a devida autorização.</p>
<p>O compromisso com o sigilo não deve ser utilizado para encobrir ameaças, abusos ou condutas ilegais.</p>
<h3>V. Da organização dos espaços</h3>
<p>A comunidade mantém apenas três grupos de participação: Sala do Coven, destinada à convivência e à integração; Covil de Estudos, destinado a dúvidas, debates, referências e solicitações de materiais; e Práticas de Tiragens, destinado a exercícios, interpretações e desenvolvimento oracular.</p>
<p>O espaço de Avisos é reservado aos comunicados oficiais. O Conselho do Coven permanece restrito à administração, sem funcionar como grupo aberto de participação.</p>
<p>Pedidos de livros e PDFs devem ocorrer exclusivamente no Covil de Estudos. A disponibilização de materiais depende da administração e do respeito aos direitos autorais. Não publique arquivos por conta própria fora dos canais autorizados.</p>
<h3>VI. Da proibição de divulgações</h3>
<p>Não é permitida publicidade ou divulgação comercial em nenhum grupo do Coven. A vedação abrange autopromoção, venda ou oferta de produtos e serviços, consultas, cursos, links de afiliados, cupons comerciais, pedidos de clientes e convites para grupos ou comunidades externas.</p>
<p>Não haverá Feira Livre, Grupo de Trocas ou qualquer outro espaço de publicidade na nova estrutura. Referências de estudo podem ser partilhadas quando pertinentes ao tema e sem finalidade promocional, conforme as orientações da administração.</p>
<h3>VII. Da conduta entre integrantes</h3>
<p>Divergências devem ser conduzidas com civilidade. São proibidos assédio, humilhação, intimidação, ameaças, ataques pessoais, manipulação, spam, exposição indevida e insistência em contatos privados ou propostas que não tenham sido solicitados.</p>
<p>Ninguém deve ser pressionado a relatar experiências, realizar práticas espirituais ou aderir a crenças contrárias à própria consciência.</p>
<h3>VIII. Da disciplina e da responsabilidade coletiva</h3>
<p>Leia os comunicados, respeite os horários, as orientações da moderação e a finalidade de cada ambiente. Assuma apenas os compromissos que puder cumprir e preserve um ambiente favorável ao aprendizado.</p>
<p>Colaboração, auxílio a iniciantes, compartilhamento responsável de conhecimento e postura ética são atitudes valorizadas, mas não concedem privilégios acima dos preceitos.</p>
<h3>IX. Da ética nas práticas espirituais</h3>
<p>Toda orientação ou prática compartilhada deve respeitar autonomia, consentimento, integridade e segurança das pessoas envolvidas.</p>
<p>É proibido pedir, divulgar, oferecer ou ensinar práticas destinadas a coagir, humilhar, prejudicar ou interferir no livre-arbítrio de terceiros, incluindo amarrações amorosas, rituais de coerção, afastamento de rival ou trabalhos voltados a causar dano a alguém.</p>
<h3>X. Da permanência e das medidas disciplinares</h3>
<p>A moderação poderá remover conteúdos em desacordo com as regras. Na primeira infração, aplica-se advertência formal; a reincidência implica remoção da comunidade. Diante de risco grave a pessoas ou à segurança do grupo, a administração poderá adotar medidas protetivas imediatas.</p>
<p>A permanência depende de maioridade, assinatura ativa e cumprimento dos presentes preceitos. A adesão à comunidade significa ciência das regras e compromisso com sua observância.</p>
<p><i>O conhecimento exige humildade. A convivência exige respeito. A responsabilidade exige conduta.</i><br><b>Coven Strix · Raquel Lopes Strix</b>, Fundadora e Alta Sacerdotisa.</p>
<h3>Regras complementares: aulas, materiais e aplicativo</h3>
<p>Estas regras completam os Preceitos Oficiais e valem para as aulas, os materiais e o aplicativo do Coven Strix, mantidos por ${nome()}. Em caso de dúvida ou de conflito, prevalecem os Preceitos.</p>
<p><b>1. Finalidade.</b> As aulas e os materiais têm finalidade educativa, cultural e religiosa, no exercício da liberdade de crença garantida pela Constituição (art. 5º, VI). O Coven não promete resultado, cura nem proteção.</p>
<p><b>2. Saúde.</b> Nada do que é ensinado substitui atendimento médico, psicológico ou psiquiátrico. O Coven não diagnostica, não trata doenças e não dá orientação individual em assuntos de saúde, jurídicos ou financeiros. Em sofrimento emocional, procure um profissional de saúde; em crise, o CVV atende pelo 188, 24 horas, de graça.</p>
<p><b>3. Ervas.</b> As ervas fazem parte do estudo e da prática do Coven: em banhos, chás, defumações, sachês e no altar. Toda indicação vem acompanhada do modo de preparo e dos cuidados, e não substitui tratamento de saúde. Use ervas de procedência conhecida. Gestantes, lactantes, pessoas em uso de medicação contínua ou com alergias devem conversar com um profissional de saúde antes de usar. Não se indicam preparos para crianças nem para animais.</p>
<p><b>4. Práticas seguras.</b> Não se ensinam nem se propõem práticas com substâncias tóxicas ou ilícitas, jejum, privação de sono, lesão ou risco físico. Vela acesa nunca fica sozinha, e todo ritual dos materiais tem uma versão sem fogo.</p>
<p><b>5. Aulas e gravações.</b> As aulas gravadas ficam disponíveis apenas para integrantes, no aplicativo, e não são publicadas em redes sociais. Nos encontros ao vivo, ligar a câmera e o microfone é opcional. Quando um encontro for gravado, quem participa autoriza o uso da sua imagem e da sua voz somente nessa gravação, dentro do aplicativo, enquanto o material estiver disponível à comunidade. É proibido gravar, copiar ou redistribuir aulas e materiais fora do Coven.</p>
<p><b>6. Materiais e direitos autorais.</b> Os materiais do Coven são para uso pessoal e de estudo. A disponibilização de livros e PDFs depende da administração e do respeito aos direitos autorais, e integrantes não publicam arquivos por conta própria. A administração remove qualquer material a pedido fundamentado do titular dos direitos.</p>
<p><b>7. Aplicativo e assinatura.</b> O acesso ao aplicativo (Coven e Grimório Arcano) é pessoal e intransferível, e é liberado pela administração depois da confirmação da assinatura. Sem assinatura ativa, o acesso fica pausado e volta quando a assinatura é retomada. Não compartilhe o seu login.</p>
<p><b>8. Proteção.</b> Condutas que também são crime, como ameaça, assédio, racismo, intolerância religiosa (Lei 7.716/1989) e intimidação sistemática (Lei 14.811/2024), podem ser comunicadas às autoridades.</p>
<p><b>9. Dados pessoais.</b> O tratamento dos dados dos integrantes segue a Política de Privacidade (Documento 3), conforme a Lei 13.709/2018 (LGPD).</p>
<p><b>10. Saída e contato.</b> Qualquer integrante pode sair a qualquer momento. Dúvidas, denúncias e pedidos sobre dados: ${v('email','e-mail de contato')} ou mensagem à moderação.</p>`;

const termosUso=()=>`
<p><b>Versão 1.1 · 24/11/2026</b></p>
<p><b>1. O que é.</b> A Biblioteca do Coven (<b>${DADOS.site}</b>) é o aplicativo da comunidade Coven Strix, mantido por ${nome()}${DADOS.cpf?`, CPF <b>${DADOS.cpf}</b>`:` <b class="lacuna">[CPF]</b>`}, que reúne textos, apostilas e gravações das aulas da comunidade. O acesso é restrito a integrantes cadastrados, maiores de 18 anos, com a assinatura do Coven ativa.</p>
<p><b>2. Cadastro.</b> O cadastro pede nome completo, CPF, e-mail, WhatsApp e data de nascimento. O acesso é feito por link enviado ao e-mail, sem senha. Só podem se cadastrar maiores de 18 anos. Informar dados falsos leva ao cancelamento.</p>
<p><b>3. Finalidade.</b> O conteúdo tem finalidade educativa, cultural e religiosa. Ele não substitui orientação médica, psicológica, jurídica ou de qualquer outro profissional, e não promete resultado, cura, proteção ou benefício de nenhuma natureza. As indicações de ervas seguem as Regras complementares (Documento 1, item 3) e não substituem tratamento de saúde.</p>
<p><b>4. O que a biblioteca contém.</b> (a) Obras em domínio público, nos termos da Lei 9.610/1998, com indicação da fonte; (b) obras com licença que permita a distribuição, com a licença indicada; (c) materiais produzidos pela comunidade: apostilas, fichas, resumos e gravações das aulas; (d) fichas de livros em catálogo, com resumo e link para compra, <b>sem</b> o arquivo da obra. A mantenedora remove qualquer material a pedido fundamentado de titular de direitos, pelo e-mail ${v('email','e-mail de contato')}.</p>
<p><b>5. O que o membro pode e não pode fazer.</b> O membro pode ler, assistir e baixar os materiais para uso pessoal e de estudo. Não pode redistribuir, publicar ou vender os materiais da comunidade, nem as gravações das aulas, nem compartilhar o seu acesso.</p>
<p><b>6. Conteúdo enviado por membros.</b> Se a biblioteca passar a aceitar envios (resumos, fichas, registros), o membro garante que o conteúdo é de sua autoria ou está em domínio público, e autoriza o uso dentro da comunidade, sem exclusividade e sem remuneração.</p>
<p><b>7. Disponibilidade.</b> O serviço é oferecido como está, sem garantia de disponibilidade contínua. A mantenedora pode alterar, suspender ou encerrar a biblioteca a qualquer tempo, avisando os membros com antecedência razoável.</p>
<p><b>8. Privacidade.</b> O tratamento de dados segue a Política de Privacidade (Documento 3), que faz parte destes termos.</p>
<p><b>9. Preceitos e regras.</b> Os Preceitos Oficiais e as Regras complementares (Documento 1) valem também dentro da biblioteca.</p>
<p><b>10. Foro e lei.</b> Aplica-se a lei brasileira. Fica eleito o foro de ${v('comarca','comarca')}, salvo as regras de competência que protegem o consumidor e o menor.</p>
<p><b>Aceite.</b> Ao marcar "li e concordo" no cadastro, o membro declara ter lido e aceito estes termos, os Preceitos Oficiais, as Regras complementares e a Política de Privacidade.</p>`;

const privacidade=()=>`
<p><b>Versão 1.1 · 24/11/2026 · Lei 13.709/2018 (LGPD)</b></p>
<p><b>1. Quem trata os seus dados.</b> ${nome()}${DADOS.cpf?`, CPF <b>${DADOS.cpf}</b>`:` <b class="lacuna">[CPF]</b>`}, ${v('email','e-mail de contato')}, controladora, responsável pela comunidade Coven Strix e pela Biblioteca do Coven. Contato para assuntos de privacidade (encarregada): ${v('encarregada','nome e e-mail')}.</p>
<p><b>2. Quais dados são coletados.</b></p>
<ul>
<li>No cadastro da biblioteca: nome completo, CPF, e-mail, WhatsApp e data de nascimento.</li>
<li>Para quem se cadastrou com 16 ou 17 anos até 24/11/2026 (desde então a comunidade é exclusiva para maiores de 18): nome, CPF e contato do responsável, e o termo aceito por ele.</li>
<li>Nos grupos de WhatsApp: o número de telefone e o nome de perfil que o próprio WhatsApp exibe aos participantes.</li>
<li>Nas aulas gravadas: imagem e voz de quem optar por ligar câmera ou microfone, e as mensagens do chat.</li>
<li>Registros técnicos de acesso à biblioteca (data, hora, endereço IP), pelo prazo mínimo que a lei exige (Marco Civil da Internet, art. 15: seis meses). Não são coletados dados de pagamento, documentos, localização nem dados sensíveis, <b>exceto</b> que a participação numa comunidade de estudos sobre espiritualidade pode revelar convicção religiosa, que a lei considera dado sensível: por isso os dados nunca são compartilhados nem usados para outro fim.</li>
</ul>
<p><b>3. Para que os dados são usados, e com que base legal.</b></p>
<ul>
<li>Enviar o link de acesso e manter o cadastro: execução do serviço pedido pelo membro (art. 7º, V) e, para o dado de convicção religiosa implícito, consentimento específico (art. 11, I).</li>
<li>CPF e WhatsApp: identificar cada membro com segurança, evitar cadastros duplicados ou falsos e apurar responsabilidades em caso de vazamento ou uso indevido dos materiais e das gravações da comunidade: legítimo interesse e exercício regular de direitos (art. 7º, VI e IX).</li>
<li>Verificar a idade mínima e guardar o termo do responsável: cumprimento de obrigação e proteção do adolescente (art. 7º, II; art. 14).</li>
<li>Gravar as aulas e disponibilizá-las aos membros: consentimento de quem aparece (art. 7º, I; art. 11, I), que pode ser evitado mantendo câmera e microfone desligados.</li>
<li>Registros de acesso: obrigação legal (art. 7º, II). Os dados de adolescentes são tratados sempre no seu melhor interesse (art. 14), com o mínimo necessário, e nunca para publicidade, perfilamento ou venda.</li>
</ul>
<p><b>4. Com quem os dados são compartilhados.</b> Com ninguém, para fins próprios. Os dados ficam em provedores de tecnologia contratados para hospedar a biblioteca e enviar e-mails (<b>${DADOS.provedores}</b>), que atuam como operadores e não os usam para outro fim. As aulas acontecem no Google Meet e os grupos no WhatsApp, que têm as suas próprias políticas. Os dados não são vendidos nem usados pela loja ou pelos links de afiliados da mantenedora.</p>
<p><b>5. Por quanto tempo.</b> Enquanto a pessoa for membro. Ao sair, ou a pedido, o cadastro é apagado em até 30 dias; os registros técnicos ficam pelo prazo legal; o termo do responsável fica guardado por ${v('prazoTermo','prazo')} depois da saída, para comprovar o cumprimento da regra de idade. Gravações de aula em que a pessoa aparece podem ser mantidas na biblioteca; a pessoa pode pedir que o seu trecho seja cortado.</p>
<p><b>6. Seus direitos.</b> Confirmar que tratamos os seus dados, acessá-los, corrigi-los, pedir a exclusão, revogar o consentimento e pedir informações sobre o compartilhamento (art. 18). Basta escrever para ${v('email','e-mail')}; a resposta vem em até 15 dias. O responsável por um membro de 16 ou 17 anos pode exercer os direitos em nome dele.</p>
<p><b>7. Segurança.</b> Acesso por link de uso único enviado ao e-mail, dados guardados em provedores com criptografia, e acesso administrativo restrito à controladora. Nenhum sistema é infalível; incidentes relevantes são comunicados aos afetados e à ANPD, como manda a lei.</p>
<p><b>8. Mudanças.</b> Esta política pode mudar; a versão vigente fica na biblioteca, com a data, e mudanças relevantes são avisadas no grupo.</p>`;

const responsavel=()=>`
<p><b>Desde 24/11/2026 o Coven Strix é exclusivo para maiores de 18 anos e não recebe novos cadastros de menores.</b> Este termo fica aqui como registro para quem se cadastrou com 16 ou 17 anos antes dessa data, no texto que foi aceito na época.</p>
<p><b>Versão 1 · 10/10/2026 · preenchido pelo formulário de cadastro, com data, hora e IP registrados</b></p>
<p>O responsável legal, identificado no formulário (nome completo, CPF, telefone, e-mail e parentesco), declara, em relação ao adolescente cadastrado:</p>
<ol>
<li><b>Estou ciente</b> de que meu(minha) filho(a)/tutelado(a) vai participar da comunidade gratuita de estudos "O Coven da Raquel", organizada por ${nome()}, que inclui aulas semanais ao vivo pelo Google Meet, grupos de conversa no WhatsApp e uma biblioteca digital, sobre história da magia, bruxaria e espiritualidade.</li>
<li><b>Li as Regras da comunidade</b>, os Termos de uso e a Política de privacidade, e entendi que: a participação é gratuita; o conteúdo é educativo, cultural e religioso; nada substitui atendimento de saúde; nenhum preparo é ingerido; não há práticas com fogo sem adulto presente, nem trabalhos dirigidos a terceiros, nem contato com entidades, nem visitas a cemitérios ou matas como atividade da comunidade; e toda interação entre adultos e menores acontece nos grupos e nas aulas, nunca em privado.</li>
<li><b>Autorizo</b> a participação nas aulas e nos grupos de estudo (não nos grupos de feira e de trocas, restritos a maiores de 18 anos).</li>
<li><b>Autorizo</b> o tratamento dos dados do adolescente (nome, CPF, e-mail, WhatsApp, data de nascimento) e dos meus dados neste termo, nos termos da Política de privacidade, para o fim exclusivo de participação na comunidade.</li>
<li><b>Quanto à imagem e voz:</b> autorizo, ou não autorizo, que o adolescente ligue câmera e microfone nas aulas gravadas, disponíveis apenas aos membros, na biblioteca (escolha feita no formulário; sem autorização, ele participa com câmera e microfone desligados, pelo chat).</li>
<li><b>Sei que posso revogar</b> esta autorização a qualquer momento, pelo e-mail ${v('email','e-mail de contato')}, e que a comunidade removerá o adolescente e apagará os dados conforme a Política de privacidade.</li>
<li><b>Comprometo-me</b> a acompanhar a participação e a procurar a moderação se notar qualquer situação inadequada.</li>
</ol>
<p>Ao marcar a declaração no formulário, o responsável declara que é o(a) responsável legal e que as informações são verdadeiras.</p>`;

window.COB_TERMOS={VERSAO,DADOS,docs:[
  {id:'regras',titulo:'Preceitos Oficiais e Regras da comunidade',html:regras},
  {id:'uso',titulo:'Termos de uso da Biblioteca',html:termosUso},
  {id:'privacidade',titulo:'Política de privacidade',html:privacidade},
  {id:'responsavel',titulo:'Termo do responsável (cadastros de 16 e 17 anos até 24/11/2026)',html:responsavel}
]};
})();
