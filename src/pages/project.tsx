import Navbar from '../components/Navbar';
import ProjectAccordion from '../components/ProjectAccordion';
import { projectData } from '../data/projectData';
import TypewriterText from '../components/TypewriterText';
import { motion } from 'framer-motion'; // 👈 IMPORT FRAMER MOTION

const Project = () => {
  return (
    // 👇 UBAH JADI motion.div
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="min-h-screen bg-white" 
      style={{ fontFamily: '"JetBrains Mono", monospace' }}
    >
      {/* Memanggil komponen Navbar */}
      <Navbar />

      {/* Konten halaman Project */}
      <main className="box-border px-8 md:px-[120px] py-10 animate-fade-in-up">
        <h1 
          className="font-bold text-[#1d1d1d] text-5xl md:text-[64px] animate-floating drop-shadow-md"
          style={{ letterSpacing: '0.25em' }}
        >
          PROJECT
        </h1>
        
        <p className="mt-4 text-gray-500 text-lg max-w-2xl leading-relaxed">
          <TypewriterText text="A showcase of my recent work in UI/UX Design and Web Development. Bringing ideas to life through intuitive design and robust code." delay={300} speed={25} />
        </p>

        <div className="mt-12 w-full pb-10">
          <ProjectAccordion projects={projectData} />
        </div>
      </main>
    </motion.div> // 👈 TUTUPNYA JUGA BERUBAH
  );
};

export default Project;