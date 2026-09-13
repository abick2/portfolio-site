import Hero from "@/components/Hero";
import Claims from "@/components/Claims";
import Reveal from "@/components/Reveal";
import ChoosePath from "@/components/ChoosePath";
import Weave from "@/components/Weave";
import FunStuff from "@/components/FunStuff";
import About from "@/components/About";

/**
 * The home page is one scrolling narrative: the claim, the person, then a fork
 * into the two halves of them. The fork is a shortcut rather than a gate —
 * everything below it is reachable by simply continuing to scroll.
 *
 * `Hero` is deliberately NOT wrapped in `Reveal`. That wrapper animates opacity
 * and transform, and either one creates a stacking context, which would isolate
 * blending and kill the headline's knockout effect.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Reveal>
        <About />
      </Reveal>
      <Reveal>
        <Claims />
      </Reveal>
      <Reveal>
        <ChoosePath />
      </Reveal>
      <Weave />
      <FunStuff />
    </>
  );
}
