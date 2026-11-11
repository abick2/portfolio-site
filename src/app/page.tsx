import Hero from "@/components/Hero";
import Roadmap from "@/components/Roadmap";
import ProjectGrid from "@/components/ProjectGrid";
import PlayGrid from "@/components/PlayGrid";

/** The name, where it has been, what it made, and everything that is not the job. */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Roadmap />
      <ProjectGrid />
      <PlayGrid />
    </>
  );
}
