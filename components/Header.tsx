
import React from 'react';
import { User, UserRole } from '../types';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  isDarkMode: boolean;
  onToggleDark: () => void;
  onToggleMenu: () => void;
  onShowFeedback: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, isDarkMode, onToggleDark, onToggleMenu, onShowFeedback }) => {
  return (
    <header className="bg-white/80 dark:bg-navy-800/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 h-20 sticky top-0 z-40 transition-colors">
      <div className="container mx-auto px-6 h-full flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={onToggleMenu} className="lg:hidden p-2 text-slate-600 dark:text-slate-300 text-2xl">☰</button>
          <div className="hidden lg:flex flex-col">
            <h1 className="font-black text-xl text-slate-900 dark:text-white leading-none">Hub Pro</h1>
            <p className="text-[10px] text-orange-500 font-bold uppercase tracking-widest">Akademik Kariyer v4</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 md:space-x-4">
          {user.role === UserRole.STUDENT && (
            <button 
              onClick={onShowFeedback}
              className="hidden md:flex bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all"
            >
              Geliştiriciye Not
            </button>
          )}

          <button 
            onClick={onToggleDark}
            className="p-3 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-all"
          >
            {isDarkMode ? '🌞' : '🌙'}
          </button>
          
          <div className="h-10 w-[1px] bg-slate-200 dark:bg-slate-700 mx-2"></div>

          <div className="flex items-center space-x-3">
             <div className="hidden sm:block text-right">
                <p className="text-sm font-black text-slate-800 dark:text-slate-100">{user.name}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{user.role}</p>
             </div>
             <button 
              onClick={onLogout}
              className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 w-10 h-10 rounded-xl flex items-center justify-center font-bold hover:scale-105 transition-all shadow-md"
             >
               🚪
             </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
