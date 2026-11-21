import { useEffect, useState } from 'react';
import type { BuildingType, CityLocation, PageRoute } from './types/viewing';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ResidencesPage } from './pages/ResidencesPage';
import { ArchitecturePage } from './pages/ArchitecturePage';
import { CitiesPage } from './pages/CitiesPage';
import { ViewingPage } from './pages/ViewingPage';

const VALID_PAGES = new Set<PageRoute>([
  'home',
  'residences',
  'architecture',
  'cities',
  'viewing',
]);

function getInitialPage(): PageRoute {
  const hash = window.location.hash.replace('#', '') as PageRoute;
  return VALID_PAGES.has(hash) ? hash : 'home';
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageRoute>(getInitialPage);
  const [preselectedBuilding, setPreselectedBuilding] = useState<BuildingType | undefined>(
    undefined
  );
  const [preselectedCity, setPreselectedCity] = useState<CityLocation | undefined>(
    undefined
  );

  useEffect(() => {
    const onHashChange = () => {
      const next = window.location.hash.replace('#', '') as PageRoute;
      if (VALID_PAGES.has(next)) {
        setCurrentPage(next);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigateTo = (page: PageRoute) => {
    setCurrentPage(page);
    if (window.location.hash !== `#${page}`) {
      window.history.pushState(null, '', `#${page}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInquireBuilding = (building: BuildingType) => {
    setPreselectedBuilding(building);
    navigateTo('viewing');
  };

  const handleInquireCity = (city: CityLocation) => {
    setPreselectedCity(city);
    navigateTo('viewing');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F0] text-[#151513] relative">
      <Navbar
        currentPage={currentPage}
        onNavigate={navigateTo}
        overHero={currentPage === 'home'}
      />

      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={navigateTo}
            onInquireBuilding={handleInquireBuilding}
            onInquireCity={handleInquireCity}
          />
        )}
        {currentPage === 'residences' && (
          <ResidencesPage onInquireBuilding={handleInquireBuilding} />
        )}
        {currentPage === 'architecture' && (
          <ArchitecturePage onNavigate={navigateTo} />
        )}
        {currentPage === 'cities' && (
          <CitiesPage onInquireCity={handleInquireCity} />
        )}
        {currentPage === 'viewing' && (
          <ViewingPage
            preselectedBuilding={preselectedBuilding}
            preselectedCity={preselectedCity}
          />
        )}
      </main>

      <Footer onNavigate={navigateTo} />
    </div>
  );
}
