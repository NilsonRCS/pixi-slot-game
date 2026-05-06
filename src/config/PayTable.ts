export type PayLine = number[];

// Cada linha é um array de índices de linha por reel [reel0row, reel1row, reel2row, reel3row, reel4row]
export const PAY_LINES: PayLine[] = [
  [1, 1, 1, 1, 1], // linha do meio (principal)
  [0, 0, 0, 0, 0], // linha de cima
  [2, 2, 2, 2, 2], // linha de baixo
  [0, 1, 2, 1, 0], // V
  [2, 1, 0, 1, 2], // V invertido
];

// Multiplicadores por símbolo [símbolo]: [3 iguais, 4 iguais, 5 iguais]
export const PAY_TABLE: Record<number, number[]> = {
  0: [2, 5, 10],   // cherry
  1: [3, 8, 15],   // lemon
  2: [4, 10, 20],  // orange
  3: [5, 15, 30],  // bell
  4: [10, 25, 50], // bar
  5: [20, 50, 100],// seven
};
