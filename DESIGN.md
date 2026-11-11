---
name: Andrew Bickford
description: One person's range, hung like a show on a plain gallery wall.
colors:
  wall: "#f2f3f2"
  frame: "#e3e5e4"
  ink: "#111214"
  ink-soft: "#2b2e33"
  label: "#5c6168"
  defense: "#1b3a6b"
  commercial: "#bc3e75"
  bridge: "#6b46c8"
typography:
  display:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "min(7.2vw, 7.75rem)"
    fontWeight: 800
    lineHeight: 0.86
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 125"
  headline:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 3.2vw, 2.75rem)"
    fontWeight: 750
    lineHeight: 1.02
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 112"
  figure:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 2.6vw, 2.5rem)"
    fontWeight: 750
    lineHeight: 1
    letterSpacing: "-0.02em"
    fontFeature: "'tnum'"
    fontVariation: "'wdth' 112"
  title:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 650
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  lead:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(1.125rem, 1.5vw, 1.3rem)"
    fontWeight: 400
    lineHeight: 1.5
  body:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  small:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 650
    lineHeight: 1.35
    letterSpacing: "0.08em"
rounded:
  none: "0px"
spacing:
  gutter: "clamp(1rem, 4vw, 4rem)"
  page-max: "100rem"
  rule-to-heading: "1.25rem"
  heading-to-content: "clamp(2rem, 4vw, 3.5rem)"
  section-end: "clamp(5rem, 10vw, 9rem)"
  frame-to-label: "0.875rem"
components:
  frame:
    backgroundColor: "{colors.frame}"
    rounded: "{rounded.none}"
    width: "100%"
  frame-placeholder-text:
    textColor: "{colors.label}"
    typography: "{typography.label}"
  card-label-title:
    textColor: "{colors.ink}"
    typography: "{typography.title}"
  card-label-meta:
    textColor: "{colors.label}"
    typography: "{typography.small}"
  nav-bar:
    backgroundColor: "{colors.wall}"
    height: "4rem"
  nav-link:
    textColor: "{colors.label}"
    typography: "{typography.label}"
    height: "2.75rem"
  nav-link-hover:
    textColor: "{colors.ink}"
  skip-link:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.wall}"
    padding: "12px 20px"
---

# Design System: Andrew Bickford

## Overview

**Creative North Star: "The Gallery Hang"**

The site is hung like a show of one person's range: photographs on a plain, cool-white wall, each with a small museum label beneath it. Work, projects and pursuits are hung in identical frames with identical labels, so nothing looks more important than anything else by styling alone. The wall and the ink stay quiet so the pictures carry all of the colour.

Density is low and the scale jumps are large. A huge expanded-caps name and almost-full-height portrait open the show; below that, tiny tracked-caps labels sit directly under big frames. Every room opens the same way, with a hairline rule, a heading, and the content, on one 12-column measure. There is no glass, no shadow, no rounded corner and no ornament. Depth comes from the photographs, and from one live element: a WebGL fluid field that belongs to the home hero alone and shows through the letterforms of the name.

**Key Characteristics:**
- Cool gallery-white wall (not cream) with near-black ink; colour comes from photographs.
- Hard, square-cornered frames at fixed ratios, filled edge to edge with the image.
- A museum label under every frame: title, the year in tabular numerals, one plain line.
- One family, Archivo, with its width axis doing the work of a second face.
- Hairline rules open each room; one fluid gutter and a 100rem cap.
- The fluid simulation lives only in the home hero, knocked out through the name.

## Colors

A near-monochrome gallery palette: a cool wall, a one-step-darker frame backing, and three inks, plus three route colours reserved for one diagram.

### Primary
- **Gallery Ink** (ink): headings, titles, the hero name's fallback colour, the focus outline, text selection background, the footer's closing rule, and the full-strength rules on race-result cards. The page has no accent; ink is the strongest voice.

### Secondary
- **Intelligence Navy** (defense): the defense and intelligence side of the career route only: its track header, line segments, stop markers and role titles.
- **Consulting Rose** (commercial): the software and consulting side of the career route only. Darkened from an earlier value to clear AA on the wall.

### Tertiary
- **Crossing Violet** (bridge): appears only inside the gradient of a route segment where the career crosses from one world to the other. The change of world is a change in the line, never a label about it.

