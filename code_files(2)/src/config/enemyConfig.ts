export const getEnemyColor = (type: 'red' | 'blue' | 'yellow' | 'mixed') => {
  const colors = {
    red: '#c0392b',
    blue: '#2980b9',
    yellow: '#d68910',
    mixed: ['#8e44ad', '#16a085', '#d35400'][Math.floor(Math.random() * 3)],
  };
  return colors[type];
};
