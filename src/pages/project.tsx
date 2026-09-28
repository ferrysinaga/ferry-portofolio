import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ProjectAccordion from '../components/ProjectAccordion';
import type { ProjectItemProps } from '../components/ProjectAccordion';
import TypewriterText from '../components/TypewriterText';
import { motion, type Variants } from 'framer-motion';
import { supabase } from '../../supabaseClient';

const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const Project = () => {
  const [projects, setProjects] = useState<ProjectItemProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error: supabaseError } = await supabase
          .from('projects')
          .select('*')
          .order('id', { ascending: false });

        if (supabaseError) throw supabaseError;

        if (data) {
          // ✅ Map data Supabase ke struktur yang dibutuhkan ProjectAccordion
          const formattedProjects: ProjectItemProps[] = data.map((item) => ({
            title: item.title ?? 'Untitled',
            description: item.description ?? '',
            imageUrl: item.image_url ?? '',
            // roles & tools disimpan sebagai JSON string di Supabase, parse dengan fallback
            roles: (() => {
              try { return JSON.parse(item.roles || '[]'); }
              catch { return item.roles ? [item.roles] : ['Developer']; }
            })(),
            tools: (() => {
              try { return JSON.parse(item.tools || '[]'); }
              catch { return item.tools ? [item.tools] : []; }
            })(),
            year: item.year ?? String(new Date().getFullYear()),
            demoUrl: item.link || undefined,
            githubUrl: item.github_url || undefined,
            figmaUrl: item.figma_url || undefined,
          }));
          setProjects(formattedProjects);
        }
      } catch (err: unknown) {
        console.error('Error fetching projects:', err);
        setError(err instanceof Error ? err.message : 'Gagal memuat data project.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="min-h-screen"
      style={{ fontFamily: '"JetBrains Mono", monospace' }}
    >
      <div className="relative z-50">
        <Navbar />
      </div>

      <main className="box-border px-8 md:px-[120px] py-10 overflow-hidden">

        <motion.div variants={staggerContainer} className="relative z-10">
          <motion.div variants={fadeUpVariant} className="flex items-center gap-4 mb-4">
            <div className="px-3 py-1 bg-[#1d1d1d] text-white text-xs font-bold uppercase tracking-widest rounded-sm shadow-[2px_2px_0px_0px_#9ca3af]">
              Portfolio
            </div>
          </motion.div>

          <motion.h1
            variants={fadeUpVariant}
            className="font-bold text-[#1d1d1d] text-5xl md:text-[64px] drop-shadow-md"
            style={{ letterSpacing: '0.25em' }}
          >
            PROJECTS
          </motion.h1>

          <motion.div
            variants={fadeUpVariant}
            className="mt-8 border-l-4 border-[#1d1d1d] pl-4 md:pl-6 bg-gray-50 py-4 max-w-3xl"
          >
            <p className="text-gray-600 text-lg leading-relaxed">
              <TypewriterText
                text="A showcase of my recent work in UI/UX Design and Web Development. Bringing ideas to life through intuitive design and robust code."
                delay={300}
                speed={25}
              />
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-20 w-full pb-10"
        >
          <motion.div variants={fadeUpVariant} className="flex items-center gap-6 mb-10">
            <h2 className="text-3xl font-bold text-[#1d1d1d] shrink-0">Selected Works</h2>
            <div className="h-1 w-full bg-gray-100 border-b-2 border-dashed border-gray-300"></div>
          </motion.div>

          <motion.div variants={fadeUpVariant} className="w-full">
            {loading ? (
              <div className="flex flex-col gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-full h-16 bg-gray-100 rounded-md animate-pulse border-2 border-gray-200" />
                ))}
              </div>
            ) : error ? (
              <div className="py-8 px-6 border-2 border-red-200 bg-red-50 rounded-md">
                <p className="text-red-600 font-bold">⚠️ Gagal memuat project.</p>
                <p className="text-red-400 text-sm mt-1 font-mono">{error}</p>
              </div>
            ) : projects.length > 0 ? (
              <ProjectAccordion projects={projects} />
            ) : (
              <p className="text-gray-500 italic py-10">
                Belum ada project. Tambahkan melalui Admin Dashboard.
              </p>
            )}
          </motion.div>
        </motion.div>

      </main>
    </motion.div>
  );
};

export default Project;