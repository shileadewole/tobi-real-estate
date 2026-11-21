import { useState } from 'react';
import { Building2 } from 'lucide-react';

interface ArchitecturalImageProps {
  src: string;
  alt: string;
  className?: string;
  caption?: string;
}

export function ArchitecturalImage({
  src,
  alt,
  className = '',
  caption,
}: ArchitecturalImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-[#EAE4D7] border border-[#B6AF9D]/50 text-[#534F46] p-8 ${className}`}
      >
        <Building2 className="w-8 h-8 mb-3 stroke-[1.25] text-[#534F46]" aria-hidden="true" />
        <span className="font-editorial text-lg text-center text-[#151513]">
          {caption || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
