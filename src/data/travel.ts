/**
 * Countries filled on the /play/travel map. `id` is the ISO 3166-1 numeric
 * code, which is how world-atlas keys its shapes; a name match would break on
 * "United States" vs "United States of America".
 */

export interface Country {
  /** ISO 3166-1 numeric, zero-padded to three digits. */
  id: string;
  name: string;
  /** Optional detail shown under the name. */
  note?: string;
  /**
   * Fill only the parts of the country whose centroid falls inside this
   * [west, south, east, north] box. For overseas territories that were never
   * visited, like French Guiana, which world-atlas draws as part of France.
   */
  within?: [number, number, number, number];
}

export const countries: Country[] = [
  // Africa
  { id: "504", name: "Morocco" },
  // Europe
  { id: "208", name: "Denmark" },
  { id: "233", name: "Estonia" },
  { id: "246", name: "Finland" },
  { id: "250", name: "France", within: [-10, 40, 15, 52] },
  { id: "276", name: "Germany" },
  { id: "300", name: "Greece" },
  { id: "348", name: "Hungary" },
  { id: "352", name: "Iceland" },
  { id: "380", name: "Italy" },
  { id: "528", name: "Netherlands" },
  { id: "578", name: "Norway" },
  { id: "620", name: "Portugal" },
  { id: "724", name: "Spain" },
  { id: "752", name: "Sweden" },
  { id: "756", name: "Switzerland" },
  { id: "826", name: "United Kingdom", note: "England and Scotland" },
  { id: "336", name: "Vatican City" },
  // Americas
  { id: "124", name: "Canada" },
  { id: "320", name: "Guatemala" },
  { id: "840", name: "United States" },
  { id: "533", name: "Aruba" },
];
