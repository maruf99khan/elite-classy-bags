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

const BAG_IMAGES = {
  heroTote: "https://images.unsplash.com/photo-1760624294504-211e763ee0fb?w=800&q=80&auto=format&fit=crop",
  editorialPink: "https://images.unsplash.com/photo-1715623302976-97a6af93fc0e?w=800&q=80&auto=format&fit=crop",
  tealHandbag: "https://images.unsplash.com/photo-1760624295064-2de890f64524?w=800&q=80&auto=format&fit=crop",
  whiteTote: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80&auto=format&fit=crop",
  brownHandbag: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80&auto=format&fit=crop",
  leatherMacro: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80&auto=format&fit=crop",
  blackShoulder: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80&auto=format&fit=crop",
  signatureTan: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&q=80&auto=format&fit=crop",
  classicStreet: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=800&q=80&auto=format&fit=crop",
};

const updates = {
  "isla-clutch": {
    image: BAG_IMAGES.tealHandbag,
    alt: "Teal pebbled leather clutch flat-laid with phone, wallet and gloss to show scale",
    alt2: "Teal clutch interior — satin lining detail",
    description: "The teal bag in the photo: pebbled-leather top-zip clutch flat-laid with phone, wallet and gloss to show scale. Satin-lined interior with two card slots. Holds the night's essentials without the bulk — carry by hand or tuck under your arm. Photo equals product.",
    specs: { material: "Pebbled leather, satin lining", dimensions: '10" x 6" x 1.5"', strap: "None — carried by hand", capacity: "Phone, cards, lipstick and gloss" },
  },
  "noor-clutch": {
    image: BAG_IMAGES.editorialPink,
    alt: "Blush pink shoulder bag with gold chain strap, held with phone for scale",
    alt2: "Blush pink bag chain detail — removable shoulder to clutch",
    description: "The blush pink bag in the photo — soft pebbled leather with gold chain strap, held with phone for scale. Featherlight, surprisingly roomy: fits phone, cards, lipstick and a paperback. Chain is removable so it converts from shoulder to clutch in two seconds. Feminine without trying too hard.",
    specs: { material: "Pebbled leather, gold hardware", dimensions: '9" x 5.5" x 2"', strap: "Removable 22\" chain — shoulder to clutch", capacity: "Phone, cards, lipstick, paperback" },
  },
  "marlo-crossbody": {
    image: BAG_IMAGES.blackShoulder,
    alt: "Sleek black shoulder sling in smooth leather with wide adjustable strap — zip-secured, hands-free",
    alt2: "Black sling strap detail — adjustable and flat against the body",
    description: "The black shoulder bag in the photo: sleek sling/crossbody in smooth leather with a wide adjustable strap. Sits flat against the body, zip-secured, sized for phone, keys and cards. From commute to coffee, it stays out of your way and keeps your hands free. Minimal logo, maximum function.",
    specs: { material: "Smooth leather, matte hardware", dimensions: '9" x 6" x 2.5"', strap: "Wide adjustable 22\"–24\" sling", capacity: "Phone, cardholder, keys, lip balm" },
  },
  "sable-crossbody": {
    image: BAG_IMAGES.brownHandbag,
    alt: "Structured cognac handbag in pebbled leather perched on wooden chair — top handles with detachable strap",
    alt2: "Cognac handbag brass feet and edge paint detail",
    description: "The bag in the photo: structured cognac handbag in pebbled genuine leather perched on a wooden chair. Top handles plus detachable shoulder strap, brass feet, edge-painted seams and a magnetic top frame that opens wide. What you see is what ships — same stitch, same grain.",
    specs: { material: "Pebbled genuine leather, brass feet", dimensions: '11" x 8" x 4"', strap: "Top handles + detachable crossbody strap", capacity: "Phone, wallet, notebook and keys" },
  },
  "harlow-tote": {
    image: BAG_IMAGES.heroTote,
    alt: "Woman in denim dress holding a large tan leather tote — full-grain leather with brass hardware",
    alt2: "Tan tote interior — roomy enough for 15\" laptop",
    description: "The tote in the photo: full-grain tan leather carry-all with brass studs, shown on a woman in denim. Roomy enough for a 15\" laptop, water bottle and market haul, yet structured so it stands upright. Hand-chosen for its pull-up grain that softens — not cracks — with use. Top zip, interior pocket.",
    specs: { material: "Full-grain leather, brass studs", dimensions: '16" x 12" x 5"', strap: "9\" handle drop, 22\" shoulder strap", capacity: "Fits a 15\" laptop plus daily essentials" },
  },
  "aveline-tote": {
    image: BAG_IMAGES.whiteTote,
    alt: "Close-up of woman carrying a clean white canvas tote with leather handles — minimal and durable",
    alt2: "White tote reinforced base and interior zip pocket detail",
    description: "The white tote in the photo: close-up of a woman carrying a clean canvas tote with leather handles. Minimal, wipe-clean, and made to be tossed in a rickshaw or office chair daily. Reinforced base, interior zip pocket, and handles that won't dig. Your market, office and weekend bag in one.",
    specs: { material: "Canvas body, leather handles, reinforced base", dimensions: '15" x 11" x 4.5"', strap: "10\" handle drop", capacity: "Fits a 13\" laptop, notebook and water bottle" },
  },
  "rowan-backpack": {
    image: BAG_IMAGES.signatureTan,
    alt: "Warm tan pebbled handbag with contrast stitching and magnetic frame top — opens wide",
    alt2: "Tan pebbled leather contrast stitching detail",
    description: "The warm tan bag in the photo: signature pebbled leather with contrast cream stitching and a magnetic frame top. Opens wide for easy access, holds its shape when set down, and lands softly on any table. The quiet statement piece — no monogram, just beautiful leather. Shown as a backpack alternative for daily commuting.",
    specs: { material: "Pebbled leather, contrast stitching", dimensions: '12" x 10" x 5"', strap: "Adjustable backpack straps + top handle", capacity: "Fits a 13\" laptop and daily gear" },
  },
  "quinby-backpack": {
    image: BAG_IMAGES.leatherMacro,
    alt: "Heritage brown leather — macro detail of pebbled leather, edge paint and 18 stitches per inch",
    alt2: "Brown leather brass rivets and pull-up grain detail — macro",
    description: "The brown Satchel in the photo — macro detail of pebbled leather, edge paint and 18 stitches per inch. Brass rivets that won't green and pull-up leather that lightens where it creases — the sign of real hide. Built to age, not to expire. Shown at 100mm macro so you can count the stitches before you buy.",
    specs: { material: "Pull-up leather, brass rivets, edge paint", dimensions: '17" x 12" x 6"', strap: "Adjustable shoulder straps, 15\"–19\" drop", capacity: "Fits a 15\" laptop plus a change of clothes" },
  },
};

