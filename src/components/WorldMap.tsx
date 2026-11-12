import { geoCentroid, geoEqualEarth, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import type { GeometryCollection, Topology } from "topojson-specification";
import worldTopo from "world-atlas/countries-110m.json";
import detailTopo from "world-atlas/countries-50m.json";
import { countries } from "@/data/travel";

/**
 * The travel map, projected at build time so only path strings ship, not the
 * topology. Visited countries are filled. The 110m atlas drops anything
 * smaller than a pixel at this size (Vatican City, Aruba), so those are looked
 * up in the 50m atlas and drawn as a dot at their centroid instead.
 */

const WIDTH = 1000;
const HEIGHT = 480;

const VISITED = "color-mix(in srgb, var(--color-ink) 82%, transparent)";

function featuresOf(topo: unknown): Feature<Geometry>[] {
  const topology = topo as Topology;
  return (
    feature(
      topology,
      topology.objects.countries as GeometryCollection,
    ) as FeatureCollection<Geometry>
  ).features;
}

export default function WorldMap() {
  const world = featuresOf(worldTopo);
  const names = new Map(countries.map((c) => [c.id, c.name]));
  const bounds = new Map(countries.map((c) => [c.id, c.within]));

  const projection = geoEqualEarth().fitExtent(
    [
      [8, 8],
      [WIDTH - 8, HEIGHT - 8],
    ],
    { type: "FeatureCollection", features: world },
  );
  const pathFor = geoPath(projection);

  const shapes = world
    .map((f) => {
      const d = pathFor(f);
      if (!d) return null;
      const id = String(f.id);
      return { id, d, name: names.get(id) ?? null };
    })
    .filter((s): s is NonNullable<typeof s> => s !== null);

  // A visited country with `within` is filled only inside its box; the rest of
  // it stays in the unvisited base layer drawn above.
  const trimmed = world
    .filter((f) => bounds.get(String(f.id)))
    .map((f) => {
      const [w, s, e, n] = bounds.get(String(f.id)) as [number, number, number, number];
      const parts =
        f.geometry.type === "MultiPolygon"
          ? f.geometry.coordinates
          : f.geometry.type === "Polygon"
            ? [f.geometry.coordinates]
            : [];
      const kept = parts.filter((coordinates) => {
        const [lon, lat] = geoCentroid({ type: "Polygon", coordinates });
        return lon >= w && lon <= e && lat >= s && lat <= n;
      });
      const d = pathFor({ type: "MultiPolygon", coordinates: kept });
      return d ? { id: String(f.id), d, name: names.get(String(f.id)) } : null;
    })
    .filter((t): t is NonNullable<typeof t> => t !== null);

  const drawn = new Set(shapes.map((s) => s.id));
  const dots = featuresOf(detailTopo)
    .filter((f) => names.has(String(f.id)) && !drawn.has(String(f.id)))
    .map((f) => {
      const point = projection(geoCentroid(f));
      if (!point) return null;
      return {
        id: String(f.id),
        name: names.get(String(f.id)),
        x: point[0],
        y: point[1],
      };
    })
    .filter((d): d is NonNullable<typeof d> => d !== null);

  return (
    <div className="border-y border-ink/15">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="block w-full"
        role="img"
        aria-label={`World map with ${countries.length} visited countries filled in.`}
      >
        <g>
          {shapes.map((s) => {
            const visited = s.name !== null && !bounds.get(s.id);
            return (
              <path
                key={s.id}
                d={s.d}
                fill={
                  visited
                    ? VISITED
                    : "color-mix(in srgb, var(--color-ink) 8%, transparent)"
                }
                stroke={
                  visited
                    ? "var(--color-wall)"
                    : "color-mix(in srgb, var(--color-ink) 12%, transparent)"
                }
                strokeWidth={0.5}
              >
                {visited && <title>{s.name}</title>}
              </path>
            );
          })}
          {trimmed.map((t) => (
            <path
              key={t.id}
              d={t.d}
              fill={VISITED}
              stroke="var(--color-wall)"
              strokeWidth={0.5}
            >
              <title>{t.name}</title>
            </path>
          ))}
        </g>
        <g>
          {dots.map((dot) => (
            <circle
              key={dot.id}
              cx={dot.x}
              cy={dot.y}
              r={3.5}
              fill={VISITED}
              stroke="var(--color-wall)"
              strokeWidth={1}
            >
              <title>{dot.name}</title>
            </circle>
          ))}
        </g>
      </svg>
    </div>
  );
}
