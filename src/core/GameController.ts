import { GameModel } from './GameModel';

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

    // Resultado simulado — substituir pela lógica real de paytable
    const result = this.generateResult();
    this.model.lastResult = result;

    // A view será responsável por escutar e animar
    // Aqui apenas registramos o estado ao concluir
    this.model.isSpinning = false;
    this.state = 'result';
  }

  private generateResult(): number[][] {
    const symbols = [0, 1, 2, 3, 4];
    return Array.from({ length: 5 }, () =>
      Array.from({ length: 3 }, () => symbols[Math.floor(Math.random() * symbols.length)])
    );
  }

  public resolveWin(): void {
    this.state = 'idle';
  }
}