async function main() {
  console.log("Fetching products...");
  const { data: products, error: prodErr } = await supabase.from("products").select("id, slug, name");
  if (prodErr) throw prodErr;
  console.log(`Found ${products.length} products`);
  for (const p of products) {
    const upd = updates[p.slug];
    if (!upd) { console.log(`- skip ${p.slug}`); continue; }
    console.log(`\nUpdating ${p.slug} (${p.id})...`);
    const { error: prodUpdateErr } = await supabase.from("products").update({ description: upd.description, specs: upd.specs }).eq("id", p.id);
    if (prodUpdateErr) console.error("  product update error:", prodUpdateErr); else console.log("  product description/specs updated");
    const { data: images } = await supabase.from("product_images").select("id, position, url").eq("product_id", p.id).order("position");
    console.log(`  existing images:`, images?.map(i => `${i.position}:${i.url.slice(0,40)}`));
    for (const img of images || []) {
      const newUrl = upd.image;
      const newAlt = img.position === 0 ? upd.alt : upd.alt2;
      const { error: imgErr } = await supabase.from("product_images").update({ url: newUrl, alt: newAlt }).eq("id", img.id);
      if (imgErr) console.error("  image update error:", imgErr); else console.log(`  image position ${img.position} updated`);
    }
  }
  console.log("\nDone. Verifying...");
  const { data: verify } = await supabase.from("product_images").select("url, alt, position, product:products(slug)").limit(16);
  console.log(JSON.stringify(verify, null, 2));
}
main().catch(e => console.error(e));
