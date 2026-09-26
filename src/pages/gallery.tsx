import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import TypewriterText from '../components/TypewriterText';
import { motion } from 'framer-motion'; 
import { supabase } from '../../supabaseClient'; 

// Mendefinisikan tipe data Photo
interface Photo {
  id: string;
  image_url: string;
  description: string;
  likes?: number;
}

const Gallery = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State untuk menyimpan ID gambar yang sudah di-like di sesi ini
  const [likedPhotos, setLikedPhotos] = useState<Set<string>>(new Set());

  // State untuk Custom Tooltip
  const [hoveredDesc, setHoveredDesc] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const { data, error } = await supabase
          .from('gallery')
          .select('*')
          .order('id', { ascending: false }); 
        
        if (error) {
          console.error("Error fetching dari Supabase:", error);
        } else if (data) {
          setPhotos(data);
        }
      } catch (err) {
        console.error("Terjadi kesalahan:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGallery();
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  // --- FUNGSI UNTUK MENANGANI KLIK LIKE ---
  const handleLike = async (e: React.MouseEvent, id: string, currentLikes: number) => {
    e.stopPropagation(); // Mencegah bentrok dengan event hover gambar
    
    // Abaikan jika sudah di-like
    if (likedPhotos.has(id)) return;

    // 1. Optimistic Update (UI langsung bertambah 1 tanpa menunggu server)
    setPhotos(photos.map(p => p.id === id ? { ...p, likes: currentLikes + 1 } : p));
    setLikedPhotos(new Set(likedPhotos).add(id));

    // 2. Update data ke Supabase
    await supabase.from('gallery').update({ likes: currentLikes + 1 }).eq('id', id);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="min-h-screen bg-white relative overflow-hidden" 
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

        {isLoading ? (
          <div className="mt-20 flex justify-center py-10">
             <div className="text-[#1d1d1d] font-bold text-xl animate-pulse flex items-center">
               FETCHING_DATA_FROM_SUPABASE <span className="ml-1 text-2xl">...</span>
             </div>
          </div>
        ) : (
          <div className="mt-12 columns-1 sm:columns-2 md:columns-3 gap-4 md:gap-6 space-y-4 md:space-y-6">
            {photos.map((item) => (
              <div 
                key={item.id} 
                className="relative overflow-hidden rounded-sm group cursor-pointer bg-gray-100 break-inside-avoid shadow-sm"
                onMouseEnter={() => setHoveredDesc(item.description)}
                onMouseLeave={() => setHoveredDesc(null)}
                onMouseMove={handleMouseMove}
              >
                <img 
                  src={item.image_url} 
                  alt={item.description} 
                  loading="lazy"
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* --- TOMBOL LIKE (Muncul saat di-hover) --- */}
                <button 
                  onClick={(e) => handleLike(e, item.id, item.likes || 0)}
                  // 👇 Diperbesar: padding menjadi px-4 py-2, teks menjadi text-sm, dan ditambah efek hover:scale-105
                  className="absolute bottom-4 right-4 z-10 flex items-center gap-2.5 px-4 py-2 bg-black/60 hover:bg-black/90 backdrop-blur-md rounded-full text-sm font-mono text-white transition-all opacity-0 group-hover:opacity-100 group-hover:scale-105 active:scale-95 shadow-lg border border-white/10"
                >
                  <span className={`transition-colors text-base ${likedPhotos.has(item.id) ? 'text-red-500' : 'text-gray-300'}`}>
                    {likedPhotos.has(item.id) ? '❤️' : '🤍'}
                  </span>
                  <span>{item.likes || 0}</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {hoveredDesc && (
        <div 
          className="fixed z-50 pointer-events-none px-4 py-2 bg-black/70 backdrop-blur-md border border-white/10 text-white text-sm rounded-sm shadow-xl"
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