import { Container, Graphics, Text, TextStyle } from 'pixi.js';
import { PAY_LINES } from '../config/PayTable';
import { GAME_CONFIG } from '../config/GameConfig';
import {
  REELS_ORIGIN_X,
  REELS_ORIGIN_Y,
  REELS_WINDOW_WIDTH,
} from './ReelsView';

const { symbolSize } = GAME_CONFIG.reels;

const LINE_COLORS = [0xffd166, 0x7ef29a, 0x7fd8ff, 0xff8fab, 0xc9a0ff];

const INDICATOR_W = 48;
const INDICATOR_H = 26;
const GAP_X = 12; // distância da borda do reel-window

export class PaylineIndicators {
  public container: Container;

  constructor() {
    this.container = new Container();
    this.build();
  }

  private build(): void {
    const labelStyle = new TextStyle({
      fill: '#ffffff',
      fontSize: 15,
      fontFamily: 'Arial',
      fontWeight: 'bold',
    });

    for (let i = 0; i < PAY_LINES.length; i++) {
      const line = PAY_LINES[i];
      const color = LINE_COLORS[i];

      // Linha de referência usa o índice de row no primeiro reel (esquerda)
      // e no último reel (direita) para posicionar o indicador.
      const rowLeft  = line[0];
      const rowRight = line[line.length - 1];

      const yLeft  = REELS_ORIGIN_Y + rowLeft  * symbolSize + symbolSize / 2;
      const yRight = REELS_ORIGIN_Y + rowRight * symbolSize + symbolSize / 2;

      // ── Indicador esquerdo ──────────────────────────────────────────────
      this.addIndicator(
        REELS_ORIGIN_X - GAP_X - INDICATOR_W,
        yLeft - INDICATOR_H / 2,
        color,
        String(i + 1),
        labelStyle,
      );

      // ── Indicador direito ───────────────────────────────────────────────
      this.addIndicator(
        REELS_ORIGIN_X + REELS_WINDOW_WIDTH + GAP_X,
        yRight - INDICATOR_H / 2,
        color,
        String(i + 1),
        labelStyle,
      );
    }
  }

  private addIndicator(
    x: number, y: number,
    color: number, label: string,
    style: TextStyle,
  ): void {
    const bg = new Graphics();
    bg.roundRect(x, y, INDICATOR_W, INDICATOR_H, 6)
      .fill({ color, alpha: 0.9 })
      .stroke({ color: 0xffffff, width: 1, alpha: 0.4 });

    const t = new Text({ text: label, style });
    t.anchor.set(0.5);
    t.position.set(x + INDICATOR_W / 2, y + INDICATOR_H / 2);

    this.container.addChild(bg);
    this.container.addChild(t);
  }

  public destroy(): void {
    this.container.destroy({ children: true });
  }
}
