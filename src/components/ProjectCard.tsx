import React from 'react';

// 1. Ini adalah "cetakan" data (Props). 
// Kita kasih tahu TypeScript data apa saja yang wajib diisi nanti.
interface ProjectCardProps {
  title: string;
  description: string;
  imageUrl: string;
  roles: string[]; // Peran dalam proyek
  tools: string[]; // Alat atau bahasa yang digunakan
  year: string;
  demoUrl?: string; // Tautan ke live demo (opsional)
  githubUrl?: string; // Tautan ke repositori (opsional)
}

const ProjectCard: React.FC<ProjectCardProps> = ({ title, description, imageUrl, roles, tools, year, demoUrl, githubUrl }) => {
  return (
    // Container Utama: Pakai flexbox untuk memisahkan bagian Kiri dan Kanan. 
    // py-8 (padding atas bawah), border-b (garis bawah)
    <div className="flex flex-col md:flex-row justify-between items-start py-8 border-b border-gray-200 w-full">

      {/* --- BAGIAN KIRI: Judul, Deskripsi, dan Gambar --- */}
      <div className="flex flex-col gap-4 md:w-2/3">
        {/* Header: Judul dan Tahun */}
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h2>
          <span className="text-gray-500 font-mono text-lg pt-1">
            {year}
          </span>
        </div>
        
        {/* Deskripsi */}
        <p 
          className="text-gray-500 text-lg leading-relaxed"
          style={{ fontFamily: '"JetBrains Mono", monospace' }}
        >
          {description}
        </p>
        
        {/* Gambar Thumbnail */}
        <div className="w-full md:w-64 h-56 md:h-64 mt-2 overflow-hidden rounded-sm">
          <img 
            src={imageUrl} 
            alt={`Preview of ${title}`} 
            loading="lazy"
            className="w-full h-full object-cover bg-gray-800 hover:scale-105 transition-transform duration-500" 
          />
        </div>

        {/* Tautan Proyek (Opsional) */}
        {(demoUrl || githubUrl) && (
          <div className="flex items-center gap-4 mt-2" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
            {demoUrl && (
              <a href={demoUrl} target="_blank" rel="noreferrer" className="text-sm font-bold text-[#1d1d1d] hover:underline underline-offset-4">↗ Live Demo</a>
            )}
            {githubUrl && (
              <a href={githubUrl} target="_blank" rel="noreferrer" className="text-sm font-bold text-gray-500 hover:text-[#1d1d1d] hover:underline underline-offset-4">↗ Source Code</a>
            )}
          </div>
        )}
      </div>

      {/* --- BAGIAN KANAN: Roles dan Tools --- */}
      {/* md:mt-0 artinya margin-top hilang jika di layar laptop/desktop */}
      <div className="flex flex-col items-start md:items-end gap-3 mt-6 md:mt-0 md:w-1/3">
        
        {/* Kotak Roles (Prioritas: warna menonjol) */}
        <div className="flex flex-wrap items-center gap-2 md:justify-end">
          <span className="text-gray-500 text-sm font-mono mr-1">Role:</span>
          {roles.map((role, index) => (
            <span 
              key={`role-${index}`} 
              className="px-3 py-1 bg-[#1d1d1d] text-white text-sm font-mono rounded-sm"
            >
              {role}
            </span>
          ))}
        </div>

        {/* Kotak Tools (Sekunder: hanya garis pinggir) */}
        <div className="flex flex-wrap items-center gap-2 md:justify-end">
          <span className="text-gray-500 text-sm font-mono mr-1">Tools:</span>
          {tools.map((tool, index) => (
            <span 
              key={`tool-${index}`} 
              className="px-3 py-1 border border-gray-300 text-sm text-gray-700 font-mono rounded-sm"
            >
              {tool}
            </span>
          ))}
        </div>
      </div>

    </div>
  );
};

export default ProjectCard;