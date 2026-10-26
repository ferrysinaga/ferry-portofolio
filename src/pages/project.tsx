import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ProjectAccordion, { type ProjectItemProps } from '../components/ProjectAccordion';
import { motion } from 'framer-motion';
import { supabase } from '../../supabaseClient';

type ProjectRow = {
  id: number;
  title: string;
  description: string;
  image_url: string | null;
  roles: string;
  tools: string;
  year: string;
  link: string | null;
  github_url: string | null;
  figma_url: string | null;
};

const parseList = (value: string): string[] => {
  try {
    const parsed: unknown = JSON.parse(value);
    if (Array.isArray(parsed) && parsed.every((item): item is string => typeof item === 'string')) {
      return parsed;
    }
  } catch {
    // Existing rows may store roles and tools as comma-separated text.
  }

  return value.split(',').map(item => item.trim()).filter(Boolean);
};

const fadeUpVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } }
};

export default function Projects() {
  const [projects, setProjects] = useState<ProjectItemProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('year', { ascending: false });

      if (!active) return;

      if (error) {
        setFetchError(error.message);
      } else {
        setProjects(((data ?? []) as ProjectRow[]).map(project => ({
          title: project.title,
          description: project.description,
          imageUrl: project.image_url ?? '',
          roles: parseList(project.roles),
          tools: parseList(project.tools),
          year: project.year,
          demoUrl: project.link ?? undefined,
          githubUrl: project.github_url ?? undefined,
          figmaUrl: project.figma_url ?? undefined
        })));
      }

      setLoading(false);
    };

    void fetchProjects();
    return () => {
      active = false;
    };
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
        <div className="mb-12">
          <motion.h1
            variants={fadeUpVariant}
            className="font-bold text-[#1d1d1d] text-5xl md:text-[64px] drop-shadow-md"
            style={{ letterSpacing: '0.25em' }}
          >
            PROJECTS
          </motion.h1>
          <motion.p variants={fadeUpVariant} className="mt-4 text-gray-500 text-lg max-w-2xl leading-relaxed">
            Showcase of my latest works & developments
          </motion.p>
        </div>

        {loading ? (
          <div className="p-8 text-[#1d1d1d] font-bold text-lg border-2 border-[#1d1d1d] bg-yellow-300 shadow-[4px_4px_0px_0px_#1d1d1d] inline-block">
            Loading projects...
          </div>
        ) : fetchError ? (
          <div role="alert" className="p-8 text-[#1d1d1d] font-bold text-lg border-2 border-[#1d1d1d] bg-red-100 shadow-[4px_4px_0px_0px_#1d1d1d]">
            Unable to load projects: {fetchError}
          </div>
        ) : projects.length === 0 ? (
          <div className="p-8 text-[#1d1d1d] font-bold text-lg border-2 border-[#1d1d1d] bg-gray-100 shadow-[4px_4px_0px_0px_#1d1d1d]">
            No projects found.
          </div>
        ) : (
          <motion.div variants={fadeUpVariant} initial="hidden" animate="visible" className="w-full">
            <ProjectAccordion projects={projects} />
          </motion.div>
        )}
      </main>
    </motion.div>
  );
}
