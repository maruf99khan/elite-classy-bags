"use client";

import { useEffect, useRef } from "react";
import { animate, svg } from "animejs";

export function OrderConfirmedCheck() {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (!pathRef.current) return;
    const drawable = svg.createDrawable(pathRef.current);
    animate(drawable, {
      draw: ["0 0", "0 1"],
      duration: 700,
      ease: "outQuad",
    });
  }, []);

  return (
    <svg
      viewBox="0 0 52 52"
      className="h-14 w-14 text-accent"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
    >
      <circle
        cx="26"
        cy="26"
        r="24"
        strokeOpacity={0.25}
      />
      <path
        ref={pathRef}
        d="M15 27l7 7 15-15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
