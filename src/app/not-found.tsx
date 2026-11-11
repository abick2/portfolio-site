import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found — Andrew Bickford",
};

export default function NotFound() {
  return (
    <section className="page flex min-h-[70svh] flex-col justify-center py-24">
      <p className="t-small">404</p>
      <h1 className="t-section mt-3">This page moved, or never existed.</h1>
      <p className="t-body measure mt-5">
        Nothing here. The work, the projects, and the rest of it are all one click away.
      </p>
      <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
        <Link href="/" className="t-title link">
          Back to the start
        </Link>
        <Link href="/#work" className="t-title link">
          See the projects
        </Link>
      </div>
    </section>
  );
}
