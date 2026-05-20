import { PaintEssence, TowerType } from '../types/game';

export const canAffordTower = (paint: PaintEssence, cost: PaintEssence): boolean => {
  return paint.red >= cost.red && paint.blue >= cost.blue && paint.yellow >= cost.yellow;
};

export const deductTowerCost = (paint: PaintEssence, cost: PaintEssence): PaintEssence => {
  return {
    red: paint.red - cost.red,
    blue: paint.blue - cost.blue,
    yellow: paint.yellow - cost.yellow,
  };
};
