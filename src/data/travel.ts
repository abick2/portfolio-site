/**
 * Places, plotted on the world map at /play/travel.
 *
 * Coordinates are [longitude, latitude] — that order, because that is what
 * d3-geo expects and silently mis-plots if you reverse it.
 *
 * PLACEHOLDER PLACES — these are real coordinates for real cities, but they are
 * my guesses at somewhere you might have been, not a record of where you went.
 * Replace the whole list.
 */

export interface Place {
  id: string;
  city: string;
  country: string;
  /** [lon, lat] */
  coords: [number, number];
  year: string;
  /** One line. What it was, or one thing you remember. */
  note?: string;
  /** Photos from this trip. */
  images?: { src: string; alt: string }[];
  /** Marks trips worth featuring above the map. */
  featured?: boolean;
}

export const places: Place[] = [
  {
    id: "reykjavik",
    city: "Reykjavík",
    country: "Iceland",
    coords: [-21.9426, 64.1466],
    year: "2024",
    note: "Placeholder note",
    featured: true,
    images: [{ src: "/images/travel/iceland-1.svg", alt: "Placeholder" }],
  },
  {
    id: "tokyo",
    city: "Tokyo",
    country: "Japan",
    coords: [139.6917, 35.6895],
    year: "2023",
    note: "Placeholder note",
    featured: true,
    images: [{ src: "/images/travel/japan-1.svg", alt: "Placeholder" }],
  },
  {
    id: "lisbon",
    city: "Lisbon",
    country: "Portugal",
    coords: [-9.1393, 38.7223],
    year: "2023",
    note: "Placeholder note",
  },
  {
    id: "cusco",
    city: "Cusco",
    country: "Peru",
    coords: [-71.9675, -13.5319],
    year: "2022",
    note: "Placeholder note",
    featured: true,
  },
  {
    id: "queenstown",
    city: "Queenstown",
    country: "New Zealand",
    coords: [168.6626, -45.0312],
    year: "2022",
    note: "Placeholder note",
  },
  {
    id: "marrakesh",
    city: "Marrakesh",
    country: "Morocco",
    coords: [-7.9811, 31.6295],
    year: "2019",
    note: "Placeholder note",
  },
];

