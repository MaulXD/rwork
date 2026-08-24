// v2: modelo de etapas ganhou `group` e `note`; a virada da chave descarta
// os fluxos de exemplo genéricos da v1 e recarrega os modelos reais.
export const STORAGE_KEY = 'rwork.state.v2'

export const STATUS = {
  ideia: { label: 'Ideia', color: '#8ea3cc' },
  planejado: { label: 'Planejado', color: '#7c5cff' },
  ativo: { label: 'Em andamento', color: '#22e6ff' },
  pausado: { label: 'Pausado', color: '#ffb547' },
  concluido: { label: 'Concluído', color: '#5dff9b' },
}

export const STATUS_ORDER = ['ideia', 'planejado', 'ativo', 'pausado', 'concluido']

export const PRIORITY = {
  baixa: { label: 'Baixa', color: '#8ea3cc' },
  media: { label: 'Média', color: '#22e6ff' },
  alta: { label: 'Alta', color: '#ffb547' },
  critica: { label: 'Crítica', color: '#ff5c7a' },
}

export const PRIORITY_ORDER = ['baixa', 'media', 'alta', 'critica']

/** Paleta elétrica para o acento de cada fluxo. */
export const PALETTE = [
  '#22e6ff', // ciano
  '#7c5cff', // violeta
  '#ff4fd8', // magenta
  '#5dff9b', // verde neon
  '#ffb547', // âmbar
  '#ff5c7a', // coral
  '#4d7cff', // azul elétrico
  '#b0ff3d', // lima
]

export const MONTHS_SHORT = [
  'jan', 'fev', 'mar', 'abr', 'mai', 'jun',
  'jul', 'ago', 'set', 'out', 'nov', 'dez',
]
