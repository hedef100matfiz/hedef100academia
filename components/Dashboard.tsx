
import React, { useState, useMemo } from 'react';
import { User, ExamResult, WeeklySchedule } from '../types';
import NetEntryForm from './NetEntryForm';
import { DAYS_LABELS } from '../constants';

interface DashboardProps {
  user: User;
  results: ExamResult[];
  assignedTeacher?: User;
  schedule?: WeeklySchedule;
  onAddResult: (res: ExamResult) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, results, assignedTeacher, schedule, onAddResult }) => {
  const [showForm, setShowForm] = useState(false);

  const stats = useMemo(() => {
    const testResults = results.filter(r => r.totalNet !== undefined);
    return {
      avgNet: testResults.length > 0 ? (testResults.reduce((a, b) => a + (b.totalNet || 0), 0) / testResults.length).toFixed(2) : '0',
      totalExams: results.length,
      lastNet: testResults[0]?.totalNet || 0
    };
  }, [results]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* SaaS Greeting Card */}
      <div className="bg-gradient-to-br from-navy-900 to-navy-800 dark:from-navy-900 dark:to-navy-950 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter">Hoş Geldin, {user.name.split(' ')[0]} 👋</h1>
            <p className="text-navy-300 text-lg font-medium opacity-80">Profil: <span className="text-orange-400 font-bold">{user.examType}</span></p>
            <div className="mt-8 flex flex-wrap gap-4 justify-center md:justify-start">
              <button 
                onClick={() => setShowForm(true)}
                className="bg-orange-500 hover:bg-orange-600 px-8 py-4 rounded-2xl font-black transition-all transform active:scale-95 shadow-xl shadow-orange-500/20"
              >
                📝 Yeni Sonuç Gir
              </button>
              {assignedTeacher && (
                <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl flex items-center space-x-3 border border-white/10">
                  <span className="text-xl">🎓</span>
                  <div>
                    <p className="text-[10px] font-black uppercase opacity-50">Akademik Koç</p>
                    <p className="text-sm font-bold">{assignedTeacher.name}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 text-center min-w-[200px]">
             <p className="text-orange-400 text-xs font-black uppercase tracking-widest mb-1">Çalışma Serisi</p>
             <p className="text-5xl font-black">🔥 {user.streak}</p>
             <p className="text-[10px] text-white/50 mt-2 uppercase">GÜNDÜR AKTİFSİN</p>
          </div>
        </div>
        <div className="absolute top-[-20px] left-[-20px] text-[200px] opacity-5 pointer-events-none rotate-12">📚</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Map */}
        <div className="lg:col-span-2 bg-white dark:bg-navy-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
          <h3 className="text-xl font-black text-slate-800 dark:text-white mb-6 flex items-center gap-2">
            <span>📅</span> Haftalık Yol Haritası
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {schedule ? Object.entries(schedule.days).map(([day, task]) => (
              <div key={day} className="flex items-start space-x-4 bg-slate-50 dark:bg-navy-900/40 p-5 rounded-[1.5rem] group hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-all border border-transparent hover:border-orange-100">
                <span className="w-12 text-[10px] font-black uppercase text-orange-500 tracking-tighter pt-1">{DAYS_LABELS[day].slice(0, 3)}</span>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed">{task || 'Dinlenme & Analiz'}</p>
              </div>
            )) : (
              <div className="col-span-2 text-center py-20 bg-slate-50 dark:bg-navy-900/30 rounded-[2rem] border-2 border-dashed border-slate-200">
                 <p className="text-slate-400 italic text-sm">Koçun henüz haftalık programını hazırlamadı.<br/>Eksiklerini belirle ve koçunla iletişime geç!</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-navy-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
             <h3 className="text-xl font-black mb-6 dark:text-white">Hızlı Analiz</h3>
             <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-navy-900/50 rounded-2xl">
                   <p className="text-xs font-bold text-slate-400 uppercase">Ortalama Net</p>
                   <p className="text-2xl font-black text-orange-500">{stats.avgNet}</p>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-navy-900/50 rounded-2xl">
                   <p className="text-xs font-bold text-slate-400 uppercase">Son Deneme</p>
                   <p className="text-2xl font-black text-blue-500">{stats.lastNet}</p>
                </div>
             </div>
          </div>

          <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
             <h3 className="text-xl font-black mb-2 relative z-10">Hedef Odaklılık</h3>
             <p className="text-xs text-slate-400 mb-6 relative z-10">Net hedefine ulaşmana {user.targetNet - parseFloat(stats.avgNet)} puan kaldı!</p>
             <div className="relative h-2 bg-white/10 rounded-full overflow-hidden mb-2 z-10">
                <div className="absolute left-0 h-full bg-orange-500 transition-all duration-1000" style={{width: `${(parseFloat(stats.avgNet) / user.targetNet) * 100}%`}}></div>
             </div>
             <p className="text-right text-[10px] font-black text-orange-500 relative z-10">%{Math.round((parseFloat(stats.avgNet) / user.targetNet) * 100)} TAMAMLANDI</p>
             <div className="absolute right-[-20px] bottom-[-20px] text-8xl opacity-10 rotate-12 group-hover:scale-125 transition-transform">🎯</div>
          </div>
        </div>
      </div>

      {showForm && (
        <NetEntryForm user={user} onClose={() => setShowForm(false)} onSave={onAddResult} />
      )}
    </div>
  );
};

export default Dashboard;
