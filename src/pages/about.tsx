import Navbar from '../components/Navbar';
import profileImg from '../assets/dummy.jpg';
import cvFile from '../assets/CV_Ferry-Firmando.pdf';
import tsMediaLogo from '../assets/logo-ts-media-main.png';
import cakrawalaLogo from '../assets/logo-cakrawala-v2.webp';
import briLogo from '../assets/Logo BRI - Dianisa.com.png';

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Memanggil komponen Navbar */}
      <Navbar />

      {/* Konten halaman About */}
      <main className="box-border px-[120px] py-10">
        <h1 
          className="font-bold text-[#1d1d1d]"
          style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '64px', letterSpacing: '0.25em' }}
        >
          ABOUT
        </h1>
        
        <div className="mt-12 flex flex-col md:flex-row gap-16 items-start">
          {/* Bagian Teks (Kiri) */}
          <div className="flex flex-col gap-8 md:w-3/5 max-w-3xl">
            <p 
              className="text-gray-600 text-lg leading-relaxed"
              style={{ fontFamily: '"JetBrains Mono", monospace' }}
            >
              Hello! I am a passionate UI/UX Designer and Web Developer with a strong foundation in Computer Science. I specialize in bridging the gap between aesthetic design and robust technology. My journey in the tech world has driven me to continuously learn and adapt, allowing me to craft digital experiences that are not only visually appealing but also highly intuitive and functional.
            </p>
            
            <p 
              className="text-gray-600 text-lg leading-relaxed"
              style={{ fontFamily: '"JetBrains Mono", monospace' }}
            >
              Throughout my academic and professional projects, I have developed a keen eye for user-centric design and a logical approach to problem-solving. Whether it is designing a seamless mobile application interface in Figma or building a responsive front-end using React and Tailwind CSS, I thrive on turning complex problems into elegant, user-friendly solutions.
            </p>

            <div className="mt-6">
              <h2 className="text-2xl font-bold text-[#1d1d1d] mb-6">Core Competencies & Tools</h2>
              <div className="flex flex-wrap gap-3">
                {["UI/UX Design", "Front-End Development", "React & Next.js", "Tailwind CSS", "JavaScript", "Figma", "PHP", "Git & GitHub"].map((skill, index) => (
                  <span key={index} className="px-4 py-2 border border-gray-300 text-gray-700 font-mono rounded-sm text-sm hover:bg-gray-50 cursor-default transition-colors">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Tombol Download CV & Social Links */}
            <div className="mt-8 flex items-center gap-6">
              <a 
                href={cvFile} 
                download="CV_Ferry-Firmando.pdf"
                className="inline-block px-8 py-3 bg-[#1d1d1d] text-white font-bold rounded-sm hover:bg-gray-800 transition-colors duration-300"
                style={{ fontFamily: '"JetBrains Mono", monospace' }}
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
              className="w-full max-w-[420px] object-cover bg-gray-100 rounded-sm grayscale hover:grayscale-0 transition-all duration-300"
            />
          </div>
        </div>

        {/* Bagian Education & Experience */}
        <div className="mt-24 max-w-4xl">
          <h2 className="text-2xl font-bold text-[#1d1d1d] mb-10" style={{ fontFamily: '"JetBrains Mono", monospace' }}>Experience & Education</h2>
          
          <div className="flex flex-col gap-10">
            {/* Item 1 */}
            <div className="border-l-2 border-gray-200 pl-6 relative">
              <div className="absolute w-3.5 h-3.5 bg-[#1d1d1d] rounded-full -left-[8px] top-1.5"></div>
              <h3 className="text-xl font-bold text-gray-900">Graphics Design Intern</h3>
              <p className="text-gray-500 text-sm font-mono mt-1">TS Media • April 2024 - Present</p>
              <p className="text-gray-600 mt-3 leading-relaxed">
                As a versatile Video Editor, Graphics Designer, Photographer, and Videographer, I have consistently delivered impactful visual content across multiple platforms. My role focused on helping social media division make content that drives engagement, strengthens brand identity, and tells compelling stories.
              </p>
              
              {/* Logo Perusahaan */}
              <img 
                src={tsMediaLogo} 
                alt="TS Media Logo" 
                className="mt-4 w-20 h-20 rounded-md object-contain bg-white border border-gray-200 shadow-sm"
              />
            </div>

            {/* Item 2 */}
            <div className="border-l-2 border-gray-200 pl-6 relative">
              <div className="absolute w-3.5 h-3.5 bg-gray-300 rounded-full -left-[8px] top-1.5"></div>
              <h3 className="text-xl font-bold text-gray-900">IT Support Intern</h3>
              <p className="text-gray-500 text-sm font-mono mt-1">Bank Rakyat Indonesia • April - June 2020</p>
              <p className="text-gray-600 mt-3 leading-relaxed">
                As an IT Support Intern at Bank Rakyat Indonesia, I actively contributed to ensuring system reliability by performing electrical and network cable installations, as well as conducting hardware maintenance. My role focused on maintaining stable and optimal system performance, supporting seamless operations across critical banking infrastructure.
              </p>
              
              {/* Logo Perusahaan */}
              <img 
                src={briLogo} 
                alt="Bank BRI Logo" 
                className="mt-4 w-20 h-20 rounded-md object-contain bg-white border border-gray-200 shadow-sm"
              />
            </div>

            {/* Item 2 */}
            <div className="border-l-2 border-gray-200 pl-6 relative">
              <div className="absolute w-3.5 h-3.5 bg-gray-300 rounded-full -left-[8px] top-1.5"></div>
              <h3 className="text-xl font-bold text-gray-900">Bachelor of Computer Science</h3>
              <p className="text-gray-500 text-sm font-mono mt-1">Cakrawala University • 2024 - Present</p>
              <p className="text-gray-600 mt-3 leading-relaxed">
                Currently pursuing a degree in Computer Science. Building a strong foundation in software engineering principles, algorithms, and web technologies.
              </p>
              
              {/* Logo Universitas */}
              <img 
                src={cakrawalaLogo} 
                alt="Cakrawala University Logo" 
                className="mt-4 w-20 h-20 rounded-md object-contain bg-white border border-gray-200 shadow-sm"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;