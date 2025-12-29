
import React, { useState } from 'react';
import { AcademicEvent } from '../types';

interface AcademicAgendaProps {
  events: AcademicEvent[];
  onAdd: (ev: AcademicEvent) => void;
  onDelete: (id: string) => void;
}

const AcademicAgenda: React.FC<AcademicAgendaProps> = ({ events, onAdd, onDelete }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date) return;
    onAdd({
      id: Date.now().toString(),
      title,
      date,
      type: 'exam'
    });
    setTitle('');
    setDate('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white dark:bg-navy-800 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm">
        <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2 text-center">Akademik Takvim</h3>
        <p className="text-sm text-slate-400 text-center mb-10 uppercase tracking-widest font-bold">Sınav ve Ödevlerini Planla</p>

        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <input 
            type="text" placeholder="Sınav/Ödev Başlığı" 
            className="md:col-span-1 p-5 bg-slate-50 dark:bg-navy-900 rounded-2xl border-none focus:ring-4 focus:ring-orange-100 dark:text-white"
            value={title} onChange={e => setTitle(e.target.value)}
          />
          <input 
            type="datetime-local" 
            className="md:col-span-1 p-5 bg-slate-50 dark:bg-navy-900 rounded-2xl border-none focus:ring-4 focus:ring-orange-100 dark:text-white"
            value={date} onChange={e => setDate(e.target.value)}
          />
          <button className="bg-slate-900 dark:bg-orange-500 text-white px-8 rounded-2xl font-black hover:scale-105 transition-all">EKLE</button>
        </form>

        <div className="space-y-4">
          {events.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(ev => (
            <div key={ev.id} className="flex items-center justify-between p-6 bg-slate-50 dark:bg-navy-900/30 rounded-3xl border border-transparent hover:border-slate-200 dark:hover:border-slate-800 transition-all group">
              <div className="flex items-center space-x-5">
                <div className="w-12 h-12 bg-white dark:bg-navy-800 rounded-2xl flex items-center justify-center text-xl shadow-sm">
                  {new Date(ev.date) > new Date() ? '⏳' : '✅'}
                </div>
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-100">{ev.title}</p>
                  <p className="text-xs text-slate-400 uppercase font-black tracking-widest">{new Date(ev.date).toLocaleString('tr-TR')}</p>
                </div>
              </div>
              <button onClick={() => onDelete(ev.id)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all font-bold">KALDIR</button>
            </div>
          ))}
          {events.length === 0 && <div className="text-center py-20 text-slate-300 italic">Takvim şu an boş. Planlamaya başla!</div>}
        </div>
      </div>
    </div>
  );
};

export default AcademicAgenda;
