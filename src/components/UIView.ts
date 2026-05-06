import { Container, Graphics, Text, TextStyle } from 'pixi.js';
import { GAME_CONFIG } from '../config/GameConfig';

const W = GAME_CONFIG.design.width;
const H = GAME_CONFIG.design.height;

const LABEL_STYLE = new TextStyle({ fill: '#aabbcc', fontSize: 22, fontFamily: 'Arial' });
const VALUE_STYLE = new TextStyle({ fill: '#ffffff', fontSize: 32, fontFamily: 'Arial', fontWeight: 'bold' });
const WIN_STYLE   = new TextStyle({ fill: '#ffd700', fontSize: 32, fontFamily: 'Arial', fontWeight: 'bold' });

export class UIView {
  public container: Container;

  private balanceValue!: Text;
  private betValue!: Text;
  private winValue!: Text;
  private spinButton!: Container;
  private spinBg!: Graphics;
  private spinLabel!: Text;
  private onSpinCb: (() => void) | null = null;
  private onBetChangeCb: ((delta: number) => void) | null = null;

  constructor() {
    this.container = new Container();
    this.build();
  }

  // ─── Build ─────────────────────────────────────────────────────────────────

  private build(): void {
    // Painel inferior semitransparente
    const panel = new Graphics();
    panel.rect(0, H - 140, W, 140);
    panel.fill({ color: 0x0a0a1a, alpha: 0.85 });
    this.container.addChild(panel);

    // ── Saldo ──────────────────────────────────────────────────────────────
    this.addLabel('SALDO', 120, H - 100);
    this.balanceValue = this.addValue('0', 120, H - 58, VALUE_STYLE);

    // ── Aposta ─────────────────────────────────────────────────────────────
    this.addLabel('APOSTA', W / 2, H - 100);
    this.betValue = this.addValue('0', W / 2, H - 58, VALUE_STYLE);
    this.addBetButtons();

    // ── Ganho ──────────────────────────────────────────────────────────────
    this.addLabel('GANHO', W - 120, H - 100);
    this.winValue = this.addValue('0', W - 120, H - 58, WIN_STYLE);

    // ── Botão Spin ─────────────────────────────────────────────────────────
    this.buildSpinButton();
  }

  private addLabel(text: string, x: number, y: number): Text {
    const t = new Text({ text, style: LABEL_STYLE });
    t.anchor.set(0.5);
    t.position.set(x, y);
    this.container.addChild(t);
    return t;
  }

  private addValue(text: string, x: number, y: number, style: TextStyle): Text {
    const t = new Text({ text, style });
    t.anchor.set(0.5);
    t.position.set(x, y);
    this.container.addChild(t);
    return t;
  }

  private addBetButtons(): void {
    const btns: [string, number][] = [['-', -60], ['+', 60]];
    for (const [label, offsetX] of btns) {
      const delta = label === '+' ? 1 : -1;
      const btn = this.makeSmallButton(label, W / 2 + offsetX, H - 58);
      btn.on('pointerdown', () => this.onBetChangeCb?.(delta));
      this.container.addChild(btn);
    }
  }

  private makeSmallButton(label: string, x: number, y: number): Container {
    const c = new Container();
    c.interactive = true;
    c.cursor = 'pointer';

    const bg = new Graphics();
    bg.circle(0, 0, 20);
    bg.fill({ color: 0x334466 });

    const t = new Text({ text: label, style: new TextStyle({ fill: '#ffffff', fontSize: 24, fontWeight: 'bold' }) });
    t.anchor.set(0.5);

    c.addChild(bg);
    c.addChild(t);
    c.position.set(x, y);
    return c;
  }

  private buildSpinButton(): void {
    this.spinButton = new Container();
    this.spinButton.interactive = true;
    this.spinButton.cursor = 'pointer';

    this.spinBg = new Graphics();
    this.drawSpinBg(false);

    this.spinLabel = new Text({
      text: 'SPIN',
      style: new TextStyle({ fill: '#ffffff', fontSize: 36, fontFamily: 'Arial', fontWeight: 'bold' }),
    });
    this.spinLabel.anchor.set(0.5);

    this.spinButton.addChild(this.spinBg);
    this.spinButton.addChild(this.spinLabel);
    this.spinButton.position.set(W / 2, H - 70);

    this.spinButton.on('pointerdown', () => this.onSpinCb?.());
    this.spinButton.on('pointerover', () => this.drawSpinBg(true));
    this.spinButton.on('pointerout',  () => this.drawSpinBg(false));

    this.container.addChild(this.spinButton);
  }

  private drawSpinBg(hover: boolean): void {
    this.spinBg.clear();
    this.spinBg.circle(0, 0, 52);
    this.spinBg.fill({ color: hover ? 0x7755ff : 0x5533dd });
    this.spinBg.stroke({ color: 0xaaaaff, width: 3 });
  }

  // ─── API pública ───────────────────────────────────────────────────────────

  public onSpin(cb: () => void): void       { this.onSpinCb = cb; }
  public onBetChange(cb: (d: number) => void): void { this.onBetChangeCb = cb; }

  public setBalance(value: number): void {
    this.balanceValue.text = value.toFixed(2);
  }

  public setBet(value: number): void {
    this.betValue.text = value.toFixed(2);
  }

  public setWin(value: number): void {
    this.winValue.text = value > 0 ? value.toFixed(2) : '0';
  }

  public setSpinEnabled(enabled: boolean): void {
    this.spinButton.interactive = enabled;
    this.spinButton.alpha = enabled ? 1 : 0.5;
    if (!enabled) this.drawSpinBg(false);
  }

  public destroy(): void {
    this.container.destroy({ children: true });
  }
}
