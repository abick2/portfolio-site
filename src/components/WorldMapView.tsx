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

/** Client half of the travel map. Pins are focusable buttons; the panel below follows the selection. */
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
    <div className="border-y border-ink/15">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="block w-full"
        // Not role="img": that would hide the focusable pins from screen readers.
        role="group"
        aria-label={`World map with ${pins.length} places marked. Use Tab to move between them.`}
      >
        <g>
          {countryPaths.map((d, i) => (
            <path
              key={i}
              d={d}
              fill="color-mix(in srgb, var(--color-ink) 8%, transparent)"
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
                    fill="var(--color-ink)"
                    opacity={0.12}
                  />
                )}
                <circle
                  cx={pin.x}
                  cy={pin.y}
                  r={isActive ? 5 : 3.5}
                  fill={isActive ? "var(--color-ink)" : "var(--color-label)"}
                  className="transition-all duration-300"
                />
                {/* Transparent hit area, sized by `.pin-hit` in globals.css. */}
                <circle
                  cx={pin.x}
                  cy={pin.y}
                  fill="transparent"
                  tabIndex={0}
                  role="button"
                  aria-label={`${pin.city}, ${pin.country}, ${pin.year}`}
                  aria-current={isActive ? "true" : undefined}
                  className="pin-hit cursor-pointer outline-none focus-visible:stroke-[var(--color-ink)] focus-visible:[stroke-width:2]"
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

      <div className="min-h-[6.5rem] border-t border-ink/15 py-5" aria-live="polite">
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
