import Hero from "@/components/Hero";
import Roadmap from "@/components/Roadmap";
import ProjectGrid from "@/components/ProjectGrid";
import PlayGrid from "@/components/PlayGrid";
import Places from "@/components/Places";
import About from "@/components/About";

/**
 * One scrolling narrative: the name, where it has been, what it made, and then
 * everything that is not the job.
 *
 * The order puts the hobbies *above* the About paragraph on purpose. The
 * evidence is more persuasive than the self-description, and by the time the
 * paragraph arrives it only has to do what the rows could not.
 *
 * Every section below the hero is a `Section`: same rule, same heading row,
 * same closing space. One rhythm, set in one place.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Roadmap />
      <ProjectGrid />
      <PlayGrid />
      <Places />
      <About />
    </>
  );
}
