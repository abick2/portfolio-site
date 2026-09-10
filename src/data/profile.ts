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
  headline: ["Engineer who", "speaks human"],

  /**
   * One sentence under the headline. This is the whole pitch — the connector /
   * translator idea, stated plainly rather than claimed.
   */
  // TODO: rewrite in your voice.
  lede: "I sit between the people who build the thing and the people who need it built, and I make sure both walk away understanding each other.",

  /**
   * The three claims the site is actually arguing. Each one gets evidence
   * elsewhere on the page — don't add a fourth without evidence for it.
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

  /** Long-form personal paragraph for the About section. */
  // TODO: this is the most important paragraph on the site. Make it yours.
  about: [
    "Placeholder. Write two or three paragraphs here about who you are outside the job titles — what you are curious about, how you got here, what you are like to work with.",
    "The hobbies section already carries the triathlon, the travel, and the cooking. This paragraph should do the work those cannot: the reason you are the way you are.",
  ],

  links: {
    // TODO: fill these in, delete any you do not want.
    email: "andrew2bickford@gmail.com",
    github: "https://github.com/",
    linkedin: "https://www.linkedin.com/",
    strava: "https://www.strava.com/",
  },

  /**
   * Other sites you've built, surfaced as outbound links.
   * TODO: real URLs.
   */
  elsewhere: [
    { label: "Venture portfolio", href: "#", note: "A portfolio site for the fund" },
    { label: "Triathlon training", href: "#", note: "Training plans and pacing tools" },
    { label: "Blacksburg coverage", href: "#", note: "Every road in town, mapped from Strava" },
  ],
} as const;
