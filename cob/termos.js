// COB — Termos aceitos no cadastro (rascunhos validados pelo advogado em 10/10/2026)
// Preencha DADOS com as lacunas que estavam entre [colchetes]. Campo vazio aparece como [a preencher].
// Ao mudar qualquer texto, suba VERSAO: o cadastro grava qual versão cada membro aceitou.
(function(){
const VERSAO='2026-10-12-v2';
const DADOS={
  nomeCompleto:'Raquel de Oliveira Lopes',          // nome completo da Raquel
  cpf:'394.706.278-81',                   // CPF da mantenedora
  email:'raquellopesgalante@gmail.com',                 // e-mail de contato, dúvidas, denúncias e privacidade
  encarregada:'Raquel de Oliveira Lopes (raquellopesgalante@gmail.com)',           // nome e e-mail da encarregada de dados (pode ser a própria Raquel)
  comarca:'Campinas (SP)',               // foro eleito
  prazoTermo:'cinco anos',  // guarda do termo do responsável depois da saída
  site:'https://ogrimorioarcano.netlify.app/cob/',
  provedores:'Supabase (cadastro, login e banco de dados) e Netlify (hospedagem do site)'
};
const v=(k,rot)=>DADOS[k]?`<b>${DADOS[k]}</b>`:`<b class="lacuna">[${rot}]</b>`;
const nome=()=>DADOS.nomeCompleto?`<b>${DADOS.nomeCompleto}</b>`:`Raquel Lopes <b class="lacuna">[nome completo]</b>`;

const regras=()=>`
<p><b>Versão 1 · 10/10/2026</b></p>
<p>O Coven da Raquel é uma comunidade gratuita de estudos sobre bruxaria, história da magia e espiritualidade, organizada por ${nome()}, com aulas semanais ao vivo, uma biblioteca digital e grupos de conversa. Ao entrar em qualquer grupo ou aula, você concorda com estas regras.</p>
<h3>1. Quem pode participar</h3>
<p>1.1. Pessoas com <b>16 anos ou mais</b>. Quem tem 16 ou 17 anos só participa com o Termo de Ciência e Autorização assinado pelo responsável legal (Documento 4). 1.2. Quem informar idade falsa, ou se descobrir ter menos de 16 anos, é removido da comunidade, sem exceção. 1.3. A participação é gratuita. Nada na comunidade é vendido, cobrado ou condicionado a pagamento.</p>
<h3>2. O que a comunidade é, e o que não é</h3>
<p>2.1. As aulas e os materiais têm finalidade <b>educativa, cultural e religiosa</b>, no exercício da liberdade de crença garantida pela Constituição (art. 5º, VI). 2.2. Nada do que é ensinado substitui atendimento médico, psicológico ou psiquiátrico. A comunidade não diagnostica, não trata e não promete cura, resultado ou proteção. Em sofrimento emocional, procure um profissional de saúde; em crise, o CVV atende pelo 188, 24 horas, de graça. 2.3. <b>Nenhum preparo é ingerido.</b> Ervas, incensos, velas e cristais são estudados como cultura e símbolo. A comunidade não receita, não indica dose e não recomenda chá, tintura, banho ou qualquer uso em pessoa doente, gestante ou criança. 2.4. Umbanda, Candomblé e outras religiões de matriz africana, indígena ou iniciática são tratadas com respeito e estudadas apenas "sobre", com a participação de praticantes; a comunidade não ensina a praticá-las.</p>
<h3>3. O que não se ensina nem se pratica na comunidade</h3>
<p>3.1. Qualquer prática envolvendo ingestão de substâncias, jejum, privação de sono, lesão ou risco físico. 3.2. Uso de fogo por menores de 18 anos sem a presença de um adulto responsável. 3.3. Trabalhos, rituais ou "amarrações" dirigidos a terceiros, ou qualquer prática sem o consentimento da pessoa envolvida. 3.4. Contato com entidades, invocações e visitas a cemitérios ou matas como atividade da comunidade. 3.5. Orientação individual em assuntos de saúde, jurídicos ou financeiros.</p>
<h3>4. Convívio e proteção</h3>
<p>4.1. Respeito é condição de permanência. São motivo de remoção imediata: assédio, intimidação, bullying e cyberbullying (Lei 14.811/2024), discurso de ódio, racismo, intolerância religiosa (Lei 7.716/1989) e qualquer conteúdo sexual envolvendo menores (ECA, arts. 240 e 241), com comunicação às autoridades. 4.2. <b>Toda interação entre adultos e menores de 18 anos acontece nos grupos e nas aulas, nunca em conversa privada.</b> Moderadores não chamam menores no privado, e menores não devem aceitar chamados privados de adultos da comunidade; se acontecer, avise a moderação. 4.3. As aulas têm ao menos dois adultos moderadores presentes. 4.4. É proibido divulgar dados, prints, áudios ou vídeos de outros membros fora da comunidade. 4.5. Os grupos de feira e de trocas são restritos a maiores de 18 anos. A comunidade não intermedeia, não garante e não responde por negociações entre membros. 4.6. É proibido oferecer serviços pagos, "trabalhos", consultas ou produtos a menores de 18 anos dentro da comunidade.</p>
<h3>5. Aulas e gravações</h3>
<p>5.1. As aulas são gravadas e ficam disponíveis apenas na Biblioteca do Coven, para membros. Elas não são publicadas em redes sociais. 5.2. Ligar a câmera e o microfone é opcional. Quem não quiser aparecer participa pelo chat. 5.3. Ao participar de uma aula gravada, o membro (e, para menores, o responsável) autoriza o uso da sua imagem e voz exclusivamente na gravação da aula, dentro da biblioteca, pelo prazo em que o material estiver disponível à comunidade. 5.4. É proibido gravar, copiar ou redistribuir as aulas e os materiais fora da comunidade.</p>
<h3>6. Materiais e direitos autorais</h3>
<p>6.1. A biblioteca contém apenas obras em domínio público, materiais com licença aberta e materiais produzidos pela própria comunidade. Não é permitido compartilhar nos grupos cópias de livros, cursos ou qualquer conteúdo protegido por direito autoral.</p>
<h3>7. Moderação e saída</h3>
<p>7.1. A moderação pode advertir, silenciar ou remover membros que descumpram estas regras, e pode recusar a entrada de qualquer pessoa. 7.2. Qualquer membro pode sair a qualquer momento. Ao sair, os seus dados são apagados conforme a Política de Privacidade. 7.3. Dúvidas e denúncias: ${v('email','e-mail de contato')} ou mensagem a qualquer moderador.</p>`;

const termosUso=()=>`
<p><b>Versão 1 · 10/10/2026</b></p>
<p><b>1. O que é.</b> A Biblioteca do Coven (<b>${DADOS.site}</b>) é um aplicativo gratuito, mantido por ${nome()}${DADOS.cpf?`, CPF <b>${DADOS.cpf}</b>`:` <b class="lacuna">[CPF]</b>`}, que reúne textos, apostilas e gravações das aulas da comunidade O Coven da Raquel. O acesso é restrito a membros cadastrados.</p>
<p><b>2. Cadastro.</b> O cadastro pede nome completo, CPF, e-mail, WhatsApp e data de nascimento. O acesso é feito por link enviado ao e-mail, sem senha. Só podem se cadastrar pessoas com 16 anos ou mais; para 16 e 17 anos, o cadastro depende do Termo de Ciência e Autorização do responsável. Informar dados falsos leva ao cancelamento.</p>
<p><b>3. Finalidade.</b> O conteúdo tem finalidade educativa, cultural e religiosa. Ele não substitui orientação médica, psicológica, jurídica ou de qualquer outro profissional, e não promete resultado, cura, proteção ou benefício de nenhuma natureza. As práticas descritas são apresentadas como história, cultura e símbolo; nenhuma indica a ingestão de qualquer substância.</p>
<p><b>4. O que a biblioteca contém.</b> (a) Obras em domínio público, nos termos da Lei 9.610/1998, com indicação da fonte; (b) obras com licença que permita a distribuição, com a licença indicada; (c) materiais produzidos pela comunidade: apostilas, fichas, resumos e gravações das aulas; (d) fichas de livros em catálogo, com resumo e link para compra, <b>sem</b> o arquivo da obra. A mantenedora remove qualquer material a pedido fundamentado de titular de direitos, pelo e-mail ${v('email','e-mail de contato')}.</p>
<p><b>5. O que o membro pode e não pode fazer.</b> O membro pode ler, assistir e baixar os materiais para uso pessoal e de estudo. Não pode redistribuir, publicar ou vender os materiais da comunidade, nem as gravações das aulas, nem compartilhar o seu acesso.</p>
<p><b>6. Conteúdo enviado por membros.</b> Se a biblioteca passar a aceitar envios (resumos, fichas, registros), o membro garante que o conteúdo é de sua autoria ou está em domínio público, e autoriza o uso dentro da comunidade, sem exclusividade e sem remuneração.</p>
<p><b>7. Disponibilidade.</b> O serviço é gratuito e oferecido como está, sem garantia de disponibilidade contínua. A mantenedora pode alterar, suspender ou encerrar a biblioteca a qualquer tempo, avisando os membros com antecedência razoável.</p>
<p><b>8. Privacidade.</b> O tratamento de dados segue a Política de Privacidade (Documento 3), que faz parte destes termos.</p>
<p><b>9. Regras da comunidade.</b> As Regras da comunidade (Documento 1) valem também dentro da biblioteca.</p>
<p><b>10. Foro e lei.</b> Aplica-se a lei brasileira. Fica eleito o foro de ${v('comarca','comarca')}, salvo as regras de competência que protegem o consumidor e o menor.</p>
<p><b>Aceite.</b> Ao marcar "li e concordo" no cadastro, o membro declara ter lido e aceito estes termos, as Regras da comunidade e a Política de Privacidade.</p>`;

const privacidade=()=>`
<p><b>Versão 1 · 10/10/2026 · Lei 13.709/2018 (LGPD)</b></p>
<p><b>1. Quem trata os seus dados.</b> ${nome()}${DADOS.cpf?`, CPF <b>${DADOS.cpf}</b>`:` <b class="lacuna">[CPF]</b>`}, ${v('email','e-mail de contato')}, controladora, responsável pela comunidade O Coven da Raquel e pela Biblioteca do Coven. Contato para assuntos de privacidade (encarregada): ${v('encarregada','nome e e-mail')}.</p>
<p><b>2. Quais dados são coletados.</b></p>
<ul>
<li>No cadastro da biblioteca: nome completo, CPF, e-mail, WhatsApp e data de nascimento.</li>
<li>Para membros de 16 e 17 anos: nome, CPF e contato do responsável, e o termo aceito por ele.</li>
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
  {id:'regras',titulo:'Regras da comunidade',html:regras},
  {id:'uso',titulo:'Termos de uso da Biblioteca',html:termosUso},
  {id:'privacidade',titulo:'Política de privacidade',html:privacidade},
  {id:'responsavel',titulo:'Termo do responsável (16 e 17 anos)',html:responsavel}
]};
})();
