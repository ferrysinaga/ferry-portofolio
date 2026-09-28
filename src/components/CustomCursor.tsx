import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile] = useState(() => window.matchMedia("(pointer: coarse)").matches);

  useEffect(() => {
    // 1. Deteksi Touch Screen: Jangan jalankan kursor buatan di perangkat Mobile
    if (isMobile) return;

    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') ||
        target.closest('button') ||
        window.getComputedStyle(target).cursor === 'pointer'
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [isMobile]);

  // Jika di HP, matikan kursor custom agar tidak mengganggu touch event
  if (isMobile) return null;

  return (
    <motion.div
      // 2. Efek X-RAY INVERT: Menggunakan bg-white dipadukan dengan mix-blend-mode
      className="fixed top-0 left-0 w-4 h-4 bg-white rounded-full pointer-events-none z-[9999]"
      style={{ mixBlendMode: 'difference' }} 
      animate={{
        x: mousePosition.x - 8, // Dikurangi 8 agar tepat di tengah (ukuran 16px)
        y: mousePosition.y - 8,
        scale: isHovering ? 4 : 1, // Membesar 4x lipat, tidak perlu opacity transparan karena sudah efek Invert!
      }}
      transition={{ 
        // 3. SPRING PHYSICS: Sangat mulus, organik, tanpa lag yang kaku
        x: { type: "spring", stiffness: 1000, damping: 40, mass: 0.1 },
        y: { type: "spring", stiffness: 1000, damping: 40, mass: 0.1 },
        scale: { type: "spring", stiffness: 300, damping: 20 }
      }}
    />
  );
};

export default CustomCursor;