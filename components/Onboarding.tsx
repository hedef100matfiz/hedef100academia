
import React, { useState } from 'react';
import { ExamType, SubjectDefinition } from '../types';
import { DEFAULT_SUBJECTS } from '../constants';

interface OnboardingProps {
  onComplete: (name: string, examType: ExamType) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [examType, setExamType] = useState<ExamType | null>(null);

  const examOptions: { id: ExamType, label: string, icon: string }[] = [
    { id: 'YKS', label: 'YKS (TYT/AYT)', icon: '📐' },
    { id: 'LGS', label: 'LGS Hazırlık', icon: '🎒' },
    { id: 'KPSS', label: 'KPSS (Lisans/Ön)', icon: '🏛️' },
    { id: 'ALES', label: 'ALES / DGS', icon: '📚' },
    { id: 'GENEL', label: 'Üniversite / Genel', icon: '🎓' }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-navy-900">
      <div className="w-full max-w-2xl bg-white dark:bg-navy-800 rounded-[3rem] shadow-2xl p-12 border border-slate-100 dark:border-slate-800">
        
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center text-white text-2xl font-black mb-8">100</div>
             <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4 leading-tight">Geleceğini Yönetmeye <br/>Hazır Mısın?</h2>
             <p className="text-slate-500 mb-8">Önce sana nasıl hitap etmemizi istersin?</p>
             <input 
              type="text" placeholder="Adın Soyadın" 
              className="w-full p-5 bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-orange-100 outline-none dark:text-white mb-8"
              value={name} onChange={e => setName(e.target.value)}
             />
             <button 
              disabled={!name}
              onClick={() => setStep(2)}
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold hover:bg-slate-800 transition-all disabled:opacity-50"
             >
               DEVAM ET →
             </button>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
             <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Hedefin Ne?</h2>
             <p className="text-slate-500 mb-8">Sınav türüne göre derslerini hazırlayacağız.</p>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
               {examOptions.map(opt => (
                 <button
                  key={opt.id}
                  onClick={() => setExamType(opt.id)}
                  className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-start text-left ${examType === opt.id ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/10' : 'border-slate-50 dark:border-slate-800 bg-white dark:bg-navy-800 hover:border-orange-200'}`}
                 >
                   <span className="text-3xl mb-3">{opt.icon}</span>
                   <span className="font-black text-slate-800 dark:text-white">{opt.label}</span>
                 </button>
               ))}
             </div>
             <div className="flex space-x-4">
               <button onClick={() => setStep(1)} className="flex-1 py-5 border-2 border-slate-100 dark:border-slate-800 rounded-2xl font-bold dark:text-white">GERİ</button>
               <button 
                disabled={!examType}
                onClick={() => onComplete(name, examType!)}
                className="flex-[2] bg-orange-500 text-white py-5 rounded-2xl font-black shadow-xl shadow-orange-100 dark:shadow-none"
               >
                 KURULUMU TAMAMLA 🚀
               </button>
             </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Onboarding;
