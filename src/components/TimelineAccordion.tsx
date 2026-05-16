import { useState } from 'react';

export interface TimelineItemProps {
  title: string;
  subtitle: string;
  description: string;
  logo: string;
  logoAlt: string;
  isCurrent?: boolean;
}

interface TimelineAccordionProps {
  items: TimelineItemProps[];
}

const TimelineAccordion: React.FC<TimelineAccordionProps> = ({ items }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="w-full font-sans bg-white" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
      {/* Table Header */}
      <div className="flex items-center justify-between pb-4 px-2 md:px-4 text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">
        <div className="w-1/2 md:w-1/3 pr-2">Role / Degree</div>
        <div className="w-1/2 md:w-2/3 text-right md:text-left">Company / Institution</div>
        <div className="w-8"></div>
      </div>

      {items.map((item, index) => {
        const isExpanded = expandedIndex === index;

        return (
          <div key={index} className="border-t-2 last:border-b-2 border-[#1d1d1d] text-[#1d1d1d]">
            {/* Header Bar */}
            <div 
              className="flex items-center justify-between py-4 px-2 md:px-4 cursor-pointer hover:bg-gray-100 transition-colors duration-200 text-xs md:text-sm font-bold"
              onClick={() => toggleExpand(index)}
            >
              <div className="w-1/2 md:w-1/3 pr-2 flex items-center gap-3">
                {item.title}
                {item.isCurrent && (
                  <span className="hidden md:inline-block px-2 py-0.5 bg-[#0ACF83] text-[#1d1d1d] text-[10px] uppercase tracking-wider border border-[#1d1d1d] shadow-[1px_1px_0px_0px_#1d1d1d] shrink-0">Current</span>
                )}
              </div>
              <div className="w-1/2 md:w-2/3 text-right md:text-left flex flex-col md:block">
                {item.isCurrent && <span className="md:hidden text-[#0ACF83] text-[10px] uppercase mb-1">Current</span>}
                {item.subtitle}
              </div>
              <div className="w-8 flex justify-end text-2xl font-light">
                {isExpanded ? '×' : '+'}
              </div>
            </div>

            {/* Konten yang meluas (Expanded View) */}
            {isExpanded && (
              <div className="flex flex-col md:flex-row gap-6 md:gap-8 p-4 md:p-6 transition-all duration-300 ease-in-out border-t-2 border-dashed border-gray-200 bg-gray-50">
                {/* Bagian Kiri: Logo */}
                <div className="w-full md:w-1/4 shrink-0 flex justify-center md:justify-start items-start">
                  <img 
                    src={item.logo} 
                    alt={item.logoAlt}
                    className="w-24 h-24 md:w-32 md:h-32 object-contain border-2 border-[#1d1d1d] shadow-[4px_4px_0px_0px_#1d1d1d] bg-white p-2"
                  />
                </div>

                {/* Bagian Kanan: Deskripsi */}
                <div className="w-full md:w-3/4 flex flex-col gap-4 text-sm leading-relaxed">
                  <div className="flex flex-col md:flex-row">
                    <span className="w-32 shrink-0 font-bold mb-1 md:mb-0 text-gray-500">Description:</span>
                    <p className="flex-1 font-medium">{item.description}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TimelineAccordion;