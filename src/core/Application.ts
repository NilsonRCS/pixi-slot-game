import { Application as PixiApp, Container } from 'pixi.js';

export class Application {
  private static instance: Application;
  public app: PixiApp;

  public backgroundLayer: Container;
  public reelsLayer: Container;
  public maskLayer: Container;
  public uiLayer: Container;
  public winLayer: Container;
  public overlayLayer: Container;

  private constructor() {
    this.app = new PixiApp();

    this.backgroundLayer = new Container();
    this.reelsLayer = new Container();
    this.maskLayer = new Container();
    this.uiLayer = new Container();
    this.winLayer = new Container();
    this.overlayLayer = new Container();
  }

  public static getInstance(): Application {
    if (!Application.instance) {
      Application.instance = new Application();
    }
    return Application.instance;
  }

  public async init(): Promise<void> {
    await this.app.init({
      width: 1920,
      height: 1080,
      backgroundColor: 0x1a1a2e,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });

    document.getElementById('app')!.appendChild(this.app.canvas);

    this.app.stage.addChild(this.backgroundLayer);
    this.app.stage.addChild(this.reelsLayer);
    this.app.stage.addChild(this.maskLayer);
    this.app.stage.addChild(this.uiLayer);
    this.app.stage.addChild(this.winLayer);
    this.app.stage.addChild(this.overlayLayer);

    this.setupResize();
  }

  private setupResize(): void {
    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const scaleX = width / 1920;
      const scaleY = height / 1080;
      const scale = Math.min(scaleX, scaleY);

      this.app.renderer.resize(width, height);
      this.app.stage.scale.set(scale);
      this.app.stage.position.set(
        (width - 1920 * scale) / 2,
        (height - 1080 * scale) / 2,
      );
    };

    window.addEventListener('resize', resize);
    resize();
  }
}
