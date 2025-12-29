
import React, { useState } from 'react';
import { User, CoachingRequest, WeeklySchedule, ExamResult } from '../types';
import { DAYS_LABELS } from '../constants';

interface TeacherPanelProps {
  teacher: User;
  requests: CoachingRequest[];
  students: User[];
  results: ExamResult[];
  onUpdateStatus: (id: string, status: 'accepted' | 'rejected') => void;
  onUpdateSchedule: (sched: WeeklySchedule) => void;
  // Fix: Added missing onReportAdmin to satisfy type requirements in App.tsx
  onReportAdmin: (subj: string, cont: string) => void;
}

const TeacherCoachingPanel: React.FC<TeacherPanelProps> = ({ teacher, requests, students, results, onUpdateStatus, onUpdateSchedule, onReportAdmin }) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [localTasks, setLocalTasks] = useState<Record<string, string>>({
    monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '', sunday: ''
  });

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const selectedStudent = students.find(s => s.id === selectedStudentId);

  const handleSelect = (id: string) => {
    setSelectedStudentId(id);
    // You could fetch existing schedule here if available
    setLocalTasks({ monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '', sunday: '' });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Requests Section */}
      {pendingRequests.length > 0 && (
        <div className="bg-orange-50 dark:bg-orange-950/20 p-8 rounded-[2.5rem] border-2 border-orange-100 dark:border-orange-900/30">
          <h3 className="text-xl font-black text-orange-600 mb-6 flex items-center gap-2">
            <span>👋</span> Yeni Koçluk Talepleri
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingRequests.map(r => (
              <div key={r.id} className="bg-white dark:bg-navy-800 p-6 rounded-3xl shadow-sm flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-800 dark:text-white">{r.studentName}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{r.date.slice(0, 10)}</p>
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => onUpdateStatus(r.id, 'accepted')} className="p-3 bg-green-500 text-white rounded-xl hover:scale-105 transition-all">✓</button>
                  <button onClick={() => onUpdateStatus(r.id, 'rejected')} className="p-3 bg-red-100 text-red-500 rounded-xl hover:scale-105 transition-all">✕</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Student Selection */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-lg font-black text-slate-800 dark:text-white mb-4 px-2">Öğrencilerim ({students.length})</h3>
          <div className="space-y-2">
            {students.map(s => (
              <button
                key={s.id}
                onClick={() => handleSelect(s.id)}
                className={`w-full p-5 rounded-[1.5rem] text-left transition-all border-2 ${
                  selectedStudentId === s.id 
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xl' 
                  : 'bg-white dark:bg-navy-800 border-slate-100 dark:border-slate-800 text-slate-600'
                }`}
              >
                <p className="font-black">{s.name}</p>
                <p className={`text-[10px] font-bold uppercase tracking-widest ${selectedStudentId === s.id ? 'text-slate-400' : 'text-slate-400'}`}>
                  {s.examType} Kampı
                </p>
              </button>
            ))}
            {students.length === 0 && <p className="text-center py-12 text-slate-400 italic text-sm">Henüz onaylı öğrencin yok.</p>}
          </div>
        </div>

        {/* Supervision Area */}
        <div className="lg:col-span-3">
          {selectedStudent ? (
            <div className="space-y-6 animate-in slide-in-from-right duration-500">
               <div className="bg-white dark:bg-navy-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white">{selectedStudent.name} - Süpervizyon</h2>
                    <p className="text-slate-500">Öğrencinin performansını incele ve haftalık yol haritası ata.</p>
                  </div>
                  <button 
                    onClick={() => {
                      onUpdateSchedule({ studentId: selectedStudent.id, teacherId: teacher.id, days: localTasks });
                      alert("Yol haritası öğrenciye iletildi!");
                    }}
                    className="bg-orange-500 text-white px-8 py-4 rounded-2xl font-black shadow-lg hover:bg-orange-600 transition-all"
                  >
                    Programı Güncelle
                  </button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Weekly Editor */}
                 <div className="bg-white dark:bg-navy-800 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
                    <h3 className="text-lg font-black mb-6 dark:text-white">📅 Haftalık Yol Haritası</h3>
                    <div className="space-y-4">
                      {Object.keys(DAYS_LABELS).map(day => (
                        <div key={day} className="flex items-center space-x-3">
                           <span className="w-20 text-[10px] font-black uppercase text-slate-400 tracking-widest">{DAYS_LABELS[day]}</span>
                           <input 
                            type="text"
                            placeholder="Örn: 50 Fizik Sorusu + Deneme"
                            className="flex-1 p-3 bg-slate-50 dark:bg-navy-900 rounded-xl border-none focus:ring-2 focus:ring-orange-500 text-sm dark:text-white"
                            value={localTasks[day]}
                            onChange={e => setLocalTasks(p => ({ ...p, [day]: e.target.value }))}
                           />
                        </div>
                      ))}
                    </div>
                 </div>

                 {/* Performance Snippet */}
                 <div className="bg-white dark:bg-navy-800 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
                    <h3 className="text-lg font-black mb-6 dark:text-white">📊 Son Performans</h3>
                    <div className="space-y-3">
                       {results.filter(r => r.studentId === selectedStudent.id).slice(0, 5).map(r => (
                         <div key={r.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-navy-900/40 rounded-2xl">
                            <div>
                               <p className="font-bold text-sm text-slate-800 dark:text-white">{r.title}</p>
                               <p className="text-[10px] text-slate-400">{r.date.slice(0, 10)}</p>
                            </div>
                            <span className="text-xl font-black text-orange-500">{r.totalNet || r.averageScore}</span>
                         </div>
                       ))}
                       {results.filter(r => r.studentId === selectedStudent.id).length === 0 && (
                         <p className="text-center py-12 text-slate-400 italic">Veri girişi yapılmamış.</p>
                       )}
                    </div>
                 </div>
               </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center bg-white dark:bg-navy-800 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-700 p-12 text-slate-400">
               <span className="text-6xl mb-4">🎯</span>
               <p className="text-xl font-bold">Öğrenci Yönetim Paneli</p>
               <p className="text-sm">İşlem yapmak için soldan bir öğrenci seçin.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherCoachingPanel;
