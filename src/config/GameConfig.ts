export const GAME_CONFIG = {
  design: {
    width: 1920,
    height: 1080,
  },

  reels: {
    count: 6,
    rows: 5,
    symbolSize: 130,
    spinDuration: 1500, // ms
    stopDelay: 200,     // ms entre cada reel parando
  },

  symbols: {
    count: 10,
    // Ordem: maior → menor valor (reflete peso na paytable)
    names: [
      'bank',
      'safe',
      'cell',
      'dynamit',
      'handcuffs',
      'littera_a',
      'littera_j',
      'littera_k',
      'littera_q',
      'number_10',
    ] as const,
  },

  bet: {
    min: 1,
    max: 50,
    default: 1,
    lines: 5, // paylines ativas (fixo)
  },

  balance: {
    initial: 1000,
  },

  fox: {
    scaleX: -1.0,      // escala horizontal (negativo = espelhada)
    scaleY: 0.7,       // escala vertical
    offsetX: 250,     // distância horizontal do lado direito dos rolos
    offsetY: 10,      // distância vertical do fundo dos rolos
  },
} as const;

// Tipo helper — permite usar symbol name como string literal em outros módulos
export type SymbolName = typeof GAME_CONFIG.symbols.names[number];
