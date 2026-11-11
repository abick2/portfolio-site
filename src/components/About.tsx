import Section from "@/components/Section";
import { profile } from "@/data/profile";

/**
 * The personal paragraph. Text only — the portrait already hangs in the hero,
 * and the rows above carry the travel, running and cooking, so this does the
 * one thing they cannot.
 */
export default function About() {
  return (
    <Section id="about" title="Iowa, then Virginia, now DC">
      <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-[var(--spacing-gutter)]">
        <div className="space-y-4 lg:col-span-7 lg:col-start-5">
          {profile.about.map((para) => (
            <p key={para.slice(0, 40)} className="t-lead measure">
              {para}
            </p>
          ))}
        </div>
      </div>
    </Section>
  );
}
