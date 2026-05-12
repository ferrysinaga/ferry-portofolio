import { useState } from 'react';
import Navbar from '../components/Navbar';
import img1 from '../assets/gallery/img-1.jpg';
import img2 from '../assets/gallery/img-2.jpg';
import img3 from '../assets/gallery/img-3.jpg';

const Gallery = () => {
  // Data gambar sekarang berbentuk objek dengan URL dan deskripsi
  const dummyPhotos = [
    { src: img1, desc: "Jakarta MRT Commute" },
    { src: img2, desc: "Blooming Plumeria" },
    { src: img3, desc: "Urban Aesthetics" },
  ];

  // State untuk menyimpan teks deskripsi yang sedang di-hover dan koordinat mouse
  const [hoveredDesc, setHoveredDesc] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="box-border px-8 md:px-[120px] py-10 animate-fade-in-up">
        <h1 
          className="font-bold text-[#1d1d1d] text-5xl md:text-[64px] animate-floating drop-shadow-md"
          style={{ fontFamily: '"JetBrains Mono", monospace', letterSpacing: '0.25em' }}
        >
          GALLERY
        </h1>
        
        <p className="mt-4 text-gray-500 text-lg max-w-2xl leading-relaxed" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
          A showcase of my photography and visual captures. These are some moments I've collected.
        </p>

        {/* Grid Galeri (Masonry) */}
        <div className="mt-12 columns-1 sm:columns-2 md:columns-3 gap-4 md:gap-6 space-y-4 md:space-y-6">
          {dummyPhotos.map((item, index) => (
            <div 
              key={index} 
              className="relative overflow-hidden rounded-sm group cursor-pointer bg-gray-100 break-inside-avoid"
              onMouseEnter={() => setHoveredDesc(item.desc)}
              onMouseLeave={() => setHoveredDesc(null)}
              onMouseMove={handleMouseMove}
            >
              <img 
                src={item.src} 
                alt={item.desc} 
                loading="lazy"
                className="w-full h-auto object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
              />
            </div>
          ))}
        </div>
      </main>

      {/* --- CUSTOM TOOLTIP YANG MENGIKUTI KURSOR --- */}
      {hoveredDesc && (
        <div 
          className="fixed z-50 pointer-events-none px-4 py-2 bg-black/60 backdrop-blur-md border border-white/30 text-white font-mono text-sm rounded-sm shadow-xl"
          style={{
            left: `${mousePos.x + 16}px`, // 16px offset agar tooltip tidak menutupi ujung kursor
            top: `${mousePos.y + 16}px`,
          }}
        >
          {hoveredDesc}
        </div>
      )}
    </div>
  );
};

export default Gallery;