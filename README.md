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
| **Roadmap** | Linha do tempo em meses. Cada barra vai do início à entrega, a parte preenchida é o progresso real das etapas e a linha rosa marca hoje. |
| **Ajustes** | Exportar/importar backup `.json`, recarregar os fluxos iniciais, apagar tudo, e controlar o fundo elétrico. |

## Biblioteca de modelos

14 checklists, 83 blocos, 509 etapas — a maioria com **nota técnica** explicando o número, a faixa ou o motivo.

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

### Hardware & Compras
- **Orçamento de hardware com carga tributária** · 52 etapas — especificação, cotação com CNPJ, regime tributário e créditos, DIFAL, ST, importação, TCO, comparativo
- **Especificação e montagem do servidor** · 41 etapas — dimensionamento por carga medida, ECC, RAID, nobreak, teste de estresse, restauração de backup

### Registros
- **Relatório de atividades do período** · 28 etapas — coleta, transformação de atividade em resultado, redação, revisão, arquivo
- **Registro de reunião** · 26 etapas — preparo, captura, ata estruturada, cobrança dos encaminhamentos

## Estrutura de um fluxo

- título, descrição, cor, status (ideia / planejado / em andamento / pausado / concluído) e prioridade;
- datas de início e entrega — é o que coloca o fluxo no roadmap;
- tags livres;
- **etapas** agrupadas em blocos, cada uma com checkbox e nota opcional.

Na aba **Etapas** do fluxo: progresso geral e por bloco, recolher bloco, marcar bloco inteiro, reordenar, editar nota e **desmarcar tudo** para rodar o checklist de novo no próximo ciclo.

### Atalhos

| Tecla | Ação |
| --- | --- |
| `N` | Novo fluxo |
| `/` | Focar a busca |
| `Esc` | Fechar a janela aberta |

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
    Roadmap.jsx              linha do tempo
    Settings.jsx             dados e preferências
    ui.jsx                   modal, barra, chips, estado vazio, stat
    icons.jsx                ícones em SVG inline
  lib/
    constants.js             status, prioridades, paleta
    utils.js                 datas, progresso, agrupamento, roadmap
    storage.js               localStorage, normalização, import/export
    templates.js             conteúdo dos 14 modelos
  styles/global.css          design system completo
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
