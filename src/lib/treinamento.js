/**
 * Protocolo de Treinamento — Estagiário de TI (Thep).
 *
 * Oito blocos progressivos em quatro fases. Sem prazo fixo: cada bloco leva o
 * tempo que precisar, e só se avança ao cumprir o critério de conclusão.
 */

export const PERFIL = [
  { rotulo: 'Perfil', valor: 'Iniciante total, foco em trabalho manual e operacional' },
  { rotulo: 'Escopo', valor: 'Thep Edu · parque de 100+ computadores · Linux Mint, Lux Bellatrix (Lenovo) e Windows' },
  { rotulo: 'Supervisão', valor: 'Parcial — a trilha prioriza autonomia e documentação de consulta' },
  { rotulo: 'Ritmo', valor: 'Sem prazo fixo. Só avança quem cumpre os critérios do bloco' },
]

export const REGRAS = [
  {
    titulo: 'Nunca avançar sem cumprir os critérios do bloco',
    texto: 'O ritmo é do estagiário — a qualidade não é negociável.',
  },
  {
    titulo: 'Tudo que ele aprender vira registro',
    texto:
      'A cada bloco ele documenta o que fez. Isso cria o manual de consulta dele e vira o material do próximo estagiário.',
  },
  {
    titulo: 'Regra de ouro da supervisão parcial',
    texto:
      'Antes de perguntar, tenta 15 minutos sozinho consultando a documentação. Se não resolver, anota a dúvida com contexto, pergunta — e depois registra a resposta.',
  },
  {
    titulo: 'Checkpoint de bloco',
    texto:
      'Ao concluir cada bloco, reunião de 15 a 30 minutos com o supervisor para revisar as metas e liberar (ou não) o próximo.',
  },
]

