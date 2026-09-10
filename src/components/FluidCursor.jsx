/**
 * FluidCursor — GPU fluid simulation that renders behind page content.
 *
 * Port of Pavel Dobryakov's WebGL-Fluid-Simulation (MIT), reduced to the
 * passes actually used and tuned to the values documented in HANDOFF.md.
 * No bloom, no sunrays, no viscosity — those are not in the reference build
 * and each costs draw calls.
 *
 * Usage:
 *   <div className="relative">
 *     <FluidCursor />
 *     <main className="relative z-10">...</main>
 *   </div>
 *
 * The canvas is fixed, pointer-events:none, and z-0. Page content needs a
 * stacking context above it.
 */

"use client";

import { useEffect, useRef, useState } from "react";

const DEFAULTS = {
  SIM_RESOLUTION: 128,
  DYE_RESOLUTION: 1440,
  DENSITY_DISSIPATION: 0.5,
  VELOCITY_DISSIPATION: 3,
  PRESSURE: 0.1,
  PRESSURE_ITERATIONS: 20,
  CURL: 3,
  SPLAT_RADIUS: 0.2,
  SPLAT_FORCE: 6000,
  COLOR_UPDATE_SPEED: 10,
  MAX_DPR: 2,
  // Ceiling on dye-texture area in pixels. getResolution puts DYE_RESOLUTION
  // on the SHORT axis and scales the long one by aspect, so a 390x844 portrait
  // phone asks for 1440x3116 = 4.5 Mpx = 36 MB per half-float texture, 72 MB
  // double-buffered — MORE than the same effect costs on a 1440x900 desktop,
  // on a device with a fraction of the GPU budget. Measured, not guessed.
  MAX_DYE_PIXELS: 3.2e6,
  MAX_DYE_PIXELS_COARSE: 1.6e6
};

