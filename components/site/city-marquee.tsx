/**
 * CityMarquee — rolling ticker of Indian cities + global origins.
 * Sits between Hero and CCDxSocial / About on the homepage.
 * Direct port of CCD v1's <CityMarquee>.
 */

const ITEMS = [
  "NOW PLAYING IN BENGALURU",
  "◆",
  "UPCOMING IN MUMBAI",
  "◆",
  "UNDERGROUND DELHI",
  "◆",
  "GOA JUNGLE PARTIES",
  "◆",
  "HYDERABAD RISING",
  "◆",
  "PUNE ALL NIGHT",
  "◆",
  "DETROIT TECHNO",
  "◆",
  "CHICAGO HOUSE",
  "◆",
  "LONDON JUNGLE",
  "◆",
  "BERLIN DARK ROOMS",
  "◆",
  "GOA TRANCE ORIGIN",
  "◆",
];

export function CityMarquee() {
  const doubled = [...ITEMS, ...ITEMS];
  return (
    <div className="bg-acid-yellow border-b-4 border-ink overflow-hidden py-3 select-none">
      <div
        className="flex whitespace-nowrap gap-8"
        style={{ animation: "marquee 30s linear infinite" }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className="font-display text-sm uppercase text-ink tracking-widest shrink-0"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
