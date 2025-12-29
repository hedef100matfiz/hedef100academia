
import React, { useState, useEffect } from 'react';

const PuzzleGame: React.FC = () => {
  const size = 3;
  const initialTiles = [...Array(size * size).keys()]; // [0, 1, 2, ..., 8] where 0 is empty
  const [tiles, setTiles] = useState<number[]>([]);
  const [isWon, setIsWon] = useState(false);
  const [moves, setMoves] = useState(0);

  // Solvable Shuffle
  const shuffle = () => {
    let current = [...initialTiles].slice(1).concat(0); // 1-8 then 0
    let shuffleMoves = 0;
    while(shuffleMoves < 100) {
      const emptyIdx = current.indexOf(0);
      const neighbors = getNeighbors(emptyIdx);
      const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
      [current[emptyIdx], current[randomNeighbor]] = [current[randomNeighbor], current[emptyIdx]];
      shuffleMoves++;
    }
    setTiles(current);
    setIsWon(false);
    setMoves(0);
  };

  const getNeighbors = (idx: number) => {
    const row = Math.floor(idx / size);
    const col = idx % size;
    const neighbors = [];
    if (row > 0) neighbors.push(idx - size);
    if (row < size - 1) neighbors.push(idx + size);
    if (col > 0) neighbors.push(idx - 1);
    if (col < size - 1) neighbors.push(idx + 1);
    return neighbors;
  };

  useEffect(() => {
    shuffle();
  }, []);

  const moveTile = (idx: number) => {
    if (isWon) return;
    const emptyIdx = tiles.indexOf(0);
    const neighbors = getNeighbors(emptyIdx);
    if (neighbors.includes(idx)) {
      const newTiles = [...tiles];
      [newTiles[emptyIdx], newTiles[idx]] = [newTiles[idx], newTiles[emptyIdx]];
      setTiles(newTiles);
      setMoves(m => m + 1);
      
      // Check Win
      const winState = [...initialTiles].slice(1).concat(0);
      if (newTiles.every((val, i) => val === winState[i])) {
        setIsWon(true);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-500">
      <div className="text-center">
        <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tighter">Zihin Tazeleme Alanı</h2>
        <p className="text-slate-500">Sayıları 1'den 8'e kadar sıraya dizerek zihnini aktif tut.</p>
      </div>

      <div className="bg-white dark:bg-navy-800 p-8 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 relative">
        <div className="grid grid-cols-3 gap-3 w-72 h-72">
          {tiles.map((tile, idx) => (
            <button
              key={idx}
              onClick={() => moveTile(idx)}
              className={`text-2xl font-black rounded-2xl transition-all transform active:scale-95 ${
                tile === 0 
                ? 'bg-slate-100 dark:bg-navy-900 cursor-default' 
                : 'bg-gradient-to-br from-brand to-orange-500 text-white shadow-lg'
              }`}
            >
              {tile !== 0 ? tile : ''}
            </button>
          ))}
        </div>

        {isWon && (
          <div className="absolute inset-0 bg-white/90 dark:bg-navy-800/90 backdrop-blur-sm rounded-[3rem] flex flex-col items-center justify-center p-8 text-center">
            <span className="text-6xl mb-4 animate-bounce">🎊</span>
            <h3 className="text-3xl font-black text-brand mb-2">Tebrikler!</h3>
            <p className="text-slate-600 dark:text-slate-300 font-bold mb-6">{moves} hamlede başardın. Zihnin artık taptaze!</p>
            <button 
              onClick={shuffle}
              className="bg-brand text-white px-8 py-3 rounded-2xl font-black hover:bg-orange-600 transition-all shadow-xl"
            >
              YENİ OYUN
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-8">
        <div className="text-center">
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Hamle Sayısı</p>
          <p className="text-3xl font-black text-slate-800 dark:text-white">{moves}</p>
        </div>
        <button 
          onClick={shuffle}
          className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all"
        >
          Sıfırla 🔄
        </button>
      </div>

      <div className="max-w-md bg-orange-50 dark:bg-orange-950/20 p-6 rounded-3xl border border-orange-100 dark:border-orange-900/30">
        <p className="text-xs text-orange-600 dark:text-orange-400 font-medium leading-relaxed">
          <strong>İpucu:</strong> Bu tür bulmacalar kısa süreli hafızayı ve uzamsal zekayı tetikler. 25 dakikalık bir ders periyodundan sonra 5 dakikalık bir bulmaca molası, odaklanma kapasitenizi %20 artırır.
        </p>
      </div>
    </div>
  );
};

export default PuzzleGame;
