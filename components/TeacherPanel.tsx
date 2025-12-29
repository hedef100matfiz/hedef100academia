
import React, { useState } from 'react';
import { User, ExamResult, WeeklySchedule } from '../types';
import { DAYS_LABELS } from '../constants';

interface TeacherPanelProps {
  // Fix: Added teacherId to correctly satisfy WeeklySchedule requirements
  teacherId: string;
  students: User[];
  results: ExamResult[];
  schedules: WeeklySchedule[];
  onUpdateSchedule: (schedule: WeeklySchedule) => void;
}

const TeacherPanel: React.FC<TeacherPanelProps> = ({ 
  teacherId,
  students, 
  results, 
  schedules, 
  onUpdateSchedule 
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  
  const selectedStudent = students.find(s => s.id === selectedStudentId);
  const studentResults = results.filter(r => r.studentId === selectedStudentId);
  // @ts-ignore
  const currentSchedule = schedules.find(s => s.studentId === selectedStudentId);

  const [localTasks, setLocalTasks] = useState<Record<string, string>>({
    monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '', sunday: ''
  });

  const handleSelectStudent = (id: string) => {
    setSelectedStudentId(id);
    const existing = schedules.find(s => s.studentId === id);
    if (existing) {
      setLocalTasks(existing.days);
    } else {
      setLocalTasks({
        monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '', sunday: ''
      });
    }
  };

  const saveSchedule = () => {
    if (!selectedStudentId) return;
    // Fix: Pass missing teacherId to onUpdateSchedule
    onUpdateSchedule({
      studentId: selectedStudentId,
      teacherId: teacherId,
      days: localTasks as any
    });
    alert('Program başarıyla güncellendi!');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sidebar: Student List */}
      <div className="lg:col-span-1 space-y-4">
        <h3 className="text-xl font-bold text-slate-900 mb-6">Öğrenci Listesi</h3>
        <div className="space-y-2">
          {students.map(s => (
            <button
              key={s.id}
              onClick={() => handleSelectStudent(s.id)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                selectedStudentId === s.id 
                  ? 'bg-slate-900 border-slate-900 text-white shadow-lg' 
                  : 'bg-white border-slate-100 hover:border-orange-500'
              }`}
            >
              <p className="font-bold">{s.name}</p>
              <p className={`text-xs ${selectedStudentId === s.id ? 'text-slate-400' : 'text-slate-400'}`}>
                Hedef: {s.targetNet} Net
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Panel */}
      <div className="lg:col-span-3">
        {selectedStudent ? (
          <div className="space-y-8 animate-in slide-in-from-right duration-500">
            {/* Student Stats Header */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{selectedStudent.name} - Analiz</h2>
                <p className="text-slate-500">Öğrencinin performansını inceleyin ve program hazırlayın.</p>
              </div>
              <div className="flex space-x-6">
                <div className="text-center">
                  <p className="text-xs text-slate-400 uppercase font-bold">Toplam Sınav</p>
                  <p className="text-xl font-bold text-slate-900">{studentResults.length}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-400 uppercase font-bold">Ortalama Net</p>
                  <p className="text-xl font-bold text-orange-500">
                    {(studentResults.reduce((acc, r) => acc + (r.totalNet || 0), 0) / (studentResults.length || 1)).toFixed(1)}
                  </p>
                </div>
              </div>
            </div>

            {/* Program Editor */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-slate-800">Haftalık Çalışma Programı Oluştur</h3>
                <button 
                  onClick={saveSchedule}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-all"
                >
                  Programı Kaydet
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.keys(DAYS_LABELS).map(day => (
                  <div key={day} className="space-y-2">
                    <label className="text-sm font-bold text-slate-600 flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                      <span>{DAYS_LABELS[day]}</span>
                    </label>
                    <textarea
                      placeholder={`${DAYS_LABELS[day]} günü yapılacaklar...`}
                      className="w-full p-3 h-24 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 outline-none transition-all resize-none text-sm"
                      value={localTasks[day]}
                      onChange={(e) => setLocalTasks(prev => ({ ...prev, [day]: e.target.value }))}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Last Results Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-800">Son Deneme Performansları</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-400 text-xs font-bold uppercase">
                    <tr>
                      <th className="px-6 py-4">Deneme</th>
                      <th className="px-6 py-4">Tarih</th>
                      <th className="px-6 py-4">Toplam Net</th>
                      <th className="px-6 py-4">Detaylar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {studentResults.length > 0 ? studentResults.map(r => (
                      <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-semibold text-slate-700">{r.title}</td>
                        <td className="px-6 py-4 text-slate-500 text-sm">{r.date}</td>
                        <td className="px-6 py-4">
                          <span className="bg-orange-100 text-orange-700 font-bold px-3 py-1 rounded-full text-sm">
                            {r.totalNet}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-400">
                          Mat: {r.subjectResults['mat']?.correct || 0}D / Fiz: {r.subjectResults['fiz']?.correct || 0}D
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">
                          Öğrenci henüz bir deneme sonucu girmedi.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4 py-20 bg-white rounded-3xl border border-dashed border-slate-200">
            <span className="text-6xl">👥</span>
            <p className="text-xl">Lütfen soldan bir öğrenci seçerek başlayın.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherPanel;
