import { PaintEssence } from '../types/game';

export const calculateWaveReward = (paint: PaintEssence): PaintEssence => {
  const bonus: PaintEssence = { red: 10, blue: 10, yellow: 10 };
  return {
    red: paint.red + bonus.red,
    blue: paint.blue + bonus.blue,
    yellow: paint.yellow + bonus.yellow,
  };
};

export const checkGameOver = (coreHealth: number): boolean => {
  return coreHealth <= 0;
};

export const checkVictory = (wave: number): boolean => {
  return wave >= 10;
};
