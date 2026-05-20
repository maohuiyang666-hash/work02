import { Position, PaintEssence, TowerType, TowerStyle } from '../types/game';
import { Tower } from '../types/entities';
import { PATH, CORE_POSITION, CELL_SIZE } from '../config/gameConfig';
import { TOWER_COSTS, TOWER_BASE_STATS, STYLE_MULTIPLIERS } from '../config/towerConfig';

export const canPlaceTower = (x: number, y: number, towers: Tower[]): boolean => {
  const isOnPath = PATH.some(p => Math.abs(p.x - x) < 0.5 && Math.abs(p.y - y) < 0.5);
  if (isOnPath && !(x === CORE_POSITION.x && y === CORE_POSITION.y)) return false;
  const hasTower = towers.some(t => t.x === x && t.y === y);
  if (hasTower) return false;
  if (x < 0 || x >= 10 || y < 0 || y >= 10) return false;
  return true;
};

export const createTower = (
  x: number, 
  y: number, 
  type: TowerType, 
  style: TowerStyle, 
  id: number
): Tower => {
  const styleMultipliers = STYLE_MULTIPLIERS[style];
  const baseStats = TOWER_BASE_STATS[type];
  const baseDamage = Math.floor(baseStats.baseDamage * styleMultipliers.damageMultiplier);
  const baseAttackSpeed = Math.floor(baseStats.baseAttackSpeed * styleMultipliers.attackSpeedMultiplier);
  
  return {
    id,
    x,
    y,
    type,
    level: 1,
    range: baseStats.baseRange,
    damage: baseDamage,
    attackSpeed: baseAttackSpeed,
    lastAttack: 0,
    style,
  };
};

export const upgradeTower = (
  tower: Tower, 
  paint: PaintEssence
): { tower: Tower; paint: PaintEssence } | null => {
  if (tower.level >= 5) return null;
  const cost = tower.level * 25;
  if (paint[tower.type] < cost) return null;
  
  const newTower = {
    ...tower,
    level: tower.level + 1,
    damage: Math.floor(tower.damage * 1.4),
    range: tower.range + 0.2,
  };
  
  const newPaint = { ...paint, [tower.type]: paint[tower.type] - cost };
  
  return { tower: newTower, paint: newPaint };
};

export const canAffordTower = (type: TowerType, paint: PaintEssence): boolean => {
  const cost = TOWER_COSTS[type];
  return paint.red >= cost.red && paint.blue >= cost.blue && paint.yellow >= cost.yellow;
};
