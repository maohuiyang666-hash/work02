import type { Enemy, PaintEssence, Particle, Projectile, Tower } from './entities';
import type { GameStatus, TowerStyle, TowerType } from './game';

export interface GameStateSnapshot {
  status: GameStatus;
  wave: number;
  coreHealth: number;
  paint: PaintEssence;
  enemies: Enemy[];
  towers: Tower[];
  projectiles: Projectile[];
  particles: Particle[];
  selectedTowerType: TowerType | null;
  selectedStyle: TowerStyle;
  score: number;
  enemiesKilled: number;
  waveInProgress: boolean;
  collectedTowers: Set<string>;
}
