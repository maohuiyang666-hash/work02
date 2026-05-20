import type { EnemyColorType, TowerType } from '../types/game';

export const ENEMY_COLORS: Record<TowerType, string> = {
  red: '#c0392b',
  blue: '#2980b9',
  yellow: '#d68910',
};

export const MIXED_ENEMY_COLORS = ['#8e44ad', '#16a085', '#d35400'] as const;

export const ENEMY_BASE_HEALTH = 40;
export const ENEMY_HEALTH_PER_WAVE = 15;
export const ENEMY_BASE_SPEED = 35;
export const ENEMY_SPEED_PER_WAVE = 3;
export const ENEMY_SPEED_BONUS_CAP = 25;
export const CORE_DAMAGE_PER_ENEMY = 10;
export const SLOW_EFFECT_MIN_SPEED = 15;

export const WAVE_BASE_ENEMY_COUNT = 5;
export const WAVE_ENEMY_COUNT_STEP = 3;
export const WAVE_BASE_SPAWN_RATE = 1.5;
export const WAVE_SPAWN_RATE_STEP = 0.1;
export const WAVE_SPAWN_RATE_CAP = 0.8;

export const KILL_PAINT_BASE_REWARD = 8;
export const KILL_PAINT_HEALTH_DIVISOR = 15;
export const KILL_SCORE_BASE_REWARD = 15;
export const KILL_SCORE_HEALTH_DIVISOR = 10;

export const getEnemyColor = (type: EnemyColorType): string => {
  if (type === 'mixed') {
    return MIXED_ENEMY_COLORS[Math.floor(Math.random() * MIXED_ENEMY_COLORS.length)];
  }

  return ENEMY_COLORS[type];
};
