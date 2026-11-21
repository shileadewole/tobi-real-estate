import type { BuildingType, CityLocation } from '../types/viewing';

export const IMAGES = {
  hero: '/src/assets/images/hero_ramona_residence_1795286083152.jpg',
  plexes: '/src/assets/images/building_plexes_1795286082852.jpg',
  laneway: '/src/assets/images/building_laneway_1795286083337.jpg',
  movable: '/src/assets/images/building_movable_1795286082835.jpg',
  craftsmanship: '/src/assets/images/interior_craftsmanship_1795286082894.jpg',
} as const;

export interface ResidenceTypology {
  id: BuildingType;
  number: string;
  title: string;
  subtitle: string;
  summary: string;
  description: string;
  image: string;
  imageAlt: string;
  specs: Array<{ label: string; value: string }>;
  highlights: string[];
}

export const RESIDENCE_TYPOLOGIES: ResidenceTypology[] = [
  {
    id: 'Plexes',
    number: '01',
    title: 'Plexes',
    subtitle: 'Multi-generational urban architecture',
    summary:
      'Honed limestone and bronze-framed duplexes, triplexes, and fourplexes proportioned for quiet residential avenues.',
    description:
      'Designed for refined urban density without sacrificing acoustic stillness or natural light. Each floor plate functions as a private full-floor sanctuary with dedicated outdoor terraces, acoustic floor assemblies, and radiant hydronic comfort.',
    image: IMAGES.plexes,
    imageAlt:
      'Contemporary three-story limestone and dark bronze architectural plex residence at twilight',
    specs: [
      { label: 'Configurations', value: 'Duplex, Triplex & Fourplex' },
      { label: 'Interior Area', value: '2,400 – 4,800 sq ft' },
      { label: 'Envelope', value: 'Honed Limestone & Bronze' },
      { label: 'Typical Investment', value: 'From $1.65M CAD' },
    ],
    highlights: [
      'Independent private entries with sculptural stone thresholds',
      'Triple-glazed acoustic curtain walls and custom white oak millwork',
      'Flexible legal multi-suite layouts for family living or long-term yield',
    ],
  },
  {
    id: 'Laneway Houses & Garden Suites',
    number: '02',
    title: 'Laneway Houses & Garden Suites',
    subtitle: 'Intimate courtyard sanctuaries',
    summary:
      'Charred cedar and glass garden residences tucked quietly behind primary lots, framing private landscaped courtyards.',
    description:
      'Our laneway and garden suites unlock underutilized urban land while preserving canopy privacy. Floor-to-ceiling sliding glass opens onto bluestone terraces, creating effortless indoor-outdoor flow for studio, guest, or principal living.',
    image: IMAGES.laneway,
    imageAlt:
      'Modern charred cedar and warm oak laneway garden suite overlooking a manicured stone courtyard',
    specs: [
      { label: 'Footprint', value: '650 – 1,450 sq ft' },
      { label: 'Levels', value: '1 to 2 Stories' },
      { label: 'Cladding', value: 'Shou Sugi Ban Cedar & Oak' },
      { label: 'Typical Investment', value: 'From $485K CAD' },
    ],
    highlights: [
      'Turnkey municipal permitting across Toronto, Vancouver, Montreal & Calgary',
      'Vaulted cedar soffits with recessed architectural cove lighting',
      'Net-zero-ready heat pump climate system and heated stone floors',
    ],
  },
  {
    id: 'Movable Houses',
    number: '03',
    title: 'Movable Houses',
    subtitle: 'Precision-engineered relocatable luxury',
    summary:
      'Architectural timber-and-steel pavilions fabricated in climate-controlled studios and placed with minimal site disturbance.',
    description:
      'Engineered to travel without compromising residential permanence. Delivered 95% complete with cantilevered terraces, monolithic travertine counters, and panoramic structural glazing ready for urban infill lots or rural estates.',
    image: IMAGES.movable,
    imageAlt:
      'Precision-crafted modular movable timber and glass pavilion overlooking golden foothills',
    specs: [
      { label: 'Interior Area', value: '520 – 1,680 sq ft' },
      { label: 'Installation', value: '14 Days On-Site' },
      { label: 'Structure', value: 'Cantilevered Steel & Mass Timber' },
      { label: 'Typical Investment', value: 'From $390K CAD' },
    ],
    highlights: [
      'Helical pier foundation systems enabling effortless future relocation',
      'Factory-calibrated R-42 thermal envelope built for Canadian winters',
      'Optional off-grid solar storage and rainwater filtration architecture',
    ],
  },
];

