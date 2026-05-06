import { AnimatedSprite, Container, Texture } from 'pixi.js';
import { AssetLoader } from '../core/AssetLoader';
import { REELS_ORIGIN_X, REELS_ORIGIN_Y, REELS_WINDOW_HEIGHT, REELS_WINDOW_WIDTH } from './ReelsView';

export class FoxCharacter {
  public container: Container;

  private sprite: AnimatedSprite;
  private idleTextures: Texture[];
  private winTextures: Texture[];

  constructor() {
    this.container = new Container();

    this.idleTextures = AssetLoader.getCharacterFramePaths('idle').map((path) => Texture.from(path));
    this.winTextures = AssetLoader.getCharacterFramePaths('win').map((path) => Texture.from(path));

    this.sprite = new AnimatedSprite(this.idleTextures);
    this.sprite.anchor.set(0.5, 1);
    this.sprite.position.set(REELS_ORIGIN_X + REELS_WINDOW_WIDTH + 180, REELS_ORIGIN_Y + REELS_WINDOW_HEIGHT + 14);
    this.sprite.scale.set(-0.74, 0.74); // espelhada para olhar para os reels
    this.sprite.animationSpeed = 0.28;
    this.sprite.loop = true;
    this.sprite.play();

    this.container.addChild(this.sprite);
  }

  public playIdle(): void {
    this.sprite.textures = this.idleTextures;
    this.sprite.animationSpeed = 0.28;
    this.sprite.loop = true;
    this.sprite.play();
  }

  public async playWin(): Promise<void> {
    this.sprite.textures = this.winTextures;
    this.sprite.animationSpeed = 0.35;
    this.sprite.loop = false;

    await new Promise<void>((resolve) => {
      this.sprite.onComplete = () => resolve();
      this.sprite.gotoAndPlay(0);
    });

    this.playIdle();
  }

  public destroy(): void {
    this.container.destroy({ children: true });
  }
}
