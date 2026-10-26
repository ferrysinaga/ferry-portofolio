import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { supabase } from '../../../supabaseClient';
import { motion } from 'framer-motion';
import type { Session } from '@supabase/supabase-js';

import SnakeBackground from '../../components/SnakeBackground';
import AdminSidebar from './AdminSidebar';
import GalleryManager from './GalleryManager';
import ProjectsManager from './ProjectsManager';
import ExperienceManager from './ExperienceManager';
import EducationManager from './EducationManager';
import CertificateManager from './CertificateManager';
import ProfileManager from './ProfileManager'; // 1. IMPORT COMPONENT BARU

export default function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  // 2. TAMBAHKAN 'profile' KE STATE ACTIVE TAB
  const [activeTab, setActiveTab] = useState<'gallery' | 'projects' | 'experience' | 'education' | 'certificates' | 'profile'>('gallery');
  
  const [isRecovering, setIsRecovering] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (event === 'PASSWORD_RECOVERY') {
        setIsRecovering(true);
        setMessage('');
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true); setMessage('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMessage("❌ Invalid email or password.");
    setLoading(false);
  };

  const handleResetPassword = async () => {
    if (!email) {
      setMessage("❌ Enter your email address first.");
      return;
    }
    setLoading(true); setMessage('⏳ Sending link...');
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin`, 
    });
    if (error) setMessage("❌ Failed: " + error.message);
    else setMessage("✅ Link sent to email!");
    setLoading(false);
  };

  const handleUpdatePassword = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true); setMessage('');
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setMessage("❌ Failed: " + error.message);
    } else {
      setMessage("✅ Password updated!");
      setIsRecovering(false);
    }
    setLoading(false);
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'gallery': return <GalleryManager />;
      case 'projects': return <ProjectsManager />;
      case 'experience': return <ExperienceManager />;
      case 'education': return <EducationManager />;
      case 'certificates': return <CertificateManager />;
      case 'profile': return <ProfileManager session={session!} />; // 3. TAMBAHKAN RUTE COMPONENT PROFILE
      default: return <GalleryManager />;
    }
  };

  // UI FORM (Global style)
  const inputClass = "w-full border-2 border-[#1d1d1d] p-3 text-[#1d1d1d] text-sm focus:outline-none focus:translate-x-[-3px] focus:translate-y-[-3px] focus:shadow-[4px_4px_0px_0px_#1d1d1d] transition-all rounded-none";
  const btnClass = "w-full mt-4 bg-[#1d1d1d] text-white py-3 font-bold border-2 border-[#1d1d1d] shadow-[4px_4px_0px_0px_#e5e7eb] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-300 rounded-none uppercase tracking-wider";

  if (isRecovering) {
    return (
      <div className="admin-theme relative isolate min-h-screen flex items-center justify-center p-4 overflow-hidden" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
        <SnakeBackground />
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 bg-white p-8 border-4 border-[#1d1d1d] shadow-[8px_8px_0px_0px_#1d1d1d] w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#1d1d1d] uppercase tracking-widest border-b-4 border-[#1d1d1d] inline-block pb-1">Reset</h1>
            <p className="text-[#1d1d1d] mt-2 font-medium">Set your new password.</p>
          </div>
          {message && <div className={`mb-6 p-3 border-2 border-[#1d1d1d] text-sm font-bold shadow-[3px_3px_0px_0px_#1d1d1d] ${message.includes('❌') ? 'bg-red-100' : 'bg-green-100'}`}>{message}</div>}
          <form onSubmit={handleUpdatePassword} className="flex flex-col gap-5">
            <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className={inputClass} placeholder="NEW PASSWORD" required minLength={6} />
            <button type="submit" disabled={loading} className={btnClass}>
              {loading ? 'PROCESSING...' : 'UPDATE'}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="admin-theme relative isolate min-h-screen flex items-center justify-center p-4 overflow-hidden" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
        <SnakeBackground />
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 bg-white p-8 border-4 border-[#1d1d1d] shadow-[8px_8px_0px_0px_#1d1d1d] w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#1d1d1d] uppercase tracking-widest border-b-4 border-[#1d1d1d] inline-block pb-1">Admin</h1>
            <p className="text-[#1d1d1d] mt-2 font-medium">System authentication.</p>
          </div>
          {message && <div className={`mb-6 p-3 border-2 border-[#1d1d1d] text-sm font-bold shadow-[3px_3px_0px_0px_#1d1d1d] ${message.includes('❌') ? 'bg-red-100' : 'bg-green-100'}`}>{message}</div>}
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className={inputClass} placeholder="EMAIL ADDRESS" required />
            <div>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className={inputClass} placeholder="PASSWORD" />
              <div className="flex justify-end mt-2">
                <button type="button" onClick={handleResetPassword} disabled={loading} className="text-sm text-gray-500 hover:text-[#1d1d1d] hover:underline font-bold transition-colors">
                  Lost Key?
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className={btnClass}>
              {loading ? 'AUTHENTICATING...' : 'ENTER'}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="admin-theme relative isolate min-h-screen flex flex-col md:flex-row" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
      <SnakeBackground />
      <AdminSidebar 
        session={session} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={() => supabase.auth.signOut()} 
      />
      <main className="relative z-10 flex-1 min-w-0 p-5 md:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-gray-500">Portfolio control panel</p>
            <h2 className="text-4xl md:text-5xl font-bold text-[#1d1d1d] uppercase tracking-widest drop-shadow-sm">{activeTab}</h2>
            <div className="h-1 w-full max-w-md mt-4 bg-gray-100 border-b-2 border-dashed border-gray-400"></div>
          </div>
          {renderContent()}
        </div>
      </main>
    </motion.div>
  );
}