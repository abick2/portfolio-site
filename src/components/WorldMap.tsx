import { geoEqualEarth, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { FeatureCollection, Geometry } from "geojson";
import type { GeometryCollection, Topology } from "topojson-specification";
import worldTopo from "world-atlas/countries-110m.json";
import { places } from "@/data/travel";
import WorldMapView from "./WorldMapView";

/**
 * Server half of the travel map: projected at build time, so only path strings
 * reach the client, not the ~100 KB topology.
 */

const WIDTH = 1000;
const HEIGHT = 480;

export default function WorldMap() {
  const topology = worldTopo as unknown as Topology;
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
