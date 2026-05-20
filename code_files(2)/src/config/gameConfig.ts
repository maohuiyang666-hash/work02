import { Position, PathLine } from '../types/game';

export const GRID_SIZE = 10;
export const CELL_SIZE = 50;

export const PATH: Position[] = [
  { x: 0, y: 4 },
  { x: 2, y: 4 },
  { x: 2, y: 2 },
  { x: 5, y: 2 },
  { x: 5, y: 6 },
  { x: 7, y: 6 },
  { x: 7, y: 4 },
  { x: 9, y: 4 },
];

export const CORE_POSITION: Position = { x: 9, y: 4 };

export const generatePathLines = (): PathLine[] => {
  const lines: PathLine[] = [];
  for (let i = 0; i < PATH.length - 1; i++) {
    lines.push({
      x1: PATH[i].x * CELL_SIZE + CELL_SIZE / 2,
      y1: PATH[i].y * CELL_SIZE + CELL_SIZE / 2,
      x2: PATH[i + 1].x * CELL_SIZE + CELL_SIZE / 2,
      y2: PATH[i + 1].y * CELL_SIZE + CELL_SIZE / 2,
    });
  }
  return lines;
};

export const PATH_LINES = generatePathLines();

export const getColorValue = (type: 'red' | 'blue' | 'yellow'): string => {
  const colors = {
    red: '#e74c3c',
    blue: '#3498db',
    yellow: '#f39c12',
  };
  return colors[type];
};

export const getStyleClass = (style: string) => {
  switch (style) {
    case 'pencil': return 'border-2 border-dashed';
    case 'watercolor': return 'opacity-80';
    case 'oil': return 'border-4';
    default: return '';
  }
};
