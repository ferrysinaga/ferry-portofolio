import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import TypewriterText from '../components/TypewriterText';
import { motion } from 'framer-motion'; 
import GuestbookWidget from '../components/GuestbookWidget'; // 👈 IMPORT GUESTBOOK DI SINI

// Komponen khusus untuk efek Decrypted Text
const DecryptedText = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const [displayText, setDisplayText] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+{}:"<>?|[]~\\-\';,./';

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    const timeout = setTimeout(() => {
      setIsStarted(true);
      let iteration = 0;
      
      interval = setInterval(() => {
        setDisplayText(
          text
            .split('')
            .map((char, index) => {
              if (index < iteration) return text[index];
              if (char === ' ') return ' ';
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join('')
        );
        if (iteration >= text.length) clearInterval(interval);
        iteration += 1 / 3;
      }, 40);
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [text, delay]);

  return <span>{!isStarted ? <span className="opacity-0">{text}</span> : displayText}</span>;
};

const Home = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}  
      transition={{ duration: 0.6, ease: "easeOut" }} 
      className="min-h-screen bg-white flex flex-col" 
      style={{ fontFamily: '"JetBrains Mono", monospace' }}
    >
      <Navbar />
      
      {/* Hero Section & Guestbook */}
      <main className="flex-grow box-border px-8 md:px-[120px] flex flex-col justify-center pt-20 pb-20 animate-fade-in-up">
        <h1 className="text-5xl md:text-6xl font-bold text-[#1d1d1d] leading-tight tracking-tight animate-floating drop-shadow-md">
          <DecryptedText text="Hello, Nice To Meet You!" delay={300} />
        </h1>
        
        <p className="mt-6 text-lg text-gray-500 max-w-2xl leading-relaxed">
          <TypewriterText text="I turn complex problems into pixel-perfect digital experiences. No fluff, just clean code and intuitive design." delay={1200} speed={25} />
        </p>

        {/* 👇 Guestbook dipanggil di DALAM <main> agar lebarnya sejajar dengan teks Hero */}
        <GuestbookWidget />
      </main>

      {/* Social Links Footer */}
      <div className="w-full flex justify-center items-center gap-6 pb-10 animate-fade-in-up">
        <a href="https://github.com/ferrysinaga" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[#1d1d1d] transition-colors" aria-label="GitHub">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
        </a>
        <a href="https://www.linkedin.com/in/ferrysinaga/" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[#1d1d1d] transition-colors" aria-label="LinkedIn">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
        </a>
        <a href="https://www.instagram.com/ferrysinaga61/" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[#1d1d1d] transition-colors" aria-label="Instagram">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
        </a>
      </div>
    </motion.div> 
  );
};

export default Home;