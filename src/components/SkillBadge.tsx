import React from 'react';

interface SkillBadgeProps {
  name: string;
}

const SkillBadge: React.FC<SkillBadgeProps> = ({ name}) => {
  return (
    <div className="border border-black bg-white px-4 py-2 text-black">
      <span className="font-medium">{name}</span>
    </div>
  );
};

export default SkillBadge;
