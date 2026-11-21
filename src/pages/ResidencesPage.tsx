import { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { RESIDENCE_TYPOLOGIES } from '../data/ramonaContent';
import type { BuildingType } from '../types/viewing';
import { ArchitecturalImage } from '../components/ArchitecturalImage';

interface ResidencesPageProps {
  onInquireBuilding: (building: BuildingType) => void;
}

export function ResidencesPage({ onInquireBuilding }: ResidencesPageProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | BuildingType>('all');

  const visibleTypologies =
    activeFilter === 'all'
      ? RESIDENCE_TYPOLOGIES
      : RESIDENCE_TYPOLOGIES.filter((t) => t.id === activeFilter);

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16 lg:py-24 space-y-16">
      {/* Editorial Page Header */}
      <div className="border-b border-[#B6AF9D]/60 pb-10 space-y-6">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#534F46]">
          Architectural Collection
        </p>
        <h1 className="font-editorial text-4xl sm:text-6xl text-[#151513] leading-[1.08] max-w-3xl text-balance">
          Residences Proportioned for Comfort and Permanence
        </h1>
        <p className="text-base text-[#534F46] max-w-2xl leading-relaxed">
          Explore our three residential typologies—each engineered for Canadian climates and adaptable to urban infill avenues, private garden lanes, or scenic open lots.
        </p>

        {/* Interactive Typology Filter Tabs */}
        <div
          role="tablist"
          aria-label="Filter Residence Typologies"
          className="flex flex-wrap items-center gap-2 pt-2"
        >
          {(['all', ...RESIDENCE_TYPOLOGIES.map((t) => t.id)] as const).map((tab) => {
            const active = activeFilter === tab;
            return (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveFilter(tab)}
                className={`px-4 py-2 text-xs font-medium uppercase tracking-[0.12em] border transition-colors whitespace-nowrap ${
                  active
                    ? 'bg-[#151513] text-white border-[#151513]'
                    : 'bg-white text-[#534F46] border-[#B6AF9D] hover:border-[#151513] hover:text-[#151513]'
                }`}
              >
                {tab === 'all' ? 'All Typologies' : tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* Residence Sections */}
      <div className="space-y-20">
        {visibleTypologies.map((item, idx) => (
          <article
            key={item.id}
            className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start pb-16 border-b border-[#B6AF9D]/50 last:border-b-0"
          >
            <div className={`lg:col-span-6 ${idx % 2 === 1 ? 'lg:order-2' : ''}`}>
              <div className="aspect-[4/3] overflow-hidden border border-[#B6AF9D]/50 bg-[#EAE4D7]">
                <ArchitecturalImage
                  src={item.image}
                  alt={item.imageAlt}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className={`lg:col-span-6 space-y-6 ${idx % 2 === 1 ? 'lg:order-1' : ''}`}>
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#534F46] tabular-nums">
                  {item.number} · {item.subtitle}
                </p>
                <h2 className="font-editorial text-3xl sm:text-4xl text-[#151513]">
                  {item.title}
                </h2>
              </div>

              <p className="text-base text-[#534F46] leading-relaxed">
                {item.description}
              </p>

              {/* Specs Grid */}
              <dl className="grid grid-cols-2 gap-4 bg-white border border-[#B6AF9D]/60 p-5">
                {item.specs.map((spec) => (
                  <div key={spec.label} className="space-y-1">
                    <dt className="text-xs text-[#534F46]">{spec.label}</dt>
                    <dd className="text-sm font-medium text-[#151513] tabular-nums">
                      {spec.value}
                    </dd>
                  </div>
                ))}
              </dl>

              <ul className="space-y-2.5">
                {item.highlights.map((hl) => (
                  <li key={hl} className="flex items-start gap-2.5 text-sm text-[#151513]">
                    <Check className="w-4 h-4 text-[#534F46] shrink-0 mt-0.5" aria-hidden="true" />
                    <span>{hl}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onInquireBuilding(item.id)}
                  className="inline-flex items-center gap-3 px-6 py-3.5 bg-[#151513] text-white text-xs font-medium uppercase tracking-[0.14em] hover:bg-[#2C2B27] transition-colors"
                >
                  Book Viewing for {item.title}
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
