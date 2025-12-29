
import React, { useMemo } from 'react';
import { User, ExamResult } from '../types';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

interface StatisticsProps {
  user: User;
  results: ExamResult[];
}

const Statistics: React.FC<StatisticsProps> = ({ user, results }) => {
  const radarData = useMemo(() => {
    return user.subjects.map(sub => {
      const subjectResults = results.map(r => r.subjectResults[sub.id]).filter(Boolean);
      const avgCorrect = subjectResults.length > 0 
        ? subjectResults.reduce((acc, curr) => acc + curr.correct, 0) / subjectResults.length 
        : 0;
      return {
        subject: sub.name,
        value: Math.round(avgCorrect * 10) / 10,
        fullMark: 40 // Assuming max 40 per subject for scaling
      };
    });
  }, [user, results]);

  const barData = useMemo(() => {
    return user.subjects.map(sub => {
      const subjectResults = results.map(r => r.subjectResults[sub.id]).filter(Boolean);
      const totalWrong = subjectResults.reduce((acc, curr) => acc + curr.wrong, 0);
      return {
        name: sub.name,
        wrong: totalWrong,
        color: sub.color
      };
    });
  }, [user, results]);

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Radar Chart: Balance */}
        <div className="bg-white dark:bg-navy-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">Başarı Dengesi (Radar)</h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mb-8 uppercase tracking-widest font-bold">Derslerin Birbirine Göre Oranı</p>
          <div className="h-80 w-full">
            {results.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#e2e8f0" opacity={0.3} />
                  <PolarAngleAxis dataKey="subject" tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 'bold'}} />
                  <PolarRadiusAxis hide />
                  <Radar
                    name="Başarı"
                    dataKey="value"
                    stroke="#f97316"
                    fill="#f97316"
                    fillOpacity={0.3}
                  />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 italic">Veri yetersiz...</div>
            )}
          </div>
        </div>

        {/* Bar Chart: Wrong Distribution */}
        <div className="bg-white dark:bg-navy-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">Toplam Yanlış Dağılımı</h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mb-8 uppercase tracking-widest font-bold">Hangi Derste Daha Çok Kayıp Var?</p>
          <div className="h-80 w-full">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} layout="vertical">
                   <XAxis type="number" hide />
                   <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#64748b', fontWeight: 'bold'}} width={100} />
                   <Tooltip cursor={{fill: 'transparent'}} />
                   <Bar dataKey="wrong" radius={[0, 10, 10, 0]} barSize={20}>
                      {barData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                   </Bar>
                </BarChart>
             </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
