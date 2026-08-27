"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { animate, stagger, text } from "animejs";

export function HomeHero() {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!headingRef.current) return;
    const splitter = text.splitText(headingRef.current, { words: true });
    animate(splitter.words, {
      opacity: [0, 1],
      y: [20, 0],
      duration: 600,
      delay: stagger(40),
      ease: "outQuad",
    });
    return () => {
      splitter.revert();
    };
  }, []);

  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-20 sm:grid-cols-2 sm:py-28">
        <div>
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-sm font-medium uppercase tracking-widest text-accent"
          >
            New season
          </motion.p>
          <h1
            ref={headingRef}
            className="mt-4 font-display text-4xl leading-tight text-foreground sm:text-5xl"
          >
            Bags built for a considered, everyday life.
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-5 max-w-md text-base text-muted"
          >
            Full-grain leather and durable canvas, cut into totes,
            crossbodies, clutches, and backpacks meant to be carried for
            years, not seasons.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="mt-8"
          >
            <Link
              href="/shop"
              className="inline-flex items-center justify-center rounded-full bg-accent px-7 py-3 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90"
            >
              Shop the collection
            </Link>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative aspect-square w-full overflow-hidden rounded-3xl bg-border"
        >
          <Image
            src="https://picsum.photos/seed/hero-bags/1200/1200"
            alt="An Elite Classy Bags leather tote resting on a table"
            fill
            priority
            sizes="(min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
}
