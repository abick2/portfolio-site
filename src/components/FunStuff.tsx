import HobbyChapters from "./HobbyChapters";
import ProjectMosaic from "./ProjectMosaic";

/**
 * The second half of the fork: everything that is not the job.
 *
 * The hobbies and the projects are one section rather than two because they are
 * the same argument — the curiosity that builds a drone is the curiosity that
 * signs up for a triathlon. `#play` and `#projects` survive as sub-anchors so
 * every existing link into this content still resolves.
 */
export default function FunStuff() {
  return (
    <section id="fun">
      <div className="shell pt-24 sm:pt-32">
        <div className="measure">
          <h2 className="t-section">The fun stuff</h2>
          <p className="t-body mt-5">
            The part I enjoy sharing most — what I do with the hours nobody is paying me
            for, and the things I have built because I wanted them to exist.
          </p>
        </div>
      </div>

      <div id="play" className="shell mt-14">
        <HobbyChapters />
      </div>

      <ProjectMosaic />
    </section>
  );
}
