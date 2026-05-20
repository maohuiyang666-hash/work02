import type { PaintEssence } from '../types/entities';
import type { ProjectileType, TowerStyle, TowerType } from '../types/game';

export const TOWER_COLORS: Record<TowerType, string> = {
  red: '#e74c3c',
  blue: '#3498db',
  yellow: '#f39c12',
};

export const TOWER_COSTS: Record<TowerType, PaintEssence> = {
  red: { red: 30, blue: 0, yellow: 0 },
  blue: { red: 0, blue: 30, yellow: 0 },
  yellow: { red: 0, blue: 0, yellow: 30 },
};

export const TOWER_BASE_STATS: Record<
  TowerType,
  {
    displayName: string;
    range: number;
    damage: number;
    projectileSpeed: number;
    projectileType: ProjectileType;
  }
> = {
  red: {
    displayName: '烈焰塔',
    range: 2.5,
    damage: 15,
    projectileSpeed: 350,
    projectileType: 'normal',
  },
  blue: {
    displayName: '寒冰塔',
    range: 2.5,
    damage: 15,
    projectileSpeed: 350,
    projectileType: 'slow',
  },
  yellow: {
    displayName: '雷电塔',
    range: 2.5,
    damage: 15,
    projectileSpeed: 350,
    projectileType: 'pierce',
  },
};

export const TOWER_STYLE_CONFIG: Record<
  TowerStyle,
  {
    label: string;
    icon: string;
    className: string;
    damageMultiplier: number;
    attackSpeed: number;
  }
> = {
  pencil: {
    label: '✏️铅笔',
    icon: '✏️',
    className: 'border-2 border-dashed',
    damageMultiplier: 0.8,
    attackSpeed: 800,
  },
  watercolor: {
    label: '💧水彩',
    icon: '💧',
    className: 'opacity-80',
    damageMultiplier: 1,
    attackSpeed: 1200,
  },
  oil: {
    label: '🖌️油画',
    icon: '🖌️',
    className: 'border-4',
    damageMultiplier: 1.2,
    attackSpeed: 1500,
  },
};

export const getTowerColor = (type: TowerType): string => TOWER_COLORS[type];

export const getStyleClass = (style: TowerStyle): string => TOWER_STYLE_CONFIG[style].className;
