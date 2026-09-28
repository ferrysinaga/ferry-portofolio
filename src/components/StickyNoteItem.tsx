import { motion } from 'framer-motion';
import type { StickyNote } from '../hooks/useStickyNotes';

interface StickyNoteItemProps {
  note: StickyNote;
  saveNote: (id: string, newText: string, x: number, y: number) => void;
  deleteNote: (id: string) => void;
  handleDragEnd: (id: string) => void;
  setNotes: React.Dispatch<React.SetStateAction<StickyNote[]>>;
}

// Palet warna cerah khas Neo-Brutalism
const BRUTALIST_COLORS = [
  '#FFD93D', // Kuning
  '#FF84E8', // Pink
  '#4DEEEA', // Cyan
  '#74EE15', // Hijau Neon
  '#FFAE03', // Oranye
];

const StickyNoteItem = ({ note, saveNote, deleteNote, handleDragEnd, setNotes }: StickyNoteItemProps) => {
  // Menentukan warna berdasarkan karakter ID agar hasilnya "acak" namun konsisten di setiap render
  const colorIndex = note.id.charCodeAt(note.id.length - 1) % BRUTALIST_COLORS.length;
  const noteColor = BRUTALIST_COLORS[colorIndex];

  return (
    <motion.div
      id={`note-${note.id}`} 
      drag 
      dragMomentum={false}
      onDragEnd={() => handleDragEnd(note.id)}
      initial={{ scale: 0, rotate: (note.id.charCodeAt(note.id.length - 2) % 8) - 4 }} 
      animate={{ scale: 1 }}
      exit={{ scale: 0, opacity: 0 }} 
      // Hapus bg-[warna] dari Tailwind karena kita menggunakan inline style untuk dinamisasi
      className="is-sticky-note absolute z-50 p-3 flex flex-col cursor-grab active:cursor-grabbing border-[2px] border-[#1d1d1d] shadow-[5px_5px_0px_0px_#1d1d1d] active:shadow-[2px_2px_0px_0px_#1d1d1d] transition-[box-shadow] duration-200"
      style={{ 
        left: note.x, 
        top: note.y, 
        x: "-50%", 
        y: "-50%",
        width: '180px', 
        minHeight: '120px',
        backgroundColor: noteColor // Terapkan warna dinamis di sini
      }}
    >
      <button 
        onClick={() => deleteNote(note.id)}
        className="absolute -top-3 -right-3 w-6 h-6 flex items-center justify-center bg-white border-[2px] border-[#1d1d1d] text-[#1d1d1d] font-black text-xs shadow-[3px_3px_0px_0px_#1d1d1d] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_#1d1d1d] transition-all z-10"
      >
        ✕
      </button>

      {note.isEditing ? (
        <textarea 
          autoFocus
          className="w-full h-full bg-transparent outline-none resize-none text-[#1d1d1d] text-sm font-bold font-mono placeholder-[#1d1d1d]/50 selection:bg-[#1d1d1d] selection:text-white"
          placeholder="TYPE HERE..."
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
          className="w-full h-full text-[#1d1d1d] text-sm font-bold font-mono whitespace-pre-wrap cursor-text selection:bg-[#1d1d1d] selection:text-white"
          onDoubleClick={() => setNotes(prev => prev.map(n => n.id === note.id ? { ...n, isEditing: true } : n))}
        >
          {note.text}
        </p>
      )}
    </motion.div>
  );
};

export default StickyNoteItem;