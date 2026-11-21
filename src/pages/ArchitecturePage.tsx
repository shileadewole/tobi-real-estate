import { ArrowRight } from 'lucide-react';
import { CRAFT_PILLARS, IMAGES } from '../data/ramonaContent';
import type { PageRoute } from '../types/viewing';
import { ArchitecturalImage } from '../components/ArchitecturalImage';

interface ArchitecturePageProps {
  onNavigate: (page: PageRoute) => void;
}

const MATERIAL_PALETTE = [
  {
    name: 'Honed Roman Travertine',
    origin: 'Kitchen Monoliths & Hearth Surrounds',
    description:
      'Unfilled matte travertine brings subtle fossil veining and organic warmth to islands, vanities, and entry thresholds.',
  },
  {
    name: 'Quarter-Sawn White Oak',
    origin: 'Flooring & Fluted Millwork',
    description:
      'Wide-plank matte-oiled oak runs continuously from living halls into private bedrooms, softening acoustics and underfoot feel.',
  },
  {
    name: 'Shou Sugi Ban Western Cedar',
    origin: 'Laneway & Movable Exterior Cladding',
    description:
      'Deeply charred Canadian cedar resists moisture, insects, and freeze-thaw cycles without synthetic surface coatings.',
  },
  {
    name: 'Blackened Architectural Bronze',
    origin: 'Window Mullions & Custom Hardware',
    description:
      'Slim thermal-break bronze frames maximize panoramic daylight while grounding every room in crisp geometric lines.',
  },
];

export function ArchitecturePage({ onNavigate }: ArchitecturePageProps) {
  return (
    <div className="space-y-20 pb-20">
      <section className="max-w-[1440px] mx-auto px-6 lg:px-12 pt-16 lg:pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center border-b border-[#B6AF9D]/60 pb-16">
          <div className="lg:col-span-6 space-y-6">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#534F46]">
              Architecture &amp; Craft
            </p>
            <h1 className="font-editorial text-4xl sm:text-6xl text-[#151513] leading-[1.08] text-balance">
              Built for Quiet Light and Decades of Comfort
            </h1>
            <p className="text-base text-[#534F46] leading-relaxed">
              Every Ramona&apos;s Home structure balances architectural poise with high-performance building science—pairing museum-grade interior millwork with serene thermal and acoustic envelopes.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('viewing')}
              className="inline-flex items-center gap-3 px-6 py-3.5 bg-[#151513] text-white text-xs font-medium uppercase tracking-[0.14em] hover:bg-[#2C2B27] transition-colors"
            >
              Arrange a Studio Material Review
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          <div className="lg:col-span-6">
            <div className="aspect-[3/4] max-h-[620px] w-full overflow-hidden border border-[#B6AF9D]/50">
              <ArchitecturalImage
                src={IMAGES.craftsmanship}
                alt="Architectural interior featuring monolithic travertine island and fluted oak cabinetry"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Craft Pillars */}
      <section className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CRAFT_PILLARS.map((pillar) => (
            <div
              key={pillar.number}
              className="bg-white border border-[#B6AF9D]/60 p-8 space-y-4"
            >
              <span className="text-xs font-medium text-[#534F46] tabular-nums">
                {pillar.number}
              </span>
              <h2 className="font-editorial text-2xl text-[#151513]">
                {pillar.title}
              </h2>
              <p className="text-sm text-[#534F46] leading-relaxed">
                {pillar.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Material Palette */}
      <section className="bg-[#FCF0D8] border-y border-[#B6AF9D]/60 py-20 px-6 lg:px-12">
        <div className="max-w-[1440px] mx-auto space-y-12">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#534F46]">
              Material Library
            </p>
            <h2 className="font-editorial text-3xl sm:text-5xl text-[#151513] leading-tight">
              A Tactile Palette That Ages With Grace
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MATERIAL_PALETTE.map((mat) => (
              <div
                key={mat.name}
                className="bg-white border border-[#B6AF9D] p-7 space-y-2.5"
              >
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#534F46]">
                  {mat.origin}
                </p>
                <h3 className="font-editorial text-2xl text-[#151513]">
                  {mat.name}
                </h3>
                <p className="text-sm text-[#534F46] leading-relaxed">
                  {mat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
