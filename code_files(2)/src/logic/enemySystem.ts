import { Enemy } from '../types/entities';
import { PATH, CELL_SIZE } from '../config/gameConfig';
import { ENEMY_COLORS, getEnemyHealth, getEnemySpeed } from '../config/enemyConfig';

export const spawnEnemy = (wave: number, id: number): Enemy => {
  const colorTypes: Array<'red' | 'blue' | 'yellow' | 'mixed'> = ['red', 'blue', 'yellow'];
  if (wave >= 3) colorTypes.push('mixed');
  const type = colorTypes[Math.floor(Math.random() * colorTypes.length)];
  
  let color: string;
  if (type === 'mixed') {
    color = ENEMY_COLORS.mixed[Math.floor(Math.random() * ENEMY_COLORS.mixed.length)];
  } else {
    color = ENEMY_COLORS[type];
  }
  
  return {
    id,
    x: PATH[0].x * CELL_SIZE + CELL_SIZE / 2,
    y: PATH[0].y * CELL_SIZE + CELL_SIZE / 2,
    health: getEnemyHealth(wave),
    maxHealth: getEnemyHealth(wave),
    speed: getEnemySpeed(wave),
    color,
    colorType: type,
    pathIndex: 0,
  };
};

export const moveEnemies = (
  enemies: Enemy[], 
  delta: number
): { updatedEnemies: Enemy[]; coreDamage: number } => {
  const updatedEnemies: Enemy[] = [];
  let coreDamage = 0;

  for (const enemy of enemies) {
    if (enemy.pathIndex >= PATH.length - 1) {
      coreDamage += 10;
      continue;
    }

    const target = {
      x: PATH[enemy.pathIndex + 1].x * CELL_SIZE + CELL_SIZE / 2,
      y: PATH[enemy.pathIndex + 1].y * CELL_SIZE + CELL_SIZE / 2,
    };

    const dx = target.x - enemy.x;
    const dy = target.y - enemy.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    let newX = enemy.x;
    let newY = enemy.y;
    let newPathIndex = enemy.pathIndex;

    if (dist < 5) {
      newPathIndex = enemy.pathIndex + 1;
    } else {
      newX = enemy.x + (dx / dist) * enemy.speed * delta;
      newY = enemy.y + (dy / dist) * enemy.speed * delta;
    }

    updatedEnemies.push({
      ...enemy,
      x: newX,
      y: newY,
      pathIndex: newPathIndex,
    });
  }

  return { updatedEnemies, coreDamage };
};
