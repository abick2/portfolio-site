"use client";

import { useState } from "react";

export interface Pin {
  id: string;
  city: string;
  country: string;
  year: string;
  note: string | null;
  x: number;
  y: number;
}

/**
 * Client half of the travel map: rendering and interaction only, no geo maths.
 *
 * Pins are buttons rather than decorative circles so the map is usable from a
 * keyboard — tabbing moves between places and the detail panel follows. The
 * panel is a fixed-height block so selecting a pin does not reflow the page.
 */
export default function WorldMapView({
  width,
  height,
  countryPaths,
  pins,
}: {
  width: number;
  height: number;
  countryPaths: string[];
  pins: Pin[];
}) {
  const [activeId, setActiveId] = useState<string | null>(pins[0]?.id ?? null);
  const active = pins.find((p) => p.id === activeId) ?? null;

  return (
    <div className="glass-2 sq-xl overflow-hidden">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="block w-full"
        /* Not role="img": that role is children-presentational, so the six
           focusable pins inside became invisible to browse-mode screen
           reader navigation. */
        role="group"
        aria-label={`World map with ${pins.length} places marked. Use Tab to move between them.`}
      >
        <g>
          {countryPaths.map((d, i) => (
            <path
              key={i}
              d={d}
              fill="color-mix(in srgb, var(--color-ink) 6%, transparent)"
              stroke="color-mix(in srgb, var(--color-ink) 12%, transparent)"
              strokeWidth={0.5}
            />
          ))}
        </g>

        <g>
          {pins.map((pin) => {
            const isActive = pin.id === activeId;
            return (
              <g key={pin.id}>
                {isActive && (
                  <circle
                    cx={pin.x}
                    cy={pin.y}
                    r={12}
                    fill="var(--color-bridge)"
                    opacity={0.18}
                  />
                )}
                <circle
                  cx={pin.x}
                  cy={pin.y}
                  r={isActive ? 5 : 3.5}
                  fill={isActive ? "var(--color-bridge)" : "var(--color-commercial)"}
                  className="transition-all duration-300"
                />
                {/* Generous transparent hit area — a 3.5px circle is not a
                    reasonable target on a touchscreen. */}
                <circle
                  cx={pin.x}
                  cy={pin.y}
                  fill="transparent"
                  tabIndex={0}
                  role="button"
                  aria-label={`${pin.city}, ${pin.country}, ${pin.year}`}
                  /* aria-current, not aria-pressed: exactly one pin is
                     selected and there is no way to un-press one. */
                  aria-current={isActive ? "true" : undefined}
                  className="pin-hit cursor-pointer outline-none focus-visible:stroke-[var(--color-bridge)] focus-visible:[stroke-width:2]"
                  onMouseEnter={() => setActiveId(pin.id)}
                  onFocus={() => setActiveId(pin.id)}
                  onClick={() => setActiveId(pin.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setActiveId(pin.id);
                    }
                  }}
                />
              </g>
            );
          })}
        </g>
      </svg>

      {/* Selecting a pin swaps this panel silently otherwise — the trip note
          was never announced. */}
      <div className="min-h-[6.5rem] border-t border-ink/10 p-6 sm:p-7" aria-live="polite">
        {active ? (
          <>
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h2 className="t-title">{active.city}</h2>
              <span className="t-small">{active.country}</span>
              <span className="t-small tabular ml-auto">{active.year}</span>
            </div>
            {active.note && <p className="t-body measure mt-2">{active.note}</p>}
          </>
        ) : (
          <p className="t-small">Pick a pin to see the trip.</p>
        )}
      </div>
    </div>
  );
}
