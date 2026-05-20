import { CELL_SIZE, CORE_POSITION, GRID_SIZE, PATH } from '../config/gameConfig';
import { TOWER_BASE_STATS, TOWER_COSTS, TOWER_STYLE_CONFIG, getTowerColor } from '../config/towerConfig';
import { canAfford, spendPaint } from './resourceSystem';
import type { Enemy, PaintEssence, Projectile, Tower } from '../types/entities';
import type { TowerStyle, TowerType } from '../types/game';

export const canPlaceTower = (x: number, y: number, towers: Tower[]): boolean => {
  const isOnPath = PATH.some((position) => Math.abs(position.x - x) < 0.5 && Math.abs(position.y - y) < 0.5);

  if (isOnPath && !(x === CORE_POSITION.x && y === CORE_POSITION.y)) {
    return false;
  }

  if (towers.some((tower) => tower.x === x && tower.y === y)) {
    return false;
  }

  if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) {
    return false;
  }

  return true;
};

export const createTower = (
  id: number,
  x: number,
  y: number,
  type: TowerType,
  style: TowerStyle,
): Tower => {
  const styleConfig = TOWER_STYLE_CONFIG[style];
  const baseStats = TOWER_BASE_STATS[type];

  return {
    id,
    x,
    y,
    type,
    level: 1,
    range: baseStats.range,
    damage: Math.floor(baseStats.damage * styleConfig.damageMultiplier),
    attackSpeed: styleConfig.attackSpeed,
    lastAttack: 0,
    style,
  };
};

export const getTowerCost = (type: TowerType): PaintEssence => TOWER_COSTS[type];

export const placeTower = (
  towers: Tower[],
  paint: PaintEssence,
  nextTowerId: number,
  x: number,
  y: number,
  type: TowerType,
  style: TowerStyle,
): { towers: Tower[]; paint: PaintEssence; tower: Tower | null } => {
  if (!canPlaceTower(x, y, towers)) {
    return { towers, paint, tower: null };
  }

  const cost = getTowerCost(type);

  if (!canAfford(paint, cost)) {
    return { towers, paint, tower: null };
  }

  const tower = createTower(nextTowerId, x, y, type, style);

  return {
    towers: [...towers, tower],
    paint: spendPaint(paint, cost),
    tower,
  };
};

export const getTowerUpgradeCost = (tower: Tower): number => tower.level * 25;

export const upgradeTower = (
  tower: Tower,
  paint: PaintEssence,
): { upgradedTower: Tower; updatedPaint: PaintEssence } | null => {
  if (tower.level >= 5) {
    return null;
  }

  const cost = getTowerUpgradeCost(tower);

  if (paint[tower.type] < cost) {
    return null;
  }

  return {
    upgradedTower: {
      ...tower,
      level: tower.level + 1,
      damage: Math.floor(tower.damage * 1.4),
      range: tower.range + 0.2,
    },
    updatedPaint: {
      ...paint,
      [tower.type]: paint[tower.type] - cost,
    },
  };
};

export const fireTowers = (
  towers: Tower[],
  enemies: Enemy[],
  currentTime: number,
  nextProjectileId: number,
): { towers: Tower[]; projectiles: Projectile[]; nextProjectileId: number } => {
  const projectiles: Projectile[] = [];
  let resolvedProjectileId = nextProjectileId;

  const updatedTowers = towers.map((tower) => {
    if (currentTime - tower.lastAttack < tower.attackSpeed) {
      return tower;
    }

    const towerCenterX = tower.x * CELL_SIZE + CELL_SIZE / 2;
    const towerCenterY = tower.y * CELL_SIZE + CELL_SIZE / 2;
    const inRange = enemies.filter((enemy) => {
      const distance = Math.sqrt(
        Math.pow(enemy.x - towerCenterX, 2) + Math.pow(enemy.y - towerCenterY, 2),
      );

      return distance <= tower.range * CELL_SIZE;
    });

    if (inRange.length === 0) {
      return tower;
    }

    const target = inRange[0];
    const baseStats = TOWER_BASE_STATS[tower.type];

    projectiles.push({
      id: resolvedProjectileId,
      x: towerCenterX,
      y: towerCenterY,
      targetX: target.x,
      targetY: target.y,
      color: getTowerColor(tower.type),
      speed: baseStats.projectileSpeed,
      damage: tower.damage * tower.level,
      type: baseStats.projectileType,
    });

    resolvedProjectileId += 1;

    return {
      ...tower,
      lastAttack: currentTime,
    };
  });

  return {
    towers: updatedTowers,
    projectiles,
    nextProjectileId: resolvedProjectileId,
  };
};
