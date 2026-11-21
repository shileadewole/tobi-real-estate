import type { PageRoute } from '../types/viewing';

interface FooterProps {
  onNavigate: (page: PageRoute) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-[#FAF7F0] border-t border-[#B6AF9D] text-[#151513]">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-14 border-b border-[#B6AF9D]/60">
          <div className="md:col-span-5 space-y-4">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="font-editorial text-3xl tracking-[0.06em] uppercase text-[#151513] text-left"
            >
              Ramona&apos;s Home
            </button>
            <p className="text-sm text-[#534F46] leading-relaxed max-w-sm">
              Architectural Plexes, Laneway Houses &amp; Garden Suites, and Movable Houses crafted for serene, enduring living across Canada.
            </p>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-medium uppercase tracking-[0.14em] text-[#534F46]">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('residences')}
                  className="text-[#151513] hover:text-[#534F46] transition-colors"
                >
                  Residences
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('architecture')}
                  className="text-[#151513] hover:text-[#534F46] transition-colors"
                >
                  Architecture &amp; Craft
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('cities')}
                  className="text-[#151513] hover:text-[#534F46] transition-colors"
                >
                  Cities &amp; Neighborhoods
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('viewing')}
                  className="text-[#151513] hover:text-[#534F46] transition-colors"
                >
                  Private Viewing
                </button>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-medium uppercase tracking-[0.14em] text-[#534F46]">
              Regional Studios
            </h4>
            <p className="text-sm text-[#151513] leading-relaxed">
              Toronto · Vancouver · Montreal · Calgary
            </p>
            <p className="text-sm text-[#534F46]">
              concierge@ramonashome.ca
            </p>
            <p className="text-sm text-[#534F46] tabular-nums">
              +1 (416) 555-0148
            </p>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-[#534F46]">
          <p>&copy; {new Date().getFullYear()} Ramona&apos;s Home Architectural Residences. All rights reserved.</p>
          <p>Private Tours by Appointment · Canada</p>
        </div>
      </div>
    </footer>
  );
}
