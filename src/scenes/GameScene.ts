import { Container } from 'pixi.js';
import { BaseScene } from './BaseScene';
import { GameController } from '../core/GameController';
import { GameModel } from '../core/GameModel';
import { Application } from '../core/Application';
import { ReelsView } from '../components/ReelsView';
import { UIView } from '../components/UIView';
import { WinView } from '../components/WinView';
import { PaylineIndicators } from '../components/PaylineIndicators';
import { GAME_CONFIG } from '../config/GameConfig';

export class GameScene extends BaseScene {
  private model: GameModel;
  private controller: GameController;
  private reelsView!: ReelsView;
  private uiView!: UIView;
  private winView!: WinView;
  private paylineIndicators!: PaylineIndicators;

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
    this.reelsLayer.addChild(this.reelsView.container);
    this.maskLayer.addChild(this.reelsView.mask);
    this.reelsView.container.mask = this.reelsView.mask;

    // ── UI ────────────────────────────────────────────────────────────────────
    this.uiView = new UIView();
    this.uiLayer.addChild(this.uiView.container);

    this.winView = new WinView();
    this.winLayer.addChild(this.winView.container);

    this.paylineIndicators = new PaylineIndicators();
    this.uiLayer.addChild(this.paylineIndicators.container);

    this.uiView.setBalance(this.model.balance);
    this.uiView.setLance(this.model.totalBet);
    this.uiView.setBet(this.model.betPerLine);
    this.uiView.setWin(0);

    this.uiView.onSpin(() => this.spin());
    this.uiView.onBetChange((delta) => this.changeBet(delta));
  }

  public update(_delta: number): void {}

  public destroy(): void {
    this.reelsView?.destroy();
    this.uiView?.destroy();
    this.winView?.destroy();
    this.paylineIndicators?.destroy();
    this.backgroundLayer.removeChildren();
    this.reelsLayer.removeChildren();
    this.maskLayer.removeChildren();
    this.uiLayer.removeChildren();
    this.winLayer.removeChildren();
    this.overlayLayer.removeChildren();
    this.container.destroy({ children: true });
  }

  private changeBet(delta: number): void {
    const next = this.model.betPerLine + delta;
    if (next < GAME_CONFIG.bet.min || next > GAME_CONFIG.bet.max) return;
    this.model.betPerLine = next;
    this.uiView.setBet(this.model.betPerLine);
    this.uiView.setLance(this.model.totalBet);
  }

  public async spin(): Promise<void> {
    if (!this.model.canSpin()) return;

    this.uiView.setSpinEnabled(false);
    this.uiView.setWin(0);

    await this.controller.spin();

    if (this.model.lastResult) {
      await this.reelsView.spin(this.model.lastResult);
    }

    const wins = this.controller.getLastWins();
    const totalWin = this.controller.getTotalWin();
    if (totalWin > 0) {
      await this.winView.showWins(wins, totalWin, this.model.betPerLine);
    }

    this.uiView.setWin(totalWin);
    this.uiView.setBalance(this.model.balance);
    this.uiView.setLance(this.model.totalBet);

    this.controller.resolveWin();
    this.uiView.setSpinEnabled(true);
  }
}
