import type { BuildingType, CityLocation } from '../types/viewing';
import { ViewingRequestForm } from '../components/ViewingRequestForm';
import { IMAGES } from '../data/ramonaContent';
import { ArchitecturalImage } from '../components/ArchitecturalImage';

interface ViewingPageProps {
  preselectedBuilding?: BuildingType;
  preselectedCity?: CityLocation;
}

export function ViewingPage({
  preselectedBuilding,
  preselectedCity,
}: ViewingPageProps) {
  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16 lg:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-4 space-y-8">
          <div className="space-y-4">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#534F46]">
              Private Viewing
            </p>
            <h1 className="font-editorial text-4xl sm:text-5xl text-[#151513] leading-[1.1] text-balance">
              Experience a Ramona&apos;s Home Residence in Person
            </h1>
            <p className="text-sm text-[#534F46] leading-relaxed">
              Appointments are conducted one-on-one with a senior architectural advisor in Toronto, Vancouver, Montreal, or Calgary. Availability is verified live upon submission.
            </p>
          </div>

          <div className="aspect-[4/3] overflow-hidden border border-[#B6AF9D]/60">
            <ArchitecturalImage
              src={IMAGES.hero}
              alt="Sunlit interior lounge of a Ramona's Home residence"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="bg-[#FCF0D8] border border-[#B6AF9D] p-6 space-y-3 text-sm">
            <h2 className="font-editorial text-2xl text-[#151513]">
              What to Expect
            </h2>
            <ul className="space-y-2 text-[#534F46]">
              <li>· Private walkthrough of finished plex, garden suite, or movable models</li>
              <li>· Review of travertine, oak, and cedar architectural material samples</li>
              <li>· Site feasibility and budget alignment for your lot or preferred city</li>
            </ul>
          </div>
        </div>

        <div className="lg:col-span-8">
          <ViewingRequestForm
            id="dedicated-viewing-form"
            preselectedBuilding={preselectedBuilding}
            preselectedCity={preselectedCity}
          />
        </div>
      </div>
    </div>
  );
}
