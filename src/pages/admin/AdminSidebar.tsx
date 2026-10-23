import type { Session } from '@supabase/supabase-js';

type TabType = 'gallery' | 'projects' | 'experience' | 'education' | 'certificates' | 'profile';

type SidebarProps = {
  session: Session;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onLogout: () => void;
};

export default function AdminSidebar({ session, activeTab, setActiveTab, onLogout }: SidebarProps) {
  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'gallery', label: 'GALLERY', icon: '📸' },
    { id: 'projects', label: 'PROJECTS', icon: '🚀' },
    { id: 'experience', label: 'EXPERIENCE', icon: '💼' },
    { id: 'education', label: 'EDUCATION', icon: '🎓' },
    { id: 'certificates', label: 'CERTIFICATES', icon: '📜' },
    { id: 'profile', label: 'PROFILE', icon: '⚙️' },
  ];

  return (
    <aside className="w-full md:w-72 bg-white md:border-r-4 border-b-4 md:border-b-0 border-[#1d1d1d] flex flex-col shrink-0 z-10 md:sticky md:top-0 md:h-screen">
      <div className="p-8 border-b-4 border-[#1d1d1d] bg-[#1d1d1d] text-white">
        <h1 className="text-2xl font-bold tracking-widest">CMD<span className="text-yellow-400">CTR</span></h1>
        <p className="text-xs mt-2 opacity-70 font-mono">PORTFOLIO.SYS</p>
      </div>
      
      <nav className="flex-1 p-6 flex flex-col gap-4 bg-gray-50 overflow-y-auto">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id)} 
              className={`flex items-center gap-3 px-4 py-3 font-bold text-sm uppercase tracking-wide border-2 transition-all text-left
                ${isActive 
                  ? 'bg-yellow-300 border-[#1d1d1d] shadow-[4px_4px_0px_0px_#1d1d1d] text-[#1d1d1d] translate-x-[-2px] translate-y-[-2px]' 
                  : 'bg-white border-[#1d1d1d] text-gray-600 hover:shadow-[4px_4px_0px_0px_#1d1d1d] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:text-[#1d1d1d]'
                }`}
            >
              <span className="text-lg">{tab.icon}</span> {tab.label}
            </button>
          )
        })}
      </nav>

      <div className="p-6 border-t-4 border-[#1d1d1d] bg-white">
        <div className="mb-4">
          <p className="text-xs font-bold text-gray-500 uppercase">Active Session</p>
          <p className="text-sm font-bold text-[#1d1d1d] truncate mt-1">{session.user?.email}</p>
        </div>
        <button 
          onClick={onLogout} 
          className="w-full py-3 bg-red-500 text-white font-bold uppercase tracking-wider border-2 border-[#1d1d1d] shadow-[4px_4px_0px_0px_#1d1d1d] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
        >
          SIGNOUT
        </button>
      </div>
    </aside>
  );
}