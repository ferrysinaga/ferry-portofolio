import Navbar from '../components/Navbar';
import TypewriterText from '../components/TypewriterText';
import ViewCounter from '../components/ViewCounter'; 
import DecryptedText from '../components/DecryptedText';
import StickyNoteItem from '../components/StickyNoteItem';
import { useStickyNotes } from '../hooks/useStickyNotes';
import { motion, AnimatePresence } from 'framer-motion'; 

// --- VARIANTS ---
// Fix TypeScript Error dengan menambahkan "as const"
const fadeUpVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const Home = () => {
  // Semua logika Supabase, state, dan fungsi aksi sudah diringkas di sini
  const { notes, setNotes, handleDoubleClick, saveNote, handleDragEnd, deleteNote } = useStickyNotes();

  return (
    <motion.div 
      initial="hidden" 
      animate="visible"
      className="min-h-screen bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] flex flex-col relative overflow-hidden" 
      style={{ fontFamily: '"JetBrains Mono", monospace' }}
      onDoubleClick={handleDoubleClick} 
    >
      <div className="relative z-10 w-full no-spatial">
        <Navbar />
      </div>
      
      <main className="flex-grow box-border px-8 md:px-[120px] flex flex-col justify-center pt-20 pb-20 relative z-10">
        <motion.div variants={staggerContainer} className="relative z-10 max-w-4xl">
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
          
          <motion.div variants={fadeUpVariant} className="mt-8 border-l-4 border-[#1d1d1d] pl-4 md:pl-6 bg-white py-4 shadow-sm">
            <p className="text-gray-600 text-lg leading-relaxed">
              <TypewriterText text="I turn complex problems into pixel-perfect digital experiences. No fluff, just clean code and intuitive design." delay={1200} speed={25} />
            </p>
          </motion.div>

          <motion.div variants={fadeUpVariant} className="no-spatial mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 px-6 py-4 bg-white border-2 border-[#1d1d1d] rounded-sm max-w-fit shadow-[4px_4px_0px_0px_#1d1d1d] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#1d1d1d]">
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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.5, duration: 0.6 }} className="flex gap-4">
          {[
            { link: "https://github.com/ferrysinaga", icon: <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path> },
            { link: "https://www.linkedin.com/in/ferrysinaga/", icon: <><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></> },
            { link: "https://www.instagram.com/ferrysinaga61/", icon: <><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></> }
          ].map((item, i) => (
            <a key={i} href={item.link} target="_blank" rel="noreferrer" className="p-3 bg-white border-2 border-[#1d1d1d] text-[#1d1d1d] rounded-sm shadow-[2px_2px_0px_0px_#1d1d1d] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{item.icon}</svg>
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
          <StickyNoteItem 
            key={note.id} 
            note={note} 
            saveNote={saveNote} 
            deleteNote={deleteNote} 
            handleDragEnd={handleDragEnd} 
            setNotes={setNotes} 
          />
        ))}
      </AnimatePresence>
    </motion.div> 
  );
};

export default Home;