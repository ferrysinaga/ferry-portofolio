import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import TypewriterText from '../components/TypewriterText';
import { motion, AnimatePresence } from 'framer-motion'; 
import ViewCounter from '../components/ViewCounter'; 
import { supabase } from '../../supabaseClient'; 

// --- DECRYPTED TEXT COMPONENT ---
const DecryptedText = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const [displayText, setDisplayText] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+{}:"<>?|[]~\\-\';,./';

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    const timeout = setTimeout(() => {
      setIsStarted(true);
      let iteration = 0;
      interval = setInterval(() => {
        setDisplayText(
          text.split('').map((char, index) => {
            if (index < iteration) return text[index];
            if (char === ' ') return ' ';
            return chars[Math.floor(Math.random() * chars.length)];
          }).join('')
        );
        if (iteration >= text.length) clearInterval(interval);
        iteration += 1 / 3;
      }, 40);
    }, delay);
    return () => { clearTimeout(timeout); if (interval) clearInterval(interval); };
  }, [text, delay]);

  return <span>{!isStarted ? <span className="opacity-0">{text}</span> : displayText}</span>;
};

// --- INTERFACES & VARIANTS ---
interface StickyNote {
  id: string;
  x: number;
  y: number;
  text: string;
  isEditing?: boolean;
  created_at?: string; 
}

const fadeUpVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const Home = () => {
  const [notes, setNotes] = useState<StickyNote[]>([]);
  const [myNotesCount, setMyNotesCount] = useState(0); 

  const fetchNotes = async () => {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { data, error } = await supabase
      .from('spatial_notes')
      .select('*')
      .gte('created_at', oneHourAgo); 

    if (!error && data) {
      setNotes(data);
    }
  };

  useEffect(() => {
    fetchNotes();

    const channel = supabase
      .channel('realtime_notes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'spatial_notes' }, () => {
        fetchNotes();
      })
      .subscribe();

    const cleanupInterval = setInterval(() => {
      const oneHourAgoMs = Date.now() - 60 * 60 * 1000;
      setNotes(prevNotes => prevNotes.filter(note => {
        if (!note.created_at) return true; 
        return new Date(note.created_at).getTime() > oneHourAgoMs;
      }));
    }, 60000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(cleanupInterval);
    };
  }, []);

  const handleDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button, a, input, textarea, .is-sticky-note, .no-spatial')) {
      return;
    }

    if (myNotesCount >= 5) {
      alert("Anti-Spam: Kamu sudah membuat maksimal 5 catatan di sesi ini. Terima kasih! 😊");
      return;
    }

    const newNote: StickyNote = {
      id: `temp-${Date.now()}`, 
      x: e.pageX,
      y: e.pageY,
      text: '',
      isEditing: true,
      created_at: new Date().toISOString(),
    };
    
    setNotes([...notes, newNote]);
    setMyNotesCount(prev => prev + 1);
  };

  const saveNote = async (id: string, newText: string, x: number, y: number) => {
    if (!newText.trim()) {
      setNotes(notes.filter(n => n.id !== id));
      setMyNotesCount(prev => prev - 1); 
      return;
    }

    if (id.startsWith('temp-')) {
      setNotes(notes.map(n => n.id === id ? { ...n, text: newText, isEditing: false } : n));
      const { error } = await supabase.from('spatial_notes').insert([{ text: newText, x, y }]);
      if (!error) fetchNotes(); 
    } else {
      setNotes(notes.map(n => n.id === id ? { ...n, text: newText, isEditing: false } : n));
      await supabase.from('spatial_notes').update({ text: newText }).eq('id', id);
    }
  };

  const handleDragEnd = async (id: string) => {
    if (id.startsWith('temp-')) return;
    const element = document.getElementById(`note-${id}`);
    if (element) {
      const rect = element.getBoundingClientRect();
      const newX = rect.left + window.scrollX + (rect.width / 2);
      const newY = rect.top + window.scrollY + (rect.height / 2);
      await supabase.from('spatial_notes').update({ x: newX, y: newY }).eq('id', id);
    }
  };

  const deleteNote = async (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
    if (!id.startsWith('temp-')) {
      await supabase.from('spatial_notes').delete().eq('id', id);
    }
  };

  return (
    <motion.div 
      initial="hidden" 
      animate="visible"
      // Latar Belakang Kanvas (Dot Grid)
      className="min-h-screen bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] flex flex-col relative overflow-hidden" 
      style={{ fontFamily: '"JetBrains Mono", monospace' }}
      onDoubleClick={handleDoubleClick} 
    >
      <div className="relative z-10 w-full no-spatial">
        <Navbar />
      </div>
      
      <main className="flex-grow box-border px-8 md:px-[120px] flex flex-col justify-center pt-20 pb-20 relative z-10">
        
        <motion.div variants={staggerContainer} className="relative z-10 max-w-4xl">
          {/* Badge Dekoratif Khas Brutalism */}
          <motion.div variants={fadeUpVariant} className="flex items-center gap-4 mb-4">
            <div className="px-3 py-1 bg-[#1d1d1d] text-white text-xs font-bold uppercase tracking-widest rounded-sm shadow-[2px_2px_0px_0px_#9ca3af]">
              Creative Developer
            </div>
          </motion.div>

          <motion.h1 
            variants={fadeUpVariant}
            className="text-5xl md:text-[72px] font-bold text-[#1d1d1d] leading-tight tracking-tight drop-shadow-md"
          >
            <DecryptedText text="Hello, Nice To Meet You!" delay={300} />
          </motion.h1>
          
          <motion.div 
            variants={fadeUpVariant} 
            className="mt-8 border-l-4 border-[#1d1d1d] pl-4 md:pl-6 bg-white py-4 shadow-sm"
          >
            <p className="text-gray-600 text-lg leading-relaxed">
              <TypewriterText text="I turn complex problems into pixel-perfect digital experiences. No fluff, just clean code and intuitive design." delay={1200} speed={25} />
            </p>
          </motion.div>

          {/* Kotak Instruksi Guestbook (Neo-Brutalism) */}
          <motion.div 
            variants={fadeUpVariant}
            className="no-spatial mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 px-6 py-4 bg-white border-2 border-[#1d1d1d] rounded-sm max-w-fit shadow-[4px_4px_0px_0px_#1d1d1d] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#1d1d1d]"
          >
            <div className="flex items-center justify-center p-2 bg-[#1d1d1d] rounded-sm shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <div className="text-sm font-mono text-gray-600 leading-relaxed">
              <strong className="text-[#1d1d1d] font-bold">Interactive Canvas</strong><br/>
              Double-click anywhere to leave a sticky note.
            </div>
          </motion.div>
        </motion.div>

      </main>

      {/* FOOTER & SOCIAL LINKS */}
      <div className="w-full flex flex-col justify-center items-center gap-6 pb-10 relative z-10 no-spatial">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5, duration: 0.6 }}
          className="flex gap-4"
        >
          {/* Ikon Sosial Media (Gaya Kotak Brutal) */}
          {[
            { link: "https://github.com/ferrysinaga", icon: <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path> },
            { link: "https://www.linkedin.com/in/ferrysinaga/", icon: <><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></> },
            { link: "https://www.instagram.com/ferrysinaga61/", icon: <><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></> }
          ].map((item, i) => (
            <a 
              key={i} href={item.link} target="_blank" rel="noreferrer" 
              className="p-3 bg-white border-2 border-[#1d1d1d] text-[#1d1d1d] rounded-sm shadow-[2px_2px_0px_0px_#1d1d1d] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {item.icon}
              </svg>
            </a>
          ))}
        </motion.div>
        
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3 }}>
          <ViewCounter />
        </motion.div>
      </div>

      {/* RENDER STICKY NOTES */}
      <AnimatePresence>
        {notes.map(note => (
          <motion.div
            key={note.id}
            id={`note-${note.id}`} 
            drag 
            dragMomentum={false}
            onDragEnd={() => handleDragEnd(note.id)}
            initial={{ scale: 0, rotate: Math.random() * 8 - 4 }} 
            animate={{ scale: 1 }}
            exit={{ scale: 0, opacity: 0 }} 
            // Shadow abu-abu agar notes hitam tetap menonjol di background putih
            className="is-sticky-note absolute z-50 p-4 shadow-[4px_4px_0px_0px_#9ca3af] flex flex-col cursor-grab active:cursor-grabbing rounded-sm"
            style={{ 
              left: note.x, 
              top: note.y, 
              x: "-50%", 
              y: "-50%",
              backgroundColor: '#1d1d1d', 
              border: '2px solid #374151', 
              width: '220px',
              minHeight: '120px'
            }}
          >
            <button 
              onClick={() => deleteNote(note.id)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xs font-bold transition-colors"
            >
              ✕
            </button>

            {note.isEditing ? (
              <textarea 
                autoFocus
                className="w-full h-full mt-4 bg-transparent outline-none resize-none text-gray-200 text-sm font-mono placeholder-gray-600"
                placeholder="Type your message..."
                onBlur={(e) => saveNote(note.id, e.target.value, note.x, note.y)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    e.currentTarget.blur();
                  }
                }}
              />
            ) : (
              <p 
                className="w-full h-full mt-4 text-gray-200 text-sm font-mono whitespace-pre-wrap cursor-text selection:bg-gray-700"
                onDoubleClick={() => setNotes(notes.map(n => n.id === note.id ? { ...n, isEditing: true } : n))}
              >
                {note.text}
              </p>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

    </motion.div> 
  );
};

export default Home;