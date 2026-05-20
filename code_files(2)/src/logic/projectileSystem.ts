import { Projectile, Enemy, Particle, Tower } from '../types/entities';
import { PaintEssence } from '../types/game';
import { CELL_SIZE } from '../config/gameConfig';
import { getColorValue } from '../config/towerConfig';

export interface RefObject {
  current: number;
}

export const resolveProjectileHits = (
  projectiles: Projectile[],
  enemies: Enemy[],
  delta: number,
  paint: PaintEssence,
  score: number,
  enemiesKilled: number,
  particleIdRef: RefObject
): {
  remainingProjectiles: Projectile[];
  remainingEnemies: Enemy[];
  newParticles: Particle[];
  newPaint: PaintEssence;
  newScore: number;
  newEnemiesKilled: number;
} => {
  const remainingProjectiles: Projectile[] = [];
  let currentEnemies = [...enemies];
  const newParticles: Particle[] = [];
  let currentPaint = { ...paint };
  let currentScore = score;
  let currentKilled = enemiesKilled;

  const createParticles = (x: number, y: number, color: string, count: number = 5) => {
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: particleIdRef.current++,
        x,
        y,
        color,
        size: 4 + Math.random() * 4,
        life: 30 + Math.random() * 20,
        velocityX: (Math.random() - 0.5) * 4,
        velocityY: (Math.random() - 0.5) * 4,
      });
    }
  };

  projectiles.forEach(proj => {
    const dx = proj.targetX - proj.x;
    const dy = proj.targetY - proj.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 10) {
      currentEnemies = currentEnemies.map(e => {
        const eDist = Math.sqrt(Math.pow(e.x - proj.x, 2) + Math.pow(e.y - proj.y, 2));
        const hitRange = proj.type === 'pierce' ? 60 : 25;

        if (eDist < hitRange) {
          createParticles(e.x, e.y, proj.color, 3);
          const newHealth = e.health - proj.damage;

          if (newHealth <= 0) {
            const paintGain = 8 + Math.floor(e.maxHealth / 15);
            const colorType = e.colorType === 'mixed' ? 
              (['red', 'blue', 'yellow'] as const)[Math.floor(Math.random() * 3)] : 
              e.colorType;

            currentPaint[colorType] += paintGain;
            currentScore += 15 + Math.floor(e.maxHealth / 10);
            currentKilled += 1;
            createParticles(e.x, e.y, e.color, 8);
            return { ...e, health: 0 };
          }

          if (proj.type === 'slow') {
            return { ...e, health: newHealth, speed: Math.max(15, e.speed * 0.7) };
          }

          return { ...e, health: newHealth };
        }
        return e;
      }).filter(e => e.health > 0);
    } else {
      proj.x += (dx / dist) * proj.speed * delta;
      proj.y += (dy / dist) * proj.speed * delta;
      remainingProjectiles.push(proj);
    }
  });

  return {
    remainingProjectiles,
    remainingEnemies: currentEnemies,
    newParticles,
    newPaint: currentPaint,
    newScore: currentScore,
    newEnemiesKilled: currentKilled,
  };
};

export const towerFire = (
  towers: Tower[],
  enemies: Enemy[],
  currentTime: number,
  projectileIdRef: RefObject
): { updatedTowers: Tower[]; newProjectiles: Projectile[] } => {
  const newProjectiles: Projectile[] = [];
  const updatedTowers = towers.map(tower => {
    if (currentTime - tower.lastAttack < tower.attackSpeed) return tower;

    const towerCenterX = tower.x * CELL_SIZE + CELL_SIZE / 2;
    const towerCenterY = tower.y * CELL_SIZE + CELL_SIZE / 2;

    const inRange = enemies.filter(e => {
      const dist = Math.sqrt(
        Math.pow(e.x - towerCenterX, 2) + Math.pow(e.y - towerCenterY, 2)
      );
      return dist <= tower.range * CELL_SIZE;
    });

    if (inRange.length > 0) {
      const target = inRange[0];
      const updatedTower = { ...tower, lastAttack: currentTime };

      newProjectiles.push({
        id: projectileIdRef.current++,
        x: towerCenterX,
        y: towerCenterY,
        targetX: target.x,
        targetY: target.y,
        color: getColorValue(tower.type),
        speed: 350,
        damage: tower.damage * tower.level,
        type: tower.type === 'blue' ? 'slow' : tower.type === 'yellow' ? 'pierce' : 'normal',
      });
      return updatedTower;
    }
    return tower;
  });

  return { updatedTowers, newProjectiles };
};
