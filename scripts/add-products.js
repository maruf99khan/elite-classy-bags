const { createClient } = require('../node_modules/@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');
const env = fs.readFileSync(envPath, 'utf8');
const get = (k) => {
  const m = env.match(new RegExp('^' + k + '=(.*)', 'm'));
  return m ? m[1].trim() : '';
};

const supabase = createClient(get('NEXT_PUBLIC_SUPABASE_URL'), get('SUPABASE_SERVICE_ROLE_KEY'));

// verified 200-OK, neutral/premium-toned bag photos (see verify-urls check)
const IMG = (id) => `https://images.unsplash.com/photo-${id}?w=800&q=80&auto=format&fit=crop`;

const TOTE_IMAGES = [
  "1624687943971-e86af76d57de",
  "1637759292654-a12cb2be085e",
  "1654707636750-ab67a11b21b7",
  "1760624294582-5341f33f9fa4",
];
const CROSSBODY_IMAGES = [
  "1605733513597-a8f8341084e6",
  "1620786514684-ff35b5aae55e",
  "1718622795525-2295971921ba",
  "1709898838174-83c3e155654c",
  "1620786514669-06e2340fce71",
  "1751522949283-293763ee6f2a",
  "1668114844900-537ab91478b9",
  "1709899098146-378a8057a441",
  "1760624294514-ca40aafe3d96",
  "1709899504137-575171b3258d",
  "1709898131972-084f7342eaa0",
];
const BACKPACK_IMAGES = [
  "1622560480605-d83c853bc5c3",
  "1622560480654-d96214fdc887",
  "1680039211156-66c721b87625",
  "1622560257067-108402fcedc0",
  "1577733975197-3b950ca5cabe",
  "1622560481156-01fc7e1693e6",
  "1549943872-f7ff0b2b51be",
  "1541267732407-8f72c182cf11",
  "1622560482379-c9813322e95a",
  "1642375352724-8b523c67b8be",
  "1577733966973-d680bffd2e80",
  "1617179918913-f4e099813fb5",
];
const CLUTCH_IMAGES = [
  "1749294435694-ce3c586591e6",
  "1688296524548-1d79d1fae657",
  "1749294435693-4f39ec7e0ab2",
  "1749294435697-386a322bab8d",
  "1786482376175-ff0feb2d8ae1",
  "1759717760080-6659d0b34e27",
  "1774141818089-d211d5bd01f9",
  "1758188408858-0f5389c35f50",
  "1758328537049-aae2d077f1dd",
  "1751242864911-1461a0b3a2aa",
];

const PREFIXES = [
  "Onyx", "Cognac", "Sable", "Ivory", "Umber", "Slate", "Amber", "Cedar",
  "Raven", "Dune", "Mocha", "Ash", "Bronze", "Chestnut", "Ebony", "Taupe",
  "Walnut", "Graphite", "Sienna", "Clay", "Fawn", "Charcoal", "Hazel",
  "Copper", "Espresso", "Camel", "Oat", "Nutmeg", "Pewter", "Moss",
  "Vellum", "Driftwood", "Bark", "Fig", "Loam",
];

