import React from 'react';

// Kita definisikan dan ekspor "cetakan" data agar bisa dipakai di tempat lain (seperti di about.tsx)
export interface TimelineItemProps {
  title: string;
  subtitle: string;
  description: string;
  logo: string;
  logoAlt: string;
  isCurrent?: boolean;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ title, subtitle, description, logo, logoAlt, isCurrent = false }) => (
  <div className="border-l-2 border-gray-200 pl-6 relative">
    {/* Titik pada timeline, warnanya akan berbeda jika isCurrent bernilai true */}
    <div className={`absolute w-3.5 h-3.5 ${isCurrent ? 'bg-[#1d1d1d]' : 'bg-gray-300'} rounded-full -left-[8px] top-1.5`}></div>
    <h3 className="text-xl font-bold text-gray-900">{title}</h3>
    <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
    <p className="text-gray-600 mt-3 leading-relaxed">{description}</p>
    <img 
      src={logo} 
      alt={logoAlt} 
      className="mt-4 w-20 h-20 rounded-md object-contain bg-white border border-gray-200 shadow-sm"
    />
  </div>
);

export default TimelineItem;