export default function FluidCursor(props) {
  const canvasRef = useRef(null);
  // "pending" - before the effect has decided
  // "fluid"   - the simulation is live
  // "still"   - reduced motion: show the fallback field, hold it still
  // "css"     - no usable WebGL, or the context was lost: animated fallback
  const [mode, setMode] = useState("pending");
  const [why, setWhy] = useState("");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const config = { ...DEFAULTS, ...props };

    // Every failure path routes through here, so none of them can leave a
    // blank canvas the way the original silent `return`s did.
    let bailed = false;
    function bail(nextMode, reason) {
      bailed = true;
      setMode(nextMode);
      setWhy(reason);
      document.documentElement.dataset.fluid = nextMode + ":" + reason;
    }

    // Reduce Motion means "do not animate", not "delete the artwork". Render
    // the fallback field, perfectly still.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      bail("still", "prefers-reduced-motion");
      return;
    }

    const coarse = window.matchMedia("(any-pointer: coarse)").matches;
    const dyeBudget = coarse ? config.MAX_DYE_PIXELS_COARSE : config.MAX_DYE_PIXELS;

    // ---------------------------------------------------------- gl context
    const params = {
      alpha: true, depth: false, stencil: false,
      antialias: false, preserveDrawingBuffer: false
    };

    // Probes one API level on a THROWAWAY canvas and reports whether the float
    // render targets the solver needs are actually usable.
    //
    // Why a throwaway: once a <canvas> has vended a "webgl2" context,
    // getContext("webgl") on that same node returns null forever, so we cannot
    // try GL2 then fall back to GL1 on the live element. Replacing the live
    // node would work but React owns it, and this component re-renders when
    // `mode` changes — reconciliation against a swapped node breaks.
    //
    // The original code assumed "WebGL2 exists" implied "WebGL2 can render to
    // float", and silently returned when it could not. That is one of the ways
    // this could render nothing at all on a phone.
    function probe(preferGL2) {
      const test = document.createElement("canvas");
      const ctx = preferGL2
        ? test.getContext("webgl2", params)
        : (test.getContext("webgl", params) ||
           test.getContext("experimental-webgl", params));
      if (!ctx) return null;

      let texType, supportLinear;
      if (preferGL2) {
        ctx.getExtension("EXT_color_buffer_float");
        // The extension that actually makes R16F/RG16F/RGBA16F colour-
        // renderable, and the more widely shipped of the two on mobile GLES3
        // drivers. The original never asked for it.
        ctx.getExtension("EXT_color_buffer_half_float");
        texType = ctx.HALF_FLOAT;
        // In GLES 3.0 the 16F formats are texture-filterable in core.
        // OES_texture_float_linear governs 32-bit float only, so probing for it
        // here needlessly forced MANUAL_FILTERING (4 texture fetches per
        // advection sample instead of 1) on exactly the GPUs with least
        // headroom.
        supportLinear = true;
      } else {
        const hf = ctx.getExtension("OES_texture_half_float");
        if (!hf) return null;
        texType = hf.HALF_FLOAT_OES;
        supportLinear = !!ctx.getExtension("OES_texture_half_float_linear");
      }

      const can = (internal, format) => {
        const tex = ctx.createTexture();
        ctx.bindTexture(ctx.TEXTURE_2D, tex);
        ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.NEAREST);
        ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.NEAREST);
        ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.CLAMP_TO_EDGE);
        ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE);
        ctx.texImage2D(ctx.TEXTURE_2D, 0, internal, 4, 4, 0, format, texType, null);
        const fbo = ctx.createFramebuffer();
        ctx.bindFramebuffer(ctx.FRAMEBUFFER, fbo);
        ctx.framebufferTexture2D(ctx.FRAMEBUFFER, ctx.COLOR_ATTACHMENT0, ctx.TEXTURE_2D, tex, 0);
        const ok = ctx.checkFramebufferStatus(ctx.FRAMEBUFFER) === ctx.FRAMEBUFFER_COMPLETE;
        ctx.bindFramebuffer(ctx.FRAMEBUFFER, null);
        ctx.deleteFramebuffer(fbo);
        ctx.deleteTexture(tex);
        return ok;
      };

      const ok = preferGL2 ? can(ctx.RGBA16F, ctx.RGBA) : can(ctx.RGBA, ctx.RGBA);
      ctx.getExtension("WEBGL_lose_context")?.loseContext();
      return ok ? { supportLinear } : null;
    }

    let probed = probe(true);
    let apiUsed = "webgl2";
    if (!probed) {
      probed = probe(false);
      apiUsed = "webgl1";
    }
    if (!probed) {
      bail("css", "no float render targets");
      return;
    }

    const isGL2 = apiUsed === "webgl2";
    const gl = isGL2
      ? canvas.getContext("webgl2", params)
      : (canvas.getContext("webgl", params) ||
         canvas.getContext("experimental-webgl", params));
    if (!gl) {
      bail("css", "context creation failed");
      return;
    }

    let halfFloat;
    if (isGL2) {
      gl.getExtension("EXT_color_buffer_float");
      gl.getExtension("EXT_color_buffer_half_float");
    } else {
      halfFloat = gl.getExtension("OES_texture_half_float");
      if (!halfFloat) {
        bail("css", "no half float");
        return;
      }
    }
    const texType = isGL2 ? gl.HALF_FLOAT : halfFloat.HALF_FLOAT_OES;

    function supported(internal, format) {
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, internal, 4, 4, 0, format, texType, null);
      const fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
      const ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.deleteFramebuffer(fbo);
      gl.deleteTexture(tex);
      return ok ? { internal, format } : null;
    }

    let fmtRGBA, fmtRG, fmtR;
    if (isGL2) {
      fmtRGBA = supported(gl.RGBA16F, gl.RGBA);
      fmtRG   = supported(gl.RG16F, gl.RG) || fmtRGBA;
      fmtR    = supported(gl.R16F, gl.RED) || fmtRGBA;
    } else {
      fmtRGBA = supported(gl.RGBA, gl.RGBA);
      fmtRG = fmtRGBA; fmtR = fmtRGBA;
    }
    if (!fmtRGBA) {
      bail("css", "float FBO unusable");
      return;
    }

    const supportLinear = probed.supportLinear;
    const FILTER = supportLinear ? gl.LINEAR : gl.NEAREST;

    // ------------------------------------------------------------ shaders
    const baseVert = `
      precision highp float;
      attribute vec2 aPosition;
      varying vec2 vUv, vL, vR, vT, vB;
      uniform vec2 texelSize;
      void main () {
        vUv = aPosition * 0.5 + 0.5;
        vL = vUv - vec2(texelSize.x, 0.0);
        vR = vUv + vec2(texelSize.x, 0.0);
        vT = vUv + vec2(0.0, texelSize.y);
        vB = vUv - vec2(0.0, texelSize.y);
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }`;

    const copyFrag = `
      precision mediump float; precision mediump sampler2D;
      varying vec2 vUv;
      uniform sampler2D uTexture;
      void main () { gl_FragColor = texture2D(uTexture, vUv); }`;

    const clearFrag = `
      precision mediump float; precision mediump sampler2D;
      varying vec2 vUv;
      uniform sampler2D uTexture;
      uniform float value;
      void main () { gl_FragColor = value * texture2D(uTexture, vUv); }`;

    // Shading is multiplicative: diffuse clamps to 0.7–1.0 so it only ever
    // darkens, carving shadow into ribbon edges. Do not make this additive.
    const displayFrag = `
      precision highp float; precision highp sampler2D;
      varying vec2 vUv, vL, vR, vT, vB;
      uniform sampler2D uTexture;
      uniform vec2 texelSize;
      void main () {
        vec3 c = texture2D(uTexture, vUv).rgb;
        vec3 lc = texture2D(uTexture, vL).rgb;
        vec3 rc = texture2D(uTexture, vR).rgb;
        vec3 tc = texture2D(uTexture, vT).rgb;
        vec3 bc = texture2D(uTexture, vB).rgb;
        float dx = length(rc) - length(lc);
        float dy = length(tc) - length(bc);
        vec3 n = normalize(vec3(dx, dy, length(texelSize)));
        vec3 l = vec3(0.0, 0.0, 1.0);
        float diffuse = clamp(dot(n, l) + 0.7, 0.7, 1.0);
        c *= diffuse;
        float a = max(c.r, max(c.g, c.b));
        gl_FragColor = vec4(c, a);
      }`;

    const splatFrag = `
      precision highp float; precision highp sampler2D;
      varying vec2 vUv;
      uniform sampler2D uTarget;
      uniform float aspectRatio;
      uniform vec3 color;
      uniform vec2 point;
      uniform float radius;
      void main () {
        vec2 p = vUv - point.xy;
        p.x *= aspectRatio;
        vec3 splat = exp(-dot(p, p) / radius) * color;
        vec3 base = texture2D(uTarget, vUv).xyz;
        gl_FragColor = vec4(base + splat, 1.0);
      }`;

    const advectionFrag = `
      precision highp float; precision highp sampler2D;
      varying vec2 vUv;
      uniform sampler2D uVelocity;
      uniform sampler2D uSource;
      uniform vec2 texelSize;
      uniform vec2 dyeTexelSize;
      uniform float dt;
      uniform float dissipation;
      vec4 bilerp (sampler2D tex, vec2 uv, vec2 tsize) {
        vec2 st = uv / tsize - 0.5;
        vec2 iuv = floor(st);
        vec2 fuv = fract(st);
        vec4 a = texture2D(tex, (iuv + vec2(0.5, 0.5)) * tsize);
        vec4 b = texture2D(tex, (iuv + vec2(1.5, 0.5)) * tsize);
        vec4 c = texture2D(tex, (iuv + vec2(0.5, 1.5)) * tsize);
        vec4 d = texture2D(tex, (iuv + vec2(1.5, 1.5)) * tsize);
        return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
      }
      void main () {
        #ifdef MANUAL_FILTERING
          vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
          vec4 result = bilerp(uSource, coord, dyeTexelSize);
        #else
          vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
          vec4 result = texture2D(uSource, coord);
        #endif
        float decay = 1.0 + dissipation * dt;
        gl_FragColor = result / decay;
      }`;

    const divergenceFrag = `
      precision mediump float; precision mediump sampler2D;
      varying vec2 vUv, vL, vR, vT, vB;
      uniform sampler2D uVelocity;
      void main () {
        float L = texture2D(uVelocity, vL).x;
        float R = texture2D(uVelocity, vR).x;
        float T = texture2D(uVelocity, vT).y;
        float B = texture2D(uVelocity, vB).y;
        vec2 C = texture2D(uVelocity, vUv).xy;
        if (vL.x < 0.0) { L = -C.x; }
        if (vR.x > 1.0) { R = -C.x; }
        if (vT.y > 1.0) { T = -C.y; }
        if (vB.y < 0.0) { B = -C.y; }
        gl_FragColor = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
      }`;

    const curlFrag = `
      precision mediump float; precision mediump sampler2D;
      varying vec2 vUv, vL, vR, vT, vB;
      uniform sampler2D uVelocity;
      void main () {
        float L = texture2D(uVelocity, vL).y;
        float R = texture2D(uVelocity, vR).y;
        float T = texture2D(uVelocity, vT).x;
        float B = texture2D(uVelocity, vB).x;
        gl_FragColor = vec4(0.5 * (R - L - T + B), 0.0, 0.0, 1.0);
      }`;

    const vorticityFrag = `
      precision highp float; precision highp sampler2D;
      varying vec2 vUv, vL, vR, vT, vB;
      uniform sampler2D uVelocity;
      uniform sampler2D uCurl;
      uniform float curl;
      uniform float dt;
      void main () {
        float L = texture2D(uCurl, vL).x;
        float R = texture2D(uCurl, vR).x;
        float T = texture2D(uCurl, vT).x;
        float B = texture2D(uCurl, vB).x;
        float C = texture2D(uCurl, vUv).x;
        vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
        force /= length(force) + 0.0001;
        force *= curl * C;
        force.y *= -1.0;
        vec2 velocity = texture2D(uVelocity, vUv).xy + force * dt;
        velocity = min(max(velocity, -1000.0), 1000.0);
        gl_FragColor = vec4(velocity, 0.0, 1.0);
      }`;

    const pressureFrag = `
      precision mediump float; precision mediump sampler2D;
      varying vec2 vUv, vL, vR, vT, vB;
      uniform sampler2D uPressure;
      uniform sampler2D uDivergence;
      void main () {
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        float divergence = texture2D(uDivergence, vUv).x;
        gl_FragColor = vec4((L + R + B + T - divergence) * 0.25, 0.0, 0.0, 1.0);
      }`;

    const gradientSubtractFrag = `
      precision mediump float; precision mediump sampler2D;
      varying vec2 vUv, vL, vR, vT, vB;
      uniform sampler2D uPressure;
      uniform sampler2D uVelocity;
      void main () {
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        vec2 velocity = texture2D(uVelocity, vUv).xy;
        velocity -= vec2(R - L, T - B);
        gl_FragColor = vec4(velocity, 0.0, 1.0);
      }`;

    // ------------------------------------------------------------ programs
    const shaders = [];
    const programs = [];

    function compile(type, source, defines) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, (defines || "") + source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
      }
      shaders.push(shader);
      return shader;
    }

    const vertexShader = compile(gl.VERTEX_SHADER, baseVert);

    function Program(fragSource, defines) {
      const program = gl.createProgram();
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragSource, defines));
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(program));
      }
      const uniforms = {};
      const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
      for (let i = 0; i < count; i++) {
        const name = gl.getActiveUniform(program, i).name;
        uniforms[name] = gl.getUniformLocation(program, name);
      }
      programs.push(program);
      return { program, uniforms, bind() { gl.useProgram(program); } };
    }

    const copyProgram       = Program(copyFrag);
    const clearProgram      = Program(clearFrag);
    const displayProgram    = Program(displayFrag);
    const splatProgram      = Program(splatFrag);
    const advectionProgram  = Program(advectionFrag,
                                supportLinear ? null : "#define MANUAL_FILTERING\n");
    const divergenceProgram = Program(divergenceFrag);
    const curlProgram       = Program(curlFrag);
    const vorticityProgram  = Program(vorticityFrag);
    const pressureProgram   = Program(pressureFrag);
    const gradientSubtractProgram = Program(gradientSubtractFrag);

    // ---------------------------------------------------------------- blit
    const quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, -1,1, 1,1, 1,-1]), gl.STATIC_DRAW);
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0,1,2, 0,2,3]), gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    function blit(target) {
      if (target == null) {
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      } else {
        gl.viewport(0, 0, target.width, target.height);
        gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
      }
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    }

    // ---------------------------------------------------------------- FBOs
    const textures = [];
    const framebuffers = [];

    function createFBO(w, h, fmt, filter) {
      gl.activeTexture(gl.TEXTURE0);
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, fmt.internal, w, h, 0, fmt.format, texType, null);

      const fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      gl.viewport(0, 0, w, h);
      gl.clear(gl.COLOR_BUFFER_BIT);

      textures.push(texture);
      framebuffers.push(fbo);

      return {
        texture, fbo, width: w, height: h,
        texelSizeX: 1 / w, texelSizeY: 1 / h,
        attach(id) {
          gl.activeTexture(gl.TEXTURE0 + id);
          gl.bindTexture(gl.TEXTURE_2D, texture);
          return id;
        }
      };
    }

    function createDoubleFBO(w, h, fmt, filter) {
      let a = createFBO(w, h, fmt, filter);
      let b = createFBO(w, h, fmt, filter);
      return {
        width: w, height: h,
        texelSizeX: a.texelSizeX, texelSizeY: a.texelSizeY,
        get read() { return a; },  set read(v) { a = v; },
        get write() { return b; }, set write(v) { b = v; },
        swap() { const t = a; a = b; b = t; }
      };
    }

    function destroyFBO(f) {
      if (!f) return;
      gl.deleteFramebuffer(f.fbo);
      gl.deleteTexture(f.texture);
      const fi = framebuffers.indexOf(f.fbo); if (fi >= 0) framebuffers.splice(fi, 1);
      const ti = textures.indexOf(f.texture); if (ti >= 0) textures.splice(ti, 1);
    }

    function destroyDoubleFBO(d) {
      if (!d) return;
      destroyFBO(d.read);
      destroyFBO(d.write);
    }

    function resizeDoubleFBO(target, w, h, fmt, filter) {
      if (target.width === w && target.height === h) return target;
      const next = createDoubleFBO(w, h, fmt, filter);
      copyProgram.bind();
      gl.uniform1i(copyProgram.uniforms.uTexture, target.read.attach(0));
      blit(next.read);
      // Was leaking 2 textures + 2 framebuffers per resize. Measured: 22
      // textures at mount became 174 after 20 resizes, with zero deletions —
      // ~1.4 GB of texture storage requested on a phone that has nothing like
      // it to spare.
      destroyDoubleFBO(target);
      return next;
    }

    function getResolution(resolution) {
      let ratio = gl.drawingBufferWidth / gl.drawingBufferHeight;
      if (ratio < 1) ratio = 1 / ratio;
      let min = Math.round(resolution);
      let max = Math.round(resolution * ratio);
      // A tall portrait viewport drives `max` through the roof, which is how a
      // phone ended up asking for MORE dye memory than a desktop. Scale the
      // whole tile down to fit the budget. Landscape desktop is barely
      // touched; the 128-wide sim grid never is.
      if (min * max > dyeBudget) {
        const k = Math.sqrt(dyeBudget / (min * max));
        min = Math.max(64, Math.round(min * k));
        max = Math.max(64, Math.round(max * k));
      }
      return gl.drawingBufferWidth > gl.drawingBufferHeight
        ? { width: max, height: min }
        : { width: min, height: max };
    }

    let dye, velocity, divergence, curlFBO, pressure;

    function initFramebuffers() {
      const simRes = getResolution(config.SIM_RESOLUTION);
      const dyeRes = getResolution(config.DYE_RESOLUTION);

      dye = dye
        ? resizeDoubleFBO(dye, dyeRes.width, dyeRes.height, fmtRGBA, FILTER)
        : createDoubleFBO(dyeRes.width, dyeRes.height, fmtRGBA, FILTER);
      velocity = velocity
        ? resizeDoubleFBO(velocity, simRes.width, simRes.height, fmtRG, FILTER)
        : createDoubleFBO(simRes.width, simRes.height, fmtRG, FILTER);

      // These three are rebuilt from scratch on every call, so the previous
      // generation has to go back to the driver.
      destroyFBO(divergence);
      destroyFBO(curlFBO);
      destroyDoubleFBO(pressure);

      divergence = createFBO(simRes.width, simRes.height, fmtR, gl.NEAREST);
      curlFBO    = createFBO(simRes.width, simRes.height, fmtR, gl.NEAREST);
      pressure   = createDoubleFBO(simRes.width, simRes.height, fmtR, gl.NEAREST);
    }

    function resizeCanvas() {
      const dpr = Math.min(window.devicePixelRatio || 1, config.MAX_DPR);
      const w = Math.floor(canvas.clientWidth * dpr);
      const h = Math.floor(canvas.clientHeight * dpr);
      if (canvas.width === w && canvas.height === h) return false;

      // iOS Safari grows and shrinks the visual viewport by ~60-90px as the URL
      // bar hides and shows during scroll, and a fixed height:100% canvas
      // follows it exactly. resizeCanvas is polled EVERY FRAME, so without this
      // guard one flick-scroll rebuilds the entire FBO set several times over.
      // Take width changes and rotations immediately; absorb height-only wobble
      // by letting the existing buffer stretch, which is invisible on a field
      // this diffuse.
      const heightOnly = canvas.width === w;
      if (heightOnly && Math.abs(canvas.height - h) < 120 * dpr) return false;

      canvas.width = w; canvas.height = h;
      return true;
    }

    resizeCanvas();
    initFramebuffers();

    // ------------------------------------------------------------- pointer
    const pointer = {
      x: 0, y: 0, dx: 0, dy: 0,
      prevX: 0, prevY: 0,
      moved: false,
      color: [0, 0, 0]
    };

    function HSVtoRGB(h, s, v) {
      const i = Math.floor(h * 6);
      const f = h * 6 - i;
      const p = v * (1 - s);
      const q = v * (1 - f * s);
      const t = v * (1 - (1 - f) * s);
      switch (i % 6) {
        case 0: return [v, t, p];
        case 1: return [q, v, p];
        case 2: return [p, v, t];
        case 3: return [p, q, v];
        case 4: return [t, p, v];
        default: return [v, p, q];
      }
    }

    function randomColor() {
      const c = HSVtoRGB(Math.random(), 1.0, 1.0);
      return [c[0] * 0.15, c[1] * 0.15, c[2] * 0.15];
    }

    pointer.color = randomColor();

    // Deltas stay in normalised 0–1 texture coords. There is NO scale
    // factor here — adding one multiplies the apparent cursor force.
    function correctDeltaX(d) {
      const aspect = canvas.width / canvas.height;
      return aspect < 1 ? d * aspect : d;
    }
    function correctDeltaY(d) {
      const aspect = canvas.width / canvas.height;
      return aspect > 1 ? d / aspect : d;
    }

    function updatePointer(x, y) {
      pointer.prevX = pointer.x;
      pointer.prevY = pointer.y;
      pointer.x = x / canvas.clientWidth;
      pointer.y = 1 - y / canvas.clientHeight;
      pointer.dx = correctDeltaX(pointer.x - pointer.prevX);
      pointer.dy = correctDeltaY(pointer.y - pointer.prevY);
      pointer.moved = Math.abs(pointer.dx) > 0 || Math.abs(pointer.dy) > 0;
    }

    let seeded = false;
    function seed(x, y) {
      pointer.x = x / canvas.clientWidth;
      pointer.y = 1 - y / canvas.clientHeight;
      pointer.prevX = pointer.x;
      pointer.prevY = pointer.y;
      seeded = true;
    }

    function onMouseMove(e) {
      if (!seeded) seed(e.clientX, e.clientY);
      updatePointer(e.clientX, e.clientY);
    }
    // targetTouches filters to touches that began on the event's target — the
    // wrong list for a listener bound to window, and empty when Safari
    // re-targets mid-gesture. `touches` is correct; `changedTouches` covers
    // touchend, where `touches` is already empty.
    function firstTouch(e) {
      return e.touches[0] || e.changedTouches[0] || null;
    }
    function onTouchMove(e) {
      const t = firstTouch(e);
      if (!t) return;
      if (!seeded) seed(t.clientX, t.clientY);
      updatePointer(t.clientX, t.clientY);
    }
    function onTouchStart(e) {
      const t = firstTouch(e);
      if (!t) return;
      pointer.color = randomColor();
      seed(t.clientX, t.clientY);
    }
    // Without this, `seeded` latches true forever, so a touchmove arriving with
    // no preceding touchstart (Safari taking a gesture over for scrolling)
    // computes its delta against a stale point and fires one splat across the
    // whole screen.
    function onTouchEnd() { seeded = false; pointer.moved = false; }
    function onMouseDown() { pointer.color = randomColor(); }

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchEnd, { passive: true });

    // --------------------------------------------------------------- splat
    function correctRadius(radius) {
      const aspect = canvas.width / canvas.height;
      return aspect > 1 ? radius * aspect : radius;
    }

    function splat(x, y, dx, dy, color) {
      splatProgram.bind();
      gl.uniform1i(splatProgram.uniforms.uTarget, velocity.read.attach(0));
      gl.uniform1f(splatProgram.uniforms.aspectRatio, canvas.width / canvas.height);
      gl.uniform2f(splatProgram.uniforms.point, x, y);
      gl.uniform3f(splatProgram.uniforms.color, dx, dy, 0);
      gl.uniform1f(splatProgram.uniforms.radius, correctRadius(config.SPLAT_RADIUS / 100));
      blit(velocity.write);
      velocity.swap();

      gl.uniform1i(splatProgram.uniforms.uTarget, dye.read.attach(0));
      gl.uniform3f(splatProgram.uniforms.color, color[0], color[1], color[2]);
      blit(dye.write);
      dye.swap();
    }

    // One splat per pointer event, matching the reference. Interpolating
    // along the path deposits several times more dye and reads as denser.
    function applyPointer() {
      if (!pointer.moved) return;
      pointer.moved = false;
      splat(pointer.x, pointer.y,
            pointer.dx * config.SPLAT_FORCE,
            pointer.dy * config.SPLAT_FORCE,
            pointer.color);
    }

    let colorClock = 0;
    function updateColor(dt) {
      colorClock += dt * config.COLOR_UPDATE_SPEED;
      if (colorClock >= 1) {
        colorClock = 0;
        pointer.color = randomColor();
      }
    }

    // ---------------------------------------------------------------- step
    function step(dt) {
      gl.disable(gl.BLEND);

      curlProgram.bind();
      gl.uniform2f(curlProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(curlProgram.uniforms.uVelocity, velocity.read.attach(0));
      blit(curlFBO);

      vorticityProgram.bind();
      gl.uniform2f(vorticityProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(vorticityProgram.uniforms.uVelocity, velocity.read.attach(0));
      gl.uniform1i(vorticityProgram.uniforms.uCurl, curlFBO.attach(1));
      gl.uniform1f(vorticityProgram.uniforms.curl, config.CURL);
      gl.uniform1f(vorticityProgram.uniforms.dt, dt);
      blit(velocity.write);
      velocity.swap();

      divergenceProgram.bind();
      gl.uniform2f(divergenceProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(divergenceProgram.uniforms.uVelocity, velocity.read.attach(0));
      blit(divergence);

      // PRESSURE is the warm-start fraction. Low values leave the Jacobi
      // solve under-converged, which is what makes the fluid feel thick.
      clearProgram.bind();
      gl.uniform1i(clearProgram.uniforms.uTexture, pressure.read.attach(0));
      gl.uniform1f(clearProgram.uniforms.value, config.PRESSURE);
      blit(pressure.write);
      pressure.swap();

      pressureProgram.bind();
      gl.uniform2f(pressureProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(pressureProgram.uniforms.uDivergence, divergence.attach(0));
      for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
        gl.uniform1i(pressureProgram.uniforms.uPressure, pressure.read.attach(1));
        blit(pressure.write);
        pressure.swap();
      }

      gradientSubtractProgram.bind();
      gl.uniform2f(gradientSubtractProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(gradientSubtractProgram.uniforms.uPressure, pressure.read.attach(0));
      gl.uniform1i(gradientSubtractProgram.uniforms.uVelocity, velocity.read.attach(1));
      blit(velocity.write);
      velocity.swap();

      advectionProgram.bind();
      gl.uniform2f(advectionProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      if (!supportLinear) {
        gl.uniform2f(advectionProgram.uniforms.dyeTexelSize, velocity.texelSizeX, velocity.texelSizeY);
      }
      const velId = velocity.read.attach(0);
      gl.uniform1i(advectionProgram.uniforms.uVelocity, velId);
      gl.uniform1i(advectionProgram.uniforms.uSource, velId);
      gl.uniform1f(advectionProgram.uniforms.dt, dt);
      gl.uniform1f(advectionProgram.uniforms.dissipation, config.VELOCITY_DISSIPATION);
      blit(velocity.write);
      velocity.swap();

      if (!supportLinear) {
        gl.uniform2f(advectionProgram.uniforms.dyeTexelSize, dye.texelSizeX, dye.texelSizeY);
      }
      gl.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read.attach(0));
      gl.uniform1i(advectionProgram.uniforms.uSource, dye.read.attach(1));
      gl.uniform1f(advectionProgram.uniforms.dissipation, config.DENSITY_DISSIPATION);
      blit(dye.write);
      dye.swap();
    }

    function render() {
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.enable(gl.BLEND);
      gl.clearColor(0, 0, 0, 0);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.clear(gl.COLOR_BUFFER_BIT);

      displayProgram.bind();
      gl.uniform2f(displayProgram.uniforms.texelSize,
                   1 / gl.drawingBufferWidth, 1 / gl.drawingBufferHeight);
      gl.uniform1i(displayProgram.uniforms.uTexture, dye.read.attach(0));
      blit(null);
    }

    // ----------------------------------------------------------- main loop
    let rafId = 0;
    let lastTime = performance.now();

    function frame() {
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.016666);
      lastTime = now;

      if (resizeCanvas()) initFramebuffers();
      updateColor(dt);
      applyPointer();
      step(dt);
      render();

      rafId = requestAnimationFrame(frame);
    }

    // A lost context is otherwise permanent and completely silent: the rAF loop
    // keeps running and every draw call no-ops against a transparent canvas.
    // That is the same signature as the loseContext()-on-unmount bug in the
    // README — this guards every OTHER cause (memory pressure, GPU reclaim,
    // app backgrounding), which the earlier fix did not.
    function onContextLost(e) {
      e.preventDefault();
      cancelAnimationFrame(rafId);
      rafId = 0;
      bail("css", "webgl context lost");
    }
    canvas.addEventListener("webglcontextlost", onContextLost, false);

    // Don't burn GPU on a background tab.
    function onVisibility() {
      if (bailed) return;
      if (document.hidden) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      } else if (!rafId) {
        lastTime = performance.now();
        rafId = requestAnimationFrame(frame);
      }
    }
    document.addEventListener("visibilitychange", onVisibility);

    document.documentElement.dataset.fluid = "fluid:" + apiUsed;
    setMode("fluid");
    rafId = requestAnimationFrame(frame);

    // -------------------------------------------------------------- unmount
    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);

      // Deleting against a lost context throws; there is also nothing left to
      // free, since losing the context already released it.
      if (gl.isContextLost()) return;

      framebuffers.forEach(f => { gl.deleteFramebuffer(f); });
      textures.forEach(t => { gl.deleteTexture(t); });
      programs.forEach(p => { gl.deleteProgram(p); });
      shaders.forEach(sh => { gl.deleteShader(sh); });
      gl.deleteBuffer(quadBuffer);
      gl.deleteBuffer(indexBuffer);

      // Deliberately NOT calling WEBGL_lose_context.loseContext() here.
      //
      // A WebGL context belongs to the <canvas> element, not to the React
      // component. Under Strict Mode (and any remount on the same node) React
      // reuses the same <canvas>, so force-losing the context permanently
      // bricks it: the next getContext() returns the same dead context and
      // every draw call silently no-ops against a transparent canvas.
      //
      // The deletes above already return the GPU memory, which is what the
      // teardown is actually for. The context itself is reclaimed with the
      // canvas element when it is really removed from the document.
    };
    // Config is read once on mount. Change the key to remount with new values.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showFallback = mode === "still" || mode === "css";

  return (
    <>
      <style>{FALLBACK_CSS}</style>

      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "block",
          zIndex: 0,
          pointerEvents: "none",
          opacity: mode === "fluid" ? 1 : 0,
          transition: "opacity 600ms linear"
        }}
      />

      {showFallback && (
        <div
          className="fc-fallback"
          data-animate={mode === "css" ? "" : undefined}
          aria-hidden="true"
        >
          <i /><i /><i />
        </div>
      )}

      {/*
        Load the site with ?fluiddebug=1 on a real device and this names the
        exact branch taken — the only way to get ground truth off a phone we
        cannot attach a debugger to.
      */}
      {typeof window !== "undefined" &&
        window.location.search.includes("fluiddebug") && (
          <div
            style={{
              position: "fixed", left: 8, bottom: 8, zIndex: 9999,
              font: "12px/1.4 ui-monospace, monospace", padding: "6px 9px",
              background: "rgba(0,0,0,.8)", color: "#fff", borderRadius: 6,
              pointerEvents: "none", maxWidth: "70vw"
            }}
          >
            fluid: {mode}{why ? " \u2014 " + why : ""}
          </div>
        )}
    </>
  );
}

