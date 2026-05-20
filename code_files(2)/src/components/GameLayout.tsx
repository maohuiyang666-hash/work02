import type { ReactNode } from 'react';

interface GameLayoutProps {
  controlPanel: ReactNode;
  centerPanel: ReactNode;
  collectionPanel: ReactNode;
}

export function GameLayout({ controlPanel, centerPanel, collectionPanel }: GameLayoutProps) {
  return <div className="flex flex-wrap gap-4 justify-center">{controlPanel}{centerPanel}{collectionPanel}</div>;
}
