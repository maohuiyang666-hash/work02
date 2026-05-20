import React from 'react';
import { useGameController } from './hooks/useGameController';
import { GameLayout } from './components/GameLayout';
import { GameStats } from './components/GameStats';
import { MenuScreen } from './components/MenuScreen';
import { ControlPanel } from './components/ControlPanel';
import { GameBoard } from './components/GameBoard';
import { TowerSelector, StyleSelector, CollectionPanel } from './components/Panels';
import { GameOverScreen, VictoryScreen } from './components/Screens';

export default function CanvasDefender() {
  const {
    gameState, setGameState,
    wave, setWave,
    coreHealth,
    paint,
    enemies,
    towers,
    projectiles,
    particles,
    selectedTowerType, setSelectedTowerType,
    selectedStyle, setSelectedStyle,
    score,
    enemiesKilled,
    waveInProgress,
    collectedTowers,
    startGame,
    startWave,
    placeTower,
    upgradeTower,
  } = useGameController();

  return (
    <GameLayout>
      {gameState === 'menu' && (
        <MenuScreen onStartGame={startGame} />
      )}

      {(gameState === 'playing' || gameState === 'paused') && (
        <div className="flex flex-wrap gap-4 justify-center">
          <div className="bg-white rounded-2xl p-4 shadow-xl border-2 border-amber-300 w-56">
            <h3 className="font-bold text-amber-800 mb-3 text-center text-lg border-b-2 border-dashed border-amber-200 pb-2">
              🎨 颜料精华
            </h3>
            
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 p-2 bg-red-50 rounded-lg">
                <div className="w-6 h-6 rounded-full bg-red-500 shadow-inner"></div>
                <div className="flex-1">
                  <div className="text-xs text-red-600 font-medium">红色</div>
                  <div className="h-2 bg-red-200 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 transition-all" style={{ width: `${Math.min(100, paint.red)}%` }}></div>
                  </div>
                </div>
                <span className="font-bold text-red-600 w-8 text-right">{paint.red}</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                <div className="w-6 h-6 rounded-full bg-blue-500 shadow-inner"></div>
                <div className="flex-1">
                  <div className="text-xs text-blue-600 font-medium">蓝色</div>
                  <div className="h-2 bg-blue-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 transition-all" style={{ width: `${Math.min(100, paint.blue)}%` }}></div>
                  </div>
                </div>
                <span className="font-bold text-blue-600 w-8 text-right">{paint.blue}</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg">
                <div className="w-6 h-6 rounded-full bg-yellow-500 shadow-inner"></div>
                <div className="flex-1">
                  <div className="text-xs text-yellow-600 font-medium">黄色</div>
                  <div className="h-2 bg-yellow-200 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-500 transition-all" style={{ width: `${Math.min(100, paint.yellow)}%` }}></div>
                  </div>
                </div>
                <span className="font-bold text-yellow-600 w-8 text-right">{paint.yellow}</span>
              </div>
            </div>

            <h3 className="font-bold text-amber-800 mb-2 text-center border-b-2 border-dashed border-amber-200 pb-2">
              ✏️ 绘制防御塔
            </h3>
            <TowerSelector
              selectedTowerType={selectedTowerType}
              setSelectedTowerType={setSelectedTowerType}
              selectedStyle={selectedStyle}
            />

            <h3 className="font-bold text-amber-800 mb-2 text-center border-b-2 border-dashed border-amber-200 pb-2">
              🖌️ 笔触风格
            </h3>
            <StyleSelector
              selectedStyle={selectedStyle}
              setSelectedStyle={setSelectedStyle}
            />

            <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded-lg text-center">
              💡 点击画布空白处放置防御塔
            </div>
          </div>

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
              coreHealth={coreHealth}
              selectedTowerType={selectedTowerType}
              placeTower={placeTower}
              upgradeTower={upgradeTower}
            />

            <ControlPanel
              waveInProgress={waveInProgress}
              wave={wave}
              enemiesCount={enemies.length}
              gameState={gameState}
              startWave={startWave}
              setWave={setWave}
              setGameState={setGameState}
            />
          </div>

          <CollectionPanel collectedTowers={collectedTowers} />
        </div>
      )}

      {gameState === 'gameOver' && <GameOverScreen score={score} wave={wave} onRestart={startGame} />}
      {gameState === 'victory' && <VictoryScreen score={score} wave={wave} onRestart={startGame} />}
    </GameLayout>
  );
}
