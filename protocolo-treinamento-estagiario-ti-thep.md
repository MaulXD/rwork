# Protocolo de Treinamento — Estagiário de TI (Thep)

**Perfil:** iniciante total, foco em trabalho manual/operacional
**Escopo:** Thep Edu | parque de 100+ computadores | Linux Mint, Linux Lux Bellatrix (Lenovo) e Windows
**Supervisão:** parcial (dúvidas pontuais) — a trilha prioriza autonomia e documentação de consulta
**Estrutura:** 8 blocos progressivos, sem prazo fixo — cada bloco leva o tempo que precisar; só se avança ao cumprir os critérios de conclusão
**Ordem da trilha:** Thep Edu (blocos 1–3) → organização física (bloco 4) → sistemas operacionais (blocos 5–7) → autonomia (bloco 8)

---

## Regras gerais da trilha

1. **Nunca avançar sem cumprir os critérios do bloco.** O ritmo é do estagiário — mas a qualidade não é negociável.
2. **Tudo que ele aprender deve virar registro.** A cada bloco, ele documenta o que fez (caderno digital, planilha ou doc compartilhado). Isso cria o manual de consulta dele e serve de material para os próximos estagiários.
3. **Regra de ouro da supervisão parcial:** antes de perguntar, ele tenta 15 minutos sozinho consultando a documentação. Se não resolver, anota a dúvida com contexto e pergunta. Depois, registra a resposta.
4. **Checkpoint de bloco:** ao concluir cada bloco, reunião curta (15–30 min) com o supervisor para revisar as metas e liberar (ou não) o próximo.

---

# FASE 1 — THEP EDU (Blocos 1 a 3)

## Bloco 1 — Integração e imersão no Thep Edu

**Objetivo:** conhecer a Thep, criar os acessos e aprender a navegar no Thep Edu por completo.

**Atividades:**
- Apresentação da empresa, do setor de TI e da rotina de trabalho
- Criação de acessos (e-mail, Thep Edu, sistema de chamados se houver)
- Navegação completa no Thep Edu como operador: módulos, perfis de usuário, fluxos principais
- Entender a estrutura de cadastros: alunos, turmas, professores, conteúdos — o que cada campo significa e o impacto de um dado errado
- **Regra crítica: como funciona backup/reversão antes de alterar qualquer cadastro**
- Acompanhar o supervisor (ou quem opera hoje) fazendo correções reais, apenas observando e anotando

**Metas do bloco:**
- [ ] Acessos funcionando
- [ ] Mapa mental ou resumo dos módulos do Thep Edu feito por ele
- [ ] Documento próprio de anotações criado e iniciado

**Critério de conclusão:** consegue explicar, sem consultar, o que cada módulo do Thep Edu faz e qual o fluxo de uma correção segura (backup → alteração → verificação).

---

## Bloco 2 — Thep Edu: correção de cadastros e dados

**Objetivo:** começar as correções reais, das de menor risco para as de maior impacto.

**Atividades:**
- Corrigir cadastros reais de baixo risco, com revisão do supervisor antes de salvar (no início) e depois com revisão por amostragem
- Criar um log de correções: o que corrigiu, quando, por quê
- Aprender a identificar padrões de erro nos dados (o que aparece com mais frequência e por quê)

**Metas do bloco:**
- [ ] 20+ correções de cadastro realizadas e registradas
- [ ] Zero correções revertidas por erro dele na reta final do bloco
- [ ] Log de correções em uso

**Critério de conclusão:** taxa de erro próxima de zero nas correções por amostragem.

---

## Bloco 3 — Thep Edu: chamados, testes e conteúdo pedagógico

**Objetivo:** operar o fluxo completo de chamados e validação do sistema.

**Atividades:**
- Fluxo de chamados: como chegam, classificar (bug, dúvida, cadastro, conteúdo), priorizar, responder e encerrar
- Atender chamados reais com supervisão decrescente ao longo do bloco
- Testes e validação: receber uma funcionalidade ou correção e testar seguindo roteiro (criar o roteiro-padrão de testes junto com o supervisor, se não existir)
- Correção de conteúdo pedagógico: padrão de escrita/formatação da Thep, o que ele pode corrigir direto e o que precisa passar pela equipe pedagógica
- Como reportar um bug bem reportado: passos para reproduzir, print, comportamento esperado vs. obtido