### Neutral
- **Gallery Wall** (wall): the page ground, the sticky nav background, the selection text colour, and the ring that seats route markers on their line.
- **Frame Grey** (frame): the backing of every empty frame and image well, one step below the wall so a frame still reads as a frame before its photograph loads.
- **Soft Ink** (ink-soft): lead and body prose.
- **Label Grey** (label): small meta text, years, captions, nav links at rest, the "Photo to come" card. 5.7:1 on the wall.
- **Hairline** (ink at 15% alpha): the rule that opens every section and detail header; ink at 10% for the mobile menu divider.

### Named Rules
**The Route-Only Rule.** Navy, rose and violet exist for the career route and nowhere else. Every other surface is wall, frame and ink.

**The Pictures Carry Colour Rule.** No coloured fills, tints or gradients on chrome. If a screen needs colour, it gets a photograph.

## Typography

**Display Font:** Archivo (variable, wdth axis), with system-ui, sans-serif
**Body Font:** Archivo, same family
**Label/Mono Font:** none distinct; numerals use tabular figures instead of a mono face

**Character:** One family with two voices. The width axis opens to wdth 125 for the title wall and wdth 112 for headings and figures; labels and prose stay at normal width. Weight is synthesized never (font-synthesis-weight: none).

### Hierarchy
- **Display** (800, wdth 125, uppercase, 0.86 line-height): the home hero name only. Sized to its column, not picked from a scale: column width over 7 below 1024px, then min(7.2vw, 7.75rem) across seven of twelve columns.
- **Headline** (750, wdth 112, clamp 1.75 to 2.75rem): every section heading and detail-page h1. The career route sets its company names in this voice a step smaller, clamp(1.5rem, 2.2vw, 2rem).
- **Figure** (750, wdth 112, tabular numerals): a single display number in a label, such as a race time or a count. Race-result cards on detail pages enlarge it to clamp(2.5rem, 5vw, 4rem).
- **Title** (650, 1.125rem): card titles, the nav name, mobile menu items, the footer email, role titles.
- **Lead** (400, clamp 1.125 to 1.3rem, 1.5): intro paragraphs, including the personal intro that opens the Play room, in soft ink.
- **Body** (400, 1.0625rem, 1.6): detail-page prose in soft ink, held to 64ch.
- **Small** (400, 0.875rem, 1.5): meta lines under titles, years, captions, in label grey.
- **Label** (650, 0.75rem, 0.08em tracking, uppercase): museum-label voice: the sitter's name under the portrait, nav links, route track names, social links, back links, "Photo to come".

### Named Rules
**The Tabular Figures Rule.** Years, periods, times and counts are set in tabular numerals so they align in columns, without reaching for a monospace face.

**The Label Is Not An Eyebrow Rule.** Tracked caps name what a picture or a column is, under or beside it. They never sit above a heading as a kicker.

## Layout

One container: full width, capped at 100rem, with a fluid gutter of clamp(1rem, 4vw, 4rem) on both sides; the same gutter is the column gap of every grid. Wide layouts use a 12-column grid: the hero splits 7 / 5 (name / portrait), prose columns start at column 5 and span 7, detail headers split 7 / 5 (heading / lead).

Every home section below the hero opens identically: a hairline across the full measure, 1.25rem of air, the heading row (heading left, an optional small note or link right, baseline-aligned), then clamp(2rem, 4vw, 3.5rem) to the content, and clamp(5rem, 10vw, 9rem) of closing space. The closing space is always larger than the opening, so each heading sits with its own content. Labels sit 0.75 to 0.875rem under their frames.

Projects hang three-up at 1024px and above, two-up from 640px, one column below. Pursuits currently hang two-up from 768px at a larger size. This is an open deviation from the "same scale" thesis and waits on the owner's decision; do not treat either count as settled for new rows.

The nav is sticky, 4rem tall; anchored sections land 4.5rem down. Breakpoints are Tailwind's defaults (640, 768, 1024px). The career route collapses from a two-sided line to a single left-hand line with a legend below 1024px.

## Elevation & Depth

Flat. There are no drop shadows, no glass, no blur on any surface. Depth comes from the photographs, from the one-step tonal difference between wall and frame, and from the hero's fluid field. The only `box-shadow` in the system is a 4px wall-coloured spread ring that seats a route marker on its line; it reads as a gap, not elevation.

The fluid canvas is fixed behind the content on the home route only. It fades out over the first 80% of a viewport of scroll (fully visible for the first 30%), and once its opacity reaches zero the render loop pauses. Detail pages never mount it.

