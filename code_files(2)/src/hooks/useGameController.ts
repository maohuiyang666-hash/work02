import { useState, useEffect, useRef, useCallback } from 'react';
import { GameState, PaintEssence, TowerType, TowerStyle } from '../types/game';
import { Enemy, Tower, Projectile, Particle } from '../types/entities';
import { TOWER_COSTS } from '../config/towerConfig';
import { canPlaceTower, createTower, upgradeTower, canAffordTower } from '../logic/towerSystem';
import { spawnEnemy, moveEnemies } from '../logic/enemySystem';
import { resolveProjectileHits, createParticles, updateParticles, towerAttack } from '../logic/projectileSystem';
import { calculateWaveReward, getEnemiesPerWave, getSpawnRate, checkGameOver, checkVictory } from '../logic/waveSystem';
import { getPaintReward, getScoreReward } from '../logic/resourceSystem';

interface UseGameControllerReturn {
  gameState: GameState;
  wave: number;
  coreHealth: number;
  paint: PaintEssence;
  enemies: Enemy[];
  towers: Tower[];
  projectiles: Projectile[];
  particles: Particle[];
  selectedTowerType: TowerType | null;
  selectedStyle: TowerStyle;
  score: number;
  enemiesKilled: number;
  waveInProgress: boolean;
  collectedTowers: Set<string>;
  startGame: () => void;
  placeTower: (x: number, y: number) => void;
  upgradeTowerById: (towerId: number) => void;
  startWave: () => void;
  skipWave: () => void;
  togglePause: () => void;
  setSelectedTowerType: (type: TowerType | null) => void;
  setSelectedStyle: (style: TowerStyle) => void;
}

