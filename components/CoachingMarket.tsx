
import React from 'react';
import { User, CoachingRequest } from '../types';

interface CoachingMarketProps {
  teachers: User[];
  requests: CoachingRequest[];
  onRequest: (teacherId: string) => void;
}

const CoachingMarket: React.FC<CoachingMarketProps> = ({ teachers, requests, onRequest }) => {
  const getRequestStatus = (teacherId: string) => {
    return requests.find(r => r.teacherId === teacherId);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white dark:bg-navy-800 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Uzman Koçunu Bul</h2>
        <p className="text-slate-500 max-w-xl">Hedefine en uygun branş öğretmeniyle çalışarak başarıyı şansa bırakma.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teachers.map(t => {
          const req = getRequestStatus(t.id);
          const branchColor = t.branch === 'Matematik' ? 'bg-orange-100 text-orange-600' : 
                            t.branch === 'Fizik' ? 'bg-blue-100 text-blue-600' : 
                            t.branch === 'Rehberlik' ? 'bg-purple-100 text-purple-600' : 
                            'bg-slate-100 text-slate-600';

          return (
            <div key={t.id} className="bg-white dark:bg-navy-800 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center text-center group hover:border-brand transition-all">
              <div className="w-24 h-24 bg-slate-50 dark:bg-navy-900 rounded-full flex items-center justify-center text-4xl mb-6 shadow-inner group-hover:scale-110 transition-transform">
                {t.branch === 'Rehberlik' ? '🧠' : t.branch === 'Matematik' ? '📐' : t.branch === 'Fizik' ? '⚛️' : '👨‍🏫'}
              </div>
              <h3 className="text-xl font-black text-slate-800 dark:text-white">{t.name}</h3>
              
              {/* Branch Badge */}
              <div className={`mt-2 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${branchColor}`}>
                {t.branch || 'Akademik Koç'}
              </div>
              
              <div className="flex space-x-2 my-6">
                <span className="bg-slate-50 dark:bg-navy-900 px-3 py-1 rounded-full text-[10px] font-bold text-slate-500">🔥 {t.streak} Seri</span>
                <span className="bg-slate-50 dark:bg-navy-900 px-3 py-1 rounded-full text-[10px] font-bold text-slate-500">🏆 Uzman</span>
              </div>

              {!req ? (
                <button 
                  onClick={() => onRequest(t.id)}
                  className="w-full bg-slate-900 dark:bg-white dark:text-navy-900 text-white py-4 rounded-2xl font-black shadow-xl hover:bg-brand hover:text-white transition-all"
                >
                  Koçluk Talep Et
                </button>
              ) : (
                <div className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest border-2 ${
                  req.status === 'pending' ? 'border-orange-100 text-orange-400 bg-orange-50/20' : 
                  req.status === 'accepted' ? 'border-green-100 text-green-500 bg-green-50/20' : 
                  'border-red-100 text-red-400 bg-red-50/20'
                }`}>
                  {req.status === 'pending' ? '⌛ Talep Beklemede' : 
                   req.status === 'accepted' ? '✅ Koçun' : '❌ Reddedildi'}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CoachingMarket;