export const FASES = [
  {
    id: 'fase-1',
    nome: 'Fase 1 — Thep Edu',
    cor: '#22e6ff',
    blocos: [
      {
        id: 'b1',
        numero: 1,
        titulo: 'Integração e imersão no Thep Edu',
        objetivo: 'Conhecer a Thep, criar os acessos e aprender a navegar no Thep Edu por completo.',
        atividades: [
          'Apresentação da empresa, do setor de TI e da rotina de trabalho',
          'Criação de acessos: e-mail, Thep Edu e sistema de chamados, se houver',
          'Navegação completa no Thep Edu como operador: módulos, perfis de usuário, fluxos principais',
          'Entender a estrutura de cadastros — alunos, turmas, professores, conteúdos — e o impacto de um dado errado',
          'Regra crítica: como funciona backup e reversão antes de alterar qualquer cadastro',
          'Acompanhar o supervisor fazendo correções reais, apenas observando e anotando',
        ],
        metas: [
          { id: 'b1-m1', texto: 'Acessos funcionando' },
          { id: 'b1-m2', texto: 'Mapa mental ou resumo dos módulos do Thep Edu, feito por ele' },
          { id: 'b1-m3', texto: 'Documento próprio de anotações criado e iniciado' },
        ],
        criterio:
          'Consegue explicar, sem consultar, o que cada módulo do Thep Edu faz e qual é o fluxo de uma correção segura: backup → alteração → verificação.',
      },
      {
        id: 'b2',
        numero: 2,
        titulo: 'Correção de cadastros e dados',
        objetivo: 'Começar as correções reais, das de menor risco para as de maior impacto.',
        atividades: [
          'Corrigir cadastros reais de baixo risco, com revisão do supervisor antes de salvar; depois, revisão por amostragem',
          'Criar um log de correções: o que corrigiu, quando e por quê',
          'Aprender a identificar padrões de erro nos dados — o que aparece com mais frequência e por quê',
        ],
        metas: [
          { id: 'b2-m1', texto: '20+ correções de cadastro realizadas e registradas' },
          { id: 'b2-m2', texto: 'Zero correções revertidas por erro dele na reta final do bloco' },
          { id: 'b2-m3', texto: 'Log de correções em uso' },
        ],
        criterio: 'Taxa de erro próxima de zero nas correções verificadas por amostragem.',
      },
      {
        id: 'b3',
        numero: 3,
        titulo: 'Chamados, testes e conteúdo pedagógico',
        objetivo: 'Operar o fluxo completo de chamados e a validação do sistema.',
        atividades: [
          'Fluxo de chamados: como chegam, classificar (bug, dúvida, cadastro, conteúdo), priorizar, responder e encerrar',
          'Atender chamados reais com supervisão decrescente ao longo do bloco',
          'Testes e validação: receber uma funcionalidade e testar seguindo roteiro — criar o roteiro-padrão junto com o supervisor, se não existir',
          'Correção de conteúdo pedagógico: padrão da Thep, o que corrige direto e o que passa pela equipe pedagógica',
          'Como reportar um bug bem reportado: passos para reproduzir, print, comportamento esperado versus obtido',
        ],
        metas: [
          { id: 'b3-m1', texto: '10+ chamados atendidos e encerrados corretamente' },
          { id: 'b3-m2', texto: '5+ itens de conteúdo corrigidos dentro do padrão' },
          { id: 'b3-m3', texto: '1 relatório de teste e validação completo entregue' },
        ],
        criterio: 'Atende um chamado do início ao fim sozinho, com classificação, resolução e registro corretos.',
        aviso:
          'A partir daqui o Thep Edu vira rotina: mesmo nos blocos de bancada, ele reserva um período do dia para chamados e correções, mantendo a prática.',
      },
    ],
  },
  {
    id: 'fase-2',
    nome: 'Fase 2 — Organização física',
    cor: '#ffb547',
    blocos: [
      {
        id: 'b4',
        numero: 4,
        titulo: 'Inventário, limpeza, cabeamento e estoque',
        objetivo: 'Dominar a parte manual: organização, limpeza e infraestrutura física do parque.',
        atividades: [
          'Tour físico completo: máquinas, estoque, pendrives de instalação e arquivos de configuração de cada SO',
          'Noções de segurança: eletricidade estática, manuseio de equipamentos, o que nunca fazer sem autorização',
          'Iniciar a planilha de inventário: padrão de etiquetagem e catalogação (modelo, patrimônio, SO, estado)',
          'Limpeza física: abrir gabinete e notebook com segurança, ar comprimido, contatos, cuidados com cooler e placa-mãe',
          'Cabeamento: identificar tipos de cabo, organizar com velcro e abraçadeiras, padrão de identificação',
          'Organização do estoque: separar por categoria — funcionais, para reparo, para descarte, peças — e etiquetar',
        ],
        metas: [
          { id: 'b4-m1', texto: '~40 máquinas inventariadas e etiquetadas' },
          { id: 'b4-m2', texto: '5+ máquinas limpas e revisadas fisicamente' },
          { id: 'b4-m3', texto: 'Uma bancada ou setor de estoque totalmente organizado e etiquetado' },
        ],
        criterio:
          'O supervisor sorteia um item do estoque e ele localiza em menos de 2 minutos. Limpeza aprovada em vistoria.',
      },
    ],
  },
  {
    id: 'fase-3',
    nome: 'Fase 3 — Sistemas operacionais',
    cor: '#7c5cff',
    blocos: [
      {
        id: 'b5',
        numero: 5,
        titulo: 'Fundamentos de hardware + Linux Mint',
        objetivo: 'Entender o que há dentro da máquina e fazer a primeira formatação completa.',
        atividades: [
          'Hardware na prática: identificar RAM, HD/SSD, fonte e placa-mãe; trocar um pente de RAM e um disco em máquina de teste',
          'Conceitos essenciais: BIOS/UEFI, ordem de boot, o que é formatar, o que é partição',
          'Boot pelo pendrive da Thep: acessar a BIOS nas máquinas mais comuns do parque',
          'Instalação do Linux Mint pelo pendrive da Thep',
          'Setup pós-instalação seguindo o checklist oficial do Anexo A, do começo ao fim',
          'Primeira instalação acompanhada; repetir sozinho pelo menos 2 vezes, cronometrando',
        ],
        metas: [
          { id: 'b5-m1', texto: '1 instalação do Mint acompanhada + 2 sozinho, com setup completo do Anexo A' },
          { id: 'b5-m2', texto: 'Troca de RAM e disco realizada com sucesso' },
          { id: 'b5-m3', texto: 'Anexo A seguido e anotado, com dúvidas e melhorias sugeridas' },
        ],
        criterio:
          'Instala e configura o Mint do zero, sozinho, consultando apenas o Anexo A, e a máquina passa na validação final do checklist.',
        anexo: 'setup-pcs',
      },
      {
        id: 'b6',
        numero: 6,
        titulo: 'Linux Lux Bellatrix (Lenovo)',
        objetivo: 'Dominar o setup do Bellatrix nas máquinas Lenovo, incluindo as particularidades do fabricante.',
        atividades: [
          'Particularidades da Lenovo: teclas de BIOS e boot (F1, F12, botão Novo) e as configurações usadas pela Thep',
          'Instalação do Lux Bellatrix pelo pendrive da Thep',
          'Setup pós-instalação seguindo o mesmo checklist oficial do Anexo A',
          'Comparar com o Mint: o que muda e o que é igual — é o que fixa o aprendizado',
          'Repetir sozinho 2 a 3 vezes, em máquinas diferentes',
          'Manutenção básica em Linux: atualizações, verificar disco e memória, resolver os problemas mais comuns do parque',
        ],
        metas: [
          { id: 'b6-m1', texto: '3+ instalações completas do Bellatrix, com setup do Anexo A' },
          { id: 'b6-m2', texto: 'Lista dos problemas mais comuns de Linux no parque, com a solução de cada um' },
          { id: 'b6-m3', texto: 'Anexo B seguido e anotado' },
        ],
        criterio: 'Entrega uma máquina Lenovo pronta para uso, validada pelo supervisor, sem intervenção.',
        anexo: 'setup-pcs',
      },
      {
        id: 'b7',
        numero: 7,
        titulo: 'Windows',
        objetivo: 'Instalar e configurar Windows no padrão Thep, para os casos em que for necessário.',
        atividades: [
          'Instalação do Windows com o pendrive da Thep e os arquivos de configuração',
          'Pontos críticos: ativação e licença conforme a política da Thep, drivers (especialmente nas Lenovo) e Windows Update',
          'Instalação do conjunto padrão de programas da Thep',
          'Primeira instalação acompanhada; repetir sozinho 2 vezes',
          'Manutenção básica: desinstalar programas, gerenciador de tarefas, verificação de disco, pontos de restauração',
          'Definir com o supervisor quando usar Windows e quando usar Linux, com o critério documentado',
        ],
        metas: [
          { id: 'b7-m1', texto: '3 instalações completas do Windows: 1 guiada + 2 sozinho' },
          { id: 'b7-m2', texto: 'Checklist pessoal do Windows escrito por ele, base para o Anexo C' },
          { id: 'b7-m3', texto: 'Documento "quando usar cada SO" escrito e validado' },
        ],
        criterio:
          'Dado um chamado fictício — "prepare esta máquina para o setor X" — escolhe o SO certo e entrega a máquina pronta.',
      },
    ],
  },
  {
    id: 'fase-4',
    nome: 'Fase 4 — Autonomia',
    cor: '#5dff9b',
    blocos: [
      {
        id: 'b8',
        numero: 8,
        titulo: 'Rotina integrada e avaliação final',
        objetivo: 'Operar a rotina real completa, alternando entre as frentes, e consolidar a documentação.',
        atividades: [
          'Regime real: parte do dia no Thep Edu (chamados e correções), parte na bancada (máquinas e organização)',
          'Avançar o inventário do parque, ou definir o plano para concluir os 100+',
          'Consolidar todas as anotações em um manual único de procedimentos — o material oficial do próximo estagiário',
        ],
        prova: [
          'Resolver 3 chamados reais do Thep Edu: cadastro, conteúdo e bug/teste',
          'Formatar uma máquina Lenovo com Bellatrix do zero, com setup completo do Anexo A',
          'Formatar uma máquina com Windows do zero',
          'Localizar 3 itens no estoque e explicar o padrão de organização',
        ],
        metas: [
          { id: 'b8-m1', texto: 'Manual de procedimentos entregue' },
          { id: 'b8-m2', texto: 'Avaliação prática concluída com aprovação do supervisor' },
          { id: 'b8-m3', texto: 'Plano de inventário dos 100+ definido ou em andamento' },
        ],
        criterio: 'Aprovação na avaliação final. A partir daí, o estagiário é considerado operacional.',
      },
    ],
  },
]

