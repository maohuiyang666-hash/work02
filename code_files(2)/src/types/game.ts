export type TowerType = 'red' | 'blue' | 'yellow';
export type TowerStyle = 'pencil' | 'watercolor' | 'oil';
export type EnemyColorType = TowerType | 'mixed';
export type ProjectileType = 'normal' | 'slow' | 'pierce';
export type GameStatus = 'menu' | 'playing' | 'paused' | 'gameOver' | 'victory';

export interface Position {
  x: number;
  y: number;
}

export interface PathLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}
