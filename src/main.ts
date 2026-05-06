import { Application } from './core/Application';
import { LoadingScene } from './scenes/LoadingScene';
import { GameScene } from './scenes/GameScene';

async function bootstrap(): Promise<void> {
  const app = Application.getInstance();
  await app.init();

  const gameScene = new GameScene();

  const loadingScene = new LoadingScene(async () => {
    app.overlayLayer.removeChild(loadingScene.container);
    loadingScene.destroy();

    await gameScene.init();
    app.reelsLayer.addChild(gameScene.container);
  });

  await loadingScene.init();
  app.overlayLayer.addChild(loadingScene.container);
}

bootstrap();
