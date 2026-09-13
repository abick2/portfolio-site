import Link from "next/link";
import type { Metadata } from "next";

/**
 * Replaces Next's built-in 404. Without this file the default page renders
 * inside the root layout, which emits a second <title> element alongside the
 * layout's own — invalid HTML, and which one a crawler honours is unspecified.
 */
export const metadata: Metadata = {
  title: "Page not found — Andrew Bickford",
};

export default function NotFound() {
  return (
    <section className="shell flex min-h-[70svh] flex-col justify-center py-24">
      <p className="t-small">404</p>
      <h1 className="t-display mt-3">This page moved, or never existed.</h1>
      <p className="t-body measure mt-5">
        Nothing here. The work, the projects, and the rest of it are all one click away.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/"
          className="sq-full bg-ink px-6 py-3 text-paper transition-transform duration-200 hover:scale-[1.03]"
        >
          Back to the start
        </Link>
        <Link
          href="/#projects"
          className="glass-2 sq-full px-6 py-3 transition-transform duration-200 hover:scale-[1.03]"
        >
          See the projects
        </Link>
      </div>
    </section>
  );
}