export const useGameController = (): UseGameControllerReturn => {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [wave, setWave] = useState(1);
  const [coreHealth, setCoreHealth] = useState(100);
  const [paint, setPaint] = useState<PaintEssence>({ red: 50, blue: 50, yellow: 50 });
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [towers, setTowers] = useState<Tower[]>([]);
  const [projectiles, setProjectiles] = useState<Projectile[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [selectedTowerType, setSelectedTowerType] = useState<TowerType | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<TowerStyle>('pencil');
  const [score, setScore] = useState(0);
  const [enemiesKilled, setEnemiesKilled] = useState(0);
  const [waveInProgress, setWaveInProgress] = useState(false);
  const [collectedTowers, setCollectedTowers] = useState<Set<string>>(new Set());

  const enemyIdRef = useRef(0);
  const towerIdRef = useRef(0);
  const projectileIdRef = useRef(0);
  const particleIdRef = useRef(0);
  const lastUpdateRef = useRef(Date.now());
  const enemiesSpawnedRef = useRef(0);
  const spawnTimerRef = useRef(0);

  const startGame = useCallback(() => {
    setGameState('playing');
    setWave(1);
    setCoreHealth(100);
    setPaint({ red: 50, blue: 50, yellow: 50 });
    setEnemies([]);
    setTowers([]);
    setProjectiles([]);
    setParticles([]);
    setScore(0);
    setEnemiesKilled(0);
    setWaveInProgress(false);
    setSelectedTowerType(null);
    enemyIdRef.current = 0;
    towerIdRef.current = 0;
    projectileIdRef.current = 0;
    particleIdRef.current = 0;
    enemiesSpawnedRef.current = 0;
    spawnTimerRef.current = 0;
  }, []);

  const placeTower = useCallback((x: number, y: number) => {
    if (!selectedTowerType || gameState !== 'playing') return;
    if (!canPlaceTower(x, y, towers)) return;

    const cost = TOWER_COSTS[selectedTowerType];
    if (!canAffordTower(selectedTowerType, paint)) return;

    const newTower = createTower(x, y, selectedTowerType, selectedStyle, towerIdRef.current++);
    setTowers(prev => [...prev, newTower]);
    setPaint(prev => ({
      red: prev.red - cost.red,
      blue: prev.blue - cost.blue,
      yellow: prev.yellow - cost.yellow,
    }));

    const towerKey = `${selectedTowerType}-${selectedStyle}`;
    if (!collectedTowers.has(towerKey)) {
      setCollectedTowers(prev => new Set(prev).add(towerKey));
    }
  }, [selectedTowerType, gameState, towers, paint, selectedStyle, collectedTowers]);

  const upgradeTowerById = useCallback((towerId: number) => {
    const tower = towers.find(t => t.id === towerId);
    if (!tower) return;
    
    const result = upgradeTower(tower, paint);
    if (result) {
      setTowers(prev => prev.map(t => t.id === towerId ? result.tower : t));
      setPaint(result.paint);
    }
  }, [towers, paint]);

  const startWave = useCallback(() => {
    if (waveInProgress) return;
    setWaveInProgress(true);
    enemiesSpawnedRef.current = 0;
    spawnTimerRef.current = 0;
  }, [waveInProgress]);

  const skipWave = useCallback(() => {
    if (!waveInProgress && wave < 10 && enemies.length === 0) {
      setWave(w => w + 1);
    }
  }, [waveInProgress, wave, enemies.length]);

  const togglePause = useCallback(() => {
    setGameState(prev => prev === 'paused' ? 'playing' : 'paused');
  }, []);

  const gameLoop = useCallback(() => {
    if (gameState !== 'playing') {
      return;
    }

    const now = Date.now();
    const delta = (now - lastUpdateRef.current) / 1000;
    lastUpdateRef.current = now;

    if (waveInProgress) {
      spawnTimerRef.current += delta;
      const enemiesPerWave = getEnemiesPerWave(wave);
      const spawnRate = getSpawnRate(wave);
      
      if (enemiesSpawnedRef.current < enemiesPerWave && spawnTimerRef.current >= spawnRate) {
        const newEnemy = spawnEnemy(wave, enemyIdRef.current++);
        setEnemies(prev => [...prev, newEnemy]);
        enemiesSpawnedRef.current++;
        spawnTimerRef.current = 0;
      }

      if (enemiesSpawnedRef.current >= enemiesPerWave && enemies.length === 0) {
        setWaveInProgress(false);
        if (wave >= 10) {
          setGameState('victory');
        } else {
          const bonus = calculateWaveReward();
          setPaint(prev => ({
            red: prev.red + bonus.red,
            blue: prev.blue + bonus.blue,
            yellow: prev.yellow + bonus.yellow,
          }));
        }
      }
    }

    setEnemies(prev => {
      const { updatedEnemies, coreDamage } = moveEnemies(prev, delta);
      
      if (coreDamage > 0) {
        setCoreHealth(h => Math.max(0, h - coreDamage));
      }
      
      return updatedEnemies;
    });

    setCoreHealth(h => {
      if (h <= 0) {
        setGameState('gameOver');
      }
      return h;
    });

    setTowers(prev => {
      const { updatedTowers, newProjectiles } = towerAttack(prev, enemies, now, projectileIdRef.current);
      
      if (newProjectiles.length > 0) {
        setProjectiles(p => [...p, ...newProjectiles]);
        projectileIdRef.current += newProjectiles.length;
      }
      
      return updatedTowers;
    });

    setProjectiles(prev => {
      const result = resolveProjectileHits(prev, enemies, delta, particleIdRef.current);
      
      if (result.newParticles.length > 0) {
        setParticles(p => [...p, ...result.newParticles]);
        particleIdRef.current += result.newParticles.length;
      }
      
      if (result.hitEnemies.length > 0) {
        setEnemies(enemies => {
          const killedEnemies: Enemy[] = [];
          const updatedEnemies = enemies.map(enemy => {
            const hits = result.hitEnemies.filter(h => h.enemy.id === enemy.id);
            if (hits.length === 0) return enemy;
            
            let newHealth = enemy.health;
            let newSpeed = enemy.speed;
            
            for (const hit of hits) {
              newHealth -= hit.damage;
              if (hit.isSlow) {
                newSpeed = Math.max(15, newSpeed * 0.7);
              }
            }
            
            if (newHealth <= 0) {
              killedEnemies.push(enemy);
              return null;
            }
            
            return { ...enemy, health: newHealth, speed: newSpeed };
          }).filter(Boolean) as Enemy[];
          
          for (const killed of killedEnemies) {
            const paintReward = getPaintReward(killed);
            const scoreReward = getScoreReward(killed);
            
            setPaint(p => ({ ...p, [paintReward.type]: p[paintReward.type] + paintReward.amount }));
            setScore(s => s + scoreReward);
            setEnemiesKilled(k => k + 1);
            
            const deathParticles = createParticles(killed.x, killed.y, killed.color, 8, particleIdRef.current);
            setParticles(p => [...p, ...deathParticles]);
            particleIdRef.current += 8;
          }
          
          return updatedEnemies;
        });
      }
      
      return result.remainingProjectiles;
    });

    setParticles(prev => updateParticles(prev));

  }, [gameState, wave, waveInProgress, enemies]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    let animationFrameId: number;

    const loop = () => {
      gameLoop();
      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [gameState, gameLoop]);

  return {
    gameState,
    wave,
    coreHealth,
    paint,
    enemies,
    towers,
    projectiles,
    particles,
    selectedTowerType,
    selectedStyle,
    score,
    enemiesKilled,
    waveInProgress,
    collectedTowers,
    startGame,
    placeTower,
    upgradeTowerById,
    startWave,
    skipWave,
    togglePause,
    setSelectedTowerType,
    setSelectedStyle,
  };
};
