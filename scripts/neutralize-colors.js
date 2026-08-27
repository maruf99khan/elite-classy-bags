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

// swap the two remaining bright-colored (pink/teal) products for neutral, premium tones
const updates = {
  "noor-clutch": {
    image: "https://images.unsplash.com/photo-1751242864911-1461a0b3a2aa?w=800&q=80&auto=format&fit=crop",
    alt: "Sleek black leather clutch on a plain background",
    alt2: "Black leather clutch — hardware detail",
    description:
      "A sleek black leather clutch, minimal and versatile. Featherlight, surprisingly roomy: fits phone, cards, lipstick and a paperback. Carry by hand or tuck under your arm — dress it up or bring it to brunch.",
  },
  "isla-clutch": {
    image: "https://images.unsplash.com/photo-1749294435694-ce3c586591e6?w=800&q=80&auto=format&fit=crop",
    alt: "Cognac pebbled-leather top-zip clutch on a wooden surface",
    alt2: "Cognac clutch interior — satin lining detail",
    description:
      "A cognac pebbled-leather top-zip clutch with a satin-lined interior and two card slots. Holds the night's essentials without the bulk — carry by hand or tuck under your arm.",
  },
};

async function main() {
  for (const [slug, upd] of Object.entries(updates)) {
    const { data: product, error: findErr } = await supabase
      .from("products")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (findErr || !product) {
      console.error(`skip ${slug}:`, findErr?.message ?? "not found");
      continue;
    }
    const { error: updErr } = await supabase
      .from("products")
      .update({ description: upd.description })
      .eq("id", product.id);
    if (updErr) console.error(`  product update error for ${slug}:`, updErr.message);
    else console.log(`updated description for ${slug}`);

    const { data: images } = await supabase
      .from("product_images")
      .select("id, position")
      .eq("product_id", product.id)
      .order("position");
    for (const img of images || []) {
      const { error: imgErr } = await supabase
        .from("product_images")
        .update({ url: upd.image, alt: img.position === 0 ? upd.alt : upd.alt2 })
        .eq("id", img.id);
      if (imgErr) console.error(`  image update error for ${slug}:`, imgErr.message);
      else console.log(`  image position ${img.position} updated for ${slug}`);
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
