import Hero from "@/components/Hero";
import Claims from "@/components/Claims";
import Weave from "@/components/Weave";
import ProjectMosaic from "@/components/ProjectMosaic";
import PlayTiles from "@/components/PlayTiles";
import About from "@/components/About";

/**
 * The home page is one scrolling narrative: the claim, the evidence for it,
 * then the person. Detail lives on its own routes so this page never has to
 * become exhaustive.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Claims />
      <Weave />
      <ProjectMosaic />
      <PlayTiles />
    </>
  );
}
