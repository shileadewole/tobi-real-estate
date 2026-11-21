import { ArrowRight } from 'lucide-react';
import {
  CITY_PROFILES,
  IMAGES,
  RESIDENCE_TYPOLOGIES,
} from '../data/ramonaContent';
import type { BuildingType, CityLocation, PageRoute } from '../types/viewing';
import { ArchitecturalImage } from '../components/ArchitecturalImage';
import { ViewingRequestForm } from '../components/ViewingRequestForm';

interface HomePageProps {
  onNavigate: (page: PageRoute) => void;
  onInquireBuilding: (building: BuildingType) => void;
  onInquireCity: (city: CityLocation) => void;
}

export function HomePage({
  onNavigate,
  onInquireBuilding,
  onInquireCity,
}: HomePageProps) {
  return (
    <div>
      {/* 1. Full-Bleed Architectural Hero */}
      <section className="relative h-[86vh] min-h-[580px] max-h-[900px] w-full overflow-hidden bg-[#151513]">
        <ArchitecturalImage
          src={IMAGES.hero}
          alt="Sunlit Ramona's Home luxury architectural living room overlooking skyline and trees at golden hour"
          className="w-full h-full object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#151513]/85 via-[#151513]/30 to-[#151513]/40"
        />

        <div className="absolute inset-x-0 bottom-0 max-w-[1440px] mx-auto px-6 lg:px-12 pb-12 sm:pb-16 lg:pb-20">
          <div className="max-w-3xl space-y-5">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#FCF0D8]">
              Toronto · Vancouver · Montreal · Calgary
            </p>
            <h1 className="font-editorial text-4xl sm:text-6xl lg:text-[64px] text-white leading-[1.06] tracking-tight text-balance">
              Architectural Warmth, Crafted for Quiet Luxury
            </h1>
            <p className="text-base sm:text-lg text-[#FCF0D8]/90 max-w-xl leading-relaxed">
              Bespoke plexes, intimate laneway garden suites, and precision movable homes shaped around natural light and enduring comfort.
            </p>
            <div className="pt-2">
              <a
                href="#home-viewing-section"
                className="inline-flex items-center gap-3 px-7 py-3.5 bg-[#FCF0D8] text-[#151513] text-xs font-semibold uppercase tracking-[0.14em] hover:bg-white transition-colors"
              >
                Schedule a Private Viewing
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Editorial Lead Statement + Asymmetric Dual Media */}
      <section className="max-w-[1440px] mx-auto px-6 lg:px-12 py-20 lg:py-28">
        <div className="max-w-4xl">
          <h2 className="font-editorial text-3xl sm:text-5xl text-[#151513] leading-[1.15] text-balance">
            Ramona&apos;s Home brings rare architectural stillness to residential avenues, private gardens, and open horizons.
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-8">
            <div className="aspect-[4/3] overflow-hidden border border-[#B6AF9D]/40">
              <ArchitecturalImage
                src={IMAGES.laneway}
                alt="Charred cedar and glass garden suite overlooking stone courtyard"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="lg:col-span-4 space-y-6">
            <div className="aspect-[4/3] overflow-hidden border border-[#B6AF9D]/40">
              <ArchitecturalImage
                src={IMAGES.plexes}
                alt="Limestone and bronze architectural plex residence at dusk"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-sm text-[#534F46] leading-relaxed">
              Every commission pairs timeless stone and timber proportions with whisper-quiet acoustic engineering—homes designed to feel immediately calm the moment you step inside.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('residences')}
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#151513] border-b border-[#151513] pb-1 hover:text-[#534F46] hover:border-[#534F46] transition-colors"
            >
              Explore Our Residences
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. Centered Editorial Pull Quote on Warm Champagne Linen */}
      <section className="bg-[#FCF0D8] border-y border-[#B6AF9D]/60 py-20 lg:py-28 px-6 lg:px-12">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <blockquote className="font-editorial italic text-2xl sm:text-4xl text-[#151513] leading-[1.3] text-balance">
            &ldquo;True luxury is never loud. It lives in the warmth of afternoon light across honed stone, the quiet of a well-framed doorway, and spaces that adapt effortlessly to a family&apos;s rhythm.&rdquo;
          </blockquote>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#534F46]">
            Ramona&apos;s Home Architectural Studio
          </p>
        </div>
      </section>

      {/* 4. Three Signature Typologies (111w57 3-Card Row) */}
      <section className="max-w-[1440px] mx-auto px-6 lg:px-12 py-20 lg:py-28">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-[#B6AF9D]/60">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#534F46]">
              Signature Portfolio
            </p>
            <h2 className="font-editorial text-3xl sm:text-5xl text-[#151513] leading-tight text-balance">
              Three Distinct Ways to Live Well
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('residences')}
            className="self-start md:self-auto inline-flex items-center gap-2 px-5 py-2.5 border border-[#151513] text-xs font-medium uppercase tracking-[0.12em] text-[#151513] hover:bg-[#151513] hover:text-white transition-colors whitespace-nowrap"
          >
            View All Specifications
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {RESIDENCE_TYPOLOGIES.map((item) => (
            <article key={item.id} className="group flex flex-col justify-between space-y-5">
              <div className="space-y-4">
                <div className="aspect-[4/3] overflow-hidden border border-[#B6AF9D]/50 bg-[#EAE4D7]">
                  <ArchitecturalImage
                    src={item.image}
                    alt={item.imageAlt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                </div>
                <div className="flex items-baseline justify-between gap-4 border-b border-[#B6AF9D]/40 pb-2">
                  <h3 className="font-editorial text-2xl text-[#151513]">{item.title}</h3>
                  <span className="text-xs font-medium text-[#534F46] tabular-nums">
                    {item.number}
                  </span>
                </div>
                <p className="text-sm text-[#534F46] leading-relaxed">
                  {item.summary}
                </p>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onInquireBuilding(item.id)}
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#151513] hover:text-[#9A4109] transition-colors"
                >
                  Inquire About {item.title}
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 5. Asymmetric Craftsmanship Split */}
      <section className="max-w-[1440px] mx-auto px-6 lg:px-12 pb-20 lg:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-6">
            <div className="aspect-[3/4] max-h-[680px] w-full overflow-hidden border border-[#B6AF9D]/50">
              <ArchitecturalImage
                src={IMAGES.craftsmanship}
                alt="Monolithic travertine kitchen island with fluted oak millwork and morning shadows"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6 lg:pl-6">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#534F46]">
              Material Craftsmanship
            </p>
            <h2 className="font-editorial text-3xl sm:text-5xl text-[#151513] leading-[1.12] text-balance">
              A celebration of tactile stone, warm oak, and daylight.
            </h2>
            <p className="text-base text-[#534F46] leading-relaxed">
              Whether anchoring an urban fourplex in Montreal or placing a precision movable pavilion outside Calgary, our residences begin with honest architectural materials—honed travertine, charred Western red cedar, and custom blackened bronze glazing.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => onNavigate('architecture')}
                className="inline-flex items-center gap-3 px-6 py-3 border border-[#151513] text-xs font-medium uppercase tracking-[0.14em] text-[#151513] hover:bg-[#151513] hover:text-white transition-colors"
              >
                Explore Design &amp; Materials
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Obsidian Contrast Band: Four Canadian Cities */}
      <section className="bg-[#151513] text-white py-20 lg:py-24 px-6 lg:px-12">
        <div className="max-w-[1440px] mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/15 pb-8">
            <div className="space-y-3 max-w-2xl">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#FAE04B]">
                Regional Presence
              </p>
              <h2 className="font-editorial text-3xl sm:text-5xl text-white leading-tight text-balance">
                Four Cities. One Architectural Standard.
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('cities')}
              className="self-start md:self-auto inline-flex items-center gap-2 px-5 py-2.5 border border-[#FCF0D8]/50 text-xs font-medium uppercase tracking-[0.12em] text-[#FCF0D8] hover:bg-[#FCF0D8] hover:text-[#151513] transition-colors whitespace-nowrap"
            >
              Explore All Cities
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {CITY_PROFILES.map((item, idx) => (
              <div
                key={item.city}
                className="border-t border-white/20 pt-6 flex flex-col justify-between space-y-5"
              >
                <div className="space-y-2.5">
                  <span className="text-xs font-medium text-[#FAE04B] tabular-nums">
                    0{idx + 1} · {item.region}
                  </span>
                  <h3 className="font-editorial text-3xl text-white">
                    {item.city}
                  </h3>
                  <p className="text-sm text-[#FCF0D8]/80 leading-relaxed">
                    {item.headline}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onInquireCity(item.city)}
                  className="self-start inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.12em] text-[#FAE04B] hover:text-white transition-colors"
                >
                  Book in {item.city}
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Private Viewing Conversion Section */}
      <section
        id="home-viewing-section"
        className="max-w-[1440px] mx-auto px-6 lg:px-12 py-20 lg:py-28"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-28">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#534F46]">
              Private Appointments
            </p>
            <h2 className="font-editorial text-3xl sm:text-4xl text-[#151513] leading-tight">
              Begin a Conversation About Your Next Home
            </h2>
            <p className="text-sm text-[#534F46] leading-relaxed">
              Select your preferred residence style, investment range, and viewing window. Our scheduling concierge checks live availability immediately and presents open alternatives whenever a slot is already reserved.
            </p>
            <div className="pt-4 border-t border-[#B6AF9D]/60 space-y-2 text-sm text-[#534F46]">
              <p className="font-medium text-[#151513]">Direct Studio Desk</p>
              <p>Toronto · Vancouver · Montreal · Calgary</p>
              <p className="tabular-nums">+1 (416) 555-0148</p>
            </div>
          </div>

          <div className="lg:col-span-8">
            <ViewingRequestForm id="home-viewing-form" />
          </div>
        </div>
      </section>
    </div>
  );
}
