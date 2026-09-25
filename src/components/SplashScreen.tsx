import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SplashScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // 1. Logika untuk membuat angka berjalan dari 0 sampai 100
    const duration = 1500; // Lama loading (1.5 detik)
    const interval = 30; // Update setiap 30 milidetik
    const totalSteps = duration / interval;
    let currentStep = 0;

    const progressTimer = setInterval(() => {
      currentStep++;
      // Hitung persentase dan pastikan mentok di angka 100
      const currentProgress = Math.min(Math.round((currentStep / totalSteps) * 100), 100);
      setProgress(currentProgress);
      
      if (currentStep >= totalSteps) {
        clearInterval(progressTimer);
      }
    }, interval);

    // 2. Logika untuk menghilangkan layar splash setelah 2 detik
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
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -40 }} // Naik ke atas saat selesai
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center"
          style={{ fontFamily: '"JetBrains Mono", monospace' }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-4"
          >
            {/* Teks Nama */}
            <div className="text-xl md:text-3xl font-bold text-[#1d1d1d] tracking-[0.2em] flex items-center">
              LOADING<span className="animate-pulse">...</span>
            </div>
            
            {/* Teks Loading Persentase (0% - 100%) */}
            <div className="text-gray-400 text-lg md:text-xl tracking-widest font-medium">
              {progress}%
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;