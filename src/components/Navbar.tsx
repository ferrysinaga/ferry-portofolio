import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="flex justify-between items-start w-full box-border px-[120px] py-10 bg-white">
      {/* Bagian Logo */}
      <div 
        className="text-[#1d1d1d] font-bold tracking-tight"
        style={{ fontFamily: '"Geist", sans-serif', fontSize: '64px', lineHeight: '1' }}
      >
        <Link to="/">.ffs</Link>
      </div>

      {/* Bagian Navigasi */}
      <div 
        className="flex flex-col items-end space-y-4 pt-2"
        style={{ fontFamily: '"JetBrains Mono", monospace' }}
      >
        <Link 
          to="/about" 
          className="relative text-[16px] text-[#1d1d1d] hover:text-gray-500 transition-colors duration-200 group"
        >
          About
          <span className={`absolute left-0 -bottom-1 w-full h-[2px] bg-gray-500 transition-transform duration-300 origin-left ${isActive('/about') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
        </Link>
        <Link 
          to="/project" 
          className="relative text-[16px] text-[#1d1d1d] hover:text-gray-500 transition-colors duration-200 group"
        >
          Project
          <span className={`absolute left-0 -bottom-1 w-full h-[2px] bg-gray-500 transition-transform duration-300 origin-left ${isActive('/project') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
        </Link>
        <Link 
          to="/contact" 
          className="relative text-[16px] text-[#1d1d1d] hover:text-gray-500 transition-colors duration-200 group"
        >
          Contact
          <span className={`absolute left-0 -bottom-1 w-full h-[2px] bg-gray-500 transition-transform duration-300 origin-left ${isActive('/contact') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;