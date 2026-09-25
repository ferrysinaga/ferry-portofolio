import { useState } from 'react';
import Navbar from '../components/Navbar';
import TypewriterText from '../components/TypewriterText';
import { motion } from 'framer-motion'; // 👈 IMPORT FRAMER MOTION
import img1 from '../assets/gallery/img-1.jpg';
import img2 from '../assets/gallery/img-2.jpg';
import img3 from '../assets/gallery/img-3.jpg';
import img4 from '../assets/gallery/img-4.jpg';
import img5 from '../assets/gallery/img-5.jpg';
import img6 from '../assets/gallery/img-6.jpg';
import img7 from '../assets/gallery/img-7.jpg';
import img8 from '../assets/gallery/img-8.jpg';
import img9 from '../assets/gallery/img-9.jpg';
import img10 from '../assets/gallery/img-10.jpg';

const Gallery = () => {
  // Data gambar sekarang berbentuk objek dengan URL dan deskripsi
  const dummyPhotos = [
    { src: img1, desc: "Jakarta MRT Commute" },
    { src: img2, desc: "Blooming Plumeria" },
    { src: img3, desc: "Urban Aesthetics" },
    { src: img4, desc: "Ancol Beach Sunset" },
    { src: img5, desc: "Silver Spike" },
    { src: img6, desc: "An elderly man is sleeping in the afternoon." },
    { src: img7, desc: "Softball View" },
    { src: img8, desc: "A Mujair Cat" },
    { src: img9, desc: "Bandung morning" },
    { src: img10, desc: "What a view" }
  ];

  // State untuk menyimpan teks deskripsi yang sedang di-hover dan koordinat mouse
  const [hoveredDesc, setHoveredDesc] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  return (
    // 👇 UBAH JADI motion.div
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
              {/* Tambahan efek hover scale ringan pada gambar */}
              <img 
                src={item.src} 
                alt={item.desc} 
                loading="lazy"
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
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
    </motion.div> // 👈 TUTUPNYA JUGA BERUBAH
  );
};

export default Gallery;