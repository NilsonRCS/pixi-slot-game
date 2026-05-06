export const GAME_CONFIG = {
  design: {
    width: 1920,
    height: 1080,
  },

  reels: {
    count: 5,
    rows: 3,
    symbolSize: 150,
    spinDuration: 1500, // ms
    stopDelay: 200,     // ms entre cada reel parando
  },

  symbols: {
    count: 6,
    names: ['cherry', 'lemon', 'orange', 'bell', 'bar', 'seven'],
  },

  bet: {
    min: 1,
    max: 100,
    default: 1,
  },

  balance: {
    initial: 1000,
  },
} as const;
