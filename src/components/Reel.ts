import { Container } from 'pixi.js';
import { gsap } from 'gsap';
import { Symbol } from './Symbol';
import { GAME_CONFIG } from '../config/GameConfig';
import { Application } from '../core/Application';

const SYMBOL_SIZE = GAME_CONFIG.reels.symbolSize;
const ROWS        = GAME_CONFIG.reels.rows;

// Strip: 1 acima + ROWS visíveis + 1 abaixo
const STRIP_SIZE = ROWS + 2;

export class Reel {
  /** Container externo — posicionado por ReelsView, NUNCA movido */
  public container: Container;
  /** Container interno — scrollado pelo Ticker e pelo GSAP */
  private strip: Container;
  private symbols: Symbol[] = [];
  private spinning = false;
  private spinSpeed = 18; // px/frame ≈ 1080px/s a 60fps
  private tickerCallback: () => void;

  constructor() {
    this.container = new Container();
    this.strip = new Container();
    this.container.addChild(this.strip);

    for (let i = 0; i < STRIP_SIZE; i++) {
      const sym = new Symbol(this.randomId());
      // i=0 acima (y negativo), i=1..ROWS visíveis, i=ROWS+1 abaixo
      sym.container.y = (i - 1) * SYMBOL_SIZE;
      this.symbols.push(sym);
      this.strip.addChild(sym.container);
    }

    this.tickerCallback = () => this.onTick();
  }

  // ─── Ticker ────────────────────────────────────────────────────────────────

  private onTick(): void {
    if (!this.spinning) return;

    this.strip.y += this.spinSpeed;

    if (this.strip.y >= SYMBOL_SIZE) {
      this.strip.y -= SYMBOL_SIZE;
      this.recycle();
    }
  }

  /** Rotação circular: símbolo que sai pela base entra pelo topo */
  private recycle(newId?: number): void {
    const bottom = this.symbols.pop()!;
    bottom.setSymbol(newId ?? this.randomId());
    this.symbols.unshift(bottom);

    for (let i = 0; i < this.symbols.length; i++) {
      this.symbols[i].container.y = (i - 1) * SYMBOL_SIZE;
    }
  }

  // ─── API pública ───────────────────────────────────────────────────────────

  public spin(): void {
    this.spinning = true;
    Application.getInstance().app.ticker.add(this.tickerCallback);
  }

  /**
   * Para o reel exibindo `result` [top, mid, bottom].
   * Anima strip.y → 0 (o container externo não é tocado).
   */
  public stop(result: number[]): Promise<void> {
    return new Promise<void>((resolve) => {
      this.spinning = false;
      Application.getInstance().app.ticker.remove(this.tickerCallback);

      const finalize = () => {
        // Escreve resultado nos slots visíveis: índices 1, 2, 3
        for (let r = 0; r < ROWS; r++) {
          this.symbols[1 + r].setSymbol(result[r]);
        }

        gsap.to(this.strip, {
          y: 0,
          duration: 0.4,
          ease: 'power3.out',
          onComplete: resolve,
        });
      };

      // Se passou da metade do clique, completa-o antes de parar
      if (this.strip.y > SYMBOL_SIZE * 0.5) {
        gsap.to(this.strip, {
          y: SYMBOL_SIZE,
          duration: 0.12,
          ease: 'none',
          onComplete: () => {
            this.strip.y -= SYMBOL_SIZE;
            this.recycle();
            finalize();
          },
        });
      } else {
        finalize();
      }
    });
  }

  public destroy(): void {
    Application.getInstance().app.ticker.remove(this.tickerCallback);
    this.container.destroy({ children: true });
  }

  // ─── Helpers ───────────────────────────────────────────────────────────────

  private randomId(): number {
    return Math.floor(Math.random() * GAME_CONFIG.symbols.count);
  }
}
