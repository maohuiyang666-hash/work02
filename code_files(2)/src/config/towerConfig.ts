import { TowerType, TowerStyle, PaintEssence } from '../types/game';

export const TOWER_COSTS: Record<TowerType, PaintEssence> = {
  red: { red: 30, blue: 0, yellow: 0 },
  blue: { red: 0, blue: 30, yellow: 0 },
  yellow: { red: 0, blue: 0, yellow: 30 },
};

export interface TowerBaseStats {
  baseDamage: number;
  baseRange: number;
  baseAttackSpeed: number;
}

export const TOWER_BASE_STATS: Record<TowerType, TowerBaseStats> = {
  red: {
    baseDamage: 15,
    baseRange: 2.5,
    baseAttackSpeed: 1000,
  },
  blue: {
    baseDamage: 15,
    baseRange: 2.5,
    baseAttackSpeed: 1000,
  },
  yellow: {
    baseDamage: 15,
    baseRange: 2.5,
    baseAttackSpeed: 1000,
  },
};

export interface StyleMultipliers {
  damageMultiplier: number;
  attackSpeedMultiplier: number;
}

export const STYLE_MULTIPLIERS: Record<TowerStyle, StyleMultipliers> = {
  pencil: {
    damageMultiplier: 0.8,
    attackSpeedMultiplier: 0.8,
  },
  watercolor: {
    damageMultiplier: 1.0,
    attackSpeedMultiplier: 1.2,
  },
  oil: {
    damageMultiplier: 1.2,
    attackSpeedMultiplier: 1.5,
  },
};
