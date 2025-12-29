
import React, { useState } from 'react';
import { User, UserRole } from '../types';

interface LoginViewProps {
  users: User[];
  onLogin: (user: User) => void;
  onAdminLogin: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ users, onLogin, onAdminLogin }) => {
  const [showAdminPass, setShowAdminPass] = useState(false);
  const [adminPass, setAdminPass] = useState('');

  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPass === 'admin123') {
      onAdminLogin();
    } else {
      alert("Hatalı yönetici şifresi!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-navy-900">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-12 animate-in fade-in zoom-in-95 duration-700">
        
        <div className="flex flex-col justify-center space-y-8">
          <div>
            <div className="w-16 h-16 bg-orange-500 rounded-3xl flex items-center justify-center text-white text-3xl font-black mb-6 shadow-2xl shadow-orange-500/30">H</div>
            <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight">Hub Pro'ya <br/>Tekrar Hoş Geldin.</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-4 text-lg">Hibrit akademik takip sistemiyle her sınav türünde yanındayız.</p>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => setShowAdminPass(!showAdminPass)}
              className="text-xs font-black text-slate-400 hover:text-orange-500 transition-colors uppercase tracking-widest"
            >
              🛡️ Yönetici Girişi
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-navy-800 p-10 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800">
          {!showAdminPass ? (
            <div className="space-y-6">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Kullanıcı Seçiniz</h3>
              <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                {users.map(u => (
                  <button 
                    key={u.id}
                    onClick={() => onLogin(u)}
                    className="w-full p-6 bg-slate-50 dark:bg-navy-900/50 rounded-3xl border border-transparent hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-all text-left flex items-center justify-between group"
                  >
                    <div>
                      <p className="font-black text-slate-800 dark:text-slate-100">{u.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{u.examType} Kampı</p>
                    </div>
                    <span className="text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </button>
                ))}
                {users.length === 0 && (
                  <div className="text-center py-12 text-slate-400 italic">Kayıtlı kullanıcı bulunamadı. Lütfen yeni profil oluşturun.</div>
                )}
              </div>
              <button 
                onClick={() => window.location.reload()} // Simply re-triggers onboarding if empty
                className="w-full py-5 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl text-slate-400 font-bold hover:border-orange-500 hover:text-orange-500 transition-all"
              >
                + Yeni Profil Oluştur
              </button>
            </div>
          ) : (
            <div className="animate-in slide-in-from-right duration-300">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Yönetici Yetkilendirmesi</h3>
              <form onSubmit={handleAdminAuth} className="space-y-4">
                <input 
                  autoFocus
                  type="password" placeholder="Admin Şifresi" 
                  className="w-full p-5 bg-slate-50 dark:bg-navy-900 rounded-2xl border-none focus:ring-4 focus:ring-orange-100 dark:text-white font-bold text-center"
                  value={adminPass} onChange={e => setAdminPass(e.target.value)}
                />
                <button className="w-full bg-slate-900 dark:bg-orange-500 text-white py-5 rounded-2xl font-black hover:scale-105 transition-all">SİSTEME GİRİŞ YAP</button>
                <button type="button" onClick={() => setShowAdminPass(false)} className="w-full text-xs font-bold text-slate-400 uppercase">Geri Dön</button>
              </form>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default LoginView;