/*
  Visible, and still by default. Under Reduce Motion this is what renders:
  colour and depth in the backdrop with zero movement, which is what the
  setting actually asks for — rather than the blank page the original produced.
*/
const FALLBACK_CSS = `
.fc-fallback { position: fixed; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }
.fc-fallback i { position: absolute; display: block; border-radius: 50%;
  filter: blur(64px); opacity: .45; will-change: transform; }
.fc-fallback i:nth-child(1) { width: 70vmax; height: 70vmax; left: -20vmax; top: -18vmax;
  background: radial-gradient(circle, oklch(0.86 0.11 300 / .9), transparent 68%); }
.fc-fallback i:nth-child(2) { width: 62vmax; height: 62vmax; right: -22vmax; top: 4vmax;
  background: radial-gradient(circle, oklch(0.88 0.10 355 / .85), transparent 68%); }
.fc-fallback i:nth-child(3) { width: 78vmax; height: 78vmax; left: 6vmax; bottom: -30vmax;
  background: radial-gradient(circle, oklch(0.88 0.09 225 / .9), transparent 70%); }
.fc-fallback[data-animate] i { animation: fc-drift 34s ease-in-out infinite alternate; }
.fc-fallback[data-animate] i:nth-child(2) { animation-duration: 46s; animation-delay: -8s; }
.fc-fallback[data-animate] i:nth-child(3) { animation-duration: 58s; animation-delay: -20s; }
@keyframes fc-drift {
  from { transform: translate3d(0,0,0) scale(1); }
  to   { transform: translate3d(6vmax,-5vmax,0) scale(1.12); }
}
@media (prefers-reduced-motion: reduce) { .fc-fallback i { animation: none !important; } }
`;
