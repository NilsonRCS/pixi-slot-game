import { Container } from 'pixi.js';
import { BaseScene } from './BaseScene';
import { GameController } from '../core/GameController';
import { GameModel } from '../core/GameModel';
import { Application } from '../core/Application';
import { ReelsView } from '../components/ReelsView';

export class GameScene extends BaseScene {
  private model: GameModel;
  private controller: GameController;
  private reelsView!: ReelsView;

  // Referências às camadas globais da Application
  public backgroundLayer: Container;
  public reelsLayer: Container;
  public maskLayer: Container;
  public uiLayer: Container;
  public winLayer: Container;
  public overlayLayer: Container;

  constructor() {
    super();
    this.model = new GameModel();
    this.controller = new GameController(this.model);

    const app = Application.getInstance();
    this.backgroundLayer = app.backgroundLayer;
    this.reelsLayer = app.reelsLayer;
    this.maskLayer = app.maskLayer;
    this.uiLayer = app.uiLayer;
    this.winLayer = app.winLayer;
    this.overlayLayer = app.overlayLayer;
  }

  public async init(): Promise<void> {
    // ── Rolos ─────────────────────────────────────────────────────────────────
    this.reelsView = new ReelsView();

    // Container dos reels vai para reelsLayer
    this.reelsLayer.addChild(this.reelsView.container);

    // Máscara vai para maskLayer e é aplicada ao container dos reels
    this.maskLayer.addChild(this.reelsView.mask);
    this.reelsView.container.mask = this.reelsView.mask;

    // TODO próximas etapas:
    // this.backgroundLayer  → cenário estático
    // this.uiLayer          → UIView (botões, saldo, aposta)
    // this.winLayer         → WinView (animações de vitória, linhas)
    // this.overlayLayer     → popups, bonus, loading
  }

  public update(_delta: number): void {}

  public destroy(): void {
    this.reelsView?.destroy();
    this.backgroundLayer.removeChildren();
    this.reelsLayer.removeChildren();
    this.maskLayer.removeChildren();
    this.uiLayer.removeChildren();
    this.winLayer.removeChildren();
    this.overlayLayer.removeChildren();
    this.container.destroy({ children: true });
  }

  public async spin(): Promise<void> {
    if (!this.model.canSpin()) return;

    await this.controller.spin();

    if (this.model.lastResult) {
      await this.reelsView.spin(this.model.lastResult);
    }

    this.controller.resolveWin();
  }
}
