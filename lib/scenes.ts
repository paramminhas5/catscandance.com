/**
 * Canonical city + genre vocabularies for programmatic SEO.
 * Slugs only — display names live in dedicated maps below.
 */

export const CITIES = [
  "bangalore",
  "bombay",
  "delhi",
  "goa",
  "pune",
  "hyderabad",
  "chennai",
  "kolkata",
] as const;
export type City = (typeof CITIES)[number];

export const CITY_DISPLAY: Record<City, string> = {
  bangalore: "Bangalore",
  bombay: "Bombay",
  delhi: "Delhi",
  goa: "Goa",
  pune: "Pune",
  hyderabad: "Hyderabad",
  chennai: "Chennai",
  kolkata: "Kolkata",
};

export const CITY_DB_VALUE: Record<City, string> = {
  bangalore: "Bangalore",
  bombay: "Mumbai", // CCD uses "Bombay" colloquially; DB stores "Mumbai"
  delhi: "Delhi",
  goa: "Goa",
  pune: "Pune",
  hyderabad: "Hyderabad",
  chennai: "Chennai",
  kolkata: "Kolkata",
};

export const GENRES = [
  "techno",
  "house",
  "bass",
  "breaks",
  "dnb",
  "garage",
  "ambient",
  "downtempo",
  "minimal",
] as const;
export type Genre = (typeof GENRES)[number];

export const GENRE_DISPLAY: Record<Genre, string> = {
  techno: "Techno",
  house: "House",
  bass: "Bass",
  breaks: "Breaks",
  dnb: "DnB",
  garage: "Garage",
  ambient: "Ambient",
  downtempo: "Downtempo",
  minimal: "Minimal",
};

export function isCity(value: string): value is City {
  return (CITIES as readonly string[]).includes(value);
}

export function isGenre(value: string): value is Genre {
  return (GENRES as readonly string[]).includes(value);
}
