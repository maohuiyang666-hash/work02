import { TOWER_STYLE_CONFIG } from '../config/towerConfig';
import type { TowerStyle } from '../types/game';

interface StyleSelectorProps {
  selectedStyle: TowerStyle;
  onSelectStyle: (style: TowerStyle) => void;
}

const STYLES: TowerStyle[] = ['pencil', 'watercolor', 'oil'];

export function StyleSelector({ selectedStyle, onSelectStyle }: StyleSelectorProps) {
  return (
    <>
      <h3 className="font-bold text-amber-800 mb-2 text-center border-b-2 border-dashed border-amber-200 pb-2">
        🖌️ 笔触风格
      </h3>

      <div className="grid grid-cols-3 gap-1 mb-4">
        {STYLES.map((style) => (
          <button
            key={style}
            onClick={() => onSelectStyle(style)}
            className={`p-2 rounded-lg text-xs font-medium transition-all ${
              selectedStyle === style
                ? 'bg-amber-400 text-amber-900 shadow-md'
                : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
            }`}
          >
            {TOWER_STYLE_CONFIG[style].label}
          </button>
        ))}
      </div>
    </>
  );
}
