"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCartUndo } from "@/lib/cart-context";

export function CartUndoToast() {
  const { pending, undo, dismiss } = useCartUndo();

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
      <AnimatePresence>
        {pending && (
          <motion.div
            key={pending.id}
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            role="status"
            aria-live="polite"
            className="pointer-events-auto flex items-center gap-4 rounded-full border border-border bg-card px-5 py-3 shadow-lg"
          >
            <span className="text-sm text-foreground">
              Removed {pending.item.name}
            </span>
            <button
              type="button"
              onClick={undo}
              className="text-sm font-semibold text-accent hover:opacity-80"
            >
              Undo
            </button>
            <button
              type="button"
              onClick={dismiss}
              aria-label="Dismiss"
              className="text-sm text-muted hover:text-foreground"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
