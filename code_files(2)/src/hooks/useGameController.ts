import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, TowerType, TowerStyle, PaintEssence } from '../types/game';
import { Enemy, Tower, Projectile, Particle } from '../types/entities';
import { INITIAL_CORE_HEALTH } from '../config/gameConfig';
import { TOWER_COSTS } from '../config/towerConfig';
import { canPlaceTower, createTower, upgradeTowerData } from '../logic/towerSystem';
import { spawnEnemy, moveEnemies } from '../logic/enemySystem';
import { resolveProjectileHits, towerFire } from '../logic/projectileSystem';
import { calculateWaveReward, checkGameOver, checkVictory } from '../logic/waveSystem';
import { canAffordTower, deductTowerCost } from '../logic/resourceSystem';

export const useGameController = () => {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [wave, setWave] = useState(1);
  const [coreHealth, setCoreHealth] = useState(INITIAL_CORE_HEALTH);
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

  const gameLoopRef = useRef<number | null>(null);
  const enemyIdRef = useRef(0);
  const towerIdRef = useRef(0);
  const projectileIdRef = useRef(0);
  const particleIdRef = useRef(0);
  const lastUpdateRef = useRef(Date.now());
  const enemiesSpawnedRef = useRef(0);
  const spawnTimerRef = useRef(0);

  const startGame = () => {
    setGameState('playing');
    setWave(1);
    setCoreHealth(INITIAL_CORE_HEALTH);
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
  };

  const startWave = () => {
    if (waveInProgress) return;
    setWaveInProgress(true);
    enemiesSpawnedRef.current = 0;
    spawnTimerRef.current = 0;
  };

  const placeTower = (x: number, y: number) => {
    if (!selectedTowerType || gameState !== 'playing') return;
    if (!canPlaceTower(x, y, towers)) return;

    const cost = TOWER_COSTS[selectedTowerType];
    if (!canAffordTower(paint, cost)) return;

    const newTower = createTower(towerIdRef.current++, x, y, selectedTowerType, selectedStyle);
    setTowers((prev: Tower[]) => [...prev, newTower]);
    setPaint((prev: PaintEssence) => deductTowerCost(prev, cost));

    const towerKey = `${selectedTowerType}-${selectedStyle}`;
    if (!collectedTowers.has(towerKey)) {
      setCollectedTowers((prev: Set<string>) => new Set(prev).add(towerKey));
    }
  };

  const upgradeTower = (towerId: number) => {
    const tower = towers.find(t => t.id === towerId);
    if (!tower) return;
    const { updatedTower, remainingPaint, success } = upgradeTowerData(tower, paint);
    if (success) {
      setPaint(remainingPaint);
      setTowers(prev => prev.map(t => t.id === towerId ? updatedTower : t));
    }
  };

  const gameLoop = useCallback(() => {
    if (gameState !== 'playing') {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
      return;
    }

    const now = Date.now();
    const delta = (now - lastUpdateRef.current) / 1000;
    lastUpdateRef.current = now;

    if (waveInProgress) {
      spawnTimerRef.current += delta;
      const enemiesPerWave = 5 + wave * 3;
      const spawnRate = 1.5 - Math.min(wave * 0.1, 0.8);
      
      if (enemiesSpawnedRef.current < enemiesPerWave && spawnTimerRef.current >= spawnRate) {
        setEnemies(prev => [...prev, spawnEnemy(enemyIdRef.current++, wave)]);
        enemiesSpawnedRef.current++;
        spawnTimerRef.current = 0;
      }

      if (enemiesSpawnedRef.current >= enemiesPerWave && enemies.length === 0) {
        setWaveInProgress(false);
        if (checkVictory(wave)) {
          setGameState('victory');
        } else {
          setPaint(prev => calculateWaveReward(prev));
        }
      }
    }

    // Move enemies
    let newDamageToCore = 0;
    setEnemies(prev => {
      const { updatedEnemies, damage } = moveEnemies(prev, delta);
      newDamageToCore = damage;
      return updatedEnemies;
    });

    if (newDamageToCore > 0) {
      setCoreHealth(h => {
        const newHealth = Math.max(0, h - newDamageToCore);
        if (checkGameOver(newHealth)) {
          setGameState('gameOver');
        }
        return newHealth;
      });
    }

    // Tower firing
    setTowers(prev => {
      const { updatedTowers, newProjectiles } = towerFire(prev, enemies, Date.now(), projectileIdRef);
      if (newProjectiles.length > 0) {
        setProjectiles(p => [...p, ...newProjectiles]);
      }
      return updatedTowers;
    });

    // Resolve projectiles
    setProjectiles(prev => {
      const {
        remainingProjectiles,
        remainingEnemies,
        newParticles,
        newPaint,
        newScore,
        newEnemiesKilled
      } = resolveProjectileHits(
        prev,
        enemies,
        delta,
        paint,
        score,
        enemiesKilled,
        particleIdRef
      );

      setEnemies(remainingEnemies);
      if (newParticles.length > 0) {
        setParticles(p => [...p, ...newParticles]);
      }
      setPaint(newPaint);
      setScore(newScore);
      setEnemiesKilled(newEnemiesKilled);

      return remainingProjectiles;
    });

    // Particles
    setParticles(prev => prev.map(p => ({
      ...p,
      x: p.x + p.velocityX,
      y: p.y + p.velocityY,
      life: p.life - 1,
      size: p.size * 0.95,
    })).filter(p => p.life > 0));

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [gameState, enemies, wave, waveInProgress, paint, score, enemiesKilled]);

  useEffect(() => {
    lastUpdateRef.current = Date.now();
    gameLoopRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameLoop]);

  return {
    gameState, setGameState,
    wave, setWave,
    coreHealth, setCoreHealth,
    paint, setPaint,
    enemies, setEnemies,
    towers, setTowers,
    projectiles, setProjectiles,
    particles, setParticles,
    selectedTowerType, setSelectedTowerType,
    selectedStyle, setSelectedStyle,
    score, setScore,
    enemiesKilled, setEnemiesKilled,
    waveInProgress, setWaveInProgress,
    collectedTowers, setCollectedTowers,
    startGame,
    startWave,
    placeTower,
    upgradeTower,
  };
};
