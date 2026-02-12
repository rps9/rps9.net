import React from 'react';
import { Link } from 'react-router-dom'

interface ExperienceCardProps {
  title: string;
  description: string;
  image: string;
  tags: string[];
  to?: string;
  sourceType?: 'open' | 'closed';
  sourceUrl?: string;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({ title, description, image, tags, to, sourceType, sourceUrl }) => {
  const card = (
    <div className="bg-gray-900 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-gray-700 block h-full">
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
        <p className="text-gray-300 mb-4">{description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-gray-700 text-gray-200 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
        {sourceType === 'open' && (
          <a
            href={sourceUrl ?? '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-3 py-1 bg-blue-600 text-white rounded-full text-sm hover:bg-blue-500 transition-colors"
          >
            View on GitHub
          </a>
        )}
        {sourceType === 'closed' && (
          <span className="inline-block px-3 py-1 bg-red-900/40 text-red-200 rounded-full text-sm border border-red-700/60">
            Closed Source: Message Me for Details
          </span>
        )}
      </div>
    </div>
  );

  if (to) {
    return (
      <Link to={to} className={`block h-full`}>
        {card}
      </Link>
    )
  }

  return card
};

export default ExperienceCard;
