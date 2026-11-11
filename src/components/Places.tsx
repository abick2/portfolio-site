import Link from "next/link";
import Section from "@/components/Section";
import WorldMap from "@/components/WorldMap";

export default function Places() {
  return (
    <Section
      title="Places"
      aside={
        <Link href="/play/travel" className="link">
          Every pin
        </Link>
      }
    >
      <WorldMap headingLevel={3} />
    </Section>
  );
}
