import { CollectionPanel } from './components/CollectionPanel';
import { ControlPanel } from './components/ControlPanel';
import { GameActions } from './components/GameActions';
import { GameBoard } from './components/GameBoard';
import { GameLayout } from './components/GameLayout';
import { GameOverScreen } from './components/GameOverScreen';
import { GameStats } from './components/GameStats';
import { MenuScreen } from './components/MenuScreen';
import { VictoryScreen } from './components/VictoryScreen';
import { SURFACE_PATTERNS } from './config/gameConfig';
import { useGameController } from './hooks/useGameController';

export default function CanvasDefender() {
  const {
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
  } = useGameController();

  const isGameActive = gameState === 'playing' || gameState === 'paused';

  return (
    <div
      className="min-h-screen bg-amber-50 flex flex-col items-center justify-center p-4"
      style={{ backgroundImage: SURFACE_PATTERNS.appBackground }}
    >
      {gameState === 'menu' && <MenuScreen onStartGame={startGame} />}

      {isGameActive && (
        <GameLayout
          controlPanel={
            <ControlPanel
              paint={paint}
              selectedTowerType={selectedTowerType}
              selectedStyle={selectedStyle}
              onSelectTowerType={selectTowerType}
              onSelectStyle={selectStyle}
            />
          }
          centerPanel={
            <div className="flex flex-col items-center">
              <GameStats
                wave={wave}
                coreHealth={coreHealth}
                score={score}
                enemiesKilled={enemiesKilled}
              />
              <GameBoard
                coreHealth={coreHealth}
                enemies={enemies}
                towers={towers}
                projectiles={projectiles}
                particles={particles}
                selectedTowerType={selectedTowerType}
                onPlaceTower={placeTowerAt}
                onUpgradeTower={upgradeTowerById}
                canPlaceTowerAt={canPlaceTowerAt}
              />
              <GameActions
                wave={wave}
                waveInProgress={waveInProgress}
                enemyCount={enemies.length}
                gameState={gameState}
                onStartWave={startWave}
                onSkipWave={skipWave}
                onTogglePause={togglePause}
              />
            </div>
          }
          collectionPanel={
            <CollectionPanel
              collectedTowers={collectedTowers}
              enemiesKilled={enemiesKilled}
              score={score}
              towerCount={towers.length}
            />
          }
        />
      )}

      {gameState === 'gameOver' && (
        <GameOverScreen
          wave={wave}
          enemiesKilled={enemiesKilled}
          score={score}
          collectedCount={collectedTowers.size}
          onRestart={startGame}
        />
      )}

      {gameState === 'victory' && (
        <VictoryScreen
          enemiesKilled={enemiesKilled}
          score={score}
          collectedCount={collectedTowers.size}
          coreHealth={coreHealth}
          onRestart={startGame}
        />
      )}

      <div className="mt-4 text-amber-600 text-sm opacity-70">🎨 绘世守护者 - 用画笔守护你的世界</div>
    </div>
  );
}
