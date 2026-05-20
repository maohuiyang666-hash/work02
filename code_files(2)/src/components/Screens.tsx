import React from 'react';

interface ScreenProps {
  score: number;
  wave: number;
  onRestart: () => void;
}

export const GameOverScreen: React.FC<ScreenProps> = ({ score, wave, onRestart }) => (
  <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
    <div className="bg-white rounded-3xl p-8 text-center max-w-sm mx-4 transform scale-110 shadow-2xl border-4 border-red-500">
      <h2 className="text-5xl mb-4">💔</h2>
      <h2 className="text-3xl font-bold text-red-600 mb-2">画布被毁！</h2>
      <p className="text-gray-600 mb-6">颜料怪占领了你的画作...</p>
      <div className="bg-gray-50 rounded-xl p-4 mb-6">
        <p className="text-lg mb-2">存活波次: <span className="font-bold text-amber-600">{wave}</span></p>
        <p className="text-lg">最终得分: <span className="font-bold text-amber-600">{score}</span></p>
      </div>
      <button onClick={onRestart}
              className="w-full py-3 bg-red-500 text-white rounded-xl font-bold text-lg hover:bg-red-600 transition-colors shadow-lg">
        重新开始绘制
      </button>
    </div>
  </div>
);

export const VictoryScreen: React.FC<ScreenProps> = ({ score, wave, onRestart }) => (
  <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
    <div className="bg-white rounded-3xl p-8 text-center max-w-sm mx-4 transform scale-110 shadow-2xl border-4 border-yellow-400">
      <h2 className="text-5xl mb-4">🏆</h2>
      <h2 className="text-3xl font-bold text-yellow-500 mb-2">完美画作！</h2>
      <p className="text-gray-600 mb-6">你成功守护了这幅杰作！</p>
      <div className="bg-yellow-50 rounded-xl p-4 mb-6 border border-yellow-200">
        <p className="text-lg mb-2">完成波次: <span className="font-bold text-amber-600">{wave}</span></p>
        <p className="text-lg">最终得分: <span className="font-bold text-amber-600">{score}</span></p>
      </div>
      <button onClick={onRestart}
              className="w-full py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-white rounded-xl font-bold text-lg hover:from-yellow-500 hover:to-amber-600 transition-colors shadow-lg">
        开启新画卷
      </button>
    </div>
  </div>
);
