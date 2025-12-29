
import React, { useState } from 'react';
import { User, ExamResult, SubjectResult, SubjectDefinition } from '../types';

interface NetEntryFormProps {
  user: User;
  onClose: () => void;
  onSave: (result: ExamResult) => void;
}

const NetEntryForm: React.FC<NetEntryFormProps> = ({ user, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [subjectResults, setSubjectResults] = useState<Record<string, SubjectResult>>(
    user.subjects.reduce((acc, sub) => ({ 
      ...acc, 
      [sub.id]: sub.evaluationType === 'test' ? { correct: 0, wrong: 0 } : { score: 0 } 
    }), {})
  );

  const handleTestChange = (id: string, field: 'correct' | 'wrong', val: string) => {
    setSubjectResults(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: parseInt(val) || 0 }
    }));
  };

  const handleScoreChange = (id: string, val: string) => {
    const v = Math.min(100, Math.max(0, parseInt(val) || 0));
    setSubjectResults(prev => ({
      ...prev,
      [id]: { score: v }
    }));
  };

  const calculateTotalNet = () => {
    const testSubs = user.subjects.filter(s => s.evaluationType === 'test');
    if (testSubs.length === 0) return undefined;
    return testSubs.reduce((acc, sub) => {
      const res = subjectResults[sub.id];
      return acc + ((res.correct || 0) - ((res.wrong || 0) * 0.25));
    }, 0);
  };

  const calculateAvgScore = () => {
    const scoreSubs = user.subjects.filter(s => s.evaluationType === 'score');
    if (scoreSubs.length === 0) return undefined;
    const total = scoreSubs.reduce((acc, sub) => acc + (subjectResults[sub.id].score || 0), 0);
    return total / scoreSubs.length;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return alert("Sınav başlığı giriniz.");
    
    onSave({
      id: Date.now().toString(),
      studentId: user.id,
      date,
      title,
      subjectResults,
      totalNet: calculateTotalNet(),
      averageScore: calculateAvgScore()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white dark:bg-navy-800 rounded-[3rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border border-slate-200 dark:border-slate-800">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">Hibrit Veri Girişi</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Test ve Not Girişi v4.0</p>
            </div>
            <button type="button" onClick={onClose} className="text-3xl text-slate-300 hover:text-slate-600 transition-colors">×</button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sınav / Yayın Adı</label>
                <input 
                  type="text" placeholder="Örn: Limit TYT-2 veya 1. Vize" 
                  className="w-full p-4 bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none dark:text-white"
                  value={title} onChange={e => setTitle(e.target.value)} required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tarih</label>
                <input 
                  type="date" 
                  className="w-full p-4 bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none dark:text-white"
                  value={date} onChange={e => setDate(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-12 px-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <div className="col-span-6">DERS</div>
                <div className="col-span-6 text-center">SONUÇ (D/Y veya PUAN)</div>
              </div>
              {user.subjects.map(sub => (
                <div key={sub.id} className="grid grid-cols-12 items-center gap-4 bg-slate-50 dark:bg-navy-900/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div className="col-span-6 flex items-center space-x-3">
                    <div className="w-2 h-6 rounded-full" style={{backgroundColor: sub.color}}></div>
                    <span className="font-bold text-sm text-slate-700 dark:text-slate-200 truncate">{sub.name}</span>
                  </div>
                  <div className="col-span-6 flex gap-2">
                    {sub.evaluationType === 'test' ? (
                      <>
                        <input 
                          type="number" placeholder="D" 
                          className="w-full p-2 bg-white dark:bg-navy-800 rounded-xl text-center font-bold dark:text-white text-sm"
                          value={subjectResults[sub.id].correct || ''}
                          onChange={e => handleTestChange(sub.id, 'correct', e.target.value)}
                        />
                        <input 
                          type="number" placeholder="Y" 
                          className="w-full p-2 bg-white dark:bg-navy-800 rounded-xl text-center font-bold dark:text-white text-sm"
                          value={subjectResults[sub.id].wrong || ''}
                          onChange={e => handleTestChange(sub.id, 'wrong', e.target.value)}
                        />
                      </>
                    ) : (
                      <input 
                        type="number" placeholder="0-100" 
                        className="w-full p-2 bg-white dark:bg-navy-800 rounded-xl text-center font-bold dark:text-white text-sm"
                        value={subjectResults[sub.id].score || ''}
                        onChange={e => handleScoreChange(sub.id, e.target.value)}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 bg-slate-900 border-t border-slate-800 flex justify-between items-center rounded-b-[3rem]">
            <div className="text-white">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tahmini Özet</p>
              <div className="flex gap-4 items-baseline">
                {calculateTotalNet() !== undefined && <div><span className="text-2xl font-black text-orange-500">{calculateTotalNet()?.toFixed(2)}</span> <span className="text-[10px] font-bold">NET</span></div>}
                {calculateAvgScore() !== undefined && <div><span className="text-2xl font-black text-blue-500">{calculateAvgScore()?.toFixed(1)}</span> <span className="text-[10px] font-bold">PUAN</span></div>}
              </div>
            </div>
            <button className="bg-orange-500 hover:bg-orange-600 text-white font-black px-8 py-4 rounded-2xl shadow-xl transition-all active:scale-95">KAYDET</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NetEntryForm;
