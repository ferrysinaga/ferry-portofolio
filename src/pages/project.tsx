import Navbar from '../components/Navbar';
import ProjectCard from '../components/ProjectCard';
import { projectData } from '../data/projectData';
import TypewriterText from '../components/TypewriterText';

const Project = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Memanggil komponen Navbar */}
      <Navbar />

      {/* Konten halaman Project */}
      <main className="box-border px-8 md:px-[120px] py-10 animate-fade-in-up">
        <h1 
          className="font-bold text-[#1d1d1d] text-5xl md:text-[64px] animate-floating drop-shadow-md"
          style={{ fontFamily: '"JetBrains Mono", monospace', letterSpacing: '0.25em' }}
        >
          PROJECT
        </h1>
        
        <p className="mt-4 text-gray-500 text-lg max-w-2xl leading-relaxed" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
          <TypewriterText text="A showcase of my recent work in UI/UX Design and Web Development. Bringing ideas to life through intuitive design and robust code." delay={300} speed={25} />
        </p>

        <div className="mt-12 flex flex-col gap-8">
          {projectData.map((project, index) => (
            <ProjectCard key={index} {...project} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Project;