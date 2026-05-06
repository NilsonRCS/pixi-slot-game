import { Graphics, Sprite, Text, TextStyle, Texture } from 'pixi.js';
import { BaseScene } from './BaseScene';
import { AssetLoader } from '../core/AssetLoader';
import { GAME_CONFIG } from '../config/GameConfig';

const W = GAME_CONFIG.design.width;
const H = GAME_CONFIG.design.height;

export class LoadingScene extends BaseScene {
  private progressFill!: Graphics;
  private onComplete: () => void;

  constructor(onComplete: () => void) {
    super();
    this.onComplete = onComplete;
  }

  public async init(): Promise<void> {
    // Fundo sólido inicial (antes do preloader carregar)
    const solidBg = new Graphics();
    solidBg.rect(0, 0, W, H).fill(0x1a1a2e);
    this.container.addChild(solidBg);

    await AssetLoader.load((progress) => {
      // Tenta exibir o preloader assim que estiver disponível
      const tex = Texture.from('assets/preloader.png');
      if (tex && tex.width > 1) {
        if (!this.container.children.find(c => c.label === 'preloader_bg')) {
          const preloaderBg = new Sprite(tex);
          preloaderBg.label = 'preloader_bg';
          preloaderBg.width = W;
          preloaderBg.height = H;
          this.container.addChildAt(preloaderBg, 1);
        }
      }
      this.updateProgress(progress);
    });

    this.updateProgress(1);
    setTimeout(() => this.onComplete(), 400);
  }

  private buildOverlay(): void {
    // Barra de progresso centralizada
    const barW = Math.round(W * 0.4);
    const barH = 18;
    const barX = (W - barW) / 2;
    const barY = H - 120;

    const bg = new Graphics();
    bg.roundRect(barX, barY, barW, barH, 9).fill({ color: 0x000000, alpha: 0.5 });
    this.container.addChild(bg);

    this.progressFill = new Graphics();
    this.container.addChild(this.progressFill);

    const style = new TextStyle({ fill: '#ffffff', fontSize: 26, fontFamily: 'Arial' });
    const label = new Text({ text: 'Carregando...', style });
    label.anchor.set(0.5);
    label.position.set(W / 2, barY - 36);
    this.container.addChild(label);
  }

  private updateProgress(progress: number): void {
    if (!this.progressFill) this.buildOverlay();

    const barW = Math.round(W * 0.4);
    const barH = 18;
    const barX = (W - barW) / 2;
    const barY = H - 120;

    this.progressFill.clear();
    this.progressFill
      .roundRect(barX, barY, barW * Math.min(progress, 1), barH, 9)
      .fill(0x6644ff);
  }

  public update(_delta: number): void {}

  public destroy(): void {
    this.container.destroy({ children: true });
  }
}
