import { motion } from 'framer-motion';
import type { StickyNote } from '../hooks/useStickyNotes';

interface StickyNoteItemProps {
  note: StickyNote;
  saveNote: (id: string, newText: string, x: number, y: number) => void;
  deleteNote: (id: string) => void;
  handleDragEnd: (id: string) => void;
  setNotes: React.Dispatch<React.SetStateAction<StickyNote[]>>;
}

const StickyNoteItem = ({ note, saveNote, deleteNote, handleDragEnd, setNotes }: StickyNoteItemProps) => {
  return (
    <motion.div
      id={`note-${note.id}`} 
      drag 
      dragMomentum={false}
      onDragEnd={() => handleDragEnd(note.id)}
      // Fix React Purity Error
      initial={{ scale: 0, rotate: (note.id.charCodeAt(note.id.length - 1) % 8) - 4 }} 
      animate={{ scale: 1 }}
      exit={{ scale: 0, opacity: 0 }} 
      className="is-sticky-note absolute z-50 p-4 shadow-[4px_4px_0px_0px_#9ca3af] flex flex-col cursor-grab active:cursor-grabbing rounded-sm"
      style={{ 
        left: note.x, top: note.y, x: "-50%", y: "-50%",
        backgroundColor: '#1d1d1d', border: '2px solid #374151', width: '220px', minHeight: '120px'
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
          onDoubleClick={() => setNotes(prev => prev.map(n => n.id === note.id ? { ...n, isEditing: true } : n))}
        >
          {note.text}
        </p>
      )}
    </motion.div>
  );
};

export default StickyNoteItem;