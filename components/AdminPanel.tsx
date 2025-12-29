
import React, { useState } from 'react';
import { AdminMessage } from '../types';

interface AdminPanelProps {
  messages: AdminMessage[];
  totalUsers: number;
  totalExams: number;
  onBroadcast: (title: string, msg: string) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ messages, totalUsers, totalExams, onBroadcast }) => {
  const [annTitle, setAnnTitle] = useState('');
  const [annMsg, setAnnMsg] = useState('');

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle || !annMsg) return;
    onBroadcast(annTitle, annMsg);
    setAnnTitle('');
    setAnnMsg('');
    alert("Duyuru başarıyla yayınlandı.");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-navy-800 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tighter">Yönetim Kontrol Merkezi</h2>
          <p className="text-slate-500">Sistem sağlığını izleyin ve tüm kullanıcılara bildirim gönderin.</p>
        </div>
        <div className="flex space-x-4">
           <div className="text-center bg-slate-50 dark:bg-navy-900 p-4 rounded-2xl min-w-[120px]">
              <p className="text-[10px] font-black text-slate-400 uppercase">Kullanıcı</p>
              <p className="text-2xl font-black dark:text-white">{totalUsers}</p>
           </div>
           <div className="text-center bg-slate-50 dark:bg-navy-900 p-4 rounded-2xl min-w-[120px]">
              <p className="text-[10px] font-black text-slate-400 uppercase">Veri Girişi</p>
              <p className="text-2xl font-black text-brand">{totalExams}</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Broadcast Form */}
        <div className="lg:col-span-1 bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-xl font-black mb-6">📢 Global Duyuru Oluştur</h3>
            <form onSubmit={handleBroadcast} className="space-y-4">
              <input 
                type="text" placeholder="Duyuru Başlığı" 
                className="w-full p-4 bg-white/10 rounded-2xl border-none focus:ring-2 focus:ring-brand outline-none text-white placeholder-slate-500"
                value={annTitle} onChange={e => setAnnTitle(e.target.value)}
              />
              <textarea 
                placeholder="Duyuru mesajı..."
                className="w-full h-32 p-4 bg-white/10 rounded-2xl border-none focus:ring-2 focus:ring-brand outline-none text-white placeholder-slate-500 resize-none"
                value={annMsg} onChange={e => setAnnMsg(e.target.value)}
              />
              <button className="w-full bg-brand py-4 rounded-2xl font-black hover:bg-orange-600 transition-all shadow-xl shadow-brand/20">
                SİSTEME GÖNDER
              </button>
            </form>
          </div>
          <div className="absolute top-[-40px] right-[-40px] text-[200px] opacity-10 rotate-12 pointer-events-none">📣</div>
        </div>

        {/* Inbox Section */}
        <div className="lg:col-span-2 bg-white dark:bg-navy-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
          <div className="p-8 border-b border-slate-50 dark:border-slate-700 flex justify-between items-center">
             <h3 className="text-xl font-black dark:text-white">📥 Gelen Kutusu (Yönetime Bildirilenler)</h3>
             <span className="bg-slate-100 dark:bg-navy-900 text-slate-500 px-4 py-1 rounded-full text-xs font-bold">{messages.length} Mesaj</span>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[500px]">
            {messages.length > 0 ? messages.map(msg => (
              <div key={msg.id} className="p-8 border-b border-slate-50 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-navy-900/30 transition-all group">
                <div className="flex items-center justify-between mb-3">
                   <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-slate-100 dark:bg-navy-900 rounded-xl flex items-center justify-center font-bold">
                        {msg.senderRole === 'TEACHER' ? '👨‍🏫' : '🎓'}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 dark:text-white">{msg.senderName}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{msg.senderRole}</p>
                      </div>
                   </div>
                   <span className="text-[10px] text-slate-400 font-bold">{new Date(msg.date).toLocaleString('tr-TR')}</span>
                </div>
                <h4 className="font-black text-brand mb-2">{msg.subject}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{msg.content}</p>
              </div>
            )) : (
              <div className="p-20 text-center text-slate-300 italic">Hiç mesaj yok.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
