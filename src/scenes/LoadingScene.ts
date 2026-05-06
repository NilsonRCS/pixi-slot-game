import { Graphics, Text, TextStyle } from 'pixi.js';
import { BaseScene } from './BaseScene';
import { AssetLoader } from '../core/AssetLoader';

export class LoadingScene extends BaseScene {
  private progressBar!: Graphics;
  private progressFill!: Graphics;
  private label!: Text;
  private onComplete: () => void;

  constructor(onComplete: () => void) {
    super();
    this.onComplete = onComplete;
  }

  public async init(): Promise<void> {
    const bg = new Graphics();
    bg.rect(0, 0, 1920, 1080).fill(0x1a1a2e);
    this.container.addChild(bg);

    const style = new TextStyle({ fill: '#ffffff', fontSize: 32 });
    this.label = new Text({ text: 'Carregando...', style });
    this.label.anchor.set(0.5);
    this.label.position.set(960, 500);
    this.container.addChild(this.label);

    this.progressBar = new Graphics();
    this.progressBar.rect(660, 540, 600, 20).fill(0x333355);
    this.container.addChild(this.progressBar);

    this.progressFill = new Graphics();
    this.container.addChild(this.progressFill);

    await AssetLoader.load((progress) => this.updateProgress(progress));
    this.updateProgress(1);

    setTimeout(() => this.onComplete(), 500);
  }

  private updateProgress(progress: number): void {
    this.progressFill.clear();
    this.progressFill.rect(660, 540, 600 * progress, 20).fill(0x6644ff);
  }

  public update(_delta: number): void {}

  public destroy(): void {
    this.container.destroy({ children: true });
  }
}
