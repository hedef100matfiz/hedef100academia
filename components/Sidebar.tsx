
import React from 'react';
import { User, UserRole } from '../types';

interface SidebarProps {
  user: User;
  collapsed: boolean;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, collapsed, activeTab, onTabChange, onToggle }) => {
  const commonMenu = [
    { id: 'dashboard', label: 'Ana Sayfa', icon: '🏠' },
    { id: 'game', label: 'Zihin Mola', icon: '🎮' }
  ];

  const studentMenu = [
    { id: 'stats', label: 'Analiz', icon: '📈' },
    { id: 'market', label: 'Koç Bul', icon: '🤝' },
  ];

  const teacherMenu = [
    { id: 'teacher_panel', label: 'Eğitmen Paneli', icon: '👨‍🏫' },
  ];

  const adminMenu = [
    { id: 'admin', label: 'Yönetim', icon: '🛡️' }
  ];

  let dynamicMenu = [];
  if (user.role === UserRole.STUDENT) dynamicMenu = [...commonMenu, ...studentMenu];
  else if (user.role === UserRole.TEACHER) dynamicMenu = [...commonMenu, ...teacherMenu];
  else if (user.role === UserRole.ADMIN) dynamicMenu = adminMenu;

  return (
    <aside className={`relative h-full bg-white dark:bg-navy-800 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 flex flex-col ${collapsed ? 'w-20' : 'w-64'}`}>
      <div className="h-20 flex items-center justify-between px-6">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-brand/20">A</div>
            <span className="font-black text-slate-800 dark:text-white tracking-tighter text-xl">ACADEMIA</span>
          </div>
        )}
        <button onClick={onToggle} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors text-slate-400">
          {collapsed ? '➡️' : '⬅️'}
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto custom-scrollbar">
        {dynamicMenu.map(item => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center p-3 rounded-2xl transition-all group ${
              activeTab === item.id 
                ? 'bg-brand text-white shadow-lg shadow-brand/20' 
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            {!collapsed && <span className="ml-4 font-bold text-sm tracking-wide">{item.label}</span>}
          </button>
        ))}
        {user.role !== UserRole.ADMIN && (
          <button
            onClick={() => onTabChange('settings')}
            className={`w-full flex items-center p-3 rounded-2xl transition-all ${
              activeTab === 'settings' ? 'bg-brand text-white' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <span className="text-xl">⚙️</span>
            {!collapsed && <span className="ml-4 font-bold text-sm">Ayarlar</span>}
          </button>
        )}
      </nav>

      <div className="p-4">
        {!collapsed && (
          <div className="bg-slate-50 dark:bg-navy-900/50 p-4 rounded-3xl border border-slate-100 dark:border-slate-800">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-brand/20 text-brand flex items-center justify-center font-bold text-xs uppercase">{user.username.slice(0,2)}</div>
              <div className="min-w-0">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">{user.name}</p>
                <p className="text-[9px] text-slate-500 uppercase font-bold">{user.role}</p>
              </div>
            </div>
            <p className="text-[9px] text-slate-400 leading-none italic">Academia v7.0 "The Core"</p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
