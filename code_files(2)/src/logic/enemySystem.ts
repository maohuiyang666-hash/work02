import {
  CORE_DAMAGE_PER_ENEMY,
  ENEMY_BASE_HEALTH,
  ENEMY_BASE_SPEED,
  ENEMY_HEALTH_PER_WAVE,
  ENEMY_SPEED_BONUS_CAP,
  ENEMY_SPEED_PER_WAVE,
  WAVE_BASE_ENEMY_COUNT,
  WAVE_BASE_SPAWN_RATE,
  WAVE_ENEMY_COUNT_STEP,
  WAVE_SPAWN_RATE_CAP,
  WAVE_SPAWN_RATE_STEP,
  getEnemyColor,
} from '../config/enemyConfig';
import { CELL_SIZE, PATH } from '../config/gameConfig';
import type { Enemy } from '../types/entities';
import type { EnemyColorType } from '../types/game';

export const getEnemiesPerWave = (wave: number): number => WAVE_BASE_ENEMY_COUNT + wave * WAVE_ENEMY_COUNT_STEP;

export const getSpawnRate = (wave: number): number => WAVE_BASE_SPAWN_RATE - Math.min(wave * WAVE_SPAWN_RATE_STEP, WAVE_SPAWN_RATE_CAP);

export const spawnEnemy = (id: number, wave: number): Enemy => {
  const colorTypes: EnemyColorType[] = ['red', 'blue', 'yellow'];

  if (wave >= 3) {
    colorTypes.push('mixed');
  }

  const type = colorTypes[Math.floor(Math.random() * colorTypes.length)];
  const health = ENEMY_BASE_HEALTH + wave * ENEMY_HEALTH_PER_WAVE;

  return {
    id,
    x: PATH[0].x * CELL_SIZE + CELL_SIZE / 2,
    y: PATH[0].y * CELL_SIZE + CELL_SIZE / 2,
    health,
    maxHealth: health,
    speed: ENEMY_BASE_SPEED + Math.min(wave * ENEMY_SPEED_PER_WAVE, ENEMY_SPEED_BONUS_CAP),
    color: getEnemyColor(type),
    colorType: type,
    pathIndex: 0,
  };
};

export const moveEnemies = (
  enemies: Enemy[],
  deltaSeconds: number,
): { enemies: Enemy[]; coreDamage: number } => {
  const updatedEnemies: Enemy[] = [];
  let coreDamage = 0;

  enemies.forEach((enemy) => {
    if (enemy.pathIndex >= PATH.length - 1) {
      coreDamage += CORE_DAMAGE_PER_ENEMY;
      return;
    }

    const target = {
      x: PATH[enemy.pathIndex + 1].x * CELL_SIZE + CELL_SIZE / 2,
      y: PATH[enemy.pathIndex + 1].y * CELL_SIZE + CELL_SIZE / 2,
    };

    const dx = target.x - enemy.x;
    const dy = target.y - enemy.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 5) {
      updatedEnemies.push({
        ...enemy,
        pathIndex: enemy.pathIndex + 1,
      });
      return;
    }

    updatedEnemies.push({
      ...enemy,
      x: enemy.x + (dx / distance) * enemy.speed * deltaSeconds,
      y: enemy.y + (dy / distance) * enemy.speed * deltaSeconds,
    });
  });

  return { enemies: updatedEnemies, coreDamage };
};