export const POS_TRILHA = [
  'Metas mensais: máquinas revisadas ou formatadas, tempo médio de resposta de chamados, inventário atualizado',
  'Reunião quinzenal de acompanhamento com o supervisor',
  'Manual vivo: todo procedimento novo ou problema inédito resolvido entra no manual',
]

export const INDICADORES = [
  { nome: 'Autonomia', medida: 'Nº de dúvidas escaladas por bloco', alvo: 'deve cair' },
  { nome: 'Qualidade', medida: 'Correções e instalações refeitas por erro', alvo: 'deve tender a zero' },
  { nome: 'Produtividade', medida: 'Máquinas entregues e chamados encerrados por bloco', alvo: 'deve subir' },
  { nome: 'Documentação', medida: 'Checklists e manual atualizados a cada bloco', alvo: 'a cada bloco' },
]

export const ANEXOS = [
  {
    id: 'a',
    nome: 'Anexo A — Setup de notebook Linux (padrão Thep)',
    estado: 'pronto',
    texto:
      'Vale para Linux Mint e Lux Bellatrix. Cobre atualização, senha de root, criação dos usuários, Chrome, bloqueador de sites, AnyDesk com acesso não supervisionado e validação final.',
    pagina: 'setup-pcs',
  },
  {
    id: 'b',
    nome: 'Anexo B — Instalação do Lux Bellatrix / Lenovo',
    estado: 'pendente',
    texto:
      'Falta incorporar: acesso à BIOS Lenovo (F1, F12, botão Novo), passo a passo da instalação pelo pendrive e aplicação dos arquivos de configuração. O setup pós-instalação já é coberto pelo Anexo A.',
  },
  {
    id: 'c',
    nome: 'Anexo C — Instalação e configuração do Windows',
    estado: 'opcional',
    texto:
      'Pode ser construído pelo próprio estagiário no Bloco 7, validado pelo supervisor e incorporado aqui depois.',
  },
]

export const TOTAL_METAS = FASES.reduce(
  (n, f) => n + f.blocos.reduce((m, b) => m + b.metas.length, 0),
  0
)

export const TOTAL_BLOCOS = FASES.reduce((n, f) => n + f.blocos.length, 0)
