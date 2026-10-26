import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { supabase } from '../../supabaseClient'; 

type ProjectItem = {
  id: number;
  title: string;
  description: string;
  image_url: string;
  roles: string;
  tools: string;
  year: string;
  link?: string;
  github_url?: string;
  figma_url?: string;
};

// --- ANIMATION VARIANTS ---
const fadeUpVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export default function Projects() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      // Mengambil data proyek dan mengurutkannya dari tahun terbaru (descending)
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('year', { ascending: false });

      if (!error && data) {
        setProjects(data as ProjectItem[]);
      }
      setLoading(false);
    };

    fetchProjects();
  }, []);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-white"
      style={{ fontFamily: '"JetBrains Mono", monospace' }}
    >
      <div className="relative z-50">
        <Navbar />
      </div>

      <main className="box-border px-8 md:px-[120px] py-10 overflow-hidden max-w-7xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <motion.h1
            variants={fadeUpVariant}
            className="font-bold text-[#1d1d1d] text-5xl md:text-[64px] drop-shadow-md"
            style={{ letterSpacing: '0.25em' }}
          >
            PROJECTS
          </motion.h1>
          <motion.p variants={fadeUpVariant} className="text-gray-600 font-bold text-sm md:text-base">
            Showcase of my latest works & developments
          </motion.p>
        </div>

        {/* LOADING / EMPTY / GRID CONTENT */}
        {loading ? (
          <div className="p-8 text-[#1d1d1d] font-bold text-lg border-2 border-[#1d1d1d] bg-yellow-300 shadow-[4px_4px_0px_0px_#1d1d1d] inline-block">
            Loading projects...
          </div>
        ) : projects.length === 0 ? (
          <div className="p-8 text-[#1d1d1d] font-bold text-lg border-2 border-[#1d1d1d] bg-gray-100 shadow-[4px_4px_0px_0px_#1d1d1d]">
            No projects found.
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {projects.map((proj) => (
              <motion.div
                key={proj.id}
                variants={fadeUpVariant}
                className="bg-white border-4 border-[#1d1d1d] shadow-[6px_6px_0px_0px_#1d1d1d] flex flex-col justify-between overflow-hidden group hover:translate-x-[-3px] hover:translate-y-[-3px] hover:shadow-[9px_9px_0px_0px_#1d1d1d] transition-all"
              >
                <div>
                  {/* Image Preview */}
                  <div className="w-full h-56 border-b-4 border-[#1d1d1d] bg-gray-100 relative overflow-hidden">
                    {proj.image_url ? (
                      <img
                        src={proj.image_url}
                        alt={proj.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-gray-400">
                        NO IMAGE AVAILABLE
                      </div>
                    )}
                    <span className="absolute top-3 right-3 bg-yellow-300 text-[#1d1d1d] font-bold px-3 py-1 border-2 border-[#1d1d1d] shadow-[2px_2px_0px_0px_#1d1d1d] text-xs">
                      {proj.year}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-[#1d1d1d] mb-3">{proj.title}</h3>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="bg-gray-100 text-[#1d1d1d] border border-[#1d1d1d] px-2 py-0.5 text-xs font-bold">
                        Role: {proj.roles}
                      </span>
                      <span className="bg-blue-100 text-[#1d1d1d] border border-[#1d1d1d] px-2 py-0.5 text-xs font-bold">
                        Stack: {proj.tools}
                      </span>
                    </div>

                    <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line mb-6">
                      {proj.description}
                    </p>
                  </div>
                </div>

                {/* Action Links */}
                <div className="p-6 pt-4 border-t-2 border-dashed border-gray-200 mt-auto flex flex-wrap gap-3 items-center bg-gray-50">
                  {proj.link && (
                    <a
                      href={proj.link}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 bg-[#1d1d1d] text-white font-bold text-xs uppercase border-2 border-[#1d1d1d] shadow-[3px_3px_0px_0px_#e5e7eb] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                    >
                      Live Demo ↗
                    </a>
                  )}
                  {proj.github_url && (
                    <a
                      href={proj.github_url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 bg-white text-[#1d1d1d] font-bold text-xs uppercase border-2 border-[#1d1d1d] shadow-[3px_3px_0px_0px_#1d1d1d] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                    >
                      GitHub
                    </a>
                  )}
                  {proj.figma_url && (
                    <a
                      href={proj.figma_url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 bg-purple-100 text-[#1d1d1d] font-bold text-xs uppercase border-2 border-[#1d1d1d] shadow-[3px_3px_0px_0px_#1d1d1d] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                    >
                      Figma
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
    </motion.div>
  );
}