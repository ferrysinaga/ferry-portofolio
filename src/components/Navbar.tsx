import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion'; // 👈 Tambahan Framer Motion

const Navbar: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  // --- VARIANTS ANIMASI ---
  const navVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  };

  const linkVariants: Variants = {
    hidden: { opacity: 0, x: 20 },
    show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100 } }
  };

  const links = [
    { path: '/about', label: 'About' },
    { path: '/project', label: 'Project' },
    { path: '/gallery', label: 'Gallery' },
  ];

  return (
    // 👇 bg-white dihapus agar menyatu sempurna dengan background dot-grid di halaman Home
    <nav className="flex justify-between items-start w-full box-border px-8 md:px-[120px] py-10 bg-transparent">
      
      {/* BAGIAN LOGO */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className="text-[#1d1d1d] font-bold tracking-tight text-5xl md:text-[64px] leading-none"
        style={{ fontFamily: '"Geist", sans-serif' }}
      >
        <Link 
          to="/" 
          className="inline-block hover:-rotate-2 hover:scale-105 transition-transform duration-300 origin-bottom-left"
        >
          .ffs
        </Link>
      </motion.div>

      {/* BAGIAN NAVIGASI */}
      <motion.div 
        variants={navVariants}
        initial="hidden"
        animate="show"
        className="flex flex-col items-end space-y-4 pt-2"
        style={{ fontFamily: '"JetBrains Mono", monospace' }}
      >
        {links.map((link) => {
          const active = isActive(link.path);
          return (
            <motion.div key={link.path} variants={linkVariants}>
              <Link 
                to={link.path} 
                className={`relative text-[16px] transition-colors duration-200 group ${
                  active ? 'text-[#1d1d1d] font-bold' : 'text-gray-500 hover:text-[#1d1d1d]'
                }`}
              >
                {link.label}
                {/* Garis Bawah Hitam Pekat (Brutalist Style) */}
                <span className={`absolute left-0 -bottom-1 w-full h-[3px] bg-[#1d1d1d] transition-transform duration-300 origin-left ${
                  active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`}></span>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

    </nav>
  );
};

export default Navbar;