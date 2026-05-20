export interface EnemyColors {
  red: string;
  blue: string;
  yellow: string;
  mixed: string[];
}

export const ENEMY_COLORS: EnemyColors = {
  red: '#c0392b',
  blue: '#2980b9',
  yellow: '#d68910',
  mixed: ['#8e44ad', '#16a085', '#d35400'],
};

export const getEnemyHealth = (wave: number): number => 40 + wave * 15;

export const getEnemySpeed = (wave: number): number => 35 + Math.min(wave * 3, 25);