const CATEGORY_SPECS = {
  totes: {
    nouns: ["Carry Tote", "Weekend Tote", "Market Tote", "Structured Tote", "Everyday Tote"],
    priceRange: [2400, 4600],
    materials: ["Full-grain leather", "Canvas and leather", "Pebbled leather"],
    dims: ['16" x 12" x 5"', '15" x 11" x 4.5"', '17" x 12" x 6"'],
    strap: "9\" handle drop, detachable 22\" shoulder strap",
    capacity: "Fits a 15\" laptop plus daily essentials",
    images: TOTE_IMAGES,
  },
  crossbody: {
    nouns: ["Crossbody", "Sling", "Satchel", "Shoulder Bag", "Saddle Bag"],
    priceRange: [2000, 3800],
    materials: ["Smooth leather", "Pebbled leather", "Suede-finish leather"],
    dims: ['9" x 6" x 2.5"', '10" x 7" x 3"', '8.5" x 6" x 2"'],
    strap: "Adjustable 22\"-24\" strap",
    capacity: "Phone, cardholder, keys, and lip balm",
    images: CROSSBODY_IMAGES,
  },
  clutches: {
    nouns: ["Clutch", "Evening Clutch", "Fold Clutch", "Wristlet"],
    priceRange: [1600, 2800],
    materials: ["Pebbled leather", "Smooth leather", "Suede"],
    dims: ['10" x 6" x 1.5"', '9" x 5.5" x 2"', '11" x 6" x 1.5"'],
    strap: "None — carried by hand, removable wrist strap",
    capacity: "Phone, cards, lipstick and gloss",
    images: CLUTCH_IMAGES,
  },
  backpacks: {
    nouns: ["Backpack", "Daypack", "Commuter Pack", "Weekender Pack"],
    priceRange: [2600, 4800],
    materials: ["Full-grain leather", "Waxed canvas and leather", "Nubuck leather"],
    dims: ['12" x 10" x 5"', '17" x 12" x 6"', '14" x 11" x 5.5"'],
    strap: "Adjustable padded backpack straps",
    capacity: "Fits a 15\" laptop and daily gear",
    images: BACKPACK_IMAGES,
  },
};

const CATEGORY_ORDER = ["totes", "crossbody", "clutches", "backpacks"];
const TARGET_COUNT = 50;

function slugify(name, used) {
  let base = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  let slug = base;
  let i = 2;
  while (used.has(slug)) {
    slug = `${base}-${i}`;
    i += 1;
  }
  used.add(slug);
  return slug;
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(arr, i) {
  return arr[i % arr.length];
}

async function main() {
  console.log("Fetching categories...");
  const { data: categories, error: catErr } = await supabase.from("categories").select("id, slug");
  if (catErr) throw catErr;
  const catIdBySlug = Object.fromEntries(categories.map((c) => [c.slug, c.id]));

  const { data: existing } = await supabase.from("products").select("slug");
  const usedSlugs = new Set((existing || []).map((p) => p.slug));

  const products = [];
  for (let i = 0; i < TARGET_COUNT; i += 1) {
    const catSlug = CATEGORY_ORDER[i % CATEGORY_ORDER.length];
    const cfg = CATEGORY_SPECS[catSlug];
    const prefix = pick(PREFIXES, i);
    const noun = pick(cfg.nouns, Math.floor(i / CATEGORY_ORDER.length));
    const name = `${prefix} ${noun}`;
    const slug = slugify(name, usedSlugs);
    const material = pick(cfg.materials, i);
    const imgId = pick(cfg.images, i);
    const priceCents = randInt(cfg.priceRange[0], cfg.priceRange[1]) * 100;
    const description = `${material} ${noun.toLowerCase()} in a considered, neutral tone — built for daily use and cut to age well, not to expire. Structured shape, reinforced seams, and hardware that won't tarnish.`;

    products.push({
      slug,
      name,
      category_id: catIdBySlug[catSlug],
      price_cents: priceCents,
      description,
      specs: {
        dimensions: pick(cfg.dims, i),
        material,
        strap: cfg.strap,
        capacity: cfg.capacity,
      },
      stock_quantity: randInt(4, 35),
      featured: i % 9 === 0,
      _imgId: imgId,
      _catSlug: catSlug,
    });
  }

  console.log(`Inserting ${products.length} products...`);
  for (const p of products) {
    const { _imgId, _catSlug, ...row } = p;
    const { data: inserted, error: insErr } = await supabase
      .from("products")
      .insert(row)
      .select("id, slug")
      .single();
    if (insErr) {
      console.error(`  FAILED ${p.slug}:`, insErr.message);
      continue;
    }
    const url = IMG(_imgId);
    const { error: imgErr } = await supabase.from("product_images").insert([
      { product_id: inserted.id, url, alt: `${p.name} — front view`, position: 0 },
      { product_id: inserted.id, url, alt: `${p.name} — detail view`, position: 1 },
    ]);
    if (imgErr) console.error(`  image insert failed for ${p.slug}:`, imgErr.message);
    else console.log(`  + ${p.slug}`);
  }

  const { count } = await supabase.from("products").select("id", { count: "exact", head: true });
  console.log(`\nDone. Total products in DB: ${count}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
