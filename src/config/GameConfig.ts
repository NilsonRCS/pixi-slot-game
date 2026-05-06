export const GAME_CONFIG = {
  design: {
    width: 1600,
    height: 900,
  },

  reels: {
    count: 6,
    rows: 5,
    symbolSize: 150,
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
} as const;

// Tipo helper — permite usar symbol name como string literal em outros módulos
export type SymbolName = typeof GAME_CONFIG.symbols.names[number];
