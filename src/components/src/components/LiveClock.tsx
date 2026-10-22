import { useState, useEffect } from 'react';

export default function LiveClock() {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      // Mengatur format waktu khusus untuk zona Asia/Jakarta
      const formatter = new Intl.DateTimeFormat('id-ID', {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
      
      // Mengganti pemisah default bawaan (titik) menjadi titik dua agar lebih standar
      setTime(`${formatter.format(now).replace(/\./g, ':')} WIB`);
    };

    updateClock(); 
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!time) return null;

  return (
    <div className="inline-flex items-center gap-2 rounded-sm border-2 border-[#1d1d1d] bg-white px-3 py-1.5 font-mono text-xs font-bold text-[#1d1d1d] shadow-[3px_3px_0px_0px_#1d1d1d] whitespace-nowrap cursor-default transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none md:px-4 md:py-2 md:text-sm">
      <span className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border border-[#1d1d1d]"></span>
      </span>
      <span>
        <strong className="font-bold text-[#1d1d1d]">JKT</strong> {time}
      </span>
    </div>
  );
}