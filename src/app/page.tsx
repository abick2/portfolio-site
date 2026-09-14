import Hero from "@/components/Hero";
import Roadmap from "@/components/Roadmap";
import ProjectMosaic from "@/components/ProjectMosaic";
import PlayRows from "@/components/PlayRows";
import Numbers from "@/components/Numbers";
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
 * Section padding lives on the sections themselves — the hero's `16vh` bottom
 * is what separates it from the roadmap, and every section below closes with
 * `14vh` or `12vh` rather than opening with a top margin. One rhythm, set in
 * one direction.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Roadmap />
      <ProjectMosaic />
      <PlayRows />
      <Numbers />
      <Places />
      <About />
    </>
  );
}
