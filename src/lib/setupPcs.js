/**
 * Checklist de setup de notebook Linux — padrão Thep.
 *
 * Os comandos usam marcadores substituídos em tempo de renderização:
 *   {PC}     número da máquina no inventário
 *   {SENHA}  senha padrão definida pela TI
 *   {ROOT}   senha atual do root, antes da troca
 *
 * Nenhuma credencial fica no código: os valores vivem só no navegador de
 * quem usa a página. O repositório e o deploy são públicos.
 */

export const SETUP_VERSAO = 'Linux Mint e Linux Lux Bellatrix (Lenovo)'

export const BLOCOS = [
  {
    id: 'atualizar',
    titulo: 'Atualizar o sistema',
    resumo: 'Deixa a máquina em dia antes de qualquer instalação.',
    itens: [
      {
        id: 'apt-upgrade',
        texto: 'Rodar a atualização no terminal',
        code: 'sudo apt update -y\nsudo apt upgrade -y',
        nota: 'Se aparecer alguma tela de confirmação, aceitar e aguardar. Não desligue o notebook durante o upgrade — interromper aqui costuma deixar pacote quebrado.',
      },
    ],
  },
  {
    id: 'root',
    titulo: 'Trocar a senha do root',
    resumo: 'A máquina chega com a senha de fábrica. Trocar é o primeiro passo de segurança.',
    itens: [
      { id: 'su', texto: 'Entrar como root', code: 'su -', nota: 'Use a senha atual de fábrica, informada no topo da página.' },
      { id: 'passwd', texto: 'Trocar a senha', code: 'passwd', nota: 'Digitar a senha padrão duas vezes. O terminal não mostra nada enquanto você digita — é normal.' },
      { id: 'exit', texto: 'Sair do root', code: 'exit' },
    ],
  },
  {
    id: 'usuarios',
    titulo: 'Criar os usuários',
    resumo: 'Dois usuários: um de manutenção com sudo, um de uso diário sem sudo.',
    itens: [
      { id: 'adm-criar', texto: 'Criar o usuário de administração', code: 'sudo adduser thep-adm' },
      { id: 'adm-sudo', texto: 'Dar permissão de administrador a ele', code: 'sudo usermod -aG sudo thep-adm' },
      {
        id: 'user-criar',
        texto: 'Criar o usuário de uso diário',
        code: 'sudo adduser thep-not-{PC}',
        nota: 'Sempre em letras minúsculas.',
      },
      {
        id: 'user-sem-sudo',
        texto: 'Conferir que o usuário diário NÃO tem sudo',
        code: 'groups thep-not-{PC}',
        nota: 'A palavra "sudo" não pode aparecer na lista. Se aparecer, o usuário foi criado errado e a máquina não pode ser entregue assim.',
      },
      {
        id: 'hostname',
        texto: 'Definir o nome da máquina igual ao usuário',
        code: 'sudo hostnamectl set-hostname THEP-NOT-{PC}',
        nota: 'Facilita identificar a máquina no acesso remoto e no inventário.',
      },
    ],
  },
  {
    id: 'chrome',
    titulo: 'Instalar o Google Chrome',
    resumo: 'A página inicial é configurada depois, pelo script — não precisa mexer manualmente.',
    itens: [
      {
        id: 'chrome-install',
        texto: 'Baixar e instalar',
        code: 'wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb\nsudo apt install ./google-chrome-stable_current_amd64.deb -y',
      },
      { id: 'chrome-abrir', texto: 'Abrir o Chrome uma vez para confirmar que funciona' },
    ],
  },
  {
    id: 'bloqueio',
    titulo: 'Instalar o bloqueador de sites',
    resumo:
      'Bloqueia jogos, YouTube, Netflix e apostas no sistema inteiro, fixa a página inicial em edu.thep.com.br e trava o DNS do navegador.',
    script: true,
    itens: [
      { id: 'copiar', texto: 'Copiar o bloquear-sites.sh para a pasta pessoal da máquina', nota: 'Pelo botão de download aqui em cima, por pendrive ou pelo Nexus Drive.' },
      { id: 'chmod', texto: 'Dar permissão de execução', code: 'chmod +x bloquear-sites.sh' },
      { id: 'executar', texto: 'Executar o bloqueio', code: 'sudo ./bloquear-sites.sh' },
      { id: 'mensagem', texto: 'Conferir a mensagem "Bloqueio aplicado!" no terminal' },
      {
        id: 'reabrir',
        texto: 'Fechar TODAS as janelas do Chrome e abrir de novo',
        nota: 'O Chrome mantém cache de DNS próprio. Sem reabrir, sites bloqueados ainda carregam e você conclui errado que o script falhou.',
      },
    ],
  },
  {
    id: 'anydesk',
    titulo: 'Instalar o AnyDesk',
    resumo: 'Acesso remoto da TI.',
    itens: [
      {
        id: 'anydesk-install',
        texto: 'Adicionar o repositório e instalar',
        code:
          'wget -qO- https://keys.anydesk.com/repos/DEB-GPG-KEY | sudo gpg --dearmor -o /usr/share/keyrings/anydesk.gpg\n' +
          'echo "deb [signed-by=/usr/share/keyrings/anydesk.gpg] http://deb.anydesk.com/ all main" | sudo tee /etc/apt/sources.list.d/anydesk.list\n' +
          'sudo apt update\n' +
          'sudo apt install anydesk -y',
      },
      {
        id: 'anydesk-id',
        texto: 'Abrir o AnyDesk e anotar o ID de 9 dígitos',
        campo: 'anydeskId',
        nota: 'Anote também na planilha de inventário, junto com o número do PC.',
      },
    ],
  },
  {
    id: 'remoto',
    titulo: 'Acesso remoto não supervisionado',
    resumo: 'Permite a TI acessar a máquina com senha, sem ninguém precisar aceitar do outro lado.',
    itens: [
      {
        id: 'senha-remota',
        texto: 'Definir a senha de acesso não supervisionado',
        code: 'echo "{SENHA}" | sudo anydesk --set-password',
        nota: 'Pela interface: AnyDesk → Configurações → Segurança → marcar "Permitir acesso não supervisionado" → definir a senha.',
      },
      {
        id: 'testar-remoto',
        texto: 'Testar de outra máquina: conectar pelo ID com a senha, sem aceite manual',
      },
    ],
  },
  {
    id: 'validacao',
    titulo: 'Validação final',
    resumo: 'Nenhuma máquina sai sem passar por aqui.',
    itens: [
      { id: 'v-update', texto: 'Sistema atualizado, sem pacotes pendentes', code: 'sudo apt update' },
      { id: 'v-login', texto: 'Login funciona nos dois usuários com a senha padrão' },
      { id: 'v-sudo', texto: 'O usuário thep-not-{PC} NÃO consegue usar sudo' },
      { id: 'v-home', texto: 'Chrome abre direto em edu.thep.com.br' },
      {
        id: 'v-bloqueio',
        texto: 'Testar 2–3 sites bloqueados — nenhum pode abrir',
        nota: 'Sugestão: youtube.com, poki.com e bet365.com. Teste no usuário diário, não no de administração.',
      },
      { id: 'v-anydesk', texto: 'AnyDesk conecta remotamente com a senha, sem aceite manual' },
      { id: 'v-inventario', texto: 'ID do AnyDesk, número do PC e hostname anotados no inventário' },
      { id: 'v-etiqueta', texto: 'Etiqueta física THEP-NOT-{PC} colada no notebook' },
    ],
  },
]

export const TOTAL_ITENS = BLOCOS.reduce((n, b) => n + b.itens.length, 0)

/** Troca os marcadores pelos valores da máquina em edição. */
export function preencher(texto, { pc, senha, root }) {
  if (!texto) return texto
  return texto
    .replaceAll('{PC}', pc || 'xxxx')
    .replaceAll('{SENHA}', senha || '<senha-padrão>')
    .replaceAll('{ROOT}', root || '<senha-de-fábrica>')
}
