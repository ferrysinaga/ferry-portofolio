import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';

const GuestbookWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const fetchMessages = async () => {
    const { data } = await supabase.from('guestbook').select('*').order('created_at', { ascending: false });
    if (data) setMessages(data);
  };

  useEffect(() => {
    if (isOpen) fetchMessages();
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setLoading(true);
    setStatus('Mengirim...');
    
    const { error } = await supabase.from('guestbook').insert([{ name, message }]);
    
    if (error) {
      setStatus('❌ Gagal');
    } else {
      setStatus('✅ Terkirim');
      setName('');
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
    <div className="mt-20 -mb-14 flex justify-center w-full" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
      
      {/* TOMBOL "KETIK SESUATU" */}
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-[#1d1d1d] text-white px-8 py-3 font-bold hover:bg-gray-800 transition-colors flex items-center gap-2 animate-fade-in-up"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        Say Hello!
      </button>

      {/* POP-UP HORIZONTAL ULTRA-MINIMAL & RINGAN */}
      <AnimatePresence>
        {isOpen && (
          // Layar belakang putih semi-transparan (Sangat ringan tanpa efek blur)
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/95">
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.15 }} // Animasi dipercepat
              className="w-full max-w-4xl h-[500px] bg-white border-2 border-[#1d1d1d] flex flex-col md:flex-row relative"
            >
              
              {/* TOMBOL CLOSE (X) MINIMALIS */}
              <button 
                onClick={() => setIsOpen(false)} 
                className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-[#1d1d1d] font-bold text-xl transition-colors"
              >
                ×
              </button>

              {/* SISI KIRI: FORM MINIMALIS (Tanpa kotak warna) */}
              <div className="w-full md:w-1/2 p-8 md:p-10 border-b md:border-b-0 md:border-r border-gray-200 flex flex-col justify-center overflow-y-auto">
                <h2 className="text-xl font-bold text-[#1d1d1d] mb-1 uppercase tracking-widest">/guestbook</h2>
                <p className="text-xs text-gray-400 mb-8 font-mono">Tulis pesan untuk saya.</p>
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  <div>
                    <input 
                      type="text" value={name} onChange={(e) => setName(e.target.value)} 
                      placeholder="Nama" 
                      className="w-full bg-transparent border-b border-gray-300 py-2 text-sm outline-none focus:border-[#1d1d1d] transition-colors rounded-none placeholder-gray-300" 
                      required maxLength={50} 
                    />
                  </div>
                  <div>
                    <textarea 
                      value={message} onChange={(e) => setMessage(e.target.value)} 
                      placeholder="Pesan..." 
                      className="w-full bg-transparent border-b border-gray-300 py-2 text-sm outline-none focus:border-[#1d1d1d] transition-colors h-20 resize-none rounded-none placeholder-gray-300" 
                      required maxLength={300} 
                    />
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <button 
                      type="submit" disabled={loading} 
                      className="text-[#1d1d1d] font-bold text-sm uppercase tracking-wider hover:text-gray-500 transition-colors disabled:opacity-50"
                    >
                      {loading ? 'Sending...' : 'Submit ->'}
                    </button>
                    {status && <span className={`text-xs font-mono ${status.includes('❌') ? 'text-red-500' : 'text-[#1d1d1d]'}`}>{status}</span>}
                  </div>
                </form>
              </div>

              {/* SISI KANAN: DAFTAR PESAN (Clean look) */}
              <div className="w-full md:w-1/2 p-8 md:p-10 bg-white overflow-y-auto">
                <div className="flex justify-between items-baseline mb-6 border-b border-[#1d1d1d] pb-2">
                  <h3 className="font-bold text-sm text-[#1d1d1d] uppercase tracking-wider">Entries</h3>
                  <span className="text-xs font-mono text-gray-400">
                    [{messages.length}]
                  </span>
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