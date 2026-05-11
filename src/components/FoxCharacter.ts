import { AnimatedSprite, Container, Texture } from 'pixi.js';
import { AssetLoader } from '../core/AssetLoader';
import { REELS_ORIGIN_X, REELS_ORIGIN_Y, REELS_WINDOW_HEIGHT, REELS_WINDOW_WIDTH } from './ReelsView';
import { GAME_CONFIG } from '../config/GameConfig';

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
    this.sprite.position.set(
      REELS_ORIGIN_X + REELS_WINDOW_WIDTH + GAME_CONFIG.fox.offsetX,
      REELS_ORIGIN_Y + REELS_WINDOW_HEIGHT + GAME_CONFIG.fox.offsetY
    );
    this.sprite.scale.set(GAME_CONFIG.fox.scaleX, GAME_CONFIG.fox.scaleY);
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
