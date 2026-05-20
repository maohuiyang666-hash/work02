import { useCallback, useEffect, useRef, useState } from 'react';
import { INITIAL_CORE_HEALTH, INITIAL_PAINT } from '../config/gameConfig';
import { moveEnemies, getEnemiesPerWave, getSpawnRate, spawnEnemy } from '../logic/enemySystem';
import { updateParticles } from '../logic/particleSystem';
import { resolveProjectileHits } from '../logic/projectileSystem';
import { addPaint } from '../logic/resourceSystem';
import { canPlaceTower, fireTowers, placeTower, upgradeTower } from '../logic/towerSystem';
import { calculateWaveReward, checkGameOver, checkVictory } from '../logic/waveSystem';
import type { Enemy, PaintEssence, Particle, Projectile, Tower } from '../types/entities';
import type { GameStatus, TowerStyle, TowerType } from '../types/game';

export function useGameController() {
  const [gameState, setGameState] = useState<GameStatus>('menu');
  const [wave, setWave] = useState(1);
  const [coreHealth, setCoreHealth] = useState(INITIAL_CORE_HEALTH);
  const [paint, setPaint] = useState<PaintEssence>(INITIAL_PAINT);
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

  const gameStateRef = useRef<GameStatus>('menu');
  const waveRef = useRef(1);
  const coreHealthRef = useRef(INITIAL_CORE_HEALTH);
  const paintRef = useRef<PaintEssence>(INITIAL_PAINT);
  const enemiesRef = useRef<typeof enemies>([]);
  const towersRef = useRef<Tower[]>([]);
  const projectilesRef = useRef<Projectile[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const selectedTowerTypeRef = useRef<TowerType | null>(null);
  const selectedStyleRef = useRef<TowerStyle>('pencil');
  const scoreRef = useRef(0);
  const enemiesKilledRef = useRef(0);
  const waveInProgressRef = useRef(false);

  const requestNextFrame = useCallback(() => {
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, []);

  const applyGameState = useCallback((value: GameStatus) => {
    gameStateRef.current = value;
    setGameState(value);
  }, []);

  const applyWave = useCallback((value: number) => {
    waveRef.current = value;
    setWave(value);
  }, []);

  const applyCoreHealth = useCallback((value: number) => {
    coreHealthRef.current = value;
    setCoreHealth(value);
  }, []);

  const applyPaint = useCallback((value: PaintEssence) => {
    paintRef.current = value;
    setPaint(value);
  }, []);

  const applyEnemies = useCallback((value: typeof enemies) => {
    enemiesRef.current = value;
    setEnemies(value);
  }, []);

  const applyTowers = useCallback((value: Tower[]) => {
    towersRef.current = value;
    setTowers(value);
  }, []);

  const applyProjectiles = useCallback((value: Projectile[]) => {
    projectilesRef.current = value;
    setProjectiles(value);
  }, []);

  const applyParticles = useCallback((value: Particle[]) => {
    particlesRef.current = value;
    setParticles(value);
  }, []);

  const applySelectedTowerType = useCallback((value: TowerType | null) => {
    selectedTowerTypeRef.current = value;
    setSelectedTowerType(value);
  }, []);

  const applySelectedStyle = useCallback((value: TowerStyle) => {
    selectedStyleRef.current = value;
    setSelectedStyle(value);
  }, []);

  const applyScore = useCallback((value: number) => {
    scoreRef.current = value;
    setScore(value);
  }, []);

  const applyEnemiesKilled = useCallback((value: number) => {
    enemiesKilledRef.current = value;
    setEnemiesKilled(value);
  }, []);

  const applyWaveInProgress = useCallback((value: boolean) => {
    waveInProgressRef.current = value;
    setWaveInProgress(value);
  }, []);

  const resetRoundState = useCallback(() => {
    applyGameState('playing');
    applyWave(1);
    applyCoreHealth(INITIAL_CORE_HEALTH);
    applyPaint(INITIAL_PAINT);
    applyEnemies([]);
    applyTowers([]);
    applyProjectiles([]);
    applyParticles([]);
    applyScore(0);
    applyEnemiesKilled(0);
    applyWaveInProgress(false);
    applySelectedTowerType(null);
    enemyIdRef.current = 0;
    towerIdRef.current = 0;
    projectileIdRef.current = 0;
    particleIdRef.current = 0;
    enemiesSpawnedRef.current = 0;
    spawnTimerRef.current = 0;
    lastUpdateRef.current = Date.now();
  }, [
    applyCoreHealth,
    applyEnemies,
    applyEnemiesKilled,
    applyGameState,
    applyPaint,
    applyParticles,
    applyProjectiles,
    applyScore,
    applySelectedTowerType,
    applyTowers,
    applyWave,
    applyWaveInProgress,
  ]);

  const startGame = useCallback(() => {
    resetRoundState();
  }, [resetRoundState]);

  const startWave = useCallback(() => {
    if (waveInProgressRef.current) {
      return;
    }

    applyWaveInProgress(true);
    enemiesSpawnedRef.current = 0;
    spawnTimerRef.current = 0;
  }, [applyWaveInProgress]);

  const skipWave = useCallback(() => {
    if (waveInProgressRef.current || enemiesRef.current.length > 0 || waveRef.current >= 10) {
      return;
    }

    applyWave(waveRef.current + 1);
  }, [applyWave]);

  const togglePause = useCallback(() => {
    setGameState((currentState: GameStatus) => {
      const nextState = currentState === 'paused' ? 'playing' : 'paused';
      gameStateRef.current = nextState;
      return nextState;
    });
  }, []);

  const selectTowerType = useCallback((type: TowerType | null) => {
    applySelectedTowerType(type);
  }, [applySelectedTowerType]);

  const selectStyle = useCallback((style: TowerStyle) => {
    applySelectedStyle(style);
  }, [applySelectedStyle]);

  const placeTowerAt = useCallback((x: number, y: number) => {
    if (!selectedTowerTypeRef.current || gameStateRef.current !== 'playing') {
      return;
    }

    const result = placeTower(
      towersRef.current,
      paintRef.current,
      towerIdRef.current,
      x,
      y,
      selectedTowerTypeRef.current,
      selectedStyleRef.current,
    );

    if (!result.tower) {
      return;
    }

    towerIdRef.current += 1;
    applyTowers(result.towers);
    applyPaint(result.paint);

    const towerKey = `${selectedTowerTypeRef.current}-${selectedStyleRef.current}`;
    setCollectedTowers((previous: Set<string>) => {
      if (previous.has(towerKey)) {
        return previous;
      }

      const next = new Set(previous);
      next.add(towerKey);
      return next;
    });
  }, [applyPaint, applyTowers]);

  const upgradeTowerById = useCallback((towerId: number) => {
    const tower = towersRef.current.find((entry: Tower) => entry.id === towerId);

    if (!tower) {
      return;
    }

    const result = upgradeTower(tower, paintRef.current);

    if (!result) {
      return;
    }

    applyPaint(result.updatedPaint);
    applyTowers(
      towersRef.current.map((entry: Tower) =>
        entry.id === towerId ? result.upgradedTower : entry,
      ),
    );
  }, [applyPaint, applyTowers]);

  const canPlaceTowerAt = useCallback((x: number, y: number) => canPlaceTower(x, y, towersRef.current), []);

  const gameLoop = useCallback(() => {
    if (gameStateRef.current !== 'playing') {
      requestNextFrame();
      return;
    }

    const now = Date.now();
    const deltaSeconds = (now - lastUpdateRef.current) / 1000;
    lastUpdateRef.current = now;

    const currentEnemies = enemiesRef.current;
    const currentTowers = towersRef.current;
    const currentProjectiles = projectilesRef.current;
    const currentParticles = particlesRef.current;

    let nextGameState = gameStateRef.current;
    let nextPaint = paintRef.current;
    let nextCoreHealth = coreHealthRef.current;
    let nextScore = scoreRef.current;
    let nextEnemiesKilled = enemiesKilledRef.current;
    let nextWaveInProgress = waveInProgressRef.current;
    let movedEnemies = currentEnemies;
    let nextTowers = currentTowers;
    let nextProjectiles = currentProjectiles;

    if (waveInProgressRef.current) {
      spawnTimerRef.current += deltaSeconds;
      const enemiesPerWave = getEnemiesPerWave(waveRef.current);
      const spawnRate = getSpawnRate(waveRef.current);

      if (enemiesSpawnedRef.current < enemiesPerWave && spawnTimerRef.current >= spawnRate) {
        movedEnemies = [...movedEnemies, spawnEnemy(enemyIdRef.current, waveRef.current)];
        enemyIdRef.current += 1;
        enemiesSpawnedRef.current += 1;
        spawnTimerRef.current = 0;
      }

      if (enemiesSpawnedRef.current >= enemiesPerWave && currentEnemies.length === 0) {
        nextWaveInProgress = false;

        if (checkVictory(waveRef.current)) {
          nextGameState = 'victory';
        } else {
          nextPaint = addPaint(nextPaint, calculateWaveReward());
        }
      }
    }

    const movementResult = moveEnemies(movedEnemies, deltaSeconds);
    movedEnemies = movementResult.enemies;

    if (movementResult.coreDamage > 0) {
      nextCoreHealth = Math.max(0, nextCoreHealth - movementResult.coreDamage);
    }

    if (checkGameOver(nextCoreHealth)) {
      nextGameState = 'gameOver';
    }

    const towerFireResult = fireTowers(currentTowers, currentEnemies, now, projectileIdRef.current);
    nextTowers = towerFireResult.towers;
    projectileIdRef.current = towerFireResult.nextProjectileId;
    nextProjectiles = [...currentProjectiles, ...towerFireResult.projectiles];

    const projectileResolution = resolveProjectileHits(
      nextProjectiles,
      movedEnemies,
      deltaSeconds,
      particleIdRef.current,
    );

    nextProjectiles = projectileResolution.projectiles;
    movedEnemies = projectileResolution.enemies;
    particleIdRef.current = projectileResolution.nextParticleId;
    nextPaint = addPaint(nextPaint, projectileResolution.paintGain);
    nextScore += projectileResolution.scoreGain;
    nextEnemiesKilled += projectileResolution.enemiesKilled;

    const nextParticles = updateParticles([...currentParticles, ...projectileResolution.particles]);

    applyEnemies(movedEnemies);
    applyTowers(nextTowers);
    applyProjectiles(nextProjectiles);
    applyParticles(nextParticles);
    applyPaint(nextPaint);
    applyCoreHealth(nextCoreHealth);
    applyScore(nextScore);
    applyEnemiesKilled(nextEnemiesKilled);
    applyWaveInProgress(nextWaveInProgress);

    if (nextGameState !== gameStateRef.current) {
      applyGameState(nextGameState);
    }

    requestNextFrame();
  }, [
    applyCoreHealth,
    applyEnemies,
    applyEnemiesKilled,
    applyGameState,
    applyPaint,
    applyParticles,
    applyProjectiles,
    applyScore,
    applyTowers,
    applyWaveInProgress,
    requestNextFrame,
  ]);

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
    startWave,
    skipWave,
    togglePause,
    selectTowerType,
    selectStyle,
    placeTowerAt,
    upgradeTowerById,
    canPlaceTowerAt,
  };
}
