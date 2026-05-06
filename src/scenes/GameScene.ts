import { BaseScene } from './BaseScene';
import { GameController } from '../core/GameController';
import { GameModel } from '../core/GameModel';

export class GameScene extends BaseScene {
  private model: GameModel;
  private controller: GameController;

  constructor() {
    super();
    this.model = new GameModel();
    this.controller = new GameController(this.model);
  }

  public async init(): Promise<void> {
    // Componentes serão adicionados aqui nas próximas etapas:
    // - ReelsView
    // - UIView (botão spin, saldo, aposta)
    // - WinView
  }

  public update(_delta: number): void {}

  public destroy(): void {
    this.container.destroy({ children: true });
  }

  public async spin(): Promise<void> {
    await this.controller.spin();
  }
}
