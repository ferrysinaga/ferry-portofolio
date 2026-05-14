import Navbar from '../components/Navbar';
import profileImg from '../assets/foto-profil/foto-profil-1.png';
import cvFile from '../assets/CV_Ferry-Firmando.pdf';
import TimelineItem from '../components/TimelineItem';
import { experienceData, educationData, tools, interests } from '../data/aboutData';

const About = () => {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
      {/* Memanggil komponen Navbar */}
      <Navbar />

      {/* Konten halaman About */}
      <main className="box-border px-8 md:px-[120px] py-10 animate-fade-in-up">
        <h1 
          className="font-bold text-[#1d1d1d] text-5xl md:text-[64px] animate-floating drop-shadow-md"
          style={{ letterSpacing: '0.25em' }}
        >
          ABOUT
        </h1>
        
        <div className="mt-12 flex flex-col md:flex-row gap-16 items-start">
          {/* Bagian Teks (Kiri) */}
          <div className="flex flex-col gap-8 md:w-3/5 max-w-3xl">
            <p 
              className="text-gray-600 text-lg leading-relaxed"
            >
              Hello! I am a passionate UI/UX Designer and Web Developer with a strong foundation in Computer Science. I specialize in bridging the gap between aesthetic design and robust technology.
            </p>
            
            <p 
              className="text-gray-600 text-lg leading-relaxed"
            >
              My journey in the tech world has driven me to continuously learn and adapt, allowing me to craft digital experiences that are not only visually appealing but also highly intuitive and functional.
            </p>

            <p 
              className="text-gray-600 text-lg leading-relaxed"
            >
              Throughout my academic and professional projects, I have developed a keen eye for user-centric design and a logical approach to problem-solving. Whether it is designing a seamless mobile application interface in Figma or building a responsive front-end using React and Tailwind CSS, I thrive on turning complex problems into elegant, user-friendly solutions.
            </p>

            <div className="mt-6">
              <h2 className="text-2xl font-bold text-[#1d1d1d] mb-6">Tools</h2>
              <div className="flex flex-wrap gap-2 md:gap-3">
                {tools.map((tool, index) => (
                  <span key={`tool-${index}`} className="group flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-white border-2 border-[#1d1d1d] text-[#1d1d1d] font-bold text-xs md:text-sm rounded-sm shadow-[2px_2px_0px_0px_#1d1d1d] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all cursor-default">
                    <img src={tool.icon} alt={tool.name} className="w-4 h-4 md:w-5 md:h-5 object-contain" />
                    {tool.name}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-[#1d1d1d] mb-6">Interests & Hobbies</h2>
              <div className="flex flex-wrap gap-2 md:gap-3">
                {interests.map((interest, index) => (
                  <span key={`interest-${index}`} className="px-3 py-1.5 md:px-4 md:py-2 bg-gray-100 border-2 border-[#1d1d1d] text-[#1d1d1d] font-bold text-xs md:text-sm rounded-sm shadow-[2px_2px_0px_0px_#1d1d1d] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all cursor-default">
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            {/* Tombol Download CV & Social Links */}
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <a 
                href={cvFile} 
                download="CV_Ferry-Firmando.pdf"
                className="inline-block px-8 py-3 bg-[#1d1d1d] text-white font-bold rounded-sm border border-[#1d1d1d] hover:bg-transparent hover:text-[#1d1d1d] transition-colors duration-300"
              >
                Download CV
              </a>
              <a href="https://github.com/ferrysinaga" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-[#1d1d1d] transition-colors" aria-label="GitHub">
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
              </a>
              <a href="https://www.linkedin.com/in/ferrysinaga/" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-[#1d1d1d] transition-colors" aria-label="LinkedIn">
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
              <a href="https://www.instagram.com/ferrysinaga61/" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-[#1d1d1d] transition-colors" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
            </div>
          </div>

          {/* Bagian Foto Profil (Kanan) */}
          <div className="w-full md:w-2/5 flex justify-center md:justify-end shrink-0">
            <img 
              src={profileImg} 
              alt="Ferry Profile" 
              className="w-full max-w-[420px] object-cover bg-gray-100 border-4 border-[#1d1d1d] shadow-[8px_8px_0px_0px_#1d1d1d] grayscale hover:grayscale-0 hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0px_0px_#1d1d1d] transition-all duration-300"
            />
          </div>
        </div>

        {/* Bagian Experience */}
        <div className="mt-24 max-w-4xl">
          <h2 className="text-2xl font-bold text-[#1d1d1d] mb-10">Experience</h2>
          
          <div className="flex flex-col gap-10">
            {/* 4. Kita render data experience menggunakan .map() */}
            {experienceData.map((item, index) => (
              <TimelineItem key={`exp-${index}`} {...item} />
            ))}
          </div>
        </div>

        {/* Bagian Education */}
        <div className="mt-16 max-w-4xl">
          <h2 className="text-2xl font-bold text-[#1d1d1d] mb-10">Education</h2>
          <div className="flex flex-col gap-10">
            {/* 5. Kita render data education menggunakan .map() juga */}
            {educationData.map((item, index) => (
              <TimelineItem key={`edu-${index}`} {...item} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;