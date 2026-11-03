# Smooth Cut Hair Studio1 — Premium White-Label Salon Engine
> Modern, accessible, mobile-first website for a men's hair salon in Tariq Colony, Kasur, Punjab, Pakistan. Built as a white-label template engine for rapid rebranding across local barbershops.

---

## 1. Project Overview & Architecture

This project is a high-performance, accessible, configuration-driven web application designed for **Smooth Cut Hair Studio1** (Shahbaz Khan Road, Tariq Colony, Kasur, Punjab, Pakistan).

Beyond serving as a client-ready showcase, the codebase is architected as a **reusable white-label template**. Launching or pitching a completely different salon requires editing configuration and asset files only—**zero component code changes**.

### Tech Stack
- **Framework**: React 19 + TypeScript (strict mode) with Vite 8
- **Styling**: Tailwind CSS v4 with custom CSS variables architecture
- **Icons**: Lucide React (individually imported for minimal tree-shaken bundle size)
- **Typography**: `Cormorant Garamond` (refined display serif) and `Plus Jakarta Sans` (body sans-serif), loaded via optimized Google Fonts with `font-display: swap`
- **Testing & QA**: Puppeteer, axe-core (WCAG 2.2 AA), Lighthouse Mobile, custom contrast calculator
- **Build-Time SEO**: Custom Vite plugin (`vitePluginSalonSeo`) injecting dynamic metadata, canonical links, Open Graph, Twitter cards, theme tokens, and schema.org `HairSalon` JSON-LD into `index.html` at build time.

---

## 2. Verified Business Data & Truthfulness Compliance

All default information conforms to verified real-world business listings:

| Fact Area | Verified Listing Value | Application Guardrail |
| :--- | :--- | :--- |
| **Business Name** | Smooth Cut Hair Studio1 | Injected directly from `identity.businessName`. |
| **Location** | Shahbaz Khan Road, near Dr Abuzar Clinic, Tariq Colony, Kasur, 55050, Pakistan | Displayed accurately across Hero, About, Footer, and Contact sections. |
| **Plus Code** | `4FC3+6F Kasur, Pakistan` | Google Maps directions link formatted directly from Plus Code. |
| **Contact Phone** | `+92 303 4316954` | All `tel:` links call `tel:+923034316954`. |
| **WhatsApp** | `923034316954` | Click-to-chat links formatted via `wa.me/923034316954`. |
| **Google Rating** | 5.0 / 5 from 6 Google reviews | Rendered with an editable "as of" note. No fake quotes or fictional reviewer profiles. |
| **Operating Hours** | Listed closing time: 11:30 PM (Opening time unknown) | Displayed as *"Open until 11:30 PM (as listed on Google)"*. 11:00 AM opening time is a clearly marked editable placeholder. |
| **Services** | Men's Haircuts & Beard Trimming | Only verified services shown normally. All other sample services carry a visible *"Sample service"* badge. |
| **Pricing** | Review mention: Rs. 500-1,000 | Config flag `pricesAreVerified: false` displays a visible *"Demo price"* badge and footnote on all prices. |
| **Photography** | No real salon photos exist | 14 curated high-resolution Unsplash photos. Gallery displays a clear disclosure: *"Images are illustrative stock photography, not the salon's own work."* Full licenses in `ATTRIBUTION.md`. |
| **Booking** | No backend database exists | Client-side WhatsApp request builder. Honest wording: *"Request an appointment via WhatsApp"*. Never falsely claims confirmed bookings. |

---

## 3. Quick Start & NPM Scripts

### Prerequisites
- Node.js 18+ (tested on Node v24.11.1)
- npm 9+ (tested on npm 11.6.2)

### Installation
```bash
# Clone or navigate to the workspace
cd hairSaloons

# Install dependencies
npm install
```

### Available Scripts
- `npm run dev`: Launch local Vite development server with Hot Module Replacement (HMR).
- `npm run build`: Type-check (`tsc -b`) and produce an optimized production build in `/dist`.
- `npm run preview`: Serve the production build locally.
- `npm run check:contrast`: Run the WCAG 2.2 AA contrast calculation suite on all theme color pairings.
- `npm run test:verify`: Run the Puppeteer browser test suite (9 viewports, zero overflow, forms, WhatsApp links, lightbox, mobile drawer, axe-core).
- `npm run test:salon-switch`: Verify white-label switching between salon profiles without component edits.

---

## 4. Rebranding Guide (30-Minute Step-by-Step Checklist)

To rebrand this website for pitching another salon owner in Kasur or elsewhere:

### Step 1: Duplicate the Template
In `/src/config/salons/`, copy `template-salon.ts`:
```bash
cp src/config/salons/template-salon.ts src/config/salons/royal-cut-salon.ts
```

