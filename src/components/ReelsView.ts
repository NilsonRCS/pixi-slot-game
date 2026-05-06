import { Container, Graphics } from 'pixi.js';
import { Reel } from './Reel';
import { GAME_CONFIG } from '../config/GameConfig';

const { count, rows, symbolSize, spinDuration, stopDelay } = GAME_CONFIG.reels;

export const REELS_GAP = 10; // px entre reels
export const REELS_WINDOW_WIDTH = count * symbolSize + (count - 1) * REELS_GAP;
export const REELS_WINDOW_HEIGHT = rows * symbolSize;
export const REELS_ORIGIN_X = (GAME_CONFIG.design.width - REELS_WINDOW_WIDTH) / 2;
export const REELS_ORIGIN_Y = (GAME_CONFIG.design.height - REELS_WINDOW_HEIGHT) / 2;

export class ReelsView {
  /** Container com todos os rolos — adicionar a reelsLayer */
  public container: Container;

  /**
   * Máscara retangular que recorta os símbolos fora da janela visível.
   * Deve ser adicionada a maskLayer E atribuída a container.mask.
   *
   * Exemplo em GameScene.init():
   *   this.reelsLayer.addChild(reelsView.container);
   *   this.maskLayer.addChild(reelsView.mask);
   *   reelsView.container.mask = reelsView.mask;
   */
  public mask: Graphics;

  private reels: Reel[] = [];

  constructor() {
    this.container = new Container();

    // Máscara retangular da janela de símbolos
    this.mask = new Graphics();
    this.mask.rect(REELS_ORIGIN_X, REELS_ORIGIN_Y, REELS_WINDOW_WIDTH, REELS_WINDOW_HEIGHT);
    this.mask.fill({ color: 0xffffff });

    // Cria cada reel e posiciona lado a lado
    for (let i = 0; i < count; i++) {
      const reel = new Reel();
      reel.container.x = REELS_ORIGIN_X + i * (symbolSize + REELS_GAP);
      reel.container.y = REELS_ORIGIN_Y;
      this.container.addChild(reel.container);
      this.reels.push(reel);
    }
  }

  /**
   * Inicia o spin em todos os reels e para cada um sequencialmente
   * conforme o resultado chega.
   *
   * @param result matriz [reel][row] com os ids dos símbolos finais
   */
  public async spin(result: number[][]): Promise<void> {
    // Todos os reels começam ao mesmo tempo
    this.reels.forEach(reel => reel.spin());

    // Cada reel para após spinDuration + delay acumulado por reel
    const stops = this.reels.map((reel, i) =>
      new Promise<void>(resolve => {
        setTimeout(async () => {
          await reel.stop(result[i]);
          resolve();
        }, spinDuration + i * stopDelay);
      })
    );

    await Promise.all(stops);
  }

  public destroy(): void {
    this.reels.forEach(r => r.destroy());
    this.mask.destroy();
    this.container.destroy({ children: true });
  }
}
