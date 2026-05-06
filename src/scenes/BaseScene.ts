import { Container } from 'pixi.js';

export abstract class BaseScene {
  public container: Container;

  constructor() {
    this.container = new Container();
  }

  public abstract init(): Promise<void>;
  public abstract update(delta: number): void;
  public abstract destroy(): void;
}
