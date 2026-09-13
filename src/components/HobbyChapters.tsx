import { playAreas } from "@/data/play";
import HobbyChapter from "./HobbyChapter";

/**
 * The four hobbies, stacked. Every chapter is text-left / photos-right — no
 * alternating sides. Flipping them would turn four chapters into a zig-zag
 * pattern, and the pattern would become the thing you notice instead of the
 * photographs.
 *
 * The numerals are set at the same size as the titles and only differ in weight
 * and colour, so they count the chapters without announcing themselves.
 */
export default function HobbyChapters() {
  return (
    <div className="space-y-20 md:space-y-32">
      {playAreas.map((area, i) => (
        <HobbyChapter
          key={area.slug}
          area={area}
          numeral={String(i + 1).padStart(2, "0")}
        />
      ))}
    </div>
  );
}
