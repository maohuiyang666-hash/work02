import type { GameStatus } from '../types/game';

interface GameActionsProps {
  wave: number;
  waveInProgress: boolean;
  enemyCount: number;
  gameState: GameStatus;
  onStartWave: () => void;
  onSkipWave: () => void;
  onTogglePause: () => void;
}

export function GameActions({
  wave,
  waveInProgress,
  enemyCount,
  gameState,
  onStartWave,
  onSkipWave,
  onTogglePause,
}: GameActionsProps) {
  return (
    <div className="flex gap-3 mt-3">
      {!waveInProgress ? (
        <button
          onClick={onStartWave}
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full font-bold hover:from-green-600 hover:to-emerald-600 transition-all transform hover:scale-105 shadow-lg"
        >
          🚀 开始第 {wave} 波 {wave > 1 && '(+10全部精华)'}
        </button>
      ) : (
        <div className="px-6 py-3 bg-orange-500 text-white rounded-full font-bold shadow-lg animate-pulse">
          ⚔️ 战斗中... ({enemyCount}只颜料怪)
        </div>
      )}

      {!waveInProgress && wave < 10 && enemyCount === 0 && (
        <button
          onClick={onSkipWave}
          className="px-4 py-3 bg-blue-500 text-white rounded-full font-bold hover:bg-blue-600 transition-all shadow-lg"
        >
          ⏩ 跳过
        </button>
      )}

      <button
        onClick={onTogglePause}
        className="px-4 py-3 bg-amber-500 text-white rounded-full font-bold hover:bg-amber-600 transition-all shadow-lg"
      >
        {gameState === 'paused' ? '▶️ 继续' : '⏸️ 暂停'}
      </button>
    </div>
  );
}
