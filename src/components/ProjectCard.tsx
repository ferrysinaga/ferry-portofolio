import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

// 1. Ini adalah "cetakan" data (Props). 
// Kita kasih tahu TypeScript data apa saja yang wajib diisi nanti.
export interface ProjectCardProps {
  title: string;
  description: string;
  imageUrl: string | string[];
  roles: string[]; // Peran dalam proyek
  tools: string[]; // Alat atau bahasa yang digunakan
  year: string;
  demoUrl?: string; // Tautan ke live demo (opsional)
  githubUrl?: string; // Tautan ke repositori (opsional)
  figmaUrl?: string; // Tautan ke Figma prototype (opsional)
}

const ProjectCard: React.FC<ProjectCardProps> = ({ title, description, imageUrl, roles, tools, year, demoUrl, githubUrl, figmaUrl }) => {
  // State untuk menyimpan indeks gambar yang sedang di-klik
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Normalisasi imageUrl menjadi array agar lebih mudah diproses
  const images = Array.isArray(imageUrl) ? imageUrl : [imageUrl];

  // Mencegah scroll pada halaman saat lightbox terbuka
  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedIndex]);

  return (
    // Container Utama: Pakai flexbox untuk memisahkan bagian Kiri dan Kanan. 
    // py-8 (padding atas bawah), border-b (garis bawah)
    <div className="flex flex-col md:flex-row justify-between items-start py-8 border-b border-gray-200 w-full">

      {/* --- BAGIAN KIRI: Judul, Deskripsi, dan Gambar --- */}
      <div className="flex flex-col gap-4 md:w-2/3">
        {/* Header: Judul dan Tahun */}
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h2>
          <span className="text-gray-500 text-lg pt-1">
            {year}
          </span>
        </div>
        
        {/* Deskripsi */}
        <p 
          className="text-gray-500 text-lg leading-relaxed"
        >
          {description}
        </p>
        
        {/* Gambar Thumbnail */}
        <div 
          className="relative w-full md:w-64 aspect-[3/4] mt-2 overflow-hidden rounded-sm cursor-pointer group"
          onClick={() => setSelectedIndex(0)}
        >
          <img 
            src={images[0]} 
            alt={`Preview of ${title}`} 
            loading="lazy"
            className="w-full h-full object-cover bg-gray-800 group-hover:scale-105 transition-transform duration-500" 
          />
          {images.length > 1 && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-12 flex justify-center items-end opacity-90 group-hover:opacity-100 transition-opacity">
              <span className="text-white text-[11px] font-bold tracking-wider border border-white/50 px-3 py-1.5 bg-black/40 rounded-sm backdrop-blur-sm group-hover:bg-white group-hover:text-black group-hover:border-white transition-colors duration-300">
                CLICK FOR VIEW MORE
              </span>
            </div>
          )}
        </div>

        {/* Tautan Proyek (Opsional) */}
        {(demoUrl || githubUrl || figmaUrl) && (
          <div className="flex items-center flex-wrap gap-4 mt-3">
            {figmaUrl && (
              <a href={figmaUrl} target="_blank" rel="noreferrer" className="text-sm font-bold text-[#1d1d1d] hover:text-blue-600 hover:underline underline-offset-4 transition-colors">↗ Figma Prototype</a>
            )}
            {demoUrl && (
              <a href={demoUrl} target="_blank" rel="noreferrer" className="text-sm font-bold text-[#1d1d1d] hover:text-blue-600 hover:underline underline-offset-4 transition-colors">↗ Live Demo</a>
            )}
            {githubUrl && (
              <a href={githubUrl} target="_blank" rel="noreferrer" className="text-sm font-bold text-gray-500 hover:text-[#1d1d1d] hover:underline underline-offset-4">↗ Github Repository</a>
            )}
          </div>
        )}
      </div>

      {/* --- BAGIAN KANAN: Roles dan Tools --- */}
      {/* md:mt-0 artinya margin-top hilang jika di layar laptop/desktop */}
      <div className="flex flex-col items-start md:items-end gap-3 mt-6 md:mt-0 md:w-1/3">
        
        {/* Kotak Roles (Prioritas: warna menonjol) */}
        <div className="flex flex-wrap items-center gap-2 md:justify-end">
          <span className="text-gray-500 text-sm mr-1">Role:</span>
          {roles.map((role, index) => (
            <span 
              key={`role-${index}`} 
              className="px-3 py-1 bg-[#1d1d1d] text-white text-sm rounded-sm"
            >
              {role}
            </span>
          ))}
        </div>

        {/* Kotak Tools (Sekunder: hanya garis pinggir) */}
        <div className="flex flex-wrap items-center gap-2 md:justify-end">
          <span className="text-gray-500 text-sm mr-1">Tools:</span>
          {tools.map((tool, index) => (
            <span 
              key={`tool-${index}`} 
              className="px-3 py-1 border border-gray-300 text-sm text-gray-700 rounded-sm"
            >
              {tool}
            </span>
          ))}
        </div>
      </div>

      {/* --- LIGHTBOX MODAL --- */}
      {selectedIndex !== null && createPortal(
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setSelectedIndex(null)} // Tutup jika area gelap diklik
        >
          {/* Gunakan animasi fade-in-up yang sudah kita buat sebelumnya di index.css */}
          <div className="relative max-w-5xl w-full max-h-full flex justify-center items-center animate-fade-in-up">
            <button 
              className="absolute -top-12 right-0 md:right-4 text-white hover:text-gray-300 focus:outline-none transition-colors"
              onClick={(e) => {
                e.stopPropagation(); // Mencegah klik tombol memicu onClick container
                setSelectedIndex(null);
              }}
              aria-label="Close lightbox"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            
            {/* Tombol Previous (Kiri) - Hanya muncul jika gambar > 1 */}
            {images.length > 1 && (
              <button
                className="absolute left-2 md:-left-16 p-2 bg-black/50 md:bg-transparent rounded-full text-white hover:text-gray-300 focus:outline-none transition-colors z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  // Jika di gambar pertama, kembali ke gambar terakhir. Jika tidak, mundur 1 langkah.
                  setSelectedIndex(selectedIndex === 0 ? images.length - 1 : selectedIndex - 1);
                }}
                aria-label="Previous image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
              </button>
            )}

            <img 
              src={images[selectedIndex]} 
              alt="Enlarged preview" 
              className="max-w-full max-h-[90vh] object-contain rounded-md shadow-2xl cursor-default" 
              onClick={(e) => e.stopPropagation()} // Mencegah gambar tertutup saat gambarnya sendiri yang diklik
            />

            {/* Tombol Next (Kanan) - Hanya muncul jika gambar > 1 */}
            {images.length > 1 && (
              <button
                className="absolute right-2 md:-right-16 p-2 bg-black/50 md:bg-transparent rounded-full text-white hover:text-gray-300 focus:outline-none transition-colors z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  // Jika di gambar terakhir, kembali ke gambar pertama. Jika tidak, maju 1 langkah.
                  setSelectedIndex(selectedIndex === images.length - 1 ? 0 : selectedIndex + 1);
                }}
                aria-label="Next image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </button>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default ProjectCard;