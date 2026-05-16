import { useState } from 'react';
import { certificateData } from '../data/aboutData';

const CertificateAccordion = () => {
  // Menyimpan index accordion mana yang sedang terbuka. null = tertutup semua
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="w-full font-sans bg-white" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
      {/* Table Header */}
      <div className="flex items-center justify-between pb-4 px-2 md:px-4 text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">
        <div className="w-1/2 md:w-1/3 pr-2">Title</div>
        <div className="w-1/4 hidden md:block">Issuer</div>
        <div className="w-1/6 hidden md:block">Category</div>
        <div className="w-1/4 md:w-1/6 text-right md:text-left">Year</div>
        <div className="w-8"></div>
      </div>

      {certificateData.map((cert, index) => {
        const isExpanded = expandedIndex === index;

        return (
          <div key={index} className="border-t-2 last:border-b-2 border-[#1d1d1d] text-[#1d1d1d]">
            
            {/* Header Bar */}
            <div 
              className="flex items-center justify-between py-4 px-2 md:px-4 cursor-pointer hover:bg-gray-100 transition-colors duration-200 text-xs md:text-sm font-bold"
              onClick={() => toggleExpand(index)}
            >
              <div className="w-1/2 md:w-1/3 pr-2">{cert.title}</div>
              <div className="w-1/4 hidden md:block">{cert.issuer}</div>
              <div className="w-1/6 hidden md:block">{cert.category}</div>
              <div className="w-1/4 md:w-1/6 text-right md:text-left">{cert.year}</div>
              <div className="w-8 flex justify-end text-2xl font-light">
                {isExpanded ? '×' : '+'}
              </div>
            </div>

            {/* Konten yang meluas (Expanded View) */}
            {isExpanded && (
              <div className="flex flex-col md:flex-row gap-6 md:gap-8 p-4 md:p-6 transition-all duration-300 ease-in-out border-t-2 border-dashed border-gray-200 bg-gray-50">
                {/* Bagian Kiri: Gambar Sertifikat */}
                <div className="w-full md:w-2/5 shrink-0">
                  <img 
                    src={cert.image} 
                    alt={cert.title}
                    className="w-full h-auto object-cover border-2 border-[#1d1d1d] shadow-[4px_4px_0px_0px_#1d1d1d]"
                  />
                </div>

                {/* Bagian Kanan: Detail Informasi */}
                <div className="w-full md:w-3/5 flex flex-col gap-4 text-sm leading-relaxed">

                  <div className="flex flex-col md:flex-row">
                    <span className="w-36 shrink-0 font-bold mb-1 md:mb-0 text-gray-500">Description:</span>
                    <p className="flex-1 font-medium">{cert.description}</p>
                  </div>

                  <div className="flex flex-col md:flex-row">
                    <span className="w-36 shrink-0 font-bold mb-1 md:mb-0 text-gray-500">Skills Covered:</span>
                    <p className="flex-1 font-medium">{cert.skillsCovered}</p>
                  </div>

                  <div className="flex flex-col md:flex-row items-start">
                    <span className="w-36 shrink-0 font-bold mb-1 md:mb-0 text-gray-500">Credential ID:</span>
                    <p className="flex-1 font-medium">{cert.credentialId}</p>
                  </div>
                  
                  {/* Tombol View Certificate */}
                  <div className="md:ml-36 mt-4">
                    <a 
                      href={cert.verifyLink} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-block border-2 border-[#1d1d1d] bg-white text-[#1d1d1d] font-bold px-6 py-2 shadow-[2px_2px_0px_0px_#1d1d1d] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-200"
                    >
                      Verify Certificate ➔
                    </a>
                  </div>

                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CertificateAccordion;