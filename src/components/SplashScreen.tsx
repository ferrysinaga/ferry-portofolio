import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SplashScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // 1. Logika untuk membuat angka berjalan dari 0 sampai 100
    const duration = 1500; 
    const interval = 30; 
    const totalSteps = duration / interval;
    let currentStep = 0;

    const progressTimer = setInterval(() => {
      currentStep++;
      const currentProgress = Math.min(Math.round((currentStep / totalSteps) * 100), 100);
      setProgress(currentProgress);
      
      if (currentStep >= totalSteps) {
        clearInterval(progressTimer);
      }
    }, interval);

    // 2. Tahan sebentar di 100% lalu tarik layar ke atas
    const hideTimer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => {
      clearInterval(progressTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="splash"
          initial={{ y: 0 }}
          // 👇 Efek "Curtain Lift": Layar ditarik ke atas
          exit={{ y: "-100vh" }} 
          // 👇 Easing [0.76, 0, 0.24, 1] adalah kurva sinematik ala Awwwards
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }} 
          className="fixed inset-0 z-[9999] bg-[#1d1d1d] flex flex-col justify-between overflow-hidden"
          style={{ fontFamily: '"JetBrains Mono", monospace' }}
        >
          {/* TOP HEADER */}
          <div className="flex justify-between items-center p-8 md:px-[120px] md:py-10 text-white opacity-80">
            <span className="font-bold tracking-widest uppercase text-sm">Ferry Firmando</span>
            <span className="text-xs tracking-widest uppercase animate-pulse text-gray-400">System Booting...</span>
          </div>

          {/* CENTER MASSIVE TYPOGRAPHY */}
          <div className="flex-grow flex items-center justify-center relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-[120px] sm:text-[180px] md:text-[250px] font-bold text-white leading-none tracking-tighter relative"
            >
              {progress}
              <span className="text-4xl sm:text-6xl md:text-7xl text-gray-500 absolute ml-4 mt-8 md:mt-12 font-medium">
                %
              </span>
            </motion.div>
          </div>

          {/* BOTTOM PROGRESS BAR */}
          <div className="w-full">
            <div className="flex justify-between items-center px-8 md:px-[120px] pb-6 text-white text-xs md:text-sm tracking-widest uppercase font-bold">
              <span className="opacity-70">Loading Assets</span>
              <span className="opacity-100">{progress} / 100</span>
            </div>
            
            {/* Visual Bar (Garis yang penuh dari kiri ke kanan) */}
            <div className="w-full h-1.5 md:h-2 bg-gray-800">
              <motion.div 
                className="h-full bg-white shadow-[0px_0px_10px_rgba(255,255,255,0.5)]"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: "linear", duration: 0.1 }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;