import { Application as PixiApp, Container } from 'pixi.js';
import { GAME_CONFIG } from '../config/GameConfig';

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
    const designW = GAME_CONFIG.design.width;
    const designH = GAME_CONFIG.design.height;

    await this.app.init({
      width: designW,
      height: designH,
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
    const designW = GAME_CONFIG.design.width;
    const designH = GAME_CONFIG.design.height;

    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      this.app.renderer.resize(width, height);

      // Preenche 100% da viewport sem barras laterais.
      this.app.stage.scale.set(width / designW, height / designH);
      this.app.stage.position.set(0, 0);
    };

    window.addEventListener('resize', resize);
    resize();
  }
}
