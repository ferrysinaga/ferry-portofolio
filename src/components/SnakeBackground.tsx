import { useEffect, useState } from 'react';

const GRID_SIZE = 20;

const SnakeBackground = () => {
  // Tambahkan koordinat y ke bawah untuk memperpanjang ekor ular
  const [snake, setSnake] = useState([
    { x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 },
    { x: 10, y: 13 }, { x: 10, y: 14 }, { x: 10, y: 15 },
    { x: 10, y: 16 }, { x: 10, y: 17 }, { x: 10, y: 18 },
    { x: 10, y: 19 }, { x: 10, y: 20 }, { x: 10, y: 21 },
    { x: 10, y: 22 }, { x: 10, y: 23 }, { x: 10, y: 24 }
  ]);
  const [direction, setDirection] = useState({ x: 0, y: -1 }); 
  const [gridSize, setGridSize] = useState({ width: 50, height: 50 });

  useEffect(() => {
    const updateSize = () => {
      setGridSize({
        width: Math.floor(window.innerWidth / GRID_SIZE),
        height: Math.floor(window.innerHeight / GRID_SIZE)
      });
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    const moveInterval = setInterval(() => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        let newX = head.x + direction.x;
        let newY = head.y + direction.y;

        if (newX >= gridSize.width) newX = 0;
        if (newX < 0) newX = gridSize.width - 1;
        if (newY >= gridSize.height) newY = 0;
        if (newY < 0) newY = gridSize.height - 1;

        const newHead = { x: newX, y: newY };
        return [newHead, ...prevSnake.slice(0, -1)];
      });
    }, 150);

    return () => clearInterval(moveInterval);
  }, [direction, gridSize]);

  useEffect(() => {
    const turnInterval = setInterval(() => {
      setDirection((prev) => {
        const possibleMoves = [
          { x: 0, y: -1 }, { x: 0, y: 1 }, { x: -1, y: 0 }, { x: 1, y: 0 }
        ];
        const validMoves = possibleMoves.filter(m => m.x !== -prev.x || m.y !== -prev.y);
        return validMoves[Math.floor(Math.random() * validMoves.length)];
      });
    }, 2000); 

    return () => clearInterval(turnInterval);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-50">
      {snake.map((segment, i) => (
        <div
          key={i}
          className="absolute bg-[#1d1d1d] rounded-sm transition-all duration-75"
          style={{
            left: segment.x * GRID_SIZE,
            top: segment.y * GRID_SIZE,
            width: GRID_SIZE - 2, 
            height: GRID_SIZE - 2,
            opacity: i === 0 ? 1 : 0.8, 
          }}
        />
      ))}
    </div>
  );
};

export default SnakeBackground;