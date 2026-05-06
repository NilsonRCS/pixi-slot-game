import { GameModel } from './GameModel';
import { evaluateWins } from '../config/PayTable';
import type { WinResult } from '../config/PayTable';
import { GAME_CONFIG } from '../config/GameConfig';

export type GameState = 'idle' | 'spinning' | 'result' | 'win';

export class GameController {
  private model: GameModel;
  private state: GameState = 'idle';

  constructor(model: GameModel) {
    this.model = model;
  }

  public getState(): GameState {
    return this.state;
  }

  public async spin(): Promise<void> {
    if (!this.model.canSpin()) return;

    this.state = 'spinning';
    this.model.isSpinning = true;
    this.model.deductBet();

    const result = this.generateResult();
    this.model.lastResult = result;
    this.model.isSpinning = false;

    // Avalia ganhos usando betPerLine como multiplicador base
    const wins = evaluateWins(result, this.model.betPerLine);
    this.model.lastWins = wins;

    const totalPayout = wins.reduce((sum, w) => sum + w.payout, 0);
    if (totalPayout > 0) {
      this.model.addWin(totalPayout);
      this.state = 'win';
    } else {
      this.state = 'result';
    }
  }

  private generateResult(): number[][] {
    const count = GAME_CONFIG.symbols.count;
    return Array.from({ length: GAME_CONFIG.reels.count }, () =>
      Array.from({ length: GAME_CONFIG.reels.rows }, () =>
        Math.floor(Math.random() * count)
      )
    );
  }

  public resolveWin(): void {
    this.state = 'idle';
  }

  public getLastWins(): WinResult[] {
    return this.model.lastWins;
  }

  public getTotalWin(): number {
    return this.model.lastWins.reduce((sum, w) => sum + w.payout, 0);
  }
}
