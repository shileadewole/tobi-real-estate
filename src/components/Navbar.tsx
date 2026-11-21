import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import type { PageRoute } from '../types/viewing';

interface NavbarProps {
  currentPage: PageRoute;
  onNavigate: (page: PageRoute) => void;
  overHero?: boolean;
}

const NAV_ITEMS: Array<{ id: PageRoute; label: string }> = [
  { id: 'home', label: 'Home' },
  { id: 'residences', label: 'Residences' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'cities', label: 'Cities' },
];

export function Navbar({ currentPage, onNavigate, overHero = false }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLinkClick = (page: PageRoute) => {
    setMobileOpen(false);
    onNavigate(page);
  };

  return (
    <header
      className={`w-full z-40 transition-colors ${
        overHero
          ? 'absolute top-0 left-0 right-0 text-white border-b border-white/20 bg-gradient-to-b from-[#151513]/70 to-transparent'
          : 'sticky top-0 bg-[#FAF7F0]/95 backdrop-blur-sm text-[#151513] border-b border-[#B6AF9D]/60'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 h-16 sm:h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <button
          type="button"
          onClick={() => handleLinkClick('home')}
          className="font-editorial text-xl sm:text-2xl tracking-[0.06em] uppercase whitespace-nowrap shrink-0 text-left focus-visible:outline-2 focus-visible:outline-offset-4"
        >
          Ramona&apos;s Home
        </button>

        {/* Zone 2: Concise Single-Line Navigation Links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-8 text-sm font-medium"
        >
          {NAV_ITEMS.map((item) => {
            const active = currentPage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleLinkClick(item.id)}
                aria-current={active ? 'page' : undefined}
                className={`whitespace-nowrap shrink-0 py-1 border-b transition-colors ${
                  active
                    ? overHero
                      ? 'border-[#FAE04B] text-white'
                      : 'border-[#151513] text-[#151513]'
                    : overHero
                      ? 'border-transparent text-white/85 hover:text-white hover:border-white/50'
                      : 'border-transparent text-[#534F46] hover:text-[#151513] hover:border-[#B6AF9D]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Single Primary CTA + Mobile Trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handleLinkClick('viewing')}
            className={`hidden sm:inline-flex items-center px-5 py-2.5 text-xs font-medium tracking-wider uppercase whitespace-nowrap shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${
              overHero
                ? 'bg-[#FCF0D8] text-[#151513] hover:bg-white'
                : 'bg-[#151513] text-white hover:bg-[#2C2B27]'
            }`}
          >
            Book a Viewing
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className={`md:hidden p-2 border ${
              overHero
                ? 'border-white/30 text-white'
                : 'border-[#B6AF9D] text-[#151513]'
            }`}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-[#FAF7F0] text-[#151513] border-b border-[#B6AF9D] px-6 py-6 space-y-4">
          <nav aria-label="Mobile Navigation" className="flex flex-col space-y-3">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleLinkClick(item.id)}
                className={`text-left py-2 text-base font-medium border-b border-[#B6AF9D]/30 ${
                  currentPage === item.id ? 'text-[#151513]' : 'text-[#534F46]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
          <button
            type="button"
            onClick={() => handleLinkClick('viewing')}
            className="w-full py-3 bg-[#151513] text-white text-xs font-medium uppercase tracking-wider"
          >
            Book a Viewing
          </button>
        </div>
      )}
    </header>
  );
}
