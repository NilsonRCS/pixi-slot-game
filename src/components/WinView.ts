import { AnimatedSprite, Container, Graphics, Texture } from 'pixi.js';
import { gsap } from 'gsap';
import { PAY_LINES } from '../config/PayTable';
import type { WinResult } from '../config/PayTable';
import { GAME_CONFIG } from '../config/GameConfig';
import { AssetLoader } from '../core/AssetLoader';
import type { WinTier } from '../core/AssetLoader';
import {
  REELS_GAP,
  REELS_ORIGIN_X,
  REELS_ORIGIN_Y,
  REELS_WINDOW_WIDTH,
} from './ReelsView';

const LINE_COLORS = [0xffd166, 0x7ef29a, 0x7fd8ff, 0xff8fab, 0xc9a0ff];

export class WinView {
  public container: Container;

  constructor() {
    this.container = new Container();
  }

  public async showWins(wins: WinResult[], totalWin: number, bet: number): Promise<void> {
    this.clear();
    if (wins.length === 0) return;

    this.drawWinningLines(wins);
    this.animateLines();
    await this.playWinBanner(this.resolveTier(totalWin, bet));

    // Mantem uma pequena pausa apos o banner para leitura visual.
    await new Promise<void>((resolve) => setTimeout(resolve, 350));
    this.clear();
  }

  public clear(): void {
    gsap.killTweensOf(this.container.children);
    this.container.removeChildren();
  }

  public destroy(): void {
    this.clear();
    this.container.destroy({ children: true });
  }

  private drawWinningLines(wins: WinResult[]): void {
    for (let i = 0; i < wins.length; i++) {
      const win = wins[i];
      const payLine = PAY_LINES[win.lineIndex];
      const color = LINE_COLORS[i % LINE_COLORS.length];

      const line = new Graphics();

      for (let reel = 0; reel < win.count; reel++) {
        const { x, y } = this.getSymbolCenter(reel, payLine[reel]);
        if (reel === 0) line.moveTo(x, y);
        else line.lineTo(x, y);
      }
      line.stroke({ width: 8, color, alpha: 0.9, cap: 'round', join: 'round' });

      const glow = new Graphics();
      for (let reel = 0; reel < win.count; reel++) {
        const { x, y } = this.getSymbolCenter(reel, payLine[reel]);
        glow.circle(x, y, 14).fill({ color, alpha: 0.85 });
      }

      this.container.addChild(line);
      this.container.addChild(glow);
    }
  }

  private animateLines(): void {
    this.container.children.forEach((child, idx) => {
      child.alpha = 0.25;
      gsap.to(child, {
        alpha: idx % 2 === 0 ? 1 : 0.85,
        duration: 0.35,
        repeat: 6,
        yoyo: true,
        ease: 'sine.inOut',
      });
    });
  }

  private async playWinBanner(tier: WinTier): Promise<void> {
    const textures = AssetLoader.getWinFramePaths(tier).map((path) => Texture.from(path));
    const banner = new AnimatedSprite(textures);

    banner.anchor.set(0.5);
    banner.position.set(GAME_CONFIG.design.width / 2, 180);
    banner.animationSpeed = 0.55;
    banner.loop = false;
    banner.scale.set(0.9);

    this.container.addChild(banner);

    gsap.fromTo(
      banner.scale,
      { x: 0.6, y: 0.6 },
      { x: 0.9, y: 0.9, duration: 0.22, ease: 'back.out(1.7)' }
    );

    await new Promise<void>((resolve) => {
      banner.onComplete = () => {
        banner.destroy();
        resolve();
      };
      banner.play();
    });
  }

  private resolveTier(totalWin: number, bet: number): WinTier {
    const ratio = bet > 0 ? totalWin / bet : 0;
    if (ratio >= 40) return 'total';
    if (ratio >= 25) return 'super';
    if (ratio >= 12) return 'mega';
    return 'big';
  }

  private getSymbolCenter(reelIndex: number, rowIndex: number): { x: number; y: number } {
    const symbolSize = GAME_CONFIG.reels.symbolSize;
    const x = REELS_ORIGIN_X + reelIndex * (symbolSize + REELS_GAP) + symbolSize / 2;
    const y = REELS_ORIGIN_Y + rowIndex * symbolSize + symbolSize / 2;

    // Clamp horizontal para garantir que nunca desenhe fora da janela de reels.
    return { x: Math.min(x, REELS_ORIGIN_X + REELS_WINDOW_WIDTH - symbolSize / 2), y };
  }
}
