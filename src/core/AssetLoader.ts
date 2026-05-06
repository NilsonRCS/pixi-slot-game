import { Assets } from 'pixi.js';

export class AssetLoader {
  public static async load(): Promise<void> {
    // Registre aqui os bundles de assets conforme o projeto crescer
    Assets.addBundle('symbols', {
      // 'symbols': 'assets/spritesheets/symbols.json',
    });

    // await Assets.loadBundle('symbols');
  }
}
