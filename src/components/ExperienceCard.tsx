import React, { useState } from 'react';
import { Maximize2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ExperienceCardProps {
  title: string;
  description: string;
  image: string;
  tags: string[];
  to?: string;
  href?: string;
  onClick?: () => void;
  actionLabel?: string;
  expandableImage?: boolean;
  sourceType?: 'open' | 'closed';
  sourceUrl?: string;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({
  title,
  description,
  image,
  tags,
  to,
  href,
  onClick,
  actionLabel,
  expandableImage = false,
  sourceType,
  sourceUrl,
}) => {
  const [imageOpen, setImageOpen] = useState(false);
  const navigate = useNavigate();
  const externalHref = href ?? sourceUrl;
  const label =
    actionLabel ??
    (sourceType === 'open' ? 'View on GitHub' : sourceType === 'closed' ? 'Email me for details' : undefined);
  const interactive = !!to || !!externalHref || !!onClick;

  const activateCard = () => {
    if (onClick) {
      onClick();
      return;
    }

    if (externalHref) {
      window.open(externalHref, '_blank', 'noopener,noreferrer');
      return;
    }

    if (to) {
      navigate(to);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!interactive) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      activateCard();
    }
  };

  return (
    <>
      <div
        className={`block h-full overflow-hidden border border-black bg-white transition hover:-translate-y-1 hover:shadow-[8px_8px_0_#111] ${
          interactive ? 'cursor-pointer' : ''
        }`}
        onClick={interactive ? activateCard : undefined}
        onKeyDown={handleKeyDown}
        role={interactive ? (to || externalHref ? 'link' : 'button') : undefined}
        tabIndex={interactive ? 0 : undefined}
      >
        <div className="relative">
          <img src={image} alt={title} className="h-52 w-full border-b border-black object-cover" />
          {expandableImage && (
            <button
              type="button"
              aria-label={`Enlarge image for ${title}`}
              className="absolute left-2 top-2 border border-black bg-white/85 p-1.5 text-black shadow-[2px_2px_0_#111] transition hover:-translate-y-0.5 hover:bg-[#b21f2d] hover:text-white hover:shadow-[4px_4px_0_#111]"
              onClick={(event) => {
                event.stopPropagation();
                setImageOpen(true);
              }}
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <div className="p-6">
          <h3 className="mb-3 text-2xl font-black leading-tight text-black">{title}</h3>
          <p className="mb-5 leading-7 text-neutral-700">{description}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag) => (
              <span
                key={tag}
                className="border border-neutral-300 bg-[#f6f3ed] px-3 py-1 text-xs font-bold uppercase tracking-wide text-neutral-700"
              >
                {tag}
              </span>
            ))}
          </div>
          {label && <span className="accent-link">{label}</span>}
        </div>
      </div>

      {imageOpen && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`${title} image preview`}
          onClick={() => setImageOpen(false)}
        >
          <div className="relative max-h-full max-w-6xl" onClick={(event) => event.stopPropagation()}>
            <img
              src={image}
              alt={title}
              className="max-h-[85dvh] max-w-full border border-white bg-white object-contain"
            />
            <button
              type="button"
              aria-label="Close image preview"
              className="absolute right-3 top-3 border border-black bg-white p-2 text-black transition hover:bg-black hover:text-white"
              onClick={() => setImageOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ExperienceCard;
