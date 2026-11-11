---
version: 1
slug: "src-app-page-tsx"
primary_target: "src/app/page.tsx"
related_targets: ["src/app/projects/[slug]/page.tsx","src/app/play/[slug]/page.tsx"]
---

# Home page

Scope: `/` plus the detail pages that inherit its system (`/projects/<slug>`, `/play/<slug>`). Visitor mode: Experience.

Audience and job: people evaluating Andrew and his wider network, weighted equally. Success means the visitor remembers a person rather than a CV. Constraints: no tagline or one-liner; photos lead; external links open in new tabs, internal ones do not; the fluid effect runs in the hero only; this is a bare-bones pass, and animation comes later.

Unresolved: pursuits currently hang two-up (larger) and projects three-up, which deviates from THESIS "same scale"; this is the user's call, so keep or change it on their answer. The hero portrait is 900x1037 and may need a higher-resolution upload; most copy is still placeholder (see PRODUCT.md); several frames are waiting on photographs.

## Direction contract

THESIS: The visitor walks a show of one person's range. Work, projects and pursuits hang at the same scale with the same labels. This refuses the usual developer portfolio: name, slogan, bento grid, glass cards.

OWN-WORLD: A cool gallery-white wall (#f2f3f2, not cream) with near-black ink. Hard square-cornered frames with no glass, shadow or rounded corners, in fixed ratios (4:3 on the home page, 16:9 for detail heroes). Labels go under the frame: a title, the year in tabular numerals, and one plain line, with small tracked caps for label voice. One family: Archivo, with expanded heavy caps (wdth 125) for the title wall and wdth 112 for headings. The defense, commercial and bridge colours appear only on the career route. Hairline rules open each room, on one 12-column grid with a fluid gutter of clamp(1rem, 4vw, 4rem) and a 100rem maximum.

STORY: The visitor meets the name and a face, walks past the career route, the projects and the pursuits, and leaves remembering a person rather than a CV.

FIRST VIEWPORT: Left, across seven columns, ANDREW / BICKFORD in expanded caps sized to the column, bottom-aligned and knocked out through the fluid. Right, across five columns, the portrait in a 4:5 frame almost the full viewport tall, labelled underneath with the sitter's name and "Engineer · Washington, DC". The nav is a plain text bar. There is no CTA: scrolling is the path.

FORM: Gallery hang with museum labels, #7 of 7 on the ordered list (contact sheet, race results, DC Metro diagram, USGS topo, field notebook, passport, gallery hang). seed:9e03597ec68f45a5. Raises: from the one-bit desktop, one frame system with zero ornament; from the nixie counter, figures held in a fixed tabular position in every label; from the glaze shelf, a uniform row in which every item carries an identical label card; from Greiman, the jump in scale from tiny label to huge image.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
