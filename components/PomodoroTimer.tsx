
import React, { useState, useEffect } from 'react';

const PomodoroTimer: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isWork, setIsWork] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      alert(isWork ? "Mola Zamanı! ☕" : "Çalışma Zamanı! 🔥");
      setIsWork(!isWork);
      setTimeLeft(isWork ? 5 * 60 : 25 * 60);
    }
    
    // TAB TITLE UPDATE
    if (isActive) {
      document.title = `(${formatTime(timeLeft)}) Odaklanıyor...`;
    } else {
      document.title = "Hedef100 Kariyer Yönetimi";
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, isWork]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-8 left-8 z-50">
      {isOpen ? (
        <div className="bg-white dark:bg-navy-800 p-6 rounded-[2rem] shadow-2xl border border-slate-100 dark:border-slate-800 w-64 animate-in slide-in-from-bottom-4 duration-300">
           <div className="flex items-center justify-between mb-4">
             <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">
               {isWork ? '🔥 Odaklanma' : '☕ Dinlenme'}
             </span>
             <button onClick={() => setIsOpen(false)} className="text-slate-300">×</button>
           </div>
           <div className="text-5xl font-black text-center mb-6 tracking-tighter text-slate-800 dark:text-white">
             {formatTime(timeLeft)}
           </div>
           <div className="flex space-x-2">
             <button 
              onClick={() => setIsActive(!isActive)}
              className={`flex-1 py-3 rounded-2xl font-bold transition-all ${isActive ? 'bg-slate-100 dark:bg-slate-700 text-slate-600' : 'bg-orange-500 text-white shadow-lg'}`}
             >
               {isActive ? 'Durdur' : 'Başlat'}
             </button>
             <button 
              onClick={() => { setIsActive(false); setTimeLeft(25 * 60); }}
              className="px-4 bg-slate-50 dark:bg-navy-900 rounded-2xl"
             >
               🔄
             </button>
           </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl shadow-2xl transition-all hover:scale-110 active:scale-95 border-4 ${isActive ? 'bg-orange-500 border-orange-200' : 'bg-slate-900 border-slate-700'}`}
        >
          {isActive ? '⏱️' : '⏳'}
        </button>
      )}
    </div>
  );
};

export default PomodoroTimer;
