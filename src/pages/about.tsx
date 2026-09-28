import Navbar from '../components/Navbar';
import profileImg from '../assets/foto-profil/foto-profil-1.png';
import cvFile from '../assets/CV_Ferry-Firmando.pdf';
import TimelineAccordion from '../components/TimelineAccordion';
import { experienceData, educationData, tools, interests } from '../data/aboutData';
import CertificateAccordion from '../components/CertificateAccordion';
import { motion, type Variants } from 'framer-motion';

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

const chipVariant: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 10 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
};

const About = () => {
  return (
    <motion.div 
      initial="hidden" 
      animate="visible"
      className="min-h-screen" 
      style={{ fontFamily: '"JetBrains Mono", monospace' }}
    >
      {/* Navbar */}
      <div className="relative z-50">
        <Navbar />
      </div>

      <main className="box-border px-8 md:px-[120px] py-10 overflow-hidden">
        
        {/* HEADER SECTION */}
        <motion.h1 
          variants={fadeUpVariant}
          className="font-bold text-[#1d1d1d] text-5xl md:text-[64px] drop-shadow-md"
          style={{ letterSpacing: '0.25em' }}
        >
          ABOUT
        </motion.h1>
        
        <div className="mt-12 flex flex-col-reverse md:flex-row gap-16 items-start">
          
          {/* TEKS & KEAHLIAN (KIRI) */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-8 md:w-3/5 max-w-3xl relative z-10"
          >
            {/* Paragraf Lead (Lebih mencolok) */}
            <motion.p variants={fadeUpVariant} className="text-xl md:text-2xl font-bold text-[#1d1d1d] leading-relaxed">
              Hello! I am a passionate UI/UX Designer and Web Developer with a strong foundation in Computer Science.
            </motion.p>
            
            <motion.p variants={fadeUpVariant} className="text-gray-600 text-lg leading-relaxed border-l-4 border-[#1d1d1d] pl-4 md:pl-6 bg-gray-50 py-2">
              I specialize in bridging the gap between aesthetic design and robust technology.
            </motion.p>

            <motion.p variants={fadeUpVariant} className="text-gray-600 text-lg leading-relaxed">
              Throughout my academic and professional projects, I have developed a keen eye for user-centric design and a logical approach to problem-solving. Whether it is designing a seamless mobile application interface in Figma or building a responsive front-end using React and Tailwind CSS, I thrive on turning complex problems into elegant, user-friendly solutions.
            </motion.p>

            {/* TOOLS SECTION */}
            <motion.div variants={fadeUpVariant} className="mt-6">
              <h2 className="text-2xl font-bold text-[#1d1d1d] mb-6 inline-block border-b-4 border-[#1d1d1d] pb-1">Tools</h2>
              <motion.div 
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                className="flex flex-wrap gap-3"
              >
                {tools.map((tool, index) => (
                  <motion.span 
                    variants={chipVariant}
                    key={`tool-${index}`} 
                    className="group flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-white border-2 border-[#1d1d1d] text-[#1d1d1d] font-bold text-xs md:text-sm rounded-sm shadow-[3px_3px_0px_0px_#1d1d1d] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all cursor-default"
                  >
                    <img src={tool.icon} alt={tool.name} className="w-4 h-4 md:w-5 md:h-5 object-contain group-hover:scale-110 transition-transform" />
                    {tool.name}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>
            
            {/* INTERESTS SECTION */}
            <motion.div variants={fadeUpVariant} className="mt-4">
              <h2 className="text-2xl font-bold text-[#1d1d1d] mb-6 inline-block border-b-4 border-[#1d1d1d] pb-1">Interests</h2>
              <motion.div 
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                className="flex flex-wrap gap-3"
              >
                {interests.map((interest, index) => (
                  <motion.span 
                    variants={chipVariant}
                    key={`interest-${index}`} 
                    className="px-3 py-1.5 md:px-4 md:py-2 bg-gray-100 border-2 border-[#1d1d1d] text-[#1d1d1d] font-bold text-xs md:text-sm rounded-sm shadow-[3px_3px_0px_0px_#1d1d1d] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all cursor-default"
                  >
                    {interest}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>

            {/* ACTION BUTTONS & SOCIALS */}
            <motion.div variants={fadeUpVariant} className="mt-8 flex flex-wrap items-center gap-6">
              <a 
                href={cvFile} 
                download="CV_Ferry-Firmando.pdf"
                className="group flex items-center gap-3 px-8 py-3 bg-[#1d1d1d] text-white font-bold rounded-sm border-2 border-[#1d1d1d] shadow-[4px_4px_0px_0px_#e5e7eb] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-300"
              >
                Download CV
                <svg className="w-5 h-5 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              </a>
              
              <div className="flex gap-4">
                <a href="https://github.com/ferrysinaga" target="_blank" rel="noreferrer" className="p-2 text-gray-500 hover:text-[#1d1d1d] hover:scale-110 transition-transform" aria-label="GitHub">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                </a>
                <a href="https://www.linkedin.com/in/ferrysinaga/" target="_blank" rel="noreferrer" className="p-2 text-gray-500 hover:text-[#1d1d1d] hover:scale-110 transition-transform" aria-label="LinkedIn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </a>
                <a href="https://www.instagram.com/ferrysinaga61/" target="_blank" rel="noreferrer" className="p-2 text-gray-500 hover:text-[#1d1d1d] hover:scale-110 transition-transform" aria-label="Instagram">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
              </div>
            </motion.div>
          </motion.div>

          {/* FOTO PROFIL (KANAN) */}
          <motion.div 
            variants={fadeUpVariant}
            className="w-full md:w-2/5 flex justify-center md:justify-end shrink-0 relative group"
          >
            {/* Dekorasi Background */}
            <div className="absolute inset-0 max-w-[420px] mx-auto md:mr-0 md:ml-auto w-full h-full bg-gray-200 border-4 border-[#1d1d1d] translate-x-3 translate-y-3 md:translate-x-4 md:translate-y-4 group-hover:translate-x-1 group-hover:translate-y-1 transition-transform duration-500 z-0"></div>
            
            <img 
              src={profileImg} 
              alt="Ferry Profile" 
              className="w-full max-w-[420px] object-cover bg-gray-100 border-4 border-[#1d1d1d] grayscale hover:grayscale-0 relative z-10 transition-all duration-500"
            />
          </motion.div>
        </div>

        {/* EXPERIENCE SECTION */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariant}
          className="mt-32 w-full"
        >
          <div className="flex items-center gap-6 mb-10">
            <h2 className="text-3xl font-bold text-[#1d1d1d] shrink-0">Experience</h2>
            <div className="h-1 w-full bg-gray-100 border-b-2 border-dashed border-gray-300"></div>
          </div>
          <TimelineAccordion items={experienceData} />
        </motion.div>

        {/* EDUCATION SECTION */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariant}
          className="mt-20 w-full"
        >
          <div className="flex items-center gap-6 mb-10">
            <h2 className="text-3xl font-bold text-[#1d1d1d] shrink-0">Education</h2>
            <div className="h-1 w-full bg-gray-100 border-b-2 border-dashed border-gray-300"></div>
          </div>
          <TimelineAccordion items={educationData} />
        </motion.div>

        {/* CERTIFICATES SECTION */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariant}
          className="mt-20 w-full pb-10"
        >
          <div className="flex items-center gap-6 mb-10">
            <h2 className="text-3xl font-bold text-[#1d1d1d] shrink-0">Certificates</h2>
            <div className="h-1 w-full bg-gray-100 border-b-2 border-dashed border-gray-300"></div>
          </div>
          <CertificateAccordion />
        </motion.div>
        
      </main>
    </motion.div>
  );
};

export default About;