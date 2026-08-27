"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

const GRID_VARIANTS = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

export function StaggerGrid({
  children,
  className,
  gridKey,
}: {
  children: ReactNode;
  className?: string;
  gridKey?: string | number;
}) {
  return (
    <motion.div
      key={gridKey}
      variants={GRID_VARIANTS}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
