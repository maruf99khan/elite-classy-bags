"use client";

import { useMemo, useSyncExternalStore } from "react";
import type { Product } from "@/lib/products";

export interface CartItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

const STORAGE_KEY = "ecb-cart";
const listeners = new Set<() => void>();
const EMPTY_ITEMS: CartItem[] = [];

let items: CartItem[] = EMPTY_ITEMS;
let hydrated = false;

function readStorage(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeStorage(next: CartItem[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore unavailable storage
  }
}

function commit(next: CartItem[]) {
  items = next;
  writeStorage(items);
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// Reads from localStorage lazily, on first client access — never on the
// server, so the server snapshot below stays the source of truth for SSR
// and the initial hydration pass.
function getSnapshot(): CartItem[] {
  if (!hydrated) {
    hydrated = true;
    items = readStorage();
  }
  return items;
}

function getServerSnapshot(): CartItem[] {
  return EMPTY_ITEMS;
}

function addItem(product: Product, quantity = 1) {
  const current = getSnapshot();
  const existing = current.find((item) => item.slug === product.slug);
  if (existing) {
    commit(
      current.map((item) =>
        item.slug === product.slug
          ? { ...item, quantity: item.quantity + quantity }
          : item,
      ),
    );
    return;
  }
  commit([
    ...current,
    {
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
    },
  ]);
}

export interface PendingRemoval {
  item: CartItem;
  id: number;
}

const UNDO_TIMEOUT_MS = 5000;
const undoListeners = new Set<() => void>();
let pendingRemoval: PendingRemoval | null = null;
let pendingRemovalTimer: ReturnType<typeof setTimeout> | null = null;

function subscribeUndo(listener: () => void) {
  undoListeners.add(listener);
  return () => undoListeners.delete(listener);
}

function getUndoSnapshot(): PendingRemoval | null {
  return pendingRemoval;
}

function getUndoServerSnapshot(): PendingRemoval | null {
  return null;
}

function clearPendingRemoval() {
  if (pendingRemovalTimer) clearTimeout(pendingRemovalTimer);
  pendingRemovalTimer = null;
  pendingRemoval = null;
  undoListeners.forEach((listener) => listener());
}

function removeItem(slug: string) {
  const current = getSnapshot();
  const removed = current.find((item) => item.slug === slug);
  commit(current.filter((item) => item.slug !== slug));

  if (removed) {
    if (pendingRemovalTimer) clearTimeout(pendingRemovalTimer);
    pendingRemoval = { item: removed, id: Date.now() };
    undoListeners.forEach((listener) => listener());
    pendingRemovalTimer = setTimeout(clearPendingRemoval, UNDO_TIMEOUT_MS);
  }
}

function undoRemove() {
  if (!pendingRemoval) return;
  const { item } = pendingRemoval;
  const current = getSnapshot();
  const existing = current.find((i) => i.slug === item.slug);
  commit(
    existing
      ? current.map((i) =>
          i.slug === item.slug
            ? { ...i, quantity: i.quantity + item.quantity }
            : i,
        )
      : [...current, item],
  );
  clearPendingRemoval();
}

export function useCartUndo() {
  const pending = useSyncExternalStore(
    subscribeUndo,
    getUndoSnapshot,
    getUndoServerSnapshot,
  );
  return { pending, undo: undoRemove, dismiss: clearPendingRemoval };
}

function updateQuantity(slug: string, quantity: number) {
  if (quantity <= 0) {
    removeItem(slug);
    return;
  }
  commit(
    getSnapshot().map((item) => (item.slug === slug ? { ...item, quantity } : item)),
  );
}

function clear() {
  commit([]);
}

export function useCart() {
  const currentItems = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const count = useMemo(
    () => currentItems.reduce((sum, item) => sum + item.quantity, 0),
    [currentItems],
  );
  const subtotal = useMemo(
    () => currentItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [currentItems],
  );

  return {
    items: currentItems,
    addItem,
    removeItem,
    updateQuantity,
    clear,
    count,
    subtotal,
  };
}
