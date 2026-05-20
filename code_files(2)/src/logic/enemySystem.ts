import { Enemy } from '../types/entities';
import { PATH, CELL_SIZE } from '../config/gameConfig';
import { getEnemyColor } from '../config/enemyConfig';

export const spawnEnemy = (id: number, wave: number): Enemy => {
  const colorTypes: Array<'red' | 'blue' | 'yellow' | 'mixed'> = ['red', 'blue', 'yellow'];
  if (wave >= 3) colorTypes.push('mixed');
  const type = colorTypes[Math.floor(Math.random() * colorTypes.length)];

  return {
    id,
    x: PATH[0].x * CELL_SIZE + CELL_SIZE / 2,
    y: PATH[0].y * CELL_SIZE + CELL_SIZE / 2,
    health: 40 + wave * 15,
    maxHealth: 40 + wave * 15,
    speed: 35 + Math.min(wave * 3, 25),
    color: getEnemyColor(type),
    colorType: type,
    pathIndex: 0,
  };
};

export const moveEnemies = (
  enemies: Enemy[],
  delta: number
): { updatedEnemies: Enemy[]; damage: number } => {
  const updatedEnemies: Enemy[] = [];
  let damage = 0;

  enemies.forEach(enemy => {
    if (enemy.pathIndex >= PATH.length - 1) {
      damage += 10;
      return;
    }

    const target = {
      x: PATH[enemy.pathIndex + 1].x * CELL_SIZE + CELL_SIZE / 2,
      y: PATH[enemy.pathIndex + 1].y * CELL_SIZE + CELL_SIZE / 2,
    };

    const dx = target.x - enemy.x;
    const dy = target.y - enemy.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 5) {
      enemy.pathIndex++;
      updatedEnemies.push(enemy); // keep enemy at target, next frame it moves to next
    } else {
      enemy.x += (dx / dist) * enemy.speed * delta;
      enemy.y += (dy / dist) * enemy.speed * delta;
      updatedEnemies.push(enemy);
    }
  });

  return { updatedEnemies, damage };
};
