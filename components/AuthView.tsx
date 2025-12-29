
import React, { useState } from 'react';
import { User, UserRole, ExamType } from '../types';
import { DEFAULT_SUBJECTS, TEACHER_BRANCHES } from '../constants';

interface AuthViewProps {
  users: User[];
  onLogin: (user: User) => void;
  onRegister: (user: User) => void;
}

const AuthView: React.FC<AuthViewProps> = ({ users, onLogin, onRegister }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [show2FA, setShow2FA] = useState(false);
  const [twoFACode, setTwoFACode] = useState('');
  const [pendingUser, setPendingUser] = useState<User | null>(null);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  
  // Login State
  const [lUser, setLUser] = useState('');
  const [lPass, setLPass] = useState('');

  // Register State
  const [rName, setRName] = useState('');
  const [rUser, setRUser] = useState('');
  const [rPass, setRPass] = useState('');
  const [rRole, setRRole] = useState<UserRole>(UserRole.STUDENT);
  const [rExam, setRExam] = useState<ExamType>('YKS');
  const [rBranch, setRBranch] = useState(TEACHER_BRANCHES[0]);

  const MASTER_KEY = "1903";

  const handleLoginAttempt = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.username === lUser && u.password === lPass);
    if (user) {
      if (user.role === UserRole.ADMIN) {
        setPendingUser(user);
        setIsRegisterMode(false);
        setShow2FA(true);
      } else {
        onLogin(user);
      }
    } else {
      alert("Hatalı kullanıcı adı veya şifre!");
    }
  };

  const handleRegisterAttempt = (e: React.FormEvent) => {
    e.preventDefault();
    if (users.some(u => u.username === rUser)) {
      alert("Bu kullanıcı adı zaten alınmış!");
      return;
    }

    const newUser: User = {
      id: 'u' + Date.now(),
      name: rName,
      username: rUser,
      password: rPass,
      role: rRole,
      examType: rExam,
      branch: rRole === UserRole.TEACHER ? rBranch : undefined,
      subjects: rRole === UserRole.STUDENT ? DEFAULT_SUBJECTS[rExam] : [],
      targetNet: rExam === 'YKS' ? 80 : 0,
      targetGPA: 3.5,
      streak: 1
    };

    if (rRole === UserRole.ADMIN) {
      setPendingUser(newUser);
      setIsRegisterMode(true);
      setShow2FA(true);
    } else {
      onRegister(newUser);
    }
  };

  const verify2FA = () => {
    if (twoFACode === MASTER_KEY) {
      if (pendingUser) {
        if (isRegisterMode) onRegister(pendingUser);
        else onLogin(pendingUser);
      }
      setShow2FA(false);
      setTwoFACode('');
    } else {
      alert("HATALI GÜVENLİK KODU! Erişim engellendi.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-slate-100 to-orange-50 dark:from-navy-900 dark:to-navy-950">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 bg-white dark:bg-navy-800 rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800">
        
        {/* Left Side: Branding */}
        <div className="hidden md:flex flex-col justify-between p-12 bg-slate-900 text-white relative">
          <div className="relative z-10">
            <div className="w-16 h-16 bg-brand rounded-2xl flex items-center justify-center text-3xl font-black mb-8 shadow-2xl shadow-brand/20">H</div>
            <h1 className="text-5xl font-black tracking-tighter leading-tight mb-4">Geleceğin <br/>Mimarisi <br/>Burada.</h1>
            <p className="text-slate-400 text-lg opacity-80">v9.0 Architect Edition ile branş odaklı koçluk sistemine geçiş yap.</p>
          </div>
          <div className="absolute top-[-20%] right-[-10%] text-[300px] opacity-5 pointer-events-none rotate-12">📚</div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <div className="flex p-1 bg-slate-100 dark:bg-navy-900 rounded-2xl mb-8">
            <button onClick={() => setActiveTab('login')} className={`flex-1 py-3 rounded-xl font-bold transition-all ${activeTab === 'login' ? 'bg-white dark:bg-navy-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'}`}>Giriş Yap</button>
            <button onClick={() => setActiveTab('register')} className={`flex-1 py-3 rounded-xl font-bold transition-all ${activeTab === 'register' ? 'bg-white dark:bg-navy-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'}`}>Kayıt Ol</button>
          </div>

          {activeTab === 'login' ? (
            <form onSubmit={handleLoginAttempt} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Kullanıcı Adı</label>
                <input type="text" placeholder="username" required className="w-full p-4 mt-1 bg-slate-50 dark:bg-navy-900 border-none rounded-2xl focus:ring-2 focus:ring-brand dark:text-white outline-none" value={lUser} onChange={e => setLUser(e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Şifre</label>
                <input type="password" placeholder="••••••••" required className="w-full p-4 mt-1 bg-slate-50 dark:bg-navy-900 border-none rounded-2xl focus:ring-2 focus:ring-brand dark:text-white outline-none" value={lPass} onChange={e => setLPass(e.target.value)} />
              </div>
              <button className="w-full bg-brand text-white py-5 rounded-2xl font-black shadow-xl hover:bg-orange-600 transition-all active:scale-95 mt-4">SİSTEME GİRİŞ YAP</button>
            </form>
          ) : (
            <form onSubmit={handleRegisterAttempt} className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Ad Soyad</label>
                <input type="text" placeholder="Örn: Ahmet Yılmaz" required className="w-full p-4 mt-1 bg-slate-50 dark:bg-navy-900 border-none rounded-2xl focus:ring-2 focus:ring-brand dark:text-white outline-none" value={rName} onChange={e => setRName(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Kullanıcı Adı</label>
                  <input type="text" placeholder="ahmet123" required className="w-full p-4 mt-1 bg-slate-50 dark:bg-navy-900 border-none rounded-2xl focus:ring-2 focus:ring-brand dark:text-white outline-none" value={rUser} onChange={e => setRUser(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Şifre</label>
                  <input type="password" placeholder="••••••••" required className="w-full p-4 mt-1 bg-slate-50 dark:bg-navy-900 border-none rounded-2xl focus:ring-2 focus:ring-brand dark:text-white outline-none" value={rPass} onChange={e => setRPass(e.target.value)} />
                </div>
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Rol Seçimi</label>
                <select className="w-full p-4 mt-1 bg-slate-50 dark:bg-navy-900 border-none rounded-2xl focus:ring-2 focus:ring-brand dark:text-white outline-none" value={rRole} onChange={e => setRRole(e.target.value as UserRole)}>
                  <option value={UserRole.STUDENT}>Öğrenci</option>
                  <option value={UserRole.TEACHER}>Öğretmen</option>
                  <option value={UserRole.ADMIN}>Yönetici (Yetki Gerekir)</option>
                </select>
              </div>

              {rRole === UserRole.TEACHER && (
                <div className="animate-in slide-in-from-top-2 duration-300">
                  <label className="text-xs font-black text-brand uppercase tracking-widest ml-1">Branşınız / Alanınız</label>
                  <select className="w-full p-4 mt-1 bg-orange-50 dark:bg-orange-950/20 border-2 border-orange-100 dark:border-orange-900/30 rounded-2xl focus:ring-2 focus:ring-brand dark:text-white outline-none" value={rBranch} onChange={e => setRBranch(e.target.value)}>
                    {TEACHER_BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              )}

              {rRole === UserRole.STUDENT && (
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Sınav Türü</label>
                  <select className="w-full p-4 mt-1 bg-slate-50 dark:bg-navy-900 border-none rounded-2xl focus:ring-2 focus:ring-brand dark:text-white outline-none" value={rExam} onChange={e => setRExam(e.target.value as ExamType)}>
                    <option value="YKS">YKS</option>
                    <option value="LGS">LGS</option>
                    <option value="KPSS">KPSS</option>
                    <option value="UNIVERSITE">Üniversite</option>
                  </select>
                </div>
              )}
              <button className="w-full bg-slate-900 dark:bg-brand text-white py-5 rounded-2xl font-black transition-all active:scale-95 mt-4">
                {rRole === UserRole.ADMIN ? 'ADMİN DOĞRULAMASI' : 'HESABIMI OLUŞTUR'}
              </button>
            </form>
          )}
        </div>
      </div>

      {show2FA && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy-950/90 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white dark:bg-navy-800 rounded-[3rem] shadow-2xl w-full max-w-md p-10 text-center relative overflow-hidden">
            <div className="w-20 h-20 bg-red-50 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">🔐</div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4">GÜVENLİK DOĞRULAMASI</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">
              Sistem yöneticisi <span className="text-brand font-bold underline">ahmetkula1903@gmail.com</span> onayı gerekiyor. Kodu giriniz.
            </p>
            <input autoFocus type="text" placeholder="• • • •" maxLength={4} className="w-full p-6 bg-slate-50 dark:bg-navy-900 rounded-3xl border-2 border-slate-200 text-center text-3xl font-black tracking-[1rem] dark:text-white outline-none mb-6" value={twoFACode} onChange={e => setTwoFACode(e.target.value)} />
            <div className="flex gap-4">
              <button onClick={() => setShow2FA(false)} className="flex-1 py-4 text-slate-400 font-bold">İPTAL</button>
              <button onClick={verify2FA} className="flex-[2] bg-brand text-white py-4 rounded-2xl font-black shadow-xl">DOĞRULA</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthView;
