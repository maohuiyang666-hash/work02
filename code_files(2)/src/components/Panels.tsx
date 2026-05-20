import React from 'react';
import { PaintEssence, TowerType, TowerStyle } from '../types/game';
import { TOWER_COSTS, getColorValue, getStyleClass } from '../config/towerConfig';

export const TowerSelector: React.FC<{
  selectedTowerType: TowerType | null;
  setSelectedTowerType: (type: TowerType | null) => void;
  selectedStyle: TowerStyle;
}> = ({ selectedTowerType, setSelectedTowerType, selectedStyle }) => {
  return (
    <div className="space-y-2 mb-4">
      {(['red', 'blue', 'yellow'] as const).map(type => (
        <button
          key={type}
          onClick={() => setSelectedTowerType(selectedTowerType === type ? null : type)}
          className={`w-full p-2 rounded-xl border-2 transition-all flex items-center gap-2 ${
            selectedTowerType === type
              ? 'border-gray-800 shadow-lg scale-105'
              : 'border-gray-200 hover:border-gray-400'
          }`}
          style={{
            background: `linear-gradient(135deg, ${getColorValue(type)}30, white)`,
          }}
        >
          <div className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center text-xl ${getStyleClass(selectedStyle)}`}
               style={{ backgroundColor: getColorValue(type) }}>
            {selectedStyle === 'pencil' ? '✏️' : selectedStyle === 'watercolor' ? '💧' : '🖌️'}
          </div>
          <div className="text-left flex-1">
            <div className="text-sm font-bold" style={{ color: getColorValue(type) }}>
              {type === 'red' ? '烈焰塔' : type === 'blue' ? '寒冰塔' : '雷电塔'}
            </div>
            <div className="text-xs text-gray-500">消耗 {TOWER_COSTS[type][type]} 精华</div>
          </div>
        </button>
      ))}
    </div>
  );
};

export const StyleSelector: React.FC<{
  selectedStyle: TowerStyle;
  setSelectedStyle: (style: TowerStyle) => void;
}> = ({ selectedStyle, setSelectedStyle }) => {
  return (
    <div className="grid grid-cols-3 gap-1 mb-4">
      {(['pencil', 'watercolor', 'oil'] as const).map((style) => (
        <button
          key={style}
          onClick={() => setSelectedStyle(style as TowerStyle)}
          className={`p-2 rounded-lg text-xs font-medium transition-all ${
            selectedStyle === style
              ? 'bg-amber-400 text-amber-900 shadow-md'
              : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
          }`}
        >
          {style === 'pencil' ? '✏️铅笔' : style === 'watercolor' ? '💧水彩' : '🖌️油画'}
        </button>
      ))}
    </div>
  );
};

export const CollectionPanel: React.FC<{ collectedTowers: Set<string> }> = ({ collectedTowers }) => {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-xl border-2 border-amber-300 w-52">
      <h3 className="font-bold text-amber-800 mb-3 text-center text-lg border-b-2 border-dashed border-amber-200 pb-2">
        📖 图鉴收集
      </h3>
      
      <div className="grid grid-cols-3 gap-2 mb-4">
        {(['red', 'blue', 'yellow'] as const).map(type => 
          (['pencil', 'watercolor', 'oil'] as const).map(style => {
            const key = `${type}-${style}`;
            const collected = collectedTowers.has(key);
            return (
              <div key={key}
                   className={`aspect-square rounded-lg border-2 flex flex-col items-center justify-center transition-all ${
                     collected ? `${getStyleClass(style)} shadow-md` : 'bg-gray-100 border-gray-200'
                   }`}
                   style={{ backgroundColor: collected ? getColorValue(type) : '#f3f4f6' }}
                   title={collected ? `${type}-${style}` : '未收集'}>
                <span className="text-lg">
                  {collected ? (
                    style === 'pencil' ? '✏️' : style === 'watercolor' ? '💧' : '🖌️'
                  ) : '❓'}
                </span>
              </div>
            );
          })
        )}
      </div>
      <div className="text-xs text-center text-gray-500">
        收集进度: {collectedTowers.size} / 9
      </div>
    </div>
  );
};
