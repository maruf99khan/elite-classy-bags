// curated women's bags — all images.unsplash.com, verified 200 OK w=800
// descriptions in demoProducts.ts match each photo exactly
export const BAG_IMAGES = {
  // hero / lifestyle — woman in denim holding large tan tote (Latico Leathers)
  heroTote: "https://images.unsplash.com/photo-1760624294504-211e763ee0fb?w=800&q=80&auto=format&fit=crop",
  // editorial — woman holding pink purse + phone (verified bag)
  editorialPink: "https://images.unsplash.com/photo-1715623302976-97a6af93fc0e?w=800&q=80&auto=format&fit=crop",
  // teal handbag flatlay with accessories
  tealHandbag: "https://images.unsplash.com/photo-1760624295064-2de890f64524?w=800&q=80&auto=format&fit=crop",
  // closeup of woman with white tote (branding)
  whiteTote: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80&auto=format&fit=crop",
  // brown leather handbag on wooden chair
  brownHandbag: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80&auto=format&fit=crop",
  // leather macro detail — pebbled brown leather & stitch
  leatherMacro: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80&auto=format&fit=crop",
  // black shoulder sling / backpack style
  blackShoulder: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80&auto=format&fit=crop",
  // signature pebbled tan handbag on white
  signatureTan: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&q=80&auto=format&fit=crop",
  // classic street style — woman walking with tote (fallback)
  classicStreet: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=800&q=80&auto=format&fit=crop",
} as const;

export const BAG_FALLBACK = BAG_IMAGES.brownHandbag;

export const BAG_GALLERY = [
  BAG_IMAGES.heroTote,
  BAG_IMAGES.editorialPink,
  BAG_IMAGES.tealHandbag,
  BAG_IMAGES.whiteTote,
  BAG_IMAGES.brownHandbag,
  BAG_IMAGES.leatherMacro,
  BAG_IMAGES.blackShoulder,
  BAG_IMAGES.signatureTan,
] as const;

export function sanitizeBagImage(url?: string | null): string {
  if (!url || typeof url !== "string") return BAG_FALLBACK;
  try {
    const u = new URL(url);
    const host = u.hostname.toLowerCase();
    // legacy random hosts → replace with real women's bag so photo === description
    if (
      host.includes("loremflickr") ||
      host.includes("lorem") ||
      host.includes("picsum") ||
      host.includes("placeholder") ||
      host.includes("fakeimg")
    ) {
      return BAG_FALLBACK;
    }
    if (u.protocol !== "https:" && u.protocol !== "http:") return BAG_FALLBACK;
    return url;
  } catch {
    return BAG_FALLBACK;
  }
}

export function sanitizeBagImages(urls?: string[] | null): string[] {
  if (!urls || !Array.isArray(urls) || urls.length === 0) return [BAG_FALLBACK];
  const cleaned = urls.map((u) => sanitizeBagImage(u)).filter(Boolean);
  return cleaned.length ? cleaned : [BAG_FALLBACK];
}
