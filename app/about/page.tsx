import Image from "next/image";
import type { Metadata } from "next";
import { BAG_IMAGES } from "@/lib/bagImages";

export const metadata: Metadata = {
  title: "About — Elite Classy Bags",
  description: "The story behind Elite Classy Bags.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-16">
      <h1 className="font-display text-3xl text-foreground">Our story</h1>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
        Elite Classy Bags started with a simple frustration: most bags are
        either disposable or unwearably formal. We wanted something in
        between — pieces cut from full-grain leather and heavyweight canvas,
        built to soften and age well, worn with jeans as easily as with a
        suit.
      </p>

      <div className="relative mt-10 aspect-[16/9] w-full overflow-hidden rounded-3xl bg-border">
        <Image
          src={BAG_IMAGES.classicStreet}
          alt="An Elite Classy Bags tote in everyday use"
          fill
          sizes="(min-width: 640px) 800px, 100vw"
          className="object-cover"
        />
      </div>

      <div className="mt-10 grid gap-8 sm:grid-cols-3">
        <div>
          <p className="font-display text-lg text-foreground">
            Small batches
          </p>
          <p className="mt-2 text-sm text-muted">
            Every style is produced in limited runs rather than mass-ordered,
            so quality control stays tight.
          </p>
        </div>
        <div>
          <p className="font-display text-lg text-foreground">
            Honest materials
          </p>
          <p className="mt-2 text-sm text-muted">
            Full-grain leather and heavyweight canvas, chosen for how they
            wear in, not just how they look on day one.
          </p>
        </div>
        <div>
          <p className="font-display text-lg text-foreground">
            Built to last
          </p>
          <p className="mt-2 text-sm text-muted">
            Reinforced stitching and solid hardware, so the bag you buy is
            the one you keep for years.
          </p>
        </div>
      </div>
    </div>
  );
}
