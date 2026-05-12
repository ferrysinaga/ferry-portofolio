import React from 'react';

const SkillBadge: React.FC<{ skill: string }> = ({ skill }) => (
  <span className="px-4 py-2 border border-gray-300 text-gray-700 font-mono rounded-sm text-sm hover:bg-gray-50 cursor-default transition-colors">
    {skill}
  </span>
);

export default SkillBadge;