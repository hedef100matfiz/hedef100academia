
import React, { useState } from 'react';

interface FeedbackModalProps {
  onClose: () => void;
  onSend: (msg: string) => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ onClose, onSend }) => {
  const [msg, setMsg] = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white dark:bg-navy-800 rounded-[2.5rem] shadow-2xl w-full max-w-md p-10 border border-slate-100 dark:border-slate-800">
        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Geliştiriciye Not İlet</h3>
        <p className="text-slate-500 text-sm mb-6">Uygulama ile ilgili hata bildirimi, öneri veya teşekkür mesajınızı buradan gönderebilirsiniz.</p>
        
        <textarea 
          placeholder="Mesajınızı yazınız..."
          className="w-full h-40 p-5 bg-slate-50 dark:bg-navy-900 border border-slate-100 dark:border-slate-800 rounded-3xl focus:ring-4 focus:ring-orange-100 outline-none dark:text-white transition-all resize-none mb-6"
          value={msg}
          onChange={e => setMsg(e.target.value)}
        />
        
        <div className="flex gap-4">
          <button onClick={onClose} className="flex-1 py-4 border-2 border-slate-100 dark:border-slate-700 rounded-2xl font-bold dark:text-white">İPTAL</button>
          <button 
            disabled={!msg}
            onClick={() => onSend(msg)}
            className="flex-1 bg-orange-500 text-white py-4 rounded-2xl font-black shadow-lg hover:bg-orange-600 transition-all disabled:opacity-50"
          >
            GÖNDER
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
