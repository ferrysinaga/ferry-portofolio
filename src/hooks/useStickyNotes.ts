import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient'; // Sesuaikan path jika perlu

export interface StickyNote {
  id: string;
  x: number;
  y: number;
  text: string;
  isEditing?: boolean;
  created_at?: string; 
}

export const useStickyNotes = () => {
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
    // Bungkus pemanggilan dalam fungsi async lokal
    const initFetch = async () => {
      await fetchNotes();
    };
    initFetch();

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

  return { notes, setNotes, handleDoubleClick, saveNote, handleDragEnd, deleteNote };
};