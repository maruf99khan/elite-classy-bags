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

// these two photos turned out to be wide shop-interior shots (one shows a
// competitor's storefront branding, the other a colorful market stall) —
// replace with single-item, neutral-toned clutch photos already verified good
const replacements = {
  "amber-evening-clutch": "https://images.unsplash.com/photo-1688296524548-1d79d1fae657?w=800&q=80&auto=format&fit=crop",
  "ash-wristlet": "https://images.unsplash.com/photo-1749294435697-386a322bab8d?w=800&q=80&auto=format&fit=crop",
  "oat-fold-clutch": "https://images.unsplash.com/photo-1751242864911-1461a0b3a2aa?w=800&q=80&auto=format&fit=crop",
  "ivory-evening-clutch": "https://images.unsplash.com/photo-1786482376175-ff0feb2d8ae1?w=800&q=80&auto=format&fit=crop",
  "sienna-clutch": "https://images.unsplash.com/photo-1749294435693-4f39ec7e0ab2?w=800&q=80&auto=format&fit=crop",
};

async function main() {
  for (const [slug, url] of Object.entries(replacements)) {
    const { data: product } = await supabase.from("products").select("id, name").eq("slug", slug).maybeSingle();
    if (!product) {
      console.error(`skip ${slug}: not found`);
      continue;
    }
    const { error } = await supabase
      .from("product_images")
      .update({ url, alt: `${product.name} — single item view` })
      .eq("product_id", product.id);
    if (error) console.error(`  failed ${slug}:`, error.message);
    else console.log(`  fixed ${slug}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