**Metas do bloco:**
- [ ] 10+ chamados atendidos e encerrados corretamente
- [ ] 5+ itens de conteúdo corrigidos dentro do padrão
- [ ] 1 relatório de teste/validação completo entregue

**Critério de conclusão:** atende um chamado do início ao fim sozinho, com classificação, resolução e registro corretos.

> **A partir daqui, o Thep Edu vira rotina:** mesmo nos blocos seguintes (bancada), ele reserva um período do dia para chamados e correções, mantendo a prática.

---

# FASE 2 — ORGANIZAÇÃO FÍSICA (Bloco 4)

## Bloco 4 — Inventário, limpeza, cabeamento e estoque

**Objetivo:** dominar a parte manual — organização, limpeza e infraestrutura física do parque.

**Atividades:**
- Tour físico completo: onde ficam as máquinas, estoque, pendrives de instalação e arquivos de configuração de cada SO
- Noções de segurança: eletricidade estática, manuseio de equipamentos, o que NUNCA fazer sem autorização
- Iniciar a planilha de inventário: aprender o padrão de etiquetagem e catalogar máquinas (modelo, patrimônio, SO, estado) — meta inicial de ~40
- Limpeza física: abrir gabinete/notebook com segurança, ar comprimido, limpeza de contatos, cuidados com cooler e placa-mãe
- Cabeamento: identificar tipos de cabo (rede, energia, vídeo), organizar com velcro/abraçadeiras, padrão de identificação
- Organização do estoque/almoxarifado: separar por categoria (funcionais, para reparo, para descarte, peças), aplicar o padrão de etiquetas

**Metas do bloco:**
- [ ] ~40 máquinas inventariadas e etiquetadas
- [ ] 5+ máquinas limpas e revisadas fisicamente
- [ ] Uma bancada ou setor de estoque totalmente organizado e etiquetado

**Critério de conclusão:** o supervisor sorteia um item do estoque e ele localiza em menos de 2 minutos; limpeza aprovada em vistoria.

---

# FASE 3 — SISTEMAS OPERACIONAIS (Blocos 5 a 7)

## Bloco 5 — Fundamentos de hardware + Linux Mint

**Objetivo:** entender o que há dentro da máquina e fazer a primeira formatação completa.

**Atividades:**
- Hardware na prática: identificar RAM, HD/SSD, fonte, placa-mãe; trocar um pente de RAM e um disco em máquina de teste
- Conceitos essenciais: o que é BIOS/UEFI, ordem de boot, o que é formatar, o que é partição (explicação simples e prática)
- Boot pelo pendrive da Thep: acessar a BIOS nas máquinas mais comuns do parque
- Instalação do Linux Mint pelo pendrive da Thep
- **Setup pós-instalação seguindo o checklist oficial (Anexo A):** atualização, senha de root, usuários (`thep-adm` e `thep-not-xxxx`), Chrome, bloqueador de sites, AnyDesk e validação final
- Primeira instalação acompanhada; repetir sozinho pelo menos 2 vezes, cronometrando

**Metas do bloco:**
- [ ] 1 instalação do Mint acompanhada + 2 sozinho (com setup completo do Anexo A)
- [ ] Troca de RAM e disco realizada com sucesso
- [ ] Anexo A seguido e anotado (dúvidas e melhorias sugeridas)

**Critério de conclusão:** instala e configura o Mint do zero, sozinho, consultando apenas o Anexo A, e a máquina passa na validação final do checklist.

---

## Bloco 6 — Linux Lux Bellatrix (Lenovo)

**Objetivo:** dominar o setup do Bellatrix nas máquinas Lenovo, incluindo as particularidades do fabricante.

**Atividades:**
- Particularidades da Lenovo: teclas de acesso à BIOS/boot (F1, F12, botão Novo), configurações específicas de BIOS usadas pela Thep (Anexo B)
- Instalação do Lux Bellatrix pelo pendrive da Thep
- **Setup pós-instalação seguindo o mesmo checklist oficial (Anexo A)**
- Comparar com o Mint: o que muda, o que é igual (fixa o aprendizado)
- Repetir sozinho 2–3 vezes em máquinas diferentes
- Manutenção básica em Linux: atualizações, verificar disco e memória, resolver os 3–5 problemas mais comuns do parque (levantar com o supervisor quais são)

**Metas do bloco:**
- [ ] 3+ instalações completas do Bellatrix (com setup do Anexo A)
- [ ] Lista dos problemas mais comuns de Linux no parque + como resolver cada um
- [ ] Anexo B seguido e anotado

