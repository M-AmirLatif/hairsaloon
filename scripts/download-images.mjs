/**
 * Image downloader and SHA-256 de-duplication verifier
 * Downloads 20 unique, verified Unsplash photos for Smooth Cut Hair Studio.
 * Verifies that zero files share the same SHA-256 hash.
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const IMAGES_DIR = path.resolve(__dirname, '../public/images');

if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

export const imageCatalog = [
  // Core Sections
  {
    id: 'hero-barber',
    filename: 'hero-grooming.webp',
    unsplashId: '1503951914875-452162b0f3f1',
    category: 'salon',
    categoryLabel: 'Salon',
    actualContent: 'Barber in black apron trimming hair of male customer in modern salon chair',
    photographer: 'Hai Phung',
    photographerUrl: 'https://unsplash.com/@haiphung',
    unsplashUrl: 'https://unsplash.com/photos/1503951914875-452162b0f3f1',
    license: 'Unsplash License',
  },
  {
    id: 'about-workstation',
    filename: 'about-workstation.webp',
    unsplashId: '1585747860715-2ba37e788b70',
    category: 'salon',
    categoryLabel: 'Salon',
    actualContent: 'Modern salon workstation with large mirrors, warm pendant lighting, and leather barber chairs',
    photographer: 'Arthur Humeau',
    photographerUrl: 'https://unsplash.com/@arthurhumeau',
    unsplashUrl: 'https://unsplash.com/photos/1585747860715-2ba37e788b70',
    license: 'Unsplash License',
  },

  // Services (6 unique images)
  {
    id: 'service-haircut',
    filename: 'service-haircut.webp',
    unsplashId: '1622286342621-4bd786c2447c',
    category: 'haircuts',
    categoryLabel: 'Haircuts',
    actualContent: 'Young man with clean side-parted classic taper haircut looking forward',
    photographer: 'Apostolos Vamvouras',
    photographerUrl: 'https://unsplash.com/@vamvouras',
    unsplashUrl: 'https://unsplash.com/photos/1622286342621-4bd786c2447c',
    license: 'Unsplash License',
  },
  {
    id: 'service-beard',
    filename: 'service-beard.webp',
    unsplashId: '1621605815971-fbc98d665033',
    category: 'beard',
    categoryLabel: 'Beard Styling',
    actualContent: 'Barber shaping cheek line of a groomed dark beard using trimmer',
    photographer: 'Farid Askerov',
    photographerUrl: 'https://unsplash.com/@faridaskerov',
    unsplashUrl: 'https://unsplash.com/photos/1621605815971-fbc98d665033',
    license: 'Unsplash License',
  },
  {
    id: 'service-fade',
    filename: 'service-fade.webp',
    unsplashId: '1522337360788-8b13dee7a37e',
    category: 'fades',
    categoryLabel: 'Fades',
    actualContent: 'Profile view of clean taper fade haircut blending down to skin',
    photographer: 'Paul Siewert',
    photographerUrl: 'https://unsplash.com/@paulsiewert',
    unsplashUrl: 'https://unsplash.com/photos/1522337360788-8b13dee7a37e',
    license: 'Unsplash License',
  },
  {
    id: 'service-styling',
    filename: 'service-styling.webp',
    unsplashId: '1599351431202-1e0f0137899a',
    category: 'haircuts',
    categoryLabel: 'Haircuts',
    actualContent: 'Barber hands holding comb and precision shears cutting wet hair',
    photographer: 'Nick Demou',
    photographerUrl: 'https://unsplash.com/@nickdemou',
    unsplashUrl: 'https://unsplash.com/photos/1599351431202-1e0f0137899a',
    license: 'Unsplash License',
  },
  {
    id: 'service-wash',
    filename: 'service-wash.webp',
    unsplashId: '1501196354995-cbb51c65aaea',
    category: 'salon',
    categoryLabel: 'Salon',
    actualContent: 'Hair salon wash basin with clean running water and shampoo bottles',
    photographer: 'Adam Winger',
    photographerUrl: 'https://unsplash.com/@adamwinger',
    unsplashUrl: 'https://unsplash.com/photos/1501196354995-cbb51c65aaea',
    license: 'Unsplash License',
  },
  {
    id: 'service-facial',
    filename: 'service-facial.webp',
    unsplashId: '1570172619644-dfd03ed5d881',
    category: 'salon',
    categoryLabel: 'Salon',
    actualContent: 'Relaxing facial care treatment with refreshing skincare application',
    photographer: 'Content Pixie',
    photographerUrl: 'https://unsplash.com/@contentpixie',
    unsplashUrl: 'https://unsplash.com/photos/1570172619644-dfd03ed5d881',
    license: 'Unsplash License',
  },

  // Gallery (12 balanced images: 3 haircuts, 3 fades, 3 beard, 3 salon & tools)
  {
    id: 'gallery-haircut-1',
    filename: 'gallery-haircut-taper.webp',
    unsplashId: '1534778356534-d3d45b6df1da',
    category: 'haircuts',
    categoryLabel: 'Haircuts',
    actualContent: 'Short side-part men haircut styled with matte cream',
    photographer: 'Gilles Lambert',
    photographerUrl: 'https://unsplash.com/@gilleslambert',
    unsplashUrl: 'https://unsplash.com/photos/1534778356534-d3d45b6df1da',
    license: 'Unsplash License',
  },
  {
    id: 'gallery-haircut-2',
    filename: 'gallery-haircut-shear.webp',
    unsplashId: '1634449571010-02389ed0f9b0',
    category: 'haircuts',
    categoryLabel: 'Haircuts',
    actualContent: 'Barber using professional shears to shape textured crown hair',
    photographer: 'Nataniel Susanteling',
    photographerUrl: 'https://unsplash.com/@nataniel',
    unsplashUrl: 'https://unsplash.com/photos/1634449571010-02389ed0f9b0',
    license: 'Unsplash License',
  },
  {
    id: 'gallery-haircut-3',
    filename: 'gallery-haircut-texture.webp',
    unsplashId: '1592647420148-bfcc177e2117',
    category: 'haircuts',
    categoryLabel: 'Haircuts',
    actualContent: 'Clean modern textured scissor haircut on male model',
    photographer: 'Ali Pazani',
    photographerUrl: 'https://unsplash.com/@alipazani',
    unsplashUrl: 'https://unsplash.com/photos/1592647420148-bfcc177e2117',
    license: 'Unsplash License',
  },
  {
    id: 'gallery-fade-1',
    filename: 'gallery-fade-mid.webp',
    unsplashId: '1605497788044-5a32c7078486',
    category: 'fades',
    categoryLabel: 'Fades',
    actualContent: 'Side profile showing mid taper fade with textured top hair styling',
    photographer: 'Grooming Lounge',
    photographerUrl: 'https://unsplash.com/@groominglounge',
    unsplashUrl: 'https://unsplash.com/photos/1605497788044-5a32c7078486',
    license: 'Unsplash License',
  },
  {
    id: 'gallery-fade-2',
    filename: 'gallery-fade-crop.webp',
    unsplashId: '1622287162716-f311baa1a2b8',
    category: 'fades',
    categoryLabel: 'Fades',
    actualContent: 'Clean fade perimeter line with short cropped hair',
    photographer: 'Apostolos Vamvouras',
    photographerUrl: 'https://unsplash.com/@vamvouras',
    unsplashUrl: 'https://unsplash.com/photos/1622287162716-f311baa1a2b8',
    license: 'Unsplash License',
  },
  {
    id: 'gallery-fade-3',
    filename: 'gallery-fade-low.webp',
    unsplashId: '1508214751196-bcfd4ca60f91',
    category: 'fades',
    categoryLabel: 'Fades',
    actualContent: 'Low skin fade transition along neckline and temple',
    photographer: 'Christian Buehner',
    photographerUrl: 'https://unsplash.com/@christianbuehner',
    unsplashUrl: 'https://unsplash.com/photos/1508214751196-bcfd4ca60f91',
    license: 'Unsplash License',
  },
  {
    id: 'gallery-beard-1',
    filename: 'gallery-beard-shape.webp',
    unsplashId: '1512690459411-b9245aed614b',
    category: 'beard',
    categoryLabel: 'Beard Styling',
    actualContent: 'Full beard grooming with clean mustache line and shaped sideburns',
    photographer: 'Michael DeMoya',
    photographerUrl: 'https://unsplash.com/@demoya',
    unsplashUrl: 'https://unsplash.com/photos/1512690459411-b9245aed614b',
    license: 'Unsplash License',
  },
  {
    id: 'gallery-beard-2',
    filename: 'gallery-beard-trim.webp',
    unsplashId: '1516975080664-ed2fc6a32937',
    category: 'beard',
    categoryLabel: 'Beard Styling',
    actualContent: 'Trimming beard hairs evenly along jawline',
    photographer: 'Austin Distel',
    photographerUrl: 'https://unsplash.com/@austindistel',
    unsplashUrl: 'https://unsplash.com/photos/1516975080664-ed2fc6a32937',
    license: 'Unsplash License',
  },
  {
    id: 'gallery-beard-3',
    filename: 'gallery-beard-care.webp',
    unsplashId: '1580618672591-eb180b1a973f',
    category: 'beard',
    categoryLabel: 'Beard Styling',
    actualContent: 'Well-maintained short beard and mustache on male profile',
    photographer: 'Grooming Lounge',
    photographerUrl: 'https://unsplash.com/@groominglounge',
    unsplashUrl: 'https://unsplash.com/photos/1580618672591-eb180b1a973f',
    license: 'Unsplash License',
  },
  {
    id: 'gallery-salon-1',
    filename: 'gallery-salon-chair.webp',
    unsplashId: '1560869713-7d0a29430803',
    category: 'salon',
    categoryLabel: 'Salon',
    actualContent: 'Classic heavy black leather barber chair in vintage barbershop setting',
    photographer: 'Nick Karvounis',
    photographerUrl: 'https://unsplash.com/@nickkarvounis',
    unsplashUrl: 'https://unsplash.com/photos/1560869713-7d0a29430803',
    license: 'Unsplash License',
  },
  {
    id: 'gallery-salon-2',
    filename: 'gallery-salon-interior.webp',
    unsplashId: '1567894340315-735d7c361db0',
    category: 'salon',
    categoryLabel: 'Salon',
    actualContent: 'Barbershop interior showing tidy stations, mirrors, and waiting area',
    photographer: 'Ferdinand Stöhr',
    photographerUrl: 'https://unsplash.com/@fstoehr',
    unsplashUrl: 'https://unsplash.com/photos/1567894340315-735d7c361db0',
    license: 'Unsplash License',
  },
  {
    id: 'gallery-tools-1',
    filename: 'gallery-tools-barber.webp',
    unsplashId: '1621607512214-68297480165e',
    category: 'tools',
    categoryLabel: 'Tools',
    actualContent: 'Barber haircutting shears, metal comb, and guarded blades on workstation',
    photographer: 'Farid Askerov',
    photographerUrl: 'https://unsplash.com/@faridaskerov',
    unsplashUrl: 'https://unsplash.com/photos/1621607512214-68297480165e',
    license: 'Unsplash License',
  },
];

async function downloadSingleImage(item) {
  const targetPath = path.join(IMAGES_DIR, item.filename);
  const url = `https://images.unsplash.com/photo-${item.unsplashId}?auto=format&fit=crop&w=1200&q=82`;

  console.log(`Downloading [${item.id}]: ${item.filename} (ID: ${item.unsplashId})...`);
  const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${item.unsplashId}`);
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.length < 5000) {
    throw new Error(`File size too small: ${buffer.length} bytes`);
  }
  fs.writeFileSync(targetPath, buffer);
  const hash = crypto.createHash('sha256').update(buffer).digest('hex');
  console.log(`✓ Saved ${item.filename} (${(buffer.length / 1024).toFixed(1)} KB) - Hash: ${hash.slice(0, 8)}`);
  return { filename: item.filename, hash, bytes: buffer.length };
}

async function run() {
  console.log(`Starting download and de-duplication check for ${imageCatalog.length} distinct assets...\n`);
  const results = [];
  for (const item of imageCatalog) {
    const res = await downloadSingleImage(item);
    results.push(res);
  }

  // SHA-256 De-duplication check
  console.log('\n--- Running SHA-256 De-Duplication Verification ---');
  const hashMap = new Map();
  let duplicateCount = 0;

  for (const r of results) {
    if (hashMap.has(r.hash)) {
      console.error(`✗ DUPLICATE DETECTED! ${r.filename} has identical hash to ${hashMap.get(r.hash)}`);
      duplicateCount++;
    } else {
      hashMap.set(r.hash, r.filename);
    }
  }

  if (duplicateCount > 0) {
    console.error(`\nFAILED: Found ${duplicateCount} duplicate images!`);
    process.exit(1);
  } else {
    console.log(`✓ SUCCESS: All ${results.length} images have unique SHA-256 hashes! Zero duplicates.`);
  }
}

run().catch(err => {
  console.error('Download script failed:', err);
  process.exit(1);
});
