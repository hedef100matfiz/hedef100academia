
import React, { useState, useEffect } from 'react';
import { User, UserRole, AppState, Announcement, WeeklySchedule } from './types';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Statistics from './components/Statistics';
import CoachingMarket from './components/CoachingMarket';
import TeacherCoachingPanel from './components/TeacherCoachingPanel';
import PuzzleGame from './components/PuzzleGame';
import Settings from './components/Settings';
import PomodoroTimer from './components/PomodoroTimer';
import AuthView from './components/AuthView';
import AdminPanel from './components/AdminPanel';
import FeedbackModal from './components/FeedbackModal';
import { DEFAULT_SUBJECTS } from './constants';

const DB_KEY = 'academia_v9_architect_db';

const App: React.FC = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(DB_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...parsed, currentUser: null };
    }
    
    return {
      users: [
        { 
          id: 'admin', 
          name: 'Sistem Yöneticisi', 
          username: 'admin', 
          password: 'admin123', 
          role: UserRole.ADMIN, 
          examType: 'GENEL', 
          subjects: [], 
          targetNet: 0, 
          targetGPA: 0, 
          streak: 0 
        },
        { 
          id: 't1', 
          name: 'Caner Hoca', 
          username: 'hocacaner', 
          password: '123456', 
          role: UserRole.TEACHER, 
          branch: 'Matematik',
          examType: 'YKS', 
          subjects: [], 
          targetNet: 0, 
          targetGPA: 0, 
          streak: 8, 
          isCoachingOpen: true
        },
        { 
          id: 's1', 
          name: 'Selim Çalışkan', 
          username: 'ogrenciselim', 
          password: '123456', 
          role: UserRole.STUDENT, 
          examType: 'YKS', 
          subjects: DEFAULT_SUBJECTS['YKS'], 
          targetNet: 95, 
          targetGPA: 3.8, 
          streak: 12 
        }
      ],
      examResults: [],
      announcements: [{ id: 'a1', title: 'ACADEMIA V9.5', message: 'Premium giriş animasyonu ve branş odaklı koçluk sistemi aktif!', date: new Date().toISOString(), isGlobal: true }],
      adminMessages: [],
      coachingRequests: [],
      weeklySchedules: [],
      currentUser: null,
      settings: { isDarkMode: false, sidebarCollapsed: false }
    };
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeAnnouncement, setActiveAnnouncement] = useState<Announcement | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  // Intro Logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 3200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const { currentUser, ...persistentState } = state;
    localStorage.setItem(DB_KEY, JSON.stringify(persistentState));
    if (state.settings.isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [state]);

  useEffect(() => {
    const globalAnn = state.announcements.find(a => a.isGlobal);
    if (globalAnn) setActiveAnnouncement(globalAnn);
  }, [state.announcements]);

  const syncGlobalData = (updater: (prev: AppState) => AppState) => {
    setState(prev => {
      const newState = updater(prev);
      if (prev.currentUser) {
        const fresh = newState.users.find(u => u.id === prev.currentUser?.id);
        if (fresh) newState.currentUser = fresh;
      }
      return newState;
    });
  };

  const handleLogin = (user: User) => {
    setState(p => ({ ...p, currentUser: user }));
    setActiveTab(user.role === UserRole.ADMIN ? 'admin' : 'dashboard');
  };

  const handleRegister = (newUser: User) => {
    syncGlobalData(prev => ({ ...prev, users: [...prev.users, newUser] }));
    setState(p => ({ ...p, currentUser: newUser }));
    setActiveTab(newUser.role === UserRole.ADMIN ? 'admin' : 'dashboard');
  };

  const handleLogout = () => {
    setState(p => ({ ...p, currentUser: null }));
    setActiveTab('dashboard');
  };

  // 1. Premium Intro View
  if (showIntro) {
    return (
      <div className="fixed inset-0 z-[100] bg-navy-950 flex flex-col items-center justify-center overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand/10 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-900/10 blur-[120px] rounded-full animate-pulse delay-700"></div>
        
        <div className="relative flex flex-col items-center animate-premium-intro">
          <div className="w-24 h-24 bg-brand rounded-[2rem] flex items-center justify-center text-5xl font-black text-white shadow-2xl shadow-brand/40 mb-8 transform rotate-12">H</div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-premium-shimmer">
            Hedef100Academia
          </h1>
          <div className="mt-4 flex items-center space-x-2">
            <div className="h-px w-12 bg-slate-700"></div>
            <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px]">Architect Edition v9.5</p>
            <div className="h-px w-12 bg-slate-700"></div>
          </div>
        </div>
        
        {/* Loading Indicator */}
        <div className="absolute bottom-20 w-48 h-1 bg-slate-900 rounded-full overflow-hidden">
          <div className="h-full bg-brand w-0 animate-[shimmer-glow_3s_ease-in-out_forwards]" style={{width: '100%', transition: 'width 3.2s linear'}}></div>
        </div>
      </div>
    );
  }

  // 2. Auth Flow
  if (!state.currentUser) {
    return <AuthView users={state.users} onLogin={handleLogin} onRegister={handleRegister} />;
  }

  // 3. Main Application View
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-navy-900 transition-colors duration-300 font-inter">
      <div className={`${mobileMenuOpen ? 'fixed inset-0 z-50' : 'hidden'} lg:relative lg:flex`}>
        <div className="absolute inset-0 bg-navy-900/40 lg:hidden" onClick={() => setMobileMenuOpen(false)}></div>
        <Sidebar 
          user={state.currentUser}
          collapsed={state.settings.sidebarCollapsed} 
          activeTab={activeTab} 
          onTabChange={(tab) => { setActiveTab(tab); setMobileMenuOpen(false); }}
          onToggle={() => setState(p => ({ ...p, settings: { ...p.settings, sidebarCollapsed: !p.settings.sidebarCollapsed } }))}
        />
      </div>
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header user={state.currentUser} isDarkMode={state.settings.isDarkMode} onToggleDark={() => setState(p => ({ ...p, settings: { ...p.settings, isDarkMode: !p.settings.isDarkMode } }))} onLogout={handleLogout} onToggleMenu={() => setMobileMenuOpen(!mobileMenuOpen)} onShowFeedback={() => setShowFeedbackModal(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
          {activeAnnouncement && (
            <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-5 rounded-[2rem] shadow-xl flex items-center justify-between border-b-4 border-red-700 animate-in slide-in-from-top duration-500">
              <div className="flex items-center space-x-4"><span className="text-3xl">🛡️</span><div><h4 className="font-black text-sm uppercase">{activeAnnouncement.title}</h4><p className="text-xs opacity-90">{activeAnnouncement.message}</p></div></div>
              <button onClick={() => setActiveAnnouncement(null)} className="bg-white/20 p-2 rounded-xl">✕</button>
            </div>
          )}
          {activeTab === 'dashboard' && <Dashboard user={state.currentUser} results={state.examResults.filter(r => r.studentId === state.currentUser?.id)} assignedTeacher={state.users.find(u => u.id === state.currentUser?.assignedTeacherId)} schedule={state.weeklySchedules.find(s => s.studentId === state.currentUser?.id)} onAddResult={(res) => syncGlobalData(p => ({ ...p, examResults: [res, ...p.examResults] }))} />}
          {activeTab === 'stats' && <Statistics user={state.currentUser} results={state.examResults.filter(r => r.studentId === state.currentUser?.id)} />}
          {activeTab === 'market' && <CoachingMarket teachers={state.users.filter(u => u.role === UserRole.TEACHER)} requests={state.coachingRequests.filter(r => r.studentId === state.currentUser?.id)} onRequest={(tid) => syncGlobalData(p => ({ ...p, coachingRequests: [...p.coachingRequests, { id: 'req'+Date.now(), studentId: state.currentUser!.id, studentName: state.currentUser!.name, teacherId: tid, status: 'pending', date: new Date().toISOString() }] }))} />}
          {activeTab === 'teacher_panel' && <TeacherCoachingPanel teacher={state.currentUser} requests={state.coachingRequests.filter(r => r.teacherId === state.currentUser?.id)} students={state.users.filter(u => u.assignedTeacherId === state.currentUser?.id)} results={state.examResults} onUpdateStatus={(id, status) => syncGlobalData(prev => {
            const req = prev.coachingRequests.find(r => r.id === id);
            if (!req) return prev;
            return { ...prev, coachingRequests: prev.coachingRequests.map(r => r.id === id ? { ...r, status } : r), users: status === 'accepted' ? prev.users.map(u => u.id === req.studentId ? { ...u, assignedTeacherId: req.teacherId } : u) : prev.users };
          })} onUpdateSchedule={(sched) => syncGlobalData(p => ({ ...p, weeklySchedules: [...p.weeklySchedules.filter(s => s.studentId !== sched.studentId), sched] }))} onReportAdmin={(subj, cont) => alert("Yönetime iletildi!")} />}
          {activeTab === 'game' && <PuzzleGame />}
          {activeTab === 'admin' && <AdminPanel messages={state.adminMessages} totalUsers={state.users.length} totalExams={state.examResults.length} onBroadcast={(title, msg) => syncGlobalData(p => ({ ...p, announcements: [{ id: 'ann'+Date.now(), title, message: msg, date: new Date().toISOString(), isGlobal: true }, ...p.announcements.map(a => ({...a, isGlobal: false}))] }))} />}
          {activeTab === 'settings' && <Settings user={state.currentUser} onUpdate={(u) => syncGlobalData(p => ({ ...p, users: p.users.map(us => us.id === u.id ? u : us) }))} onReportAdmin={(subj, cont) => syncGlobalData(p => ({ ...p, adminMessages: [{ id: 'msg'+Date.now(), senderId: state.currentUser!.id, senderName: state.currentUser!.name, senderRole: state.currentUser!.role, subject: subj, content: cont, date: new Date().toISOString(), isRead: false }, ...p.adminMessages] }))} />}
        </main>
      </div>
      <PomodoroTimer />
      {showFeedbackModal && <FeedbackModal onClose={() => setShowFeedbackModal(false)} onSend={(msg) => alert("İletildi!")} />}
    </div>
  );
};

export default App;