**Critério de conclusão:** entrega uma máquina Lenovo pronta para uso, validada pelo supervisor, sem intervenção.

---

## Bloco 7 — Windows

**Objetivo:** instalar e configurar Windows no padrão Thep para os casos em que for necessário.

**Atividades:**
- Instalação do Windows com o pendrive da Thep + arquivos de configuração
- Pontos críticos: ativação/licença (política da Thep), drivers (especialmente nas Lenovo), atualizações do Windows Update
- Instalação do conjunto padrão de programas da Thep
- Primeira instalação acompanhada; repetir sozinho 2 vezes
- Manutenção básica no Windows: desinstalar programas, gerenciador de tarefas, verificação de disco, pontos de restauração
- Definir com o supervisor: **quando usar Windows vs. Linux** (critério de decisão documentado)

**Metas do bloco:**
- [ ] 3 instalações completas do Windows (1 guiada + 2 sozinho)
- [ ] Checklist pessoal do Windows escrito por ele (base para o Anexo C)
- [ ] Documento "quando usar cada SO" escrito e validado

**Critério de conclusão:** dado um chamado fictício ("prepare esta máquina para o setor X"), escolhe o SO certo e entrega a máquina pronta.

---

# FASE 4 — AUTONOMIA (Bloco 8)

## Bloco 8 — Rotina integrada e avaliação final

**Objetivo:** operar a rotina real completa, alternando entre as frentes, e consolidar a documentação.

**Atividades:**
- Regime real: parte do dia no Thep Edu (chamados/correções), parte na bancada (máquinas/organização), conforme a demanda
- Avançar o inventário do parque (ou definir plano para concluir os 100+)
- Consolidar todas as anotações e checklists em um **manual único de procedimentos** — que vira o material oficial de treinamento do próximo estagiário
- **Avaliação prática final** (sugestão de prova):
  1. Resolver 3 chamados reais do Thep Edu (cadastro, conteúdo e bug/teste)
  2. Formatar uma máquina Lenovo com Bellatrix do zero (com setup completo do Anexo A)
  3. Formatar uma máquina com Windows do zero
  4. Localizar 3 itens no estoque e explicar o padrão de organização

**Metas do bloco:**
- [ ] Manual de procedimentos entregue
- [ ] Avaliação prática concluída com aprovação do supervisor
- [ ] Plano de inventário dos 100+ definido ou em andamento

**Critério de conclusão:** aprovação na avaliação final → estagiário considerado operacional.

---

## Pós-trilha: rotina contínua

- **Metas mensais sugeridas:** X máquinas revisadas/formatadas, tempo médio de resposta de chamados, inventário 100% atualizado
- **Reunião quinzenal** de acompanhamento com o supervisor
- **Manual vivo:** todo procedimento novo ou problema inédito resolvido entra no manual

---

## Indicadores para acompanhar (do início ao fim)

| Indicador | Como medir |
|---|---|
| Autonomia | Nº de dúvidas escaladas por bloco (deve cair) |
| Qualidade | Correções/instalações refeitas por erro (deve tender a zero) |
| Produtividade | Máquinas entregues e chamados encerrados por bloco |
| Documentação | Checklists e manual atualizados a cada bloco |

---

# ANEXOS

## Anexo A — Checklist oficial: setup de notebook Linux (padrão Thep)

> **Arquivo:** `checklist-setup-linux-thep.md` — vale para **Linux Mint e Lux Bellatrix**.
> Cobre: atualização do sistema, troca da senha de root, criação dos usuários (`thep-adm` admin e `thep-not-xxxx` padrão), instalação do Chrome, bloqueador de sites (`bloquear-sites.sh`), AnyDesk com acesso não supervisionado e validação final antes da entrega.
> Requer também o arquivo `bloquear-sites.sh`.

## Anexo B — Particularidades: instalação do Lux Bellatrix / Lenovo

> *[Aguardando conteúdo — o setup pós-instalação já é coberto pelo Anexo A. Falta incorporar: acesso à BIOS Lenovo (F1/F12/botão Novo), passo a passo de instalação do Bellatrix pelo pendrive e aplicação dos arquivos de configuração.]*

## Anexo C — Passo a passo: instalação e configuração do Windows (padrão Thep)

> *[Opcional — pode ser construído pelo próprio estagiário no Bloco 7, validado pelo supervisor, e incorporado aqui.]*
