import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import TypewriterText from '../components/TypewriterText';
import { motion } from 'framer-motion'; 

// 👇 KITA IMPORT FILE SUPABASE ANDA
import { supabase } from '../../supabaseClient'; 
// Asumsi: supabaseClient.ts ada di luar folder src (di root folder)
// Jika supabaseClient.ts ada di DALAM folder src, ubah menjadi: '../supabaseClient'

const Gallery = () => {
  // 1. State untuk menyimpan data dari database Supabase
  const [photos, setPhotos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State untuk menyimpan teks deskripsi (Tooltip)
  const [hoveredDesc, setHoveredDesc] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // 2. Mengambil data dari Supabase secara otomatis saat halaman dibuka
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        // Mengambil semua data dari tabel 'gallery', diurutkan dari yang terbaru
        const { data, error } = await supabase
          .from('gallery')
          .select('*')
          .order('id', { ascending: false }); 
        
        if (error) {
          console.error("Error fetching dari Supabase:", error);
        } else if (data) {
          setPhotos(data); // Memasukkan data ke state
        }
      } catch (err) {
        console.error("Terjadi kesalahan:", err);
      } finally {
        // Matikan animasi loading setelah data selesai ditarik (atau gagal)
        setIsLoading(false);
      }
    };

    fetchGallery();
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="min-h-screen bg-white relative" 
      style={{ fontFamily: '"JetBrains Mono", monospace' }}
    >
      <Navbar />
      
      <main className="box-border px-8 md:px-[120px] py-10 animate-fade-in-up">
        <h1 
          className="font-bold text-[#1d1d1d] text-5xl md:text-[64px] animate-floating drop-shadow-md"
          style={{ letterSpacing: '0.25em' }}
        >
          GALLERY
        </h1>
        
        <p className="mt-4 text-gray-500 text-lg max-w-2xl leading-relaxed">
          <TypewriterText text="A showcase of my photography and visual captures. These are some moments I've collected." delay={300} speed={25} />
        </p>

        {/* 3. Tampilkan Loading ala Terminal jika data masih ditarik */}
        {isLoading ? (
          <div className="mt-20 flex justify-center py-10">
             <div className="text-[#1d1d1d] font-bold text-xl animate-pulse flex items-center">
               FETCHING_DATA_FROM_SUPABASE <span className="ml-1 text-2xl">...</span>
             </div>
          </div>
        ) : (
          /* Grid Galeri akan muncul otomatis sesuai jumlah baris di Database Anda */
          <div className="mt-12 columns-1 sm:columns-2 md:columns-3 gap-4 md:gap-6 space-y-4 md:space-y-6">
            {photos.map((item) => (
              <div 
                key={item.id} 
                className="relative overflow-hidden rounded-sm group cursor-pointer bg-gray-100 break-inside-avoid"
                // Asumsi nama kolom di Supabase adalah 'description'
                onMouseEnter={() => setHoveredDesc(item.description)}
                onMouseLeave={() => setHoveredDesc(null)}
                onMouseMove={handleMouseMove}
              >
                <img 
                  // Asumsi nama kolom di Supabase adalah 'image_url'
                  src={item.image_url} 
                  alt={item.description} 
                  loading="lazy"
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* --- CUSTOM TOOLTIP YANG MENGIKUTI KURSOR --- */}
      {hoveredDesc && (
        <div 
          className="fixed z-50 pointer-events-none px-4 py-2 bg-black/60 backdrop-blur-md border border-white/30 text-white text-sm rounded-sm shadow-xl"
          style={{
            left: `${mousePos.x + 16}px`, 
            top: `${mousePos.y + 16}px`,
          }}
        >
          {hoveredDesc}
        </div>
      )}
    </motion.div>
  );
};

export default Gallery;