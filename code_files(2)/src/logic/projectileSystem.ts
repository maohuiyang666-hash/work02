import {
  KILL_PAINT_BASE_REWARD,
  KILL_PAINT_HEALTH_DIVISOR,
  KILL_SCORE_BASE_REWARD,
  KILL_SCORE_HEALTH_DIVISOR,
  SLOW_EFFECT_MIN_SPEED,
} from '../config/enemyConfig';
import { createParticleBurst } from './particleSystem';
import { createEmptyPaint } from './resourceSystem';
import type { Enemy, PaintEssence, Particle, Projectile } from '../types/entities';
import type { TowerType } from '../types/game';

const PURE_COLORS: TowerType[] = ['red', 'blue', 'yellow'];

const getRewardColorType = (enemy: Enemy): TowerType => (
  enemy.colorType === 'mixed'
    ? PURE_COLORS[Math.floor(Math.random() * PURE_COLORS.length)]
    : enemy.colorType
);

export const resolveProjectileHits = (
  projectiles: Projectile[],
  enemies: Enemy[],
  deltaSeconds: number,
  nextParticleId: number,
): {
  projectiles: Projectile[];
  enemies: Enemy[];
  particles: Particle[];
  nextParticleId: number;
  paintGain: PaintEssence;
  scoreGain: number;
  enemiesKilled: number;
} => {
  const remainingProjectiles: Projectile[] = [];
  let updatedEnemies = enemies;
  let particles: Particle[] = [];
  let resolvedParticleId = nextParticleId;
  const paintGain = createEmptyPaint();
  let scoreGain = 0;
  let enemiesKilled = 0;

  projectiles.forEach((projectile) => {
    const dx = projectile.targetX - projectile.x;
    const dy = projectile.targetY - projectile.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 10) {
      updatedEnemies = updatedEnemies
        .map((enemy) => {
          const enemyDistance = Math.sqrt(Math.pow(enemy.x - projectile.x, 2) + Math.pow(enemy.y - projectile.y, 2));
          const hitRange = projectile.type === 'pierce' ? 60 : 25;

          if (enemyDistance >= hitRange) {
            return enemy;
          }

          const hitBurst = createParticleBurst(resolvedParticleId, enemy.x, enemy.y, projectile.color, 3);
          resolvedParticleId = hitBurst.nextParticleId;
          particles = [...particles, ...hitBurst.particles];

          const newHealth = enemy.health - projectile.damage;

          if (newHealth <= 0) {
            const paintReward = KILL_PAINT_BASE_REWARD + Math.floor(enemy.maxHealth / KILL_PAINT_HEALTH_DIVISOR);
            const rewardColor = getRewardColorType(enemy);
            const deathBurst = createParticleBurst(resolvedParticleId, enemy.x, enemy.y, enemy.color, 8);

            resolvedParticleId = deathBurst.nextParticleId;
            particles = [...particles, ...deathBurst.particles];
            paintGain[rewardColor] += paintReward;
            scoreGain += KILL_SCORE_BASE_REWARD + Math.floor(enemy.maxHealth / KILL_SCORE_HEALTH_DIVISOR);
            enemiesKilled += 1;

            return {
              ...enemy,
              health: 0,
            };
          }

          if (projectile.type === 'slow') {
            return {
              ...enemy,
              health: newHealth,
              speed: Math.max(SLOW_EFFECT_MIN_SPEED, enemy.speed * 0.7),
            };
          }

          return {
            ...enemy,
            health: newHealth,
          };
        })
        .filter((enemy) => enemy.health > 0);

      return;
    }

    remainingProjectiles.push({
      ...projectile,
      x: projectile.x + (dx / distance) * projectile.speed * deltaSeconds,
      y: projectile.y + (dy / distance) * projectile.speed * deltaSeconds,
    });
  });

  return {
    projectiles: remainingProjectiles,
    enemies: updatedEnemies,
    particles,
    nextParticleId: resolvedParticleId,
    paintGain,
    scoreGain,
    enemiesKilled,
  };
};
