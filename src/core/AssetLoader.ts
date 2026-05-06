import { Assets } from 'pixi.js';

// Mapa: chave de asset → frame estático (_00.png) de cada símbolo
// Usado para exibição nos rolos (etapa 4).
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
  background: 'assets/background.png',
  preloader:  'assets/preloader.png',
};

export type WinTier = 'big' | 'mega' | 'super' | 'total';
export type CharacterAnim = 'idle' | 'win';

const WIN_BASE_PATH: Record<WinTier, string> = {
  big: 'assets/sequences/wins/Big_Win/Big_Win',
  mega: 'assets/sequences/wins/Mega_Win/Mega_Win',
  super: 'assets/sequences/wins/Super_MEga_Win/Super_Mega_Win',
  total: 'assets/sequences/wins/Total_Win/Total_Win',
};

const WIN_FRAME_COUNT = 46;
const CHARACTER_FRAME_COUNT = 61;

const buildWinFramePaths = (tier: WinTier): string[] =>
  Array.from({ length: WIN_FRAME_COUNT }, (_, i) =>
    `${WIN_BASE_PATH[tier]}_${String(i).padStart(2, '0')}.png`
  );

const WIN_SEQUENCE_PATHS: Record<WinTier, string[]> = {
  big: buildWinFramePaths('big'),
  mega: buildWinFramePaths('mega'),
  super: buildWinFramePaths('super'),
  total: buildWinFramePaths('total'),
};

const CHARACTER_BASE_PATH: Record<CharacterAnim, string> = {
  idle: 'assets/sequences/character/Idle/Idle',
  win: 'assets/sequences/character/Win/Win',
};

const buildCharacterFramePaths = (anim: CharacterAnim): string[] =>
  Array.from({ length: CHARACTER_FRAME_COUNT }, (_, i) =>
    `${CHARACTER_BASE_PATH[anim]}_${String(i).padStart(2, '0')}.png`
  );

const CHARACTER_SEQUENCE_PATHS: Record<CharacterAnim, string[]> = {
  idle: buildCharacterFramePaths('idle'),
  win: buildCharacterFramePaths('win'),
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
      await Assets.load([...this.getAllWinFramePaths(), ...this.getAllCharacterFramePaths()]);
    } catch (err) {
      console.warn('[AssetLoader] Falha ao carregar alguns assets — usando fallback visual.', err);
    }
  }

  public static getWinFramePaths(tier: WinTier): string[] {
    return WIN_SEQUENCE_PATHS[tier];
  }

  public static getCharacterFramePaths(anim: CharacterAnim): string[] {
    return CHARACTER_SEQUENCE_PATHS[anim];
  }

  private static getAllWinFramePaths(): string[] {
    return [
      ...WIN_SEQUENCE_PATHS.big,
      ...WIN_SEQUENCE_PATHS.mega,
      ...WIN_SEQUENCE_PATHS.super,
      ...WIN_SEQUENCE_PATHS.total,
    ];
  }

  private static getAllCharacterFramePaths(): string[] {
    return [...CHARACTER_SEQUENCE_PATHS.idle, ...CHARACTER_SEQUENCE_PATHS.win];
  }
}
