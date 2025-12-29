
import React, { useState, useMemo, useEffect } from 'react';
import { User, ExamResult, WeeklySchedule, ErrorBreakdown } from '../types';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import NetEntryForm from './NetEntryForm';
import { SUBJECT_LABELS, DAYS_LABELS, COLORS, MOTIVATION_QUOTES, ERROR_LABELS } from '../constants';

interface StudentDashboardProps {
  student: User;
  results: ExamResult[];
  schedule?: WeeklySchedule;
  onAddResult: (res: ExamResult) => void;
  onUpdateTarget: (target: number) => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ 
  student, results, schedule, onAddResult, onUpdateTarget 
}) => {
  const [showForm, setShowForm] = useState(false);
  const [targetInput, setTargetInput] = useState(student.targetNet.toString());
  const [quote, setQuote] = useState("");

  useEffect(() => {
    setQuote(MOTIVATION_QUOTES[Math.floor(Math.random() * MOTIVATION_QUOTES.length)]);
  }, []);

  const stats = useMemo(() => {
    if (results.length === 0) return { avg: 0, total: 0, last: 0 };
    // Fixed: Handle optional totalNet property during reduction
    const sum = results.reduce((acc, curr) => acc + (curr.totalNet || 0), 0);
    return {
      avg: parseFloat((sum / results.length).toFixed(2)),
      total: results.length,
      // Fixed: Safe access for the most recent result's totalNet
      last: results[0].totalNet || 0
    };
  }, [results]);

  const errorData = useMemo(() => {
    const total: ErrorBreakdown = { knowledge: 0, attention: 0, calculation: 0, time: 0, other: 0 };
    results.forEach(r => {
      if (r.errorBreakdown) {
        Object.keys(total).forEach(key => {
          total[key as keyof ErrorBreakdown] += r.errorBreakdown?.[key as keyof ErrorBreakdown] || 0;
        });
      }
    });
    return Object.entries(total)
      .filter(([_, value]) => (value as number) > 0)
      .map(([key, value]) => ({
        name: ERROR_LABELS[key],
        value: value as number
      }));
  }, [results]);

  const chartData = useMemo(() => {
    return [...results].reverse().map(r => ({
      name: r.title,
      net: r.totalNet,
    }));
  }, [results]);

  // Fix: Replaced COLORS.danger with COLORS.red
  const PIE_COLORS = [COLORS.purple, COLORS.orange, COLORS.blue, COLORS.red, COLORS.slate];

  const handleTargetUpdate = () => {
    const val = parseFloat(targetInput);
    if (!isNaN(val)) onUpdateTarget(val);
  };

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Motivation & Action Row */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 bg-gradient-to-r from-orange-500 to-orange-600 p-8 rounded-3xl text-white shadow-xl shadow-orange-200 dark:shadow-none relative overflow-hidden">
          <div className="relative z-10">
             <h2 className="text-3xl md:text-4xl font-black mb-4">Mükemmellik Bir Alışkanlıktır.</h2>
             <p className="text-orange-100 text-lg italic max-w-2xl">"{quote}"</p>
             <button 
                onClick={() => setShowForm(true)}
                className="mt-6 bg-white text-orange-600 px-6 py-3 rounded-2xl font-black hover:bg-orange-50 transition-all flex items-center space-x-2"
              >
                <span>➕ Yeni Deneme Girişi</span>
              </button>
          </div>
          <div className="absolute top-[-20px] right-[-20px] text-[150px] opacity-10 pointer-events-none">📐</div>
        </div>

        <div className="bg-white dark:bg-navy-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center text-center shadow-sm">
           <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center text-3xl mb-4 animate-bounce">
             🔥
           </div>
           <p className="text-slate-400 dark:text-slate-500 font-bold uppercase text-xs tracking-widest mb-1">Zinciri Kırma</p>
           <h3 className="text-4xl font-black text-slate-900 dark:text-white">{student.streak} GÜN</h3>
           <p className="text-xs text-slate-400 mt-2 italic">Her gün veri girerek alevi canlı tut!</p>
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Toplam Deneme', value: stats.total, color: 'text-slate-900' },
          { label: 'Ortalama Net', value: stats.avg, color: 'text-orange-500' },
          { label: 'Son Net', value: stats.last, color: 'text-blue-500' },
          { label: 'Hedef Net', value: targetInput, isInput: true },
        ].map((item, idx) => (
          <div key={idx} className="bg-white dark:bg-navy-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm transition-all hover:translate-y-[-4px]">
            <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">{item.label}</p>
            {item.isInput ? (
              <div className="flex items-baseline space-x-1">
                <input 
                  type="number" 
                  value={targetInput}
                  onChange={(e) => setTargetInput(e.target.value)}
                  onBlur={handleTargetUpdate}
                  className="text-2xl font-black bg-transparent border-none p-0 w-16 focus:ring-0 text-slate-900 dark:text-white"
                />
                <span className="text-xs text-slate-400">/ 100</span>
              </div>
            ) : (
              <p className={`text-2xl font-black ${item.color} dark:text-white`}>{item.value}</p>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Development Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-navy-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-8">
             <h3 className="text-xl font-black text-slate-900 dark:text-white">Net Gelişim Analizi</h3>
             <div className="flex space-x-2">
                <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Toplam Net</span>
             </div>
          </div>
          <div className="h-72 w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.orange} stopOpacity={0.2}/>
                      <stop offset="95%" stopColor={COLORS.orange} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.3} />
                  <XAxis dataKey="name" hide />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', backgroundColor: '#fff'}}
                    itemStyle={{color: COLORS.orange, fontWeight: 'bold'}}
                  />
                  <Area type="monotone" dataKey="net" stroke={COLORS.orange} strokeWidth={4} fill="url(#colorNet)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 italic font-medium">Veri bekleniyor...</div>
            )}
          </div>
        </div>

        {/* Error Breakdown Pie Chart */}
        <div className="bg-white dark:bg-navy-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
          <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6 text-center">Neden Yanlış Yapıyorum?</h3>
          <div className="h-56 w-full mb-4">
            {errorData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={errorData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {errorData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm text-center px-4 italic">
                Hata analizi için deneme sonucu girerken "Hata Sebebi" belirtmeyi unutma!
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
             {errorData.map((entry, idx) => (
               <div key={idx} className="flex items-center space-x-1">
                 <div className="w-2 h-2 rounded-full" style={{backgroundColor: PIE_COLORS[idx % PIE_COLORS.length]}}></div>
                 <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{entry.name}</span>
               </div>
             ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid: Schedule & Target Circle */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Target Progress */}
         <div className="bg-white dark:bg-navy-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm text-center">
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6 uppercase tracking-widest text-xs">Hedef Tamamlama</h3>
            <div className="relative w-48 h-48 mx-auto">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100 dark:text-slate-800" />
                <circle
                  cx="96" cy="96" r="80" stroke={COLORS.orange} strokeWidth="12" fill="transparent"
                  strokeDasharray={502.4}
                  strokeDashoffset={502.4 - (502.4 * (Math.min(stats.avg, student.targetNet) / student.targetNet)) || 502.4}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-slate-900 dark:text-white">%{Math.round((stats.avg / student.targetNet) * 100) || 0}</span>
              </div>
            </div>
         </div>

         {/* Schedule */}
         <div className="lg:col-span-2 bg-slate-900 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
            <h3 className="text-xl font-black mb-6 flex items-center space-x-3">
               <span className="text-2xl">📅</span>
               <span>Haftalık Çalışma Yol Haritası</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {schedule ? Object.entries(schedule.days).map(([day, task]) => (
                  <div key={day} className="flex items-start space-x-4 bg-white/5 p-4 rounded-2xl hover:bg-white/10 transition-colors">
                     <div className="shrink-0 w-10 text-[10px] font-black uppercase text-orange-400 pt-1 leading-none">{DAYS_LABELS[day].slice(0, 3)}</div>
                     <div className="text-sm font-medium text-slate-200">{task || 'Tatil / Odaklanma Günü'}</div>
                  </div>
               )) : (
                 <div className="col-span-2 h-40 flex items-center justify-center text-slate-500 italic text-center">
                    Henüz eğitmenin tarafından bir program atanmadı.<br/>Eksiklerini belirle ve eyleme geç!
                 </div>
               )}
            </div>
            <div className="absolute bottom-[-20px] left-[-20px] text-8xl opacity-5 pointer-events-none rotate-12">📝</div>
         </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-navy-800 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-700">
            <NetEntryForm 
              user={student} 
              onClose={() => setShowForm(false)} 
              onSave={(res) => {
                onAddResult(res);
                setShowForm(false);
              }} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;