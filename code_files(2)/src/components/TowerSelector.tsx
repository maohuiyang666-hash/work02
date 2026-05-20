import { TOWER_BASE_STATS, TOWER_COSTS, TOWER_STYLE_CONFIG, getStyleClass, getTowerColor } from '../config/towerConfig';
import type { PaintEssence } from '../types/entities';
import type { TowerStyle, TowerType } from '../types/game';

interface TowerSelectorProps {
  paint: PaintEssence;
  selectedTowerType: TowerType | null;
  selectedStyle: TowerStyle;
  onSelectTowerType: (type: TowerType | null) => void;
}

const TOWER_TYPES: TowerType[] = ['red', 'blue', 'yellow'];

export function TowerSelector({
  paint,
  selectedTowerType,
  selectedStyle,
  onSelectTowerType,
}: TowerSelectorProps) {
  return (
    <>
      <h3 className="font-bold text-amber-800 mb-2 text-center border-b-2 border-dashed border-amber-200 pb-2">
        ✏️ 绘制防御塔
      </h3>

      <div className="space-y-2 mb-4">
        {TOWER_TYPES.map((type) => {
          const cost = TOWER_COSTS[type][type];
          const insufficientPaint = paint[type] < cost;

          return (
            <button
              key={type}
              onClick={() => onSelectTowerType(selectedTowerType === type ? null : type)}
              className={`w-full p-2 rounded-xl border-2 transition-all flex items-center gap-2 ${
                selectedTowerType === type
                  ? 'border-gray-800 shadow-lg scale-105'
                  : 'border-gray-200 hover:border-gray-400'
              } ${insufficientPaint ? 'opacity-60' : ''}`}
              style={{
                background: `linear-gradient(135deg, ${getTowerColor(type)}30, white)`,
              }}
            >
              <div
                className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center text-xl ${getStyleClass(selectedStyle)}`}
                style={{ backgroundColor: getTowerColor(type) }}
              >
                {TOWER_STYLE_CONFIG[selectedStyle].icon}
              </div>
              <div className="text-left flex-1">
                <div className="text-sm font-bold" style={{ color: getTowerColor(type) }}>
                  {TOWER_BASE_STATS[type].displayName}
                </div>
                <div className="text-xs text-gray-500">消耗 {cost} 精华</div>
              </div>
            </button>
          );
        })}
      </div>
    </>
  );
}
