/**
 * Top-level identity and positioning.
 *
 * PLACEHOLDER COPY — every string marked `TODO` is a guess written to make the
 * layout legible. Replace with your own words before this goes anywhere public.
 */

export const profile = {
  name: "Andrew Bickford",
  shortName: "Andrew",

  /** The hero headline. Kept to two short lines so it can be set very large. */
  headline: ["An engineer", "with range."],

  /**
   * One sentence under the headline. This is the whole pitch — the connector /
   * translator idea, stated plainly rather than claimed.
   */
  // TODO: rewrite in your voice.
  lede: "An engineer with range. Social, creative, curious.",

  /**
   * NOT RENDERED. The Claims section was cut in the redesign — the roadmap,
   * the mosaic and the hobby rows are the evidence, and stating the claims
   * above them turned out to be the site telling you what to conclude before
   * showing you anything. Kept here because the copy may be worth reusing.
   */
  claims: [
    {
      id: "translator",
      title: "Translator",
      // TODO
      body: "Technical enough to argue with the engineers, plain-spoken enough that the customer stays in the room. Most of the value I add happens in that gap.",
    },
    {
      id: "connector",
      title: "Connector",
      // TODO
      body: "Defense and commercial, research and delivery, the lab and the field. I have spent time inside each of these worlds, which is why I can move things between them.",
    },
    {
      id: "adaptable",
      title: "Adaptable",
      // TODO
      body: "New domain, new stack, new stakeholders — the ramp is short. The projects below have almost nothing in common, which is rather the point.",
    },
  ],

  /**
   * The About section. Two paragraphs, not three — the hobby rows now carry
   * the travel, the running and the cooking, so this only has to do the work
   * they cannot.
   */
  // TODO: still the most important paragraph on the site. Make it yours.
  about: [
    "I grew up in Iowa and went to Virginia Tech. Since then: intelligence work, consulting, and back again.",
    "A person is more than their job history. I care about how things are made and how they look — which is why this site exists at all.",
  ],

  links: {
    // TODO: fill these in, delete any you do not want.
    email: "andrew2bickford@gmail.com",
    github: "https://github.com/abick2",
    linkedin: "https://www.linkedin.com/in/andrew-bickford-8550b721b",
    strava: "https://www.strava.com/athletes/43232284",
  },

  /**
   * NOT RENDERED. About now ends in three social pills built from `links`
   * above. These three are all in the projects mosaic anyway, so listing them
   * again under "Elsewhere" was the same six links twice.
   */
  elsewhere: [
    { label: "Venture portfolio", href: "#", note: "A portfolio site for the fund" },
    { label: "Triathlon training", href: "#", note: "Training plans and pacing tools" },
    {
      label: "Blacksburg coverage",
      href: "#",
      note: "Every road in town, mapped from Strava",
    },
  ],
} as const;
