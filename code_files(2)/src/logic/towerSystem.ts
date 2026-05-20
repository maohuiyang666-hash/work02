import { Tower } from '../types/entities';
import { TowerType, TowerStyle, PaintEssence } from '../types/game';
import { PATH, CORE_POSITION, GRID_SIZE } from '../config/gameConfig';

export const canPlaceTower = (
  x: number,
  y: number,
  towers: Tower[]
): boolean => {
  const isOnPath = PATH.some(p => Math.abs(p.x - x) < 0.5 && Math.abs(p.y - y) < 0.5);
  if (isOnPath && !(x === CORE_POSITION.x && y === CORE_POSITION.y)) return false;
  const hasTower = towers.some(t => t.x === x && t.y === y);
  if (hasTower) return false;
  if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) return false;
  return true;
};

export const createTower = (
  id: number,
  x: number,
  y: number,
  type: TowerType,
  style: TowerStyle
): Tower => {
  const styleMultiplier = style === 'pencil' ? 0.8 : style === 'watercolor' ? 1.0 : 1.2;
  return {
    id,
    x,
    y,
    type,
    level: 1,
    range: 2.5,
    damage: Math.floor(15 * styleMultiplier),
    attackSpeed: style === 'watercolor' ? 1200 : style === 'pencil' ? 800 : 1500,
    lastAttack: 0,
    style,
  };
};

export const upgradeTowerData = (
  tower: Tower,
  paint: PaintEssence
): { updatedTower: Tower; remainingPaint: PaintEssence; success: boolean } => {
  if (tower.level >= 5) return { updatedTower: tower, remainingPaint: paint, success: false };
  const cost = tower.level * 25;
  if (paint[tower.type] >= cost) {
    const remainingPaint = { ...paint, [tower.type]: paint[tower.type] - cost };
    const updatedTower = {
      ...tower,
      level: tower.level + 1,
      damage: Math.floor(tower.damage * 1.4),
      range: tower.range + 0.2,
    };
    return { updatedTower, remainingPaint, success: true };
  }
  return { updatedTower: tower, remainingPaint: paint, success: false };
};
