import Navbar from '../components/Navbar';
import ProjectAccordion from '../components/ProjectAccordion';
import { projectData } from '../data/projectData';
import TypewriterText from '../components/TypewriterText';
import { motion } from 'framer-motion';

// --- ANIMATION VARIANTS ---
const fadeUpVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const Project = () => {
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

      <main className="box-border px-8 md:px-[120px] py-10 overflow-hidden">
        
        <motion.div variants={staggerContainer} className="relative z-10">
          
          {/* Badge Dekoratif Kecil */}
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
          
          {/* Teks Deskripsi dibungkus kotak highlight ala brutalism */}
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

        {/* BAGIAN LIST PROJECT */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-20 w-full pb-10"
        >
          {/* Header Section dengan garis putus-putus */}
          <motion.div variants={fadeUpVariant} className="flex items-center gap-6 mb-10">
            <h2 className="text-3xl font-bold text-[#1d1d1d] shrink-0">Selected Works</h2>
            <div className="h-1 w-full bg-gray-100 border-b-2 border-dashed border-gray-300"></div>
          </motion.div>

          <motion.div variants={fadeUpVariant} className="w-full">
            <ProjectAccordion projects={projectData} />
          </motion.div>
        </motion.div>

      </main>
    </motion.div>
  );
};

export default Project;