import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { motion } from 'framer-motion'; // 👈 Tambahan Framer Motion

const ViewCounter = ({ path = '/home' }: { path?: string }) => {
  const [views, setViews] = useState<number>(0);

  useEffect(() => {
    const recordAndFetchViews = async () => {
      // 1. Rekam kunjungan baru (Jika pengunjung belum pernah membuka tab ini)
      const hasVisited = sessionStorage.getItem(`visited_${path}`);
      
      if (!hasVisited) {
        await supabase.from('page_views').insert([{ path }]);
        sessionStorage.setItem(`visited_${path}`, 'true');
      }
      
      // 2. Tarik total angka kunjungan dengan sangat cepat (Tanpa mendownload datanya)
      const { count } = await supabase
        .from('page_views')
        .select('*', { count: 'exact', head: true }) 
        .eq('path', path);
        
      if (count !== null) setViews(count);
    };

    recordAndFetchViews();
  }, [path]);

  // Jika masih loading (0), jangan tampilkan apa-apa dulu
  if (views === 0) return null;

  return (
    // 👇 Ubah div menjadi motion.div beserta gaya Neo-Brutalism
    <motion.div 
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className="flex items-center gap-2 text-xs md:text-sm font-mono font-bold text-[#1d1d1d] bg-white px-3 py-1.5 md:px-4 md:py-2 rounded-sm border-2 border-[#1d1d1d] shadow-[3px_3px_0px_0px_#1d1d1d] cursor-default hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all"
      title="Total pengunjung halaman ini"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </svg>
      {views.toLocaleString()} VIEWS
    </motion.div>
  );
};

export default ViewCounter;