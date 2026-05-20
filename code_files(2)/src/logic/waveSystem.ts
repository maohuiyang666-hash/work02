import { PaintEssence } from '../types/game';

export const calculateWaveReward = (): PaintEssence => {
  return { red: 10, blue: 10, yellow: 10 };
};

export const getEnemiesPerWave = (wave: number): number => 5 + wave * 3;

export const getSpawnRate = (wave: number): number => 1.5 - Math.min(wave * 0.1, 0.8);

export const checkGameOver = (coreHealth: number): boolean => coreHealth <= 0;

export const checkVictory = (wave: number, waveInProgress: boolean, enemiesLength: number): boolean => {
  return wave >= 10 && !waveInProgress && enemiesLength === 0;
};
