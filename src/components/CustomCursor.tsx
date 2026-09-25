import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // Memperbarui posisi koordinat
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    // Deteksi hover pada link atau tombol
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
  }, []);

  return (
    <motion.div
      // w-3 h-3 membuat titiknya sedikit lebih jelas (sekitar 12px)
      className="fixed top-0 left-0 w-3 h-3 bg-[#1d1d1d] rounded-full pointer-events-none z-[9999]"
      animate={{
        x: mousePosition.x - 6, // Dikurangi 6 agar sumbu persis di tengah titik
        y: mousePosition.y - 6,
        scale: isHovering ? 3.5 : 1, // Membesar 3.5x lipat saat hover link/tombol
        opacity: isHovering ? 0.3 : 1 // Menjadi transparan (0.3) saat membesar agar teks tombol tetap terbaca
      }}
      transition={{ type: "tween", ease: "backOut", duration: 0.15 }}
    />
  );
};

export default CustomCursor;