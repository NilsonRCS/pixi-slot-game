import { Container } from 'pixi.js';
import { gsap } from 'gsap';
import { Symbol } from './Symbol';
import { GAME_CONFIG } from '../config/GameConfig';
import { Application } from '../core/Application';

const SYMBOL_SIZE = GAME_CONFIG.reels.symbolSize;
const ROWS        = GAME_CONFIG.reels.rows;

// Strip layout: 1 símbolo acima da janela + ROWS visíveis + 1 abaixo
// Índices: [0]=acima  [1..ROWS]=visíveis  [ROWS+1]=abaixo
const STRIP_SIZE = ROWS + 2;
const ABOVE_IDX  = 0;          // índice do símbolo acima da janela

export class Reel {
  public container: Container;
  private strip: Symbol[] = [];
  private spinning = false;
  private spinSpeed = 18; // px/frame (≈ 1080px/s a 60fps)
  private tickerCallback: () => void;

  constructor() {
    this.container = new Container();

    for (let i = 0; i < STRIP_SIZE; i++) {
      const sym = new Symbol(this.randomId());
      // [0] fica 1 posição acima da janela (y negativo)
      sym.container.y = (i - 1) * SYMBOL_SIZE;
      this.strip.push(sym);
      this.container.addChild(sym.container);
    }

    this.tickerCallback = () => this.onTick();
  }

  // ─── Tick ──────────────────────────────────────────────────────────────────

  private onTick(): void {
    if (!this.spinning) return;

    this.container.y += this.spinSpeed;

    if (this.container.y >= SYMBOL_SIZE) {
      this.container.y -= SYMBOL_SIZE;
      this.recycle();
    }
  }

  /**
   * Rotação circular: o símbolo de baixo (sai pela base) reaparece no topo
   * com um id aleatório novo. O efeito visual é de novos símbolos entrando
   * pelo topo a cada "clique" de SYMBOL_SIZE pixels.
   *
   * Antes:  [above, row0, row1, row2, below]
   * Depois: [below(novo), above, row0, row1, row2]
   */
  private recycle(newId?: number): void {
    const bottom = this.strip.pop()!;
    bottom.setSymbol(newId ?? this.randomId());
    this.strip.unshift(bottom);

    for (let i = 0; i < this.strip.length; i++) {
      this.strip[i].container.y = (i - 1) * SYMBOL_SIZE;
    }
  }

  // ─── API pública ───────────────────────────────────────────────────────────

  public spin(): void {
    this.spinning = true;
    Application.getInstance().app.ticker.add(this.tickerCallback);
  }

  /**
   * Para o reel mostrando os símbolos `result` [top, mid, bottom].
   *
   * Fluxo:
   *   1. Se estiver perto do próximo "clique", completa ele suavemente.
   *   2. Posiciona os símbolos de resultado nos slots visíveis.
   *   3. GSAP ease-out para y=0 (posição de descanso limpa).
   */
  public stop(result: number[]): Promise<void> {
    return new Promise<void>((resolve) => {
      this.spinning = false;
      Application.getInstance().app.ticker.remove(this.tickerCallback);

      const finalize = () => {
        // Coloca resultado nos índices visíveis: [1, 2, 3]
        for (let r = 0; r < ROWS; r++) {
          this.strip[ABOVE_IDX + 1 + r].setSymbol(result[r]);
        }

        gsap.to(this.container, {
          y: 0,
          duration: 0.4,
          ease: 'power3.out',
          onComplete: resolve,
        });
      };

      // Se passou da metade do clique, completa o clique antes de parar
      if (this.container.y > SYMBOL_SIZE * 0.5) {
        gsap.to(this.container, {
          y: SYMBOL_SIZE,
          duration: 0.12,
          ease: 'none',
          onComplete: () => {
            this.container.y -= SYMBOL_SIZE;
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
    return Math.floor(Math.random() * GAME_CONFIG.symbols.names.length);
  }
}
