import { uid } from './utils.js'

/**
 * Modelos de fluxo prontos.
 *
 * Cada etapa é `[título]` ou `[título, nota]`. A nota é o detalhe técnico —
 * número, faixa, motivo — que faz a diferença entre um checklist decorativo e
 * um que resolve o problema na hora.
 */

export const CATEGORIES = ['Impressão 3D', 'RTOOLS', 'Educacross', 'Hardware & Compras', 'Registros']

export const TEMPLATES = [
  // ══════════════════════════════════════════════════════════════════
  // IMPRESSÃO 3D
  // ══════════════════════════════════════════════════════════════════
  {
    key: 'pre-impressao',
    category: 'Impressão 3D',
    title: 'Pré-impressão — do modelo à primeira camada',
    description:
      'Verificação completa antes de apertar o play: geometria, filamento, máquina, fatiamento no Orca, revisão do G-code e acompanhamento da primeira camada.',
    color: '#22e6ff',
    priority: 'alta',
    tags: ['impressao-3d', 'orca', 'pla', 'checklist'],
    groups: [
      {
        name: '1. Modelo e geometria',
        steps: [
          ['Abrir o STL/3MF e conferir escala e unidades', 'STL não guarda unidade. Um modelo em polegadas entra 25,4× menor. Meça uma cota conhecida antes de fatiar.'],
          ['Rodar o reparo de malha se o Orca acusar erro', 'O aviso "modelo não-manifold" significa faces invertidas ou buracos. Repare no próprio Orca; se não resolver, use Blender (3D Print Toolbox) ou Meshmixer.'],
          ['Verificar espessura mínima de parede', 'Com bico 0.4 mm, qualquer parede abaixo de 0.8 mm vira uma linha só ou some. Detalhe fino exige bico 0.2 mm.'],
          ['Orientar a peça pensando no esforço mecânico', 'A peça sempre quebra na junção entre camadas. Gire para que a tração fique no plano XY, nunca no eixo Z.'],
          ['Avaliar os overhangs acima de 45°', 'Abaixo de 45° imprime no ar sem problema. Acima disso, ou gira a peça, ou aceita suporte, ou modela um chanfro.'],
          ['Escolher qual face fica na mesa', 'A face colada na mesa sai lisa e brilhante; a de cima sai fosca. Decida qual importa mais para a peça.'],
          ['Conferir se a peça cabe no volume de construção', 'Considere também o brim e o suporte, que aumentam a área ocupada.'],
          ['Decidir se vale cortar a peça em partes', 'Peça grande cortada em duas com encaixe imprime mais rápido, gasta menos suporte e falha menos.'],
        ],
      },
      {
        name: '2. Filamento e ambiente',
        steps: [
          ['Confirmar que o preset do filamento é o do rolo que está na máquina', 'PLA de marcas diferentes pedem temperatura e flow diferentes. Preset genérico é sempre um compromisso ruim.'],
          ['Verificar se o PLA está seco', 'PLA úmido estala no bico, solta vapor e deixa a superfície áspera. Se estalar, seque 4–6 h a 45–50 °C.'],
          ['Conferir se sobra filamento suficiente', 'Compare o consumo estimado pelo fatiador com o que resta no rolo (peso atual − tara do carretel, normalmente 180–250 g).'],
          ['Verificar se o filamento corre livre do carretel', 'Filamento cruzado por baixo de outra volta trava no meio da impressão e arranca a peça. Desenrole meia volta e confira.'],
          ['Conferir a temperatura ambiente', 'Entre 18 e 28 °C. Corrente de ar direta em cima da peça é a causa mais comum de warping em PLA.'],
        ],
      },
      {
        name: '3. Máquina',
        steps: [
          ['Limpar a mesa com álcool isopropílico', 'Gordura de dedo é a causa nº 1 de falha de aderência. IPA 70–99%, pano sem fiapo, e não toque na área depois.'],
          ['Verificar o bico sem resíduo carbonizado', 'Resíduo queimado solta no meio da impressão e cria uma mancha marrom na peça. Limpe com escova de latão a quente.'],
          ['Confirmar o nivelamento / mesh de ABL', 'Refaça se trocou o bico, trocou a mesa, moveu a impressora ou se a última primeira camada saiu irregular.'],
          ['Checar a tensão das correias e as rodas excêntricas', 'A correia deve soar como corda de violão grave, sem folga lateral no carro.'],
          ['Verificar as duas ventoinhas girando livres', 'A do dissipador nunca pode parar — se parar, o calor sobe pelo heat break e entope. A da peça só liga a partir da 2ª camada.'],
          ['Confirmar que o bico configurado no Orca é o bico físico', 'Trocou para 0.6 mm e esqueceu de mudar no perfil? Toda a extrusão sai errada.'],
        ],
      },
      {
        name: '4. Fatiamento no Orca Slicer',
        steps: [
          ['Selecionar a tripla correta: máquina + filamento + processo', 'É o erro mais barato de cometer e o mais caro de descobrir 4 h depois.'],
          ['Definir a altura de camada', 'Fique entre 25% e 75% do diâmetro do bico. Bico 0.4 → 0.1 a 0.3 mm. 0.2 mm é o padrão equilibrado.'],
          ['Definir o número de paredes conforme a função', '2 paredes para peça decorativa; 3 a 5 para peça funcional. Parede resiste muito mais que preenchimento.'],
          ['Definir preenchimento e padrão', '10–15% gyroid para decorativo; 30–50% grid ou cubic para funcional; 100% só quando realmente precisa de massa.'],
          ['Usar pelo menos 4 camadas sólidas no topo e na base', 'Com menos que isso o topo fica com pinholes — buraquinhos onde o sólido afundou no preenchimento.'],
          ['Configurar brim se a base de apoio for pequena', 'Brim de 5 mm resolve quase todo descolamento de canto e sai com a unha depois.'],
          ['Configurar os suportes', 'Distância Z de 0.1–0.2 mm: menos gruda demais, mais deixa a superfície feia. Organic para peça orgânica, normal para mecânica.'],
          ['Ativar o gerador Arachne de largura variável', 'Ele adapta a espessura da parede a detalhes finos em vez de simplesmente ignorá-los.'],
          ['Revisar as velocidades contra o Max Volumetric Speed', 'De nada adianta pedir 300 mm/s se o hotend só entrega 12 mm³/s — o resultado é underextrusion.'],
          ['Decidir sobre ironing', 'Alisa o topo plano, mas acrescenta bastante tempo. Só vale quando a face de cima é a que aparece.'],
        ],
      },
      {
        name: '5. Revisão do G-code (preview)',
        steps: [
          ['Percorrer o preview camada por camada', 'É a única chance de ver o que a máquina realmente vai fazer, e leva 2 minutos.'],
          ['Inspecionar a primeira camada no preview', 'Procure linhas separadas ou regiões vazias — sinal de que a peça mal encosta na mesa.'],
          ['Verificar se os suportes tocam onde devem', 'Suporte que nasce em cima da própria peça costuma ser impossível de remover sem marcar.'],
          ['Conferir o tempo estimado e o consumo de material', 'Se o tempo pulou de 3 h para 14 h, algum parâmetro escapou — normalmente altura de camada ou preenchimento.'],
          ['Conferir as trocas de cor e pausas programadas', 'Se houver M600, confirme a camada exata em que ele vai parar.'],
          ['Verificar as viagens que atravessam a peça', 'Ative "avoid crossing walls" se o bico estiver riscando o que já foi impresso.'],
          ['Conferir a altura final contra o limite do eixo Z', 'Inclua o raft/brim na conta.'],
        ],
      },
      {
        name: '6. Início da impressão',
        steps: [
          ['Pré-aquecer e deixar a mesa estabilizar por 5 minutos', 'A mesa dilata ao aquecer. Começar antes de estabilizar desalinha a primeira camada.'],
          ['Acompanhar a linha de purga', 'Ela precisa sair contínua e grudada. Purga falhada = bico parcialmente entupido, pare aqui.'],
          ['Assistir a primeira camada inteira, sem sair de perto', 'Ela decide 90% do resultado. É o melhor investimento de tempo de todo o processo.'],
          ['Ajustar o Z-offset ao vivo se necessário', 'Baby steps de 0.02 mm. O alvo é a linha levemente esmagada, sem sulco visível entre linhas vizinhas.'],
          ['Conferir a aderência nos quatro cantos', 'Canto levantando na primeira camada só piora daí em diante. Cancele e resolva.'],
          ['Só então liberar a impressão'],
        ],
      },
    ],
  },

  {
    key: 'calibracao-pla',
    category: 'Impressão 3D',
    title: 'Calibração de filamento PLA no Orca Slicer',
    description:
      'A rotina completa para cada rolo novo: temperature tower, flow rate em duas passadas, pressure advance, retração, vazão máxima e validação dimensional.',
    color: '#7c5cff',
    priority: 'alta',
    tags: ['impressao-3d', 'orca', 'pla', 'calibracao'],
    groups: [
      {
        name: '1. Preparação',
        steps: [
          ['Confirmar que a impressora está nivelada e com o mesh atualizado', 'Calibrar filamento em cima de uma mesa desnivelada mede o erro errado.'],
          ['Purgar 50–100 mm até a cor sair uniforme', 'Resíduo do filamento anterior contamina toda a primeira torre de teste.'],
          ['Registrar marca, cor e lote do rolo', 'A mesma marca em cor diferente pode pedir 10 °C a mais — o pigmento muda a fluidez.'],
          ['Confirmar que o filamento está seco', 'PLA úmido invalida qualquer calibração: os resultados não se repetem no dia seguinte.'],
          ['Criar um preset de filamento novo, dedicado a este rolo', 'Aba Filamento → salvar como. Nunca calibre por cima de um preset genérico que você usa em outros rolos.'],
          ['Zerar as compensações antes de medir', 'Flow ratio em 1.0 e Pressure Advance desligado. Calibrar em cima de um valor antigo empilha erro sobre erro.'],
        ],
      },
      {
        name: '2. Temperature Tower',
        steps: [
          ['Abrir Calibration → Temperature Tower'],
          ['Definir a faixa de 190 a 230 °C em passos de 5 °C', 'Faixa padrão do PLA. Se o fabricante indicar outra, use o valor dele como centro da faixa.'],
          ['Imprimir a torre inteira sem cancelar no meio'],
          ['Avaliar cada bloco: stringing, ponte, acabamento e brilho'],
          ['Testar a resistência quebrando cada bloco com a mão', 'Quente demais dá stringing e elephant foot; frio demais delamina. O teste da mão separa os dois.'],
          ['Escolher a menor temperatura que ainda dá boa colagem entre camadas'],
          ['Gravar no preset, com a primeira camada +5 °C', 'A primeira camada mais quente ajuda a aderir sem afetar o resto da peça.'],
          ['Definir a temperatura da mesa', 'PLA: 55–60 °C na primeira camada, 50–55 °C nas demais. Acima de 65 °C amolece a base e causa elephant foot.'],
        ],
      },
      {
        name: '3. Flow Rate (razão de extrusão)',
        steps: [
          ['Rodar Calibration → Flow Rate → Pass 1', 'Imprime blocos com modificadores de −20% a +5% sobre a vazão atual.'],
          ['Escolher o bloco com o topo mais liso e uniforme', 'Ignore brilho: procure a superfície sem sulcos entre linhas e sem material sobrando nas bordas.'],
          ['Aplicar a fórmula do novo flow ratio', 'novo = atual × (100 + modificador) / 100. Ex.: 0.98 com bloco −5 → 0.98 × 0.95 = 0.931.'],
          ['Rodar o Pass 2 em torno do valor encontrado', 'O Pass 2 refina em passos menores. Repita a mesma leitura e a mesma fórmula.'],
          ['Confirmar em uma peça real de parede única', 'Um cubo em modo vaso: meça a parede com paquímetro e compare com a largura de extrusão configurada.'],
          ['Salvar o flow ratio final no preset'],
        ],
      },
      {
        name: '4. Pressure Advance / Linear Advance',
        steps: [
          ['Identificar o que a sua firmware usa', 'Marlin e RepRapFirmware usam Linear Advance (M900 K); Klipper usa Pressure Advance (SET_PRESSURE_ADVANCE).'],
          ['Confirmar que o recurso está habilitado na firmware', 'Em Marlin, LIN_ADVANCE precisa ter sido compilado. Sem isso o teste imprime igual em todas as linhas e você conclui errado.'],
          ['Rodar Calibration → Pressure Advance → Pattern method', 'O padrão em linhas é bem mais legível que a torre, principalmente em direct drive.'],
          ['Escolher a linha com os cantos mais uniformes', 'Procure onde o canto não engorda nem afina. Use lupa ou foto ampliada.'],
          ['Comparar com a faixa típica', 'Direct drive no Klipper: 0.02–0.08. Bowden no Klipper: 0.4–1.0. Marlin K: normalmente entre 0.02 e 0.10 em direct drive.'],
          ['Salvar o valor no preset do filamento', 'PA é propriedade do conjunto filamento + extrusor, não da peça. Ele muda de um PLA para outro.'],
        ],
      },
      {
        name: '5. Retração',
        steps: [
          ['Rodar a torre de retração', 'Ela varia distância a cada bloco de altura.'],
          ['Comparar com a faixa típica', 'Direct drive: 0.4–1.2 mm. Bowden: 3–6 mm. Começar acima disso quase sempre cria mais problema que resolve.'],
          ['Ajustar a velocidade de retração', '25–45 mm/s. Rápido demais raspa o filamento na engrenagem do extrusor.'],
          ['Mudar um parâmetro por vez', 'Distância e velocidade juntas tornam impossível saber qual causou a melhora.'],
          ['Verificar que a retração não está causando heat creep', 'Retração longa demais puxa material derretido para a zona fria do heat break e entope depois de 1–2 horas.'],
          ['Confirmar em uma peça com muitas viagens', 'Duas torres finas lado a lado revelam qualquer stringing residual.'],
        ],
      },
      {
        name: '6. Vazão máxima (Max Volumetric Speed)',
        steps: [
          ['Rodar Calibration → Max Volumetric Speed'],
          ['Identificar a altura onde a extrusão começa a falhar', 'A parede fica translúcida e some — é o hotend não conseguindo derreter na velocidade pedida.'],
          ['Comparar com a faixa típica', 'Hotend padrão com PLA: 8–15 mm³/s. Hotend de alta vazão (Volcano, CHT, Revo HF): 20–30 mm³/s.'],
          ['Aplicar o valor com ~10% de margem', 'A vazão real cai quando o filamento está frio ou úmido. Margem evita underextrusion intermitente.'],
          ['Entender o efeito no fatiamento', 'O Orca usa esse teto para reduzir automaticamente a velocidade. É o limite real da sua máquina, acima de qualquer velocidade configurada.'],
        ],
      },
      {
        name: '7. Validação e registro',
        steps: [
          ['Imprimir um cubo de calibração de 20 mm e medir os três eixos', 'Meça no meio da face, não nos cantos.'],
          ['Aceitar até ±0.15 mm de desvio', 'Acima disso o problema é mecânico ou de compensação, não de filamento.'],
          ['Corrigir desvio constante pela compensação de contração', 'Nunca corrija dimensão mexendo no flow ratio: você conserta a medida e estraga o acabamento.'],
          ['Imprimir uma peça funcional real como prova final', 'Teste de encaixe vale mais que qualquer cubo.'],
          ['Exportar o preset do filamento e guardar backup', 'Reinstalação do Orca ou troca de PC apagam tudo se não houver cópia.'],
          ['Anotar os valores na etiqueta do rolo', 'Temperatura, flow, PA e retração escritos no carretel poupam a calibração inteira em seis meses.'],
        ],
      },
    ],
  },

  {
    key: 'pos-impressao',
    category: 'Impressão 3D',
    title: 'Durante e depois da impressão — verificação e acabamento',
    description:
      'Monitoramento em janelas definidas, remoção correta da peça, inspeção dimensional, pós-processamento e o registro que faz a próxima impressão sair melhor.',
    color: '#5dff9b',
    priority: 'media',
    tags: ['impressao-3d', 'pla', 'qualidade', 'acabamento'],
    groups: [
      {
        name: '1. Monitoramento',
        steps: [
          ['Conferir aos 5 min, aos 30 min e depois a cada hora', 'A maioria das falhas aparece nesses dois primeiros checkpoints.'],
          ['Ouvir ruídos anormais', 'Clique ritmado no extrusor é filamento raspando; batida seca é o carro perdendo passo.'],
          ['Verificar acúmulo de material no bico', 'A bolha cresce até cair na peça e arruinar a camada. Pare e limpe assim que notar.'],
          ['Confirmar que o rolo continua desenrolando livre'],
          ['Verificar warping nos cantos da base'],
          ['Decidir cedo se vale cancelar', 'Cancelar aos 10 minutos custa 5 gramas. Cancelar às 6 horas custa o dia inteiro.'],
        ],
      },
      {
        name: '2. Remoção da peça',
        steps: [
          ['Esperar a mesa esfriar abaixo de 35 °C', 'PLA em placa PEI solta praticamente sozinho quando esfria — a contração faz o trabalho.'],
          ['Não usar espátula metálica em placa PEI', 'Um risco no revestimento vira ponto de falha permanente. Flexione a chapa magnética.'],
          ['Remover pelas bordas, sem torcer peças finas'],
          ['Guardar a peça longe de calor', 'PLA começa a amolecer perto de 60 °C. Carro fechado no sol deforma a peça.'],
        ],
      },
      {
        name: '3. Inspeção',
        steps: [
          ['Medir as cotas críticas com paquímetro', 'Meça só o que importa para a função — medir tudo cansa e não informa nada.'],
          ['Testar os encaixes reais', 'Furos saem sistematicamente menores por causa da contração e do arredondamento do bico.'],
          ['Verificar delaminação torcendo a peça com força moderada', 'Se separar entre camadas, a temperatura estava baixa ou o resfriamento alto demais.'],
          ['Inspecionar topo e base contra a luz', 'Pinhole no topo = poucas camadas sólidas ou preenchimento baixo demais para sustentar.'],
          ['Procurar underextrusion nas paredes', 'Vãos entre linhas na parede lateral indicam flow, vazão ou entupimento parcial.'],
          ['Fotografar os defeitos encontrados', 'A foto é o que permite comparar depois do ajuste. De memória não dá.'],
        ],
      },
      {
        name: '4. Pós-processamento',
        steps: [
          ['Remover suportes do topo para a base, com alicate de corte', 'De baixo para cima você arranca material da peça junto.'],
          ['Eliminar brim e elephant foot', 'Estilete puxando na direção contrária à peça, ou uma lima chanfrando a aresta inferior.'],
          ['Lixar na sequência 200 → 400 → 600', 'A úmido, com um pouco de água: evita empastar a lixa e o calor que derrete o PLA.'],
          ['Abrir furos com broca do diâmetro nominal', 'Ou modele o furo 0.2 mm maior desde o começo.'],
          ['Instalar insertos de latão com ferro de solda', 'Temperatura baixa, 200 °C, e entrada perpendicular. É muito mais resistente que rosca direta no plástico.'],
          ['Colar com cianoacrilato', 'Cola de PLA (PLA dissolvido em diclorometano) dá junta mais forte, mas exige ventilação.'],
          ['Aplicar primer antes de pintar', 'Primer preenche as linhas de camada. Sem ele, a tinta destaca cada camada em vez de escondê-las.'],
        ],
      },
      {
        name: '5. Registro',
        steps: [
          ['Arquivar o projeto em 3MF, não só o G-code', 'O 3MF guarda o modelo, a orientação e todas as configurações. O G-code sozinho não permite refatiar.'],
          ['Anotar tempo e gramas reais contra o estimado', 'O desvio sistemático do seu fatiador é o que permite orçar a próxima peça direito.'],
          ['Registrar o que faria diferente na próxima', 'Uma linha basta. É o que transforma tentativa em processo.'],
          ['Salvar o preset se algum parâmetro foi ajustado no meio'],
        ],
      },
    ],
  },

  {
    key: 'diagnostico-defeitos',
    category: 'Impressão 3D',
    title: 'Diagnóstico de defeitos em PLA',
    description:
      'Árvore de verificação por sintoma: aderência, stringing, warping, extrusão, layer shift, ghosting, elephant foot e entupimento. Percorra só o grupo do seu defeito.',
    color: '#ff5c7a',
    priority: 'critica',
    tags: ['impressao-3d', 'pla', 'diagnostico'],
    groups: [
      {
        name: 'A primeira camada não gruda',
        steps: [
          ['Limpar a mesa com álcool isopropílico', 'Faça isso antes de qualquer ajuste de parâmetro — resolve a maioria dos casos sozinho.'],
          ['Baixar o Z-offset em passos de 0.02 mm', 'A linha tem que ficar levemente achatada. Se dá para ver o vão entre linhas, ainda está alto.'],
          ['Subir a mesa para 60–65 °C só na primeira camada'],
          ['Reduzir a velocidade da primeira camada para 20–25 mm/s', 'Dá tempo do material aderir antes de esfriar.'],
          ['Desligar a ventoinha da peça na primeira camada'],
          ['Adicionar brim de 5 mm'],
          ['Avaliar se a superfície PEI perdeu a textura', 'PEI lisa e brilhante de tanto uso perde aderência. Lixe levemente com 1000 ou troque a chapa.'],
        ],
      },
      {
        name: 'Stringing / teias entre as partes',
        steps: [
          ['Baixar a temperatura do bico em 5 °C e reimprimir o teste'],
          ['Secar o filamento por 4–6 h a 45–50 °C', 'Umidade é a causa nº 1 de stringing em PLA e nenhum ajuste de retração compensa.'],
          ['Aumentar a retração em 0.2 mm por tentativa'],
          ['Aumentar a velocidade de viagem para 150–250 mm/s', 'Menos tempo com o bico no ar, menos tempo escorrendo.'],
          ['Ativar wipe e retract on layer change'],
          ['Revisar o Pressure Advance', 'PA alto demais também produz fio fino no fim de cada trecho.'],
        ],
      },
      {
        name: 'Warping / cantos levantando',
        steps: [
          ['Eliminar corrente de ar sobre a impressora', 'Janela, ventilador e ar-condicionado. Uma caixa de papelão por cima já resolve muito caso.'],
          ['Aumentar a temperatura da mesa em 5 °C'],
          ['Aumentar o brim para 8 mm'],
          ['Reduzir o resfriamento nas três primeiras camadas', 'Resfriar rápido demais contrai a base antes que ela esteja bem presa.'],
          ['Adicionar mouse ears nos cantos', 'Discos finos de 10–15 mm de diâmetro nos cantos, removidos depois com a unha.'],
        ],
      },
      {
        name: 'Underextrusion (material faltando)',
        steps: [
          ['Fazer um cold pull para checar entupimento parcial', 'Aqueça a 200 °C, empurre filamento, esfrie até 90 °C e puxe firme. A ponta traz a sujeira.'],
          ['Conferir a tensão do braço do extrusor', 'Frouxo escorrega, apertado demais deforma o filamento e trava.'],
          ['Verificar se o Max Volumetric Speed está limitando'],
          ['Aumentar o flow ratio em 2% e reavaliar'],
          ['Verificar se o tubo PTFE dentro do hotend queimou', 'PTFE queimado estrangula a passagem e degrada acima de 240 °C. Corte a ponta ou troque.'],
          ['Medir o diâmetro real do filamento em três pontos', 'Filamento barato varia de 1.65 a 1.85 mm e o fatiador assume 1.75 mm fixo.'],
        ],
      },
      {
        name: 'Overextrusion / bolhas e material sobrando',
        steps: [
          ['Reduzir o flow ratio em 2% por tentativa'],
          ['Reduzir a temperatura em 5 °C'],
          ['Conferir se o diâmetro do filamento no preset é 1.75 mm'],
          ['Verificar se o passo do extrusor (E-steps) está calibrado', 'Peça 100 mm de extrusão e meça o que realmente saiu. Erro de E-steps envenena todo o resto.'],
        ],
      },
      {
        name: 'Layer shift (camada deslocada)',
        steps: [
          ['Verificar a tensão das duas correias'],
          ['Conferir se as polias estão presas ao eixo do motor', 'Parafuso da polia solto é a causa mais comum e a mais fácil de não enxergar.'],
          ['Reduzir a aceleração em 30% e testar novamente'],
          ['Procurar obstrução mecânica no caminho do carro', 'Cabo passando no trilho, peça já impressa alta demais, clipe da mesa.'],
          ['Verificar se os drivers estão superaquecendo', 'Driver quente entra em proteção térmica e perde passos. Confira a ventoinha da fonte/placa.'],
        ],
      },
      {
        name: 'Ghosting / ringing (eco nas paredes)',
        steps: [
          ['Reduzir a aceleração e o jerk'],
          ['Apertar as correias'],
          ['Colocar a impressora em superfície rígida e pesada', 'Mesa que balança devolve a vibração para a peça.'],
          ['Calibrar o input shaper se a firmware tiver', 'Klipper com acelerômetro resolve o problema de forma definitiva, sem perder velocidade.'],
        ],
      },
      {
        name: 'Elephant foot (base espremida)',
        steps: [
          ['Reduzir a temperatura da mesa em 5 °C'],
          ['Subir levemente o Z-offset'],
          ['Ativar a compensação de elephant foot em 0.1–0.2 mm'],
          ['Chanfrar a base no modelo em 0.5 mm × 45°', 'Solução definitiva: resolve na geometria em vez de compensar no fatiador.'],
        ],
      },
      {
        name: 'Entupimento',
        steps: [
          ['Fazer cold pull até a ponta sair limpa'],
          ['Avaliar o desgaste do bico', 'Bico de latão com PLA puro dura ~300 h; com filamento carregado (madeira, fibra, glow), cai para ~50 h.'],
          ['Verificar o assentamento do heat break e a pasta térmica'],
          ['Reduzir a retração se houver suspeita de heat creep', 'Sintoma: entope só depois de 1–2 h de impressão, nunca no começo.'],
          ['Confirmar que a ventoinha do dissipador nunca para', 'Ela é o que mantém a zona fria fria. Se falhar, o filamento amolece antes da hora e trava.'],
        ],
      },
    ],
  },

  {
    key: 'manutencao-impressora',
    category: 'Impressão 3D',
    title: 'Manutenção preventiva da impressora',
    description:
      'Rotina por frequência — a cada impressão, semanal, a cada 100 horas e trimestral. Marque, imprima, desmarque tudo e recomece no próximo ciclo.',
    color: '#ffb547',
    priority: 'media',
    tags: ['impressao-3d', 'manutencao'],
    groups: [
      {
        name: 'A cada impressão',
        steps: [
          ['Limpar a mesa com IPA'],
          ['Conferir o bico sem resíduo'],
          ['Retirar restos de plástico da mesa e da área de purga'],
        ],
      },
      {
        name: 'Semanal (ou a cada 20 h)',
        steps: [
          ['Limpar os trilhos e as hastes com pano seco', 'Pano seco. Solvente no trilho remove a lubrificação junto com a sujeira.'],
          ['Verificar a tensão das correias'],
          ['Conferir o aperto dos parafusos do conjunto do hotend', 'A dilatação térmica afrouxa parafuso com o tempo — é o que gera vazamento no bico.'],
          ['Ajustar as rodas excêntricas', 'A roda deve girar com resistência ao dedo, sem folga e sem travar.'],
          ['Limpar as ventoinhas com ar comprimido', 'Segure a pá com o dedo: girar acima da rotação nominal com ar comprimido queima o motor.'],
        ],
      },
      {
        name: 'A cada 100 horas',
        steps: [
          ['Lubrificar fusos e eixos com graxa PTFE ou de lítio branca', 'Nunca WD-40: ele é desengraxante, dissolve a lubrificação e atrai poeira.'],
          ['Avaliar o desgaste do bico e trocar se preciso'],
          ['Inspecionar o tubo PTFE dentro do hotend', 'Ponta escurecida ou deformada estrangula a extrusão. Corte reto ou troque.'],
          ['Reapertar os terminais elétricos, principalmente os da mesa aquecida', 'Terminal frouxo em corrente alta aquece, derrete o conector e é causa real de incêndio.'],
          ['Limpar o pó de filamento da engrenagem do extrusor', 'Escova de dente seca. Engrenagem entupida escorrega e vira underextrusion intermitente.'],
        ],
      },
      {
        name: 'Trimestral',
        steps: [
          ['Trocar o bico'],
          ['Verificar a planicidade da mesa com uma régua de aço contra a luz'],
          ['Verificar os rolamentos lineares girando sem ruído'],
          ['Fazer backup dos presets do Orca e da configuração da firmware', 'Presets de máquina, filamento e processo. É o trabalho de meses de calibração.'],
          ['Inspecionar a fiação do aquecedor e do termistor', 'Cabo que dobra a cada movimento rompe por fadiga. Procure isolamento rachado perto do hotend.'],
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════
  // RTOOLS
  // ══════════════════════════════════════════════════════════════════
  {
    key: 'rtools-nova-ferramenta',
    category: 'RTOOLS',
    title: 'RTOOLS — criar uma ferramenta nova',
    description:
      'Do escopo ao deploy: escolha de biblioteca, processamento no navegador sem travar a aba, estados e erros, testes reais em arquivos grandes e publicação na Vercel.',
    color: '#4d7cff',
    priority: 'alta',
    tags: ['rtools', 'dev', 'navegador'],
    groups: [
      {
        name: '1. Definição',
        steps: [
          ['Escrever em uma frase o que a ferramenta faz', 'Se não couber em uma linha na listagem da categoria, o escopo está grande demais.'],
          ['Definir exatamente os formatos de entrada e de saída'],
          ['Confirmar que dá para fazer 100% no navegador', 'Processamento local é a promessa central do RTOOLS. Se exigir servidor, ou muda a abordagem ou não entra.'],
          ['Escolher a categoria: PDF, Imagens, Vídeo & Áudio ou Arquivos'],
          ['Definir os limites operacionais', 'Tamanho máximo por arquivo, quantidade de arquivos por vez, e o que acontece ao ultrapassar.'],
          ['Verificar se já existe ferramenta parecida na suíte', 'Quase sempre é melhor acrescentar uma opção à ferramenta existente do que criar uma segunda quase igual.'],
        ],
      },
      {
        name: '2. Biblioteca e viabilidade',
        steps: [
          ['Escolher a biblioteca', 'PDF: pdf-lib para escrita, pdf.js para leitura/render. Imagem: Canvas e WebCodecs. Vídeo/áudio: ffmpeg.wasm. Arquivos: fflate ou JSZip.'],
          ['Medir o peso da biblioteca no bundle', 'ffmpeg.wasm passa de 25 MB. Isso jamais pode entrar no carregamento inicial do site.'],
          ['Carregar a biblioteca com import dinâmico', 'Só baixa quando o usuário abre aquela ferramenta específica. O resto da suíte continua leve.'],
          ['Testar a viabilidade com um arquivo grande antes de escrever a interface', 'Se travar a aba com 100 MB, o problema é de arquitetura e nenhuma UI conserta.'],
          ['Mover o processamento pesado para um Web Worker', 'Na thread principal, a aba congela, o navegador oferece "matar a página" e o usuário acha que quebrou.'],
          ['Avaliar streaming para arquivos grandes', 'Ler um vídeo de 2 GB inteiro na memória estoura a aba. Processe em blocos quando a biblioteca permitir.'],
        ],
      },
      {
        name: '3. Implementação',
        steps: [
          ['Área de drop funcionando junto com seleção por clique', 'Nem todo mundo arrasta. Os dois caminhos precisam levar ao mesmo lugar.'],
          ['Validar o tipo real pelos magic bytes, não pela extensão', 'Um .png renomeado para .jpg quebra a conversão de um jeito que o usuário não consegue diagnosticar.'],
          ['Barra de progresso real, vinda do callback da biblioteca', 'Progresso falso que trava em 90% é pior que nenhum progresso.'],
          ['Permitir cancelar no meio do processamento', 'worker.terminate() mais limpeza do estado. Conversão de vídeo pode levar minutos.'],
          ['Liberar memória ao terminar', 'URL.revokeObjectURL em cada resultado e terminate no worker. Sem isso, dez arquivos seguidos derrubam a aba.'],
          ['Nomear o arquivo de saída de forma previsível', 'documento.pdf → documento-comprimido.pdf. Nunca output(1).pdf.'],
          ['Processar em lote quando fizer sentido', 'Converter 30 imagens uma a uma é o tipo de coisa que faz o usuário desistir da ferramenta.'],
        ],
      },
      {
        name: '4. Estados e erros',
        steps: [
          ['Estado vazio explicando o que soltar ali'],
          ['Estado de carregamento da biblioteca', 'Baixar 25 MB de ffmpeg sem aviso nenhum parece travamento.'],
          ['Estado de processamento com progresso e opção de cancelar'],
          ['Estado de conclusão com o resultado e o comparativo de tamanho', 'De 4.2 MB para 780 KB é a informação que prova que a ferramenta funcionou.'],
          ['Mensagens de erro em português dizendo o que fazer', 'Não "Error: invalid header", e sim "Este PDF está protegido por senha — remova a proteção antes de juntar".'],
          ['Testar com arquivo corrompido'],
          ['Testar com formato não suportado'],
          ['Testar com arquivo de 0 byte'],
          ['Testar com PDF protegido por senha'],
        ],
      },
      {
        name: '5. Testes reais',
        steps: [
          ['Testar em Chrome, Firefox e Safari', 'Safari é o que mais diverge em WebCodecs, OffscreenCanvas e limite de memória.'],
          ['Testar no celular, em rede móvel'],
          ['Testar com 1 KB, 10 MB e 200 MB'],
          ['Testar nome de arquivo com acento, espaço e emoji', 'Content-Disposition e download quebram silenciosamente com caractere não-ASCII.'],
          ['Acompanhar o consumo de memória no DevTools durante o processamento'],
          ['Confirmar na aba Network que nenhum byte sai do navegador', 'Essa é a proposta de valor inteira do RTOOLS. Vale conferir a cada ferramenta nova.'],
        ],
      },
      {
        name: '6. Acabamento',
        steps: [
          ['Adicionar o card na listagem da categoria, com descrição de uma linha'],
          ['Conferir a responsividade em 360 px de largura'],
          ['Garantir navegação por teclado com foco visível'],
          ['Definir título e meta description próprios da página'],
          ['Testar com CPU limitada em 4x no DevTools', 'É o celular real de quem vai usar.'],
          ['Revisar os textos em português, sem jargão de programador'],
        ],
      },
      {
        name: '7. Deploy na Vercel',
        steps: [
          ['Rodar o build local e conferir o tamanho do bundle inicial', 'Se cresceu por causa da ferramenta nova, o import dinâmico não está fazendo efeito.'],
          ['Abrir o preview deploy do pull request e testar lá', 'A Vercel gera uma URL por branch — teste no ambiente real antes de mandar para produção.'],
          ['Verificar os headers COOP/COEP se usar SharedArrayBuffer', 'ffmpeg.wasm multi-thread exige cross-origin isolation. Sem os headers, ele cai no modo lento sem avisar.'],
          ['Abrir o link de preview em um celular de verdade'],
          ['Promover para produção e testar a URL final'],
          ['Conferir se a ferramenta aparece na navegação e na busca do site'],
        ],
      },
    ],
  },

  {
    key: 'rtools-release',
    category: 'RTOOLS',
    title: 'RTOOLS — revisão antes de publicar',
    description:
      'Checklist curto de release: o que verificar em toda a suíte antes de promover um deploy para produção na Vercel.',
    color: '#ff4fd8',
    priority: 'media',
    tags: ['rtools', 'deploy', 'qa'],
    groups: [
      {
        name: 'Build',
        steps: [
          ['Build local sem erro nem aviso novo'],
          ['Comparar o tamanho do bundle inicial com o do release anterior'],
          ['Conferir que as bibliotecas pesadas continuam em import dinâmico'],
        ],
      },
      {
        name: 'Funcional',
        steps: [
          ['Rodar uma conversão de cada categoria', 'Uma de PDF, uma de imagem, uma de vídeo/áudio e uma de arquivo. Cobre os quatro caminhos de código.'],
          ['Testar upload por arrastar e por clique'],
          ['Testar o cancelamento no meio de uma conversão longa'],
          ['Confirmar que os downloads salvam com o nome certo'],
        ],
      },
      {
        name: 'Ambiente',
        steps: [
          ['Testar o preview deploy no celular'],
          ['Conferir o console do navegador sem erro em produção'],
          ['Verificar o carregamento com cache limpo (janela anônima)'],
          ['Conferir se a home lista todas as ferramentas com a contagem certa por categoria'],
        ],
      },
      {
        name: 'Publicação',
        steps: [
          ['Promover o deploy para produção'],
          ['Abrir a URL de produção e refazer um teste de cada categoria'],
          ['Registrar o que mudou nesta versão'],
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════
  // REGISTROS
  // ══════════════════════════════════════════════════════════════════
  {
    key: 'relatorio-atividades',
    category: 'Registros',
    title: 'Relatório de atividades do período',
    description:
      'Da coleta bruta ao relatório entregue: levantar o que foi feito, transformar atividade em resultado, escrever, revisar e arquivar. Desmarque tudo e reuse a cada período.',
    color: '#5dff9b',
    priority: 'alta',
    tags: ['relatorio', 'registro', 'rotina'],
    groups: [
      {
        name: '1. Definir o recorte',
        steps: [
          ['Fixar a data inicial e final do período', 'Sem recorte explícito, atividade da semana passada entra duas vezes ou some entre um relatório e outro.'],
          ['Confirmar quem vai ler o relatório', 'Chefe direto, cliente e equipe pedem níveis de detalhe completamente diferentes do mesmo trabalho.'],
          ['Retomar o relatório anterior', 'Serve para dois fins: manter o mesmo formato e verificar o que ficou pendente lá.'],
          ['Listar o que estava prometido para este período', 'O relatório precisa responder ao que foi combinado, não só narrar o que aconteceu.'],
        ],
      },
      {
        name: '2. Coletar o material bruto',
        steps: [
          ['Varrer as fontes do período, uma a uma', 'Fluxos do RWork, commits e pull requests, e-mails enviados, atas de reunião, agenda, planilhas e mensagens.'],
          ['Anotar cada atividade com data', 'A data é o que permite ordenar e é a primeira coisa que alguém pergunta ao contestar um item.'],
          ['Levantar os números do período', 'Quantidade entregue, horas, peças impressas, gramas de filamento, ferramentas publicadas, conversões, chamados atendidos.'],
          ['Recolher as evidências', 'Foto da peça, link do deploy, print do painel, arquivo entregue. Sem evidência, o item vira só afirmação.'],
          ['Registrar também o que deu errado', 'Falha documentada com a causa vale mais que a omissão, e blinda você quando o assunto voltar.'],
          ['Anotar o tempo perdido com bloqueios', 'Espera por aprovação, máquina parada, retrabalho. É o dado que justifica pedir mudança de processo.'],
        ],
      },
      {
        name: '3. Transformar atividade em resultado',
        steps: [
          ['Agrupar as atividades soltas em blocos de entrega', 'Ninguém lê 40 linhas de tarefa. Lê 5 blocos com o que saiu de cada um.'],
          ['Reescrever cada bloco pelo resultado, não pelo esforço', 'Não "mexi no fatiador a semana toda", e sim "calibrei 3 filamentos e a taxa de falha caiu de 4 para 1 em 20 impressões".'],
          ['Quantificar o que der para quantificar', 'Antes e depois, percentual, tempo economizado. Número é o que sobrevive à leitura rápida.'],
          ['Ligar cada bloco ao objetivo que ele atende', 'Entrega sem vínculo com o combinado parece trabalho paralelo.'],
          ['Separar o que foi concluído do que está em andamento', 'Misturar os dois é a forma mais rápida de perder a confiança de quem lê.'],
        ],
      },
      {
        name: '4. Escrever',
        steps: [
          ['Abrir com um resumo de 3 a 5 linhas', 'Parte dos leitores não vai passar daí. Coloque ali o que você precisa que fique sabido.'],
          ['Detalhar as entregas concluídas, com evidência'],
          ['Listar o que está em andamento com percentual e previsão'],
          ['Registrar os bloqueios e o que você precisa de outra pessoa', 'Seja explícito no pedido: quem, o quê e até quando. Bloqueio sem destinatário nunca é resolvido.'],
          ['Fechar com o que vem no próximo período', 'É o que faz o próximo relatório começar pronto.'],
          ['Anexar os números em tabela curta'],
        ],
      },
      {
        name: '5. Revisar e enviar',
        steps: [
          ['Ler inteiro em voz alta uma vez', 'Pega frase truncada e jargão que só faz sentido para quem fez o trabalho.'],
          ['Conferir cada número contra a fonte', 'Um número errado no relatório contamina a credibilidade de todos os outros.'],
          ['Testar todos os links e anexos'],
          ['Verificar se não vazou informação que não deveria circular'],
          ['Enviar dentro do prazo combinado', 'Relatório bom e atrasado é lido como relatório ruim.'],
          ['Arquivar a versão enviada com data no nome do arquivo', 'É o que vai sustentar a conversa de avaliação daqui a seis meses.'],
          ['Atualizar os fluxos do RWork com o que mudou de status'],
        ],
      },
    ],
  },

  {
    key: 'registro-reuniao',
    category: 'Registros',
    title: 'Registro de reunião',
    description:
      'Preparo, captura durante a conversa, estrutura da ata e — o que quase sempre falha — a cobrança dos encaminhamentos depois.',
    color: '#7c5cff',
    priority: 'media',
    tags: ['reuniao', 'ata', 'registro'],
    groups: [
      {
        name: '1. Antes',
        steps: [
          ['Escrever o objetivo da reunião em uma frase', 'Se não couber em uma frase, são duas reuniões — ou nenhuma necessária.'],
          ['Definir a pauta com tempo por item', 'Pauta sem tempo sempre estoura no primeiro assunto e deixa o resto sem discussão.'],
          ['Enviar a pauta antes, com o material de leitura'],
          ['Confirmar quem precisa estar presente para decidir', 'Reunião sem quem decide gera uma segunda reunião com a mesma pauta.'],
          ['Retomar os encaminhamentos da reunião anterior', 'Abrir cobrando o que ficou pendente é o que faz a ata ser levada a sério.'],
          ['Preparar o modelo da ata antes de começar', 'Escrever em cima de estrutura pronta é o que permite acompanhar a conversa e registrar ao mesmo tempo.'],
        ],
      },
      {
        name: '2. Durante — captura',
        steps: [
          ['Registrar data, hora de início, participantes e ausentes'],
          ['Anotar decisão, não discussão', 'Ata não é transcrição. Ninguém volta para ler o caminho, só o destino.'],
          ['Marcar cada encaminhamento com responsável e prazo na hora', 'Ação sem nome e sem data não é ação, é intenção. Combine ali, com a pessoa presente.'],
          ['Registrar os pontos em que não houve acordo', 'O que ficou em aberto reaparece. Deixar registrado evita a discussão de novo do zero.'],
          ['Anotar os números e valores exatamente como foram ditos', 'Confirme na hora: "então são 40 unidades até dia 12, certo?".'],
          ['Ler os encaminhamentos em voz alta nos 5 minutos finais', 'É o único momento em que todo mundo ainda está presente para discordar.'],
          ['Registrar a hora de término'],
        ],
      },
      {
        name: '3. Estruturar a ata',
        steps: [
          ['Escrever a ata no mesmo dia', 'No dia seguinte você já perdeu o contexto que suas anotações não capturaram.'],
          ['Abrir com objetivo, data e participantes'],
          ['Listar as decisões tomadas, uma por linha'],
          ['Montar a tabela de encaminhamentos: ação, responsável, prazo'],
          ['Registrar os pontos em aberto e quem vai destravar cada um'],
          ['Anotar a data da próxima reunião, se houver'],
          ['Revisar procurando ambiguidade', 'Frases como "verificar a viabilidade" não são acionáveis. Troque por quem faz o quê até quando.'],
        ],
      },
      {
        name: '4. Depois',
        steps: [
          ['Enviar a ata para todos os participantes em até 24 h'],
          ['Abrir prazo curto para correção', '"Se algo estiver errado, me avise até amanhã" — depois disso a ata vale como registro acordado.'],
          ['Transformar cada encaminhamento seu em etapa de um fluxo do RWork', 'É o que impede a ata de virar arquivo morto na semana seguinte.'],
          ['Colocar os prazos dos outros na agenda para cobrar', 'Cobrança na véspera do prazo custa nada e evita a reunião de emergência depois.'],
          ['Arquivar com data e assunto no nome', 'Padrão sugerido: 2026-08-24-nome-do-assunto. Ordena sozinho e é achável pela busca.'],
          ['Confirmar na reunião seguinte o que foi efetivamente cumprido'],
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════
  // EDUCACROSS
  // ══════════════════════════════════════════════════════════════════
  {
    key: 'educacross-plataforma',
    category: 'Educacross',
    title: 'Educacross — entender a plataforma a fundo',
    description:
      'Roteiro para dominar o produto antes de vender ou implantar: percorrer cada perfil na prática, conhecer os limites, os requisitos técnicos e as objeções que sempre aparecem.',
    color: '#b0ff3d',
    priority: 'alta',
    tags: ['educacross', 'produto', 'estudo'],
    groups: [
      {
        name: '1. Visão geral',
        steps: [
          ['Escrever com as suas palavras o que a plataforma faz e para quem', 'Se você não consegue explicar em duas frases, não vai conseguir defender o preço depois.'],
          ['Levantar quais anos/séries e quais áreas do conhecimento são atendidos', 'Confirme na fonte oficial, não por suposição — é a primeira pergunta do coordenador pedagógico.'],
          ['Entender a proposta pedagógica por trás da gamificação', 'Coordenador não compra "jogo". Compra trilha de aprendizagem com progressão e evidência. Saiba explicar a lógica, não só a mecânica.'],
          ['Mapear como o conteúdo se relaciona com a BNCC', 'Saiba mostrar na tela onde uma habilidade específica da BNCC aparece. É o que separa apresentação de demonstração.'],
          ['Listar explicitamente o que a plataforma NÃO faz', 'Conhecer o limite evita a venda que vira problema de implantação e cancelamento no ano seguinte.'],
          ['Identificar os concorrentes que aparecem nas mesmas licitações', 'Saiba em que você ganha e em que perde, com honestidade, antes que o cliente traga a comparação.'],
        ],
      },
      {
        name: '2. Perfis e permissões',
        steps: [
          ['Conseguir um acesso de teste para cada perfil', 'Aluno, professor e gestor. Ler documentação não substitui entrar na tela.'],
          ['Mapear o que cada perfil enxerga e o que pode fazer'],
          ['Entender como se cria uma turma e como o aluno é vinculado a ela'],
          ['Entender como se importa a base de alunos da rede', 'É aqui que a implantação normalmente trava. Saiba o formato exigido e quem na secretaria consegue extrair.'],
          ['Verificar o que acontece na virada do ano letivo', 'Os alunos avançam de turma sozinhos? O histórico é preservado? A resposta vira argumento de renovação.'],
        ],
      },
      {
        name: '3. Jornada do aluno',
        steps: [
          ['Fazer o percurso completo como aluno, do login à conclusão de uma trilha'],
          ['Entender como a dificuldade se adapta ao desempenho'],
          ['Verificar como o aluno é avaliado e o que gera o resultado'],
          ['Testar no dispositivo que o aluno realmente usa', 'Chromebook da escola, tablet compartilhado, celular do responsável. Testar só no seu notebook esconde o problema real.'],
          ['Descobrir o comportamento com internet ruim ou sem internet', 'Determinante em rede pública. Tenha a resposta pronta antes de ser perguntado na frente do secretário.'],
          ['Cronometrar quanto tempo o aluno leva em uma sessão típica', 'O professor precisa saber se cabe em 20 minutos de aula ou se exige a aula inteira.'],
        ],
      },
      {
        name: '4. Jornada do professor',
        steps: [
          ['Percorrer o caminho do professor: criar turma, atribuir atividade, ver o resultado'],
          ['Cronometrar quanto tempo leva do zero até a primeira atividade atribuída', 'Se passar de 15 minutos, a adoção cai — e adoção baixa é o que mata a renovação.'],
          ['Entender exatamente quais relatórios o professor recebe'],
          ['Descobrir como o professor identifica o aluno com dificuldade', 'É a função que mais convence professor cético. Saiba chegar nela em três cliques.'],
          ['Conhecer o material de formação disponível para o professor'],
          ['Listar o que o professor precisa fazer toda semana para o uso não morrer'],
        ],
      },
      {
        name: '5. Jornada do gestor e da secretaria',
        steps: [
          ['Explorar o painel da rede: uso por escola, por turma e por aluno'],
          ['Saber extrair o relatório que o secretário vai pedir', 'Normalmente é adesão por escola e evolução de desempenho. Tenha o caminho na ponta da língua.'],
          ['Entender como acompanhar a adesão ao longo do contrato', 'Adesão baixa detectada no mês 2 é recuperável; detectada no mês 10 é contrato perdido.'],
          ['Entender como os dados conversam com indicadores externos', 'IDEB, SAEB e avaliações próprias da rede. É a linguagem em que o gestor mede sucesso.'],
          ['Descobrir como se compara o desempenho entre escolas da mesma rede'],
        ],
      },
      {
        name: '6. Requisitos, dados e suporte',
        steps: [
          ['Levantar os requisitos técnicos mínimos', 'Navegador, sistema, banda por aluno simultâneo, bloqueios de firewall comuns em rede municipal.'],
          ['Entender como funciona o login dentro da escola', 'Aluno decora senha? Tem QR code? Cartão? É um detalhe que decide o sucesso do primeiro dia.'],
          ['Obter a política de privacidade e o parecer de LGPD', 'Dados de menores em compra pública: o jurídico da prefeitura vai pedir. Tenha o documento antes.'],
          ['Verificar os recursos de acessibilidade', 'É exigência frequente em termo de referência público.'],
          ['Entender o processo de suporte e o prazo de resposta', 'Saber o SLA real evita prometer o que a operação não entrega.'],
        ],
      },
      {
        name: '7. Prática',
        steps: [
          ['Fazer uma demonstração completa gravando a si mesmo', 'Assistir à própria demo é o jeito mais rápido de descobrir onde você trava e onde se enrola.'],
          ['Escrever as 10 perguntas mais prováveis com a resposta pronta'],
          ['Preparar a resposta para as objeções recorrentes', 'Internet ruim, professor sem tempo, já temos outra plataforma, verba curta, "vai virar mais uma senha para o aluno esquecer".'],
          ['Assistir a uma demonstração de alguém mais experiente'],
          ['Fazer uma demo de teste para um colega e pedir crítica dura'],
          ['Montar um roteiro de demo de 15 minutos', 'Reunião com secretário raramente dura o que foi agendado. Tenha a versão curta ensaiada.'],
        ],
      },
    ],
  },

  {
    key: 'educacross-negociacao',
    category: 'Educacross',
    title: 'Educacross — negociação de preços',
    description:
      'Da qualificação da oportunidade ao contrato assinado: fonte de verba, montagem da proposta, enquadramento da compra pública, condução da negociação e formalização.',
    color: '#ffb547',
    priority: 'critica',
    tags: ['educacross', 'negociacao', 'comercial'],
    groups: [
      {
        name: '1. Qualificar a oportunidade',
        steps: [
          ['Identificar o tipo de comprador', 'Secretaria municipal, escola privada, mantenedora ou grupo. Cada um tem processo de compra, verba e prazo completamente diferentes.'],
          ['Levantar o número de alunos e de escolas envolvidas', 'É a variável que define o preço. Confirme se é matrícula total da rede ou só os anos que vão usar de fato.'],
          ['Descobrir quem decide, quem influencia e quem paga', 'Na rede pública quase sempre são três pessoas distintas: o secretário decide, o coordenador pedagógico influencia, o setor de compras executa. Ignorar qualquer uma trava o processo.'],
          ['Mapear o problema concreto que o cliente quer resolver', 'Nota do IDEB, defasagem em matemática, engajamento, formação de professores. Preço só se sustenta amarrado a um problema declarado.'],
          ['Confirmar que existe verba e identificar a fonte', 'PDDE, FUNDEB, recurso próprio do município, emenda parlamentar. Sem fonte identificada, não existe negociação — existe conversa.'],
          ['Levantar a janela do ciclo orçamentário', 'Compra pública tem prazo rígido. Perder o empenho do exercício empurra o contrato inteiro para o ano seguinte.'],
          ['Verificar se já usaram alguma solução parecida antes', 'Experiência ruim anterior sempre volta disfarçada de objeção de preço lá na frente.'],
        ],
      },
      {
        name: '2. Preparar a proposta',
        steps: [
          ['Definir o escopo exato do que está sendo vendido', 'Quantidade de licenças, vigência, formação de professores, suporte, relatórios de acompanhamento. Escopo vago vira desconto exigido depois.'],
          ['Conhecer o preço de lista e o limite de desconto autorizado antes da reunião', 'Descobrir o seu próprio piso durante a negociação é a forma mais cara de aprender.'],
          ['Calcular o valor por aluno por ano e por mês', 'É a métrica que o cliente vai usar. Apresente a conta você mesmo, antes que ele a faça sozinho.'],
          ['Montar pelo menos duas opções de escopo', 'Uma opção única vira sim ou não. Duas ou três mudam a pergunta de "se" para "qual".'],
          ['Preparar a justificativa de valor com números do próprio cliente', 'Compare com custo de reforço escolar, material didático ou hora-aula da rede. Traduza para a moeda que ele já conhece.'],
          ['Definir as condições de pagamento aceitáveis'],
          ['Listar a contrapartida de cada faixa de desconto', 'Desconto sempre em troca de algo: vigência maior, volume maior, pagamento antecipado, caso de sucesso publicável, indicação para outra rede.'],
        ],
      },
      {
        name: '3. Enquadrar a compra (setor público)',
        steps: [
          ['Confirmar a modalidade de contratação', 'Pregão eletrônico, dispensa por valor, inexigibilidade ou adesão a ata de registro de preços. Cada uma tem prazo e documentação próprios.'],
          ['Verificar se cabe adesão a uma ata de registro de preços existente', 'Quando existe, é o caminho mais rápido — poupa meses de processo licitatório.'],
          ['Levantar toda a documentação de habilitação exigida', 'Certidões, atestados de capacidade técnica, regularidade fiscal. Documento vencido para o processo na véspera.'],
          ['Ler o termo de referência com atenção ao que descreve a solução', 'Termo escrito sob medida para o concorrente é a forma mais comum de perder antes de começar. Participe da fase de estudo técnico quando for possível.'],
          ['Reunir os documentos de LGPD e acessibilidade', 'Tratamento de dados de menores é ponto de atenção do jurídico da prefeitura. Ter o parecer pronto acelera semanas.'],
          ['Anotar os prazos de publicação, impugnação e sessão'],
        ],
      },
      {
        name: '4. Conduzir a negociação',
        steps: [
          ['Apresentar valor antes de falar em preço', 'Quem abre com preço negocia preço pelo resto da reunião.'],
          ['Ancorar na opção de escopo maior', 'A primeira referência numérica molda todas as seguintes. Se você não ancorar, o cliente ancora.'],
          ['Perguntar o orçamento disponível em vez de tentar adivinhar'],
          ['Nunca conceder desconto sem contrapartida', 'Desconto de graça ensina o cliente a pedir mais e desvaloriza o que já foi combinado.'],
          ['Registrar por escrito cada concessão dada e recebida', 'Uma linha por concessão, na hora. É o que impede a negociação de virar leilão contra você mesmo.'],
          ['Separar preço de custo ao tratar a objeção', 'Faça a conta do custo por aluno por mês na frente do cliente. Quase sempre é menor do que ele imaginava.'],
          ['Confirmar por escrito, no mesmo dia, tudo que foi acordado verbalmente'],
          ['Encerrar toda reunião com o próximo passo e uma data definida', 'Reunião que termina em "depois eu te aviso" morre em silêncio.'],
        ],
      },
      {
        name: '5. Fechar e formalizar',
        steps: [
          ['Enviar a proposta formal com validade explícita', 'Proposta sem prazo de validade fica em cima da mesa até o preço não valer mais.'],
          ['Confirmar quem assina e o que precisa acontecer antes da assinatura'],
          ['Acompanhar o empenho e a emissão do contrato', 'No setor público, contrato assinado sem empenho não vira pagamento.'],
          ['Fixar as datas de início e da formação dos professores'],
          ['Registrar os valores e as condições finais no CRM ou na planilha'],
          ['Arquivar a proposta assinada e o contrato'],
        ],
      },
      {
        name: '6. Depois do fechamento',
        steps: [
          ['Repassar o contexto completo para quem vai implantar', 'Promessa feita na negociação que a implantação desconhece é o primeiro passo do cancelamento.'],
          ['Agendar o primeiro acompanhamento de uso'],
          ['Marcar a conversa de renovação com 90 dias de antecedência', 'Com dados de adesão e desempenho na mão. Renovação discutida em cima da hora vira negociação de preço de novo.'],
          ['Pedir caso de sucesso ou indicação quando o resultado aparecer'],
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════
  // HARDWARE & COMPRAS
  // ══════════════════════════════════════════════════════════════════
  {
    key: 'orcamento-hardware',
    category: 'Hardware & Compras',
    title: 'Orçamento de hardware com carga tributária',
    description:
      'Da necessidade ao custo real: especificar, cotar, separar o preço de vitrine do custo efetivo depois de impostos e créditos, calcular o TCO e montar o comparativo que sustenta a decisão.',
    color: '#4d7cff',
    priority: 'alta',
    tags: ['hardware', 'orcamento', 'tributario', 'compras'],
    groups: [
      {
        name: '1. Definir a necessidade',
        steps: [
          ['Escrever o problema antes de escrever a especificação', 'Comprar "um PC melhor" gasta errado. Comprar "estação que renderiza X em menos de Y minutos" define o componente que realmente importa.'],
          ['Identificar o gargalo real da máquina atual', 'Meça antes de comprar: CPU, RAM, disco ou GPU. Trocar tudo porque o gargalo era o SSD é o desperdício mais comum.'],
          ['Definir quantas unidades e para quais funções'],
          ['Definir a vida útil esperada do equipamento', 'Muda tudo no cálculo: 3 anos aceita hardware mais modesto; 5 anos exige folga de expansão e garantia estendida.'],
          ['Levantar quem aprova a compra e qual o teto sem aprovação extra'],
          ['Verificar se há equipamento ocioso que resolve', 'Redistribuir o que já existe é o orçamento mais barato que existe.'],
        ],
      },
      {
        name: '2. Especificar',
        steps: [
          ['Fechar a especificação técnica mínima e a desejável', 'Duas colunas. A mínima é o que não pode faltar; a desejável é o que entra se o preço permitir.'],
          ['Verificar compatibilidade entre os componentes', 'Socket, chipset, perfil de memória, TDP da fonte, altura do cooler, comprimento da GPU, padrão do gabinete.'],
          ['Definir requisitos de garantia e suporte', 'On-site em 24 h custa caro e às vezes é obrigatório. Balcão vale para máquina que pode ficar parada uma semana.'],
          ['Checar disponibilidade real e prazo de entrega', 'Preço bom de item sem estoque é preço fictício. Confirme prazo por escrito.'],
          ['Verificar consumo elétrico e capacidade da infraestrutura', 'Somatório de W, capacidade do nobreak, disjuntor do circuito e carga térmica da sala.'],
          ['Definir se é compra, locação ou nuvem', 'Compra vira ativo com depreciação; locação e nuvem são despesa mensal. A resposta muda com o fluxo de caixa e com o regime tributário.'],
        ],
      },
      {
        name: '3. Cotar',
        steps: [
          ['Levantar no mínimo três cotações comparáveis', 'Comparáveis é a palavra: mesma especificação, mesma garantia, mesmo prazo. Cotação de escopos diferentes não compara nada.'],
          ['Cotar sempre com CNPJ e nota fiscal completa', 'Preço de consumidor final esconde o crédito tributário e distorce a comparação.'],
          ['Pedir o preço discriminado por item', 'Kit fechado impede negociar o componente caro e esconde onde está a margem.'],
          ['Registrar o estado do produto', 'Novo, seminovo, recondicionado, open box, importado paralelo. Muda garantia, risco e a nota fiscal.'],
          ['Conferir a origem e a nota do fornecedor de fora do estado', 'Compra interestadual muda a alíquota e pode gerar DIFAL. O preço de tela quase nunca considera isso.'],
          ['Anotar frete, seguro e prazo em cada cotação'],
          ['Verificar reputação e tempo de mercado do fornecedor', 'Garantia só vale se a empresa existir quando você precisar dela.'],
        ],
      },
      {
        name: '4. Carga tributária',
        steps: [
          ['Confirmar o regime tributário da empresa com a contabilidade', 'Simples Nacional, Lucro Presumido ou Lucro Real. É a variável que mais muda o custo efetivo e nenhuma conta funciona sem ela.'],
          ['Verificar se a empresa aproveita crédito de ICMS', 'Empresa no Simples não credita. Isso significa que, para ela, o imposto embutido é custo puro e o preço de tela já é o preço real.'],
          ['Verificar o crédito de PIS/COFINS', 'No Lucro Real não-cumulativo (9,25%) há crédito; no Presumido cumulativo (3,65%) não há. Confirme o enquadramento do item com a contabilidade.'],
          ['Conferir o ICMS destacado na nota e a alíquota aplicada', 'Interna x interestadual mudam a alíquota. Peça a nota de simulação antes de fechar.'],
          ['Verificar se o item tem substituição tributária', 'Com ST o imposto já vem recolhido na origem e o comportamento do crédito muda. Confirme pelo NCM do produto.'],
          ['Verificar DIFAL na compra interestadual para uso próprio', 'O diferencial de alíquota é despesa adicional que quase nunca aparece na cotação e estoura o orçamento depois.'],
          ['Conferir IPI nos itens industrializados ou importados'],
          ['Verificar incentivos aplicáveis ao item', 'Produtos com Processo Produtivo Básico podem ter IPI reduzido. Vale confirmar pelo modelo específico, não pela marca.'],
          ['Se for importação direta, montar o custo de nacionalização completo', 'II, IPI, PIS/COFINS-importação, ICMS-importação, taxa Siscomex, AFRMM no marítimo, armazenagem e despachante. O preço em dólar costuma ser menos da metade do custo final.'],
          ['Travar a variação cambial se a compra for em moeda estrangeira', 'Cotação em dólar sem trava é orçamento com data de validade de 24 horas.'],
          ['Calcular o custo efetivo de cada cotação, líquido de créditos', 'É o único número que pode ser comparado entre fornecedores. Preço de tela engana quando os regimes diferem.'],
          ['Validar todo o cálculo com a contabilidade antes de decidir', 'Uma hora de conversa com o contador custa menos que um DIFAL não previsto.'],
        ],
      },
      {
        name: '5. Custo total de propriedade',
        steps: [
          ['Somar o custo de aquisição líquido de impostos recuperáveis'],
          ['Acrescentar as licenças de software necessárias', 'Sistema operacional, antivírus, aplicativos. É o item mais esquecido e às vezes passa de 20% do total.'],
          ['Estimar o consumo elétrico ao longo da vida útil', 'Some o consumo da refrigeração junto. Em servidor ligado 24/7, a energia pode superar o preço da máquina.'],
          ['Considerar nobreak, rack, cabeamento e infraestrutura'],
          ['Estimar manutenção, peças de reposição e garantia estendida'],
          ['Calcular a depreciação contábil do ativo', 'Equipamentos de informática costumam ser depreciados em 5 anos. Confirme a taxa com a contabilidade — ela afeta o resultado do exercício.'],
          ['Estimar o valor residual ao fim da vida útil'],
          ['Comparar o TCO entre comprar, alugar e migrar para nuvem', 'Só a comparação em anos revela a resposta. Em 1 ano a nuvem quase sempre ganha; em 4, quase sempre perde.'],
        ],
      },
      {
        name: '6. Montar o orçamento',
        steps: [
          ['Montar a tabela comparativa com preço de tela e custo efetivo lado a lado', 'Mostrar os dois é o que prova que a análise foi feita — e evita a pergunta "mas o outro não era mais barato?".'],
          ['Apresentar pelo menos dois cenários de investimento', 'O suficiente e o recomendado. Cenário único vira aprovado ou reprovado, sem conversa.'],
          ['Explicitar as premissas do cálculo', 'Câmbio, regime tributário, vida útil, horas de uso. Premissa oculta é a origem de toda discussão posterior.'],
          ['Destacar os riscos de cada opção', 'Prazo de entrega, garantia, obsolescência, dependência de fornecedor único.'],
          ['Incluir uma reserva de contingência', '5 a 10% cobre a variação de câmbio, frete e o item que sempre falta.'],
          ['Escrever a recomendação em uma frase, com o motivo'],
        ],
      },
      {
        name: '7. Comprar e registrar',
        steps: [
          ['Negociar com as cotações concorrentes na mão', 'Cotação concorrente é o único argumento de desconto que funciona sem desgaste.'],
          ['Confirmar a especificação exata no pedido antes de aprovar', 'Modelo, código do fabricante e quantidade. Divergência de uma letra vira memória incompatível.'],
          ['Conferir a nota fiscal contra o pedido no recebimento', 'Valor, NCM, impostos destacados e descrição. Erro na nota é muito mais caro de corrigir depois.'],
          ['Testar o equipamento ainda dentro do prazo de troca', 'Teste de estresse nos primeiros dias: defeito de fábrica aparece cedo e o prazo de devolução é curto.'],
          ['Registrar o ativo no controle patrimonial', 'Número de série, data, valor, nota, local e responsável.'],
          ['Arquivar nota, garantia e cotações no mesmo lugar', 'Na hora de acionar a garantia, dois anos depois, é isso que salva.'],
          ['Anotar o preço praticado para referência futura', 'A série histórica é o que permite saber se a próxima cotação está boa ou não.'],
        ],
      },
    ],
  },

  {
    key: 'servidor-empresa',
    category: 'Hardware & Compras',
    title: 'Especificação e montagem do servidor da empresa',
    description:
      'Dimensionamento a partir da carga real, escolha de componentes com redundância, infraestrutura elétrica e térmica, montagem, testes de estresse e plano de backup antes de entrar em produção.',
    color: '#7c5cff',
    priority: 'critica',
    tags: ['hardware', 'servidor', 'infraestrutura'],
    groups: [
      {
        name: '1. Dimensionar pela carga real',
        steps: [
          ['Listar exatamente quais serviços o servidor vai rodar', 'Arquivos, banco, aplicação, virtualização, backup. Cada um puxa um recurso diferente e a mistura muda a prioridade.'],
          ['Medir a carga atual antes de especificar', 'Uso de CPU, RAM, IOPS de disco e banda de rede nos horários de pico. Especificar sem medir é chutar caro.'],
          ['Definir quantos usuários simultâneos e o crescimento previsto', 'Dimensione para o pico com folga, não para a média.'],
          ['Definir o nível de disponibilidade necessário', 'Quantas horas parado a empresa aguenta? A resposta define se precisa de fonte redundante, RAID, nobreak maior e máquina reserva.'],
          ['Definir o objetivo de recuperação', 'Quanto tempo até voltar (RTO) e quanto de dado pode ser perdido (RPO). Sem esses dois números, backup é só esperança.'],
        ],
      },
      {
        name: '2. Escolher os componentes',
        steps: [
          ['Escolher CPU por núcleos e frequência conforme a carga', 'Virtualização e banco pedem muitos núcleos; aplicação de thread única pede frequência alta. Otimizar o lado errado é dinheiro jogado fora.'],
          ['Usar memória ECC', 'Servidor sem ECC corrompe dado em silêncio. Confirme que a placa e a CPU suportam antes de comprar.'],
          ['Dimensionar a RAM com folga para cache', 'Banco e virtualização usam RAM como cache de disco. É o upgrade com melhor retorno por real gasto.'],
          ['Definir o esquema de discos e o nível de RAID', 'RAID 1 para o sistema, RAID 10 quando precisa de desempenho com segurança. RAID 5 em disco grande tem risco real de falhar durante a reconstrução.'],
          ['Escolher SSD com resistência adequada à escrita', 'SSD de consumo em servidor de banco morre em meses. Confira o TBW/DWPD e a presença de proteção contra queda de energia.'],
          ['Deixar RAID e disco reserva já provisionados', 'Disco sobressalente na prateleira, comprado junto. Descobrir que o modelo saiu de linha durante uma falha é o pior momento possível.'],
          ['Escolher fonte redundante se a disponibilidade exigir'],
          ['Definir a rede', 'Velocidade da placa, agregação de links e se o switch realmente entrega. Gargalo de rede anula qualquer investimento em disco.'],
          ['Verificar a compatibilidade do sistema operacional com o hardware', 'Confira a lista de compatibilidade da controladora RAID e das placas de rede antes, não depois.'],
        ],
      },
      {
        name: '3. Infraestrutura',
        steps: [
          ['Calcular a carga elétrica total e dimensionar o nobreak', 'Some todos os equipamentos do rack. Dimensione pela potência real e pela autonomia necessária para desligar com segurança.'],
          ['Configurar o desligamento automático pelo nobreak', 'Nobreak que só segura a queda mas não desliga o servidor ordenadamente corrompe dado do mesmo jeito.'],
          ['Verificar o circuito elétrico e o aterramento', 'Circuito dedicado e aterramento adequado. É a causa de falha mais silenciosa e mais destrutiva.'],
          ['Dimensionar a refrigeração do ambiente', 'Todo watt consumido vira calor. Sala fechada sem climatização derruba o servidor no primeiro dia quente.'],
          ['Definir a fixação: rack, gabinete e organização de cabos'],
          ['Garantir acesso físico controlado ao equipamento'],
        ],
      },
      {
        name: '4. Montar e instalar',
        steps: [
          ['Montar com pulseira antiestática e sobre superfície adequada'],
          ['Conferir o assentamento de CPU, memória e conectores de força antes do primeiro boot'],
          ['Atualizar BIOS/firmware antes de instalar o sistema', 'Atualizar depois, com o servidor em produção, exige janela de parada que ninguém vai autorizar.'],
          ['Configurar o RAID antes da instalação do sistema'],
          ['Instalar o sistema operacional e aplicar todas as atualizações'],
          ['Configurar o acesso remoto de gerenciamento', 'IPMI, iDRAC, iLO ou equivalente. É o que permite resolver problema sem ir até o servidor às 2 h da manhã.'],
          ['Documentar todas as senhas em cofre de senhas', 'Senha de gerenciamento anotada em papel na gaveta é o mesmo que não ter senha.'],
        ],
      },
      {
        name: '5. Testar antes de produção',
        steps: [
          ['Rodar teste de estresse de CPU e memória por 24 h', 'Memória com defeito passa no boot e falha sob carga. Vinte e quatro horas de teste evitam meses de problema fantasma.'],
          ['Testar a taxa de transferência e o IOPS dos discos', 'Compare com o esperado. Controladora mal configurada entrega uma fração do desempenho e ninguém percebe.'],
          ['Monitorar a temperatura sob carga total'],
          ['Simular a falha de um disco e acompanhar a reconstrução', 'Descobrir que o RAID não reconstrói durante uma falha real é o pior cenário possível.'],
          ['Simular queda de energia e verificar o desligamento pelo nobreak'],
          ['Testar a restauração completa de um backup', 'Backup nunca testado não é backup. A única prova é restaurar de verdade em outro equipamento.'],
          ['Medir o tempo real de recuperação e comparar com o RTO definido'],
        ],
      },
      {
        name: '6. Entrar em produção',
        steps: [
          ['Configurar monitoramento com alerta', 'Disco, temperatura, memória, serviços e estado do RAID. Alerta que chega no celular, não em log que ninguém lê.'],
          ['Configurar a rotina de backup e verificar a primeira execução'],
          ['Garantir cópia de backup fora do local', 'Backup no mesmo prédio não protege contra incêndio, furto nem alagamento.'],
          ['Documentar a configuração completa', 'Endereços, serviços, credenciais, esquema de discos, procedimento de restauração. Escrita para alguém que não é você.'],
          ['Definir a janela de manutenção e a rotina de atualização'],
          ['Registrar o servidor no controle patrimonial e agendar a revisão da garantia'],
          ['Agendar a revisão de capacidade em 6 meses', 'Serve para descobrir o gargalo antes que ele vire chamado urgente.'],
        ],
      },
    ],
  },
]

/** Converte um modelo em um fluxo pronto para salvar. */
export function templateToWorkflow(tpl, overrides = {}) {
  const steps = []
  tpl.groups.forEach((g) => {
    g.steps.forEach(([title, note]) => {
      steps.push({ id: uid(), title, note: note || '', group: g.name, done: false })
    })
  })

  return {
    id: uid(),
    title: tpl.title,
    description: tpl.description,
    status: 'planejado',
    priority: tpl.priority || 'media',
    color: tpl.color,
    tags: [...tpl.tags],
    start: '',
    end: '',
    steps,
    templateKey: tpl.key,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    ...overrides,
  }
}

export function templateStats(tpl) {
  return {
    groups: tpl.groups.length,
    steps: tpl.groups.reduce((n, g) => n + g.steps.length, 0),
  }
}

export function findTemplate(key) {
  return TEMPLATES.find((t) => t.key === key)
}
