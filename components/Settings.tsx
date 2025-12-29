
import React, { useState } from 'react';
import { User, SubjectDefinition } from '../types';
import { COLORS } from '../constants';

interface SettingsProps {
  user: User;
  onUpdate: (user: User) => void;
  onReportAdmin: (subject: string, content: string) => void;
}

const Settings: React.FC<SettingsProps> = ({ user, onUpdate, onReportAdmin }) => {
  const [newSubName, setNewSubName] = useState('');
  const [reportSub, setReportSub] = useState('');
  const [reportCont, setReportCont] = useState('');
  
  const addSubject = () => {
    if (!newSubName) return;
    const newSub: SubjectDefinition = {
      id: Date.now().toString(),
      name: newSubName,
      color: Object.values(COLORS)[Math.floor(Math.random() * Object.values(COLORS).length)],
      evaluationType: user.examType === 'UNIVERSITE' || user.examType === 'GENEL' ? 'score' : 'test'
    };
    onUpdate({ ...user, subjects: [...user.subjects, newSub] });
    setNewSubName('');
  };

  const removeSubject = (id: string) => {
    onUpdate({ ...user, subjects: user.subjects.filter(s => s.id !== id) });
  };

  const handleReport = (e: React.FormEvent) => {
    e.preventDefault();
    if(!reportSub || !reportCont) return;
    onReportAdmin(reportSub, reportCont);
    setReportSub('');
    setReportCont('');
  };

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-navy-800 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm">
        <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-8">Eğitim Ayarları</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Targets & Subjects */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Hedef & Performans</h4>
              <div>
                <label className="text-sm font-bold text-slate-500 block mb-2">Hedef Toplam Net</label>
                <input 
                  type="number" value={user.targetNet} 
                  onChange={e => onUpdate({ ...user, targetNet: parseInt(e.target.value) || 0 })}
                  className="w-full p-4 bg-slate-50 dark:bg-navy-900 rounded-2xl border-none focus:ring-2 focus:ring-brand dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Ders Yönetimi</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {user.subjects.map(sub => (
                  <div key={sub.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-navy-900/50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full" style={{backgroundColor: sub.color}}></div>
                      <span className="text-sm font-bold dark:text-white">{sub.name}</span>
                    </div>
                    <button onClick={() => removeSubject(sub.id)} className="text-slate-300 hover:text-red-500 transition-colors">×</button>
                  </div>
                ))}
              </div>
              <div className="flex space-x-2">
                <input 
                  type="text" placeholder="Yeni Ders Ekle" 
                  className="flex-1 p-3 bg-slate-50 dark:bg-navy-900 rounded-xl text-sm border-none focus:ring-2 focus:ring-brand dark:text-white"
                  value={newSubName} onChange={e => setNewSubName(e.target.value)}
                />
                <button onClick={addSubject} className="bg-slate-900 text-white px-4 rounded-xl font-bold">+</button>
              </div>
            </div>
          </div>

          {/* Management Contact */}
          <div className="bg-slate-50 dark:bg-navy-900/40 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800">
             <h4 className="text-sm font-black text-slate-800 dark:text-white mb-6 flex items-center gap-2">
               <span>📬</span> Yönetime Bildir / Destek
             </h4>
             <form onSubmit={handleReport} className="space-y-4">
                <input 
                  type="text" placeholder="Konu (Örn: Hata Bildirimi)" 
                  className="w-full p-3 bg-white dark:bg-navy-800 rounded-xl border-none focus:ring-2 focus:ring-brand dark:text-white text-sm"
                  value={reportSub} onChange={e => setReportSub(e.target.value)}
                />
                <textarea 
                  placeholder="Detaylı açıklama..."
                  className="w-full h-32 p-3 bg-white dark:bg-navy-800 rounded-xl border-none focus:ring-2 focus:ring-brand dark:text-white text-sm resize-none"
                  value={reportCont} onChange={e => setReportCont(e.target.value)}
                />
                <button className="w-full bg-slate-900 dark:bg-brand text-white py-4 rounded-xl font-black shadow-lg shadow-brand/10 hover:scale-105 transition-all">
                  YÖNETİME GÖNDER
                </button>
             </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
