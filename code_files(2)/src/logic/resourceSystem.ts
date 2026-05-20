import { PaintEssence } from '../types/game';
import { Enemy } from '../types/entities';

export const getPaintReward = (enemy: Enemy): { type: 'red' | 'blue' | 'yellow'; amount: number } => {
  const amount = 8 + Math.floor(enemy.maxHealth / 15);
  const colorType = enemy.colorType === 'mixed' 
    ? (['red', 'blue', 'yellow'] as const)[Math.floor(Math.random() * 3)] 
    : enemy.colorType;
  return { type: colorType, amount };
};

export const getScoreReward = (enemy: Enemy): number => {
  return 15 + Math.floor(enemy.maxHealth / 10);
};
