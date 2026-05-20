import React from 'react';
import { useGameController } from './hooks/useGameController';
import { 
  MenuScreen, 
  GameOverScreen, 
  VictoryScreen, 
  ControlPanel, 
  CollectionPanel, 
  GameStats, 
  GameBoard, 
  GameControls 
} from './components';

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
    placeTower,
    upgradeTowerById,
    startWave,
    skipWave,
    togglePause,
    setSelectedTowerType,
    setSelectedStyle,
  } = useGameController();

  return (
    <div className="min-h-screen bg-amber-50 flex flex-col items-center justify-center p-4"
         style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 47px, #e8d5c4 48px), repeating-linear-gradient(90deg, transparent, transparent 47px, #e8d5c4 48px)' }}>
      
      {gameState === 'menu' && (
        <MenuScreen onStart={startGame} />
      )}

      {(gameState === 'playing' || gameState === 'paused') && (
        <div className="flex flex-wrap gap-4 justify-center">
          <ControlPanel 
            paint={paint}
            selectedTowerType={selectedTowerType}
            selectedStyle={selectedStyle}
            onSelectTowerType={setSelectedTowerType}
            onSelectStyle={setSelectedStyle}
          />

          <div className="flex flex-col items-center">
            <GameStats 
              wave={wave}
              coreHealth={coreHealth}
              score={score}
              enemiesKilled={enemiesKilled}
            />

            <GameBoard 
              towers={towers}
              enemies={enemies}
              projectiles={projectiles}
              particles={particles}
              selectedTowerType={selectedTowerType}
              coreHealth={coreHealth}
              onPlaceTower={placeTower}
              onUpgradeTower={upgradeTowerById}
            />

            <GameControls 
              wave={wave}
              waveInProgress={waveInProgress}
              enemiesLength={enemies.length}
              gameState={gameState}
              onStartWave={startWave}
              onSkipWave={skipWave}
              onTogglePause={togglePause}
            />
          </div>

          <CollectionPanel 
            collectedTowers={collectedTowers}
            enemiesKilled={enemiesKilled}
            score={score}
            towerCount={towers.length}
          />
        </div>
      )}

      {gameState === 'gameOver' && (
        <GameOverScreen 
          wave={wave}
          enemiesKilled={enemiesKilled}
          score={score}
          collectedTowers={collectedTowers.size}
          onRestart={startGame}
        />
      )}

      {gameState === 'victory' && (
        <VictoryScreen 
          enemiesKilled={enemiesKilled}
          score={score}
          collectedTowers={collectedTowers.size}
          onRestart={startGame}
        />
      )}
    </div>
  );
}
