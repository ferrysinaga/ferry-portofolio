import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';

const GuestbookWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  
  // STATE BARU UNTUK MENYIMPAN SESI LOGIN
  const [session, setSession] = useState<any>(null);

  // Mencek apakah pengunjung sedang login atau tidak
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchMessages = async () => {
    const { data } = await supabase.from('guestbook').select('*').order('created_at', { ascending: false });
    if (data) setMessages(data);
  };

  useEffect(() => {
    if (isOpen) fetchMessages();
  }, [isOpen]);

  // LOGIKA LOGIN VIA GITHUB
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'github' });
  };

  // LOGIKA LOGOUT
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !session) return;
    
    setLoading(true);
    setStatus('Sending...');
    
    // Menarik nama asli dari profil GitHub mereka
    const githubName = session.user.user_metadata.full_name || session.user.user_metadata.user_name || 'Anonymous';
    
    const { error } = await supabase.from('guestbook').insert([{ name: githubName, message }]);
    
    if (error) {
      setStatus('❌ Gagal: ' + error.message);
    } else {
      setStatus('✅ Terkirim');
      setMessage('');
      fetchMessages();
    }
    setLoading(false);
    setTimeout(() => setStatus(''), 3000);
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toLowerCase();
  };

  return (
    <div className="mt-10 flex justify-center w-full" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
      
      {/* TOMBOL BUKA GUESTBOOK */}
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-[#1d1d1d] text-white px-8 py-3 font-bold hover:bg-gray-800 transition-colors flex items-center gap-2 animate-fade-in-up"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        Ketik Sesuatu
      </button>

      {/* POP-UP GUESTBOOK */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/95">
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.15 }}
              className="w-full max-w-4xl h-[500px] bg-white border-2 border-[#1d1d1d] flex flex-col md:flex-row relative shadow-2xl"
            >
              
              <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-[#1d1d1d] font-bold text-xl transition-colors">
                ×
              </button>

              {/* SISI KIRI: FORM & AUTH */}
              <div className="w-full md:w-1/2 p-8 md:p-10 border-b md:border-b-0 md:border-r border-gray-200 flex flex-col justify-center overflow-y-auto">
                <h2 className="text-xl font-bold text-[#1d1d1d] mb-1 uppercase tracking-widest">/guestbook</h2>
                
                {/* JIKA BELUM LOGIN */}
                {!session ? (
                  <div className="mt-8">
                    <p className="text-xs text-gray-500 mb-4 font-mono leading-relaxed">
                      Please authenticate with GitHub to leave a message. This prevents spam.
                    </p>
                    <button 
                      onClick={handleLogin}
                      className="w-full bg-[#1d1d1d] text-white font-bold py-3 text-sm tracking-wider hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                      Login w/ GitHub
                    </button>
                  </div>
                ) : (
                  // JIKA SUDAH LOGIN
                  <div className="mt-6 flex flex-col h-full">
                    <div className="flex justify-between items-center mb-6">
                      <p className="text-xs text-[#1d1d1d] font-bold">
                        Hi, {session.user.user_metadata.full_name || session.user.user_metadata.user_name} 👋
                      </p>
                      <button onClick={handleLogout} className="text-[10px] text-gray-400 hover:text-red-500 uppercase tracking-widest font-bold transition-colors">Logout</button>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                      <textarea 
                        value={message} onChange={(e) => setMessage(e.target.value)} 
                        placeholder="Ketik pesan Anda di sini..." 
                        className="w-full bg-transparent border-b border-gray-300 py-2 text-sm outline-none focus:border-[#1d1d1d] transition-colors h-24 resize-none rounded-none placeholder-gray-300" 
                        required maxLength={300} 
                      />
                      <div className="flex items-center justify-between mt-2">
                        <button type="submit" disabled={loading} className="text-[#1d1d1d] font-bold text-sm uppercase tracking-wider hover:text-gray-500 transition-colors disabled:opacity-50">
                          {loading ? 'Sending...' : 'Submit ->'}
                        </button>
                        {status && <span className={`text-xs font-mono ${status.includes('❌') ? 'text-red-500' : 'text-[#1d1d1d]'}`}>{status}</span>}
                      </div>
                    </form>
                  </div>
                )}
              </div>

              {/* SISI KANAN: DAFTAR PESAN */}
              <div className="w-full md:w-1/2 p-8 md:p-10 bg-white overflow-y-auto">
                <div className="flex justify-between items-baseline mb-6 border-b border-[#1d1d1d] pb-2">
                  <h3 className="font-bold text-sm text-[#1d1d1d] uppercase tracking-wider">Entries</h3>
                  <span className="text-xs font-mono text-gray-400">[{messages.length}]</span>
                </div>
                <div className="flex flex-col">
                  {messages.length === 0 ? (
                    <div className="text-gray-300 text-sm italic py-4">Belum ada pesan.</div>
                  ) : (
                    messages.map((msg) => (
                      <div key={msg.id} className="py-4 border-b border-gray-100 last:border-0">
                        <div className="flex justify-between items-baseline mb-1">
                          <span className="font-bold text-xs text-[#1d1d1d]">{msg.name}</span>
                          <span className="text-[10px] text-gray-400 font-mono">{formatDate(msg.created_at)}</span>
                        </div>
                        <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GuestbookWidget;