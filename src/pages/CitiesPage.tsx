import { useState } from 'react';
import { ArrowRight, MapPin } from 'lucide-react';
import { CITY_PROFILES } from '../data/ramonaContent';
import type { CityLocation } from '../types/viewing';
import { ArchitecturalImage } from '../components/ArchitecturalImage';

interface CitiesPageProps {
  onInquireCity: (city: CityLocation) => void;
}

export function CitiesPage({ onInquireCity }: CitiesPageProps) {
  const [selectedCity, setSelectedCity] = useState<CityLocation>('Toronto');
  const activeProfile =
    CITY_PROFILES.find((c) => c.city === selectedCity) || CITY_PROFILES[0];

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16 lg:py-24 space-y-16">
      <div className="border-b border-[#B6AF9D]/60 pb-10 space-y-6">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#534F46]">
          Canadian Presence
        </p>
        <h1 className="font-editorial text-4xl sm:text-6xl text-[#151513] leading-[1.08] max-w-3xl text-balance">
          Toronto, Vancouver, Montreal &amp; Calgary
        </h1>
        <p className="text-base text-[#534F46] max-w-2xl leading-relaxed">
          Each city demands a distinct architectural response—from Toronto&apos;s multiplex avenues and Vancouver&apos;s cedar laneways to Montreal&apos;s stone triplexes and Calgary&apos;s foothills vistas.
        </p>

        {/* City Selector Bar */}
        <div className="flex flex-wrap gap-2 pt-2">
          {CITY_PROFILES.map((item) => {
            const active = item.city === selectedCity;
            return (
              <button
                key={item.city}
                type="button"
                onClick={() => setSelectedCity(item.city)}
                aria-pressed={active}
                className={`px-5 py-2.5 text-xs font-medium uppercase tracking-[0.12em] border transition-colors ${
                  active
                    ? 'bg-[#151513] text-white border-[#151513]'
                    : 'bg-white text-[#151513] border-[#B6AF9D] hover:bg-[#FCF0D8]'
                }`}
              >
                {item.city}
              </button>
            );
          })}
        </div>
      </div>

      {/* Featured City Spotlight */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center bg-white border border-[#B6AF9D] p-6 sm:p-10">
        <div className="lg:col-span-6">
          <div className="aspect-[4/3] overflow-hidden border border-[#B6AF9D]/40">
            <ArchitecturalImage
              src={activeProfile.image}
              alt={activeProfile.imageAlt}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="lg:col-span-6 space-y-6">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-[#534F46]">
            <MapPin className="w-4 h-4 text-[#151513]" aria-hidden="true" />
            <span>
              {activeProfile.city}, {activeProfile.region}
            </span>
          </div>

          <h2 className="font-editorial text-3xl sm:text-4xl text-[#151513] leading-tight">
            {activeProfile.headline}
          </h2>

          <p className="text-base text-[#534F46] leading-relaxed">
            {activeProfile.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#B6AF9D]/50">
            <div>
              <span className="block text-xs text-[#534F46]">Key Neighborhoods</span>
              <span className="text-sm font-medium text-[#151513] mt-1 block">
                {activeProfile.neighborhoods}
              </span>
            </div>
            <div>
              <span className="block text-xs text-[#534F46]">Zoning Specialization</span>
              <span className="text-sm font-medium text-[#151513] mt-1 block">
                {activeProfile.zoningFocus}
              </span>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => onInquireCity(activeProfile.city)}
              className="inline-flex items-center gap-3 px-6 py-3.5 bg-[#151513] text-white text-xs font-medium uppercase tracking-[0.14em] hover:bg-[#2C2B27] transition-colors"
            >
              Book a Private Viewing in {activeProfile.city}
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Overview Grid of All Four Cities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {CITY_PROFILES.map((item) => (
          <div
            key={item.city}
            className="border border-[#B6AF9D]/70 bg-[#FAF7F0] p-8 flex flex-col justify-between space-y-5"
          >
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#534F46]">
                {item.region}
              </p>
              <h3 className="font-editorial text-3xl text-[#151513]">{item.city}</h3>
              <p className="text-sm text-[#534F46] leading-relaxed">{item.description}</p>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-[#B6AF9D]/40">
              <span className="text-xs text-[#534F46]">{item.zoningFocus}</span>
              <button
                type="button"
                onClick={() => onInquireCity(item.city)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#151513] hover:text-[#9A4109] transition-colors whitespace-nowrap"
              >
                Schedule Tour
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
