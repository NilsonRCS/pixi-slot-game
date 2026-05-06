import type { WinResult } from '../config/PayTable';
import { GAME_CONFIG } from '../config/GameConfig';

export class GameModel {
  public balance: number;
  public betPerLine: number;     // aposta por linha
  public isSpinning: boolean;
  public lastResult: number[][] | null;
  public lastWins: WinResult[];

  constructor() {
    this.balance = GAME_CONFIG.balance.initial;
    this.betPerLine = GAME_CONFIG.bet.default;
    this.isSpinning = false;
    this.lastResult = null;
    this.lastWins = [];
  }

  /** Aposta total por spin (betPerLine × paylines ativas) */
  public get totalBet(): number {
    return this.betPerLine * GAME_CONFIG.bet.lines;
  }

  public canSpin(): boolean {
    return !this.isSpinning && this.balance >= this.totalBet;
  }

  public deductBet(): void {
    this.balance -= this.totalBet;
  }

  public addWin(amount: number): void {
    this.balance += amount;
  }
}
