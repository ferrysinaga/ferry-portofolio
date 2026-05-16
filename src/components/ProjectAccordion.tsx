import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export interface ProjectItemProps {
  title: string;
  description: string;
  imageUrl: string | string[];
  roles: string[];
  tools: string[];
  year: string;
  demoUrl?: string;
  githubUrl?: string;
  figmaUrl?: string;
}

interface ProjectAccordionProps {
  projects: ProjectItemProps[];
}

const ProjectAccordion: React.FC<ProjectAccordionProps> = ({ projects }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [lightbox, setLightbox] = useState<{ projectIdx: number; imgIdx: number } | null>(null);

  useEffect(() => {
    if (lightbox !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [lightbox]);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="w-full font-sans bg-white" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
      {/* Table Header */}
      <div className="flex items-center justify-between pb-4 px-2 md:px-4 text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">
        <div className="w-1/2 md:w-2/5 pr-2">Project</div>
        <div className="w-1/4 hidden md:block pr-2">Role</div>
        <div className="w-1/4 md:w-1/6 text-right md:text-left">Year</div>
        <div className="w-8"></div>
      </div>

      {projects.map((project, index) => {
        const isExpanded = expandedIndex === index;
        const images = Array.isArray(project.imageUrl) ? project.imageUrl : [project.imageUrl];

        return (
          <div key={index} className="border-t-2 last:border-b-2 border-[#1d1d1d] text-[#1d1d1d]">
            {/* Header Bar */}
            <div 
              className="flex items-center justify-between py-4 px-2 md:px-4 cursor-pointer hover:bg-gray-100 transition-colors duration-200 text-xs md:text-sm font-bold"
              onClick={() => toggleExpand(index)}
            >
              <div className="w-1/2 md:w-2/5 pr-2 text-sm md:text-base">{project.title}</div>
              <div className="w-1/4 hidden md:block text-gray-500 font-semibold line-clamp-1 pr-2">{project.roles.join(', ')}</div>
              <div className="w-1/4 md:w-1/6 text-right md:text-left">{project.year}</div>
              <div className="w-8 flex justify-end text-2xl font-light">
                {isExpanded ? '×' : '+'}
              </div>
            </div>

            {/* Expanded Content */}
            {isExpanded && (
              <div className="flex flex-col md:flex-row gap-6 md:gap-8 p-4 md:p-6 transition-all duration-300 ease-in-out border-t-2 border-dashed border-gray-200 bg-gray-50">
                {/* Left: Thumbnail/Lightbox Trigger */}
                <div 
                  className="w-full md:w-2/5 shrink-0 relative aspect-[1/1] overflow-hidden rounded-sm cursor-pointer group border-2 border-[#1d1d1d] shadow-[4px_4px_0px_0px_#1d1d1d]"
                  onClick={() => setLightbox({ projectIdx: index, imgIdx: 0 })}
                >
                  <img 
                    src={images[0]} 
                    alt={project.title}
                    className="w-full h-full object-cover bg-gray-800 group-hover:scale-105 transition-transform duration-500"
                  />
                  {images.length > 1 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-12 flex justify-center items-end opacity-90 group-hover:opacity-100 transition-opacity">
                      <span className="text-white text-[10px] md:text-xs font-bold tracking-wider border border-white/50 px-3 py-1.5 bg-black/40 rounded-sm backdrop-blur-sm group-hover:bg-white group-hover:text-black group-hover:border-white transition-colors duration-300">
                        CLICK TO VIEW {images.length} IMAGES
                      </span>
                    </div>
                  )}
                </div>

                {/* Right: Info */}
                <div className="w-full md:w-3/5 flex flex-col gap-4 text-sm leading-relaxed">
                  <div className="flex flex-col md:flex-row">
                    <span className="w-32 shrink-0 font-bold mb-1 md:mb-0 text-gray-500">Description:</span>
                    <p className="flex-1 font-medium">{project.description}</p>
                  </div>

                  <div className="flex flex-col md:flex-row">
                    <span className="w-32 shrink-0 font-bold mb-1 md:mb-0 text-gray-500">Roles:</span>
                    <div className="flex-1 flex flex-wrap gap-2">
                      {project.roles.map((role, idx) => (
                        <span key={idx} className="px-2 py-1 bg-[#1d1d1d] text-white text-[10px] md:text-xs uppercase tracking-wider font-bold rounded-sm shadow-[2px_2px_0px_0px_#1d1d1d]">{role}</span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-start">
                    <span className="w-32 shrink-0 font-bold mb-1 md:mb-0 text-gray-500">Tools:</span>
                    <div className="flex-1 flex flex-wrap gap-2">
                      {project.tools.map((tool, idx) => (
                        <span key={idx} className="px-2 py-1 bg-white border-2 border-[#1d1d1d] text-[#1d1d1d] text-[10px] md:text-xs uppercase tracking-wider font-bold rounded-sm shadow-[2px_2px_0px_0px_#1d1d1d]">{tool}</span>
                      ))}
                    </div>
                  </div>

                  {/* Links */}
                  {(project.demoUrl || project.githubUrl || project.figmaUrl) && (
                    <div className="md:ml-32 mt-4 flex flex-wrap gap-4">
                      {project.figmaUrl && (
                        <a href={project.figmaUrl} target="_blank" rel="noreferrer" className="inline-block border-2 border-[#1d1d1d] bg-white text-[#1d1d1d] font-bold px-4 py-2 text-xs shadow-[2px_2px_0px_0px_#1d1d1d] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-200">
                          ↗ Figma Prototype
                        </a>
                      )}
                      {project.demoUrl && (
                        <a href={project.demoUrl} target="_blank" rel="noreferrer" className="inline-block border-2 border-[#1d1d1d] bg-[#0ACF83] text-[#1d1d1d] font-bold px-4 py-2 text-xs shadow-[2px_2px_0px_0px_#1d1d1d] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-200">
                          ↗ Live Demo
                        </a>
                      )}
                      {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" rel="noreferrer" className="inline-block border-2 border-[#1d1d1d] bg-gray-100 text-gray-600 font-bold px-4 py-2 text-xs shadow-[2px_2px_0px_0px_#1d1d1d] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-200">
                          ↗ Github Repo
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* LIGHTBOX PORTAL */}
      {lightbox !== null && createPortal(
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setLightbox(null)}
        >
          <div className="relative max-w-5xl w-full max-h-full flex justify-center items-center animate-fade-in-up">
            <button 
              className="absolute -top-12 right-0 md:right-4 text-white hover:text-gray-300 focus:outline-none transition-colors"
              onClick={(e) => { e.stopPropagation(); setLightbox(null); }}
              aria-label="Close lightbox"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            
            {/* Nav Buttons */}
            {(() => {
              const currentProjectImgs = Array.isArray(projects[lightbox.projectIdx].imageUrl) ? projects[lightbox.projectIdx].imageUrl : [projects[lightbox.projectIdx].imageUrl];
              if (currentProjectImgs.length > 1) {
                return (
                  <>
                    <button className="absolute left-2 md:-left-16 p-2 bg-black/50 md:bg-transparent rounded-full text-white hover:text-gray-300 focus:outline-none transition-colors z-10" onClick={(e) => { e.stopPropagation(); setLightbox({ projectIdx: lightbox.projectIdx, imgIdx: lightbox.imgIdx === 0 ? currentProjectImgs.length - 1 : lightbox.imgIdx - 1 }); }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    </button>
                    <button className="absolute right-2 md:-right-16 p-2 bg-black/50 md:bg-transparent rounded-full text-white hover:text-gray-300 focus:outline-none transition-colors z-10" onClick={(e) => { e.stopPropagation(); setLightbox({ projectIdx: lightbox.projectIdx, imgIdx: lightbox.imgIdx === currentProjectImgs.length - 1 ? 0 : lightbox.imgIdx + 1 }); }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </button>
                  </>
                );
              }
              return null;
            })()}

            <img 
              src={Array.isArray(projects[lightbox.projectIdx].imageUrl) ? projects[lightbox.projectIdx].imageUrl[lightbox.imgIdx] : projects[lightbox.projectIdx].imageUrl as string} 
              alt="Enlarged preview" 
              className="max-w-full max-h-[90vh] object-contain rounded-md shadow-2xl cursor-default" 
              onClick={(e) => e.stopPropagation()} 
            />
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default ProjectAccordion;