### Step 2: Edit Business Information
Open your new file and edit the typed fields:
```typescript
export const royalCutSalon: SalonConfig = {
  id: 'royal-cut-salon',
  identity: {
    businessName: 'Royal Cut Studio',
    shortName: 'Royal Cut',
    category: "Men's Barber Lounge",
    tagline: 'Modern Barbering on Railway Road',
    // ...
  },
  contact: {
    phoneDisplay: '+92 300 9876543',
    phoneTel: '+923009876543',
    whatsappDigits: '923009876543', // 12 digits for wa.me
    addressLines: ['Railway Road', 'Near City Chowk'],
    city: 'Kasur',
    province: 'Punjab',
    postalCode: '55050',
    country: 'Pakistan',
    plusCode: '4FC2+7H Kasur, Pakistan',
    googleMapsDirectionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=4FC2%2B7H+Kasur%2C+Pakistan',
  },
  // ...
};
```

### Step 3: Configure Operating Hours & Mode
Choose between `closingOnly` mode or `fullSchedule` mode:
```typescript
hours: {
  mode: 'fullSchedule', // or 'closingOnly'
  closingTimeDisplay: '10:00 PM',
  placeholderOpeningTime: '10:00 AM',
  slotIntervalMinutes: 30,
  scheduleNotice: 'Open Monday through Sunday from 10:00 AM to 10:00 PM.',
  weeklySchedule: {
    monday: '10:00 AM - 10:00 PM',
    // ...
  }
}
```

### Step 4: Toggle Verification & Feature Flags
```typescript
features: {
  showTeam: false,               // Set true once staff profiles exist
  showPricing: true,
  showGallery: true,
  showReviews: true,
  showUnverifiedServices: true,
  showStockNotice: false,        // Set false when using genuine salon photography
  pricesAreVerified: true,       // Set true to remove the "Demo price" badges
}
```

### Step 5: Activate the Salon Profile
In `/src/config/index.ts`, register and set your active salon:
```typescript
import { royalCutSalon } from './salons/royal-cut-salon';

export const DEFAULT_SALON_ID = 'royal-cut-salon';
```
Or run the build with an environment variable:
```bash
VITE_ACTIVE_SALON=royal-cut-salon npm run build
```

---

## 5. Google Maps Listing & Verification Procedure

Because no verified Google Business Profile link was supplied:
1. **Directions Link**: The website generates standard Google Maps navigation links targeting the verified Plus Code:
   `https://www.google.com/maps/dir/?api=1&destination=4FC3%2B6F+Kasur%2C+Pakistan`
2. **Owner Pin Check Step**:
   - Open the link on an Android or iOS smartphone with GPS enabled.
   - Confirm that Google Maps places the pin directly in Tariq Colony, Shahbaz Khan Road.
   - If the pin needs refinement, replace with the verified coordinates or full address search URL in `src/config/salons/smooth-cut-hair-studio.ts`.
3. **Adding a Verified Listing URL**:
   - When the salon owner claims or creates their official Google Business Profile, copy their short share URL (e.g. `https://maps.app.goo.gl/...`).
   - Paste it into `contact.googleMapsListingUrl`.
   - The *"View on Google"* button in the Reviews section will automatically appear!

---

## 6. How to Replace Stock Images with Real Salon Photos

1. Capture crisp, well-lit photos of the salon interior, workstations, sanitized tools, and client cuts.
2. Optimize them as WebP images (recommended dimensions: 1200x800px, quality 80-85%).
3. Place your photos in `/public/images/`.
4. Update the image paths in your salon profile (`/src/config/salons/smooth-cut-hair-studio.ts`).
5. Set `features.showStockNotice: false` to remove the illustrative photo disclaimer badge.

---

## 7. Known Limitations & Upgrade Paths

1. **No Backend Database**:
   - **Current Implementation**: Bookings and contact forms prepare a pre-filled, URL-encoded WhatsApp message opened via the official `https://wa.me/` API, plus a visible on-page confirmation state with a fallback button.
   - **Upgrade Path**: To add automatic server-side email notifications or calendar booking, attach a serverless function (e.g. Netlify Functions, Cloudflare Workers) connecting to Resend, SendGrid, or Google Calendar API.
2. **Opening Hours**:
   - **Current Implementation**: Only the 11:30 PM closing time was listed on Google. The 11:00 AM opening time is configured as an editable placeholder.
   - **Upgrade Path**: Ask the owner for exact weekly opening hours, switch `hours.mode: "fullSchedule"` in config, and enter the daily hours.

---

## 8. Static Hosting Deployment

The `/dist` directory is 100% static and ready to host anywhere:

### Netlify
1. Connect repository.
2. Build command: `npm run build`
3. Publish directory: `dist`

### Vercel
1. Import repository.
2. Framework preset: `Vite`
3. Output directory: `dist`

### GitHub Pages
Configure GitHub Actions to deploy the `dist` directory on push to `main`.
