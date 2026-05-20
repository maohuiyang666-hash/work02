import { Tower, Enemy, Projectile, Particle } from '../types/entities';
import { CELL_SIZE } from '../config/gameConfig';
import { getColorValue } from '../config/gameConfig';

export interface ProcessProjectilesResult {
  remainingProjectiles: Projectile[];
  hitEnemies: Array<{ enemy: Enemy; damage: number; isSlow: boolean; isPierce: boolean }>;
  newParticles: Particle[];
}

export const resolveProjectileHits = (
  projectiles: Projectile[], 
  enemies: Enemy[], 
  delta: number,
  particleIdCounter: number
): ProcessProjectilesResult => {
  const remainingProjectiles: Projectile[] = [];
  const hitEnemies: Array<{ enemy: Enemy; damage: number; isSlow: boolean; isPierce: boolean }> = [];
  const newParticles: Particle[] = [];
  let currentParticleId = particleIdCounter;

  for (const proj of projectiles) {
    const dx = proj.targetX - proj.x;
    const dy = proj.targetY - proj.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 10) {
      const hitRange = proj.type === 'pierce' ? 60 : 25;
      
      for (const enemy of enemies) {
        const eDist = Math.sqrt(Math.pow(enemy.x - proj.x, 2) + Math.pow(enemy.y - proj.y, 2));
        
        if (eDist < hitRange) {
          hitEnemies.push({
            enemy,
            damage: proj.damage,
            isSlow: proj.type === 'slow',
            isPierce: proj.type === 'pierce',
          });
          
          newParticles.push(...createParticles(enemy.x, enemy.y, proj.color, 3, currentParticleId));
          currentParticleId += 3;
        }
      }
    } else {
      remainingProjectiles.push({
        ...proj,
        x: proj.x + (dx / dist) * proj.speed * delta,
        y: proj.y + (dy / dist) * proj.speed * delta,
      });
    }
  }

  return {
    remainingProjectiles,
    hitEnemies,
    newParticles,
  };
};

export const createParticles = (
  x: number, 
  y: number, 
  color: string, 
  count: number,
  startId: number
): Particle[] => {
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      id: startId + i,
      x,
      y,
      color,
      size: 4 + Math.random() * 4,
      life: 30 + Math.random() * 20,
      velocityX: (Math.random() - 0.5) * 4,
      velocityY: (Math.random() - 0.5) * 4,
    });
  }
  return particles;
};

export const updateParticles = (particles: Particle[]): Particle[] => {
  return particles
    .map(p => ({
      ...p,
      x: p.x + p.velocityX,
      y: p.y + p.velocityY,
      life: p.life - 1,
      size: p.size * 0.95,
    }))
    .filter(p => p.life > 0);
};

export const towerAttack = (
  towers: Tower[],
  enemies: Enemy[],
  currentTime: number,
  projectileIdCounter: number
): { updatedTowers: Tower[]; newProjectiles: Projectile[] } => {
  const updatedTowers = [...towers];
  const newProjectiles: Projectile[] = [];
  let currentProjId = projectileIdCounter;

  for (let i = 0; i < updatedTowers.length; i++) {
    const tower = updatedTowers[i];
    if (currentTime - tower.lastAttack < tower.attackSpeed) continue;

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
      updatedTowers[i] = { ...tower, lastAttack: currentTime };

      const projType = tower.type === 'blue' ? 'slow' : tower.type === 'yellow' ? 'pierce' : 'normal';
      
      newProjectiles.push({
        id: currentProjId++,
        x: towerCenterX,
        y: towerCenterY,
        targetX: target.x,
        targetY: target.y,
        color: getColorValue(tower.type),
        speed: 350,
        damage: tower.damage * tower.level,
        type: projType,
      });
    }
  }

  return { updatedTowers, newProjectiles };
};
