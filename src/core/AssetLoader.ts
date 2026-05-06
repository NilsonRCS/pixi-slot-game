import { Assets } from 'pixi.js';

// Mapa: chave de asset → frame estático (_00.png) de cada símbolo
// Usado para exibição nos rolos (etapa 4).
// Os frames de animação completos serão carregados na etapa de polish.
const SYMBOL_BUNDLE: Record<string, string> = {
  bank:       'assets/sequences/symbols/Bank/Bank_00.png',
  safe:       'assets/sequences/symbols/Safe/Safe_00.png',
  cell:       'assets/sequences/symbols/Cell/Cell_00.png',
  dynamit:    'assets/sequences/symbols/Dynamit/Dynamit_00.png',
  handcuffs:  'assets/sequences/symbols/Handcuffs/Handcuffs_00.png',
  littera_a:  'assets/sequences/symbols/Littera_A/Littera_A_00.png',
  littera_j:  'assets/sequences/symbols/Littera_J/Littera_J_00.png',
  littera_k:  'assets/sequences/symbols/Littera_K/Littera_K_00.png',
  littera_q:  'assets/sequences/symbols/Littera_Q/Littera_Q_00.png',
  number_10:  'assets/sequences/symbols/Number_10/Number_10_00.png',
};

export class AssetLoader {
  /**
   * Carrega todos os assets do jogo.
   * @param onProgress callback 0→1 conforme o carregamento avança
   */
  public static async load(onProgress?: (progress: number) => void): Promise<void> {
    Assets.addBundle('symbols', SYMBOL_BUNDLE);
    try {
      await Assets.loadBundle('symbols', onProgress);
    } catch (err) {
      console.warn('[AssetLoader] Falha ao carregar alguns assets — usando fallback visual.', err);
    }
  }
}
