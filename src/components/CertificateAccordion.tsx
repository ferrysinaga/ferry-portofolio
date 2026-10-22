import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from "../../supabaseClient";

// Definisi tipe data sesuai database
type Certificate = {
  id: number;
  title: string;
  issuer: string;
  date: string;
  image_url: string;
  credential_id?: string;
};

const CertificateAccordion = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  // Mengambil data dari Supabase
  useEffect(() => {
    const fetchCertificates = async () => {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .order('id', { ascending: false });

      if (data && !error) {
        setCertificates(data);
      }
      setLoading(false);
    };

    fetchCertificates();
  }, []);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  if (loading) {
    return <div className="text-gray-500 font-medium">Loading certificates...</div>;
  }

  if (certificates.length === 0) {
    return <div className="text-gray-500 font-medium">No certificates available yet.</div>;
  }

  return (
    <div className="w-full flex flex-col gap-4">
      {certificates.map((cert, index) => {
        const isActive = activeIndex === index;

        return (
          <div 
            key={cert.id} 
            className="border-2 border-[#1d1d1d] bg-white shadow-[4px_4px_0px_0px_#1d1d1d] rounded-sm overflow-hidden transition-all"
          >
            {/* Header Accordion */}
            <button
              onClick={() => toggleAccordion(index)}
              className="w-full flex items-center justify-between p-4 md:p-6 bg-white hover:bg-gray-50 transition-colors text-left"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
                <h3 className="text-lg md:text-xl font-bold text-[#1d1d1d]">
                  {cert.title}
                </h3>
                <span className="hidden md:block text-gray-300">|</span>
                <p className="text-sm font-medium text-gray-600">
                  {cert.issuer}
                </p>
              </div>
              <div className="shrink-0 ml-4">
                <motion.div
                  animate={{ rotate: isActive ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <svg className="w-6 h-6 text-[#1d1d1d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.div>
              </div>
            </button>

            {/* Konten Accordion (Animasi Buka/Tutup) */}
            <AnimatePresence>
              {isActive && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden border-t-2 border-dashed border-gray-200"
                >
                  <div className="p-4 md:p-6 bg-gray-50 flex flex-col md:flex-row gap-6 items-start">
                    {/* Gambar Sertifikat */}
                    <div className="w-full md:w-1/3 shrink-0 border-2 border-[#1d1d1d] p-1 bg-white shadow-[2px_2px_0px_0px_#1d1d1d]">
                      <img 
                        src={cert.image_url} 
                        alt={cert.title} 
                        className="w-full h-auto object-cover"
                      />
                    </div>

                    {/* Detail Informasi */}
                    <div className="flex-1 flex flex-col gap-3">
                      <div>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Date</p>
                        <p className="text-[#1d1d1d] font-medium">{cert.date}</p>
                      </div>
                      
                      {cert.credential_id && (
                        <div>
                          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Credential ID</p>
                          <p className="text-[#1d1d1d] font-mono text-sm bg-gray-200 px-2 py-1 rounded inline-block">
                            {cert.credential_id}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

export default CertificateAccordion;