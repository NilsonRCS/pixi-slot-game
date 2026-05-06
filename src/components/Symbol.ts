import { Assets, Container, Graphics, Sprite, Text } from 'pixi.js';
import { GAME_CONFIG } from '../config/GameConfig';

const SIZE = GAME_CONFIG.reels.symbolSize;

export class Symbol {
  public container: Container;
  private sprite: Sprite | null = null;
  private placeholder: Graphics | null = null;
  private label: Text | null = null;

  constructor(symbolId: number) {
    this.container = new Container();
    this.setSymbol(symbolId);
  }

  public setSymbol(symbolId: number): void {
    const name = GAME_CONFIG.symbols.names[symbolId] as string | undefined ?? 'unknown';

    // Remove filho anterior
    this.container.removeChildren();
    this.sprite?.destroy();
    this.placeholder?.destroy();
    this.label?.destroy();
    this.sprite = null;
    this.placeholder = null;
    this.label = null;

    const texture = Assets.get(name);

    if (texture) {
      // Textura carregada — usa Sprite
      this.sprite = new Sprite(texture);
      this.sprite.width  = SIZE;
      this.sprite.height = SIZE;
      this.container.addChild(this.sprite);
    } else {
      // Fallback: retângulo colorido com label (antes do load)
      this.placeholder = new Graphics();
      this.placeholder.roundRect(4, 4, SIZE - 8, SIZE - 8, 14);
      this.placeholder.fill({ color: 0x334466 });
      this.placeholder.stroke({ color: 0xffffff, alpha: 0.2, width: 2 });

      this.label = new Text({
        text: name.toUpperCase(),
        style: { fontSize: 22, fill: 0xffffff, fontWeight: 'bold' },
      });
      this.label.anchor.set(0.5);
      this.label.position.set(SIZE / 2, SIZE / 2);

      this.container.addChild(this.placeholder);
      this.container.addChild(this.label);
    }
  }
}
