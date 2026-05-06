export type PayLine = number[];

// Cada linha é um array de índices de linha por reel [reel0row, reel1row, reel2row, reel3row, reel4row]
export const PAY_LINES: PayLine[] = [
  [1, 1, 1, 1, 1], // linha do meio (principal)
  [0, 0, 0, 0, 0], // linha de cima
  [2, 2, 2, 2, 2], // linha de baixo
  [0, 1, 2, 1, 0], // V
  [2, 1, 0, 1, 2], // V invertido
];

// Multiplicadores por símbolo id: [3 iguais, 4 iguais, 5 iguais]
// Ordem de símbolos: 0=bank 1=safe 2=cell 3=dynamit 4=handcuffs
//                   5=littera_a 6=littera_j 7=littera_k 8=littera_q 9=number_10
export const PAY_TABLE: Record<number, [number, number, number]> = {
  0: [20, 50, 100], // bank      — premium máximo
  1: [15, 40,  80], // safe
  2: [10, 25,  50], // cell
  3: [ 8, 20,  40], // dynamit
  4: [ 6, 15,  30], // handcuffs
  5: [ 4, 10,  20], // littera_a
  6: [ 3,  8,  15], // littera_j
  7: [ 3,  8,  15], // littera_k
  8: [ 2,  5,  10], // littera_q
  9: [ 2,  5,  10], // number_10 — menor pagamento
};

export interface WinResult {
  lineIndex: number;   // índice da PAY_LINES
  symbolId: number;    // símbolo que combinou
  count: number;       // quantos símbolos (3, 4 ou 5)
  payout: number;      // valor bruto (multiplicador × aposta)
}

/**
 * Avalia o resultado dos reels contra todas as paylines.
 * @param reelResult  matriz [reel][row] com symbolId em cada posição
 * @param bet         aposta atual
 */
export function evaluateWins(reelResult: number[][], bet: number): WinResult[] {
  const wins: WinResult[] = [];

  for (let li = 0; li < PAY_LINES.length; li++) {
    const line = PAY_LINES[li];
    const firstSymbol = reelResult[0][line[0]];
    let count = 1;

    for (let r = 1; r < reelResult.length; r++) {
      if (reelResult[r][line[r]] === firstSymbol) {
        count++;
      } else {
        break;
      }
    }

    if (count >= 3) {
      const multipliers = PAY_TABLE[firstSymbol];
      if (multipliers) {
        const payout = multipliers[count - 3] * bet;
        wins.push({ lineIndex: li, symbolId: firstSymbol, count, payout });
      }
    }
  }

  return wins;
}
