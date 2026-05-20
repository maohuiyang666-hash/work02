import type { PaintEssence } from '../types/entities';
import type { TowerType } from '../types/game';

export const createEmptyPaint = (): PaintEssence => ({ red: 0, blue: 0, yellow: 0 });

export const canAfford = (paint: PaintEssence, cost: PaintEssence): boolean => (
  paint.red >= cost.red && paint.blue >= cost.blue && paint.yellow >= cost.yellow
);

export const spendPaint = (paint: PaintEssence, cost: PaintEssence): PaintEssence => ({
  red: paint.red - cost.red,
  blue: paint.blue - cost.blue,
  yellow: paint.yellow - cost.yellow,
});

export const addPaint = (paint: PaintEssence, gain: PaintEssence): PaintEssence => ({
  red: paint.red + gain.red,
  blue: paint.blue + gain.blue,
  yellow: paint.yellow + gain.yellow,
});

export const addSinglePaint = (paint: PaintEssence, color: TowerType, amount: number): PaintEssence => ({
  ...paint,
  [color]: paint[color] + amount,
});
