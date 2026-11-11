/**
 * Places on the /play/travel map. Coordinates are [longitude, latitude], the
 * order d3-geo expects; reversed pairs plot silently in the wrong hemisphere.
 *
 * TODO: placeholder places. Replace with the real list.
 */

export interface Place {
  id: string;
  city: string;
  country: string;
  /** [lon, lat] */
  coords: [number, number];
  year: string;
  /** One line: what it was, or one thing you remember. */
  note?: string;
}

export const places: Place[] = [
  {
    id: "reykjavik",
    city: "Reykjavík",
    country: "Iceland",
    coords: [-21.9426, 64.1466],
    year: "2024",
    note: "Placeholder note",
  },
  {
    id: "tokyo",
    city: "Tokyo",
    country: "Japan",
    coords: [139.6917, 35.6895],
    year: "2023",
    note: "Placeholder note",
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
