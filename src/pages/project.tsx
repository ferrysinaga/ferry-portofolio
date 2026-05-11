import Navbar from '../components/Navbar';
import ProjectCard from '../components/ProjectCard';

const Project = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Memanggil komponen Navbar */}
      <Navbar />

      {/* Konten halaman Project */}
      <main className="box-border px-8 md:px-[120px] py-10">
        <h1 
          className="font-bold text-[#1d1d1d] text-5xl md:text-[64px]"
          style={{ fontFamily: '"JetBrains Mono", monospace', letterSpacing: '0.25em' }}
        >
          PROJECT
        </h1>
        
        <p className="mt-4 text-gray-500 text-lg max-w-2xl leading-relaxed" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
          A showcase of my recent work in UI/UX Design and Web Development. Bringing ideas to life through intuitive design and robust code.
        </p>

        <div className="mt-12 flex flex-col gap-8">
          <ProjectCard 
            title="Mie Gacoan Mobile App Design"
            description="This design was created based on the problem we identified, where Mie Gacoan did not yet have an application that allowed direct ordering via mobile devices and still relied on cashier transactions."
            imageUrl="https://placehold.co/256x256/1d1d1d/white?text=Mie+Gacoan"
            roles={["UI/UX Design"]}
            tools={["Figma"]}
            year="2024"
          />
          <ProjectCard 
            title="EduChamp App Design"
            description="This design was created by combining Duolingo and Quizziz, and within the website we developed, there is a gamification-based learning feature."
            imageUrl="https://placehold.co/256x256/1d1d1d/white?text=EduChamp"
            roles={["UI/UX Design"]}
            tools={["Figma", "Visual Code Studio", "Notion"]}
            year="2024"
          />
          <ProjectCard 
            title="SemaraLab Company Profile"
            description="Web company profile for the digital and creative marketing agency, “Semara Lab”. This project has a public section (frontend) to display services and portfolios, as well as an admin panel (backend) for content management."
            imageUrl="https://placehold.co/256x256/1d1d1d/white?text=SemaraLab"
            roles={["Full-Stack", "UI/UX Design"]}
            tools={["PHP", "HTML", "CSS", "Javascript"]}
            year="2024"
          />
          <ProjectCard 
            title="KATH Event Organizer Company Profile & Event Dashboard(On Going)"
            description="Kath Event Organizer is a company profile website created with the purpose of serving as a registration platform for a business idea competition. This platform combines the company's professional identity with a practical digital registration system."
            imageUrl="https://placehold.co/256x256/1d1d1d/white?text=KATH+Event"
            roles={["UI/UX Design", "Front-End"]}
            tools={["React", "Tailwind CSS", "Next.Js", "Git", "Github", "Figma"]}
            year="2024"
          />
        </div>
      </main>
    </div>
  );
};

export default Project;