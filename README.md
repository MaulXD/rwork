# ⚡ RWork

Site em React para salvar **fluxos de trabalho**, rodar **checklists detalhados** e montar **roadmaps**, com fundo elétrico animado e layout responsivo.

Tudo fica no `localStorage` do navegador — sem servidor, sem login, sem enviar dado para lugar nenhum.

**Deploy:** Vercel (build estático, `vercel.json` incluído).

## Rodando

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # gera dist/
npm run preview  # serve o build de produção
```

## Telas

| Tela | Para que serve |
| --- | --- |
| **Painel** | Fluxos salvos, em andamento, etapas concluídas, atrasados. Foco atual, distribuição por status, próximos prazos e atividade recente. |
| **Fluxos** | Todos os seus fluxos, com busca (título, descrição, etapa ou tag), filtro por status e tag, e ordenação por recentes / prazo / progresso / prioridade / A–Z. |
| **Modelos** | Biblioteca de checklists prontos. "Usar modelo" cria uma cópia editável nos seus fluxos. |
| **Roadmap** | Duas partes: a **ordem de ataque** com os fluxos sem prazo, agrupados por prioridade, e a **linha do tempo** dos que já receberam datas. Nenhum fluxo nasce com prazo — as datas são definidas ali, quando você quiser. |
| **Setup de PCs** | Checklist de preparação de notebook Linux no padrão Thep, com progresso por máquina, comandos prontos para copiar, download do `bloquear-sites.sh` e cadastro na planilha de inventário. |
| **Treinamento TI** | Protocolo de treinamento do estagiário de TI: 7 blocos em 4 fases, com metas marcáveis, critérios de conclusão e checkpoints. |
| **Ajustes** | Exportar/importar backup `.json`, recarregar os fluxos iniciais, apagar tudo, e controlar o fundo elétrico. |

## Biblioteca de modelos

15 checklists, 85 blocos, 519 etapas — a maioria com **nota técnica** explicando o número, a faixa ou o motivo.

### Impressão 3D — Orca Slicer + PLA
- **Pré-impressão — do modelo à primeira camada** · 42 etapas — geometria, filamento, máquina, fatiamento, revisão do G-code, primeira camada
- **Calibração de filamento PLA no Orca Slicer** · 43 etapas — temperature tower, flow rate em duas passadas, pressure advance, retração, vazão máxima, validação dimensional
- **Durante e depois da impressão** · 27 etapas — monitoramento, remoção, inspeção, pós-processamento, registro
- **Diagnóstico de defeitos em PLA** · 46 etapas — um bloco por sintoma: aderência, stringing, warping, extrusão, layer shift, ghosting, elephant foot, entupimento
- **Manutenção preventiva** · 18 etapas — por frequência: a cada impressão, semanal, 100 h, trimestral

### RTOOLS
- **Criar uma ferramenta nova** · 46 etapas — escopo, escolha de biblioteca, Web Worker, estados e erros, testes com arquivo grande, deploy na Vercel
- **Revisão antes de publicar** · 14 etapas — checklist de release da suíte inteira

### Educacross — do lado de quem contrata
- **Avaliar a plataforma antes de contratar** · 42 etapas — definir a necessidade, acesso de teste real, teste com professores, referências de outras redes, LGPD, portabilidade dos dados
- **TR e ETP da contratação** · 44 etapas — traz o caso em andamento: solicitação ao HEAD e ao CEO já feita, retida até a reunião de 27–28
- **Negociação e fechamento do contrato** · 40 etapas — poder de negociação, preço discriminado, revisão de cláusulas, formalização, gestão do contrato

### Revisão de Itens
- **Revisão de itens e aulas em vídeo** · 10 etapas — dois blocos: itens normais (leitura, compatibilidade, habilidade, qualidade de imagem, resolução comentada) e aulas em vídeo

### Hardware & Compras
- **Orçamento de hardware com carga tributária** · 52 etapas — especificação, cotação com CNPJ, regime tributário e créditos, DIFAL, ST, importação, TCO, comparativo
- **Especificação e montagem do servidor** · 41 etapas — dimensionamento por carga medida, ECC, RAID, nobreak, teste de estresse, restauração de backup

### Registros
- **Relatório de atividades do período** · 28 etapas — coleta, transformação de atividade em resultado, redação, revisão, arquivo
- **Registro de reunião** · 26 etapas — preparo, captura, ata estruturada, cobrança dos encaminhamentos

## Estrutura de um fluxo

- título, descrição, cor, status (ideia / planejado / em andamento / pausado / concluído) e prioridade;
- datas de início e entrega, **em branco por padrão** — preenchê-las é o que move o fluxo da ordem de ataque para a linha do tempo;
- tags livres;
- **etapas** agrupadas em blocos, cada uma com checkbox e nota opcional.

Na aba **Etapas** do fluxo: progresso geral e por bloco, recolher bloco, marcar bloco inteiro, reordenar, editar nota e **desmarcar tudo** para rodar o checklist de novo no próximo ciclo.

### Atalhos

| Tecla | Ação |
| --- | --- |
| `N` | Novo fluxo |
| `/` | Focar a busca |
| `Esc` | Fechar a janela aberta |

## Páginas da Thep

### Setup de PCs

O checklist de preparação de notebook Linux (Mint e Lux Bellatrix), em 8 blocos e 28 itens.

- **Progresso por máquina**: cada notebook tem o seu checklist; o número do PC entra sozinho nos comandos (`sudo adduser thep-not-0042`, `THEP-NOT-0042`).
- **Comandos prontos** em bloco de código com botão de copiar.
- **Download do `bloquear-sites.sh`** direto da página, no passo em que ele é usado.
- Campos de ID do AnyDesk, quem validou e data de entrega.

#### Planilha de inventário

A página conversa com a [planilha de inventário](https://docs.google.com/spreadsheets/d/14F4f4FTx5tM54QxXz6kAKVYEQiRx6qCUBDb0TNRba2g/edit?gid=0#gid=0) — colunas `PC | anydesk | Modelo | Data`.

- **Leitura direta:** a planilha é pública e o endpoint CSV devolve `Access-Control-Allow-Origin`, então a página lê as 482 máquinas no navegador. Dá para buscar por número, ID do AnyDesk ou modelo, e copiar um ID com um clique.
- **Aviso de duplicidade:** ao abrir uma máquina cujo número já existe na planilha, a página mostra o AnyDesk e o modelo já cadastrados.
- **Escrita:** o Google não aceita gravação anônima. Quem grava é um Apps Script publicado como aplicativo web pela conta dona da planilha — o código e o passo a passo estão dentro da própria página, em *configurar envio*. Com a URL colada, o botão grava direto (e atualiza a linha se o PC já existir, em vez de duplicar).
- **Sem o Apps Script**, o botão **copiar linha** entrega o registro em TSV, pronto para colar na planilha.

As senhas ficam nos arquivos de dados e são editáveis na página, com a alteração salva no navegador. O `checklist-setup-linux-thep.md` original segue no `.gitignore` por ser o documento de trabalho.

### Treinamento TI

O protocolo de formação do estagiário de TI: 4 fases, 7 blocos, 21 metas marcáveis.

Cada bloco traz objetivo, atividades, metas com checkbox, critério de conclusão e um selo de *checkpoint* para o supervisor liberar o próximo. Os blocos de Linux remetem ao Anexo A, que é a própria página de Setup de PCs.

## Centelhas

Espalhadas pelo site há **32 curiosidades sobre filósofos**, com três gatilhos:

| Gatilho | Como |
| --- | --- |
| Palavra secreta | Digite `sofia` fora de qualquer campo de texto |
| Código Konami | ↑ ↑ ↓ ↓ ← → ← → B A — dispara junto uma tempestade elétrica de 9 s no fundo |
| Marca | Sete cliques seguidos no raio da barra lateral |

Cada centelha encontrada fica registrada, e o modal mostra o placar da coleção. O que é **tradição antiga sem fonte contemporânea** vem marcado como tal — anedota boa não vira fato só porque é boa.

Há também uma dica no console do navegador.

## O fundo elétrico

[`src/components/ElectricBackground.jsx`](src/components/ElectricBackground.jsx) desenha em um único `<canvas>`:

- malha de nós à deriva que se conectam por proximidade;
- pulsos de energia percorrendo essas conexões;
- fagulhas subindo pela tela;
- relâmpagos gerados por deslocamento do ponto médio.

Por cima, camadas em CSS: aurora em gradiente, grade, linhas de varredura e vinheta.

Pausa quando a aba sai de foco, respeita `prefers-reduced-motion` e pode ser desligado ou ter a intensidade regulada em **Ajustes**.

## Estrutura do código

```
src/
  App.jsx                    estado, persistência, navegação e atalhos
  components/
    ElectricBackground.jsx   canvas do fundo elétrico
    Sidebar.jsx              navegação lateral / menu no celular
    Dashboard.jsx            painel
    Workflows.jsx            lista + filtros
    WorkflowCard.jsx         card de fluxo
    WorkflowEditor.jsx       abas Etapas e Detalhes, blocos, notas, reset
    Templates.jsx            biblioteca de modelos + prévia
    EasterEggs.jsx           centelhas: gatilhos e coleção
    SetupPcs.jsx             setup de PCs, progresso por máquina
    Treinamento.jsx          protocolo de treinamento
    Roadmap.jsx              linha do tempo
    Settings.jsx             dados e preferências
    ui.jsx                   modal, barra, chips, estado vazio, stat
    icons.jsx                ícones em SVG inline
  lib/
    constants.js             status, prioridades, paleta
    utils.js                 datas, progresso, agrupamento, roadmap
    storage.js               localStorage, normalização, import/export
    philosophers.js          as 32 centelhas
    setupPcs.js              checklist de setup de notebook
    treinamento.js           protocolo de treinamento de TI
    templates.js             conteúdo dos 15 modelos
  styles/global.css          design system completo
public/
  bloquear-sites.sh          script servido para download
```

Dependências: apenas `react` e `react-dom`. Ícones, gráficos e a linha do tempo do roadmap são feitos à mão.

## Deploy na Vercel

O repositório já traz `vercel.json` com framework `vite`, saída em `dist/`, rewrite de SPA e cache longo para os assets.

1. Importe o repositório em [vercel.com/new](https://vercel.com/new);
2. A Vercel detecta Vite sozinha — não é preciso configurar nada;
3. Cada push na `main` publica em produção; cada PR ganha um preview próprio.

## Backup

Os dados vivem **neste navegador, neste computador**. Limpar os "dados de sites" apaga os fluxos.
Em **Ajustes → Exportar backup** você baixa um `rwork-AAAA-MM-DD.json` que pode ser importado em qualquer outro navegador.