export interface CityProfile {
  city: CityLocation;
  region: string;
  headline: string;
  description: string;
  neighborhoods: string;
  zoningFocus: string;
  image: string;
  imageAlt: string;
}

export const CITY_PROFILES: CityProfile[] = [
  {
    city: 'Toronto',
    region: 'Ontario',
    headline: 'Tree-lined Annex avenues and sunlit laneway corridors.',
    description:
      'From Multiplex-ready Victorian lots in Rosedale and Riverdale to serene laneway suites across Trinity Bellwoods, our Toronto studio handles Committee of Adjustment approvals and turnkey fabrication.',
    neighborhoods: 'Rosedale · Summerhill · Riverdale · High Park',
    zoningFocus: 'As-of-right Multiplexes & Toronto Laneway Suites',
    image: IMAGES.plexes,
    imageAlt: 'Limestone plex architecture suited for Toronto residential avenues',
  },
  {
    city: 'Vancouver',
    region: 'British Columbia',
    headline: 'West Coast cedar warmth sculpted for coastal light.',
    description:
      'Tailored for Kitsilano, Shaughnessy, and Mount Pleasant lots where rainwater management, natural cedar textures, and tranquil courtyard setbacks elevate everyday comfort.',
    neighborhoods: 'Kitsilano · Mount Pleasant · Kerrisdale · North Shore',
    zoningFocus: 'SSMUH Multiplexes & Laneway Homes',
    image: IMAGES.laneway,
    imageAlt: 'Cedar and glass garden suite surrounded by lush Vancouver greenery',
  },
  {
    city: 'Montreal',
    region: 'Quebec',
    headline: 'Timeless stone craftsmanship reimagined for the Plateau.',
    description:
      'Honoring Montreal’s architectural heritage of exterior staircases, limestone facades, and intimate inner alleys with deep winter insulation and acoustic calm.',
    neighborhoods: 'Westmount · Outremont · Plateau-Mont-Royal · Griffintown',
    zoningFocus: 'Boutique Triplexes & Courtyard Pavilions',
    image: IMAGES.craftsmanship,
    imageAlt: 'Travertine and fluted oak dining pavilion inspired by Montreal interiors',
  },
  {
    city: 'Calgary',
    region: 'Alberta',
    headline: 'Wide prairie horizons and foothills-ready movable homes.',
    description:
      'Built for expansive Elbow Park infill lots and sweeping foothills acreages, pairing panoramic triple-pane glass with high-efficiency thermal envelopes.',
    neighborhoods: 'Elbow Park · Altadore · Bridgeland · Foothills County',
    zoningFocus: 'R-CG Infill Plexes, Backyard Suites & Movable Estates',
    image: IMAGES.movable,
    imageAlt: 'Timber and panoramic glass movable house overlooking Alberta foothills',
  },
];

export const CRAFT_PILLARS = [
  {
    number: '01',
    title: 'Tactile Material Honesty',
    detail:
      'Honed travertine slabs, quarter-sawn white oak, lime plaster walls, and patinated bronze hardware selected to age gracefully over decades.',
  },
  {
    number: '02',
    title: 'Quiet Thermal & Acoustic Comfort',
    detail:
      'Continuous exterior insulation, triple-glazed low-iron glass, and hydronic radiant floors keep interiors whisper-quiet through every Canadian season.',
  },
  {
    number: '03',
    title: 'Single-Studio Accountability',
    detail:
      'Architectural design, municipal permitting, precision millwork, and site placement coordinated seamlessly under one private concierge team.',
  },
];
