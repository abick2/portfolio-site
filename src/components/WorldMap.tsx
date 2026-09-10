import { geoEqualEarth, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { FeatureCollection, Geometry } from "geojson";
import type { GeometryCollection, Topology } from "topojson-specification";
import worldTopo from "world-atlas/countries-110m.json";
import { places } from "@/data/travel";
import WorldMapView from "./WorldMapView";

/**
 * Server-side half of the travel map.
 *
 * The topology is projected here, at build time, and only the resulting path
 * strings cross into the client bundle. Shipping `countries-110m.json` to the
 * browser would cost ~100 KB to draw something that never changes.
 *
 * Coordinates in the data are [longitude, latitude] — d3-geo's order. Reversed
 * pairs plot silently in the wrong hemisphere rather than erroring.
 */

const WIDTH = 1000;
const HEIGHT = 480;

export default function WorldMap() {
  const topology = worldTopo as unknown as Topology;
  // Narrowed rather than double-cast: @types/topojson-client overloads
  // feature() to return a FeatureCollection when the object is a
  // GeometryCollection, so this keeps the return type checked. Swapping in an
  // atlas whose `countries` is a bare Polygon would then be a type error
  // instead of an undefined `.features` at build time.
  const countries = feature(
    topology,
    topology.objects.countries as GeometryCollection,
  ) as FeatureCollection<Geometry>;

  const projection = geoEqualEarth().fitExtent(
    [
      [8, 8],
      [WIDTH - 8, HEIGHT - 8],
    ],
    countries,
  );

  const pathFor = geoPath(projection);

  const countryPaths = countries.features
    .map((f) => pathFor(f))
    .filter((d): d is string => Boolean(d));

  const pins = places
    .map((place) => {
      const point = projection(place.coords);
      if (!point) return null;
      return {
        id: place.id,
        city: place.city,
        country: place.country,
        year: place.year,
        note: place.note ?? null,
        x: point[0],
        y: point[1],
      };
    })
    .filter((p): p is NonNullable<typeof p> => p !== null);

  return (
    <WorldMapView
      width={WIDTH}
      height={HEIGHT}
      countryPaths={countryPaths}
      pins={pins}
    />
  );
}
