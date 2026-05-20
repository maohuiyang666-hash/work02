export interface PaintEssence {
  red: number;
  blue: number;
  yellow: number;
}

export type TowerType = 'red' | 'blue' | 'yellow';
export type TowerStyle = 'pencil' | 'watercolor' | 'oil';
export type GameState = 'menu' | 'playing' | 'paused' | 'gameOver' | 'victory';
