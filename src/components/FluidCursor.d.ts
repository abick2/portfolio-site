/**
 * Type surface for FluidCursor.jsx.
 *
 * The implementation is kept as plain JS on purpose: it is a proven port of
 * Pavel Dobryakov's WebGL-Fluid-Simulation (MIT) with measured parameters, and
 * retyping ~700 lines of shader plumbing buys nothing but risk. See
 * reference-material/HANDOFF.md for what every parameter does before changing
 * any of them — several are load-bearing in non-obvious ways.
 */

import type { JSX } from "react";

export interface FluidCursorProps {
  /** Simulation grid resolution. Default 128. */
  SIM_RESOLUTION?: number;
  /** Dye texture resolution. Default 1440. Drop to 1024 for headroom. */
  DYE_RESOLUTION?: number;
  /** Low values make dye persist and pool. Default 0.5. */
  DENSITY_DISSIPATION?: number;
  /** High values stop motion quickly. Default 3. */
  VELOCITY_DISSIPATION?: number;
  /**
   * Warm-start fraction for the pressure solve. Default 0.1.
   * This is the parameter that defines the feel — low values leave the solve
   * under-converged, which is what reads as thick liquid rather than gas.
   */
  PRESSURE?: number;
  /** Jacobi iterations. Default 20. Below ~10 the fluid visibly distorts. */
  PRESSURE_ITERATIONS?: number;
  /** Vorticity confinement strength. Default 3. Zero looks dead. */
  CURL?: number;
  /** Default 0.2. */
  SPLAT_RADIUS?: number;
  /** Default 6000. */
  SPLAT_FORCE?: number;
  /** Hue rerolls per second. Default 10. */
  COLOR_UPDATE_SPEED?: number;
  /** Device pixel ratio cap. Default 2. */
  MAX_DPR?: number;
  /**
   * Ceiling on dye-texture area in pixels, pointer-fine devices. Default 3.2e6.
   * getResolution puts DYE_RESOLUTION on the SHORT axis and scales the long
   * one by aspect ratio, so without a cap a tall portrait viewport asks for
   * more GPU memory than a desktop does.
   */
  MAX_DYE_PIXELS?: number;
  /** Same ceiling for coarse pointers (phones, tablets). Default 1.6e6. */
  MAX_DYE_PIXELS_COARSE?: number;
}

declare function FluidCursor(props?: FluidCursorProps): JSX.Element;
export default FluidCursor;
