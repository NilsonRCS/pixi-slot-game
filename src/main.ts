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
  });

  // Adiciona ao stage ANTES de init() para que a tela de loading seja visível
  // durante o carregamento dos assets
  app.overlayLayer.addChild(loadingScene.container);
  await loadingScene.init();
}

bootstrap().catch((err) => console.error('[bootstrap] Erro fatal:', err));
