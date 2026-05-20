import { MAX_WAVE } from '../config/gameConfig';
import type { PaintEssence } from '../types/entities';

export const calculateWaveReward = (): PaintEssence => ({ red: 10, blue: 10, yellow: 10 });

export const checkGameOver = (coreHealth: number): boolean => coreHealth <= 0;

export const checkVictory = (wave: number): boolean => wave >= MAX_WAVE;