### Named Rules
**The Flat Wall Rule.** Surfaces never lift. Hover is an underline or a colour change, never a shadow or a raise.

**The Knockout Rule.** The hero name is composited through the fluid with `mix-blend-mode: difference` over white type, with plain ink as the unsupported fallback. Nothing between a knockout element and the canvas may create a stacking context: no z-index, transform, filter, or sticky/fixed position on any ancestor, including the layout's content wrapper. The knockout element itself must keep its own layer promotion (`will-change: transform`) or Safari drops the blend after scrolling.

## Shapes

Square corners everywhere (0px). Frames are hard-edged boxes at a fixed ratio with the image cut to fill them (`object-fit: cover`): 4:3 for home cards and detail galleries, 16:9 for detail heroes and a lone gallery photo, 4:5 for the hero portrait. Rules are 1px hairlines at 15% ink, or full ink where they close the page (footer) or head a figure card. The career route is drawn with 2px lines and 14px square markers. Line icons are drawn SVG strokes at 1.5 width (the outbound arrow, the two-bar menu toggle).

## Components

### Frame (signature)
A hung photograph. Every picture is a full-width box at a fixed ratio on a frame-grey backing, square-cornered, with the image filling it. The home grids go through the shared Frame component; detail pages and the portrait use the same box written inline at a fixed aspect. Screenshots of live sites anchor to the top. A frame whose `src` is `null` shows a centred "Photo to come" in label voice and label grey instead of a gradient pretending to be a picture; detail galleries drop placeholders entirely.

### Museum Label
Under every frame: title in Title voice on the left, year in Small tabular numerals on the right, baseline-aligned; one plain line beneath in Small, capped around 40 to 46ch. Pursuit labels add a Figure-voice number with its Small caption in the right-hand corner, so the figures read across as one set. The whole card is one link; hover and keyboard focus underline the title at a 0.22em offset.

### Section Header
Hairline rule, headline, optional right-hand note in Small. Used by every home room and, as a bordered header, by detail pages.

### Links
- **Text link:** underlined at 1px, 0.22em offset, the underline at 40% of the text colour; on hover or focus the underline goes to full colour over 0.2s.
- **External:** every link that leaves the site opens a new tab, appends a visually hidden "(opens in a new tab)", and carries a small drawn up-right arrow at 0.7em (omitted when the link body is an image).
- **Mail:** `mailto:` links stay in the same tab and never take `target="_blank"`; the address may wrap anywhere.
- **Back link:** label voice, underlined, above the detail header, at least 44px tall.

### Navigation
A plain opaque wall-coloured bar, sticky, 4rem, no glass and no transition on its box. The name on the left in Title voice; three places in label voice and label grey, ink on hover over 200ms, each at least 44px tall. Below 768px a two-bar toggle (44px target) opens a disclosure list of Title-voice items under a 10% ink hairline; Escape closes it and returns focus to the toggle.

### Career Route
Work history as one vertical line. Defense stops hang left, commercial right; each row paints its own segment in its track colour, and a crossing row paints a gradient through violet. A 2px stub joins each stop's square marker to its text. Company in a smaller headline, role title in Title voice in the track colour, period in Small tabular numerals.

### Focus
A 2px ink outline offset 3px on every focusable element. Selection inverts to wall on ink.

## Do's and Don'ts

### Do:
- **Do** put every picture in a fixed-ratio, square-cornered frame on the frame-grey backing (4:3 cards, 16:9 detail heroes, 4:5 portrait).
- **Do** label every frame underneath: title, year in tabular numerals, one plain line.
- **Do** open every room with the hairline rule and heading row, and close it with more space than it opened with.
- **Do** keep the fluid canvas on the home hero only, and pause it once it has faded out.
- **Do** send every off-site link through the external-link pattern (new tab, announced, arrowed), and keep `mailto:` links in the same tab.
- **Do** show "Photo to come" for a missing photograph rather than a decorative fill.
- **Do** set years, periods, times and counts in tabular numerals.

### Don't:
- **Don't** use the navy, rose or violet route colours outside the career route.
- **Don't** add glass, blur, drop shadows, rounded corners or hover lifts to any surface.
- **Don't** put a z-index, transform, filter or sticky/fixed position on anything between the hero name and the fluid canvas.
- **Don't** use a cream or warm ground; the wall is cool white.
- **Don't** set tracked caps above a heading as an eyebrow; the label voice names a picture or a column.
- **Don't** introduce a second typeface; vary Archivo's width and weight instead.
