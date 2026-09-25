import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';

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
        .select('*', { count: 'exact', head: true }) // 'head: true' membuat query sangat ringan
        .eq('path', path);
        
      if (count !== null) setViews(count);
    };

    recordAndFetchViews();
  }, [path]);

  // Jika masih loading (0), jangan tampilkan apa-apa dulu
  if (views === 0) return null;

  return (
    <div 
      className="flex items-center gap-2 text-xs font-mono text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200 shadow-sm cursor-default hover:text-[#1d1d1d] hover:bg-white transition-all"
      title="Total pengunjung halaman ini"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </svg>
      {views.toLocaleString()} views
    </div>
  );
};

export default ViewCounter;